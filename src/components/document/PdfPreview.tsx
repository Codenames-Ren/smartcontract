import { useEffect, useState } from "react";
import { Download, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { BrutalButton, BrutalCard, LoadingState } from "@/components/common/Brutal";
import { documentService } from "@/services/documents";

export function PdfPreview({ hash, fileName }: { hash: string; fileName?: string | undefined }) {
  const [url, setUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUrl(null);
    setOpen(false);
  }, [hash]);

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  const load = async () => {
    if (url) return url;
    setLoading(true);
    try {
      const blob = await documentService.fileBlob(hash);
      const objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
      return objectUrl;
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrutalCard title="PDF Document" accent="primary">
      <div className="flex flex-wrap gap-3">
        <BrutalButton
          loading={loading}
          onClick={async () => {
            try {
              if (open) return setOpen(false);
              await load();
              setOpen(true);
            } catch {
              toast.error("Failed to load PDF");
            }
          }}
        >
          {open ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          {open ? "Hide PDF" : "Preview PDF"}
        </BrutalButton>
        <BrutalButton
          variant="neutral"
          onClick={async () => {
            try {
              const objectUrl = await load();
              const a = document.createElement("a");
              a.href = objectUrl;
              a.download = fileName || `${hash.slice(0, 16)}.pdf`;
              a.click();
              toast.success("Download started");
            } catch {
              toast.error("Failed to download PDF");
            }
          }}
        >
          <Download className="size-4" />
          Download PDF
        </BrutalButton>
      </div>

      {loading && !url ? <LoadingState text="Fetching document" /> : null}

      {open && url ? (
        <div className="brutal-sm mt-4 overflow-hidden rounded-md bg-muted">
          <iframe src={url} title="PDF preview" className="h-[70vh] w-full" />
        </div>
      ) : null}
    </BrutalCard>
  );
}
