type Props = {
  id: string;
  title: string;
  note?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Editorial section: the title sits in a left rail (sticky on wide screens)
 * and the content runs in the remaining nine columns.
 */
export function Section({ id, title, note, children, className = "" }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`border-t border-rule py-20 md:py-28 ${className}`}>
      <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <h2 id={`${id}-title`} className="heading text-[clamp(1.875rem,1.5rem+1.2vw,2.5rem)]">
              {title}
            </h2>
            {note ? <p className="meta mt-3 max-w-[30ch] text-pretty">{note}</p> : null}
          </div>
        </div>
        <div className="min-w-0 lg:col-span-9">{children}</div>
      </div>
    </section>
  );
}
