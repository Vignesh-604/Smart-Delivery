import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { PieChart, CheckCircle, AlertTriangle, FileWarning } from 'lucide-react';

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

interface FailureReason {
    count: number;
    reason: string;
}

interface AssignmentMetrics {
    totalAssigned: number;
    successRate: number;
    totalAttempts: number;
    failureReasons: FailureReason[];
}

interface AssignmentApiResponse {
    statusCode: number;
    data: Assignment[];
    message: string;
    success: boolean;
}

interface MetricsApiResponse {
    statusCode: number;
    data: AssignmentMetrics;
    message: string;
    success: boolean;
}

const AssignmentHistory = () => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [metrics, setMetrics] = useState<AssignmentMetrics | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [metricsLoading, setMetricsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [metricsError, setMetricsError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                setLoading(true);
                const response = await axios.get<AssignmentApiResponse>('http://localhost:5000/api/assignments/history');
                setAssignments(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch assignment history');
                setLoading(false);
                console.error('Error fetching assignments:', err);
            }
        };

        const fetchMetrics = async () => {
            try {
                setMetricsLoading(true);
                const response = await axios.get<MetricsApiResponse>('/api/assignments/metrics');
                setMetrics(response.data.data);
                setMetricsLoading(false);
            } catch (err) {
                setMetricsError('Failed to fetch assignment metrics');
                setMetricsLoading(false);
                console.error('Error fetching metrics:', err);
            }
        };

        fetchAssignments();
        fetchMetrics();
    }, []);

    const formatDateTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString();
    };

    if (loading) return <div className="flex justify-center p-8">Loading assignment history...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Assignment Dashboard</h1>
            
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {metricsLoading ? (
                    <div className="col-span-4 bg-white p-4 rounded-lg shadow-md">
                        <p className="text-gray-500">Loading metrics...</p>
                    </div>
                ) : metricsError ? (
                    <div className="col-span-4 bg-red-50 p-4 rounded-lg shadow-md">
                        <p className="text-red-500">{metricsError}</p>
                    </div>
                ) : metrics ? (
                    <>
                        <div className="bg-blue-50 p-6 rounded-lg shadow-md flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full mr-4">
                                <PieChart className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Attempts</p>
                                <p className="text-2xl font-bold text-blue-700">{metrics.totalAttempts}</p>
                            </div>
                        </div>

                        <div className="bg-green-50 p-6 rounded-lg shadow-md flex items-center">
                            <div className="p-3 bg-green-100 rounded-full mr-4">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Successful Assignments</p>
                                <p className="text-2xl font-bold text-green-700">{metrics.totalAssigned}</p>
                            </div>
                        </div>

                        <div className="bg-indigo-50 p-6 rounded-lg shadow-md flex items-center">
                            <div className="p-3 bg-indigo-100 rounded-full mr-4">
                                <AlertTriangle className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Failed Assignments</p>
                                <p className="text-2xl font-bold text-indigo-700">{metrics.totalAttempts - metrics.totalAssigned}</p>
                            </div>
                        </div>

                        <div className="bg-purple-50 p-6 rounded-lg shadow-md flex items-center">
                            <div className="p-3 bg-purple-100 rounded-full mr-4">
                                <FileWarning className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Success Rate</p>
                                <p className="text-2xl font-bold text-purple-700">{metrics.successRate}%</p>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>

            {/* Failure Reasons */}
            {metrics && metrics.failureReasons.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Failure Reasons</h2>
                    <div className="overflow-hidden bg-gray-50 rounded-lg">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {metrics.failureReasons.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.reason}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.count}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {((item.count / (metrics.totalAttempts - metrics.totalAssigned)) * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <h2 className="text-xl font-semibold mb-4">Assignment History</h2>
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