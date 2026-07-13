"use client";

import { useEffect, useState } from "react";
import { HiEnvelope, HiPhone, HiTrash, HiEye, HiEnvelopeOpen } from "react-icons/hi2";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import Toast from "@/components/admin/Toast";
import { TableSkeleton } from "@/components/admin/Skeleton";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  date: string | null;
  eventType: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewContact, setViewContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then((json) => {
        if (!json.error) setContacts(json);
        else setContacts([]);
      });
  }, []);

  const refetchContacts = () => {
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then((json) => {
        if (!json.error) setContacts(json);
      });
  };

  async function markRead(id: string) {
    await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: true }),
    });
    refetchContacts();
    setViewContact((prev) => (prev && prev.id === id ? { ...prev, isRead: true } : prev));
  }

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/contacts/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setToast({ message: "Contact deleted", type: "success" });
      refetchContacts();
    } catch {
      setToast({ message: "Failed to delete contact", type: "error" });
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  }

  if (!contacts) return <TableSkeleton rows={5} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Contact Submissions</h1>
        <p className="text-white/30 text-sm mt-1">
          {contacts.filter((c) => !c.isRead).length > 0
            ? `${contacts.filter((c) => !c.isRead).length} unread submission${contacts.filter((c) => !c.isRead).length !== 1 ? "s" : ""}`
            : "All messages read"}
        </p>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-6 py-4 text-white/30 font-medium text-xs uppercase tracking-wider w-8" />
                <th className="text-left px-6 py-4 text-white/30 font-medium text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-4 text-white/30 font-medium text-xs uppercase tracking-wider">Details</th>
                <th className="text-left px-6 py-4 text-white/30 font-medium text-xs uppercase tracking-wider">Event</th>
                <th className="text-left px-6 py-4 text-white/30 font-medium text-xs uppercase tracking-wider">Date</th>
                <th className="text-right px-6 py-4 text-white/30 font-medium text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className={`border-b border-white/[0.03] last:border-0 transition-colors ${!c.isRead ? "bg-[#D4AF37]/[0.02] hover:bg-[#D4AF37]/[0.04]" : "hover:bg-white/[0.01]"}`}>
                  <td className="px-6 py-4">
                    {!c.isRead && <span className="w-2 h-2 rounded-full bg-[#D4AF37] inline-block" />}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{c.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-white/30 text-xs">
                        <HiEnvelope className="w-3 h-3" />
                        {c.email}
                      </div>
                      {c.phone && (
                        <div className="flex items-center gap-1.5 text-white/20 text-xs">
                          <HiPhone className="w-3 h-3" />
                          {c.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white/40 text-xs">{c.eventType || "—"}</span>
                  </td>
                  <td className="px-6 py-4 text-white/30 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setViewContact(c); if (!c.isRead) markRead(c.id); }}
                        className="flex items-center gap-1.5 bg-white/[0.03] text-white/50 px-3 py-2 rounded-lg text-xs hover:bg-white/[0.06] hover:text-white transition-all"
                      >
                        <HiEye className="w-3.5 h-3.5" />
                        View
                      </button>
                      <button
                        onClick={() => setDeleteId(c.id)}
                        className="flex items-center gap-1.5 bg-red-500/[0.06] text-red-400 px-3 py-2 rounded-lg text-xs hover:bg-red-500/[0.12] transition-all"
                      >
                        <HiTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {contacts.length === 0 && (
        <div className="text-center py-20 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.02] flex items-center justify-center mb-4">
            <HiEnvelopeOpen className="w-8 h-8 text-white/10" />
          </div>
          <p className="text-white/20 font-medium">No contact submissions yet</p>
        </div>
      )}

      {/* View modal */}
      {viewContact && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewContact(null)} />
          <div className="relative bg-[#111111] border border-white/[0.08] rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{viewContact.name}</h3>
                  <p className="text-white/20 text-xs mt-1">{new Date(viewContact.createdAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setViewContact(null)}
                  className="text-white/30 hover:text-white transition-colors p-1"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/30 text-[11px] uppercase tracking-wider mb-1">Email</p>
                  <p className="text-white/60 text-sm">{viewContact.email}</p>
                </div>
                <div>
                  <p className="text-white/30 text-[11px] uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-white/60 text-sm">{viewContact.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-white/30 text-[11px] uppercase tracking-wider mb-1">Event Date</p>
                  <p className="text-white/60 text-sm">{viewContact.date || "—"}</p>
                </div>
                <div>
                  <p className="text-white/30 text-[11px] uppercase tracking-wider mb-1">Event Type</p>
                  <p className="text-white/60 text-sm">{viewContact.eventType || "—"}</p>
                </div>
              </div>

              <div>
                <p className="text-white/30 text-[11px] uppercase tracking-wider mb-2">Message</p>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{viewContact.message}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirm open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete this contact?" loading={loading} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
