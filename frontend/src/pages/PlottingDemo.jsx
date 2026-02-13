import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const COLORS = ['#1a73e8', '#ea4335', '#34a853', '#fbbc05']

function PlottingDemo() {
  const [lineData, setLineData] = useState([])
  const [barData, setBarData] = useState([])
  const [companies, setCompanies] = useState([])
  const [regions, setRegions] = useState([])
  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [days, setDays] = useState(90)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchLineData()
  }, [selectedCompany, days])

  useEffect(() => {
    fetchBarData()
  }, [selectedRegion])

  const fetchLineData = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCompany) params.append('company', selectedCompany)
      params.append('days', days)

      const response = await fetch(`/api/plotting/line-data?${params}`)
      if (!response.ok) throw new Error('Failed to fetch line data')

      const result = await response.json()
      setCompanies(result.companies)

      // Transform data for Recharts - pivot by date
      const pivoted = {}
      result.data.forEach(item => {
        if (!pivoted[item.date]) {
          pivoted[item.date] = { date: item.date }
        }
        pivoted[item.date][item.company] = item.price
      })

      setLineData(Object.values(pivoted))
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const fetchBarData = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedRegion) params.append('region', selectedRegion)

      const response = await fetch(`/api/plotting/bar-data?${params}`)
      if (!response.ok) throw new Error('Failed to fetch bar data')

      const result = await response.json()
      setRegions(result.regions)
      setBarData(result.data)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return <div className="loading">Loading data...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  // Get unique companies for the line chart
  const uniqueCompanies = selectedCompany
    ? [selectedCompany]
    : companies

  return (
    <div>
      <div className="page-header">
        <h1>Plotting Demo</h1>
        <p>Interactive charts displaying stock prices and sales data</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 className="card-title">Stock Prices (Line Chart)</h3>

          <div className="controls">
            <div className="control-group">
              <label>Company:</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <option value="">All Companies</option>
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label>Days:</label>
              <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
                <option value={180}>180 days</option>
                <option value={365}>365 days</option>
              </select>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.slice(5)}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  formatter={(value) => [`$${value.toFixed(2)}`, '']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                {uniqueCompanies.map((company, index) => (
                  <Line
                    key={company}
                    type="monotone"
                    dataKey={company}
                    stroke={COLORS[index % COLORS.length]}
                    dot={false}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Sales by Category (Bar Chart)</h3>

          <div className="controls">
            <div className="control-group">
              <label>Region:</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
                />
                <Legend />
                <Bar dataKey="sales" fill="#1a73e8" name="Sales ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlottingDemo
