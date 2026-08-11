import { BrutalBadge, BrutalCard, DataRow } from "@/components/common/Brutal";
import type { DocumentRecord } from "@/services/documents";

export function DocumentStatus({ revoked }: { revoked?: boolean | undefined }) {
  return (
    <BrutalBadge tone={revoked ? "danger" : "success"}>
      {revoked ? "Revoked" : "Active"}
    </BrutalBadge>
  );
}

export function MetadataCard({
  studentName,
  studentNim,
  certificateNumber,
  fileName,
  title = "Document Information",
}: {
  studentName?: string | undefined;
  studentNim?: string | undefined;
  certificateNumber?: string | undefined;
  fileName?: string | undefined;
  title?: string | undefined;
}) {
  return (
    <BrutalCard title={title}>
      <DataRow label="Student Name" value={studentName} />
      <DataRow label="Student NIM" value={studentNim} mono />
      <DataRow label="Certificate No." value={certificateNumber} mono />
      {fileName ? <DataRow label="File Name" value={fileName} mono /> : null}
    </BrutalCard>
  );
}

export function BlockchainInfo({ doc }: { doc: DocumentRecord }) {
  return (
    <BrutalCard title="Blockchain Information" accent="accent">
      <DataRow label="Document Hash" value={doc.hash} mono copy={doc.hash} />
      <DataRow
        label="Transaction Hash"
        value={doc.transactionHash}
        mono
        copy={doc.transactionHash}
      />
      <DataRow
        label="Registered At"
        value={doc.createdAt ? new Date(doc.createdAt).toLocaleString() : undefined}
      />
      <DataRow label="Status" value={<DocumentStatus revoked={doc.revoked} />} />
    </BrutalCard>
  );
}
