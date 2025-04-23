import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, Package } from 'lucide-react';

interface Item {
	name: string;
	quantity: number;
	price: number;
	_id: string;
}

interface Customer {
	name: string;
	phone: string;
	address: string;
}

interface AssignedTo {
	_id: string;
	name: string;
	email: string;
}

interface Order {
	_id: string;
	orderNumber: string;
	area: string;
	items: Item[];
	status: 'pending' | 'assigned' | 'delivered' | 'picked' | 'cancelled' | string;
	scheduledFor: string;
	createdAt: string;
	updatedAt: string;
	customer: Customer;
	assignedTo?: AssignedTo;
	__v: number;
}

interface ApiResponse {
	statusCode: number;
	data: Order[];
	message: string;
	success: boolean;
}

type FilterStatus = 'all' | 'pending' | 'assigned' | 'delivered' | 'picked' | 'cancelled';

export default function OrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

	const navigate = useNavigate();

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true);
				const response = await axios.get<ApiResponse>('/api/orders');
				if (response.data.success) {
					setOrders(response.data.data);
					setFilteredOrders(response.data.data);
				} else {
					setError('Failed to fetch orders: ' + response.data.message);
				}
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : 'Unknown error';
				setError('Error fetching orders: ' + errorMessage);
				console.error('Error fetching orders:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, []);

	const handleManualAssign = async (e: React.MouseEvent, orderId: string): Promise<void> => {
		e.stopPropagation()
		alert(`Opening assignment interface for order: ${orderId}`);
	};

	const calculateTotal = (items: Item[]): number => {
		return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
	};

	const filterOrders = (status: FilterStatus): void => {
		setActiveFilter(status);

		if (status === 'all') {
			setFilteredOrders(orders);
			return;
		}

		const filtered = orders.filter(order => order.status === status);
		setFilteredOrders(filtered);
	};

	const getStatusColor = (status: string): string => {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'assigned':
				return 'bg-blue-100 text-blue-800';
			case 'delivered':
				return 'bg-green-100 text-green-800';
			case 'picked':
				return 'bg-purple-100 text-purple-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="text-gray-600">Loading orders...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg shadow-sm">
				<p className="font-medium">Error</p>
				<p>{error}</p>
			</div>
		);
	}

	return (
		<div className="bg-gray-50 min-h-screen">

			<div className="bg-gray-100 p-4 mb-4 md:hidden">
				<h1 className="text-xl font-bold text-gray-800">Welcome back, Admin!</h1>
				<p className="text-gray-500 text-sm">Here's what's happening today</p>
				
				<div className="flex mt-4 space-x-2">
					<button className="flex items-center border border-gray-300 rounded-lg px-4 py-2 text-gray-700">
						<Users className="h-4 w-4 mr-2" />
						Partners
					</button>
					<button className="flex items-center bg-blue-600 text-white rounded-lg px-4 py-2">
						<Package className="h-4 w-4 mr-2" />
						Orders
					</button>
					<button className="flex items-center border border-gray-300 rounded-lg px-4 py-2 text-gray-700">
						<Users className="h-4 w-4 mr-2" />
						Assignments
					</button>
				</div>
			</div>

			<div className="px-4 md:px-6 max-w-6xl mx-auto">

				<div className="hidden md:flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-gray-800">Orders</h1>
				</div>

				<div className="flex items-center mb-4">
					<h2 className="text-xl font-bold text-gray-800 mr-2 md:hidden">Orders</h2>
					<div className="flex overflow-x-auto scrollbar-hide space-x-1 bg-white rounded-lg p-1 shadow-sm">
						{(['all', 'pending', 'assigned', 'delivered', 'picked', 'cancelled'] as FilterStatus[]).map((status) => (
							<button
								key={status}
								onClick={() => filterOrders(status)}
								className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeFilter === status
									? 'bg-blue-500 text-white'
									: 'bg-white text-gray-700 hover:bg-gray-100'
									}`}
							>
								{status.charAt(0).toUpperCase() + status.slice(1)}
							</button>
						))}
					</div>
				</div>

				{filteredOrders.length === 0 ? (
					<div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
						<p className="text-lg">No orders found {activeFilter !== 'all' ? `with status "${activeFilter}"` : ''}</p>
					</div>
				) : (
					<>
						<div className="md:hidden">
							{filteredOrders.map((order, index) => (
								<div 
									key={index}
									onClick={() => navigate(`/orders/${order._id}`)}
									className="bg-white mb-3 rounded-lg shadow-sm border border-gray-100 overflow-hidden cursor-pointer"
								>
									<div className="p-4 border-b border-gray-100">
										<div className="flex justify-between items-center">
											<div className="text-gray-900 font-medium">{order.orderNumber}</div>
											<span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
												{order.status}
											</span>
										</div>
										<div className="mt-2 text-gray-600 text-sm">{order.customer.name}</div>
										<div className="text-gray-500 text-xs">{order.area}</div>
									</div>
									{order.status === 'pending' && (
										<div className="p-3 bg-gray-50 text-right">
											<button
												onClick={(e) => handleManualAssign(e, order._id)}
												className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm shadow-sm transition-colors"
											>
												Manual Assign
											</button>
										</div>
									)}
								</div>
							))}
						</div>

						<div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
							<table className="min-w-full divide-y divide-gray-200">
								<thead>
									<tr className="bg-gray-50">
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
										<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
										<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
										<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{filteredOrders.map((order, index) => (
										<tr
											key={index}
											onClick={() => navigate(`/orders/${order._id}`)}
											className="hover:bg-gray-50 cursor-pointer transition-colors"
										>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderNumber}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer.name}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.area}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.scheduledFor}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
												₹{calculateTotal(order.items).toFixed(2)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-center">
												<span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
													{order.status}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-right text-sm">
												{order.status === 'pending' ? (
													<button
														onClick={(e) => handleManualAssign(e, order._id)}
														className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm shadow-sm transition-colors"
													>
														Manual Assign
													</button>
												) : (
													<span className="text-gray-700 text-sm">
														{order.assignedTo && (
															<>Assigned to: <span className="font-medium">{order.assignedTo.name}</span></>
														)}
													</span>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</>
				)}
			</div>
		</div>
	);
}