"use client";

import { useId, useState } from "react";
import { profile } from "@/data/portfolio";

type Fields = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Enter your name.";
  if (!EMAIL.test(f.email.trim())) e.email = "Enter a valid email address, like name@example.com.";
  if (f.subject.trim().length < 3) e.subject = "Add a short subject.";
  if (f.message.trim().length < 20) e.message = "Write at least 20 characters so I know what it's about.";
  if (f.message.length > 4000) e.message = "Keep the message under 4,000 characters.";
  return e;
}

/**
 * There is no mail backend: on submit the form opens the visitor's own email
 * app with the message filled in, addressed to me. The button says exactly that.
 */
export function ContactForm() {
  const uid = useId();
  const [fields, setFields] = useState<Fields>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "opened">("idle");

  const set = (k: keyof Fields) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...fields, [k]: ev.target.value };
    setFields(next);
    if (touched[k]) setErrors(validate(next));
  };
  /* Flag a field on blur only once something was typed, so tabbing or
     clicking past an empty field never shifts the layout under the cursor.
     Submitting validates everything. */
  const blur = (k: keyof Fields) => () => {
    if (!fields[k].trim() && !touched[k]) return;
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(fields));
  };

  const submit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e = validate(fields);
    setErrors(e);
    setTouched({ name: true, email: true, subject: true, message: true });
    const first = (Object.keys(e) as (keyof Fields)[])[0];
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    const body = `${fields.message.trim()}\n\n— ${fields.name.trim()}\n${fields.email.trim()}`;
    const href = `mailto:${profile.email}?subject=${encodeURIComponent(fields.subject.trim())}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setStatus("opened");
  };

  const field = (k: keyof Fields, label: string, type: "text" | "email" | "textarea", autoComplete?: string) => {
    const id = `${uid}-${k}`;
    const err = touched[k] ? errors[k] : undefined;
    const base = `mt-1.5 block w-full rounded-md border bg-surface px-3.5 py-2.5 text-[1rem] text-ink placeholder:text-ink-3 transition-colors focus:border-cobalt focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cobalt ${
      err ? "border-missed" : "border-rule-strong hover:border-ink-3"
    }`;
    return (
      <div className={type === "textarea" ? "sm:col-span-2" : ""}>
        <label htmlFor={id} className="text-[0.9375rem] font-[560] text-ink">
          {label}
        </label>
        {type === "textarea" ? (
          <textarea id={id} name={k} rows={6} value={fields[k]} onChange={set(k)} onBlur={blur(k)} aria-invalid={Boolean(err)} aria-describedby={err ? `${id}-err` : undefined} className={`${base} resize-y`} />
        ) : (
          <input id={id} name={k} type={type} autoComplete={autoComplete} value={fields[k]} onChange={set(k)} onBlur={blur(k)} aria-invalid={Boolean(err)} aria-describedby={err ? `${id}-err` : undefined} className={base} />
        )}
        {err ? (
          <p id={`${id}-err`} className="mt-1.5 text-[0.875rem] text-missed">
            {err}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <form onSubmit={submit} noValidate className="grid grid-cols-1 gap-5 sm:grid-cols-2" aria-describedby={`${uid}-how`}>
      {field("name", "Your name", "text", "name")}
      {field("email", "Your email", "email", "email")}
      <div className="sm:col-span-2">{field("subject", "Subject", "text")}</div>
      {field("message", "Message", "textarea")}
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${uid}-how`} className="meta max-w-[42ch]">
          Opens your email app with this message addressed to {profile.email}. Nothing is stored on this site.
        </p>
        <button type="submit" className="btn btn-primary">
          Compose email
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {status === "opened" ? "Your email app should now be open with the message filled in." : ""}
      </p>
      {status === "opened" ? (
        <p className="rounded-md border border-rule bg-surface px-4 py-3 text-[0.9375rem] text-ink-2 sm:col-span-2">
          Your email app should now be open with the message filled in. If nothing happened, write to{" "}
          <a className="link" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>{" "}
          directly.
        </p>
      ) : null}
    </form>
  );
}
