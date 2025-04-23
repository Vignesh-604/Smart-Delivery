// File: src/pages/Dashboard.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Users,
  PackageCheck,
  Activity,
  ArrowRight,
  LineChart,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  const router = useNavigate();
  const [selectedMetric, setSelectedMetric] = useState("partners");

  const navigateTo = (path: string) => {
    router(path);
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-slate-50 min-h-screen">
      {/* Welcome & Quick Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back, Admin!</h1>
          <p className="text-slate-500">Here's what's happening today</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => navigateTo("/Orders/OrderList")}>
            <PackageCheck className="mr-2 h-4 w-4" /> View All Orders
          </Button>
          <Button
            variant="outline"
            onClick={() => navigateTo("/Partners/PartnerList")}>
            <Users className="mr-2 h-4 w-4" /> Partners
          </Button>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className={`shadow-xl border-0 transition-all duration-200 ease-in-out cursor-pointer ${selectedMetric === "partners"
              ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white transform -translate-y-1"
              : "bg-blue-500 text-white hover:transform hover:-translate-y-1"
            }`}
          onClick={() => setSelectedMetric("partners")}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-blue-100">
                  Total Partners
                </h2>
                <p className="text-3xl font-bold mt-1 text-white">
                  18
                </p>
                <p className="text-xs mt-1 text-blue-100">
                  +2 from last week
                </p>
              </div>
              <Users className="h-8 w-8 text-white opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`shadow-xl border-0 transition-all duration-200 ease-in-out cursor-pointer ${selectedMetric === "orders"
              ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white transform -translate-y-1"
              : "bg-green-500 text-white hover:transform hover:-translate-y-1"
            }`}
          onClick={() => setSelectedMetric("orders")}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-green-100">
                  Active Orders
                </h2>
                <p className="text-3xl font-bold mt-1 text-white">
                  12
                </p>
                <p className="text-xs mt-1 text-green-100">
                  4 need assignment
                </p>
              </div>
              <PackageCheck className="h-8 w-8 text-white opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`shadow-xl border-0 transition-all duration-200 ease-in-out cursor-pointer ${selectedMetric === "success"
              ? "bg-gradient-to-br from-pink-500 to-fuchsia-500 text-white transform -translate-y-1"
              : "bg-pink-500 text-white hover:transform hover:-translate-y-1"
            }`}
          onClick={() => setSelectedMetric("success")}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-pink-100">
                  Success Rate
                </h2>
                <p className="text-3xl font-bold mt-1 text-white">
                  89.5%
                </p>
                <p className="text-xs mt-1 text-pink-100">
                  +1.2% from last month
                </p>
              </div>
              <Activity className="h-8 w-8 text-white opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`shadow-xl border-0 transition-all duration-200 ease-in-out cursor-pointer ${selectedMetric === "online"
              ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white transform -translate-y-1"
              : "bg-amber-500 text-white hover:transform hover:-translate-y-1"
            }`}
          onClick={() => setSelectedMetric("online")}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-amber-100">
                  Online Partners
                </h2>
                <p className="text-3xl font-bold mt-1 text-white">
                  10
                </p>
                <p className="text-xs mt-1 text-amber-100">
                  55% of total partners
                </p>
              </div>
              <MapPin className="h-8 w-8 text-white opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Map on the Left */}
        <div className="md:col-span-2">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-white p-3 rounded-3xl">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-slate-800 rounded">Orders</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900"
                  onClick={() => navigateTo("/Assignments/Metrics")}
                >
                  <LineChart className="h-4 w-4 mr-1" /> View Metrics
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order Number</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Partner</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                          onClick={() => navigateTo("/orders")}
                        >
                          #1234
                        </Button>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-600">Ramesh Yadav</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-600">30 min ago</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                          onClick={() => navigateTo("/orders")}
                        >
                          #1251
                        </Button>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-600">Priya Verma</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-600">45 min ago</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Assigned</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                          onClick={() => navigateTo("/orders")}
                        >
                          #1273
                        </Button>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-600">Rahul Sen</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-600">1 hour ago</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Pending</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="bg-white p-4 flex justify-between">
            <Button
                className=" bg-indigo-600 hover:bg-indigo-700"
                onClick={() => navigateTo("/Orders/AssignModal")}
              >
                <ShieldCheck className="mr-2 h-4 w-4" /> Run Smart Assignment
              </Button>
              <Button variant="default" onClick={() => navigateTo("/orders")} className="bg-indigo-600 hover:bg-indigo-700">
                View All Orders <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Recent Assignments Section (Replacing Orders) */}
        <div className="md:col-span-1">
          <Card className="shadow-xl border-0 h-full">
            <CardHeader className="bg-white p-3 rounded-4xl">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-slate-800">Recent Assignments</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900"
                  onClick={() => navigateTo("/Assignments/Metrics")}
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 h-80 overflow-auto">
              <ul className="divide-y">
                <li className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-800">Ramesh Yadav</p>
                    <p className="text-xs text-slate-500">Assigned 30 min ago</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    onClick={() => navigateTo("/orders")}
                  >
                    #1234
                  </Button>
                </li>
                <li className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-800">Priya Verma</p>
                    <p className="text-xs text-slate-500">Assigned 45 min ago</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    onClick={() => navigateTo("/orders")}
                  >
                    #1251
                  </Button>
                </li>
                <li className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-800">Rahul Sen</p>
                    <p className="text-xs text-slate-500">Assigned 1 hour ago</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    onClick={() => navigateTo("/orders")}
                  >
                    #1273
                  </Button>
                </li>
                <li className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-800">Ankit Sharma</p>
                    <p className="text-xs text-slate-500">Assigned 1.5 hours ago</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    onClick={() => navigateTo("/orders")}
                  >
                    #1282
                  </Button>
                </li>
                <li className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-800">Neha Patel</p>
                    <p className="text-xs text-slate-500">Assigned 2 hours ago</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    onClick={() => navigateTo("/orders")}
                  >
                    #1299
                  </Button>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Orders Section */}

    </div>
  );
};

export default Dashboard;