import { createBrowserRouter } from "react-router";
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
import ManageAdmins from "../Pages/Dashboard/ManageAdmins/ManageAdmins";
import ForbiddenAccess from "../Pages/Forbidden/ForbiddenAccess";
import AdminRoute from "../routes/AdminRoute";
import AssignRider from "../Pages/Dashboard/AssignRider/AssignRider";
import RiderRoute from "../routes/RiderRoute";
import PendingTask from "../Pages/Dashboard/PendingTask/PendingTask";
import CompletedDeliveries from "../Pages/Dashboard/CompletedDeliveries/CompletedDeliveries";
import MyEarnings from "../Pages/Dashboard/MyEarnings/MyEarnings";
import TrackingTimeline from "../Pages/Dashboard/TrackingTimeline/TrackingTimeline";
import DashBoardHome from "../Pages/Dashboard/DashboardHome/DashBoardHome";

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
        path: "/coverege",
        loader: () => fetch("./warehouses.json"),
        Component: Coverege,
      },
      {
        path: "/be-rider",
        element: (
          <PrivateRoute>
            <BeARidser></BeARidser>
          </PrivateRoute>
        ),
      },
      {
        path: "/send-parcel",
        element: (
          <PrivateRoute>
            <SendParcel></SendParcel>
          </PrivateRoute>
        ),
      },
      {
        path: "/forbidden-access",
        Component: ForbiddenAccess,
      },
    ],
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
        path: "/register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashLayout></DashLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: DashBoardHome,
      },
      {
        path: "my-parcels",
        Component: MyParcels,
      },
      {
        path: "tracking/:tracking_id",
        Component: TrackingTimeline,
      },
      {
        path: "payment/:parcelId",
        Component: Payment,
      },
      {
        path: "payment-history",
        Component: PaymentHistory,
      },
      // rider only routes

      {
        path: "pending-task",
        element: (
          <RiderRoute>
            <PendingTask></PendingTask>
          </RiderRoute>
        ),
      },
      {
        path: "completed-deliveries",
        element: (
          <RiderRoute>
            <CompletedDeliveries></CompletedDeliveries>
          </RiderRoute>
        ),
      },
      {
        path: "my-earnings",
        element: (
          <RiderRoute>
            <MyEarnings></MyEarnings>
          </RiderRoute>
        ),
      },

      //admin only routes
      {
        path: "pending-riders",

        element: (
          <AdminRoute>
            <PendingRiders></PendingRiders>
          </AdminRoute>
        ),
      },
      {
        path: "active-riders",

        element: (
          <AdminRoute>
            <ActiveRiders></ActiveRiders>
          </AdminRoute>
        ),
      },
      {
        path: "manage-admins",
        element: (
          <AdminRoute>
            <ManageAdmins></ManageAdmins>
          </AdminRoute>
        ),
      },
      {
        path: "assign-rider",
        element: (
          <AdminRoute>
            <AssignRider></AssignRider>
          </AdminRoute>
        ),
      },
    ],
  },
]);
