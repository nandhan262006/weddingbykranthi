"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiPlus, HiPencilSquare, HiTrash } from "react-icons/hi2";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import Toast from "@/components/admin/Toast";
import { TableSkeleton } from "@/components/admin/Skeleton";

interface Service {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const loadData = () => {
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((json) => {
        if (!json.error) setServices(json);
        else setServices([]);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/services/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setToast({ message: "Service deleted", type: "success" });
      loadData();
    } catch {
      setToast({ message: "Failed to delete service", type: "error" });
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  }

  if (!services) return <TableSkeleton rows={4} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Content</h1>
          <h2 className="text-2xl font-semibold text-white">Services</h2>
          <p className="text-white/30 text-sm mt-1">Manage your photography services</p>
        </div>
        <Link
          href="/admin/services/new"
          className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8960E] text-[#0A0A0A] px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <HiPlus className="w-4 h-4" />
          Add Service
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div key={service.id} className="group bg-[#0A0A0A] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-[#D4AF37]/20 transition-all duration-300">
            {service.image ? (
              <div className="relative h-48">
                <Image src={service.image} alt={service.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 to-transparent" />
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-[#D4AF37]/[0.04] to-transparent flex items-center justify-center">
                <span className="text-white/[0.06] text-5xl font-serif">K</span>
              </div>
            )}
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <h3 className="text-white font-semibold truncate">{service.title}</h3>
                  {service.subtitle && <p className="text-white/30 text-sm mt-0.5 truncate">{service.subtitle}</p>}
                </div>
                <span className={`shrink-0 text-[11px] px-2.5 py-1 rounded-lg font-medium ${service.isActive ? "bg-emerald-500/[0.08] text-emerald-400 border border-emerald-500/[0.12]" : "bg-white/[0.04] text-white/25 border border-white/[0.06]"}`}>
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Link
                  href={`/admin/services/${service.id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/[0.03] text-white/60 px-3 py-2.5 rounded-xl text-sm hover:bg-white/[0.06] hover:text-white transition-all"
                >
                  <HiPencilSquare className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => setDeleteId(service.id)}
                  className="flex items-center justify-center gap-2 bg-red-500/[0.06] text-red-400 px-3 py-2.5 rounded-xl text-sm hover:bg-red-500/[0.12] transition-all"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-20 bg-[#0A0A0A] border border-white/[0.06] rounded-2xl">
          <p className="text-white/20 font-medium mb-4">No services yet</p>
          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8960E] text-[#0A0A0A] px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <HiPlus className="w-4 h-4" />
            Add your first service
          </Link>
        </div>
      )}

      <DeleteConfirm open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete this service?" loading={loading} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
