import { useState } from "react";
import { pickExperience } from "./state/perf";
import ImmersiveExperience from "./ImmersiveExperience";
import ClassicSite from "./ClassicSite";

export default function App() {
  const [mode] = useState(pickExperience);
  return mode === "immersive" ? <ImmersiveExperience /> : <ClassicSite />;
}
