import {
  createBrowserRouter,
} from "react-router";
import RootLayout from "../layouts/RootLayout/RootLayout";
import Home from "../Pages/Home/Home";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import LogIn from "../Pages/Authentication/LogIn";
import Register from "../Pages/Authentication/Register";
import Coverege from "../Pages/Coverege/Coverege";
import PrivateRoute from "../routes/PrivateRoute";
import SendParcel from "../Pages/SendParcel/SendParcel";
import DashLayout from "../layouts/DashLayout/DashLayout";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels";
import Payment from "../Pages/Dashboard/MyParcels/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/PaymentHIstory/PaymentHistory";
import BeARidser from "../Pages/BeARider/BeARidser";
import PendingRiders from "../Pages/Dashboard/PendingRiders/PendingRiders";
import ActiveRiders from "../Pages/Dashboard/ActiveRiders/ActiveRiders";



export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: '/coverege',
        loader: ()=> fetch('./warehouses.json'),
        Component: Coverege
      },
      {
        path:'/be-rider',
        element: <PrivateRoute><BeARidser></BeARidser></PrivateRoute>
      },
      {
        path: '/send-parcel',
        element: <PrivateRoute><SendParcel></SendParcel></PrivateRoute>
      }
    ]
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "/login",
        Component: LogIn,
      },
      {
        path: '/register',
        Component: Register,
      }
    ]
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><DashLayout></DashLayout></PrivateRoute>,
    children: [
      {
        path: 'my-parcels',
        Component: MyParcels
      },
      {
        path: "payment/:parcelId",
        Component: Payment,
      },
      {
        path: "payment-history",
        Component: PaymentHistory,
      },
      {
        path: "pending-riders",
        Component: PendingRiders,
      },
      {
        path: "active-riders",
        Component: ActiveRiders,
      }
    ]
  }
]);