import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PartnerShift {
  start: string;
  end: string;
}

interface Partner {
  _id: string;
  name: string;
  status: string;
  currentLoad: number;
  shift: PartnerShift;
  areas: string[];
}

interface ApiResponse {
  statusCode: number;
  data: Partner[];
  message: string;
  success: boolean;
}

const Partners: React.FC = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>('/api/partners/');
        
        if (response.data.success) {
          setPartners(response.data.data);
        } else {
          setError('Failed to fetch partners');
        }
      } catch (err) {
        setError('Error fetching partners list');
        console.error('Error fetching partners:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const viewPartnerDetails = (partnerId: string) => {
    navigate(`/partners/details/${partnerId}`);
  };

  if (loading) return <div className="flex justify-center p-8">Loading partners...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Partners</h1>
        <button
          onClick={() => navigate('/partners/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer hover:scale-105"
        >
          Add New Partner
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Load
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shift Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Areas
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {partners.map((partner) => (
              <tr 
                key={partner._id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => viewPartnerDetails(partner._id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-blue-600">
                    {partner.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${partner.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : partner.status === 'inactive'
                        ? 'bg-gray-100 text-gray-800'
                        : partner.status === 'on_leave'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'}`}
                  >
                    {partner.status.charAt(0).toUpperCase() + partner.status.slice(1).replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {partner.currentLoad} {partner.currentLoad === 1 ? 'order' : 'orders'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {partner.shift.start} - {partner.shift.end}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 flex flex-wrap gap-1">
                    {partner.areas && partner.areas.length > 0 ? (
                      partner.areas.map((area, index) => (
                        <span 
                          key={index} 
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {area}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No areas assigned</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            
            {partners.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No partners found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Partners;