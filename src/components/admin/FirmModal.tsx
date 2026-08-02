'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Save, Plus, Trash2, Tag, DollarSign, Percent, Shield, Star, Image as ImageIcon } from 'lucide-react';
import { PropFirm, EvaluationStep, TradingPlatform } from '@/types/firm';
import { saveFirm } from '@/lib/services/firmService';

interface FirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  firmToEdit?: PropFirm | null;
}

export function FirmModal({ isOpen, onClose, onSaved, firmToEdit }: FirmModalProps) {
  const [formData, setFormData] = useState<Partial<PropFirm>>({
    name: '',
    slug: '',
    logo: '/logos/fundingpips-clover.png',
    tagline: 'High-leveraged crypto funded accounts.',
    description: 'Premier crypto prop trading firm offering institutional liquidity.',
    rating: 4.8,
    reviewCount: 500,
    featured: true,
    trending: false,
    badge: '',
    profitSplit: '90%',
    maxDrawdown: '10% Maximum',
    dailyDrawdown: '5% Daily',
    profitTarget: '8% Phase 1',
    minCapital: 5000,
    maxCapital: 300000,
    cryptoLeverage: '1:100',
    evaluationSteps: ['2-Step', '1-Step'] as EvaluationStep[],
    platforms: ['cTrader', 'MT5'] as TradingPlatform[],
    payoutFrequency: 'Bi-Weekly',
    accountTiers: [{ accountSize: 5000, price: 32, profitTarget: '8%', maxDrawdown: '10%', dailyDrawdown: '5%' }],
    verifiedCoupon: {
      id: `c-${Date.now()}`,
      firmId: '',
      firmName: '',
      code: 'PROPHUB20',
      discount: '20% OFF + 90% Split',
      description: 'Exclusive 20% discount on all challenge tiers.',
      verified: true,
    }
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (firmToEdit) {
      setFormData(firmToEdit);
    } else {
      setFormData({
        name: '',
        slug: '',
        logo: '/logos/fundingpips-clover.png',
        tagline: 'High-leveraged crypto funded accounts.',
        description: 'Premier crypto prop trading firm offering institutional liquidity.',
        rating: 4.8,
        reviewCount: 500,
        featured: true,
        trending: false,
        badge: '',
        profitSplit: '90%',
        maxDrawdown: '10% Maximum',
        dailyDrawdown: '5% Daily',
        profitTarget: '8% Phase 1',
        minCapital: 5000,
        maxCapital: 300000,
        cryptoLeverage: '1:100',
        evaluationSteps: ['2-Step', '1-Step'] as EvaluationStep[],
        platforms: ['cTrader', 'MT5'] as TradingPlatform[],
        payoutFrequency: 'Bi-Weekly',
        accountTiers: [{ accountSize: 5000, price: 32, profitTarget: '8%', maxDrawdown: '10%', dailyDrawdown: '5%' }],
        verifiedCoupon: {
          id: `c-${Date.now()}`,
          firmId: '',
          firmName: '',
          code: 'PROPHUB20',
          discount: '20% OFF + 90% Split',
          description: 'Exclusive 20% discount on all challenge tiers.',
          verified: true,
        }
      });
    }
  }, [firmToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      setError('Name and Slug are required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const formattedSlug = formData.slug.toLowerCase().replace(/\s+/g, '-');
      const dataToSave = {
        ...formData,
        slug: formattedSlug,
        verifiedCoupon: formData.verifiedCoupon ? {
          ...formData.verifiedCoupon,
          firmName: formData.name || '',
          code: formData.verifiedCoupon.code || 'PROPHUB20',
        } : undefined,
      } as PropFirm;

      await saveFirm(dataToSave);
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save firm.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto font-satoshi">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#141416] border border-zinc-800 p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {firmToEdit ? `Edit Firm: ${firmToEdit.name}` : 'Add New Prop Firm'}
            </h2>
            <p className="text-xs text-zinc-400">Configure firm details, card metrics, and promo codes</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION 1: IDENTITY */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              <span>1. Basic Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-semibold">Firm Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FundingPips"
                  value={formData.name || ''}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    setFormData({ ...formData, name, slug });
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-semibold">URL Slug *</label>
                <input
                  type="text"
                  required
                  placeholder="fundingpips"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-700 font-mono"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs text-zinc-300 font-semibold">Logo Image URL</label>
                <div className="flex items-center gap-3">
                  {formData.logo && (
                    <img src={formData.logo} alt="Preview" className="h-10 w-10 rounded-xl object-cover border border-zinc-800 shrink-0" />
                  )}
                  <input
                    type="text"
                    placeholder="/logos/fundingpips-clover.png or https://..."
                    value={formData.logo || ''}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-700 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: CARD PRIMARY METRICS */}
          <div className="space-y-4 pt-2 border-t border-zinc-800/80">
            <h3 className="text-xs uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" />
              <span>2. Card Primary Metrics</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-semibold">Min Price ($)</label>
                <input
                  type="number"
                  placeholder="32"
                  value={formData.accountTiers?.[0]?.price || 32}
                  onChange={(e) => {
                    const price = Number(e.target.value);
                    const tiers = formData.accountTiers ? [...formData.accountTiers] : [];
                    if (tiers.length > 0) tiers[0] = { ...tiers[0], price };
                    else tiers.push({ accountSize: 5000, price, profitTarget: '8%', maxDrawdown: '10%', dailyDrawdown: '5%' });
                    setFormData({ ...formData, accountTiers: tiers });
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-semibold">Profit Split</label>
                <input
                  type="text"
                  placeholder="90%"
                  value={formData.profitSplit || ''}
                  onChange={(e) => setFormData({ ...formData, profitSplit: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-semibold">Max Capital ($)</label>
                <input
                  type="number"
                  placeholder="300000"
                  value={formData.maxCapital || 300000}
                  onChange={(e) => setFormData({ ...formData, maxCapital: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: SECONDARY TAGS */}
          <div className="space-y-4 pt-2 border-t border-zinc-800/80">
            <h3 className="text-xs uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              <span>3. Card Micro Tags</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-semibold">Max Drawdown</label>
                <input
                  type="text"
                  placeholder="10% Maximum"
                  value={formData.maxDrawdown || ''}
                  onChange={(e) => setFormData({ ...formData, maxDrawdown: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-semibold">Evaluation Steps (comma-sep)</label>
                <input
                  type="text"
                  placeholder="2-Step, 1-Step"
                  value={formData.evaluationSteps?.join(', ') || ''}
                  onChange={(e) => setFormData({ ...formData, evaluationSteps: e.target.value.split(',').map(s => s.trim()) as EvaluationStep[] })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-semibold">Platforms (comma-sep)</label>
                <input
                  type="text"
                  placeholder="cTrader, MT5"
                  value={formData.platforms?.join(', ') || ''}
                  onChange={(e) => setFormData({ ...formData, platforms: e.target.value.split(',').map(s => s.trim()) as TradingPlatform[] })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Special Rule Checkboxes */}
            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.newsTradingAllowed ?? true}
                  onChange={(e) => setFormData({ ...formData, newsTradingAllowed: e.target.checked })}
                  className="h-4 w-4 rounded accent-emerald-500"
                />
                <span>News Trading</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.weekendHoldingAllowed ?? true}
                  onChange={(e) => setFormData({ ...formData, weekendHoldingAllowed: e.target.checked })}
                  className="h-4 w-4 rounded accent-emerald-500"
                />
                <span>Weekend Holding</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.eaAllowed ?? false}
                  onChange={(e) => setFormData({ ...formData, eaAllowed: e.target.checked })}
                  className="h-4 w-4 rounded accent-emerald-500"
                />
                <span>EAs & Bots</span>
              </label>
            </div>
          </div>

          {/* SECTION 4: PROMO CODE */}
          <div className="space-y-4 pt-2 border-t border-zinc-800/80">
            <h3 className="text-xs uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
              <Percent className="h-3.5 w-3.5" />
              <span>4. Verified Coupon Deal</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-semibold">Promo Code</label>
                <input
                  type="text"
                  placeholder="PROPHUB20"
                  value={formData.verifiedCoupon?.code || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    verifiedCoupon: { ...formData.verifiedCoupon, code: e.target.value } as any
                  })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-semibold">Discount Description</label>
                <input
                  type="text"
                  placeholder="20% OFF + 90% Split"
                  value={formData.verifiedCoupon?.discount || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    verifiedCoupon: { ...formData.verifiedCoupon, discount: e.target.value } as any
                  })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-[#52b788] font-bold"
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: RATING & BADGES */}
          <div className="space-y-4 pt-2 border-t border-zinc-800/80">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-semibold">Rating (1-5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={formData.rating || 4.9}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-semibold">Review Count</label>
                <input
                  type="number"
                  value={formData.reviewCount || 500}
                  onChange={(e) => setFormData({ ...formData, reviewCount: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 rounded accent-emerald-500"
                />
                <label htmlFor="featured" className="text-xs text-zinc-300 font-semibold">Featured</label>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="trending"
                  checked={formData.trending || false}
                  onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                  className="h-4 w-4 rounded accent-emerald-500"
                />
                <label htmlFor="trending" className="text-xs text-zinc-300 font-semibold">Trending</label>
              </div>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-bold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="py-2.5 px-6 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : firmToEdit ? 'Save Changes' : 'Create Firm'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
