import Image from "next/image";

type Props = {
  src: string;
  width: number;
  height: number;
  alt: string;
  url: string;
  sizes?: string;
  priority?: boolean;
  dark?: boolean;
};

/** A real screenshot in a minimal browser frame, labelled with its address. */
export function ScreenshotFrame({ src, width, height, alt, url, sizes = "(min-width: 1024px) 50vw, 100vw", priority, dark }: Props) {
  return (
    <div className={`overflow-hidden rounded-md border ${dark ? "border-[#2a2d33] bg-[#0d0e10]" : "border-rule-strong bg-surface"}`}>
      <div className={`flex items-center gap-3 border-b px-3 py-2 ${dark ? "border-[#2a2d33]" : "border-rule"}`}>
        <span aria-hidden className="flex gap-1.5">
          <span className={`size-2.5 rounded-full ${dark ? "bg-[#3a3d44]" : "bg-rule-strong"}`} />
          <span className={`size-2.5 rounded-full ${dark ? "bg-[#3a3d44]" : "bg-rule-strong"}`} />
          <span className={`size-2.5 rounded-full ${dark ? "bg-[#3a3d44]" : "bg-rule-strong"}`} />
        </span>
        <span className={`truncate font-mono text-[0.75rem] ${dark ? "text-[#9aa0a8]" : "text-ink-3"}`}>{url}</span>
      </div>
      <Image src={src} width={width} height={height} alt={alt} sizes={sizes} priority={priority} className="block h-auto w-full" />
    </div>
  );
}
