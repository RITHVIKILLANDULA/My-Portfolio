import Scene from "./components/world/Scene";
import SectionOverlays from "./components/world/SectionOverlays";
import AISystemBoot from "./components/world/AISystemBoot";
import useLenis from "./hooks/useLenis";

export default function ImmersiveExperience() {
  useLenis(true);
  return (
    <>
      <Scene />
      <SectionOverlays />
      <AISystemBoot />
      {/* tall spacer gives Lenis its scroll range; the world reacts to scroll */}
      <div style={{ height: "700vh" }} aria-hidden />
    </>
  );
}
