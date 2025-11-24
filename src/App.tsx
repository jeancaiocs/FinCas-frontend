import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Index } from "./pages/Index";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Rota protegida */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />

        {/* Redirecionar qualquer outra rota para login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      
      <Toaster />
    </BrowserRouter>
  );
}

export default App;