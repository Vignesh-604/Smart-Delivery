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
// import PartnerList from "@/pages/Partners/PartnerList";
// import PartnerForm from "@/pages/Partners/PartnerForm";
import OrderList from "@/pages/Orders/OrderList";
import OrderDetails from "@/pages/Orders/OrderDetails";
// import Metrics from "@/pages/Assignments/Metrics";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />} />
      {/* <Route path="/partners" element={<PartnerList />} />
      <Route path="/partners/new" element={<PartnerForm />} />
      <Route path="/partners/edit/:id" element={<PartnerForm />} /> */}
      <Route path="/orders" element={<OrderList />} />
      <Route path="/orders/:id" element={<OrderDetails />} />
      {/* <Route path="/assignments/metrics" element={<Metrics />} /> */}
      {/* Fallback */}
      <Route path="*" element={<Dashboard />} />
    </>
  )
);

createRoot(document.getElementById('root')!).render(

  <RouterProvider router={router} />

)
