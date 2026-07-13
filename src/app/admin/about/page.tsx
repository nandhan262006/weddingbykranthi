"use client";

import { useEffect, useState } from "react";
import FileUpload from "@/components/admin/FileUpload";
import Toast from "@/components/admin/Toast";
import { FormSkeleton } from "@/components/admin/Skeleton";

export default function AboutPage() {
  const [form, setForm] = useState({ title: "", content: "", image: "", tags: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/admin/about")
      .then((r) => r.json())
      .then((item) => {
        if (item) setForm({ title: item.title || "", content: item.content || "", image: item.image || "", tags: item.tags || "" });
      })
      .finally(() => setFetching(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setToast({ message: "About section saved", type: "success" });
    } catch {
      setToast({ message: "Failed to save about section", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <FormSkeleton />;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">About Section</h1>
        <p className="text-white/30 text-sm mt-1">Edit the about content displayed on your website</p>
      </div>
      <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors" />
          </div>
          <div>
            <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Content</label>
            <textarea rows={10} required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Image</label>
            {form.image && <img src={form.image} alt="Preview" className="mb-3 h-32 w-32 object-cover rounded-xl" />}
            <FileUpload onUpload={(url) => setForm({ ...form, image: url })} folder="about" />
          </div>
          <div>
            <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">
              Tags <span className="text-white/20 normal-case">(comma-separated)</span>
            </label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors"
              placeholder="Candid, Traditional, Cinematic" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#D4AF37] hover:bg-[#C4A030] text-[#0A0A0A] font-medium py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
            {loading ? "Saving..." : "Save About Section"}
          </button>
        </form>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
