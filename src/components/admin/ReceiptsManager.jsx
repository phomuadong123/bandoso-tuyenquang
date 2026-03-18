import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { createPortal } from "react-dom";

const EMPTY_ITEM = { item_name: '', unit: '', quantity: 0, unit_price: 0, note: '' };
const portalNode = typeof document !== 'undefined' ? document.getElementById('portal-root') : null;

const ReceiptsManager = () => {
  const [receipts, setReceipts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [filterActivity, setFilterActivity] = useState('');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState(null);
  const [form, setForm] = useState({
    donor_name: '',
    donor_type: 'individual',
    activity_id: '',
    location_name: '',
    received_at: '',
    note: '',
    items: [ { ...EMPTY_ITEM } ]
  });

  const loadData = async () => {
    try {
      const [rRes, aRes] = await Promise.all([fetch('/api/receipts'), fetch('/api/activities')]);
      if (rRes.ok) setReceipts(await rRes.json());
      if (aRes.ok) setActivities(await aRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({
      donor_name: '',
      donor_type: 'individual',
      activity_id: '',
      location_name: '',
      received_at: new Date().toISOString().slice(0, 16),
      note: '',
      items: [ { ...EMPTY_ITEM } ]
    });
    setEditingReceipt(null);
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = async (id) => {
    try {
      const res = await fetch(`/api/receipts/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setEditingReceipt(id);
      setForm({
        donor_name: data.donor_name || '',
        donor_type: data.donor_type || 'individual',
        activity_id: data.activity_id || '',
        location_name: data.location_name || '',
        received_at: data.received_at ? data.received_at.slice(0, 16) : new Date().toISOString().slice(0, 16),
        note: data.note || '',
        items: Array.isArray(data.items) && data.items.length > 0 ? data.items.map(i => ({
          item_name: i.item_name || '',
          unit: i.unit || '',
          quantity: i.quantity || 0,
          unit_price: i.unit_price || 0,
          note: i.note || ''
        })) : [{ ...EMPTY_ITEM }]
      });
      setIsModalOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleFieldChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleItemChange = (index, key, value) => {
    setForm(prev => {
      const items = [...prev.items];
      items[index] = { ...items[index], [key]: value };
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setForm(prev => ({ ...prev, items: [...prev.items, { ...EMPTY_ITEM }] }));
  };

  const removeItem = (index) => {
    setForm(prev => {
      const items = prev.items.filter((_, i) => i !== index);
      return { ...prev, items: items.length ? items : [{ ...EMPTY_ITEM }] };
    });
  };

  const totalValue = useMemo(() => {
    return form.items.reduce((sum, item) => {
      const q = Number(item.quantity) || 0;
      const p = Number(item.unit_price) || 0;
      return sum + q * p;
    }, 0);
  }, [form.items]);

  const handleSave = async () => {
    const payload = {
      donor_name: form.donor_name,
      donor_type: form.donor_type,
      activity_id: form.activity_id || null,
      location_name: form.location_name,
      received_at: form.received_at,
      note: form.note,
      items: form.items.map(i => ({
        item_name: i.item_name,
        unit: i.unit,
        quantity: Number(i.quantity) || 0,
        unit_price: Number(i.unit_price) || 0,
        note: i.note
      }))
    };

    try {
      const url = editingReceipt ? `/api/receipts/${encodeURIComponent(editingReceipt)}` : '/api/receipts';
      const method = editingReceipt ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await loadData();
        closeModal();
      } else {
        const err = await res.json();
        alert(err?.error || 'Lưu không thành công');
      }
    } catch (e) {
      console.error(e);
      alert('Lỗi khi lưu');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phiếu này?')) return;
    try {
      const res = await fetch(`/api/receipts/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredReceipts = useMemo(() => {
    return receipts.filter(r => {
      const matchesSearch = r.donor_name?.toLowerCase().includes(search.toLowerCase());
      const matchesActivity = filterActivity ? String(r.activity_id) === String(filterActivity) : true;
      return matchesSearch && matchesActivity;
    });
  }, [receipts, search, filterActivity]);

  return (
    <div className="receipts-manager">
      <div className="crud-toolbar">
        <h3>Danh sách Phiếu tiếp nhận</h3>
        <button className="btn btn-primary hover-lift" style={{ maxWidth: '20%'}} onClick={openCreate}>
          <Plus size={16} style={{ marginRight: 8 }} /> Thêm mới
        </button>
      </div>

      <div className="filter-row">
        <div className="filter-item">
          <input
            type="text"
            placeholder="Tìm theo tên Đơn vị tình nguyện..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="filter-item">
          <select
            value={filterActivity}
            onChange={e => setFilterActivity(e.target.value)}
            className="form-input"
          >
            <option value="">-- Lọc theo hoạt động --</option>
            {activities.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Đơn vị tình nguyện</th>
              <th>Hoạt động</th>
              <th>Địa điểm</th>
              <th>Ngày nhận</th>
              <th>Tổng tiền</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredReceipts.map(receipt => (
              <tr key={receipt.id}>
                <td>{receipt.donor_name}</td>
                <td>{receipt.activity_name}</td>
                <td>{receipt.location_name}</td>
                <td>{receipt.received_at?.replace('T', ' ')?.slice(0, 16)}</td>
                <td>{Number(receipt.total_value || 0).toLocaleString('vi-VN')} đ</td>
                <td>
                  <button className="btn-icon edit" onClick={() => openEdit(receipt.id)} title="Sửa">
                    <Pencil size={16} />
                  </button>
                  <button className="btn-icon delete" onClick={() => handleDelete(receipt.id)} title="Xóa">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredReceipts.length === 0 && (
              <tr>
                <td colSpan={6} className="empty-state">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && portalNode && createPortal(
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h4>{editingReceipt ? 'Chỉnh sửa phiếu' : 'Tạo phiếu mới'}</h4>
              <button className="close-btn" onClick={closeModal}><X size={20} /></button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Đơn vị tình nguyện</label>
                  <input
                    className="form-input"
                    value={form.donor_name}
                    onChange={e => handleFieldChange('donor_name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Loại Đơn vị tình nguyện</label>
                  <select
                    className="form-input"
                    value={form.donor_type}
                    onChange={e => handleFieldChange('donor_type', e.target.value)}
                  >
                    <option value="individual">Cá nhân</option>
                    <option value="organization">Tổ chức</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Hoạt động</label>
                  <select
                    className="form-input"
                    value={form.activity_id}
                    onChange={e => handleFieldChange('activity_id', e.target.value)}
                  >
                    <option value="">-- Chọn hoạt động --</option>
                    {activities.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Địa điểm</label>
                  <input
                    className="form-input"
                    value={form.location_name}
                    onChange={e => handleFieldChange('location_name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Ngày nhận</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={form.received_at}
                    onChange={e => handleFieldChange('received_at', e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Ghi chú</label>
                  <textarea
                    className="form-input"
                    rows={2}
                    value={form.note}
                    onChange={e => handleFieldChange('note', e.target.value)}
                  />
                </div>
              </div>

              <div className="items-section">
                <div className="items-header">
                  <h5>Danh sách vật phẩm</h5>
                  <button className="btn btn-secondary" style={{ maxWidth: '50%'}} onClick={addItem}>
                    <Plus size={14} style={{ marginRight: 6 }} /> Thêm dòng
                  </button>
                </div>

                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Vật phẩm</th>
                      <th>Đơn vị</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.items.map((item, idx) => {
                      const qty = Number(item.quantity) || 0;
                      const price = Number(item.unit_price) || 0;
                      return (
                        <tr key={idx}>
                          <td>
                            <input
                              className="form-input"
                              value={item.item_name}
                              onChange={e => handleItemChange(idx, 'item_name', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-input"
                              value={item.unit}
                              onChange={e => handleItemChange(idx, 'unit', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-input"
                              value={item.quantity}
                              onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-input"
                              value={item.unit_price}
                              onChange={e => handleItemChange(idx, 'unit_price', e.target.value)}
                            />
                          </td>
                          <td>{(qty * price).toLocaleString('vi-VN')} đ</td>
                          <td>
                            <button className="btn-icon delete" onClick={() => removeItem(idx)}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="total-summary">
                <strong>Tổng tiền:</strong> {totalValue.toLocaleString('vi-VN')} đ
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Hủy</button>
              <button className="btn btn-primary" onClick={handleSave}>Lưu</button>
            </div>
          </div>
        </div>,
          portalNode
        )}
    </div>
  );
};

export default ReceiptsManager;
