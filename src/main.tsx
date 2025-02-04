import BugsnagPerformance from '@bugsnag/browser-performance';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import React from 'react';
import ReactDOM from 'react-dom/client';


import './index.css';
import './locales/i18n';
import { ErrorBoundary } from './components/error-boundary';
import { SnackbarProvider } from './components/snackbar';
import { Router } from './routes/Routes';
import ThemeProvider from './theme';
import '../muiSetup';

Bugsnag.start('ddf870d22820d3119afcd00910c7e288')
BugsnagPerformance.start({ apiKey: 'ddf870d22820d3119afcd00910c7e288' })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary bugSnag={Bugsnag}>
      <ThemeProvider>
        <SnackbarProvider>
          <Router />
        </SnackbarProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
