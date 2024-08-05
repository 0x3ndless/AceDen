import { Suspense, lazy } from 'react';
import { useRoutes, useLocation, Navigate } from 'react-router-dom';
// layouts
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import LoadingScreen from '../components/LoadingScreen';
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

export default function Router() {
  return useRoutes([

    {
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Home/>},
        // { path: '/tokenomics', element: <Tokenomics/>},
        // { path: '/presale', element: <Presale/>},
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ]
    },

  ]);
}


// Dashboard
const Home = Loadable(lazy(() => import('../pages/Home')));
// const Tokenomics = Loadable(lazy(() => import('../pages/Tokenomics')));
// const Presale = Loadable(lazy(() => import('../pages/Presale')));
const Page404 = Loadable(lazy(() => import('../pages/Page404')));