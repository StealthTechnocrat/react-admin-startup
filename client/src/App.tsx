import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/Authentication/SignIn';

import DefaultLayout from './shared/layout/DefaultLayout';
import PageTitle from './shared/components/PageTitle';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './shared/errors/ErrorBoundary';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoutes from './shared/routes/ProtectedRoutes';
import AdministrationPage from './pages/administration/AdministrationPage';

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app here
        console.log('Error boundary reset');
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoutes />}>
            <Route path="" element={<DefaultLayout />}>
              <Route
                path="dashboard"
                element={
                  <>
                    <PageTitle title="MMG | Dashboard" />
                    <></>
                  </>
                }
              />

              <Route
                index
                path="admins"
                element={
                  <>
                    <PageTitle title="MMG | Admins" />
                    <AdministrationPage />
                  </>
                }
              />

              <Route
                path="settings"
                element={
                  <>
                    <PageTitle title="MMG | Settings" />
                    <></>
                  </>
                }
              />
            </Route>
          </Route>

          <Route
            path="/login"
            element={
              <>
                <PageTitle title="Signin" />
                <SignIn />
              </>
            }
          />

          {/* <Route
            path="/forgot-password"
            element={
              <>
                <PageTitle title="Forgot Password" />
                <ForgotPassword />
              </>
            }
          />
          <Route
            path="/reset-password"
            element={
              <>
                <PageTitle title="Forgot Password" />
                <ResetPassword />
              </>
            }
          /> */}
          <Route path={'*'} element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
