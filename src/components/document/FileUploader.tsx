import { useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrutalButton } from "@/components/common/Brutal";

export function FileUploader({
  file,
  onChange,
  disabled,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onChange(f);
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "brutal-sm flex cursor-pointer flex-col items-center gap-3 rounded-md border-dashed bg-surface px-6 py-10 text-center transition-colors",
          over && "bg-primary/20",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        <div className="brutal-sm rounded-md bg-primary p-3 text-primary-foreground">
          <UploadCloud className="size-6" />
        </div>
        <p className="font-display text-base">Drop your document here</p>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          or click to browse · PDF only
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </div>

      {file ? (
        <div className="brutal-sm mt-4 flex items-center gap-3 rounded-md bg-card p-3">
          <div className="brutal-sm rounded-md bg-accent p-2 text-accent-foreground">
            <FileText className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{file.name}</p>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <BrutalButton
            variant="neutral"
            onClick={() => onChange(null)}
            aria-label="Remove file"
            className="px-2"
          >
            <X className="size-4" />
          </BrutalButton>
        </div>
      ) : null}
    </div>
  );
}
