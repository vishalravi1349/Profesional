import React, { useState } from 'react';
import { Search, Filter, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Enquiry, EnquiryStatus } from '../types';
import { StatusBadge } from './StatusBadge';

interface DataTableProps {
  enquiries: Enquiry[];
  onViewDetail: (enquiry: Enquiry) => void;
  isLoading?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({ enquiries, onViewDetail, isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.parent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage) || 1;
  const paginatedItems = filteredEnquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="rounded-3xl glass-panel border border-slate-800 overflow-hidden">
      {/* Search and Filters Header */}
      <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by ID, Student, Parent, Email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:border-gold-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-navy-900 border border-slate-700/80 px-3 py-2 rounded-xl">
            <Filter className="w-4 h-4 text-gold-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-navy-900 text-white">All Statuses</option>
              <option value="Pending" className="bg-navy-900 text-white">Pending</option>
              <option value="Reviewing" className="bg-navy-900 text-white">Reviewing</option>
              <option value="Contacted" className="bg-navy-900 text-white">Contacted</option>
              <option value="Responded" className="bg-navy-900 text-white">Responded</option>
              <option value="Approved" className="bg-navy-900 text-white">Approved</option>
              <option value="Closed" className="bg-navy-900 text-white">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-navy-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Enquiry ID</th>
              <th className="px-6 py-4">Student & Parent</th>
              <th className="px-6 py-4">Interested Class</th>
              <th className="px-6 py-4">Date Submitted</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  Loading enquiry records...
                </td>
              </tr>
            ) : paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  No enquiries match the criteria.
                </td>
              </tr>
            ) : (
              paginatedItems.map((e) => (
                <tr key={e.id} className="hover:bg-navy-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-gold-400">{e.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{e.student_name}</div>
                    <div className="text-slate-400 text-[11px]">Parent: {e.parent_name}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-200">{e.interested_class}</td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(e.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onViewDetail(e)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-gold-500 hover:text-navy-950 text-gold-400 text-xs font-bold transition-all border border-slate-700 hover:border-gold-400"
                    >
                      <Eye className="w-3.5 h-3.5" /> Manage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing {paginatedItems.length} of {filteredEnquiries.length} enquiries
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-lg bg-navy-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-navy-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-2 rounded-lg bg-navy-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-navy-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
