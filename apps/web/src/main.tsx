import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "react-query";
import App from "./App.tsx";
import "./styles/globals.css";
import { ThemeProvider, PRSProvider } from "@/components/";
import { Toaster } from "@/components/ui";
import { qc } from "@/lib/api";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <PRSProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <App />
          <Toaster />
        </ThemeProvider>
      </PRSProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
