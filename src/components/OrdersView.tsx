import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  DollarSign,
  CheckCircle,
  Clock,
  Shield,
  Eye,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { Language, translations } from '../i18n.js';
import { OrderBooking, Website } from '../types.js';

interface OrdersViewProps {
  currentLang: Language;
  orders: OrderBooking[];
  websites: Website[];
  selectedWebsiteId: string;
  onCreateOrder: (order: Partial<OrderBooking>) => Promise<void>;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  currentLang,
  orders,
  websites,
  selectedWebsiteId,
  onCreateOrder,
}) => {
  const t = translations[currentLang];
  const [siteFilter, setSiteFilter] = useState<string>(selectedWebsiteId);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [inspectOrder, setInspectOrder] = useState<OrderBooking | null>(null);

  const filtered = orders.filter((o) => {
    const matchSite = siteFilter === 'all' || o.website_id === siteFilter;
    const matchStatus = statusFilter === 'all' || o.paymentStatus === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      o.title.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.referenceCode.toLowerCase().includes(q);
    return matchSite && matchStatus && matchSearch;
  });

  const totalAmount = filtered.reduce((acc, o) => acc + o.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-[#D4AF37]" />
            {t.ordersAndBookings}
          </h1>
          <p className="text-xs text-neutral-400">
            Central ledger for wedding decor advances, store orders, tuition fees, and freelance escrow.
          </p>
        </div>

        <div className="bg-[#18261A] border border-[#2A3E2D] px-4 py-2 rounded-xl text-xs flex items-center gap-3">
          <span className="text-neutral-400">Filtered Volume:</span>
          <span className="font-extrabold text-[#D4AF37] text-base">
            PKR {totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#18261A] border border-[#2A3E2D] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-[260px] bg-[#1E2E21] border border-[#2D4532] px-3 py-2 rounded-xl text-xs">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reference, customer name, title..."
            className="bg-transparent text-white placeholder-neutral-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="bg-[#1E2E21] border border-[#2D4532] text-neutral-300 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#18261A] text-white">All Websites</option>
            {websites.map((w) => (
              <option key={w.id} value={w.id} className="bg-[#18261A] text-white">
                {w.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1E2E21] border border-[#2D4532] text-neutral-300 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#18261A] text-white">All Payment Statuses</option>
            <option value="paid" className="bg-[#18261A] text-white">Paid</option>
            <option value="advance_paid" className="bg-[#18261A] text-white">Advance Paid (20%)</option>
            <option value="escrow" className="bg-[#18261A] text-white">Escrow Milestone</option>
            <option value="pending" className="bg-[#18261A] text-white">Pending</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#18261A] border border-[#2A3E2D] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#142016] text-[#A0B0A2] uppercase tracking-wider font-semibold border-b border-[#2A3E2D] text-[10px]">
              <tr>
                <th className="py-3 px-4">Reference & Type</th>
                <th className="py-3 px-4">Transaction / Booking</th>
                <th className="py-3 px-4">Origin Website</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243526]">
              {filtered.map((ord) => {
                const site = websites.find((w) => w.id === ord.website_id);
                return (
                  <tr key={ord.id} className="hover:bg-[#1E2E21]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#D4AF37]">
                      {ord.referenceCode}
                      <span className="block text-[10px] text-neutral-400 font-sans uppercase">
                        {ord.type.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white max-w-xs truncate">
                        {ord.title}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-300 font-medium truncate max-w-[150px]">
                      {site ? site.name : ord.website_id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white">{ord.customerName}</div>
                      <div className="text-[10px] text-neutral-400">{ord.customerEmail}</div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-white">
                      {ord.currency} {ord.amount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          ord.paymentStatus === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : ord.paymentStatus === 'advance_paid'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : ord.paymentStatus === 'escrow'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {ord.paymentStatus.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setInspectOrder(ord)}
                        className="p-1.5 rounded-lg bg-[#223625] hover:bg-[#2C4530] text-[#D4AF37] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Order Modal */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18261A] border border-[#2D4532] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#2C412F]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                Transaction {inspectOrder.referenceCode}
              </h3>
              <button onClick={() => setInspectOrder(null)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase">Title</span>
                <p className="font-bold text-white text-sm">{inspectOrder.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#121C14] p-3 rounded-xl">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase">Customer</span>
                  <p className="text-white font-medium">{inspectOrder.customerName}</p>
                  <p className="text-neutral-400 text-[10px]">{inspectOrder.customerEmail}</p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase">Amount</span>
                  <p className="text-[#D4AF37] font-bold text-base">{inspectOrder.currency} {inspectOrder.amount.toLocaleString()}</p>
                  <span className="text-[10px] text-emerald-400 uppercase">{inspectOrder.paymentStatus}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 uppercase mb-1 block">Transaction Details & Metadata</span>
                <pre className="bg-[#0E150F] border border-[#243526] p-3 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto">
                  {JSON.stringify(inspectOrder.details, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#2C412F]">
              <button
                onClick={() => setInspectOrder(null)}
                className="px-4 py-2 rounded-xl bg-[#223625] text-neutral-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
