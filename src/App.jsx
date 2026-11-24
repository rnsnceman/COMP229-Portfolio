import { lazy, Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
const Auth = lazy(() => import("./pages/Auth"));
const Manage = lazy(() => import("./pages/Manage"));
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Education = lazy(() => import("./pages/Education"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));

export default function App() {
  return (
    <AuthProvider>
      <Header />
      <Suspense fallback={<main className="page-shell page-content" role="status">Loading page…</main>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/education" element={<Education />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signin" element={<Auth key="signin" />} />
        <Route path="/signup" element={<Auth key="signup" signup />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="*" element={<main className="page-shell page-content"><h1>Page not found</h1><a href="/">Return home</a></main>} />
      </Routes>
      </Suspense>
      <Footer />
    </AuthProvider>
  );
}
