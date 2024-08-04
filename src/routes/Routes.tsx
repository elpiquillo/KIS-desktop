import React, { ReactNode } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import ForgotPassword from '../pages/auth/forgot-password';
import Login from '../pages/auth/login';

import VerificationLink from '../pages/auth/verification-link';

import { AuthHandler, ProtectedRoute } from '../auth/AuthHandler';
import MainLayout from '../layouts/main';
import AuthLayout from '../layouts/auth';
import Applications from '../pages/applications/Applications';
import Home from '../pages/home/home';
import ApplicationLayout from '../layouts/application';

function PageWrapper({ element, needAuth = true }: { element: ReactNode; needAuth: boolean }) {
  const wrappedElement = element;
  if (needAuth) <ProtectedRoute element={wrappedElement} />;
  return wrappedElement;
}

export function AuthentifiedLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

export function Router() {
  return (
    <BrowserRouter>
      <AuthHandler />
      <Routes>
        <Route
          element={
            <AuthLayout image="https://cloud.getkis.io/static/media/bg-cloud.bcd18fb5446f2f6b04ed.png">
              <Outlet />
            </AuthLayout>
          }
        >
          <Route path="/login" element={<PageWrapper element={<Login />} needAuth={false} />} />
          <Route
            path="/forgot-password"
            element={<PageWrapper element={<ForgotPassword />} needAuth={false} />}
          />
          <Route
            path="/verification-link"
            element={<PageWrapper element={<VerificationLink />} needAuth={false} />}
          />
        </Route>

        <Route element={<AuthentifiedLayout />}>
          <Route path="/" element={<PageWrapper needAuth element={<Home />} />} />
          <Route
            element={
              <ApplicationLayout>
                <Outlet />
              </ApplicationLayout>
            }
          >
            <Route
              path="/:applicationId/"
              element={<PageWrapper needAuth element={<Applications />} />}
            />
            <Route
              path="/:applicationId/:pageId"
              element={<PageWrapper needAuth element={<Applications />} />}
            />
          </Route>
          <Route path="*" element={<PageWrapper needAuth={false} element={<Home />} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
