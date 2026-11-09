import type { Project } from "@/data/portfolio";
import { TesseraPipeline } from "./TesseraPipeline";
import { EpmChart } from "./EpmChart";
import { ScreenshotFrame } from "./ScreenshotFrame";
import { PhaFlow } from "./PhaFlow";
import { StudyLabSchematic } from "./StudyLabSchematic";
import { FigurePlate } from "./FigurePlate";

/** Each project gets a visual drawn from its own material. */
export function ProjectVisual({ project, size = "card" }: { project: Project; size?: "card" | "full" }) {
  const g = project.gallery;
  switch (project.visual) {
    case "tessera":
      return <TesseraPipeline size={size} />;
    case "epm":
      return <EpmChart compact={size === "card"} />;
    case "psyprep":
      return <ScreenshotFrame {...g[0]} url="psyprep-rust.vercel.app" sizes="(min-width: 1024px) 56vw, 100vw" />;
    case "deepforge":
      return <ScreenshotFrame {...g[0]} url="landmark-route-visualizer.vercel.app" dark sizes="(min-width: 1024px) 56vw, 100vw" />;
    case "coffee":
      return <FigurePlate {...g[0]} caption={undefined} label="simulated data" sizes="(min-width: 1024px) 40vw, 100vw" />;
    case "pha":
      return <PhaFlow />;
    case "studylab":
      return <StudyLabSchematic />;
  }
}
