import React, { useState, useEffect, useRef } from 'react';
import { Heart, Facebook, Twitter, Instagram, Menu, X } from 'lucide-react';
import { Announcement } from '../types';

interface HeaderProps {
  announcements?: Announcement[];
  onOpenCMS?: () => void;
  onOpenQR?: () => void;
}

const NAV_ITEMS = [
  { id: 'inicio', label: 'INICIO' },
  { id: 'nuestros-centros', label: 'CLINICAS' },
  { id: 'indicadores', label: 'INDICADORES' },
  { id: 'contacto', label: 'CONTACTO' },
];

export const Header: React.FC<HeaderProps> = ({ announcements = [] }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLHeadingElement>(null);

  const activeAnnouncement = announcements.find((a) => a.isActive);

  // Scroll Listener for Compact Header + Active Section Detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);

      // Detect active section on scroll with exact header offset
      const headerHeight = headerRef.current?.offsetHeight || 160;
      const scrollPosition = window.scrollY + headerHeight + 60;

      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const section = document.getElementById(NAV_ITEMS[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Precise Smooth Scroll to Section Title (accounting for Sticky Header Height)
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    setMobileMenuOpen(false);

    const targetElement = document.getElementById(id);
    if (targetElement) {
      const headerHeight = headerRef.current?.offsetHeight || 160;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - (headerHeight + 20);

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header ref={headerRef} className="w-full shadow-xl z-50 sticky top-0 bg-[#0033A0] transition-all duration-300 ease-in-out">
      
      {/* Active Announcement Bar - Continuous Marquee Ticker */}
      <div
        className={`bg-gradient-to-r from-red-900 via-red-800 to-amber-700 text-white py-1.5 px-3 text-xs font-semibold relative z-30 overflow-hidden transition-all duration-300 border-b border-red-900/50 ${
          isScrolled ? 'hidden md:block py-1 text-[11px]' : 'block'
        }`}
      >
        <div className="w-full max-w-[1400px] mx-auto flex items-center gap-3">
          {/* Fixed Badge on Left */}
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full shrink-0 shadow-sm border border-white/25 z-10">
            <Heart className="w-3 h-3 fill-current text-red-200 animate-pulse" />
            <span>COMUNICADO MPPS</span>
          </div>

          {/* Marquee Continuous Ticker Area */}
          <div className="overflow-hidden flex-1 relative flex items-center">
            <div className="animate-ticker space-x-12 whitespace-nowrap text-xs font-medium tracking-wide">
              <span className="inline-flex items-center gap-2">
                <strong className="text-amber-300 font-bold">ESTADO ZULIA:</strong> Desde el Gobierno Bolivariano del Zulia y MPPS ratificamos el apoyo y solidaridad con el pueblo hermano ante contingencias climáticas. El sistema de salud zuliano activo y desplegado 24/7 en los 21 municipios.
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="text-emerald-300 font-bold">🔴 RED POPULAR DE SALUD:</span> Ambulatorios Urbanos I, II y III con servicios de atención gratuita, farmacia, odontología y laboratorios operativos.
              </span>
              <span className="inline-flex items-center gap-2">
                <strong className="text-amber-300 font-bold">ESTADO ZULIA:</strong> Desde el Gobierno Bolivariano del Zulia y MPPS ratificamos el apoyo y solidaridad con el pueblo hermano ante contingencias climáticas. El sistema de salud zuliano activo y desplegado 24/7 en los 21 municipios.
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="text-emerald-300 font-bold">🔴 RED POPULAR DE SALUD:</span> Ambulatorios Urbanos I, II y III con servicios de atención gratuita, farmacia, odontología y laboratorios operativos.
              </span>
            </div>
          </div>

          {/* <span className="shrink-0 text-[10px] font-mono opacity-90 hidden sm:block bg-black/20 px-2 py-0.5 rounded text-amber-200 border border-white/10 z-10">
            MPPS ZULIA
          </span> */}
        </div>
      </div>

      {/* Main Graphic Banner Header Container */}
      <div
        className={`relative w-full bg-[#0033A0] overflow-hidden transition-all duration-500 ease-in-out ${
          isScrolled
            ? 'h-[65px] sm:h-[80px] md:h-[95px] lg:h-[110px]'
            : 'h-[95px] sm:h-[130px] md:h-[165px] lg:h-[190px]'
        }`}
      >
        {/* Layer 1: Base Blue Background SVG */}
        <svg
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          <rect width="100" height="100" fill="#0033A0" />
        </svg>

        {/* Layer 2: Sun Element */}
        <div className="absolute left-1/2 bottom-[17.5%] -translate-x-1/2 z-5 pointer-events-none flex items-end justify-center h-[90%] sm:h-[105%] md:h-[120%] lg:h-[130%] w-auto transition-all duration-300">
          <img
            src="/sol-header.png"
            alt="Sol Header"
            className="h-full w-auto object-contain object-bottom translate-y-1 sm:translate-y-2 md:translate-y-3 drop-shadow-lg"
            onError={(e) => {
              e.currentTarget.src = '/sol-header.svg';
            }}
          />
        </div>

        {/* Layer 3: Red Wave SVG */}
        <svg
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0,100 L 0,80 C 300,74 520,78 750,42 C 880,22 950,8 1000,0 L 1000,100 Z"
            fill="#C62828"
          />
          <rect x="0" y="82.5" width="1000" height="17.5" fill="#8A0000" />
        </svg>

        {/* Layer 4: Content Layer - Logo on Left (Clickable to Home #inicio) */}
        <div className="relative z-20 w-full h-[82.5%] max-w-[1400px] mx-auto px-3 sm:px-8 md:px-12 flex items-center justify-between">
          <a
            href="#inicio"
            onClick={(e) => handleNavClick(e, 'inicio')}
            className="flex items-center h-full py-1 group cursor-pointer focus:outline-none"
            title="Ir al Inicio"
          >
            <img
              src="/logo.png"
              alt="Estado Zulia Gobierno Bolivariano"
              className={`w-auto object-contain drop-shadow-lg transition-all duration-300 group-hover:scale-105 ${
                isScrolled
                  ? 'h-[75%] max-h-[55px] sm:max-h-[85px] md:max-h-[110px]'
                  : 'h-[78%] sm:h-[88%] max-h-[75px] sm:max-h-[140px] md:max-h-[175px]'
              }`}
            />
          </a>
        </div>

        {/* Layer 5: Text & Social Icons inside Dark Red Sub-Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[17.5%] bg-[#8A0000] text-white px-3 sm:px-8 md:px-12 flex items-center justify-between z-30 shadow-inner">
          <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between">
            <span className="font-extrabold uppercase tracking-wider text-[8.5px] sm:text-xs text-white drop-shadow truncate">
              MINISTERIO DEL PODER POPULAR PARA LA SALUD - MPPS
            </span>

            <div className="flex items-center gap-3 sm:gap-5 text-white shrink-0">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-amber-300 hover:scale-115 transition-all" title="Facebook">
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5 fill-current drop-shadow-xs" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-amber-300 hover:scale-115 transition-all" title="Twitter">
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5 fill-current drop-shadow-xs" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-amber-300 hover:scale-115 transition-all" title="Instagram">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-xs" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* MPPS Navigation Bar */}
      <div className="w-full bg-white border-b border-slate-200 shadow-md relative z-30 py-2 md:py-2.5 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          
          {/* Left Brand: MPPS Logo */}
          <div className="flex items-center">
            <a
              href="#inicio"
              onClick={(e) => handleNavClick(e, 'inicio')}
              className="flex items-center gap-2 hover:opacity-95 transition-opacity"
              title="Volver al Inicio"
            >
              <img
                src="/mpps-logo-header.png"
                alt="Logo MPPS Salud Zulia"
                className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-sm"
              />
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-sm font-extrabold uppercase tracking-wider">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`transition-all duration-300 relative py-1 whitespace-nowrap ${
                    isActive
                      ? 'text-[#C62828] font-black'
                      : 'text-slate-700 hover:text-[#C62828]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C62828] rounded-full animate-in fade-in zoom-in duration-300" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors border border-slate-300 shadow-xs"
            aria-label="Abrir Menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#C62828]" /> : <Menu className="w-5 h-5 text-slate-800" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-200 flex flex-col gap-2 px-1 pb-1 text-xs font-extrabold uppercase tracking-wider text-slate-800 animate-in fade-in slide-in-from-top-2 duration-300">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`px-3.5 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-red-50 text-[#C62828] font-black border-l-4 border-[#C62828]'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
