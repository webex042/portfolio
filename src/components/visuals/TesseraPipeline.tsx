import { Lock } from "lucide-react";

const STAGES = [
  { title: "Screen context", detail: "focus and title events" },
  { title: "Capture pipeline", detail: "UIA, then OCR, then VLM crop" },
  { title: "PII redaction", detail: "checksum-validated detectors" },
  { title: "Encrypted storage", detail: "SQLCipher, AES-256" },
  { title: "Local retrieval", detail: "BM25 + vectors, fused" },
  { title: "Isolated LLM", detail: "llama.cpp in a Job Object" },
  { title: "Validated answer", detail: "schema and evidence checks" },
];

/**
 * Tessera's data path as a recruiter-readable strip. Two things are encoded:
 * the blue rule after redaction (no raw secrets beyond it) and the dashed
 * outline on the model (it runs in a separate, killable process).
 */
export function TesseraPipeline({ size = "card" }: { size?: "card" | "full" }) {
  const full = size === "full";
  return (
    <div className="drafting-grid relative rounded-md border border-rule bg-surface p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[0.9375rem] font-[600] [font-stretch:108%]">Everything runs on the PC</p>
        <p className="meta">loopback only, network limited to approved model downloads</p>
      </div>

      <ol className="relative grid grid-cols-1 gap-2 lg:grid-cols-7 lg:gap-0" aria-label="Tessera data pipeline">
        {STAGES.map((s, i) => {
          const isRedaction = i === 2;
          const isModel = i === 5;
          const isOut = i === 6;
          return (
            <li key={s.title} className="relative flex lg:flex-col">
              <div
                className={`relative flex flex-1 items-start gap-3 rounded-[5px] px-3 py-3 lg:mx-1.5 lg:min-h-[8.25rem] lg:flex-col lg:gap-2 ${
                  isOut
                    ? "bg-cobalt text-on-cobalt"
                    : isModel
                      ? "border border-dashed border-ink bg-paper"
                      : "border border-rule-strong bg-paper"
                }`}
              >
                <span className={`meta tabular !text-[0.75rem] ${isOut ? "!text-on-cobalt/80" : ""}`}>{i + 1}</span>
                <span className="flex flex-col gap-1">
                  <span className="flex items-center gap-1.5 text-[0.9375rem] font-[620] leading-tight [font-stretch:106%]">
                    {i === 3 ? <Lock size={13} strokeWidth={2} aria-hidden /> : null}
                    {s.title}
                  </span>
                  <span className={`font-mono text-[0.75rem] leading-snug ${isOut ? "text-on-cobalt/85" : "text-ink-3"}`}>{s.detail}</span>
                </span>
              </div>
              {isRedaction ? (
                <span
                  aria-hidden
                  className="absolute -right-px bottom-0 top-0 hidden w-[2px] bg-cobalt lg:block"
                  style={{ top: "-0.75rem", bottom: "-0.75rem" }}
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      <ul className={`mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 ${full ? "" : ""}`}>
        <li className="meta flex items-center gap-2">
          <span aria-hidden className="inline-block h-3.5 w-[2px] bg-cobalt" />
          after redaction, no raw secrets reach storage, embeddings or the model
        </li>
        <li className="meta flex items-center gap-2">
          <span aria-hidden className="inline-block size-3.5 rounded-[3px] border border-dashed border-ink" />
          separate process, killed with the app
        </li>
      </ul>
    </div>
  );
}
