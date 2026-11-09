import { brandIcons, type BrandIconName } from "@/data/icons";

type Props = { name: BrandIconName; size?: number; className?: string; title?: string };

/** Monochrome brand glyph that inherits currentColor. Decorative unless titled. */
export function BrandIcon({ name, size = 16, className, title }: Props) {
  const icon = brandIcons[name];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path d={icon.path} />
    </svg>
  );
}
