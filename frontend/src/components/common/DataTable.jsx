import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

export const DataTable = ({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = 'Filter records...',
  filterOptions = [],
  emptyTitle = 'No Matching Records',
  emptyDescription = 'Try adjusting your search criteria or filters.',
  onRowClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const filteredData = useMemo(() => {
    let result = [...data];

    // Filter by dropdown filter if provided
    if (selectedFilter !== 'all') {
      result = result.filter(item => {
        return (
          item.status === selectedFilter ||
          item.category === selectedFilter ||
          item.riskLevel === selectedFilter ||
          item.state === selectedFilter
        );
      });
    }

    // Filter by text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => {
        return Object.values(item).some(val => {
          if (typeof val === 'string' || typeof val === 'number') {
            return String(val).toLowerCase().includes(q);
          }
          return false;
        });
      });
    }

    // Sort
    if (sortColumn) {
      result.sort((a, b) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, selectedFilter, sortColumn, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  return (
    <div className="bg-white border border-[#E4EAF2] rounded-2xl overflow-hidden shadow-xs">
      {/* Table Bar */}
      <div className="p-4 border-b border-[#E4EAF2] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full bg-white border border-[#E4EAF2] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#172033] placeholder-[#98A2B3] focus:outline-none focus:border-[#155EEF]"
          />
        </div>

        {/* Filter dropdown */}
        {filterOptions.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#667085]" />
            <select
              value={selectedFilter}
              onChange={(e) => {
                setSelectedFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-[#E4EAF2] rounded-xl px-3 py-1.5 text-xs font-medium text-[#172033] focus:outline-none"
            >
              <option value="all">All Filter Statuses</option>
              {filterOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E4EAF2] bg-[#F1F5F9] text-[11px] font-mono font-bold tracking-wider text-[#667085] uppercase">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`p-3.5 ${col.sortable !== false ? 'cursor-pointer select-none hover:text-[#155EEF]' : ''} ${col.className || ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.label}</span>
                    {sortColumn === col.key && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-[#155EEF]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#155EEF]" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4EAF2] text-xs text-[#172033] font-sans">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="table-row" />)
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-6">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-[#F8FAFC]' : 'hover:bg-[#F8FAFC]'}`}
                >
                  {columns.map(col => (
                    <td key={col.key} className={`p-3.5 ${col.className || ''}`}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && filteredData.length > 0 && (
        <div className="p-3.5 border-t border-[#E4EAF2] bg-[#F8FAFC] flex items-center justify-between text-xs text-[#667085]">
          <div>
            Showing <span className="font-mono text-[#172033] font-bold">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-mono text-[#172033] font-bold">{Math.min(currentPage * pageSize, filteredData.length)}</span> of{' '}
            <span className="font-mono text-[#172033] font-bold">{filteredData.length}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="p-1.5 rounded-lg border border-[#E4EAF2] bg-white text-[#172033] hover:bg-[#F3F7FD] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono px-2 text-[#172033] font-bold">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              className="p-1.5 rounded-lg border border-[#E4EAF2] bg-white text-[#172033] hover:bg-[#F3F7FD] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
