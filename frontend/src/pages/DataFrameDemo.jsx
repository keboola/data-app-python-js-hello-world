import { useState, useEffect, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'

function DataFrameDemo() {
  const [data, setData] = useState([])
  const [stats, setStats] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  })
  const [filters, setFilters] = useState({ departments: [], positions: [] })
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [department, setDepartment] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [pagination.page, pagination.pageSize, sortBy, sortOrder, department, search])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchData = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        page_size: pagination.pageSize
      })
      if (sortBy) params.append('sort_by', sortBy)
      params.append('sort_order', sortOrder)
      if (department) params.append('department', department)
      if (search) params.append('search', search)

      const response = await fetch(`/api/dataframe/data?${params}`)
      if (!response.ok) throw new Error('Failed to fetch data')

      const result = await response.json()
      setData(result.data)
      setPagination(prev => ({
        ...prev,
        ...result.pagination
      }))
      setFilters(result.filters)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dataframe/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')

      const result = await response.json()
      setStats(result)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const columns = useMemo(() => [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'position', header: 'Position' },
    {
      accessorKey: 'salary',
      header: 'Salary',
      cell: ({ getValue }) => `$${getValue().toLocaleString()}`
    },
    { accessorKey: 'hire_date', header: 'Hire Date' },
    { accessorKey: 'years_employed', header: 'Years' },
    {
      accessorKey: 'performance_rating',
      header: 'Rating',
      cell: ({ getValue }) => getValue().toFixed(1)
    }
  ], [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  })

  const handleSort = (columnId) => {
    if (sortBy === columnId) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(columnId)
      setSortOrder('asc')
    }
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  if (loading) {
    return <div className="loading">Loading data...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div>
      <div className="page-header">
        <h1>DataFrame Demo</h1>
        <p>Sortable, filterable data table with pagination</p>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total_employees}</div>
            <div className="stat-label">Total Employees</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">${(stats.avg_salary / 1000).toFixed(0)}k</div>
            <div className="stat-label">Average Salary</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.avg_years_employed}</div>
            <div className="stat-label">Avg Years Employed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.avg_performance}</div>
            <div className="stat-label">Avg Performance</div>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="card-title">Employee Data</h3>

        <div className="controls">
          <div className="control-group">
            <label>Search:</label>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search name or email..."
              style={{ width: '200px' }}
            />
          </div>

          <div className="control-group">
            <label>Department:</label>
            <select value={department} onChange={handleDepartmentChange}>
              <option value="">All Departments</option>
              {filters.departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Per page:</label>
            <select
              value={pagination.pageSize}
              onChange={(e) => setPagination(prev => ({
                ...prev,
                pageSize: Number(e.target.value),
                page: 1
              }))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      onClick={() => handleSort(header.column.id)}
                      className={
                        sortBy === header.column.id
                          ? `sorted-${sortOrder}`
                          : ''
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: 1 }))}
            disabled={pagination.page === 1}
          >
            First
          </button>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {pagination.totalPages} ({pagination.totalItems} items)
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </button>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: pagination.totalPages }))}
            disabled={pagination.page >= pagination.totalPages}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataFrameDemo
