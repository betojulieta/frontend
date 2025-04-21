"use client";
import React, { useState, useEffect } from "react";
import "@/styles/globals.css";
import "@/styles/Home.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
const Layout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname(); 
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);
  const isActiveSection = (path) => {
    return pathname && (pathname === path || pathname.startsWith(path));
  };
  const handleBuscar = (e) => {
    e.preventDefault();
    router.push(`/buscar?query=${encodeURIComponent(query)}`);
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <>
      <html lang="en">
        <body>
          <header className="header">
            <nav className="nav">
              {/* Logo - siempre visible */}
              <div className="logo-container">
                <Link href="/" className="logo">
                  Logo
                </Link>
              </div>
              {isMobile && (
                <button
                  className="hamburger-button"
                  onClick={toggleMenu}
                  aria-label="Toggle menu"
                >
                  <span
                    className={`hamburger-line ${isMenuOpen ? "open" : ""}`}
                  />
                  <span
                    className={`hamburger-line ${isMenuOpen ? "open" : ""}`}
                  />
                  <span
                    className={`hamburger-line ${isMenuOpen ? "open" : ""}`}
                  />
                </button>
              )}
              {!isMobile && (
                <ul className="nav-list">
                  <li>
                    <Link
                      href="/"
                      className={`nav-link ${
                        isActiveSection("/") &&
                        !isActiveSection("/productos") &&
                        !isActiveSection("/proveedores")
                          ? "active"
                          : ""
                      }`}
                    >
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/productos"
                      className={`nav-link ${
                        isActiveSection("/productos") ? "active" : ""
                      }`}
                    >
                      Productos
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/proveedores"
                      className={`nav-link ${
                        isActiveSection("/proveedores") ? "active" : ""
                      }`}
                    >
                      Proveedores
                    </Link>
                  </li>
                </ul>
              )}
              <form onSubmit={handleBuscar} className="search-form">
                <input
                  type="text"
                  name="query"
                  placeholder="Buscar..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  Buscar
                </button>
              </form>
              {isMobile && (
                <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
                  <ul className="mobile-nav-list">
                    <li>
                      <Link
                        href="/"
                        className={`mobile-nav-link ${
                          isActiveSection("/") &&
                          !isActiveSection("/productos") &&
                          !isActiveSection("/proveedores")
                            ? "active"
                            : ""
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Inicio
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/productos"
                        className={`mobile-nav-link ${
                          isActiveSection("/productos") ? "active" : ""
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Productos
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/proveedores"
                        className={`mobile-nav-link ${
                          isActiveSection("/proveedores") ? "active" : ""
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Proveedores
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </nav>
          </header>
          <main className="main">{children}</main>
          <footer className="footer">
            <p>© 2025 Mi Aplicación. Todos los derechos reservados.</p>
          </footer>
        </body>
      </html>
    </>
  );
};
export default Layout;