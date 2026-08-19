import { MetricsResponse, ProductRecord, ReviewQueueItem, FieldDecision } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function fetchHealth(): Promise<{ status: string; demo_mode: string; llm_provider: string; products_in_store: number }> {
  const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}

export async function fetchProducts(params?: {
  status?: string;
  search?: string;
  min_confidence?: number;
}): Promise<ProductRecord[]> {
  const query = new URLSearchParams();
  if (params?.status) query.append("status", params.status);
  if (params?.search) query.append("search", params.search);
  if (params?.min_confidence !== undefined) query.append("min_confidence", params.min_confidence.toString());

  const url = `${API_BASE}/products${query.toString() ? `?${query.toString()}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProductBySku(sku: string): Promise<ProductRecord> {
  const res = await fetch(`${API_BASE}/products/${encodeURIComponent(sku)}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Product ${sku} not found`);
  return res.json();
}

export async function fetchExplainField(sku: string, field: string): Promise<FieldDecision> {
  const res = await fetch(
    `${API_BASE}/products/${encodeURIComponent(sku)}/explain/${encodeURIComponent(field)}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Explain field ${field} failed`);
  return res.json();
}

export async function fetchReviewQueue(): Promise<ReviewQueueItem[]> {
  const res = await fetch(`${API_BASE}/review`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch review queue");
  return res.json();
}

export async function submitReviewAction(
  sku: string,
  field: string,
  data: { action: "ACCEPT" | "REJECT" | "EDIT"; value?: any; notes?: string }
): Promise<ProductRecord> {
  const res = await fetch(
    `${API_BASE}/products/${encodeURIComponent(sku)}/review/${encodeURIComponent(field)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error("Failed to submit review override");
  return res.json();
}

export async function fetchMetrics(): Promise<MetricsResponse> {
  const res = await fetch(`${API_BASE}/metrics`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch metrics");
  return res.json();
}

export async function uploadAndProcess(
  csvFile: File | null,
  pdfFiles: File[] = []
): Promise<{ success: boolean; mode: string; count: number; products: ProductRecord[] }> {
  const formData = new FormData();
  if (csvFile) formData.append("csv_file", csvFile);
  pdfFiles.forEach((file) => formData.append("pdf_files", file));

  const res = await fetch(`${API_BASE}/process`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Live pipeline processing failed");
  return res.json();
}

export async function resetCatalog(): Promise<{ success: boolean; mode: string; count: number; products: ProductRecord[] }> {
  const res = await fetch(`${API_BASE}/reset`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Reset to golden failed");
  return res.json();
}

export function getExportJsonUrl(): string {
  return `${API_BASE}/export/json`;
}

export function getExportCsvUrl(): string {
  return `${API_BASE}/export/csv`;
}

export async function fetchProductGaps(sku: string): Promise<import("./types").GapAnalysisResult> {
  const res = await fetch(`${API_BASE}/products/${encodeURIComponent(sku)}/gaps`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch attribute gaps for ${sku}`);
  return res.json();
}

