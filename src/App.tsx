import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Secrets from './pages/Secrets';
import Sast from './pages/Sast';
import Sca from './pages/Sca';
import Container from './pages/Container';
import Sbom from './pages/Sbom';
import SupplyChain from './pages/SupplyChain';
import Settings from './pages/Settings';
import Integration from './pages/Integration';

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/secrets",
    element: <Secrets />,
  },
  {
    path: "/sast",
    element: <Sast />,
  },
  {
    path: "/sca",
    element: <Sca />,
  },
  {
    path: "/container",
    element: <Container />,
  },
  {
    path: "/sbom",
    element: <Sbom />,
  },
  {
    path: "/supply-chain",
    element: <SupplyChain />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/integration",
    element: <Integration />,
  },
]);

export default App;
