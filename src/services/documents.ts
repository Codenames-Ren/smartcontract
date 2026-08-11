import { apiClient, endpoints } from "@/config/api";

export interface DocumentRecord {
  id?: string | number;
  hash: string;
  studentName: string;
  studentNim: string;
  certificateNumber: string;
  fileName?: string;
  filePath?: string;
  transactionHash?: string;
  revoked?: boolean;
  createdAt?: string;
}

export interface VerifyResult {
  hash: string;
  valid: boolean;
  data?: {
    studentName?: string;
    studentNim?: string;
    certificateNumber?: string;
  } | null;
}

function fileForm(file: File) {
  const form = new FormData();
  form.append("file", file);
  return form;
}

export const documentService = {
  register: (file: File) =>
    apiClient.post<DocumentRecord>(endpoints.register, fileForm(file)),
  verify: (file: File) => apiClient.post<VerifyResult>(endpoints.verify, fileForm(file)),
  detail: (hash: string) => apiClient.get<DocumentRecord>(endpoints.detail(hash)),
  revoke: (hash: string) =>
    apiClient.post<{ transactionHash: string }>(endpoints.revoke(hash)),
  fileUrl: (hash: string) => apiClient.url(endpoints.file(hash)),
  fileBlob: (hash: string) => apiClient.getBlob(endpoints.file(hash)),
  health: async () => {
    const res = await fetch(apiClient.url(endpoints.health), { method: "GET" });
    if (!res.ok) throw new Error("offline");
    return true;
  },
};
