import { useEffect, useRef, useState } from "react";
import Loader from "../components/site/Loader";
import StatusBar from "./StatusBar";
import ViewRail, { VIEWS } from "./ViewRail";
import OverviewView from "./OverviewView";
import CapabilitiesView from "./CapabilitiesView";
import RunsView from "./RunsView";
import LineageView from "./LineageView";
import ModelsView from "./ModelsView";
import ReachView from "./ReachView";
import CommandLine from "./CommandLine";

const RENDER = {
  overview: OverviewView,
  capabilities: CapabilitiesView,
  runs: RunsView,
  lineage: LineageView,
  models: ModelsView,
  reach: ReachView,
};

/**
 * The whole site as one running instrument: a persistent top status bar, a left
 * view rail, the active view, and a command line pinned to the bottom that
 * answers from anywhere. There is no "hero then sections" — there are views of
 * `service: rithvik-illandula`, currently healthy and running.
 */
export default function ConsoleShell() {
  const [view, setView] = useState("overview");
  const contentRef = useRef(null);
  const View = RENDER[view] || OverviewView;

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [view]);

  return (
    <div className="relative min-h-screen bg-canvas text-ink">
      <div className="dotgrid pointer-events-none fixed inset-0 opacity-[0.35]" />

      <a href="#console-main" className="skip-link">Skip to content</a>

      <div className="relative z-10 flex min-h-screen flex-col">
        <StatusBar />

        {/* mobile view tabs */}
        <div className="border-b border-line bg-canvas/70 px-4 py-1.5 backdrop-blur-md lg:hidden">
          <ViewRail active={view} onSelect={setView} />
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 sm:px-6 lg:gap-12">
          {/* desktop rail */}
          <aside className="hidden w-44 shrink-0 pt-10 lg:block">
            <div className="sticky top-20">
              <p className="mb-3 pl-3 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-ink-300">
                views
              </p>
              <ViewRail active={view} onSelect={setView} />
            </div>
          </aside>

          {/* active view */}
          <main
            id="console-main"
            ref={contentRef}
            className="min-w-0 flex-1 pb-44 pt-8 sm:pt-12"
          >
            <View />
          </main>
        </div>
      </div>

      <CommandLine />
      <Loader />
    </div>
  );
}
