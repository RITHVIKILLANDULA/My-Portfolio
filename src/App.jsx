import { useEffect, useState } from "react";
import { pickExperience } from "./state/perf";
import ImmersiveExperience from "./ImmersiveExperience";
import ClassicSite from "./ClassicSite";

export default function App() {
  const [mode, setMode] = useState(() => pickExperience());
  // re-evaluate once after layout settles (corrects a cold-load 0-width read)
  useEffect(() => {
    setMode(pickExperience());
  }, []);
  return mode === "immersive" ? <ImmersiveExperience /> : <ClassicSite />;
}
