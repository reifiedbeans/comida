"use client";

import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";

export default function RowDragHandle({ id }: { id: UniqueIdentifier }) {
  const { attributes, listeners } = useSortable({ id });

  return (
    <i
      {...attributes}
      {...listeners}
      aria-label="Re-rank"
      className="bi bi-grip-vertical text-secondary"
      style={{ paddingRight: "0.25rem", cursor: "grab" }}
    />
  );
}
