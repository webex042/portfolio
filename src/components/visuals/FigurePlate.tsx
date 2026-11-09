import Image from "next/image";

type Props = { src: string; width: number; height: number; alt: string; caption?: string; sizes?: string; label?: string };

/**
 * Repository figures (matplotlib plots, thesis diagrams) are white-background
 * images, so they sit on a white plate in both themes rather than glaring.
 */
export function FigurePlate({ src, width, height, alt, caption, sizes = "(min-width: 1024px) 60vw, 100vw", label }: Props) {
  return (
    <figure>
      <div className="relative overflow-hidden rounded-md border border-rule bg-white p-3 sm:p-4">
        {label ? (
          <span className="absolute right-3 top-3 z-10 rounded-[3px] bg-[#191c21] px-2 py-0.5 font-mono text-[0.6875rem] text-white">{label}</span>
        ) : null}
        <Image src={src} width={width} height={height} alt={alt} sizes={sizes} className="block h-auto w-full" />
      </div>
      {caption ? <figcaption className="meta mt-2.5 text-pretty">{caption}</figcaption> : null}
    </figure>
  );
}
