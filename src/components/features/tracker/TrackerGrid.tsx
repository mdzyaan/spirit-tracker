"use client";

import Link from "next/link";
import { useRef, useState, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { useAuth } from "@/hooks/useAuth";
import { useTracker } from "@/hooks/useTracker";
import { fetchTrackerData } from "@/store/thunks/trackerThunks";
import type { TrackerDay } from "@/store/slices/trackerSlice";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrackerCell } from "./TrackerCell";
import { PrayerTrackerCell } from "./PrayerTrackerCell";
import { TaraweehTrackerCell } from "./TaraweehTrackerCell";
import {
  getStickyPinningStyles,
  getStickyHeaderStyles,
  formatDate,
  COLUMN_WIDTHS,
  TABLE_WIDTH,
  PINNED_SHADOW,
} from "./trackerTableUtils";
import { getHoverDimClass } from "./cellStyles";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper<TrackerDay>();

const FARZ_FIELDS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

function buildColumns() {
  return [
    columnHelper.display({
      id: "date",
      header: "Date",
      cell: ({ row }) => formatDate(row.original.date),
      size: 72,
      enablePinning: true,
    }),
    columnHelper.display({
      id: "day",
      header: "Day",
      cell: ({ row }) => row.original.day_number,
      size: 56,
      enablePinning: true,
    }),
    columnHelper.display({
      id: "quran",
      header: "Quran",
      cell: ({ row }) => <TrackerCell day={row.original} field="quran" />,
      size: 80,
    }),
    columnHelper.display({
      id: "charity",
      header: "Charity",
      cell: ({ row }) => <TrackerCell day={row.original} field="charity" />,
      size: 80,
    }),
    ...FARZ_FIELDS.map((field) =>
      columnHelper.display({
        id: field,
        header: field.charAt(0).toUpperCase() + field.slice(1),
        cell: ({ row }) => <PrayerTrackerCell day={row.original} field={field} />,
        size: 80,
      })
    ),
    columnHelper.display({
      id: "taraweeh",
      header: "Taraweeh",
      cell: ({ row }) => <TaraweehTrackerCell day={row.original} />,
      size: 80,
    }),
  ];
}

const COLUMNS = buildColumns();

const SKELETON_ROW_COUNT = 15;

const PLACEHOLDER_DAYS: TrackerDay[] = Array.from(
  { length: SKELETON_ROW_COUNT },
  (_, i) => ({
    id: `skeleton-${i}`,
    user_id: "",
    year: 0,
    day_number: i + 1,
    date: "2000-01-01",
    quran: false,
    charity: false,
    fajr: null,
    dhuhr: null,
    asr: null,
    maghrib: null,
    isha: null,
    taraweeh: null,
  })
);

export function TrackerGrid() {
  const dispatch = useAppDispatch();
  const { user, session, initialized } = useAuth();
  const userId = user?.id ?? session?.user?.id;

  useTracker();

  const { days, status, error, year } = useAppSelector((s: RootState) => s.tracker) as {
    days: TrackerDay[];
    status: string;
    error: string | null;
    year: number | null;
  };

  const handleRetry = () => {
    if (userId) {
      dispatch(fetchTrackerData({ userId, year: year ?? undefined }));
    }
  };

  const isSkeletonTable =
    !initialized || status === "idle" || status === "loading";
  const table = useReactTable({
    data: isSkeletonTable ? PLACEHOLDER_DAYS : days,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnPinning: { left: ["date", "day"] },
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hoveredCell, setHoveredCell] = useState<{
    rowId: string;
    columnId: string;
  } | null>(null);
  const handleScroll = useCallback(() => {
    setScrollLeft(scrollRef.current?.scrollLeft ?? 0);
  }, []);
  const showPinnedShadow = scrollLeft > 0;

  if (initialized && !userId) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 rounded-lg border border-border bg-card text-center">
        <p className="text-muted-foreground">Sign in to load your tracker</p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 rounded-lg border border-border bg-card text-center">
        <p className="text-destructive">{error ?? "Failed to load tracker"}</p>
        <Button variant="outline" size="sm" onClick={handleRetry}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="w-full min-w-0 overflow-x-auto rounded-lg "
    >
      <div
        className="min-w-full"
        style={{ width: TABLE_WIDTH, maxWidth: "100%" }}
      >
        <table
          role="grid"
          className="border-separate border-spacing-0 text-sm w-full"
          style={{
            borderCollapse: "separate",
            tableLayout: "fixed",
            width: TABLE_WIDTH,
            minWidth: TABLE_WIDTH,
          }}
        >
          <colgroup>
            {COLUMN_WIDTHS.map((w, i) => (
              <col key={i} style={{ width: w, minWidth: w }} />
            ))}
          </colgroup>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { column } = header;
                  const isLastLeftPinned =
                    column.getIsPinned() === "left" &&
                    column.getIsLastColumn("left");
                  const isHeaderColumnHovered =
                    !isSkeletonTable &&
                    hoveredCell?.columnId === column.id;
                  return (
                    <th
                      key={header.id}
                      className={cn(
                        "h-8 font-medium text-muted-foreground relative",
                        "px-2 py-0 text-center align-middle"
                      )}
                      style={{
                        ...getStickyHeaderStyles(column),
                        ...(isLastLeftPinned && showPinnedShadow
                          ? { boxShadow: PINNED_SHADOW }
                          : {}),
                      }}
                    >
                      {isHeaderColumnHovered && (
                        <div
                          className="absolute inset-0 pointer-events-none tracker-hover-dim-muted"
                          aria-hidden
                        />
                      )}
                      <span className="relative block truncate text-xs">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell, cellIndex) => {
                  const { column } = cell;
                  const isPinned = column.getIsPinned();
                  const isLastLeftPinned =
                    column.getIsPinned() === "left" &&
                    column.getIsLastColumn("left");
                  const isLast = cellIndex === row.getVisibleCells().length - 1;
                  const isInHoveredRowOrColumn =
                    !isSkeletonTable &&
                    hoveredCell &&
                    (hoveredCell.rowId === row.id ||
                      hoveredCell.columnId === column.id);
                  return (
                    <td
                      key={cell.id}
                      className={cn(
                        "p-0 align-middle relative",
                        isLast && "border-r-0"
                      )}
                      style={{
                        ...getStickyPinningStyles(column),
                        ...(isLastLeftPinned && showPinnedShadow
                          ? { boxShadow: PINNED_SHADOW }
                          : {}),
                      }}
                      onMouseEnter={
                        !isSkeletonTable
                          ? () =>
                              setHoveredCell({
                                rowId: row.id,
                                columnId: column.id,
                              })
                          : undefined
                      }
                      onMouseLeave={
                        !isSkeletonTable ? () => setHoveredCell(null) : undefined
                      }
                    >
                      {isInHoveredRowOrColumn && (
                        <div
                          className={cn(
                            "absolute inset-0 pointer-events-none",
                            getHoverDimClass(column.id, row.original)
                          )}
                          aria-hidden
                        />
                      )}
                      <div
                        className={cn(
                          "relative h-[48px] flex items-center justify-center w-full",
                          !isPinned && "min-w-[80px]"
                        )}
                      >
                        {isSkeletonTable ? (
                          <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
