import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

import { ConvexReactClient } from 'convex/react';
import reportWebVitals from './reportWebVitals.ts';
import './styles.css';

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// convex
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const PUBLISHABLE_KEY = import.meta.env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY


// Render the app
const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
          <RouterProvider router={router} />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
