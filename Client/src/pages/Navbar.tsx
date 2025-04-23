import { NavLink } from 'react-router-dom';
import { Users, PackageCheck, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
    const style = "hover:bg-indigo-700 cursor-pointer hover:text-white"
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-gray-200 rounded-b-xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Welcome back, Admin!</h1>
        <p className="text-slate-500">Here's what's happening today</p>
      </div>
      <div className="flex space-x-2 mt-4 md:mt-0">
        <NavLink to="/" className={({ isActive }) => 
          isActive ? "hidden" : "hidden md:block cursor-pointer"
        }>
          {({ isActive }) => (
            <Button
              variant={isActive ? "default" : "outline"}
              className={isActive ? `bg-indigo-600 text-white ${style}` : style}>
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
            </Button>
          )}
        </NavLink>
        <NavLink to="/partners" className={({ isActive }) => 
          isActive ? "" : ""
        }>
          {({ isActive }) => (
            <Button
              variant={isActive ? "default" : "outline"}
              className={isActive ? `bg-indigo-600 text-white ${style}` : style}>
              <Users className="mr-2 h-4 w-4" /> Partners
            </Button>
          )}
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => 
          isActive ? "" : ""
        }>
          {({ isActive }) => (
            <Button
              variant={isActive ? "default" : "outline"}
              className={isActive ? `bg-indigo-600 text-white ${style}` : style}>
              <PackageCheck className="mr-2 h-4 w-4" /> Orders
            </Button>
          )}
        </NavLink>
        <NavLink to="/assignments" className={({ isActive }) => 
          isActive ? "" : ""
        }>
          {({ isActive }) => (
            <Button
              variant={isActive ? "default" : "outline"}
              className={isActive ? `bg-indigo-600 text-white ${style}` : style}>
              <Users className="mr-2 h-4 w-4" /> Assignments
            </Button>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;