function AdminSearchBar({ 
  searchQuery, 
  onSearchChange, 
  placeholder = "Search...",
  filterValue,
  onFilterChange,
  filterOptions = [],
  filterLabel = "All",
  showFilter = false
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between gap-4">
        {showFilter && filterOptions.length > 0 && (
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">{filterLabel}</option>
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
        
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}

export default AdminSearchBar;
