import "tailwindcss";
import { Routes, Route, Navigate } from 'react-router-dom'
import { memo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Form from './pages/form'
import Dashboard from './pages/Dashboard'
// import SendMoney from "./pages/SendMoney";

// Memoize components to prevent unnecessary re-renders
const MemoizedDashboard = memo(Dashboard);
const MemoizedForm = memo(Form);
// const MemoizedSend = memo(SendMoney);

const formPage = (
  <div className="relative z-10 min-h-screen flex items-center justify-center">
    <MemoizedForm />
  </div>
);

// Route Guard Wrappers
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/Form" replace />;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/Dashboard" replace /> : children;
};

function App() {
  const token = localStorage.getItem("token");

  return (
    <>

      <Routes>
        <Route path="/" element={token ? <Navigate to="/Dashboard" replace /> : <Navigate to="/Form" replace />} />
        <Route path="/Form" element={<PublicRoute>{formPage}</PublicRoute>} />
        <Route path="/Dashboard" element={<ProtectedRoute><MemoizedDashboard /></ProtectedRoute>} />
        {/* <Route path="/SendMoney" element={<ProtectedRoute><SendMoney /></ProtectedRoute>} /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
