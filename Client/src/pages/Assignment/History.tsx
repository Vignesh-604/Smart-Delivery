import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

interface Partner {
    _id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
}

interface Order {
    _id: string;
    orderNumber: string;
    area: string;
    status: string;
    scheduledFor: string;
}

interface Assignment {
    _id: string;
    orderId: Order;
    partnerId: Partner;
    status: "success" | "failed";
    reason?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ApiResponse {
    statusCode: number;
    data: Assignment[];
    message: string;
    success: boolean;
}

const AssignmentHistory = () => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                setLoading(true);
                const response = await axios.get<ApiResponse>('http://localhost:5000/api/assignments/history');
                setAssignments(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch assignment history');
                setLoading(false);
                console.error('Error fetching assignments:', err);
            }
        };

        fetchAssignments();
    }, []);


    const formatDateTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString();
    };

    if (loading) return <div className="flex justify-center p-8">Loading assignment history...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Assignment History</h1>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled For</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {assignments.map((assignment) => (
                            <tr key={assignment._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => navigate(`/orders/${assignment.orderId._id}`)}
                                        className="text-black hover:text-blue-800 hover:underline bg-blue-100 px-2 rounded-2xl cursor-pointer font-semibold"
                                    >
                                        {assignment.orderId.orderNumber}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {assignment.orderId.area}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {assignment.orderId.scheduledFor}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => navigate(`/partners/details/${assignment.partnerId._id}`)}
                                        className="text-black hover:text-blue-800 hover:underline bg-blue-100 px-2 rounded-2xl cursor-pointer font-semibold"
                                    >
                                        {assignment.partnerId.name}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${assignment.status === 'success'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'}`}
                                    >
                                        {assignment.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {assignment.reason || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDateTime(assignment.createdAt)}
                                </td>
                            </tr>
                        ))}

                        {assignments.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                    No assignment history found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignmentHistory;