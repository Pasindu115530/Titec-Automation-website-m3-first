'use client';

import React, { useState, useEffect } from 'react';
import { quotationService } from '@/services/quotationService';
import { Quotation } from '@/types/quotation';
import QuotationModal from '@/components/admin/quotation-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus, RefreshCw, Send, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminQuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');

  // Filter & Pagination State
  const [statusFilter, setStatusFilter] = useState<'pending' | 'quoted'>('pending');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Modal State
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'reply' | 'direct'>('reply');

  // Race condition handling
  const activeStatus = React.useRef(statusFilter);

  useEffect(() => {
    activeStatus.current = statusFilter;
    setPage(1);
    setQuotations([]);
    loadQuotations(1, statusFilter, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const loadQuotations = async (pageNum: number, status: string, isInitial: boolean) => {
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await quotationService.getQuotationRequests(pageNum, status);

      if (status !== activeStatus.current) {
        return;
      }

      const newQuotations = response.data || [];

      if (isInitial) {
        setQuotations(newQuotations);
      } else {
        setQuotations((prev) => [...prev, ...newQuotations]);
      }

      setHasMore(response.current_page < response.last_page);
    } catch (error) {
      console.error('Failed to load quotations', error);
      toast.error('Failed to load quotations');
    } finally {
      if (status === activeStatus.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadQuotations(nextPage, statusFilter, false);
  };

  const handleReplyClick = (request: any) => {
    setSelectedRequest(request);
    setModalMode('reply');
    setIsModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSendQuotation = async (data: any) => {
    const toastId = toast.loading('Sending quotation...');
    try {
      if (modalMode === 'reply') {
        if (!selectedRequest) return;
        await quotationService.replyToRequest(selectedRequest.id, data);

        if (statusFilter === 'pending') {
          setQuotations((prev) => prev.filter((q) => q.id !== selectedRequest.id));
        } else {
          setPage(1);
          loadQuotations(1, statusFilter, true);
        }
        toast.success('Reply sent successfully', { id: toastId });
      } else {
        await quotationService.sendDirectQuote(data);
        if (statusFilter === 'quoted') {
          setPage(1);
          loadQuotations(1, 'quoted', true);
        }
        toast.success('Direct quote sent successfully', { id: toastId });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to send quotation', error);
      toast.error('Failed to send quotation.', { id: toastId });
    }
  };

  // Client-side search filtering
  const filteredQuotations = quotations.filter((q: any) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const idMatch = String(q.id).includes(term);
    const nameMatch = q.name?.toLowerCase().includes(term);
    const emailMatch = q.email?.toLowerCase().includes(term);
    const phoneMatch = q.phone?.toLowerCase().includes(term);
    const notesMatch = q.customer_notes?.toLowerCase().includes(term);
    return idMatch || nameMatch || emailMatch || phoneMatch || notesMatch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
            Quotation Requests
          </h1>
          <p className="text-neutral-500 mt-1 text-sm font-medium">
            Manage customer quotation inquiries and send custom replies
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <Button
            onClick={() => {
              setPage(1);
              loadQuotations(1, statusFilter, true);
            }}
            variant="outline"
            className="h-11 px-5 rounded-2xl bg-[#E2D6FE] hover:bg-[#d8c7fd] text-neutral-900 border border-white/80 shadow-xs font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 text-neutral-700 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => {
              setModalMode('direct');
              setSelectedRequest(null);
              setIsModalOpen(true);
            }}
            className="bg-[#D7FC45] hover:bg-[#c9ef38] text-neutral-950 font-bold rounded-2xl shadow-[0_8px_20px_rgba(215,252,69,0.35)] border border-[#E9FF7A] px-5 h-11 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2 cursor-pointer"
          >
            <Plus className="mr-1 h-4 w-4 stroke-[2.5]" /> Create Direct Quote
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white/40 backdrop-blur-md p-2.5 rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
        <div className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search quotation requests by customer, email, or ID..."
            className="w-full pl-10 h-11 bg-white hover:bg-white focus:bg-white border-white focus:border-white text-neutral-900 placeholder:text-neutral-400 rounded-2xl shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/60 focus-visible:ring-offset-0 focus:outline-none transition-all text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shrink-0 w-full md:w-auto">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-[#D7FC45] text-neutral-950 shadow-[0_4px_14px_rgba(215,252,69,0.35)] border border-[#E9FF7A]'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
            }`}
          >
            Pending Requests
          </button>
          <button
            onClick={() => setStatusFilter('quoted')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              statusFilter === 'quoted'
                ? 'bg-[#D7FC45] text-neutral-950 shadow-[0_4px_14px_rgba(215,252,69,0.35)] border border-[#E9FF7A]'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
            }`}
          >
            Quoted History
          </button>
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl p-16 text-center shadow-[0_12px_36px_rgba(0,0,0,0.06)]">
          <div className="animate-spin h-9 w-9 border-3 border-neutral-900 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-neutral-500 font-semibold text-sm">Loading quotation requests...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)]">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-neutral-200/70 hover:bg-transparent bg-white/40">
                  <TableHead className="py-3 px-6">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                      ID
                    </span>
                  </TableHead>
                  <TableHead className="py-3">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                      Customer
                    </span>
                  </TableHead>
                  <TableHead className="py-3">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FFF4E8] text-[#E0781E] border border-white/80 shadow-2xs">
                      Date
                    </span>
                  </TableHead>
                  <TableHead className="py-3 text-center">
                    <div className="flex justify-center">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                        Status
                      </span>
                    </div>
                  </TableHead>
                  <TableHead className="py-3 text-center">
                    <div className="flex justify-center">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                        Items
                      </span>
                    </div>
                  </TableHead>
                  <TableHead className="py-3">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FFF4E8] text-[#E0781E] border border-white/80 shadow-2xs">
                      Notes
                    </span>
                  </TableHead>
                  <TableHead className="py-3 px-6 text-right">
                    <div className="flex justify-end">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/80 text-neutral-600 border border-white/80 shadow-2xs">
                        Actions
                      </span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotations.map((q: any) => (
                  <TableRow
                    key={q.id}
                    className="border-b border-neutral-200/50 hover:bg-white/60 transition-colors"
                  >
                    <TableCell className="py-4 px-6">
                      <span className="font-mono font-bold text-sm text-neutral-900">
                        #{q.id}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-bold text-neutral-900 text-sm">
                        {q.name || 'Guest Customer'}
                      </div>
                      <div className="text-xs text-neutral-500 font-medium mt-0.5">
                        {q.email || 'No email provided'}
                      </div>
                      {q.phone && (
                        <div className="text-xs text-neutral-400 font-medium mt-0.5">
                          {q.phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-4 text-neutral-600 text-sm font-medium">
                      {new Date(q.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      {q.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Quoted
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-4 text-center font-bold text-neutral-800 text-sm">
                      {q.products?.length || 0}
                    </TableCell>
                    <TableCell className="py-4 text-neutral-600 text-xs font-medium max-w-xs truncate">
                      {q.customer_notes || '-'}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      {q.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleReplyClick(q)}
                          className="bg-[#D7FC45] hover:bg-[#c9ef38] text-neutral-950 font-bold text-xs px-3.5 h-8 rounded-xl border border-[#E9FF7A] shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Send className="h-3 w-3 stroke-[2.5]" /> Reply
                        </Button>
                      )}
                      {q.status === 'quoted' && (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-neutral-400 text-xs font-semibold">Sent</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              const toastId = toast.loading('Downloading PDF...');
                              try {
                                await quotationService.downloadQuotationPDF(q.id);
                                toast.success('Download started', { id: toastId });
                              } catch {
                                toast.error('Failed to download PDF. File may not exist.', {
                                  id: toastId,
                                });
                              }
                            }}
                            className="bg-sky-200/90 hover:bg-sky-300 text-sky-950 font-semibold text-xs px-3.5 h-8 rounded-xl border border-white/80 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <FileText className="h-3.5 w-3.5" /> View PDF
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredQuotations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-neutral-500 font-medium">
                      No {statusFilter} quotations found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                variant="outline"
                className="px-6 h-11 bg-white/80 hover:bg-white text-neutral-900 border border-white/80 rounded-2xl text-sm font-semibold shadow-xs hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                {loadingMore ? 'Loading more...' : 'Load More Quotations'}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Quotation Modal */}
      <QuotationModal
        key={modalMode === 'reply' ? selectedRequest?.id : 'new-direct'}
        isOpen={isModalOpen}
        mode={modalMode}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
        onSend={handleSendQuotation}
      />
    </div>
  );
}
