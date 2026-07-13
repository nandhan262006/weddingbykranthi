"use client";

import { useEffect, useState } from "react";
import { HiPlus, HiPencilSquare, HiXMark, HiCog6Tooth } from "react-icons/hi2";
import Toast from "@/components/admin/Toast";
import { TableSkeleton } from "@/components/admin/Skeleton";

interface Setting {
  id: string;
  key: string;
  value: string | null;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editKey, setEditKey] = useState("");
  const [editValue, setEditValue] = useState("");
  const [isNew, setIsNew] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((json) => {
        if (!json.error) setSettings(json);
        else setSettings([]);
      });
  }, []);

  const refetch = () => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((json) => {
        if (!json.error) setSettings(json);
      });
  };

  function openAdd() {
    setEditKey("");
    setEditValue("");
    setIsNew(true);
    setModalOpen(true);
  }

  function openEdit(s: Setting) {
    setEditKey(s.key);
    setEditValue(s.value || "");
    setIsNew(false);
    setModalOpen(true);
  }

  async function handleSave() {
    if (!editKey) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: editKey, value: editValue }),
      });
      if (!res.ok) throw new Error("Failed");
      setToast({ message: "Setting saved", type: "success" });
      refetch();
      setModalOpen(false);
    } catch {
      setToast({ message: "Failed to save setting", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-white/30 text-sm mt-1">Manage site configuration</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C4A030] text-[#0A0A0A] px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-lg shadow-[#D4AF37]/10"
        >
          <HiPlus className="w-4 h-4" />
          Add Setting
        </button>
      </div>

      {!settings ? (
        <TableSkeleton rows={5} />
      ) : (
      <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-5 py-3 text-white/30 text-xs font-medium uppercase tracking-wider w-1/3">Key</th>
                <th className="text-left px-5 py-3 text-white/30 text-xs font-medium uppercase tracking-wider">Value</th>
                <th className="text-right px-5 py-3 text-white/30 text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((s) => (
                <tr key={s.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-white/70 text-sm font-mono">{s.key}</td>
                  <td className="px-5 py-3.5 text-white/40 text-sm max-w-md truncate">{s.value || "—"}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="p-2 bg-white/[0.04] text-white/60 rounded-lg hover:bg-white/[0.08] hover:text-white transition-colors"
                      >
                        <HiPencilSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {settings.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center text-white/20 text-sm">
                    <HiCog6Tooth className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No settings configured
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-md bg-[#111111] border border-white/[0.08] rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">{isNew ? "Add Setting" : "Edit Setting"}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors">
                <HiXMark className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Key</label>
                <input required value={editKey} onChange={(e) => setEditKey(e.target.value)} disabled={!isNew}
                  className="w-full bg-white/[0.03] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm font-mono focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors disabled:opacity-40" />
              </div>
              <div>
                <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Value</label>
                <input value={editValue} onChange={(e) => setEditValue(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={loading}
                  className="flex-1 bg-[#D4AF37] hover:bg-[#C4A030] text-[#0A0A0A] font-medium py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
                  {loading ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setModalOpen(false)}
                  className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] text-white/60 font-medium py-2.5 rounded-xl text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
