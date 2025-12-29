// import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";

// Placeholder for the Landing Page (simulated)
function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="text-4xl font-bold">LexDraft Landing Page</h1>
      <p>This is the public Next.js site (simulated).</p>
      <div className="flex gap-4">
         <a href="/app/login" className="text-primary hover:underline">Go to Login</a>
         <a href="/app/register" className="text-primary hover:underline">Go to Register</a>
      </div>
    </div>
  );
}

// Placeholder for the App Workspace
function Workspace() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Workspace</h1>
      <p>This is the protected app area.</p>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="lexdraft-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app/login" element={<LoginPage />} />
          <Route path="/app/register" element={<RegisterPage />} />
          <Route path="/app" element={<Workspace />} />
          {/* Redirect any unknown routes to login */}
          <Route path="*" element={<Navigate to="/app/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
