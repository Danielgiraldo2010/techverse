import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

interface FieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
  full?: boolean;
}

export function Field({ label, error, children, htmlFor, full }: FieldProps) {
  return (
    <div className={`field${full ? " full" : ""}`}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} />;
}