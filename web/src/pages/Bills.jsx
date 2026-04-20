import React, { useEffect, useState } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';

const empty = { supplier: '', description: '', amount: '', due_date: '', category: '' };

function fmt(date) { return date ? date.slice(0, 10) : ''; }

export default function Bills() {
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  const load = () => api.get('/api/bills').then(setRows);
  useEffect(() => {
    load();
    api.get('/api/categories').then(setCategories);
  }, []);

  function openAdd() { setForm(empty); setError(''); setModal({ mode: 'add' }); }
  function openEdit(row) {
    setForm({ supplier: row.supplier || '', description: row.description || '', amount: row.amount, due_date: fmt(row.due_date), category: row.category || '' });
    setError(''); setModal({ mode: 'edit', id: row.id });
  }
  function close() { setModal(null); }

  async function save() {
    if (!form.supplier || !form.amount || !form.due_date) { setError('Supplier, amount and due date are required'); return; }
    try {
      if (modal.mode === 'add') await api.post('/api/bills', form);
      else await api.put(`/api/bills/${modal.id}`, form);
      close(); load();
    } catch (e) { setError(e.message); }
  }

  async function del(id) {
    if (!confirm('Delete this bill?')) return;
    await api.delete(`/api/bills/${id}`);
    load();
  }

  const field = (label, key, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} step={type === 'number' ? '0.01' : undefined} value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );

  const categoryBadge = (name) => {
    const colours = { Payroll: 'bg-blue-100 text-blue-700', 'VAT/Tax': 'bg-yellow-100 text-yellow-700', Contractor: 'bg-purple-100 text-purple-700', 'Rent/Office': 'bg-green-100 text-green-700' };
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${colours[name] || 'bg-gray-100 text-gray-600'}`}>{name}</span>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Bills</h1>
        <button onClick={openAdd} className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">+ Add</button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Supplier</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Description</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Due Date</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Category</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{row.supplier}</td>
                <td className="px-4 py-3 text-gray-500">{row.description}</td>
                <td className="px-4 py-3 text-right">£{Number(row.amount).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-3">{fmt(row.due_date)}</td>
                <td className="px-4 py-3">{row.category_name ? categoryBadge(row.category_name) : null}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(row)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => del(row.id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No bills</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal.mode === 'add' ? 'Add Bill' : 'Edit Bill'} onClose={close}>
          <div className="space-y-3">
            {field('Supplier', 'supplier')}
            {field('Description', 'description')}
            {field('Amount', 'amount', 'number')}
            {field('Due Date', 'due_date', 'date')}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">— None —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={close} className="px-4 py-1.5 text-sm border rounded hover:bg-gray-50">Cancel</button>
              <button onClick={save} className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
