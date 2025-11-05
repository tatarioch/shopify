"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ContactSection from "./components/ContactSection";
type StorageItem = { Model: string; Size_GB: number; Type: string; BusType: string };
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
  battery:string;
  Display_Resolution: string;
  Screen_Size_inch: number;
  OS: string;
  price: number;
  description: string;
  images: string[];
  imageUrl: string | null;
  createdAt: string;
  negotiable:string;
  status: string;
};

function prettyStorage(items: StorageItem[]) {
  if (!items?.length) return "—";
  const kinds = Array.from(new Set(items.map(s => [s.Type, s.BusType].filter(Boolean).join(" ")))).filter(Boolean).join(", ");
  const total = items.reduce((sum, s) => sum + (Number(s.Size_GB) || 0), 0);
  return `${Math.round(total)} GB${kinds ? ` · ${kinds}` : ""}`;
}

export default function BuyerPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">(0);
  const [maxPrice, setMaxPrice] = useState<number | "">(0);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [typedTitle, setTypedTitle] = useState("");
  const [showCaret, setShowCaret] = useState(true);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [lockFromMin, setLockFromMin] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const full = "Welcome to PC Bazaar";
    let i = 0;
    const typer = setInterval(() => {
      setTypedTitle(full.slice(0, i + 1));
      i++;
      if (i >= full.length) clearInterval(typer);
    }, 55);
    const caretBlink = setInterval(() => setShowCaret((v) => !v), 500);
    return () => {
      clearInterval(typer);
      clearInterval(caretBlink);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const t = Date.now();
        const res = await fetch(`/api/listings?t=${t}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load listings: ${res.status}`);
        const data = await res.json();
        if (!cancelled) setListings(data.data || []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load listings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const commonBrands = useMemo(() => [
    "HP","Dell","Lenovo","ASUS","Acer","Apple","MSI","Samsung","Toshiba","Microsoft","Razer","LG","Huawei"
  ], []);
  const brandOptionsAll = useMemo(() => {
    const dynamic = Array.from(new Set((listings || []).map(l => (l.Brand || "").trim()))).filter(Boolean);
    return Array.from(new Set([...commonBrands, ...dynamic])).sort((a,b)=>a.localeCompare(b));
  }, [listings, commonBrands]);

  const priceMax = useMemo(() => {
    const values = (listings || []).map(l => Number(l.price) || 0);
    return values.length ? Math.max(...values) : 0;
  }, [listings]);

  useEffect(() => {
    if ((maxPrice === 0 || maxPrice === "") && priceMax > 0) {
      setMaxPrice(priceMax);
    }
    // Clamp min to not exceed max
    if (typeof minPrice === 'number' && typeof maxPrice === 'number' && minPrice > maxPrice) {
      setMinPrice(maxPrice);
    }
    // reset to first page when bounds change significantly
    setPage(1);
  }, [priceMax]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((l) => {
      const haystack = [
        l.Brand,
        l.Model,
        l.CPU,
        l.GPU,
        l.OS,
        l.RAM_GB,
        l.RAM_Type,
        l.RAM_Speed_MHz,
        l.Display_Resolution,
        String(l.Screen_Size_inch || ""),
        l.description,
        prettyStorage(l.Storage),
        ...(l.Storage || []).flatMap((s) => [s.Model, String(s.Size_GB || ""), s.Type, s.BusType]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (q && !haystack.includes(q)) return false;
      if (minPrice !== "" && typeof minPrice === "number" && l.price < minPrice) return false;
      if (maxPrice !== "" && typeof maxPrice === "number" && l.price > maxPrice) return false;
      if (selectedBrand && (l.Brand || "").trim() !== selectedBrand) return false;
      return true;
    });
  }, [query, listings, minPrice, maxPrice, selectedBrand]);

  useEffect(() => {
    setPage(1);
  }, [query, selectedBrand, minPrice, maxPrice]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / pageSize)), [filtered.length]);
  const startIndex = (page - 1) * pageSize;
  const paged = useMemo(() => filtered.slice(startIndex, startIndex + pageSize), [filtered, startIndex, pageSize]);

  const minBound = 0;
  const maxBound = priceMax || 0;
  const minVal = typeof minPrice === 'number' ? minPrice : 0;
  const maxVal = typeof maxPrice === 'number' ? maxPrice : maxBound;
  const rangeSize = Math.max(maxBound - minBound, 1);
  const minPct = ((minVal - minBound) / rangeSize) * 100;
  const maxPct = ((maxVal - minBound) / rangeSize) * 100;

  // When lock is on, keep max at or above min+1
  useEffect(() => {
    if (!lockFromMin) return;
    if (typeof minPrice === 'number' && typeof maxPrice === 'number' && maxPrice <= minPrice) {
      setMaxPrice(minPrice + 1);
    }
  }, [lockFromMin, minPrice]);
  return ( <>
 <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 mt-6">
      <div className="mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight">
          {typedTitle}
          <span className={`inline-block w-0.5 h-6 align-[-2px] ml-1 bg-gray-900 transition-opacity ${showCaret ? 'opacity-80' : 'opacity-0'}`}></span>
        </h1>
        <p className="mt-2 text-sm text-gray-600 italic">Find the best laptops and PCs tailored for you</p>
      </div>
      <div className="mb-6">
        <div className="mt-4 rounded-2xl ring-1 ring-gray-100 bg-gradient-to-b from-white to-slate-50 p-4 shadow-md">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-gray-600"><path d="M3 5.25A.75.75 0 0 1 3.75 4.5h16.5a.75.75 0 0 1 .53 1.28l-6.03 6.03v5.19a.75.75 0 0 1-1.2.6l-3-2.25a.75.75 0 0 1-.3-.6v-2.94L3.22 5.78A.75.75 0 0 1 3 5.25Z"/></svg>
                <span>Price range</span>
              </div>
              <div className="px-1">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-gray-600 mb-1">
                      <span>Min: {typeof minPrice === 'number' ? minPrice.toLocaleString() : 0} ETB</span>
                      <span className="text-gray-400">0 — {maxBound.toLocaleString()} ETB</span>
                    </div>
                    <input
                      type="range"
                      min={minBound}
                      max={Math.max(minBound + 1, maxVal - 1)}
                      value={minVal}
                      onChange={(e) => {
                        const v = Math.min(Number(e.target.value), maxVal - 1);
                        setMinPrice(v);
                        if (lockFromMin && typeof maxPrice === 'number' && maxPrice <= v) setMaxPrice(v + 1);
                        setSelectedBrand("");
                        setPage(1);
                      }}
                      className="w-full accent-emerald-600"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-gray-600 mb-1">
                      <span>Max: {typeof maxPrice === 'number' ? maxPrice.toLocaleString() : 0} ETB</span>
                      <span className="text-gray-400">{minVal.toLocaleString()} — {maxBound.toLocaleString()} ETB</span>
                    </div>
                    <input
                      type="range"
                      min={Math.min(maxBound - 1, minVal + 1)}
                      max={maxBound}
                      value={maxVal}
                      onChange={(e) => {
                        const v = Math.max(Number(e.target.value), minVal + 1);
                        setMaxPrice(v);
                        setSelectedBrand("");
                        setPage(1);
                      }}
                      className="w-full accent-emerald-600"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-xs text-gray-700">
                    Lock max to start from min
                  </label>

                  <div className="h-1 rounded-full bg-gray-200 relative overflow-hidden">
                    <div className="absolute h-full bg-emerald-500" style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-600">
                    <span>{typeof minPrice === 'number' ? minPrice.toLocaleString() : 0} ETB</span>
                    <span>{typeof maxPrice === 'number' ? maxPrice.toLocaleString() : 0} ETB</span>
                  </div>
                </div>
              </div>
              
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-gray-600"><path d="M4.5 6.75A2.25 2.25 0 0 1 6.75 4.5h10.5A2.25 2.25 0 0 1 19.5 6.75v10.5A2.25 2.25 0 0 1 17.25 19.5H6.75A2.25 2.25 0 0 1 4.5 17.25V6.75Z"/></svg>
                <span>Brand</span>
              </label>
              <select
                value={selectedBrand}
                onChange={(e)=> { setSelectedBrand(e.target.value); setMinPrice(0); setMaxPrice(priceMax || 0); setPage(1); }}
                className="w-full rounded-lg border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
              >
                <option value="">Any</option>
                {brandOptionsAll.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-700 flex items-center gap-2">
                <svg className="h-4 w-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M10 3.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm0-1.5a8 8 0 1 0 4.906 14.32l4.637 4.637a1 1 0 0 0 1.414-1.414l-4.637-4.637A8 8 0 0 0 10 2Z"/></svg>
                <span>Search</span>
              </label>
              <div className="relative">
                <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M10 3.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm0-1.5a8 8 0 1 0 4.906 14.32l4.637 4.637a1 1 0 0 0 1.414-1.414l-4.637-4.637A8 8 0 0 0 10 2Z"/></svg>
                <input
                  placeholder="Search brand, model, CPU, RAM ..."
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all placeholder-gray-400"
                />
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-gray-600">{filtered.length} results</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setMinPrice(0); setMaxPrice(priceMax || 0); setSelectedBrand(""); setQuery(""); setPage(1); }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Available heading below filters */}
      <div className="mb-3">
        <h2 className="text-xl font-semibold text-gray-900">Available PCs</h2>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="h-4 w-1/2 rounded bg-zinc-200 mb-2" />
              <div className="h-48 rounded-lg bg-zinc-100 mb-3" />
              <div className="h-3 w-2/3 rounded bg-zinc-100 mb-2" />
              <div className="h-3 w-1/2 rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((l) => (
            <a
              key={l.id}
              href={`/listings/${l.id}`}
              className="group block rounded-b-xl bg-white shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.99] overflow-hidden"
            >
              {l.imageUrl && (
                <div className="relative   mt-1 h-44 sm:h-48 w-full mb-3 overflow-hidden  flex items-center justify-center -mx-2">
                  <div className="absolute right-2 top-2 z-10">
                    <div className="bg-gradient-to-r from-red-500 to-pink-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm rounded backdrop-blur-sm">
                      -2%
                    </div>
                  </div>
                  <img
                    src={l.images?.[0]}
                    alt={`${l.Brand} ${l.Model}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-laptop.jpg';
                    }}
                  />
                  <img
                    src={l.images?.[1]}
                    alt={`${l.Brand} ${l.Model}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-laptop.jpg';
                    }}
                  />
                </div>

              )}
              <div className="px-3 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wide text-blue-700">{l.Brand}</div>
                    <div className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">{l.Model}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-gray-500 line-through">{l.price?.toLocaleString()} ETB</div>
                    <div className="text-base font-bold text-emerald-700">{Math.round((l.price || 0) * 0.98).toLocaleString()} ETB</div>
                  </div>
                </div>
              </div>
             
              <div className="px-3 mb-4 space-y-1.5 text-xs text-gray-800">
                 <div className="flex items-start">
                  <span className="text-black font-medium min-w-[60px] ">CPU:</span>
                  <span className="flex-1 line-clamp-1">{l.CPU}</span>
                  
                </div>
                <div className="flex items-start">
                  <span className="text-black font-medium min-w-[60px]">RAM:</span>
                  <span className="flex-1">{l.RAM_GB}GB {l.RAM_Type}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-black font-medium min-w-[60px]">GPU:</span>
                  <span className="flex-1 line-clamp-1 font-sans">{l.GPU}</span>
                </div>
                <div className="hidden sm:flex items-start">
                  <span className="text-black font-medium min-w-[60px]">Storage:</span>
                  <span className="flex-1 line-clamp-1">{prettyStorage(l.Storage)}</span>
                </div>
                <div className="hidden sm:flex items-start">
                  <span className="text-black font-medium min-w-[60px]">Battery:</span>
                  <span className="flex-1 line-clamp-1">{(l.battery)} hrs</span>
                </div>
                 {l.negotiable && (
                <div className="mb-3 text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  <strong>Note:</strong> Price is negotiable.
                </div>
              )}
              </div>
              <div className="px-3 pb-3 w-full">
                <div className="rounded-lg bg-white py-2.5 text-center text-sm font-semibold text-black shadow-sm hover:bg-gray-100 transition-colors">
                  View Details
                </div>
              </div>
            </a>
          ))}
          {!filtered.length && (
            <div className="col-span-full rounded-md border border-gray-200 bg-white p-6 sm:p-8 text-center text-sm text-zinc-600">
              {query ? (
                <div>
                  <p className="mb-2 text-base font-medium">No listings found</p>
                  <p className="text-sm">Try adjusting your search terms</p>
                </div>
              ) : (
                <div>
                  <p className="mb-2 text-base font-medium">No published listings yet</p>
                  <p className="text-sm">Please check back later</p>
                </div>
              )}
            </div>
          )}
        </div>
        {filtered.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center">
            <div className="inline-flex rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              {Array.from({ length: totalPages }).slice(0, Math.min(totalPages, 9)).map((_, i) => {
                const p = i + 1;
                const active = p === page;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-2 text-sm transition-colors ${active ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        </>
      )}
    </div>
    <div id="contact">
 <ContactSection />
    </div>
   
    </>
  );
}