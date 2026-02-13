import { NavLink, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="app">
      <nav className="navbar">
        <NavLink to="/" className="navbar-brand">
          Data App
        </NavLink>
        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Home
          </NavLink>
          <NavLink to="/plotting" className={({ isActive }) => isActive ? 'active' : ''}>
            Plotting Demo
          </NavLink>
          <NavLink to="/dataframe" className={({ isActive }) => isActive ? 'active' : ''}>
            DataFrame Demo
          </NavLink>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
