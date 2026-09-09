"""Cut the studio backdrop out of the portrait.

The source is a bust on a smooth grey radial gradient. Rather than keying a
single colour (which eats the suit's shadow side and leaves a halo in the
hair), this models the backdrop as a smooth surface fitted from the border
pixels, then treats the per-pixel distance from that surface as coverage.

    python3 scripts/matte.py public/assets/portrait.png public/assets/portrait-cut.png

Output is a straight-alpha RGBA PNG, cropped to the subject's bounding box.
"""

import sys
import numpy as np
from PIL import Image, ImageFilter


def _basis(xs, ys, w, h):
    """Cubic polynomial basis — flexible enough for a studio vignette."""
    x = (xs / w).astype(np.float64).ravel()
    y = (ys / h).astype(np.float64).ravel()
    return np.stack([
        np.ones_like(x), x, y,
        x * x, y * y, x * y,
        x ** 3, y ** 3, x * x * y, x * y * y,
    ], 1)


def background_model(rgb, border=16, rounds=4):
    """Learn the backdrop as a smooth surface, then let it learn its own glow.

    A border-only fit is not enough: this backdrop carries a vignette that
    brightens right where the subject stands, and the residual there reads as
    "subject", leaving a grey halo hugging the shoulders. So the fit is run
    EM-style — fit, decide which pixels look like backdrop, refit including
    them — which absorbs the glow while the person stays far from the surface.
    """
    h, w, _ = rgb.shape
    ys, xs = np.mgrid[0:h, 0:w]
    G = _basis(xs, ys, w, h)
    flat = rgb.reshape(-1, 3).astype(np.float64)

    # seed: top band plus the side columns above the shoulders (real backdrop)
    seed = np.zeros((h, w), bool)
    seed[:border, :] = True
    upper = int(h * 0.45)
    seed[:upper, :border] = True
    seed[:upper, -border:] = True
    keep = seed.ravel()

    surface = None
    for i in range(rounds):
        coefs = [np.linalg.lstsq(G[keep], flat[keep, c], rcond=None)[0] for c in range(3)]
        surface = np.stack([G @ coefs[c] for c in range(3)], 1)
        resid = np.sqrt(((flat - surface) ** 2).sum(1))
        # loosen once, then tighten: absorb the glow, never absorb the subject
        cut = (70.0, 55.0, 45.0, 40.0)[min(i, 3)]
        keep = resid < cut
        keep |= seed.ravel()                     # the seed is always backdrop

    return surface.reshape(h, w, 3)


def largest_component(mask):
    """Keep only the biggest blob — drops speckle without touching the edge."""
    h, w = mask.shape
    label = np.zeros((h, w), np.int32)
    cur, sizes = 0, {}
    nbr = ((1, 0), (-1, 0), (0, 1), (0, -1))
    for sy in range(h):
        for sx in range(w):
            if not mask[sy, sx] or label[sy, sx]:
                continue
            cur += 1
            stack, n = [(sy, sx)], 0
            label[sy, sx] = cur
            while stack:
                y, x = stack.pop()
                n += 1
                for dy, dx in nbr:
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not label[ny, nx]:
                        label[ny, nx] = cur
                        stack.append((ny, nx))
            sizes[cur] = n
    if not sizes:
        return mask
    keep = max(sizes, key=sizes.get)
    return label == keep


def fill_holes(mask):
    """Flood the background in from the frame edge; anything unreached is inside."""
    h, w = mask.shape
    outside = np.zeros((h, w), bool)
    stack = []
    for x in range(w):
        for y in (0, h - 1):
            if not mask[y, x] and not outside[y, x]:
                outside[y, x] = True; stack.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if not mask[y, x] and not outside[y, x]:
                outside[y, x] = True; stack.append((y, x))
    while stack:
        y, x = stack.pop()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not mask[ny, nx] and not outside[ny, nx]:
                outside[ny, nx] = True; stack.append((ny, nx))
    return ~outside


def _morph(mask, size, op):
    f = ImageFilter.MaxFilter(size) if op == 'dilate' else ImageFilter.MinFilter(size)
    img = Image.fromarray((mask * 255).astype(np.uint8)).filter(f)
    return np.asarray(img) > 127


def main(src, dst):
    im = Image.open(src).convert('RGB')
    rgb = np.asarray(im).astype(np.float64)

    bg = background_model(rgb)
    dist = np.sqrt(((rgb - bg) ** 2).sum(2))

    # A hard core decides WHO the subject is. Distance alone can't: the backdrop
    # carries a vignette glow the quadratic won't model, and thresholding that
    # leaves a grey halo hugging the subject. So: take a confident core, then
    # only soften a narrow band around its boundary (that band is the hair).
    core = fill_holes(largest_component(dist > 40.0))

    inner = _morph(core, 7, 'erode')     # certainly subject
    outer = _morph(core, 9, 'dilate')    # everything beyond is certainly backdrop

    soft = np.clip((dist - 12.0) / 30.0, 0, 1)          # fractional coverage
    alpha = np.where(inner, 1.0, np.where(outer, soft, 0.0))

    a = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))
    alpha = np.asarray(a).astype(np.float64) / 255.0
    alpha = np.where(outer, alpha, 0.0)                  # blur must not leak outward
    alpha = np.maximum(alpha, inner.astype(np.float64))
    alpha = alpha * alpha * (3 - 2 * alpha)              # crisp up the mid-band

    # de-fringe: pull backdrop spill out of the partially covered edge pixels
    edge = (alpha > 0.02) & (alpha < 0.98)
    safe = np.maximum(alpha, 1e-3)[..., None]
    unspilled = np.clip((rgb - bg * (1 - safe)) / safe, 0, 255)
    rgb_out = np.where(edge[..., None], unspilled, rgb)

    img = Image.fromarray(np.dstack([rgb_out, alpha * 255]).astype(np.uint8), 'RGBA')
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    img.save(dst)
    print(f'{dst}  {img.size[0]}x{img.size[1]}  subject covers {(alpha > 0.5).mean()*100:.1f}% of source')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'public/assets/portrait.png',
         sys.argv[2] if len(sys.argv) > 2 else 'public/assets/portrait-cut.png')
