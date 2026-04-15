"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

/* ──────────────────────────────────────────────
 * ContentListTable — reusable admin list with
 * drag-and-drop, visible/featured toggles,
 * single delete, and bulk actions.
 * ────────────────────────────────────────────── */

type ColumnStyle = "bold" | "tag" | "muted" | "plain";

export interface Column {
  key: string;
  label: string;
  fallbackKey?: string;
  style?: ColumnStyle;
}

export interface ContentItem {
  id: string;
  title: string;
  visible?: boolean;
  featured?: boolean;
  order: number;
}

export interface ContentListTableProps {
  items: ContentItem[];
  columns: Column[];
  apiPath: string;
  editPath: string;
}

function CellContent({ value, style }: { value: string; style: ColumnStyle }) {
  switch (style) {
    case "bold":
      return <span className="font-medium text-gray-900">{value}</span>;
    case "tag":
      return (
        <span className="inline-block text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
          {value || "\u2014"}
        </span>
      );
    case "muted":
      return <span className="text-gray-500 text-xs">{value}</span>;
    case "plain":
    default:
      return <span className="text-gray-600">{value}</span>;
  }
}

export default function ContentListTable({
  items: initialItems,
  columns,
  apiPath,
  editPath,
}: ContentListTableProps) {
  const [items, setItems] = useState(initialItems);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  /* ── Persist a single field update via PUT ── */
  const persistUpdate = useCallback(
    async (id: string, updates: Record<string, unknown>) => {
      setUpdatingIds((prev) => new Set(prev).add(id));
      try {
        await fetch(`${apiPath}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
      } finally {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [apiPath],
  );

  /* ── Delete a single item ── */
  const deleteItem = useCallback(
    async (id: string) => {
      setDeletingIds((prev) => new Set(prev).add(id));
      try {
        const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
        if (res.ok) {
          setItems((prev) => prev.filter((item) => item.id !== id));
          setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }
      } finally {
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [apiPath],
  );

  /* ── Toggle visible ── */
  const toggleVisible = useCallback(
    (id: string) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const newVisible = item.visible === false ? true : false;
          return { ...item, visible: newVisible };
        }),
      );
      const item = items.find((i) => i.id === id);
      if (item) {
        const newVisible = item.visible === false ? true : false;
        persistUpdate(id, { visible: newVisible });
      }
    },
    [items, persistUpdate],
  );

  /* ── Toggle featured ── */
  const toggleFeatured = useCallback(
    (id: string) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          return { ...item, featured: !item.featured };
        }),
      );
      const item = items.find((i) => i.id === id);
      if (item) {
        persistUpdate(id, { featured: !item.featured });
      }
    },
    [items, persistUpdate],
  );

  /* ── Drag-and-drop reorder ── */
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const srcIdx = result.source.index;
      const destIdx = result.destination.index;
      if (srcIdx === destIdx) return;

      const reordered = Array.from(items);
      const [moved] = reordered.splice(srcIdx, 1);
      reordered.splice(destIdx, 0, moved);

      const updated = reordered.map((item, idx) => ({ ...item, order: idx }));
      setItems(updated);

      /* Send ALL items' orders so the blob gets fully normalized */
      const orders = updated.map((item) => ({
        id: item.id,
        order: item.order,
      }));
      fetch(apiPath, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders }),
      });
    },
    [items, apiPath],
  );

  /* ── Selection ── */
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  };

  /* ── Bulk actions ── */
  const bulkAction = async (action: "delete" | "hide" | "show" | "feature" | "unfeature") => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    if (action === "delete") {
      if (!confirm(`Delete ${ids.length} item${ids.length > 1 ? "s" : ""}? This cannot be undone.`)) return;
      for (const id of ids) {
        await deleteItem(id);
      }
    } else {
      const updates: Record<string, unknown> =
        action === "hide" ? { visible: false } :
        action === "show" ? { visible: true } :
        action === "feature" ? { featured: true } :
        { featured: false };

      setItems((prev) =>
        prev.map((item) =>
          selectedIds.has(item.id) ? { ...item, ...updates } : item
        ),
      );

      for (const id of ids) {
        persistUpdate(id, updates);
      }
    }

    setSelectedIds(new Set());
  };

  /* ── Helpers ── */
  const getCellValue = (item: ContentItem, col: Column): string => {
    const record = item as unknown as Record<string, unknown>;
    const primary = record[col.key];
    if (primary !== undefined && primary !== null && primary !== "") {
      return String(primary);
    }
    if (col.fallbackKey) {
      return String(record[col.fallbackKey] ?? "");
    }
    return "";
  };

  const hasSelection = selectedIds.size > 0;
  const allSelected = selectedIds.size === items.length && items.length > 0;

  if (items.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-12 text-center text-sm text-gray-500">
          No items yet. Add your first one.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Bulk action bar — appears when items are selected */}
      {hasSelection && (
        <div className="flex items-center gap-3 mb-3 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm">
          <span className="font-medium">{selectedIds.size} selected</span>
          <span className="text-gray-500">|</span>
          <button onClick={() => bulkAction("feature")} className="hover:text-green-400 transition-colors">
            Feature
          </button>
          <button onClick={() => bulkAction("unfeature")} className="hover:text-yellow-400 transition-colors">
            Unfeature
          </button>
          <button onClick={() => bulkAction("show")} className="hover:text-blue-400 transition-colors">
            Show
          </button>
          <button onClick={() => bulkAction("hide")} className="hover:text-orange-400 transition-colors">
            Hide
          </button>
          <button onClick={() => bulkAction("delete")} className="hover:text-red-400 transition-colors">
            Delete
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="content-list">
            {(provided) => (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {/* Select all checkbox */}
                    <th className="w-8 px-3 py-3">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
                      />
                    </th>
                    {/* Drag handle column */}
                    <th className="w-8 px-1 py-3" />
                    {columns.map((col) => (
                      <th key={col.key} className="text-left px-4 py-3 font-medium text-gray-600">
                        {col.label}
                      </th>
                    ))}
                    <th className="text-center px-4 py-3 font-medium text-gray-600">Visible</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">Featured</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody ref={provided.innerRef} {...provided.droppableProps}>
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(draggableProvided, snapshot) => (
                        <tr
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          className={`border-b border-gray-100 transition-colors ${
                            snapshot.isDragging
                              ? "bg-gray-100 shadow-md"
                              : selectedIds.has(item.id)
                              ? "bg-blue-50"
                              : "hover:bg-gray-50"
                          } ${item.visible === false ? "opacity-50" : ""} ${
                            deletingIds.has(item.id) ? "opacity-30 pointer-events-none" : ""
                          }`}
                          style={{
                            ...draggableProvided.draggableProps.style,
                            display: snapshot.isDragging ? "table" : undefined,
                            tableLayout: snapshot.isDragging ? "fixed" : undefined,
                            width: snapshot.isDragging ? "100%" : undefined,
                          }}
                        >
                          {/* Selection checkbox */}
                          <td className="w-8 px-3 py-3">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(item.id)}
                              onChange={() => toggleSelect(item.id)}
                              className="h-3.5 w-3.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
                            />
                          </td>

                          {/* Drag handle */}
                          <td className="w-8 px-1 py-3 text-center">
                            <span
                              {...draggableProvided.dragHandleProps}
                              className="inline-block cursor-grab text-gray-400 hover:text-gray-600 select-none"
                              title="Drag to reorder"
                            >
                              &#x2807;&#x2807;
                            </span>
                          </td>

                          {/* Dynamic columns */}
                          {columns.map((col) => (
                            <td key={col.key} className="px-4 py-3">
                              <CellContent
                                value={getCellValue(item, col)}
                                style={col.style ?? "plain"}
                              />
                            </td>
                          ))}

                          {/* Visible checkbox */}
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={item.visible !== false}
                              onChange={() => toggleVisible(item.id)}
                              disabled={updatingIds.has(item.id)}
                              className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer disabled:opacity-50"
                            />
                          </td>

                          {/* Featured toggle */}
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => toggleFeatured(item.id)}
                              disabled={updatingIds.has(item.id)}
                              className={`relative w-9 h-5 rounded-full transition-colors inline-block ${
                                item.featured ? "bg-green-500" : "bg-gray-300"
                              } ${updatingIds.has(item.id) ? "opacity-50" : ""}`}
                            >
                              <span
                                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                                  item.featured ? "translate-x-4" : ""
                                }`}
                              />
                            </button>
                          </td>

                          {/* Actions: Edit + Delete */}
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <Link
                                href={`${editPath}/${item.id}`}
                                className="text-xs font-medium text-gray-900 hover:underline"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete "${item.title}"?`)) deleteItem(item.id);
                                }}
                                disabled={deletingIds.has(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                title="Delete"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
