/* Kept as the single place for app-wide providers. Motion is CSS-only and
   honours prefers-reduced-motion in globals.css, so nothing is needed yet. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
