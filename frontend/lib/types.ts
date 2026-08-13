export type SourceType =
  | "manufacturer_datasheet"
  | "technical_catalog"
  | "erp_export"
  | "website"
  | "csv";

export type FieldStatus =
  | "validated"
  | "conflict_resolved"
  | "needs_review"
  | "missing";

export interface Evidence {
  source_name: string;
  source_type: SourceType;
  page: number | null;
  snippet: string;
  extraction_confidence: number;
}

export interface Candidate {
  raw_value: any;
  normalized_value: number | string | null;
  unit: string | null;
  evidence: Evidence;
}

export interface FieldDecision {
  field: string;
  final_value: any;
  status: FieldStatus;
  confidence: number;
  candidates: Candidate[];
  validation_notes: string[];
  decision_reason: string;
}

export interface ProductRecord {
  sku: string;
  product_name: string | null;
  fields: Record<string, FieldDecision>;
  overall_confidence: number;
  overall_status: FieldStatus;
}

export interface ReviewQueueItem {
  sku: string;
  product_name: string | null;
  field: string;
  current_value: any;
  status: FieldStatus;
  confidence: number;
  decision_reason: string;
  validation_notes: string[];
  candidates: Candidate[];
}

export interface MetricsResponse {
  total_products: number;
  avg_confidence: number;
  validated_count: number;
  conflict_resolved_count: number;
  needs_review_count: number;
  total_fields: number;
  populated_fields: number;
  enrichment_rate_pct: number;
  estimated_hours_saved: number;
}
