import { useEffect, useState } from "react";
import { pickExperience } from "./state/perf";
import GuidedExperience from "./GuidedExperience";
import ClassicSite from "./ClassicSite";

export default function App() {
  const [mode, setMode] = useState(() => pickExperience());
  // re-evaluate once after layout settles (corrects a cold-load 0-width read)
  useEffect(() => {
    setMode(pickExperience());
  }, []);
  return mode === "immersive" ? <GuidedExperience /> : <ClassicSite />;
}
