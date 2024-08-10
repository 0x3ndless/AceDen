import React, { Suspense, lazy } from 'react';
import { useRoutes, useLocation, Navigate } from 'react-router-dom';
// layouts
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import UserLayout from '../layouts/UserLayout';
import LoadingScreen from '../components/LoadingScreen';
import { useAccount } from 'wagmi';
// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/')} />}>
      <Component {...props} />
    </Suspense>
  );
};

// Custom higher-order component for checking access token and isConnected
const ProtectedRoute = ({ element, ...rest }) => {
  const accessTokenExists = localStorage.getItem('access_token') !== null;
  const isConnected = useAccount().isConnected;

  if (!accessTokenExists || (!isConnected)) {
    return <Navigate to="/" />;
  }

  return React.cloneElement(element, rest);
};

export default function Router() {
  return useRoutes([

    {
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Home/>},
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ]
    },

    {
      element: <UserLayout />,
      children: [
        { path: '/profile', element: <ProtectedRoute element= {<Profile />} />},
        { path: '/bet/create', element: <ProtectedRoute element= {<Bet />} />},
        { path: '/explore', element: <Explore />},
        { path: '/leaderboard', element: <Leaderboard />},
      ]
    },

  ]);
}


// App Routes
const Home = Loadable(lazy(() => import('../pages/Home')));
const Explore = Loadable(lazy(() => import('../pages/Explore')));
const Leaderboard = Loadable(lazy(() => import('../pages/Leaderboard')));
const Profile = Loadable(lazy(() => import('../pages/Profile')));
const Bet = Loadable(lazy(() => import('../pages/Bet')));
const Page404 = Loadable(lazy(() => import('../pages/Page404')));