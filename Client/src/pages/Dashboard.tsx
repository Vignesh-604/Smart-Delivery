import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Users,
    PackageCheck,
    Activity,
    ShieldCheck,
    ChevronRight,
    Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

interface Customer {
    name: string;
    phone: string;
    address: string;
}

interface Item {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    orderNumber: string;
    area: string;
    customer: Customer;
    items: Item[];
    status: string;
    scheduledFor: string;
    createdAt: string;
    updatedAt: string;
    assignedTo?: {
        _id: string;
        name: string;
        email: string;
    };
}

interface Partner {
    _id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
}

interface OrderId {
    _id: string;
    orderNumber: string;
    area: string;
    status: string;
    scheduledFor: string;
}

interface Assignment {
    _id: string;
    orderId: OrderId;
    partnerId: Partner;
    status: string;
    reason?: string;
    createdAt: string;
    updatedAt: string;
}

interface DashboardMetrics {
    activeOrders: number;
    totalOrders: number;
    totalPartners: number;
    activePartners: number;
    successRate: number;
}

const Dashboard = () => {
    const router = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [runningAssignment, setRunningAssignment] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                Swal.fire({
                    title: "Please Note",
                    text: "The server may need about 50 seconds to initialize on first connection as it's hosted on Render's free tier.",
                    icon: "info",
                    confirmButtonText: "Understood",
                    confirmButtonColor: "#3085d6",
                    timer: 8000,
                    timerProgressBar: true
                })

                const [ordersResponse, assignmentsResponse, metricsResponse] = await Promise.all([
                    axios.get("/api/orders?recent=true"),
                    axios.get("/api/assignments/history?recent=true"),
                    axios.get("/api/assignments/dashboard")
                ]);

                setOrders(ordersResponse.data.data);
                setAssignments(assignmentsResponse.data.data);
                setMetrics(metricsResponse.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const navigateTo = (path: string) => {
        router(path);
    };

    const runSmartAssignment = async () => {
        try {
            setRunningAssignment(true);
            await axios.post("/api/assignments/run");

            const [ordersResponse, assignmentsResponse, metricsResponse] = await Promise.all([
                axios.get("/api/orders?recent=true"),
                axios.get("/api/assignments/history?recent=true"),
                axios.get("/api/assignments/dashboard")
            ]);

            setOrders(ordersResponse.data.data);
            setAssignments(assignmentsResponse.data.data);
            setMetrics(metricsResponse.data.data);
        } catch (error) {
            console.error("Error running smart assignment:", error);
        } finally {
            setRunningAssignment(false);
        }
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) {
            return `${diffMins} min ago`;
        } else {
            const diffHours = Math.floor(diffMins / 60);
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        }
    };

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-slate-50 min-h-screen">

            {/* Metrics Section */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-xl border-0 transition-all duration-200 ease-in-out bg-blue-500 text-white">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-sm font-medium text-blue-100">
                                    Total Partners
                                </h2>
                                <p className="text-3xl font-bold mt-1 text-white">
                                    {metrics?.totalPartners || 0}
                                </p>
                                <p className="text-xs mt-1 text-blue-100">
                                    {metrics?.activePartners || 0} currently active
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-white opacity-80" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xl border-0 transition-all duration-200 ease-in-out bg-green-500 text-white">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-sm font-medium text-green-100">
                                    Active Orders
                                </h2>
                                <p className="text-3xl font-bold mt-1 text-white">
                                    {metrics?.activeOrders || 0}
                                </p>
                                <p className="text-xs mt-1 text-green-100">
                                    {metrics ? (metrics.totalOrders - metrics.activeOrders) : 0} completed
                                </p>
                            </div>
                            <PackageCheck className="h-8 w-8 text-white opacity-80" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xl border-0 transition-all duration-200 ease-in-out bg-pink-500 text-white">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-sm font-medium text-pink-100">
                                    Success Rate
                                </h2>
                                <p className="text-3xl font-bold mt-1 text-white">
                                    {metrics?.successRate || 0}%
                                </p>
                                <p className="text-xs mt-1 text-pink-100">
                                    Based on recent assignments
                                </p>
                            </div>
                            <Activity className="h-8 w-8 text-white opacity-80" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xl border-0 transition-all duration-200 ease-in-out bg-amber-500 text-white">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-sm font-medium text-amber-100">
                                    Online Partners
                                </h2>
                                <p className="text-3xl font-bold mt-1 text-white">
                                    {metrics?.activePartners || 0}
                                </p>
                                <p className="text-xs mt-1 text-amber-100">
                                    {metrics ? Math.round((metrics.activePartners / metrics.totalPartners) * 100) : 0}% of total partners
                                </p>
                            </div>
                            <MapPin className="h-8 w-8 text-white opacity-80" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 border border-gray-200 rounded-2xl">
                    <Card className="shadow-xl border-0">
                        <CardHeader className="bg-white p-3 rounded-3xl">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg font-semibold text-slate-800 rounded">Orders</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-slate-600 hover:text-slate-900 cursor-pointer"
                                    onClick={() => navigateTo("/orders")}
                                >
                                    View All <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            {loading ? (
                                <div className="text-center py-4">Loading orders...</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order Number</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Area</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-slate-200">
                                            {orders.slice(0, 5).map((order) => (
                                                <tr key={order._id}>
                                                    <td className="px-3 py-2 whitespace-nowrap">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                                            onClick={() => navigateTo(`/orders/${order._id}`)}
                                                        >
                                                            {order.orderNumber.slice(-4)}
                                                        </Button>
                                                    </td>
                                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-600">{order.customer.name}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-600">{order.area}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                              ${order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                                                order.status === "assigned" ? "bg-blue-100 text-blue-700" :
                                                                    "bg-green-100 text-green-700"}`}>
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="bg-white p-4 flex justify-end">
                            <Button
                                className="bg-green-600 hover:bg-green-700 cursor-pointer hover:text-white"
                                onClick={runSmartAssignment}
                                disabled={runningAssignment}
                            >
                                {runningAssignment ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running Assignment...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="mr-2 h-4 w-4" /> Run Smart Assignment
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Recent Assignments Section */}
                <div className="md:col-span-1 border border-gray-200 rounded-2xl">
                    <Card className="shadow-xl border-0 h-full">
                        <CardHeader className="bg-white p-3 rounded-4xl">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg font-semibold text-slate-800">Recent Assignments</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-slate-600 hover:text-slate-900 cursor-pointer"
                                    onClick={() => navigateTo("/assignments")}
                                >
                                    View All <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 h-96 overflow-auto">
                            {loading ? (
                                <div className="text-center py-4">Loading assignments...</div>
                            ) : (
                                <ul className="divide-y">
                                    {assignments.slice(0, 5).map((assignment) => (
                                        <li key={assignment._id} className="py-3 flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-slate-800">{assignment.partnerId.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {assignment.status === "success" ? "Assigned" : "Failed"} {getTimeAgo(assignment.createdAt)}
                                                    {assignment.reason && (
                                                        <span className="block text-rose-500 mt-1">{assignment.reason}</span>
                                                    )}
                                                </p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className={`text-xs ${assignment.status === "success"
                                                    ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                                    : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                                                    }`}
                                                onClick={() => navigateTo(`/orders/${assignment.orderId._id}`)}
                                            >
                                                {assignment.orderId.orderNumber.slice(-4)}
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;