import type { CSSProperties } from "react";
import type { Column } from "@tanstack/react-table";

/** Sticky pinning styles for header and cells. Shadow is applied separately only when scrolled. */
export function getStickyPinningStyles<T>(column: Column<T, unknown>): CSSProperties {
  const isPinned = column.getIsPinned();
  const w = column.getSize();

  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: w,
    minWidth: w,
    maxWidth: w,
    zIndex: isPinned ? 2 : 0,
    backgroundColor: "var(--card)",
    boxSizing: "border-box",
  };
}

/** Shadow to apply to last left-pinned column only when horizontal scroll > 0. */
export const PINNED_SHADOW = "2px 0 4px -2px var(--semantics-base-shadow)";

/** Sticky header row: combine pinning (left) with sticky top. Use high z-index so header stays on top when scrolling. */
export function getStickyHeaderStyles<T>(column: Column<T, unknown>): CSSProperties {
  return {
    ...getStickyPinningStyles(column),
    top: 0,
    zIndex: column.getIsPinned() ? 10 : 5,
    // backgroundColor: "var(--muted)",
  };
}

/** Fixed column widths for layout (Date, Day, then 8 activity columns). */
export const COLUMN_WIDTHS = [72, 56, 80, 80, 80, 80, 80, 80, 80, 80] as const;

/** Total table width so fixed layout doesn't collapse. */
export const TABLE_WIDTH =
  COLUMN_WIDTHS.reduce((a, b) => a + b, 0);

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y!, m! - 1, d!);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
