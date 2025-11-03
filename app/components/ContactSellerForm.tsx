"use client";

import { useState } from "react";

type StorageItem = { Model?: string; Size_GB?: number; Type?: string; BusType?: string; size?: number; type?: string };

type Listing = {
  id: string;
  Brand: string;
  Model: string;
  CPU: string;
  RAM_GB: string;
  RAM_Type: string;
  RAM_Speed_MHz: string;
  Storage: StorageItem[];
  GPU: string;
  Display_Resolution: string;
  Screen_Size_inch: number;
  OS: string;
  price: number;
  description: string;
  images: string[];
};

export default function ContactSellerForm({ listing }: { listing: Listing }) {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    try {
      const specs = {
        brand: listing.Brand,
        model: listing.Model,
        cpu: listing.CPU,
        ram: `${listing.RAM_GB} ${listing.RAM_Type} ${listing.RAM_Speed_MHz}MHz`,
        storage: (listing.Storage || []).map((s) => ({
          model: s.Model,
          size_gb: s.Size_GB ?? s.size,
          type: s.Type ?? s.type,
          bus: s.BusType,
        })),
        gpu: listing.GPU,
        display: `${listing.Screen_Size_inch}\" ${listing.Display_Resolution}`,
        os: listing.OS,
        price_etb: listing.price,
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listing.id, phone, message, specs }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to send order");
      setStatus({ ok: true, msg: "Request sent successfully" });
      setPhone("");
      setMessage("");
    } catch (err: any) {
      setStatus({ ok: false, msg: err?.message || "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-3">Contact Seller</h3>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Phone number</label>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +251 9 12 34 56 78"
            className="w-full rounded-md border border-gray-300 bg-white p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Message</label>
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message in any language"
            className="w-full min-h-24 rounded-md border border-gray-300 bg-white p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send request"}
        </button>
        {status && (
          <div className={`text-sm ${status.ok ? "text-green-600" : "text-red-600"}`}>{status.msg}</div>
        )}
      </form>
    </div>
  );
}
