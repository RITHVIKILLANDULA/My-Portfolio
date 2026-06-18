/**
 * Zero-GPU backdrop: the soft drifting indigo glows + dotgrid. Used when WebGL
 * is unavailable, the Canvas errors, or as the visual base behind everything.
 */
export default function CanvasFallback() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="drift-a absolute -left-[10%] top-[6%] h-[58vh] w-[58vh] rounded-full bg-[radial-gradient(circle,rgba(124,120,240,0.18),transparent_68%)] blur-2xl" />
      <div className="drift-b absolute right-[2%] top-[34%] h-[48vh] w-[48vh] rounded-full bg-[radial-gradient(circle,rgba(108,104,232,0.12),transparent_70%)] blur-2xl" />
      <div className="dotgrid absolute inset-0 opacity-[0.3]" />
    </div>
  );
}
