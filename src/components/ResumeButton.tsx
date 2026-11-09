import { Download, Mail } from "lucide-react";
import { profile } from "@/data/portfolio";

type Props = { href: string | null; variant?: "primary" | "ink" | "line"; size?: "sm" | "md"; className?: string; onClick?: () => void };

const requestHref = `mailto:${profile.email}?subject=${encodeURIComponent("Resume request")}&body=${encodeURIComponent(
  "Hi Pranshu,\n\nCould you send me a copy of your resume?\n\nThanks,\n",
)}`;

/**
 * Downloads the resume when the PDF ships with the site. Without the file it
 * becomes an honest "Request resume" email instead of a broken link.
 */
export function ResumeButton({ href, variant = "line", size = "md", className = "", onClick }: Props) {
  const cls = `btn btn-${variant} ${size === "sm" ? "btn-sm" : ""} ${className}`;
  if (href) {
    return (
      <a href={href} download className={cls} onClick={onClick}>
        <Download size={16} strokeWidth={1.75} aria-hidden />
        {size === "sm" ? "Resume" : "Download resume"}
      </a>
    );
  }
  return (
    <a href={requestHref} className={cls} onClick={onClick}>
      <Mail size={16} strokeWidth={1.75} aria-hidden />
      Request resume
    </a>
  );
}
