import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>Welcome to Data App</h1>
        <p>
          A demo application showcasing React + FastAPI integration for data visualization.
          Similar to Streamlit's "hello" example, built with modern web technologies.
        </p>
      </div>

      <div className="demo-cards">
        <div className="demo-card">
          <h3>Plotting Demo</h3>
          <p>
            Interactive charts displaying stock price trends and sales data.
            Features line charts and bar charts with filtering controls.
          </p>
          <Link to="/plotting">Explore Charts</Link>
        </div>

        <div className="demo-card">
          <h3>DataFrame Demo</h3>
          <p>
            A sortable, filterable data table displaying employee records.
            Includes pagination, search, and summary statistics.
          </p>
          <Link to="/dataframe">View Data</Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: '3rem', textAlign: 'left' }}>
        <h3 className="card-title">Tech Stack</h3>
        <ul style={{ paddingLeft: '1.5rem', color: '#666' }}>
          <li><strong>Frontend:</strong> React + Vite, Recharts, TanStack Table</li>
          <li><strong>Backend:</strong> FastAPI, Pandas, NumPy</li>
          <li><strong>Infrastructure:</strong> Nginx reverse proxy, Supervisord</li>
        </ul>
      </div>
    </div>
  )
}

export default Home
