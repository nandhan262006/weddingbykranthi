"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/admin/FileUpload";
import Toast from "@/components/admin/Toast";

export default function NewBlogPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", coverImage: "", isPublished: false });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function titleToSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug: form.slug || titleToSlug(form.title) }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setToast({ message: err.error || "Failed to create post", type: "error" });
        setLoading(false);
        return;
      }
      setToast({ message: "Post created", type: "success" });
      setTimeout(() => router.push("/admin/blog"), 500);
    } catch {
      setToast({ message: "Failed to create post", type: "error" });
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">New Blog Post</h1>
        <p className="text-white/30 text-sm mt-1">Write a new blog article</p>
      </div>
      <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors" />
          </div>
          <div>
            <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">
              Slug <span className="text-white/20 normal-case">(auto-generated from title if empty)</span>
            </label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/[0.08] text-white font-mono px-4 py-2.5 rounded-xl text-sm focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors" />
          </div>
          <div>
            <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Excerpt</label>
            <textarea rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Content</label>
            <textarea rows={12} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/[0.08] text-white px-4 py-2.5 rounded-xl text-sm focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Cover Image</label>
            {form.coverImage && <img src={form.coverImage} alt="Cover" className="mb-3 h-32 w-48 object-cover rounded-xl" />}
            <FileUpload onUpload={(url) => setForm({ ...form, coverImage: url })} folder="blog" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 bg-white/[0.03] text-[#D4AF37] focus:ring-[#D4AF37]/20" />
            <span className="text-white/60 text-sm">Published</span>
          </label>
          <button type="submit" disabled={loading}
            className="w-full bg-[#D4AF37] hover:bg-[#C4A030] text-[#0A0A0A] font-medium py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
            {loading ? "Publishing..." : "Create Post"}
          </button>
        </form>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
