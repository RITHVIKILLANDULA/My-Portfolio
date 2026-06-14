import { useEffect, useRef, useState } from "react";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";

/**
 * Opt-in "8D" ambient pad. A soft chord routed through an HRTF panner that
 * slowly orbits the listener's head for a binaural, spatial feel.
 * Audio NEVER autoplays — it only starts on an explicit click.
 */
export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef(null);
  const nodesRef = useRef(null);
  const rafRef = useRef(0);

  const start = async () => {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    await ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.2);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.Q.value = 0.6;

    const panner = ctx.createPanner();
    panner.panningModel = "HRTF";
    panner.distanceModel = "inverse";
    panner.refDistance = 1;
    if (panner.positionY) panner.positionY.value = 0;
    else panner.setPosition(0, 0, 1);

    // soft A-minor-ish pad
    const freqs = [110, 164.81, 220, 277.18];
    const oscs = freqs.map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 ? "sine" : "triangle";
      o.frequency.value = f;
      o.detune.value = (i - 1.5) * 4;
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.5 : 0.28;
      o.connect(g).connect(filter);
      o.start();
      return o;
    });

    filter.connect(panner).connect(master).connect(ctx.destination);

    ctxRef.current = ctx;
    nodesRef.current = { master, panner, oscs };

    // orbit the sound around the head
    const t0 = performance.now();
    const orbit = (now) => {
      const t = (now - t0) / 1000;
      const x = Math.sin(t * 0.5) * 6;
      const z = Math.cos(t * 0.5) * 6;
      if (panner.positionX) {
        panner.positionX.value = x;
        panner.positionZ.value = z;
      } else {
        panner.setPosition(x, 0, z);
      }
      rafRef.current = requestAnimationFrame(orbit);
    };
    rafRef.current = requestAnimationFrame(orbit);
  };

  const stop = () => {
    cancelAnimationFrame(rafRef.current);
    const ctx = ctxRef.current;
    const nodes = nodesRef.current;
    if (ctx && nodes) {
      nodes.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      setTimeout(() => {
        try {
          nodes.oscs.forEach((o) => o.stop());
          ctx.close();
        } catch (e) {
          void e;
        }
      }, 700);
    }
    ctxRef.current = null;
    nodesRef.current = null;
  };

  useEffect(() => () => stop(), []);

  const toggle = () => {
    if (on) stop();
    else start();
    setOn(!on);
  };

  return (
    <button
      onClick={toggle}
      data-cursor
      aria-label={on ? "Mute ambient sound" : "Play 8D ambient sound"}
      title={on ? "Mute ambient" : "8D ambient sound"}
      className="glass glass-hover fixed bottom-5 right-5 z-[70] flex h-12 items-center gap-2 rounded-full px-4 text-sm text-neutral-200"
    >
      {on ? (
        <>
          <span className="flex items-end gap-[2px]" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="w-[2px] rounded-full bg-data-cyan"
                style={{
                  height: "14px",
                  animation: `eq 0.9s ${i * 0.12}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </span>
          <HiSpeakerWave className="text-data-cyan" />
        </>
      ) : (
        <>
          <HiSpeakerXMark className="text-neutral-400" />
          <span className="mono-label text-[0.6rem] text-neutral-400">8D</span>
        </>
      )}
      <style>{`@keyframes eq { from { height: 4px } to { height: 16px } }`}</style>
    </button>
  );
}
