import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PartnerData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    currentLoad: number;
    areas: string[];
    shift: {
        start: string;
        end: string;
    };
    metrics: {
        rating: number;
        completedOrders: number;
        cancelledOrders: number;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ApiResponse {
    statusCode: number;
    data: PartnerData;
    message: string;
    success: boolean;
}

const PartnerDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [partner, setPartner] = useState<PartnerData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState<boolean>(false);
    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        status: '',
        areas: [] as string[],
        shift: {
            start: '',
            end: ''
        }
    });


    const statusOptions = ['active', 'inactive'];

    useEffect(() => {
        const fetchPartnerData = async () => {
            try {
                setLoading(true);
                const response = await axios.get<ApiResponse>(`/api/partners/${id}`);

                if (response.data.success) {
                    const data = response.data.data
                    setPartner(data);

                    setFormData({
                        name: data.name,
                        phone: data.phone,
                        status: data.status,
                        areas: [...data.areas],
                        shift: {
                            start: data.shift.start,
                            end: data.shift.end
                        }
                    });
                } else {
                    setError('Failed to fetch partner data');
                }
            } catch (err) {
                setError('Error fetching partner details');
                console.error('Error fetching partner:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPartnerData();
        }
    }, [id]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === 'start' || name === 'end') {
            setFormData({
                ...formData,
                shift: {
                    ...formData.shift,
                    [name]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleAreasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const areasArray = e.target.value.split(',').map(area => area.trim());
        setFormData({
            ...formData,
            areas: areasArray
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveLoading(true);
        setSaveError(null);
        setSuccessMessage(null);

        try {
            const response = await axios.put(`/api/partners/${id}`, {
                name: formData.name,
                phone: formData.phone,
                status: formData.status,
                areas: formData.areas,
                shift: {
                    start: formData.shift.start,
                    end: formData.shift.end
                }
            });

            if (response.data.success) {
                setPartner(response.data.data);
                setSuccessMessage('Partner updated successfully');
                setEditing(false);
            } else {
                setSaveError('Failed to update partner');
            }
        } catch (err) {
            setSaveError('Error updating partner details');
            console.error('Error updating partner:', err);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!id) return;

        try {
            setDeleteLoading(true);
            const response = await axios.delete(`/api/partners/${id}`);

            if (response.data.success) {
                navigate('/partners');
            } else {
                setSaveError('Failed to delete partner');
                setShowDeleteConfirm(false);
            }
        } catch (err) {
            setSaveError('Error deleting partner');
            console.error('Error deleting partner:', err);
            setShowDeleteConfirm(false);
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8">Loading partner details...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;
    if (!partner) return <div className="p-4">Partner not found</div>;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Partner Details</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => navigate('/partners')}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                        Back to Partners
                    </button>
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
                        <p className="mb-6">
                            Are you sure you want to delete partner <strong>{partner.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
                    {successMessage}
                </div>
            )}

            {saveError && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
                    {saveError}
                </div>
            )}

            <div className="bg-white shadow-xl border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div className="border-b border-gray-200 p-6">
                    <div className="flex justify-between">
                        <h2 className="text-xl font-semibold">Profile Information</h2>
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Edit
                            </button>
                        ) : (
                            <button
                                onClick={() => setEditing(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    {editing ? (
                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option} value={option}>
                                                {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Areas (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        name="areas"
                                        value={formData.areas.join(', ')}
                                        onChange={handleAreasChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Shift Start Time
                                    </label>
                                    <input
                                        type="time"
                                        name="start"
                                        value={formData.shift.start}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Shift End Time
                                    </label>
                                    <input
                                        type="time"
                                        name="end"
                                        value={formData.shift.end}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-3"
                                    disabled={saveLoading}
                                >
                                    {saveLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Name</p>
                                    <p className="font-medium">{partner.name}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-medium">{partner.email}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Phone</p>
                                    <p className="font-medium">{partner.phone}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Status</p>
                                    <span
                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${partner.status === 'active' ? 'bg-green-100 text-green-800' :
                                                partner.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                                    partner.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'}`}
                                    >
                                        {partner.status.charAt(0).toUpperCase() + partner.status.slice(1).replace('_', ' ')}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Current Load</p>
                                    <p className="font-medium">{partner.currentLoad} orders</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Areas</p>
                                    <p className="font-medium">
                                        {partner.areas.join(', ') || 'None assigned'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Shift</p>
                                    <p className="font-medium">
                                        {partner.shift.start} - {partner.shift.end}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white shadow-xl border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div className="border-b border-gray-200 p-6">
                    <h2 className="text-xl font-semibold mb-4">Metrics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-600">Rating</p>
                            <p className="text-2xl font-bold">
                                {partner.metrics.rating > 0 ? partner.metrics.rating.toFixed(1) : 'N/A'}
                            </p>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-gray-600">Completed Orders</p>
                            <p className="text-2xl font-bold">{partner.metrics.completedOrders}</p>
                        </div>

                        <div className="p-4 bg-red-50 rounded-lg">
                            <p className="text-sm text-gray-600">Cancelled Orders</p>
                            <p className="text-2xl font-bold">{partner.metrics.cancelledOrders}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-xl border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">System Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Partner ID</p>
                            <p className="font-medium">{partner._id}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600">Created At</p>
                            <p className="font-medium">{formatDate(partner.createdAt)}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600">Last Updated</p>
                            <p className="font-medium">{formatDate(partner.updatedAt)}</p>
                        </div>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? 'Deleting...' : 'Delete Partner'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerDetails;