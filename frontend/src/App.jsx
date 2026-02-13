import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import PlottingDemo from './pages/PlottingDemo'
import DataFrameDemo from './pages/DataFrameDemo'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="plotting" element={<PlottingDemo />} />
          <Route path="dataframe" element={<DataFrameDemo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
