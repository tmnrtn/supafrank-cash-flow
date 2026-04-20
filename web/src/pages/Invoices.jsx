import React, { useEffect, useState } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';

const empty = { client: '', description: '', amount: '', due_date: '' };

function fmt(date) { return date ? date.slice(0, 10) : ''; }

export default function Invoices() {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  const load = () => api.get('/api/invoices').then(setRows);
  useEffect(() => { load(); }, []);

  function openAdd() { setForm(empty); setError(''); setModal({ mode: 'add' }); }
  function openEdit(row) {
    setForm({ client: row.client || '', description: row.description || '', amount: row.amount, due_date: fmt(row.due_date) });
    setError(''); setModal({ mode: 'edit', id: row.id });
  }
  function close() { setModal(null); }

  async function save() {
    if (!form.client || !form.amount || !form.due_date) { setError('Client, amount and due date are required'); return; }
    try {
      if (modal.mode === 'add') await api.post('/api/invoices', form);
      else await api.put(`/api/invoices/${modal.id}`, form);
      close(); load();
    } catch (e) { setError(e.message); }
  }

  async function del(id) {
    if (!confirm('Delete this invoice?')) return;
    await api.delete(`/api/invoices/${id}`);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Invoices</h1>
        <button onClick={openAdd} className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">+ Add</button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Client</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Description</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Due Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{row.client}</td>
                <td className="px-4 py-3 text-gray-500">{row.description}</td>
                <td className="px-4 py-3 text-right">£{Number(row.amount).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-3">{fmt(row.due_date)}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(row)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => del(row.id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No invoices</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal.mode === 'add' ? 'Add Invoice' : 'Edit Invoice'} onClose={close}>
          <div className="space-y-3">
            {field('Client', 'client')}
            {field('Description', 'description')}
            {field('Amount', 'amount', 'number')}
            {field('Due Date', 'due_date', 'date')}
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
