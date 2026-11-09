import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[60vh] flex-col justify-center py-24">
      <p className="meta">404</p>
      <h1 className="display mt-3 text-[clamp(2.5rem,1.6rem+4vw,5rem)]">This page doesn&rsquo;t exist.</h1>
      <p className="lead mt-5 max-w-[46ch]">The link may be old or mistyped. The project index lists everything on the site.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/projects" className="btn btn-primary">
          Open the project index
        </Link>
        <Link href="/" className="btn btn-line">
          Go to the home page
        </Link>
      </div>
    </section>
  );
}
