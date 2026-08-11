import React, { useState, useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Building2, ShieldCheck, Clock } from 'lucide-react';

const SLIDES = [
  {
    url: '/mpps-fachada-corito1.jpg',
    title: 'Infraestructura de Salud Pública al Servicio del Estado Zulia',
    subtitle: 'Ambulatorio Urbano I Corito 1 • Red Regional de Atención Médica Primaria MPPS Zulia',
    tag: 'Red Regional de Salud Zulia',
  },
  {
    url: '/mpps-operativo-salud-zulia.jpg',
    title: 'Monitoreo Operativo y Atención Ciudadana en Tiempo Real',
    subtitle: 'Disponibilidad de médicos, enfermeras, laboratorios e insumos operativos en planta',
    tag: 'Tesis de Maestría en Salud Pública',
  },
  {
    url: '/mpps-atencion-comunitaria.jpg',
    title: 'Gestión Transparente y Centrada en la Comunidad',
    subtitle: 'Geolocalización exacta de ambulatorios, semáforo de servicios y rutas a Google Maps',
    tag: 'Plataforma Digital MPPS Zulia',
  },
  {
    url: '/mpps-consultorio-medico.jpg',
    title: 'Consultorios Médicos Equipados e Insumos Garantizados',
    subtitle: 'Atención médica primaria gratuita con inventario de farmacia y exámenes clínicos',
    tag: 'Atención Médica Integral',
  },
  {
    url: '/mpps-ambulatorio-gomez-padron.jpg',
    title: 'Red de Ambulatorios Urbanos I, II y III Interconectados',
    subtitle: 'Supervisión y control de asistencia médica activa en los 21 municipios del Estado Zulia',
    tag: 'Cobertura Regional 100%',
  },
];

export const HeroSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Automatic transition every 60 seconds (60,000ms) for defense screen display
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 60000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <div className="relative w-full h-[360px] md:h-[440px] overflow-hidden bg-slate-950 text-white">
      {/* Slides */}
      {SLIDES.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={slide.url}
            alt={slide.title}
            className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-10000"
          />
          <div className="hero-overlay absolute inset-0 flex flex-col justify-end p-6 md:p-12">
            <div className="max-w-4xl mx-auto w-full space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                {slide.tag}
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white font-sans leading-tight">
                {slide.title}
              </h2>
              <p className="text-sm md:text-lg text-slate-200 font-medium max-w-2xl">
                {slide.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Slider Controls */}
      <div className="absolute bottom-4 right-4 md:right-12 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1 hover:text-amber-400 transition-colors"
          title={isPlaying ? 'Pausar rotación automática' : 'Reanudar rotación (60s)'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <div className="h-3 w-[1px] bg-white/20" />
        <span className="text-[11px] text-slate-300 font-mono flex items-center gap-1">
          <Clock className="w-3 h-3 text-amber-400" />
          {currentIndex + 1} / {SLIDES.length}
        </span>
        <div className="h-3 w-[1px] bg-white/20" />
        <button onClick={prevSlide} className="p-1 hover:text-blue-300">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={nextSlide} className="p-1 hover:text-blue-300">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-6 md:left-12 z-20 flex gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-8 bg-amber-400' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
