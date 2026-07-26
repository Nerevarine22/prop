'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, ExternalLink, ShieldCheck, Star, Percent, RefreshCw, AlertCircle } from 'lucide-react';
import { PropFirm } from '@/types/firm';
import { getFirms, deleteFirm } from '@/lib/services/firmService';
import { FirmModal } from '@/components/admin/FirmModal';

export default function AdminDashboardPage() {
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState<PropFirm | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchFirms = async () => {
    setLoading(true);
    try {
      const data = await getFirms();
      setFirms(data);
    } catch (err) {
      console.error('Failed to load firms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFirms();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteFirm(id);
      setDeleteConfirmId(null);
      fetchFirms();
    } catch (err) {
      alert('Failed to delete firm');
    }
  };

  const filteredFirms = firms.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.verifiedCoupon?.code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-satoshi">
      
      {/* Top Action Bar & Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Prop Firm Management</h1>
          <p className="text-xs text-zinc-400 font-medium">Create, edit, and delete firm cards and promo deals in real-time</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchFirms}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              setSelectedFirm(null);
              setIsModalOpen(true);
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Firm</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#141416] border border-zinc-800/80 space-y-1">
          <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">Total Active Firms</span>
          <span className="text-2xl font-bold text-white block font-mono">{firms.length}</span>
        </div>

        <div className="p-4 rounded-xl bg-[#141416] border border-zinc-800/80 space-y-1">
          <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">Verified Coupons</span>
          <span className="text-2xl font-bold text-[#52b788] block font-mono">
            {firms.filter(f => f.verifiedCoupon).length}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#141416] border border-zinc-800/80 space-y-1">
          <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">Average Rating</span>
          <span className="text-2xl font-bold text-amber-400 block font-mono">
            {firms.length ? (firms.reduce((acc, f) => acc + f.rating, 0) / firms.length).toFixed(2) : '4.8'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#141416] border border-zinc-800/80 space-y-1">
          <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">Instant Funding Firms</span>
          <span className="text-2xl font-bold text-sky-400 block font-mono">
            {firms.filter(f => f.evaluationSteps.includes('Instant Funding')).length}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by firm name, slug or promo code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 font-medium"
        />
      </div>

      {/* Data Table */}
      <div className="rounded-2xl bg-[#141416] border border-zinc-800/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            <thead className="bg-zinc-900/80 text-zinc-400 uppercase font-semibold text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">Prop Firm</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Profit Split</th>
                <th className="py-3.5 px-4">Max Funding</th>
                <th className="py-3.5 px-4">Verified Coupon</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/60 font-medium text-zinc-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    Loading firms dataset...
                  </td>
                </tr>
              ) : filteredFirms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    No prop firms match your search.
                  </td>
                </tr>
              ) : (
                filteredFirms.map((firm) => {
                  const minPrice = firm.accountTiers?.[0]?.price ? `$${firm.accountTiers[0].price}` : '$29';
                  const formattedMaxCapital = `$${Math.round(firm.maxCapital / 1000)}K`;

                  return (
                    <tr key={firm.id} className="hover:bg-zinc-900/40 transition-colors">
                      
                      {/* Firm Name & Logo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img src={firm.logo} alt={firm.name} className="h-10 w-10 rounded-xl object-cover border border-zinc-800 shrink-0" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white text-xs truncate">{firm.name}</span>
                              {firm.featured && (
                                <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">FEATURED</span>
                              )}
                            </div>
                            <span className="text-[11px] text-zinc-500 font-mono">/firms/{firm.slug}</span>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-mono text-white font-bold">
                        {minPrice}
                      </td>

                      {/* Profit Split */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#52b788]">
                        {firm.profitSplit}
                      </td>

                      {/* Max Funding */}
                      <td className="py-3.5 px-4 font-mono text-white font-bold">
                        {formattedMaxCapital}
                      </td>

                      {/* Coupon */}
                      <td className="py-3.5 px-4">
                        {firm.verifiedCoupon ? (
                          <div className="inline-flex items-center gap-1 text-[11px] font-mono text-[#52b788] bg-[#52b788]/10 px-2 py-0.5 rounded border border-[#52b788]/20">
                            <span>Code: <strong>{firm.verifiedCoupon.code}</strong></span>
                          </div>
                        ) : (
                          <span className="text-zinc-600 text-[11px]">None</span>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-zinc-300 font-mono">
                          <Star className="h-3.5 w-3.5 text-zinc-400 stroke-[1.5]" />
                          <span>{firm.rating.toFixed(1)}</span>
                          <span className="text-zinc-600 text-[10px]">({firm.reviewCount})</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/firms/${firm.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                            title="Preview Firm Page"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>

                          <button
                            onClick={() => {
                              setSelectedFirm(firm);
                              setIsModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700"
                            title="Edit Firm"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          {deleteConfirmId === firm.id ? (
                            <button
                              onClick={() => handleDelete(firm.id)}
                              className="px-2.5 py-1 rounded-lg bg-red-500 text-white font-bold text-[10px]"
                            >
                              Confirm
                            </button>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(firm.id)}
                              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-500/20"
                              title="Delete Firm"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Firm Create/Edit Modal */}
      <FirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchFirms}
        firmToEdit={selectedFirm}
      />

    </div>
  );
}
