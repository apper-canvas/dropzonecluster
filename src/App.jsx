import { Routes, Route } from "react-router-dom"
import HomePage from "@/components/pages/HomePage"

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface/20 to-background">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  )
}

export default App