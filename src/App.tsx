
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Secrets from './pages/Secrets';
import SAST from './pages/SAST';
import SCA from './pages/SCA';
import Container from './pages/Container';
import SBOM from './pages/SBOM';
import SupplyChain from './pages/SupplyChain';
import Settings from './pages/Settings';
import Integration from './pages/Integration';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <React.StrictMode>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
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
    element: <SAST />,
  },
  {
    path: "/sca",
    element: <SCA />,
  },
  {
    path: "/container",
    element: <Container />,
  },
  {
    path: "/sbom",
    element: <SBOM />,
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
