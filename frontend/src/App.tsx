import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import CourseDetail from "@/pages/CourseDetail";
import Videos from "@/pages/Videos";
import Auth from "@/pages/Auth";
import PublicVideo from "@/pages/PublicVideo";
import NotFound from "@/pages/NotFound";
import ErrorPage from "@/pages/ErrorPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/course/:id"
              element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/videos"
              element={
                <ProtectedRoute>
                  <Videos />
                </ProtectedRoute>
              }
            />
            <Route path="/s/:token" element={<PublicVideo />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
