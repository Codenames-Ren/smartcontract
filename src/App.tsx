import { useEffect, useState } from "react";
import {
  ArrowDown, ArrowRight, Blocks, FileSearch, FileText, Hash, Info, ScanLine, ShieldCheck, ShieldX, Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  BrutalBadge, BrutalButton, BrutalCard, BrutalInput, DataRow, EmptyState, ErrorState, LoadingState,
} from "@/components/common/Brutal";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { FileUploader } from "@/components/document/FileUploader";
import { BlockchainInfo, DocumentStatus, MetadataCard } from "@/components/document/DocumentCards";
import { PdfPreview } from "@/components/document/PdfPreview";
import { documentService, type DocumentRecord, type VerifyResult } from "@/services/documents";
import { API_BASE_URL } from "@/config/api";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "home", label: "Overview", icon: Info },
  { id: "register", label: "Register", icon: FileText },
  { id: "verify", label: "Verify", icon: ShieldCheck },
  { id: "detail", label: "Detail", icon: FileSearch },
  { id: "revoke", label: "Revoke", icon: Trash2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

const FLOW = [
  { label: "Upload Document", icon: FileText },
  { label: "Document Registration", icon: Info },
  { label: "Secure Record Creation", icon: ShieldCheck },
  { label: "Authenticity Protection", icon: Blocks },
  { label: "Document Verification", icon: FileSearch },
];

const STACK = ["React Vite", "Elysia.js", "Solidity", "PostgreSQL", "Prisma", "SHA256"];

function errMsg(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected error";
}

export default function App() {
  const [tab, setTab] = useState<TabId>("home");
  const [detailHash, setDetailHash] = useState("");

  const openDetail = (hash: string) => {
    setDetailHash(hash);
    setTab("detail");
  };

  return (
    <div className="grid-paper flex min-h-screen flex-col bg-background">
      <header className="border-b-[3px] border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="brutal-sm rounded-md bg-primary p-2 text-primary-foreground">
              <Blocks className="size-6" />
            </div>
            <div>
              <p className="font-display text-lg leading-tight sm:text-xl">Smart Contract</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Check Document Validation with Blockchain Integration
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BackendStatus />
            <ThemeToggle />
          </div>
        </div>

        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-4">
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "brutal-sm brutal-press flex shrink-0 items-center gap-2 rounded-md px-3.5 py-2 font-mono text-[11px] font-black uppercase tracking-widest",
                  active ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {tab === "home" ? <HomeSection /> : null}
        {tab === "register" ? <RegisterSection onOpenDetail={openDetail} /> : null}
        {tab === "verify" ? <VerifySection /> : null}
        {tab === "detail" ? <DetailSection hash={detailHash} setHash={setDetailHash} /> : null}
        {tab === "revoke" ? <RevokeSection onOpenDetail={openDetail} /> : null}
      </main>

      <footer className="border-t-[3px] border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <p className="text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            &copy; Bayu Sukma · Smart Contract · Made with ❤️ using elysia.js
          </p>
        </div>
      </footer>
    </div>
  );
}

function BackendStatus() {
  const [state, setState] = useState<"checking" | "online" | "offline">("checking");

  const check = () => {
    setState("checking");
    documentService.health().then(() => setState("online")).catch(() => setState("offline"));
  };

  useEffect(() => { check(); }, []);

  return (
    <button type="button" onClick={check} title="Re-check backend">
      <BrutalBadge tone={state === "online" ? "success" : state === "offline" ? "danger" : "warning"}>
        <span className={cn("size-2 rounded-full bg-current", state === "checking" && "animate-pulse")} />
        {state === "online" ? "Server Online" : state === "offline" ? "Server Offline" : "Checking"}
      </BrutalBadge>
    </button>
  );
}

function HomeSection() {
  return (
    <div className="space-y-6">
      <div className="brutal-lg rounded-md bg-card p-6 sm:p-10">
        <BrutalBadge tone="primary">Smart Contract Powered</BrutalBadge>
        <h1 className="mt-4 text-3xl leading-tight sm:text-5xl">Blockchain Document Registry</h1>
        <p className="mt-4 max-w-2xl text-base font-medium text-muted-foreground sm:text-lg">
          Document authenticity verification system.
        </p>
      </div>

      <BrutalCard title="System Flow" accent="accent">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
          {FLOW.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex flex-col items-center gap-2 lg:min-w-0 lg:flex-1 lg:flex-row lg:items-stretch">
                <div className="brutal-sm flex w-full items-center gap-3 rounded-md bg-surface p-3 lg:h-full lg:flex-col lg:justify-center lg:text-center">
                  <div className="brutal-sm rounded-md bg-primary p-2 text-primary-foreground">
                    <Icon className="size-4" />
                  </div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-widest">{step.label}</span>
                </div>
                {index < FLOW.length - 1 ? (
                  <>
                    <ArrowDown className="size-5 shrink-0 self-center text-muted-foreground lg:hidden" />
                    <ArrowRight className="hidden size-5 shrink-0 text-muted-foreground lg:block" />
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </BrutalCard>

      <div className="grid gap-6 md:grid-cols-2">
        <BrutalCard title="Technology Stack">
          <div className="flex flex-wrap gap-2">
            {STACK.map((item) => (
              <BrutalBadge key={item} tone="neutral">{item}</BrutalBadge>
            ))}
          </div>
        </BrutalCard>

        <BrutalCard title="How It Works">
          <ul className="space-y-2 text-sm font-medium">
          <li>1. Upload your document to start the verification process.</li>
          <li>2. The system automatically checks important information from the document.</li>
          <li>3. Your document receives a unique identity to protect its authenticity.</li>
          <li>4. Registered documents can be verified anytime through the system.</li>
          <li>5. Document status can be updated when it is no longer considered valid.</li>
          </ul>
        </BrutalCard>
      </div>
    </div>
  );
}

function RegisterSection({ onOpenDetail }: { onOpenDetail: (hash: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DocumentRecord | null>(null);

  const submit = async () => {
    if (!file) {
      toast.error("Select a PDF first");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await documentService.register(file);
      setResult(data);
      toast.success("Document registered on-chain");
    } catch (error) {
      const message = errMsg(error);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <BrutalCard title="Register Document">
        <FileUploader file={file} onChange={setFile} disabled={loading} />
        <div className="mt-4 flex gap-3">
          <BrutalButton onClick={submit} loading={loading} disabled={!file}>
            Register Document
          </BrutalButton>
        </div>
        {/* <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          POST /documents/register
        </p> */}
      </BrutalCard>

      <div className="space-y-6">
        {loading ? (
          <BrutalCard title="Processing"><LoadingState text="Hashing & broadcasting" /></BrutalCard>
        ) : null}

        {error ? (
          <BrutalCard title="Registration Failed" accent="destructive">
            <ErrorState message={error} onRetry={submit} />
          </BrutalCard>
        ) : null}

        {!loading && !error && !result ? (
          <BrutalCard title="Result">
            <EmptyState text="No document registered yet. Upload a document to begin." />
          </BrutalCard>
        ) : null}

        {result ? (
          <>
            <MetadataCard
              studentName={result.studentName}
              studentNim={result.studentNim}
              certificateNumber={result.certificateNumber}
              fileName={result.fileName}
              title="Registration Success"
            />
            <BlockchainInfo doc={result} />
            <BrutalButton variant="neutral" onClick={() => onOpenDetail(result.hash)}>
              Open Document Detail
            </BrutalButton>
          </>
        ) : null}
      </div>
    </div>
  );
}

function VerifySection() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyResult | null>(null);

  const submit = async () => {
    if (!file) {
      toast.error("Select a PDF first");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await documentService.verify(file);
      setResult(data);

      if (data.valid) {
        toast.success("Document is valid");
      } else {
        toast.error("Document is invalid");
      }
    } catch (error) {
      const message = errMsg(error);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <BrutalCard title="Verify Document">
        <FileUploader file={file} onChange={setFile} disabled={loading} />
        <div className="mt-4">
          <BrutalButton onClick={submit} loading={loading} disabled={!file}>
            Verify Document
          </BrutalButton>
        </div>
        {/* <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          POST /documents/verify
        </p> */}
      </BrutalCard>

      <div className="space-y-6">
        {loading ? (
          <BrutalCard title="Processing"><LoadingState text="Comparing on-chain hash" /></BrutalCard>
        ) : null}

        {error ? (
          <BrutalCard title="Verification Failed" accent="destructive">
            <ErrorState message={error} onRetry={submit} />
          </BrutalCard>
        ) : null}

        {!loading && !error && !result ? (
          <BrutalCard title="Result">
            <EmptyState text="Upload a document to check its authenticity." />
          </BrutalCard>
        ) : null}

        {result ? (
          <>
            <div
              className={cn(
                "brutal flex items-center gap-4 rounded-md p-5",
                result.valid ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground",
              )}
            >
              {result.valid ? <ShieldCheck className="size-9" /> : <ShieldX className="size-9" />}
              <p className="font-display text-xl sm:text-2xl">
                {result.valid ? "DOCUMENT VALID" : "DOCUMENT INVALID"}
              </p>
            </div>

            <BrutalCard title="Hash" accent="accent">
              <DataRow label="Document Hash" value={result.hash} mono copy={result.hash} />
            </BrutalCard>

            <MetadataCard
              title="Detail"
              studentName={result.data?.studentName}
              studentNim={result.data?.studentNim}
              certificateNumber={result.data?.certificateNumber}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

function DetailSection({ hash, setHash }: { hash: string; setHash: (hash: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doc, setDoc] = useState<DocumentRecord | null>(null);

  const load = async (target = hash) => {
    if (!target.trim()) {
      toast.error("Enter a document hash");
      return;
    }

    setLoading(true);
    setError(null);
    setDoc(null);

    try {
      const data = await documentService.detail(target.trim());
      setDoc(data);
    } catch (error) {
      const message = errMsg(error);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <BrutalCard title="Document Detail">
        <div className="flex flex-col gap-3 sm:flex-row">
          <BrutalInput
            value={hash}
            onChange={(event) => setHash(event.target.value)}
            placeholder="Paste document hash (SHA-256)"
            onKeyDown={(event) => {
              if (event.key === "Enter") load();
            }}
          />
          <BrutalButton onClick={() => load()} loading={loading}>Fetch</BrutalButton>
        </div>
        {/* <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          GET /documents/{"{hash}"}
        </p> */}
      </BrutalCard>

      {loading ? (
        <BrutalCard title="Loading"><LoadingState text="Reading registry" /></BrutalCard>
      ) : null}

      {error ? (
        <BrutalCard title="Not Found" accent="destructive">
          <ErrorState message={error} onRetry={() => load()} />
        </BrutalCard>
      ) : null}

      {!loading && !error && !doc ? (
        <BrutalCard title="Result">
          <EmptyState text="Enter a document hash to inspect its registry record." />
        </BrutalCard>
      ) : null}

      {doc ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Status
            </span>
            <DocumentStatus revoked={doc.revoked} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <MetadataCard
              studentName={doc.studentName}
              studentNim={doc.studentNim}
              certificateNumber={doc.certificateNumber}
              fileName={doc.fileName}
            />
            <BlockchainInfo doc={doc} />
          </div>

          <PdfPreview hash={doc.hash} fileName={doc.fileName} />
        </>
      ) : null}
    </div>
  );
}

function RevokeSection({ onOpenDetail }: { onOpenDetail: (hash: string) => void }) {
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tx, setTx] = useState<string | null>(null);

  const submit = async () => {
    if (!hash.trim()) {
      toast.error("Enter a document hash");
      return;
    }

    setLoading(true);
    setError(null);
    setTx(null);

    try {
      const data = await documentService.revoke(hash.trim());
      setTx(data.transactionHash);
      toast.success("Document revoked");
    } catch (error) {
      const message = errMsg(error);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <BrutalCard title="Revoke Document" accent="destructive">
        <BrutalInput
          value={hash}
          onChange={(event) => setHash(event.target.value)}
          placeholder="Paste document hash to revoke"
        />
        <div className="mt-4">
          <BrutalButton variant="danger" onClick={submit} loading={loading}>
            <Trash2 className="size-4" />
            Revoke Document
          </BrutalButton>
        </div>
        {/* <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          POST /documents/{"{hash}"}/revoke
        </p> */}
      </BrutalCard>

      <div className="space-y-6">
        {loading ? (
          <BrutalCard title="Processing"><LoadingState text="Sending revoke transaction" /></BrutalCard>
        ) : null}

        {error ? (
          <BrutalCard title="Revoke Failed" accent="destructive">
            <ErrorState message={error} onRetry={submit} />
          </BrutalCard>
        ) : null}

        {!loading && !error && !tx ? (
          <BrutalCard title="Result">
            <EmptyState text="No revocation performed in this session." />
          </BrutalCard>
        ) : null}

        {tx ? (
          <BrutalCard title="Revocation Complete" accent="destructive">
            <DataRow label="Transaction Hash" value={tx} mono copy={tx} />
            <DataRow label="Status Change" value={<DocumentStatus revoked />} />
            <div className="mt-4">
              <BrutalButton variant="neutral" onClick={() => onOpenDetail(hash.trim())}>
                View Updated Detail
              </BrutalButton>
            </div>
          </BrutalCard>
        ) : null}
      </div>
    </div>
  );
}