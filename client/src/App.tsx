import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { SearchAndIndicators } from './components/SearchAndIndicators';
import { ClinicCard } from './components/ClinicCard';
import { ClinicModal } from './components/ClinicModal';
import { AdminCMSModal } from './components/AdminCMSModal';
import { AdminPage } from './components/AdminPage';
import { QRCodeModal } from './components/QRCodeModal';
import { fetchClinics, fetchAnnouncements } from './services/api';
import { Clinic, Announcement } from './types';
import {
  Filter,
  RefreshCw,
  Building2,
  Sparkles,
  Award,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Lock
} from 'lucide-react';

export function App() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Routing State for /admin
  const [route, setRoute] = useState(window.location.pathname);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedService, setSelectedService] = useState('ALL');

  // Modals State
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [showCMSModal, setShowCMSModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchClinics({
        search,
        municipality: selectedMunicipality,
        type: selectedType,
        service: selectedService,
      });
      setClinics(Array.isArray(data) ? data : []);
      const ann = await fetchAnnouncements();
      setAnnouncements(Array.isArray(ann) ? ann : []);
    } catch (err) {
      console.error('Error loading data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, selectedMunicipality, selectedType, selectedService]);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const resetFilters = () => {
    setSearch('');
    setSelectedMunicipality('ALL');
    setSelectedType('ALL');
    setSelectedService('ALL');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactMessage) return;
    setContactSent(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setContactSent(false);
    }, 4000);
  };

  const coritoClinic = clinics.find((c) => c.id === 1);

  // Dedicated Route View for /admin
  if (route === '/admin' || window.location.pathname === '/admin') {
    return (
      <AdminPage
        clinics={clinics}
        onRefreshData={loadData}
        onGoHome={() => {
          window.history.pushState({}, '', '/');
          setRoute('/');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans scroll-smooth">
      {/* Header Sticky con Barra MPPS */}
      <Header
        announcements={announcements}
        onOpenCMS={() => {
          window.history.pushState({}, '', '/admin');
          setRoute('/admin');
        }}
        onOpenQR={() => setShowQRModal(true)}
      />

      {/* 1. SECCIÓN INICIO (#inicio) */}
      <div id="inicio" className="scroll-mt-36 sm:scroll-mt-44 md:scroll-mt-52">
        <HeroSlider />
      </div>

      {/* Main Content Container con Normalización de Secciones */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-16">
        
        {/* 2. SECCIÓN CLÍNICAS Y CENTROS DE SALUD (#nuestros-centros) */}
        <section id="nuestros-centros" className="space-y-8 scroll-mt-36 sm:scroll-mt-44 md:scroll-mt-52">
          
          {/* Buscador de Clínicas + Mapa del Zulia */}
          <SearchAndIndicators
            search={search}
            setSearch={setSearch}
            selectedMunicipality={selectedMunicipality}
            setSelectedMunicipality={setSelectedMunicipality}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            resetFilters={resetFilters}
            totalClinicsCount={84}
          />

          {/* Tarjetas de Clínicas Filtradas */}
          {(() => {
            const activePublicClinics = clinics.filter((c) => c.isActive !== false);
            if (loading) {
              return (
                <div className="text-center py-16 space-y-3 bg-white rounded-3xl p-8 border border-slate-200">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-500">Cargando Red de Ambulatorios...</p>
                </div>
              );
            }
            if (activePublicClinics.length === 0) {
              return (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3 shadow-md">
                  <Filter className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">No se encontraron ambulatorios activos</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Intente cambiar el municipio o el término de búsqueda para ver más resultados.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Restablecer Filtros
                  </button>
                </div>
              );
            }
            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-700" />
                    Centros de Salud Disponibles ({activePublicClinics.length})
                  </h3>
                  {selectedMunicipality !== 'ALL' && (
                    <span className="text-xs bg-blue-100 text-blue-800 font-extrabold px-3 py-1 rounded-full">
                      Municipio: {selectedMunicipality}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activePublicClinics.map((clinic) => (
                    <ClinicCard
                      key={clinic.id}
                      clinic={clinic}
                      onSelectClinic={(c) => setSelectedClinic(c)}
                    />
                  ))}
                </div>
              </div>
            );
          })()}


          {/* Caso de Prueba Corito 1 dentro de la Sección de Clínicas */}
          {coritoClinic && (
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-blue-700/50 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden mt-6">
              <div className="space-y-3 z-10">
                <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                  <Award className="w-4 h-4" /> CASO DE PRUEBA PRINCIPAL TESIS DE MAESTRÍA
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  {coritoClinic.name}
                </h2>
                <p className="text-sm text-blue-100 max-w-2xl font-medium leading-relaxed">
                  Parroquia {coritoClinic.parish}, Municipio {coritoClinic.municipality}. Explore la ficha técnica completa, fotos de infraestructura, conteo de médicos/enfermeras activos y semáforo de disponibilidad en tiempo real.
                </p>
              </div>

              <button
                onClick={() => setSelectedClinic(coritoClinic)}
                className="z-10 shrink-0 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ver Ficha Corito 1</span>
              </button>

              <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
                <Building2 className="w-80 h-80 text-white" />
              </div>
            </div>
          )}
        </section>

        {/* 3. SECCIÓN INDICADORES (#indicadores) */}
        <section id="indicadores" className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden scroll-mt-36 sm:scroll-mt-44 md:scroll-mt-52">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6 z-10 relative">
            <div>
              <span className="text-xs font-black uppercase text-amber-400 tracking-widest block">
                MONITOREO ASISTENCIAL EN TIEMPO REAL
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight font-sans mt-1">
                INDICADORES GENERALES DE LA RED REGIONAL
              </h2>
            </div>
            <span className="text-xs font-mono bg-blue-900/80 text-blue-200 px-3 py-1.5 rounded-xl border border-blue-700">
              ACTUALIZADO HOY
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 z-10 relative">
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-2">
              <span className="text-3xl md:text-4xl font-black text-amber-400">84</span>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Ambulatorios Activos</p>
              <p className="text-[11px] text-slate-400">Distribuidos en la geografía zuliana</p>
            </div>

            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-2">
              <span className="text-3xl md:text-4xl font-black text-blue-400">21</span>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Municipios Cubiertos</p>
              <p className="text-[11px] text-slate-400">100% Cobertura territorial</p>
            </div>

            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-2">
              <span className="text-3xl md:text-4xl font-black text-emerald-400">1,420+</span>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Personal Médico</p>
              <p className="text-[11px] text-slate-400">Médicos y enfermeras activos</p>
            </div>

            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-2">
              <span className="text-3xl md:text-4xl font-black text-red-400">98.4%</span>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Semáforo Operativo</p>
              <p className="text-[11px] text-slate-400">Disponibilidad de insumos básicos</p>
            </div>
          </div>
        </section>

        {/* 4. SECCIÓN CONTACTO (#contacto) */}
        <section id="contacto" className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-200/90 space-y-8 scroll-mt-36 sm:scroll-mt-44 md:scroll-mt-52">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-black uppercase text-red-700 tracking-widest block">
                MINISTERIO DEL PODER POPULAR PARA LA SALUD - ZULIA
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-sans mt-1">
                CONTACTO Y ATENCIÓN CIUDADANA
              </h2>
            </div>
            <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Horario de Atención: Lunes a Viernes 8:00 AM - 4:00 PM</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <MapPin className="w-6 h-6 text-red-700 shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-900">Sede Principal</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Secretaría Regional de Salud, Av. 4 (Bella Vista) con Calle 85 (Falcón), Maracaibo, Estado Zulia.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <Phone className="w-6 h-6 text-blue-700 shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-900">Líneas Asistenciales</h4>
                  <p className="text-xs text-slate-600 mt-0.5 font-mono">
                    +58 (0261) 790-8800 • Central Telefónica Zulia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <Mail className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-900">Correo Electrónico</h4>
                  <p className="text-xs text-slate-600 mt-0.5 font-mono">
                    contacto@saludzulia.gob.ve
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <h4 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                  Enviar Consulta o Solicitud de Información
                </h4>

                {contactSent ? (
                  <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
                    ✓ ¡Mensaje enviado con éxito! Nos comunicaremos a la brevedad.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Ej: Pedro Pérez"
                          className="w-full p-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="ejemplo@correo.com"
                          className="w-full p-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mensaje o Consulta</label>
                      <textarea
                        required
                        rows={3}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Escriba su inquietud o requerimiento para la red de salud..."
                        className="w-full p-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#8B0000] hover:bg-red-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Enviar Mensaje</span>
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </section>

      </main>

      {/* Footer Leyenda Tesis */}
      <footer className="bg-slate-900 text-white py-8 md:py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="text-sm md:text-base font-black text-slate-100 tracking-wide">
              Red Regional de Clínicas Populares • Estado Zulia
            </p>
            <p className="text-xs md:text-sm text-slate-300 font-medium">
              Desarrollado para Tesis de Maestría en TIC — Leandro Mayor & Dr. Omar Zambrano.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/admin');
                setRoute('/admin');
              }}
              className="px-4 py-2.5 bg-blue-700/80 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all border border-blue-500/40 shadow-lg flex items-center gap-2 hover:scale-105"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Panel CMS (/admin)</span>
            </button>

            <span className="text-xs md:text-sm text-slate-400 font-mono font-semibold">
              © 2026 Ministerio del Poder Popular para la Salud (MPPS Zulia)
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedClinic && (
        <ClinicModal
          clinic={selectedClinic}
          onClose={() => setSelectedClinic(null)}
        />
      )}

      {showCMSModal && (
        <AdminPage
          clinics={clinics}
          onRefreshData={loadData}
          onGoHome={() => setShowCMSModal(false)}
        />
      )}

      {showQRModal && (
        <QRCodeModal
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
}

export default App;
