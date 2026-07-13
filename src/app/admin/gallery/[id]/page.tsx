"use client";

import { useEffect, useState, use } from "react";
import FileUpload from "@/components/admin/FileUpload";
import Toast from "@/components/admin/Toast";
import { FormSkeleton } from "@/components/admin/Skeleton";

export default function EditGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [form, setForm] = useState({ title: "", src: "", alt: "", span: "", sortOrder: 0, isActive: true });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch(`/api/admin/gallery/${id}`)
      .then((r) => r.json())
      .then((item) => {
        if (item && !item.error) setForm({
          title: item.title, src: item.src || "", alt: item.alt || "",
          span: item.span || "", sortOrder: item.sortOrder, isActive: item.isActive,
        });
      })
      .finally(() => setFetching(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setToast({ message: "Image updated", type: "success" });
    } catch {
      setToast({ message: "Failed to update image", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <FormSkeleton />;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Edit Gallery Image</h1>
        <p className="text-white/30 text-sm mt-1">Update image details</p>
      </div>
      <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors" />
          </div>
          <div>
            <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Image</label>
            {form.src && <img src={form.src} alt="Preview" className="mb-3 h-32 w-32 object-cover rounded-xl" />}
            <FileUpload onUpload={(url) => setForm({ ...form, src: url })} folder="gallery" />
          </div>
          <div>
            <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Alt Text</label>
            <input value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors" />
          </div>
          <div>
            <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Grid Span</label>
            <select value={form.span} onChange={(e) => setForm({ ...form, span: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors">
              <option value="">Default</option>
              <option value="col-span-2">Wide (2 cols)</option>
              <option value="row-span-2">Tall (2 rows)</option>
              <option value="col-span-2 row-span-2">Large (2x2)</option>
            </select>
          </div>
          <div>
            <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Sort Order</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              className="w-full bg-white/[0.03] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 bg-white/[0.03] text-[#D4AF37] focus:ring-[#D4AF37]/20" />
            <span className="text-white/60 text-sm">Active</span>
          </label>
          <button type="submit" disabled={loading}
            className="w-full bg-[#D4AF37] hover:bg-[#C4A030] text-[#0A0A0A] font-medium py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
