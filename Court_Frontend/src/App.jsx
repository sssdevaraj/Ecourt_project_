import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./AppLayout";
import AdminLoginPage from "./pages/AuthPage/AuthPage";
import CasePage from "./pages/casePage/CasePage";
import Complain from "./pages/Complain/Complain";
import ResetPassword from "./pages/RestPassword/ResetPassword";
import Transaction from "./pages/Transaction/Transaction";
import Feedback from "./pages/Feedback/Feedback";
import Packages from "./pages/Packges/Packages";
import MobileMaintainance from "./pages/Mobilemaintainance/MobileMaintainance";
import CaseHistoryTable from "./pages/casePage/Casehistory";
import PrivateRoute from "./privateRoute/privateRoute";
import AdminCaseTable from "./adminPages/adminCases/AdminCasePage";
import AdminTransaction from "./adminPages/admintransaction/AdminTransaction";
import AdminComplain from "./adminPages/adminComplain/AdminComplain";
import AdminFeedback from "./adminPages/adminFeedback/AdminFeedBack";
import CasesStatusScreen from './pages/casePage/CaseStatus';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AdminLoginPage />,
    },
    {
      path: "/reset-password/:token",
      element: <ResetPassword />,
    },
    {
      path: "/user",
      element: <PrivateRoute requiredRole="USER" />, 
      children: [
        {
          element: <AppLayout />, 
          children: [
            {
              path: "cases",
              element: <CasePage />,
            },
            {
              path: "case-status",
              element: <CasesStatusScreen />,
            },
            {
              path: "case-history",
              element: <CaseHistoryTable />,
            },
            {
              path: "complaints",
              element: <Complain />,
            },
            {
              path: "transactions",
              element: <Transaction />,
            },
            {
              path: "feedback",
              element: <Feedback />,
            },
            {
              path: "packages",
              element: <Packages />,
            },
            {
              path: "mobile-maintenance",
              element: <MobileMaintainance />,
            },
          ],
        },
      ],
    },

    //admin screen start here 
    {
      path: "/admin",
      element: <PrivateRoute requiredRole="ADMIN" />, 
      children: [
        {
          element: <AppLayout />, 
          children: [
            {
              path: "cases",
              element: <AdminCaseTable />,
            },
            {
              path: "complaints",
              element: <AdminComplain />,
            },
            {
              path: "transactions",
              element: <AdminTransaction />,
            },
            {
              path: "feedback",
              element: <AdminFeedback />,
            },
            {
              path: "packages",
              element: <Packages />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;