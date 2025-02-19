import React, { useState, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';

export default function DataTable({ data }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportOptions, setShowExportOptions] = useState(false);

  // Filter data based on search query (using useMemo for performance)
  const filteredData = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return data.filter((pricingItem) =>
      String(pricingItem.id).toLowerCase().includes(lowercasedQuery) ||
      String(pricingItem.rate).toLowerCase().includes(lowercasedQuery) ||
      String(pricingItem.type).toLowerCase().includes(lowercasedQuery) ||
      String(pricingItem.provider).toLowerCase().includes(lowercasedQuery) ||
      String(pricingItem.price).toLowerCase().includes(lowercasedQuery) ||
      String(pricingItem.expiration).toLowerCase().includes(lowercasedQuery)
    );
  }, [data, searchQuery]);

  // Define table columns for react-table
  const columns = useMemo(() => [
    {
      Header: 'Pricing ID',
      accessor: 'id',
    },
    {
      Header: 'Negotiated Rate',
      accessor: 'rate',
    },
    {
      Header: 'Negotiated Type',
      accessor: 'type',
    },
    {
      Header: 'Billing Class',
      accessor: 'provider',
    },
    {
      Header: 'Price',
      accessor: 'price',
    },
    {
      Header: 'Expiration Date',
      accessor: 'expiration',
    },
  ], []);

  // Set up react-table hooks for sorting
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: filteredData }, useSortBy);

  // Export filtered data to CSV
  const exportToCSV = () => {
    if (filteredData.length === 0) {
      alert('No data available to export.');
      return;
    }
    const headers = [
      'Pricing ID',
      'Negotiated Rate',
      'Negotiated Type',
      'Billing Class',
      'Price',
      'Expiration Date',
    ];
    let csvContent = headers.join(',') + '\n';

    filteredData.forEach((pricingItem) => {
      const row = [
        pricingItem.id,
        pricingItem.rate,
        pricingItem.type,
        pricingItem.provider,
        pricingItem.price,
        pricingItem.expiration,
      ];
      csvContent += row.map((field) => `"${field}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'healthcare_pricing_data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export filtered data to JSON
  const exportToJSON = () => {
    if (filteredData.length === 0) {
      alert('No data available to export.');
      return;
    }
    const jsonContent = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'healthcare_pricing_data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="data"
      className="w-full mt-40 max-w-7xl mx-auto border-2 border-gray-700 rounded-2xl shadow-xl p-8 overflow-hidden"
    >
      {/* Header Section */}
      <div className="mb-8 flex flex-wrap justify-between items-center">
        <h2 className="text-4xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-0">
          Tabular Pricing Data
        </h2>

        {/* Container for search and export dropdown */}
        <div className="flex flex-wrap items-center space-x-4">
          <input
            type="text"
            placeholder="Search Table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-2 px-4 border-2 border-blue-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 w-full sm:w-64"
          />
          <div className="relative">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="px-4 py-2 bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition-colors duration-300 "
              title="Export table data in CSV or JSON format"
            >
              Export Options
            </button>
            {showExportOptions && (
              <div
                className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg z-10 transition-all duration-300"
              >
                <div className="py-1">
                  <button
                    onClick={() => {
                      exportToCSV();
                      setShowExportOptions(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => {
                      exportToJSON();
                      setShowExportOptions(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    JSON
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Container for horizontal scrolling on small screens */}
      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="w-full table-auto border-collapse rounded-2xl overflow-hidden"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white text-left"
              >
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-4 text-sm font-medium cursor-pointer select-none"
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500 font-semibold"
                >
                  No data available
                </td>
              </tr>
            ) : (
              rows.map((row, index) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-blue-50 transition-all duration-300`}
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="px-6 py-4 text-sm text-gray-800"
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
    </section>
  );
}
