/** Wireframe of AI Study Lab's three-panel workspace. A schematic, not a screenshot. */
export function StudyLabSchematic() {
  return (
    <div className="rounded-md border border-rule bg-surface p-4" role="img" aria-label="Schematic of the AI Study Lab workspace: sources on the left, the cited tutor chat in the middle, and the Studio tools on the right.">
      <div aria-hidden className="grid grid-cols-[1fr_1.6fr_1fr] gap-2 text-[0.6875rem]">
        <div className="flex flex-col gap-1.5 rounded-[4px] border border-rule-strong bg-paper p-2">
          <span className="font-[620] text-ink">Sources</span>
          {["Lecture 4 (video)", "Slides.pdf", "Notes"].map((s, i) => (
            <span key={s} className="flex items-center gap-1.5 font-mono text-ink-3">
              <span className={`size-2 rounded-[2px] border ${i < 2 ? "border-cobalt bg-cobalt" : "border-ink-3"}`} />
              {s}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 rounded-[4px] border border-ink bg-paper p-2">
          <span className="font-[620] text-ink">Tutor</span>
          <span className="h-1.5 w-11/12 rounded bg-sunken" />
          <span className="h-1.5 w-9/12 rounded bg-sunken" />
          <span className="flex items-center gap-1 font-mono text-ink-3">
            answer from sources
            <span className="rounded-[2px] bg-cobalt-wash px-1 text-cobalt">[1]</span>
            <span className="rounded-[2px] bg-cobalt-wash px-1 text-cobalt">12:40</span>
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-[4px] border border-rule-strong bg-paper p-2">
          <span className="font-[620] text-ink">Studio</span>
          {["Notes", "Flashcards", "Quiz", "Mind map"].map((s) => (
            <span key={s} className="font-mono text-ink-3">{s}</span>
          ))}
        </div>
      </div>
      <p className="meta mt-3">Layout schematic</p>
    </div>
  );
}
