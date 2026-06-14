import { useEffect, useState } from "react";
import { pickExperience } from "./state/perf";
import ImmersiveSite from "./ImmersiveSite";

export default function App() {
  const [mode, setMode] = useState(() => pickExperience());
  useEffect(() => {
    setMode(pickExperience());
  }, []);
  // momentum scroll on desktop only
  return <ImmersiveSite smooth={mode === "immersive"} />;
}
