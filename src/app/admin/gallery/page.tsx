"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiPlus, HiPencilSquare, HiTrash } from "react-icons/hi2";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import Toast from "@/components/admin/Toast";

interface GalleryItem {
  id: string;
  title: string;
  src: string;
  alt: string | null;
  span: string | null;
  isActive: boolean;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then((json) => {
        if (!json.error) setItems(json);
        else setItems([]);
      });
  }, []);

  const refetch = () => {
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then((json) => {
        if (!json.error) setItems(json);
      });
  };

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/gallery/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setToast({ message: "Image deleted", type: "success" });
      refetch();
    } catch {
      setToast({ message: "Failed to delete image", type: "error" });
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gallery</h1>
          <p className="text-white/30 text-sm mt-1">Manage your portfolio images</p>
        </div>
        <Link
          href="/admin/gallery/new"
          className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C4A030] text-[#0A0A0A] px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-lg shadow-[#D4AF37]/10"
        >
          <HiPlus className="w-4 h-4" />
          Add Image
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/[0.06] hover:border-[#D4AF37]/20 transition-all duration-300"
          >
            <Image src={item.src} alt={item.alt || item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-medium text-sm truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Link
                    href={`/admin/gallery/${item.id}`}
                    className="p-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <HiPencilSquare className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            {!item.isActive && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-[#0A0A0A]/80 backdrop-blur-sm text-white/40 text-[10px] rounded-full font-medium">
                Draft
              </div>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 bg-[#0A0A0A] border border-white/[0.06] rounded-2xl">
          <p className="text-white/30 mb-4">No gallery images yet</p>
          <Link
            href="/admin/gallery/new"
            className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C4A030] text-[#0A0A0A] px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
          >
            <HiPlus className="w-4 h-4" />
            Add your first image
          </Link>
        </div>
      )}

      <DeleteConfirm open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete this image?" loading={loading} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
