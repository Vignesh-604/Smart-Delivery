import { NavLink } from 'react-router-dom';
import { Users, PackageCheck, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const style = "hover:bg-indigo-700 cursor-pointer hover:text-white";
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-6 bg-gray-200 rounded-b-xl w-full">
      <div className="text-center md:text-left mb-4 md:mb-0">
        <h1 className="text-2xl font-bold text-slate-800">Welcome back, Admin!</h1>
        <p className="text-slate-500">Here's what's happening today</p>
      </div>
      
      <div className="flex justify-center space-x-1 md:space-x-2 overflow-x-auto max-w-full">
        <NavLink to="/" className={({ isActive }) => 
          isActive ? "hidden" : "hidden md:block"
        }>
          {({ isActive }) => (
            <Button
              variant={isActive ? "default" : "outline"}
              className={isActive ? `bg-indigo-600 text-white ${style}` : style}>
              <LayoutDashboard className="mr-1 md:mr-2 h-4 w-4" /> 
              <span className="text-xs md:text-sm">Dashboard</span>
            </Button>
          )}
        </NavLink>
        
        <NavLink to="/partners">
          {({ isActive }) => (
            <Button
              variant={isActive ? "default" : "outline"} 
              size="sm"
              className={isActive ? `bg-indigo-600 text-white text-xs md:text-sm px-2 md:px-4 ${style}` : `text-xs md:text-sm px-2 md:px-4 ${style}`}>
              <Users className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> 
              <span>Partners</span>
            </Button>
          )}
        </NavLink>
        
        <NavLink to="/orders">
          {({ isActive }) => (
            <Button
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={isActive ? `bg-indigo-600 text-white text-xs md:text-sm px-2 md:px-4 ${style}` : `text-xs md:text-sm px-2 md:px-4 ${style}`}>
              <PackageCheck className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> 
              <span>Orders</span>
            </Button>
          )}
        </NavLink>
        
        <NavLink to="/assignments">
          {({ isActive }) => (
            <Button
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={isActive ? `bg-indigo-600 text-white text-xs md:text-sm px-2 md:px-4 ${style}` : `text-xs md:text-sm px-2 md:px-4 ${style}`}>
              <Users className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> 
              <span>Assignments</span>
            </Button>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;