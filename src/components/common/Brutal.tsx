import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { Loader2, AlertTriangle, Inbox, Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function BrutalCard({
  children,
  className,
  title,
  accent,
}: {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  accent?: "primary" | "accent" | "success" | "destructive";
}) {
  return (
    <section className={cn("brutal rounded-md bg-card", className)}>
      {title ? (
        <header
          className={cn(
            "flex items-center gap-2 border-b-[3px] border-border px-4 py-2.5",
            accent === "success" && "bg-success text-success-foreground",
            accent === "destructive" && "bg-destructive text-destructive-foreground",
            accent === "accent" && "bg-accent text-accent-foreground",
            (!accent || accent === "primary") && "bg-primary text-primary-foreground",
          )}
        >
          <h3 className="text-sm font-black uppercase tracking-widest">{title}</h3>
        </header>
      ) : null}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "neutral" | "danger" | "ghost";
  loading?: boolean;
};

export function BrutalButton({
  className,
  variant = "primary",
  loading,
  children,
  disabled,
  ...props
}: BtnProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "brutal-sm brutal-press inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-widest disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-primary text-primary-foreground",
        variant === "neutral" && "bg-card text-card-foreground",
        variant === "danger" && "bg-destructive text-destructive-foreground",
        variant === "ghost" && "border-transparent bg-transparent shadow-none",
        className,
      )}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

export function BrutalInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "brutal-sm w-full rounded-md bg-input px-3 py-2.5 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-4 focus:ring-ring/40",
        className,
      )}
    />
  );
}

export function BrutalBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "danger" | "primary" | "warning";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "brutal-sm inline-flex items-center gap-1.5 rounded-md px-3 py-1 font-mono text-[11px] font-black uppercase tracking-widest",
        tone === "neutral" && "bg-muted text-foreground",
        tone === "success" && "bg-success text-success-foreground",
        tone === "danger" && "bg-destructive text-destructive-foreground",
        tone === "primary" && "bg-primary text-primary-foreground",
        tone === "warning" && "bg-warning text-warning-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function CopyButton({ value, label = "hash" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Copy ${label}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          toast.success(`Copied ${label}`);
          setTimeout(() => setCopied(false), 1400);
        } catch {
          toast.error("Clipboard unavailable");
        }
      }}
      className="brutal-sm shrink-0 rounded-md bg-card p-1.5 transition-transform active:translate-x-[2px] active:translate-y-[2px]"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
}

export function DataRow({
  label,
  value,
  mono,
  copy,
}: {
  label: string;
  value?: ReactNode | undefined;
  mono?: boolean | undefined;
  copy?: string | undefined;
}) {
  return (
    <div className="flex flex-col gap-1 border-b-2 border-dashed border-border/40 py-2.5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="flex min-w-0 items-center gap-2">
        <span
          className={cn(
            "min-w-0 break-all text-sm font-semibold",
            mono && "font-mono text-xs",
          )}
        >
          {value ?? "—"}
        </span>
        {copy ? <CopyButton value={copy} label={label.toLowerCase()} /> : null}
      </span>
    </div>
  );
}

export function LoadingState({ text = "Working..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10">
      <div className="brutal size-12 animate-spin rounded-md bg-primary" />
      <p className="font-mono text-xs font-bold uppercase tracking-widest">{text}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="brutal-sm flex flex-col items-start gap-3 rounded-md bg-destructive/15 p-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="size-5 text-destructive" />
        <p className="font-mono text-xs font-black uppercase tracking-widest">Error</p>
      </div>
      <p className="break-words text-sm font-medium">{message}</p>
      {onRetry ? (
        <BrutalButton variant="neutral" onClick={onRetry}>
          Retry
        </BrutalButton>
      ) : null}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <div className="brutal-sm rounded-md bg-muted p-3">
        <Inbox className="size-6" />
      </div>
      <p className="max-w-xs font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {text}
      </p>
    </div>
  );
}
