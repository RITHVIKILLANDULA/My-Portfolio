/**
 * A single, quiet atmosphere behind the whole page so the scroll feels like
 * moving through one world rather than stacked white sections. Fixed + faint.
 */
export default function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="dotgrid absolute inset-0 opacity-40" />
      <div className="absolute -left-40 top-[20%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(108,104,232,0.06),transparent_70%)] blur-3xl" />
      <div className="absolute -right-48 top-[55%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.05),transparent_70%)] blur-3xl" />
      <div className="absolute left-1/3 top-[85%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.045),transparent_70%)] blur-3xl" />
    </div>
  );
}
