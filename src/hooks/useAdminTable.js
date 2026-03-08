import { useState, useMemo } from 'react';

function useAdminTable(data, config = {}) {
  const {
    searchFields = [],
    defaultSortField = 'id',
    defaultSortOrder = 'desc',
    defaultItemsPerPage = 10,
    filterField = null
  } = config;

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [filterValue, setFilterValue] = useState('all');

  // Filter, search, and sort data
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    let filtered = [...data];

    // Apply filter
    if (filterField && filterValue !== 'all') {
      filtered = filtered.filter(item => item[filterField] === filterValue);
    }

    // Apply search
    if (searchQuery && searchFields.length > 0) {
      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle numeric sorting for price fields
      if (sortField === 'price') {
        aVal = parseInt(String(aVal).replace(/[^0-9]/g, '')) || 0;
        bVal = parseInt(String(bVal).replace(/[^0-9]/g, '')) || 0;
      }

      // Handle numeric sorting for order fields
      if (sortField === 'order') {
        aVal = parseInt(aVal) || 0;
        bVal = parseInt(bVal) || 0;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [data, searchQuery, sortField, sortOrder, filterValue, filterField, searchFields]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handlers
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (value) => {
    setFilterValue(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  return {
    // Data
    currentData,
    filteredData,
    totalItems: filteredData.length,
    
    // Search
    searchQuery,
    handleSearchChange,
    
    // Sort
    sortField,
    sortOrder,
    handleSort,
    
    // Filter
    filterValue,
    handleFilterChange,
    
    // Pagination
    currentPage,
    totalPages,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange
  };
}

export default useAdminTable;
