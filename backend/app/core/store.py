"""core/store.py — Storage plane: in-memory thread-safe store + audit log.

Manages active ProductRecords, human review overrides, and audit trails.
"""

from __future__ import annotations

import datetime
from threading import Lock
from typing import Optional

from app.schemas.models import FieldDecision, FieldStatus, ProductRecord


class ProductStore:
    """Thread-safe catalog storage engine."""

    def __init__(self) -> None:
        self._lock = Lock()
        self._products: dict[str, ProductRecord] = {}
        self._audit_log: list[dict] = []

    def set_products(self, records: list[ProductRecord]) -> None:
        with self._lock:
            self._products = {r.sku: r for r in records}
            self._audit_log.append({
                "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                "action": "LOAD_PRODUCTS",
                "count": len(records),
            })

    def get_all(self) -> list[ProductRecord]:
        with self._lock:
            return list(self._products.values())

    def get_by_sku(self, sku: str) -> Optional[ProductRecord]:
        with self._lock:
            # Case-insensitive lookup
            for s, r in self._products.items():
                if s.lower() == sku.lower():
                    return r
            return None

    def upsert_product(self, record: ProductRecord) -> None:
        with self._lock:
            self._products[record.sku] = record
            self._audit_log.append({
                "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                "action": "UPSERT_PRODUCT",
                "sku": record.sku,
            })

    def update_field_decision(
        self,
        sku: str,
        field: str,
        new_value: any,
        action: str = "ACCEPT",
        reviewer_notes: str | None = None,
    ) -> Optional[ProductRecord]:
        """Apply human-in-the-loop review override for a specific field."""
        with self._lock:
            prod = None
            target_sku = None
            for s, r in self._products.items():
                if s.lower() == sku.lower():
                    prod = r
                    target_sku = s
                    break

            if not prod or field not in prod.fields:
                return None

            old_decision = prod.fields[field]
            
            if action == "ACCEPT":
                new_status = FieldStatus.VALIDATED
                reason = f"Human reviewer accepted value: {new_value}. Notes: {reviewer_notes or 'Approved'}"
                confidence = 1.0
            elif action == "REJECT":
                new_status = FieldStatus.NEEDS_REVIEW
                new_value = None
                reason = f"Human reviewer rejected candidate. Notes: {reviewer_notes or 'Rejected'}"
                confidence = 0.0
            else:  # MANUAL EDIT
                new_status = FieldStatus.VALIDATED
                reason = f"Manual engineering override: {new_value}. Notes: {reviewer_notes or 'Edited'}"
                confidence = 1.0

            updated_decision = FieldDecision(
                field=field,
                final_value=new_value,
                status=new_status,
                confidence=confidence,
                candidates=old_decision.candidates,
                validation_notes=old_decision.validation_notes + [f"Human Review ({action})"],
                decision_reason=reason,
            )

            prod.fields[field] = updated_decision

            # Recalculate overall product confidence and status
            valid_confidences = [fd.confidence for fd in prod.fields.values() if fd.status != FieldStatus.MISSING]
            prod.overall_confidence = round(sum(valid_confidences) / max(len(valid_confidences), 1), 2)

            statuses = [fd.status for fd in prod.fields.values()]
            if any(st == FieldStatus.NEEDS_REVIEW for st in statuses):
                prod.overall_status = FieldStatus.NEEDS_REVIEW
            elif any(st == FieldStatus.CONFLICT_RESOLVED for st in statuses):
                prod.overall_status = FieldStatus.CONFLICT_RESOLVED
            elif all(st == FieldStatus.VALIDATED for st in statuses if st != FieldStatus.MISSING):
                prod.overall_status = FieldStatus.VALIDATED
            else:
                prod.overall_status = FieldStatus.MISSING

            self._products[target_sku] = prod
            self._audit_log.append({
                "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                "action": "FIELD_OVERRIDE",
                "sku": target_sku,
                "field": field,
                "review_action": action,
                "new_value": new_value,
            })

            return prod

    def get_review_queue(self) -> list[dict]:
        """Fetch all fields across the catalog currently requiring human review."""
        with self._lock:
            queue = []
            for sku, prod in self._products.items():
                for field_name, dec in prod.fields.items():
                    if dec.status in (FieldStatus.NEEDS_REVIEW, FieldStatus.CONFLICT_RESOLVED):
                        queue.append({
                            "sku": sku,
                            "product_name": prod.product_name,
                            "field": field_name,
                            "current_value": dec.final_value,
                            "status": dec.status,
                            "confidence": dec.confidence,
                            "decision_reason": dec.decision_reason,
                            "validation_notes": dec.validation_notes,
                            "candidates": [c.model_dump(mode="json") for c in dec.candidates],
                        })
            return queue

    def get_audit_log(self) -> list[dict]:
        with self._lock:
            return list(self._audit_log)


store = ProductStore()
