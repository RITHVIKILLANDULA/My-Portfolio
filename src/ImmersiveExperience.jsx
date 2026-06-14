import Scene from "./components/world/Scene";
import SectionOverlays from "./components/world/SectionOverlays";
import DiegeticLoader from "./components/world/DiegeticLoader";
import useLenis from "./hooks/useLenis";

export default function ImmersiveExperience() {
  useLenis(true);
  return (
    <>
      <Scene />
      <SectionOverlays />
      <DiegeticLoader />
      {/* tall spacer gives Lenis its scroll range; the world reacts to scroll */}
      <div style={{ height: "700vh" }} aria-hidden />
    </>
  );
}
