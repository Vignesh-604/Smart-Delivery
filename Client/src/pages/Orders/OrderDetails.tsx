import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Define interfaces for type safety
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
  data: Order;
  message: string;
  success: boolean;
}

export default function OrderDetailsPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchOrderDetails = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(`http://localhost:5000/api/orders/${id}`);
        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          setError('Failed to fetch order details: ' + response.data.message);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError('Error fetching order details: ' + errorMessage);
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const handleManualAssign = async (): Promise<void> => {
    if (!order) return;
    alert(`Opening assignment interface for order: ${order._id}`);
  };

  const calculateTotal = (items: Item[]): number => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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
        <div className="text-gray-600">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg shadow-sm mx-auto max-w-6xl mt-6">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg shadow-sm mx-auto max-w-6xl mt-6">
        <p className="font-medium">No order found</p>
        <p>The requested order could not be found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
        <button 
          onClick={() => window.history.back()}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          Back to Orders
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{order.orderNumber}</h2>
            <p className="text-gray-600 mt-1"><b>Area:</b> {order.area}</p>
            <p className="text-gray-600"><b>Scheduled for:</b> {order.scheduledFor}</p>
            <p className="text-gray-600"><b>Created:</b> {formatDate(order.createdAt)}</p>
            {order.updatedAt !== order.createdAt && (
              <p className="text-gray-600">Last Updated: {formatDate(order.updatedAt)}</p>
            )}
          </div>
          <div className="text-right">
            <span className={`px-4 py-2 rounded-full text-sm font-medium inline-block ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            
            <div className="mt-4">
              {order.status === 'pending' ? (
                <button 
                  onClick={handleManualAssign}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Manual Assign
                </button>
              ) : order.assignedTo ? (
                <div className="bg-blue-50 p-3 rounded-lg shadow-sm text-left">
                  <p className="text-gray-700 text-sm">Assigned to:</p>
                  <p className="font-semibold text-gray-800">{order.assignedTo.name}</p>
                  <p className="text-gray-600 text-sm">{order.assignedTo.email}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-800">Customer Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Name</p>
                <p className="font-medium text-gray-800">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Phone</p>
                <p className="font-medium text-gray-800">{order.customer.phone}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Address</p>
                <p className="font-medium text-gray-800">{order.customer.address}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-800">Order Items</h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-gray-600 text-sm font-medium">Item</th>
                  <th className="px-4 py-3 text-gray-600 text-sm font-medium">Quantity</th>
                  <th className="px-4 py-3 text-gray-600 text-sm font-medium">Price</th>
                  <th className="px-4 py-3 text-gray-600 text-sm font-medium text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className="border-t border-gray-200">
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">₹ {item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">₹ {(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-200 font-semibold bg-gray-100">
                  <td colSpan={3} className="px-4 py-3 text-right">Total:</td>
                  <td className="px-4 py-3 text-right">₹ {calculateTotal(order.items).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-4">
          <button 
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Print Order
          </button>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
}