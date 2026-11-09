"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, CornerDownLeft, FileText, FolderGit2, Hash, Mail, Search } from "lucide-react";

export type PaletteItem = {
  id: string;
  group: "Projects" | "Pages" | "Sections" | "Engineering log" | "Links";
  label: string;
  hint?: string;
  href: string;
  external?: boolean;
  keywords?: string;
};

const ICONS = { Projects: FolderGit2, Pages: FileText, Sections: Hash, "Engineering log": FileText, Links: ArrowUpRight };

export const OPEN_PALETTE_EVENT = "open-command-palette";

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

function score(item: PaletteItem, q: string) {
  if (!q) return 1;
  const hay = `${item.label} ${item.hint ?? ""} ${item.keywords ?? ""} ${item.group}`.toLowerCase();
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  let s = 0;
  for (const t of terms) {
    const i = hay.indexOf(t);
    if (i === -1) return 0;
    s += item.label.toLowerCase().startsWith(t) ? 3 : i < item.label.length ? 2 : 1;
  }
  return s;
}

/**
 * Ctrl+K / Cmd+K search across projects, pages, sections and notes. The
 * shortcut is ignored while typing in a form field, so it never steals a
 * keystroke from the contact form.
 */
export function CommandPalette({ items }: { items: PaletteItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const restore = useRef<HTMLElement | null>(null);
  const listId = "palette-list";

  const results = useMemo(
    () =>
      items
        .map((it) => ({ it, s: score(it, q.trim()) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((r) => r.it),
    [items, q],
  );

  const show = useCallback(() => {
    restore.current = document.activeElement as HTMLElement | null;
    setQ("");
    setActive(0);
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
    restore.current?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey) && !e.altKey) {
        if (!open && isTypingTarget(e.target)) return;
        e.preventDefault();
        if (open) hide();
        else show();
      }
    };
    const onOpen = () => show();
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, [open, show, hide]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => input.current?.focus());
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setActive(0), [q]);

  const go = (it: PaletteItem) => {
    setOpen(false);
    if (it.external) {
      window.open(it.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (it.href.startsWith("mailto:")) {
      window.location.href = it.href;
      return;
    }
    router.push(it.href);
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const it = results[active];
      if (it) go(it);
    } else if (e.key === "Escape") {
      e.preventDefault();
      hide();
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    document.getElementById(`palette-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  let lastGroup = "";
  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-ink/40 px-4 pt-[12vh] backdrop-blur-[2px]" onMouseDown={(e) => e.target === e.currentTarget && hide()}>
      <div role="dialog" aria-modal="true" aria-label="Search the site" className="w-full max-w-xl overflow-hidden rounded-lg border border-rule-strong bg-paper shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-3 border-b border-rule px-4">
          <Search size={18} strokeWidth={1.75} className="shrink-0 text-ink-3" aria-hidden />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search projects, pages and notes"
            className="h-14 w-full bg-transparent text-[1.0625rem] text-ink placeholder:text-ink-3 focus:outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? `palette-opt-${active}` : undefined}
            aria-autocomplete="list"
          />
          <kbd className="meta hidden rounded border border-rule px-1.5 py-0.5 !text-[0.6875rem] sm:inline">Esc</kbd>
        </div>
        <ul id={listId} role="listbox" aria-label="Results" className="max-h-[min(60vh,26rem)] overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-[0.9375rem] text-ink-3">
              No matches for &ldquo;{q}&rdquo;. Try a project name or a topic like &ldquo;security&rdquo;.
            </li>
          ) : (
            results.map((it, i) => {
              const Icon = it.href.startsWith("mailto:") ? Mail : ICONS[it.group];
              const header = it.group !== lastGroup ? it.group : null;
              lastGroup = it.group;
              return (
                <li key={it.id} role="presentation">
                  {header ? <p className="meta px-3 pb-1 pt-3 !text-[0.75rem]">{header}</p> : null}
                  <div
                    id={`palette-opt-${i}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseMove={() => setActive(i)}
                    onClick={() => go(it)}
                    className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 ${i === active ? "bg-cobalt-wash" : ""}`}
                  >
                    <Icon size={16} strokeWidth={1.75} className={i === active ? "text-cobalt" : "text-ink-3"} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.96875rem] text-ink">{it.label}</span>
                      {it.hint ? <span className="block truncate text-[0.8125rem] text-ink-3">{it.hint}</span> : null}
                    </span>
                    {i === active ? <CornerDownLeft size={14} className="text-ink-3" aria-hidden /> : null}
                  </div>
                </li>
              );
            })
          )}
        </ul>
        <div className="flex items-center gap-4 border-t border-rule px-4 py-2.5">
          <span className="meta !text-[0.75rem]">↑ ↓ to move, Enter to open</span>
        </div>
      </div>
    </div>
  );
}
