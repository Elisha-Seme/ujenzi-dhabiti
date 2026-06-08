"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Check } from "lucide-react";

export type FieldType = "text" | "textarea" | "number" | "select" | "checkbox" | "tags" | "image";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  help?: string;
  /** default for the "add new" form */
  default?: string | number | boolean;
}

interface ResourceManagerProps {
  title: string;
  subtitle?: string;
  /** Base endpoint, e.g. "/api/admin/projects" */
  endpoint: string;
  fields: FieldDef[];
  /** field names to show as table columns */
  columns: string[];
}

type Row = Record<string, unknown> & { id: string; _static?: boolean };

export default function ResourceManager({ title, subtitle, endpoint, fields, columns }: ResourceManagerProps) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null); // null = closed; {} with no id = new
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch(endpoint)
      .then((r) => r.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch(() => setError("Could not load. Is the database migrated?"))
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => load(), [load]);

  const openNew = () => {
    const blank: Row = { id: "" };
    for (const f of fields) blank[f.name] = f.default ?? (f.type === "checkbox" ? true : f.type === "tags" ? [] : "");
    setEditing(blank);
    setError(null);
    setOpen(true);
  };

  const openEdit = (row: Row) => {
    setEditing({ ...row });
    setError(null);
    setOpen(true);
  };

  const setField = (name: string, value: unknown) =>
    setEditing((prev) => (prev ? { ...prev, [name]: value } : prev));

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const v = editing[f.name];
      if (f.type === "tags") {
        payload[f.name] = Array.isArray(v)
          ? v
          : String(v ?? "").split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
      } else if (f.type === "number") {
        payload[f.name] = v === "" || v == null ? null : Number(v);
      } else if (f.type === "checkbox") {
        payload[f.name] = !!v;
      } else {
        payload[f.name] = v ?? "";
      }
    }
    const isNew = !editing.id;
    const url = isNew ? endpoint : `${endpoint}/${editing.id}`;
    try {
      const res = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Save failed");
      }
      setOpen(false);
      setEditing(null);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: Row) => {
    if (!confirm(`Delete "${String(row[columns[0]] ?? row.id)}"? This cannot be undone.`)) return;
    const res = await fetch(`${endpoint}/${row.id}`, { method: "DELETE" });
    if (res.ok) load();
    else alert("Delete failed.");
  };

  const renderCell = (row: Row, col: string) => {
    const v = row[col];
    if (typeof v === "boolean") return v ? <Check size={15} className="text-ud-burgundy" /> : <span className="text-ud-dark/25">—</span>;
    if (Array.isArray(v)) return <span className="text-ud-dark/60">{v.join(", ") || "—"}</span>;
    const s = String(v ?? "");
    return <span className="text-ud-dark/80">{s.length > 60 ? s.slice(0, 60) + "…" : s || "—"}</span>;
  };

  return (
    <div className="p-5 md:p-8 max-w-5xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-ud-dark">{title}</h1>
          {subtitle && <p className="text-sm text-ud-dark/50 mt-1">{subtitle}</p>}
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 bg-ud-burgundy text-white text-sm font-semibold px-4 py-2.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors whitespace-nowrap">
          <Plus size={16} /> Add New
        </button>
      </div>

      {error && !open && (
        <div className="bg-ud-burgundy/5 border border-ud-burgundy/30 rounded-[4px] p-3 mb-4 text-sm text-ud-burgundy">{error}</div>
      )}

      <div className="bg-white rounded-[4px] border border-ud-dark/10 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-ud-dark/40 text-sm flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-ud-dark/40 text-sm">Nothing here yet. Click <span className="font-semibold text-ud-dark/60">Add New</span> to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ud-dark/10 bg-ud-light-gray/60">
                  {columns.map((c) => (
                    <th key={c} className="text-left font-bold text-ud-dark/50 uppercase tracking-wider text-[11px] px-4 py-3 whitespace-nowrap">
                      {fields.find((f) => f.name === c)?.label ?? c}
                    </th>
                  ))}
                  <th className="px-4 py-3 w-px" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-ud-dark/5 last:border-0 hover:bg-ud-light-gray/40">
                    {columns.map((c) => (
                      <td key={c} className="px-4 py-3 align-top">{renderCell(row, c)}</td>
                    ))}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {row._static ? (
                        <span className="text-[11px] text-ud-dark/40 italic">Built-in</span>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(row)} className="p-1.5 text-ud-dark/40 hover:text-ud-burgundy transition-colors" title="Edit"><Pencil size={15} /></button>
                          <button onClick={() => remove(row)} className="p-1.5 text-ud-dark/40 hover:text-ud-burgundy transition-colors" title="Delete"><Trash2 size={15} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / create drawer */}
      {open && editing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg bg-white h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-ud-dark/10 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-bold text-ud-dark">{editing.id ? "Edit" : "Add New"}</h2>
              <button onClick={() => setOpen(false)} className="text-ud-dark/40 hover:text-ud-dark"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              {fields.map((f) => {
                const v = editing[f.name];
                const label = (
                  <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                    {f.label}{f.required && " *"}
                  </label>
                );
                const cls = "w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors";
                if (f.type === "checkbox") {
                  return (
                    <label key={f.name} className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input type="checkbox" checked={!!v} onChange={(e) => setField(f.name, e.target.checked)} className="accent-ud-burgundy w-4 h-4" />
                      <span className="text-sm font-semibold text-ud-dark">{f.label}</span>
                    </label>
                  );
                }
                return (
                  <div key={f.name}>
                    {label}
                    {f.type === "textarea" ? (
                      <textarea value={String(v ?? "")} onChange={(e) => setField(f.name, e.target.value)} rows={5} className={`${cls} resize-none`} />
                    ) : f.type === "select" ? (
                      <select value={String(v ?? "")} onChange={(e) => setField(f.name, e.target.value)} className={`${cls} bg-white`}>
                        <option value="">Select…</option>
                        {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : f.type === "tags" ? (
                      <input
                        value={Array.isArray(v) ? v.join(", ") : String(v ?? "")}
                        onChange={(e) => setField(f.name, e.target.value)}
                        placeholder="Comma-separated"
                        className={cls}
                      />
                    ) : (
                      <input
                        type={f.type === "number" ? "number" : "text"}
                        value={v == null ? "" : String(v)}
                        onChange={(e) => setField(f.name, e.target.value)}
                        className={cls}
                      />
                    )}
                    {f.type === "image" && v ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={String(v)} alt="" className="mt-2 h-24 rounded-[4px] object-cover border border-ud-dark/10" />
                    ) : null}
                    {f.help && <p className="text-[11px] text-ud-dark/40 mt-1">{f.help}</p>}
                  </div>
                );
              })}

              {error && <div className="bg-ud-burgundy/5 border border-ud-burgundy/30 rounded-[4px] p-3 text-sm text-ud-burgundy">{error}</div>}

              <div className="flex gap-3 pt-2">
                <button onClick={save} disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 bg-ud-burgundy text-white text-sm font-semibold px-4 py-2.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors disabled:opacity-50">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save
                </button>
                <button onClick={() => setOpen(false)} className="px-4 py-2.5 text-sm font-semibold text-ud-dark/60 hover:text-ud-dark border border-ud-dark/20 rounded-[4px]">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
