import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PartnerRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    areasInput: '',
    shift: {
      start: '09:00',
      end: '17:00'
    }
  });


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'start' || name === 'end') {
      setForm({
        ...form,
        shift: {
          ...form.shift,
          [name]: value
        }
      });
    } else {
      setForm({
        ...form,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const areas = form.areasInput
        .split(',')
        .map(area => area.trim())
        .filter(area => area !== '');

      const partnerData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        areas,
        shift: form.shift
      };

      const response = await axios.post('/api/partners', partnerData);

      if (response.data.success) {
        navigate(`/partners/details/${response.data.data._id}`);
      } else {
        setError(response.data.message || 'Failed to register partner');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error registering partner');
      setLoading(false);
      console.error('Error registering partner:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Register New Partner</h1>
        <button
          onClick={() => navigate('/partners')}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Partner's full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="partner@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Phone number"
              />
            </div>

            <div>
              <label htmlFor="areasInput" className="block text-sm font-medium text-gray-700 mb-1">
                Service Areas <span className="text-red-500">*</span>
              </label>
              <input
                id="areasInput"
                name="areasInput"
                type="text"
                required
                value={form.areasInput}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Zone1, Zone2, Zone3 (comma separated)"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter areas separated by commas (e.g., Zone1, Zone2, Zone3)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
                  Shift Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  id="start"
                  name="start"
                  type="time"
                  required
                  value={form.shift.start}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
                  Shift End Time <span className="text-red-500">*</span>
                </label>
                <input
                  id="end"
                  name="end"
                  type="time"
                  required
                  value={form.shift.end}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/partners')}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? 'Registering...' : 'Register Partner'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerRegistration;