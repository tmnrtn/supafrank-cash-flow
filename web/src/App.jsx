import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Balance from './pages/Balance';
import Invoices from './pages/Invoices';
import Bills from './pages/Bills';
import Categories from './pages/Categories';

function Nav() {
  const base = 'px-4 py-2 text-sm font-medium transition-colors';
  const active = 'text-white border-b-2 border-white';
  const inactive = 'text-blue-200 hover:text-white';

  return (
    <nav className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 h-14">
        <span className="font-bold text-lg tracking-tight">CashFlow</span>
        <NavLink to="/" end className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Dashboard</NavLink>
        <NavLink to="/balance" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Balance</NavLink>
        <NavLink to="/invoices" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Invoices</NavLink>
        <NavLink to="/bills" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Bills</NavLink>
        <NavLink to="/categories" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Categories</NavLink>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/balance" element={<Balance />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="/categories" element={<Categories />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
