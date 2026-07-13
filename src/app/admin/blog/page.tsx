"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiPlus, HiPencilSquare, HiTrash } from "react-icons/hi2";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import Toast from "@/components/admin/Toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  createdAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then((json) => {
        if (!json.error) setPosts(json);
        else setPosts([]);
      });
  }, []);

  const refetch = () => {
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then((json) => {
        if (!json.error) setPosts(json);
      });
  };

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blog/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setToast({ message: "Post deleted", type: "success" });
      refetch();
    } catch {
      setToast({ message: "Failed to delete post", type: "error" });
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-white/30 text-sm mt-1">Manage your blog articles</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C4A030] text-[#0A0A0A] px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-lg shadow-[#D4AF37]/10"
        >
          <HiPlus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-5 py-3 text-white/30 text-xs font-medium uppercase tracking-wider">Title</th>
                <th className="text-left px-5 py-3 text-white/30 text-xs font-medium uppercase tracking-wider">Slug</th>
                <th className="text-left px-5 py-3 text-white/30 text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-white/30 text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-3 text-white/30 text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-white text-sm font-medium">{p.title}</td>
                  <td className="px-5 py-3.5 text-white/30 text-sm font-mono">{p.slug}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                      p.isPublished ? "bg-green-500/15 text-green-300" : "bg-yellow-500/15 text-yellow-300"
                    }`}>
                      {p.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-white/30 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog/${p.id}`}
                        className="p-2 bg-white/[0.04] text-white/60 rounded-lg hover:bg-white/[0.08] hover:text-white transition-colors"
                      >
                        <HiPencilSquare className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-white/20 text-sm">No blog posts yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirm open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete this post?" loading={loading} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
