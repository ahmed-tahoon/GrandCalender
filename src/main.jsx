import React from 'react'
import Buffer from 'buffer/'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import './index.css'
import './i18n';

// Routes
import ErrorPage from "error-page";
import Root from "routes/root";
import Login from 'routes/login'
import Register from 'routes/register'
import Onboarding from 'routes/onboarding'
import ResetPassword from 'routes/reset-password'
import Profile from 'routes/profile';
import Security from 'routes/security';
import App from 'App';
import userApi from 'utils/userApi';
import redirectCheck from 'utils/redirectCheck';
import userApiOnboarding from 'utils/userApiOnboarding';
import ResetPasswordUpdate from 'routes/reset-password-update';
import guestCheck from 'utils/guestCheck';
import VerifyEmail from 'routes/verify-email';
import userApiEmailVerify from 'utils/userApiEmailVerify';
import Plans from 'routes/plans';
import OrdersBillings from 'routes/orders-billings';
import ChangeEmail from 'routes/change-email';
import OrdersBillingsShow from 'routes/orders-billings-show';
import SuspendedPage from 'suspended-page';
import userApiSuspended from 'utils/userApiSuspended';
import userApiDeactivated from 'utils/userApiDeactivated';
import DeactivatedPage from 'deactivated-page';
import ReschedulingsRedirect from 'routes/reschedulings-redirect';
import CancellationsRedirect from 'routes/cancellations-redirect';

// Features
import Availability from 'features/Availability';
import AvailabilityCreate from 'features/Availability/Create';
import AvailabilityEdit from 'features/Availability/Edit';
import Calendars from 'features/Calendars';
import CalendarsCreate from 'features/Calendars/Create';
import CalendarsEdit from 'features/Calendars/Edit';
import Bookings from 'features/Bookings';

// Dashboard
import Dashboard from 'routes/dashboard';

// Transactions
import Transactions from 'routes/transactions';
import TransactionShow from 'routes/transactions-show';
import Invoice from 'routes/invoice';

// Integration
import IntegrationList from 'features/Integrations/List';
import GoogleCalendar from 'features/Integrations/GoogleCalendar/index';
import Zoom from 'features/Integrations/Zoom/index';
import GoogleMeet from 'features/Integrations/GoogleMeet/index';
import GoogleCalendarCallback from 'features/Integrations/GoogleCalendar/callback';
import ZoomCallback from 'features/Integrations/Zoom/callback';

const router = createBrowserRouter([
    // Core routes
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard",
        loader: userApi,
        element: <Dashboard />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard/calendars",
        loader: userApi,
        element: <Calendars />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard/profile",
        loader: userApi,
        element: <Profile />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard/security",
        loader: userApi,
        element: <Security />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard/change-email",
        loader: userApi,
        element: <ChangeEmail />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard/plans",
        loader: userApi,
        element: <Plans />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard/orders-billings",
        loader: userApi,
        element: <OrdersBillings />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard/orders-billings/:id",
        loader: userApi,
        element: <OrdersBillingsShow />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard/transactions",
        loader: userApi,
        element: <Transactions />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard/transactions/:id",
        loader: userApi,
        element: <TransactionShow />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/onboarding",
        loader: userApiOnboarding,
        element: <Onboarding />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/verify-email",
        loader: userApiEmailVerify,
        element: <VerifyEmail />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/login",
        loader: guestCheck,
        element: <Login />,
    },
    {
        path: "/register",
        loader: guestCheck,
        element: <Register />,
    },
    {
        path: "/reset-password",
        element: <ResetPassword />,
    },
    {
        path: "/reset-password/:token",
        element: <ResetPasswordUpdate />,
    },
    {
        path: "/suspended",
        loader: userApiSuspended,
        element: <SuspendedPage />,
    },
    {
        path: "/deactivated",
        loader: userApiDeactivated,
        element: <DeactivatedPage />,
    },

    // Feature routes
    {
        path: "/dashboard/availability",
        loader: userApi,
        element: <Availability />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard/availability/create",
        loader: userApi,
        element: <AvailabilityCreate />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard/availability/:modelId",
        loader: userApi,
        element: <AvailabilityEdit />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard/calendars/create",
        loader: userApi,
        element: <CalendarsCreate />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard/calendars/:modelId",
        loader: userApi,
        element: <CalendarsEdit />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard/bookings",
        loader: userApi,
        element: <Bookings />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard/transactions/invoice/:id",
        loader: userApi,
        element: <Invoice />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard/integrations",
        loader: userApi,
        element: <IntegrationList />,
        errorElement: <ErrorPage />,

    },
    {
        path: "/dashboard/integrations/google-calendar",
        loader: userApi,
        element: <GoogleCalendar />,
        errorElement: <ErrorPage />,

    },
    {
        path: "/dashboard/integrations/google-calendar/:id",
        loader: userApi,
        element: <GoogleCalendarCallback />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard/integrations/zoom",
        loader: userApi,
        element: <Zoom />,
        errorElement: <ErrorPage />,

    },
    {
        path: "/dashboard/integrations/zoom/:id",
        loader: userApi,
        element: <ZoomCallback />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard/integrations/google-meet",
        loader: userApi,
        element: <GoogleMeet />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/reschedulings/:uid",
        loader: redirectCheck,
        element: <ReschedulingsRedirect />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/cancellations/:uid",
        loader: redirectCheck,
        element: <CancellationsRedirect />,
        errorElement: <ErrorPage />,
    },
])

ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
    <RouterProvider router={router} />
//   </React.StrictMode>,
)
