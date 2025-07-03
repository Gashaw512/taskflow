
// Hot Module Replacement (HMR) Type Declaration:
// Essential for webpack's HMR. Can be moved to a global declaration file (e.g., src/types/global.d.ts)
// for larger projects to keep this file cleaner.
declare const module: {
  hot?: {
    accept: (path: string, callback: () => void) => void;
  };
};

import React from "react";
import { createRoot, type Root } from "react-dom/client"; 
import { BrowserRouter } from "react-router-dom"; 
import { I18nextProvider } from 'react-i18next';

// Application-specific imports
import App from "./App";
import { ToastProvider } from "./components/Shared/ToastContext";
import i18n from './i18n'; 
import './i18n'; 
import './styles/markdown.css'; 

const container = document.getElementById("root");

if (!container) {
  throw new Error('Root element with ID "root" not found in the document. Please ensure your index.html has <div id="root"></div>.');
}

let reactRoot: Root | undefined; 

const renderApp = (AppToRender: React.ComponentType) => {
  if (!reactRoot) {
    reactRoot = createRoot(container);
  }

  reactRoot.render(
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <ToastProvider>
            <AppToRender /> 
          </ToastProvider>
        </BrowserRouter>
      </I18nextProvider>
    </React.StrictMode>
  );
};

renderApp(App);

// Hot Module Replacement (HMR) Setup
if (module.hot) {
  module.hot.accept('./App', async () => {
    const { default: NextApp } = await import('./App');
    renderApp(NextApp);
  });
}
