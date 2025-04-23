import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import PartnerDetails from './pages/Partners/PartnerDetails.tsx';
import PartnerList from "@/pages/Partners/PartnerList";
import PartnerForm from "@/pages/Partners/PartnerForm";
import OrderList from "@/pages/Orders/OrderList";
import OrderDetails from "@/pages/Orders/OrderDetails";
import History from "@/pages/Assignment/History"

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />} >
        <Route index element={<Dashboard />} />
        <Route path="/partners/details/:id" element={<PartnerDetails />} />
        <Route path="/partners" element={<PartnerList />} />
        <Route path="/partners/new" element={<PartnerForm />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/assignments" element={<History />} />

        <Route path="*" element={<Dashboard />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById('root')!).render(

  <RouterProvider router={router} />

)
