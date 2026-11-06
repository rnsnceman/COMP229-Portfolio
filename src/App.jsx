import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Auth from "./pages/Auth";
import Manage from "./pages/Manage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Education from "./pages/Education";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <AuthProvider>
      <Header />
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
      <Footer />
    </AuthProvider>
  );
}
