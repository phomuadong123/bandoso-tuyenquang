import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, X, Plus, CheckCircle, XCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';

const CrudTable = ({ title, endpoint, columns, formFields }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(endpoint + '?admin=true');
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint]);

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        if (item) {
            setFormData(item);
        } else {
            const emptyForm = {};
            formFields.forEach(field => {
                emptyForm[field.key] = '';
            });
            setFormData(emptyForm);
        }
        setIsModalOpen(true);
    };

    const portalNode = typeof document !== 'undefined' ? document.getElementById('portal-root') : null;

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({});
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;
        console.log(field);
        

        const fileData = new FormData();
        const uploadFieldName = field.uploadFieldName || 'image';
        fileData.append(uploadFieldName, file);

        const uploadEndpoint = field.uploadEndpoint || '/api/upload';

        console.log('Uploading file to:', uploadEndpoint);

        try {
            const res = await fetch(uploadEndpoint, {
                method: 'POST',
                body: fileData
            });
            const data = await res.json();
            console.log('Upload response:', data);
            if (data.url) {
                setFormData({
                    ...formData,
                    [field.key]: data.url
                });
            }
            toast.success("Tải lên tệp thành công!");
        } catch (error) {
            console.error('Lỗi thông qua hệ thống upload:', error);
            toast.error("Tải lên tệp thất bại!");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editingItem ? 'PUT' : 'POST';
            const url = editingItem ? `${endpoint}/${encodeURIComponent(editingItem.id)}` : endpoint;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                handleCloseModal();
                toast.success("Lưu dữ liệu thành công!");
                fetchData(); // Reload data
            } else {
                toast.error("Có lỗi xảy ra khi lưu dữ liệu!");
            }
        } catch (error) {
            console.error('Lỗi cập nhật:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) return;
        try {
            const res = await fetch(`${endpoint}/${encodeURIComponent(id)}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchData(); // Reload data
                toast.success("Xóa bản ghi thành công!");
            } else {
                toast.error("Xóa bản ghi thất bại!");
            }
        } catch (error) {
            console.error('Lỗi xóa:', error);
        }
    };

    const handleToggleActive = async (item) => {
        if (item.is_active === undefined) return;
        const updated = { ...item, is_active: item.is_active ? 0 : 1 };
        try {
            const res = await fetch(`${endpoint}/${encodeURIComponent(item.id)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            });
            if (res.ok) {
                fetchData();
                toast.success(`Đã ${updated.is_active ? 'bật' : 'tắt'} thành công!`);
            } else {
                toast.error("Không thể cập nhật trạng thái hoạt động.");
            }
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái hoạt động:', error);
        }
    };

    return (
        <div className="crud-container">
            <div className="crud-toolbar">
                <h3>{title}</h3>
                <button className="btn btn-primary hover-lift" style={{ maxWidth: '20%'}} onClick={() => handleOpenModal()}>
                    <Plus size={16} style={{ marginRight: '8px' }} /> Thêm mới
                </button>
            </div>

            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th key={col.key}>{col.label}</th>
                            ))}
                            <th>Active</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length + 2} className="empty-state">Đang tải dữ liệu...</td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 2} className="empty-state">Không có dữ liệu</td>
                            </tr>
                        ) : (
                            data.map((item, idx) => (
                                <tr key={item.id || idx}>
                                    {columns.map(col => (
                                        <td key={col.key}>
                                            {col.render ? col.render(item[col.key], item) : item[col.key]}
                                        </td>
                                    ))}
                                    <td>
                                        {item.is_active !== undefined ? (
                                            <button
                                                className="btn-icon"
                                                style={{ color: item.is_active ? '#05a03e' : '#d11212' }}
                                                title={item.is_active ? 'Đang bật' : 'Đang tắt'}
                                                onClick={() => handleToggleActive(item)}
                                            >
                                                {item.is_active ? <CheckCircle size={18} /> : <XCircle size={18} />}
                                            </button>
                                        ) : null}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon edit" onClick={() => handleOpenModal(item)}>
                                                <Pencil size={18} />
                                            </button>
                                            <button className="btn-icon delete" onClick={() => handleDelete(item.id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && portalNode && createPortal(
                <div className="modal-overlay">
                    <div className="modal-content glass-panel">
                        <div className="modal-header">
                            <h4>{editingItem ? 'Chỉnh sửa bản ghi' : 'Thêm mới bản ghi'}</h4>
                            <button className="close-btn" onClick={handleCloseModal}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="crud-form">
                            {formFields.map(field => (
                                <div className="form-group" key={field.key}>
                                    <label>{field.label}</label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            name={field.key}
                                            value={formData[field.key] || ''}
                                            onChange={handleChange}
                                            required={field.required !== false}
                                            rows="4"
                                            className="form-input"
                                        />
                                    ) : field.type === 'file' ? (
                                        <div className="file-input-wrapper">
                                            <input
                                                type="file"
                                                accept={field.accept || 'image/*'}
                                                onChange={(e) => handleFileChange(e, field)}
                                                className="form-input"
                                                required={field.required !== false && !formData[field.key]}
                                            />
                                            {formData[field.key] && (
                                                <div className="image-preview">
                                                    {formData[field.key].endsWith('.mp3') ? (
                                                        <audio controls style={{ width: '100%' }}>
                                                            <source src={formData[field.key]} />
                                                        </audio>
                                                    ) : formData[field.key].endsWith('.pdf') ? (
                                                        <a href={formData[field.key]} target="_blank" rel="noreferrer">Xem file PDF</a>
                                                    ) : (
                                                        <img src={formData[field.key]} alt="Preview" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <input
                                            type={field.type || 'text'}
                                            name={field.key}
                                            value={formData[field.key] || ''}
                                            onChange={handleChange}
                                            required={field.required !== false}
                                            className="form-input"
                                        />
                                    )}
                                </div>
                            ))}
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Hủy</button>
                                <button type="submit" className="btn btn-primary">Lưu lại</button>
                            </div>
                        </form>
                    </div>
                </div>,
                portalNode
            )}
        </div>
    );
};

export default CrudTable;
