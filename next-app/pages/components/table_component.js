import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter, useFilters } from 'react-table';
import { ChevronDown, ChevronUp, Download, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, X, Calendar, FileText, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import clsx from 'clsx';
import _ from 'lodash'; // Import the entire lodash library

// Define a default UI for filtering with debounced search
function GlobalFilter({
  globalFilter,
  setGlobalFilter,
}) {
  const [value, setValue] = useState(globalFilter);

  // Create a debounced function to set the global filter
  const debouncedSetGlobalFilter = useCallback(
    _.debounce(value => {
      setGlobalFilter(value || undefined);
    }, 300),
    [setGlobalFilter]
  );

  // Update local value immediately but debounce the actual filter change
  const handleChange = e => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSetGlobalFilter(newValue);
  };

  // Sync local value with globalFilter
  useEffect(() => {
    setValue(globalFilter || "");
  }, [globalFilter]);

  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3 w-5 h-5 text-gray-400" />
      <input
        value={value || ""}
        onChange={handleChange}
        placeholder="Search across all fields..."
        className="pl-10 pr-4 py-2 border-2 border-gray-600 rounded-xl shadow-lg focus:border-orange-500 text-gray-700 w-full sm:w-64"
      />
    </div>
  );
}

  // Export Confirmation Modal Component
  const ExportConfirmationModal = ({ isOpen, onClose, onConfirm, exportData, isLoading }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [fileName, setFileName] = useState('healthcare_pricing_data');
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <FileText className="mr-2 text-gray-700" size={22} />
            Confirm Export
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            You are about to export all data in the current table.
          </p>
          
          {/* Do something like this if we want to add in more info about the export
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-gray-600">Total records:</div>
              <div className="font-medium">{exportData.totalRecords.toLocaleString()}</div>
            </div>
          </div> */}
          
          {exportData.totalRecords > 10000 && (
            <div className="flex items-start p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
              <AlertTriangle className="text-amber-600 mt-0.5 mr-2 flex-shrink-0" size={18} />
              <p className="text-amber-800 text-sm">
                You're exporting a large dataset ({exportData.totalRecords.toLocaleString()} records). 
                This may take multiple minutes to complete.
              </p>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File Name
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter file name (without extension)"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="export-format"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={() => setExportFormat('csv')}
                />
                <span className="ml-2">CSV</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="export-format"
                  value="json"
                  checked={exportFormat === 'json'}
                  onChange={() => setExportFormat('json')}
                />
                <span className="ml-2">JSON</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(exportFormat, fileName)}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download size={16} className="mr-2" />
                Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


export default function EnhancedDataTable() {
  // State for table data and loading
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for pagination 
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  
  // Page input state with controlled timing
  const [pageInputValue, setPageInputValue] = useState("");
  const pageInputTimeout = useRef(null);
  
  // Pagination state (server-side)
  const [pageCount, setPageCount] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Unique values for dropdown filters
  const [uniqueRateTypes, setUniqueRateTypes] = useState([]);
  const [uniqueBillingClasses, setUniqueBillingClasses] = useState([]);
  
  // Filter state
  const [filters, setFilters] = useState({
    cpt_code: '',
    service_name: '',
    provider_name: '',
    plan_info: '',
    billing_class: '',
    negotiated_type: '',
    min_price: '',
    max_price: '',
    expiration_date_after: '',
    expiration_date_before: ''
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Add these with your other state variables
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportInfo, setExportInfo] = useState({
    totalRecords: 0,
    hasFilters: false
  });
  
  // IMPORTANT: Direct API endpoints to Django backend
  const API_BASE_URL = 'http://127.0.0.1:8000/api';  // Direct connection to Django
  const PRICING_PAGINATED_ENDPOINT = `${API_BASE_URL}/healthcare-pricing/paginated/`;
  const PRICING_EXPORT_ENDPOINT = `${API_BASE_URL}/healthcare-pricing/export/`;
  const LEGACY_PRICING_ENDPOINT = `${API_BASE_URL}/pricing/`;
  
  // Flags for endpoint usage
  const [useLegacyEndpoint, setUseLegacyEndpoint] = useState(false);
  
  // Row number function that doesn't rely on pageIndex
  const getRowNumber = useCallback((index) => {
    return currentPageIndex * currentPageSize + index + 1;
  }, [currentPageIndex, currentPageSize]);
  
  // Create debounced search function
  const debouncedFetchData = useCallback(
    _.debounce((page, pageSize) => {
      fetchData(page, pageSize);
    }, 300),
    []
  );
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Apply filters
  const applyFilters = () => {
    // Reset to page 1 whenever filters change
    setCurrentPageIndex(0);
    gotoPage(0); // Reset the react-table page state
    fetchData(1, currentPageSize);
    setShowFilterPanel(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      cpt_code: '',
      service_name: '',
      provider_name: '',
      plan_info: '',
      billing_class: '',
      negotiated_type: '',
      min_price: '',
      max_price: '',
      expiration_date_after: '',
      expiration_date_before: ''
    });
    fetchData(1, currentPageSize);
    setShowFilterPanel(false);
  };

  // Test function to check number of records that will be exported
  const getExportRecordsCount = async () => {
    try {
      // If using legacy endpoint, return current total
      if (useLegacyEndpoint) {
        return totalRecords;
      }
      
      // Build query parameters with filters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      // Rather than a separate endpoint, use the main endpoint with count-only=true
      try {
        // First try to use the export endpoint with a count-only flag
        const countUrl = `${PRICING_EXPORT_ENDPOINT}?${params.toString()}&count_only=true`;
        const response = await axios.get(countUrl, { timeout: 2000 });
        if (response.data && response.data.count) {
          return response.data.count;
        }
        return totalRecords;
      } catch (countError) {
        console.log('Could not get exact export count, using current total');
        return totalRecords;
      }
    } catch (error) {
      console.error('Error getting export count:', error);
      return totalRecords;
    }
  };
  // Function to fetch data from API
  const fetchData = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      // If using legacy fallback, use the old pricing endpoint
      if (useLegacyEndpoint) {
        // Legacy endpoint code remains unchanged
        // ...
        return;
      }
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('page_size', pageSize);
      
      // Add filters if they exist
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      // Log full URL for debugging
      const fullUrl = `${PRICING_PAGINATED_ENDPOINT}?${params.toString()}`;
      console.log("Fetching data from:", fullUrl);
      
      try {
        // Fetch data with pagination and filters
        const response = await axios.get(fullUrl);
        console.log("API Response:", response.data);
        
        // Set the table data
        setTableData(response.data.results || []);
        
        // Check if we were redirected to page 1 due to invalid page
        if (response.data.detail && response.data.detail.includes("requested page doesn't exist")) {
          setError(response.data.detail);
          setCurrentPageIndex(0);
          setPageInputValue("1");
        } else {
          // Extract unique values for dropdown filters
          extractUniqueValues(response.data.results || []);
          
          // Set pagination information
          setPageCount(Math.ceil((response.data.count || 0) / pageSize));
          setTotalRecords(response.data.count || 0);
          
          // Update current page information
          setCurrentPageIndex(page - 1);
          setCurrentPageSize(pageSize);
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        
        // Specifically handle "Invalid page" error
        if (apiError.response && apiError.response.status === 404) {
          if (apiError.response.data && apiError.response.data.detail === "Invalid page.") {
            setError("The requested page doesn't exist. Returning to first page.");
            
            // Reset to page 1 but keep current filters
            setTimeout(() => {
              fetchData(1, pageSize);
            }, 1000);
            return;
          }
        }
        
        // Re-throw for general error handling
        throw apiError;
      }
      
    } catch (error) {
      console.error('Error fetching healthcare pricing data:', error);
      
      // If standard endpoint fails, try the legacy endpoint
      if (!useLegacyEndpoint) {
        setUseLegacyEndpoint(true);
        setError("Having trouble with the main API. Trying legacy data...");
        
        // Try again with legacy endpoint
        setTimeout(() => {
          fetchData(page, pageSize);
        }, 1000);
        return;
      }
      
      // If both fail, show error and use sample data
      setError('Failed to fetch data. Please check if the API server is running.');
      const sampleData = getSampleData();
      setTableData(sampleData);
      setPageCount(1);
      setTotalRecords(5);
      
      // Extract unique values from sample data
      extractUniqueValues(sampleData);
      
    } finally {
      setLoading(false);
    }
  };

  // Handle showing export confirmation modal
  const handleShowExportModal = async () => {
    // Show loading state immediately
    setExportLoading(true);
    
    try {
      // Determine if filters are active
      const hasAnyFilter = Object.values(filters).some(filter => filter !== '');
      
      // Get the actual count of records that will be exported
      const recordCount = await getExportRecordsCount();
      
      // Calculate additional export details
      const activeFilterNames = Object.entries(filters)
        .filter(([_, value]) => value !== '')
        .map(([key, _]) => key.replace('_', ' '))
        .join(', ');
      
      // Update export info
      setExportInfo({
        totalRecords: recordCount,
        hasFilters: hasAnyFilter,
        filterDetails: hasAnyFilter ? activeFilterNames : '',
      });
      
      // Show the modal
      setShowExportModal(true);
    } catch (error) {
      console.error('Error preparing export information:', error);
      
      // Fallback to basic info
      setExportInfo({
        totalRecords: totalRecords,
        hasFilters: Object.values(filters).some(filter => filter !== '')
      });
      setShowExportModal(true);
    } finally {
      setExportLoading(false);
    }
  };

    // Export data functions
  const confirmExport = async (format, fileName) => {
    try {
      setExportLoading(true);
      
      // Use default name if none provided
      const outputFileName = fileName || 'healthcare_pricing_data';
      
      // Build query parameters with filters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      // If using legacy fallback, just export the current data
      if (useLegacyEndpoint) {
        if (format === 'csv') {
          exportToCSV(tableData, `${outputFileName}.csv`);
        } else if (format === 'json') {
          exportToJSON(tableData, `${outputFileName}.json`);
        }
        setShowExportModal(false);
        setExportLoading(false);
        return;
      }
      
      // Log full URL for debugging
      const fullUrl = `${PRICING_EXPORT_ENDPOINT}?${params.toString()}`;
      console.log("Exporting data from:", fullUrl);
      
      try {
        // Fetch all data for export
        const response = await axios.get(fullUrl);
        
        const exportData = response.data;
        
        if (format === 'csv') {
          exportToCSV(exportData, `${outputFileName}.csv`);
        } else if (format === 'json') {
          exportToJSON(exportData, `${outputFileName}.json`);
        }
      } catch (apiError) {
        console.error("Export API error:", apiError);
        // Show error message without fallback export
        alert('There was an error in the export API. Please try again later or contact support.');
      }
      
      setShowExportModal(false);
    } catch (error) {
      console.error(`Error exporting data as ${format}:`, error);
      alert('An error occurred while exporting the data. Please try again later.');
    } finally {
      setExportLoading(false);
      setShowExportModal(false);
    }
  };

  // Extract unique values for dropdown filters
  const extractUniqueValues = (data) => {
    // Extract unique rate types
    const rateTypes = [...new Set(data.map(item => item.negotiated_type).filter(Boolean))];
    setUniqueRateTypes(rateTypes);
    
    // Extract unique billing classes
    const billingClasses = [...new Set(data.map(item => item.billing_class).filter(Boolean))];
    setUniqueBillingClasses(billingClasses);
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Sample data for fallback
  const getSampleData = () => {
    return [
      {
        provider_service_id: 1,
        service_id: 'SVC001',
        cpt_code: '99213',
        service_name: 'Office Visit - Established Patient (Level 3)',
        service_description: 'Office/outpatient visit, established patient (15-29 min)',
        pricing_id: 1001,
        negotiated_rate: 110.75,
        negotiated_type: 'Fee Schedule',
        billing_class: 'Professional',
        expiration_date: '2025-12-31',
        provider_id: 'P001',
        provider_name: 'Main Street Medical Group',
        plan_info: 'Blue Cross - Premium Plan'
      }
    ];
  };

  // Define columns - Using the getRowNumber function instead of pageIndex and pageSize directly
  const columns = useMemo(
    () => [
      {
        Header: '#',
        id: 'row',
        Cell: ({ row }) => getRowNumber(row.index),
        disableSortBy: true,
        width: 50
      },
      {
        Header: 'CPT Code',
        accessor: 'cpt_code',
      },
      {
        Header: 'Service Name',
        accessor: 'service_name',

      },
      {
        Header: 'Provider',
        accessor: 'provider_name',
      },
      {
        Header: 'Plan',
        accessor: 'plan_info',
      },
      {
        Header: 'Billing Class',
        accessor: 'billing_class',
      },
      {
        Header: 'Rate',
        accessor: 'negotiated_rate',
        Cell: ({ value }) => (
          <div className="font-medium">
            ${typeof value === 'number' ? value.toFixed(2) : value}
          </div>
        )
      },
      {
        Header: 'Rate Type',
        accessor: 'negotiated_type',
      },
      {
        Header: 'Expiration',
        accessor: 'expiration_date',
        Cell: ({ value }) => {
          // Format date if it exists
          if (!value) return '-';
          try {
            const date = new Date(value);
            return date.toLocaleDateString();
          } catch (e) {
            return value;
          }
        }
      },
    ],
    [getRowNumber] // Only depend on the getRowNumber callback
  );

  // Set up react-table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: tableData,
      initialState: { pageIndex: 0, pageSize: 10 },
      manualPagination: !useLegacyEndpoint, // Only do manual pagination when not using legacy data
      manualGlobalFilter: !useLegacyEndpoint, // Same for global filtering
      pageCount, // Pass page count from API
      autoResetPage: false, // Don't auto reset page when data changes
      autoResetGlobalFilter: false, // Don't auto reset global filter
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // Effect to fetch data when page/pageSize changes
  useEffect(() => {
    fetchData(pageIndex + 1, pageSize);
    
    // Update page input value when page changes programmatically
    setPageInputValue(String(pageIndex + 1));
    
    // Scroll back to the top of the table when page changes
    const tableElement = document.getElementById('data-table-container');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [pageIndex, pageSize]);
  
  // Handle page input changes
  const handlePageInputChange = (e) => {
    const value = e.target.value;
    setPageInputValue(value);
    
    // Clear existing timeout
    if (pageInputTimeout.current) {
      clearTimeout(pageInputTimeout.current);
    }
    
    // Only navigate if a valid number is entered
    if (value && !isNaN(value) && value.trim() !== '') {
      // Set a timeout to navigate after the user stops typing
      pageInputTimeout.current = setTimeout(() => {
        const page = Number(value) - 1;
        if (page >= 0 && page < pageCount) {
          gotoPage(page);
        }
      }, 800); // Wait for 800ms of inactivity before navigating
    }
  };
  
  // Handle page input blur (when the user clicks away or presses Tab)
  const handlePageInputBlur = () => {
    // Clear any pending timeout
    if (pageInputTimeout.current) {
      clearTimeout(pageInputTimeout.current);
    }
    
    // Immediately navigate to the page
    if (pageInputValue && !isNaN(pageInputValue) && pageInputValue.trim() !== '') {
      const page = Number(pageInputValue) - 1;
      if (page >= 0 && page < pageCount) {
        gotoPage(page);
      } else {
        // Reset to current page if invalid
        setPageInputValue(String(pageIndex + 1));
      }
    } else {
      // Reset to current page if empty
      setPageInputValue(String(pageIndex + 1));
    }
  };
  
  // Handle page input key press (Enter key)
  const handlePageInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handlePageInputBlur();
    }
  };

  // Effect to handle global filter changes
  useEffect(() => {
    if (!useLegacyEndpoint) {
      // Include the global filter in the filters for API calls
      setFilters(prev => ({ ...prev, search: globalFilter }));
      debouncedFetchData(1, pageSize);
    }
  }, [globalFilter, pageSize, debouncedFetchData, useLegacyEndpoint]);


  const exportToCSV = (data, fileName = 'healthcare_pricing_data.csv') => {
    if (!data || data.length === 0) {
      alert('No data available to export.');
      return;
    }
    
    const headers = columns
      .filter(column => column.id !== 'row') // Exclude row number column
      .map(column => column.Header);
    
    let csvContent = headers.join(',') + '\n';
  
    data.forEach((row) => {
      const csvRow = columns
        .filter(column => column.id !== 'row') // Exclude row number column
        .map(column => {
          const cellValue = row[column.accessor] || '';
          // Escape quotes and wrap with quotes to handle commas in values
          return `"${String(cellValue).replace(/"/g, '""')}"`;
        });
      
      csvContent += csvRow.join(',') + '\n';
    });
  
    downloadFile(csvContent, fileName, 'text/csv;charset=utf-8;');
  };
  
  const exportToJSON = (data, fileName = 'healthcare_pricing_data.json') => {
    if (!data || data.length === 0) {
      alert('No data available to export.');
      return;
    }
    
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, fileName, 'application/json;charset=utf-8;');
  };

  const downloadFile = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Function to check API status
  const checkApiStatus = async () => {
    try {
      // Try to hit a simple health check endpoint first
      const healthCheckUrl = `${API_BASE_URL}/healthcheck/`;
      await axios.get(healthCheckUrl, { timeout: 3000 });
      return true;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  };
  
  // Function to switch between endpoints
  const switchEndpoint = async () => {
    setUseLegacyEndpoint(!useLegacyEndpoint);
    setError(null);
    setLoading(true);
    
    // If switching to main endpoint, check if it's available
    if (useLegacyEndpoint) {
      const apiAvailable = await checkApiStatus();
      if (!apiAvailable) {
        setError("The main API server appears to be down or unreachable. Staying with legacy data.");
        setLoading(false);
        return;
      }
    }
    
    fetchData(pageIndex + 1, pageSize);
  };

  return (
    <section
      id="data"
      className="w-full mt-10 max-w-7xl mx-auto border-2 border-gray-200 rounded-2xl shadow-xl p-8 overflow-hidden bg-white"
    >
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">
          Healthcare Pricing Data
        </h2>
        <p className="text-gray-600 mb-4">
          Compare prices for common healthcare services across providers
        </p>

        {/* Search, Filter, and Export Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-4">
            <GlobalFilter
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
            
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="px-4 py-2 bg-gray-700 text-white rounded-xl shadow hover:bg-gray-900 transition-colors duration-300 flex items-center gap-2"
              title="Advanced filter options"
            >
              <Filter size={16} />
              Filters
            </button>
          </div>

          <div className="relative">
            <button
                onClick={handleShowExportModal}
                disabled={exportLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-800 transition-colors duration-300 flex items-center gap-2 disabled:opacity-50"
                title="Export table data"
              >
                <Download size={16} />
                {exportLoading ? 'Exporting...' : 'Export Data'}
            </button>
          </div>
        </div>
        
        {/* Advanced Filter Panel */}
        {showFilterPanel && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-900">Advanced Filters</h3>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPT Code
                </label>
                <input
                  type="text"
                  name="cpt_code"
                  value={filters.cpt_code}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g. 99213"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  name="service_name"
                  value={filters.service_name}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g. Office Visit"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider Name
                </label>
                <input
                  type="text"
                  name="provider_name"
                  value={filters.provider_name}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g. City Hospital"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan
                </label>
                <input
                  type="text"
                  name="plan_info"
                  value={filters.plan_info}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g. Blue Cross"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Class
                </label>
                <select
                  name="billing_class"
                  value={filters.billing_class}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Classes</option>
                  {uniqueBillingClasses.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate Type
                </label>
                <select
                  name="negotiated_type"
                  value={filters.negotiated_type}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Types</option>
                  {uniqueRateTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price ($)
                </label>
                <input
                  type="number"
                  name="min_price"
                  value={filters.min_price}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g. 100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  name="max_price"
                  value={filters.max_price}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g. 1000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date (After)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="expiration_date_after"
                    value={filters.expiration_date_after}
                    onChange={handleFilterChange}
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md"
                  />
                  <Calendar className="absolute left-3 top-2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date (Before)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="expiration_date_before"
                    value={filters.expiration_date_before}
                    onChange={handleFilterChange}
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md"
                  />
                  <Calendar className="absolute left-3 top-2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Total Records Count */}
        <div className="mt-4 text-sm text-gray-600">
          {loading ? 'Loading...' : `${totalRecords} total records found`}
        </div>
        
        {/* Connection Status and Error Message */}
        {(useLegacyEndpoint || error) && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
            {useLegacyEndpoint && (
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Using legacy data endpoint (limited functionality)</span>
                </div>
                <button 
                  onClick={switchEndpoint}
                  className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded-md text-sm transition-colors"
                >
                  Try main API
                </button>
              </div>
            )}
            
            {error && (
              <div className="text-red-700 mt-2">
                <div className="font-medium mb-1">Error:</div>
                <div className="text-sm">{error}</div>
                {!useLegacyEndpoint && (
                  <div className="mt-2">
                    <button 
                      onClick={switchEndpoint}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-sm transition-colors"
                    >
                      Switch to backup data source
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <div className="text-xs mt-3">
              <p>Possible solutions:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Verify the Django server is running at {API_BASE_URL}</li>
                <li>Check that the API endpoints are correctly configured</li>
                <li>Ensure CORS is properly enabled on the server</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400"></div>
        </div>
      ) : (
        <>
          {/* Table Container - Added ID for scrolling back to the top */}
          <div id="data-table-container" className="overflow-x-auto">
            <table
              {...getTableProps()}
              className="w-full table-auto border-collapse rounded-xl overflow-hidden"
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    className="bg-gradient-to-r bg-gray-700 text-white text-left"
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        className="px-3 py-3 text-sm font-medium cursor-pointer select-none relative"
                        style={{ width: column.width }}
                      >
                        <div className="flex items-center justify-between">
                          {column.render('Header')}
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <ChevronDown className="h-4 w-4 ml-1" />
                              ) : (
                                <ChevronUp className="h-4 w-4 ml-1" />
                              )
                            ) : (
                              ''
                            )}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-12 text-gray-500 font-semibold"
                    >
                      No data available
                    </td>
                  </tr>
                ) : (
                  page.map((row, index) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        className={clsx(
                          'border-b border-gray-200 hover:bg-blue-50 transition-all duration-200',
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        )}
                      >
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            className="px-3 py-2 text-sm text-gray-800" // Made smaller with less padding
                          >
                            {cell.render('Cell')}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls - Updated with improved page navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mt-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Page{' '}
                <span className="font-medium">{pageIndex + 1}</span> of{' '}
                <span className="font-medium">{pageOptions.length || 1}</span>
              </span>

              <select
                value={pageSize}
                onChange={e => setPageSize(Number(e.target.value))}
                className="p-1 border border-gray-300 rounded text-sm"
              >
                {[10, 25, 50, 100].map(size => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center space-x-2">
              <button
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage || loading}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage || loading}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage || loading}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage || loading}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Go to page:</span>
              <input
                type="number"
                value={pageInputValue}
                onChange={handlePageInputChange}
                onBlur={handlePageInputBlur}
                onKeyPress={handlePageInputKeyPress}
                className="w-16 p-1 border border-gray-300 rounded text-sm"
                min="1"
                max={pageOptions.length || 1}
              />
            </div>
          </div>

          {/* Export Confirmation Modal */}
          <ExportConfirmationModal 
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            onConfirm={confirmExport}
            exportData={exportInfo}
            isLoading={exportLoading}
          />
        </>
      )}
    </section>
  );
}