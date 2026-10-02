/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Youtube,
  Facebook,
  MessageCircle,
  UserPlus,
  MapPin,
  Clock,
  PhoneCall,
  Menu,
  X,
  CheckCircle2,
  Sun,
  Moon,
  BookOpen,
  Users,
  Play,
  ChevronDown,
  Music,
} from 'lucide-react';
import { CHURCH_INFO, buildWhatsAppUrl } from './data/churchData';
import { CHANNEL_VIDEOS_CATALOG } from './data/youtubeVideosData';
import { ChurchLogo } from './components/ChurchLogo';
import { ScheduleSection } from './components/ScheduleSection';
import { BibleReaderSection } from './components/BibleReaderSection';
import { HymnalSection } from './components/HymnalSection';
import { StudyGroupsSection } from './components/StudyGroupsSection';
import { MinistriesSection } from './components/MinistriesSection';
import { LiveStreamSection } from './components/LiveStreamSection';
import { CoalicionAndSocialSection } from './components/CoalicionAndSocialSection';
import { LocationAndContactSection } from './components/LocationAndContactSection';
import {
  JoinCommunityModal,
  MemberProfile,
} from './components/JoinCommunityModal';
import { AmbientMusicPlayer } from './components/AmbientMusicPlayer';

const STORAGE_MEMBER_KEY = 'iedcc_sangil_member_profile';
const STORAGE_THEME_KEY = 'iedcc_sangil_theme';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_THEME_KEY) === 'dark';
    } catch {
      return false;
    }
  });
  const [selectedPhone, setSelectedPhone] = useState<string>(
    CHURCH_INFO.phones[0].raw
  );
  const [preselectedTopic, setPreselectedTopic] = useState<string>(
    'Discipulado Personalizado'
  );
  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);
  const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(
    null
  );
  const [totalRegisteredMembers, setTotalRegisteredMembers] =
    useState<number>(0);
  const [registeredMembersList, setRegisteredMembersList] = useState<
    MemberProfile[]
  >([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isVideosMenuOpen, setIsVideosMenuOpen] = useState<boolean>(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string>(
    CHANNEL_VIDEOS_CATALOG[0].videoId
  );
  const [isWhatsappQuickOpen, setIsWhatsappQuickOpen] =
    useState<boolean>(false);
  const [pendingSharedVerse, setPendingSharedVerse] = useState<{
    reference: string;
    text: string;
  } | null>(null);
  const [activeHymnNumber, setActiveHymnNumber] = useState<number>(1);
  const [isPlayingHymn, setIsPlayingHymn] = useState<boolean>(false);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(true); // Voice active on every song
  const [currentVoicedSection, setCurrentVoicedSection] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_THEME_KEY, isDarkMode ? 'dark' : 'light');
    } catch {
      // Ignore storage errors
    }
  }, [isDarkMode]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MEMBER_KEY);
      if (saved) {
        setMemberProfile(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }

    async function loadRealRegisteredCount() {
      try {
        const res = await fetch('/api/members');
        if (res.ok) {
          const data = await res.json();
          if (typeof data.totalRegisteredMembers === 'number') {
            setTotalRegisteredMembers(data.totalRegisteredMembers);
          }
          if (Array.isArray(data.registeredMembers)) {
            setRegisteredMembersList(data.registeredMembers);
          }
        }
      } catch {
        // Ignore
      }
    }
    loadRealRegisteredCount();
  }, []);

  const handleSaveMember = (
    profile: MemberProfile,
    newTotal?: number,
    updatedList?: MemberProfile[]
  ) => {
    setMemberProfile(profile);
    if (typeof newTotal === 'number') {
      setTotalRegisteredMembers(newTotal);
    }
    if (Array.isArray(updatedList)) {
      setRegisteredMembersList(updatedList);
    }
    try {
      localStorage.setItem(STORAGE_MEMBER_KEY, JSON.stringify(profile));
    } catch {
      // Ignore storage errors
    }
  };

  const handleClearMember = () => {
    setMemberProfile(null);
    try {
      localStorage.removeItem(STORAGE_MEMBER_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  const handleSendVerseToStudyGroup = (reference: string, text: string) => {
    setPendingSharedVerse({ reference, text });
    const el = document.getElementById('grupos-estudio');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWatchVideoInPage = (videoId: string) => {
    setSelectedVideoId(videoId);
    setIsVideosMenuOpen(false);
    setIsMobileMenuOpen(false);
    const el = document.getElementById('videos-canal');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-100 transition-colors">
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 h-16 bg-slate-950/95 backdrop-blur-md border-b border-blue-950 text-white px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Logo (logo.png) + Wordmark */}
        <a
          href="#inicio"
          className="inline-flex items-center gap-3 shrink-0"
        >
          <img
            src="logo.png"
            alt="Logo Iglesia Discípulos de Cristo de San Gil"
            className="w-full max-w-[150px] h-10 sm:h-11 object-contain shrink-0"
          />
          <span className="hidden lg:inline font-serif text-lg font-semibold tracking-tight text-white whitespace-nowrap">
            Iglesia Discípulos de Cristo
          </span>
        </a>

        {/* Zone 2: Clean navigation links */}
        <nav
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
          aria-label="Navegación principal"
        >
          <a
            href="#horarios"
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Horarios
          </a>

          <button
            type="button"
            onClick={() => setIsVideosMenuOpen((prev) => !prev)}
            className="inline-flex items-center gap-1 hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap text-blue-400 font-semibold"
            aria-expanded={isVideosMenuOpen}
          >
            <span>Videos del Canal ({CHANNEL_VIDEOS_CATALOG.length})</span>
            <ChevronDown className="w-3.5 h-3.5 shrink-0" />
          </button>

          <a
            href="#biblia"
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Santa Biblia
          </a>
          <a
            href="#himnario"
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap text-blue-300 font-semibold"
          >
            Himnos (224.344.224)
          </a>
          <a
            href="#grupos-estudio"
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Grupos y Chat
          </a>
          <a
            href="#canales-iedcc"
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap text-blue-300 font-semibold"
          >
            San Gil y Central
          </a>
          <a
            href="#contacto"
            className="hidden xl:inline hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Contacto
          </a>
        </nav>

        {/* Zone 3: Primary actions (Day/Night Toggle + Join Web) */}
        <div className="flex items-center gap-2.5">
          {/* Función Día y Noche */}
          <button
            type="button"
            onClick={() => setIsDarkMode((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            aria-label={
              isDarkMode ? 'Cambiar a Modo Día' : 'Cambiar a Modo Noche'
            }
            title={isDarkMode ? 'Cambiar a Modo Día' : 'Cambiar a Modo Noche'}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Modo Día</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="hidden sm:inline">Modo Noche</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsJoinModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            {memberProfile ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Miembro ({totalRegisteredMembers} reg.)</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5 shrink-0" />
                <span>Unirse ({totalRegisteredMembers} reg.)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg"
            aria-label="Abrir menú de navegación"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* DESKTOP MAIN MENU MEGA-DRAWER OF ALL 32 CHANNEL VIDEOS */}
      {isVideosMenuOpen && (
        <div className="sticky top-16 z-30 bg-slate-950 text-white border-b border-blue-900 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div>
                <p className="text-xs text-blue-400 font-semibold">
                  Menú Principal de Videos · Canal @IEDCCSanGil ({CHANNEL_VIDEOS_CATALOG.length} videos)
                </p>
                <h3 className="font-serif text-xl font-semibold text-white mt-0.5">
                  Selecciona cualquier video para verlo aquí mismo sin salir a YouTube
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVideosMenuOpen(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
              >
                <X className="w-4 h-4" />
                <span>Cerrar menú de videos</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-1">
              {CHANNEL_VIDEOS_CATALOG.map((vid, idx) => {
                const isSelected = vid.videoId === selectedVideoId;
                return (
                  <button
                    key={vid.videoId}
                    type="button"
                    onClick={() => handleWatchVideoInPage(vid.videoId)}
                    className={`text-left p-3 rounded-lg border transition-colors flex items-start gap-3 ${
                      isSelected
                        ? 'bg-blue-950/80 border-blue-500 text-white'
                        : 'bg-slate-900/80 border-slate-800 hover:border-blue-600 text-slate-200'
                    }`}
                  >
                    <div className="relative w-20 aspect-video rounded overflow-hidden bg-black shrink-0 border border-slate-800">
                      <img
                        src={`https://i.ytimg.com/vi/${vid.videoId}/mqdefault.jpg`}
                        alt={vid.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 text-white fill-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block font-mono text-[10px] text-blue-400">
                        #{String(idx + 1).padStart(2, '0')} · {vid.category}
                      </span>
                      <p className="text-xs font-semibold text-white line-clamp-2 leading-snug mt-0.5">
                        {vid.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950 text-white border-b border-blue-950 px-6 py-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col space-y-3 text-sm font-medium text-slate-200">
            <a
              href="#horarios"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-blue-400 transition-colors"
            >
              Horario de Cultos (Dom 8am · Mié 7pm · Jue 4pm)
            </a>
            <a
              href="#videos-canal"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 text-blue-400 font-semibold transition-colors"
            >
              Videos del Canal ({CHANNEL_VIDEOS_CATALOG.length} videos en la página)
            </a>
            <a
              href="#biblia"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-blue-400 transition-colors"
            >
              Leer la Santa Biblia en Línea
            </a>
            <a
              href="#himnario"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 text-blue-400 font-semibold transition-colors"
            >
              Gran Himnario Cristiano (224.344.224 Himnos Cantados)
            </a>
            <a
              href="#grupos-estudio"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-blue-400 transition-colors"
            >
              Grupos de Estudio y Chat en Vivo
            </a>
            <a
              href="#canales-iedcc"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 text-blue-400 font-semibold transition-colors"
            >
              Canales Oficiales: IEDCC San Gil e IEDCC Central
            </a>
            <a
              href="#ministerios"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-blue-400 transition-colors"
            >
              Discipulados Personalizados y Consejería
            </a>
            <a
              href="#ubicacion"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-blue-400 transition-colors"
            >
              Mapa y Dirección (Cra 20 # 13A - 23 Villa Olímpica)
            </a>
            <a
              href="#contacto"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-blue-400 transition-colors"
            >
              Formulario de Contacto y WhatsApp
            </a>
          </div>

          <div className="pt-3 border-t border-slate-800 grid grid-cols-1 gap-2">
            <a
              href={CHURCH_INFO.facebookPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg"
            >
              <Facebook className="w-4 h-4" />
              <span>Suscribirse en Facebook (@IEDCCSanGil)</span>
            </a>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <p className="text-xs font-semibold text-blue-400">
              Ver Videos del Canal aquí en la Web ({CHANNEL_VIDEOS_CATALOG.length}):
            </p>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {CHANNEL_VIDEOS_CATALOG.map((vid, idx) => (
                <button
                  key={vid.videoId}
                  type="button"
                  onClick={() => handleWatchVideoInPage(vid.videoId)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-slate-900 hover:bg-blue-950 border border-slate-800 text-xs flex items-center justify-between gap-2"
                >
                  <span className="truncate text-slate-200">
                    <strong className="font-mono text-blue-400 mr-1.5">
                      #{String(idx + 1).padStart(2, '0')}
                    </strong>
                    {vid.title}
                  </span>
                  <Play className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* HERO SECTION */}
        <section
          id="inicio"
          className="relative bg-slate-950 text-white overflow-hidden border-b border-blue-950"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,78,216,0.28),transparent_60%)]"
            aria-hidden="true"
          />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-22">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <ChurchLogo variant="card" size="md" />
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-blue-400 font-medium tracking-wide">
                      <span>Iglesia Evangélica Discípulos de Cristo</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">@IEDCCSanGil</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-white">
                        {totalRegisteredMembers}{' '}
                        {totalRegisteredMembers === 1
                          ? 'registrado real'
                          : 'registrados reales'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Sede Oficial: Cra 20 # 13A - 23, Barrio Villa Olímpica · San Gil, Santander
                    </p>
                  </div>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.08]">
                  IGLESIA DISCÍPULOS DE CRISTO DE SAN GIL
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  Una familia en la fe edificada sobre la Palabra de Dios. Acompáñanos en nuestros{' '}
                  <strong className="text-white font-semibold">
                    cultos dominicales a las 8:00 AM
                  </strong>
                  ,{' '}
                  <strong className="text-white font-semibold">
                    reunión de varones los miércoles a las 7:00 PM
                  </strong>
                  ,{' '}
                  <strong className="text-white font-semibold">
                    reunión de damas los jueves a las 4:00 PM
                  </strong>
                  , lectura de la Santa Biblia, grupos de estudio con chat en vivo, discipulados personalizados y consejería.
                </p>

                {/* Primary & Secondary Action Suite */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {/* Action 1: Unirse a la Página Web */}
                  <button
                    type="button"
                    onClick={() => setIsJoinModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    <UserPlus className="w-4 h-4 shrink-0" />
                    <span>
                      {memberProfile
                        ? `Miembro #${memberProfile.registrationNumber || 1} (${totalRegisteredMembers} registrados)`
                        : `Unirse a la Página Web (${totalRegisteredMembers} registrados)`}
                    </span>
                  </button>

                  {/* Action 2: Ver Todos los Videos aquí en la Web */}
                  <a
                    href="#videos-canal"
                    className="flex items-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-100 text-slate-950 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Play className="w-4 h-4 text-blue-700 fill-blue-700 shrink-0" />
                    <span>
                      Ver Videos del Canal ({CHANNEL_VIDEOS_CATALOG.length})
                    </span>
                  </a>

                  {/* Action 3: Suscribirse en Facebook (@IEDCCSanGil) */}
                  <a
                    href={CHURCH_INFO.facebookPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3.5 bg-slate-900 hover:bg-blue-950 text-white border border-blue-700/70 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Facebook className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Suscribirse en Facebook</span>
                  </a>

                  {/* Action 4: Suscribirse al Canal de YouTube */}
                  <a
                    href={CHURCH_INFO.youtubeSubscribeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Youtube className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Suscribirse en YouTube</span>
                  </a>

                  {/* Action 5: Ver Canales San Gil y Central */}
                  <a
                    href="#canales-iedcc"
                    className="flex items-center gap-2 px-4 py-3.5 bg-slate-900 hover:bg-blue-950 text-white border border-blue-700/70 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Youtube className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Canales: San Gil y Central</span>
                  </a>

                  {/* Action 6: Leer la Biblia, 224.344.224 Himnos & Grupos de Estudio */}
                  <a
                    href="#himnario"
                    className="flex items-center gap-2 px-4 py-3.5 bg-slate-900 hover:bg-blue-950 text-white border border-blue-700/70 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Music className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>224.344.224 Himnos</span>
                  </a>

                  <a
                    href="#biblia"
                    className="flex items-center gap-2 px-4 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Leer la Biblia</span>
                  </a>

                  <a
                    href="#grupos-estudio"
                    className="flex items-center gap-2 px-4 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Users className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Chat y Grupos de Estudio</span>
                  </a>
                </div>

                {/* Immediate WhatsApp Attention Strip */}
                <div className="pt-6 border-t border-slate-800/90">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <p className="text-xs text-slate-400">
                      Atención Inmediata por WhatsApp (Consejería, Oración y Discipulados):
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={buildWhatsAppUrl(
                        '3123480660',
                        'Hola, paz de Cristo. Me comunico desde la página web de la Iglesia Discípulos de Cristo de San Gil para solicitar atención inmediata.'
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-blue-950 border border-blue-800/60 rounded-lg text-xs font-semibold text-white transition-colors whitespace-nowrap"
                    >
                      <MessageCircle className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>WhatsApp:</span>
                      <span className="font-mono tabular-nums text-blue-300">
                        312 348 0660
                      </span>
                    </a>

                    <a
                      href={buildWhatsAppUrl(
                        '3125576600',
                        'Hola, paz de Cristo. Me comunico desde la página web de la Iglesia Discípulos de Cristo de San Gil para solicitar atención inmediata.'
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-blue-950 border border-blue-800/60 rounded-lg text-xs font-semibold text-white transition-colors whitespace-nowrap"
                    >
                      <MessageCircle className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>WhatsApp:</span>
                      <span className="font-mono tabular-nums text-blue-300">
                        312 557 6600
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Official IEDCC San Gil Logo Anchor */}
              <div className="lg:col-span-5">
                <div className="relative rounded-xl overflow-hidden border border-blue-900/50 bg-slate-900 shadow-2xl">
                  <div className="aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full">
                    <ChurchLogo
                      variant="banner"
                      subtitle="Iglesia Discípulos de Cristo de San Gil · Cra 20 # 13A - 23 Villa Olímpica"
                    />
                  </div>

                  <div className="p-5 bg-slate-950 border-t border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-400 font-medium">
                        Horarios Semanales Fijos
                      </span>
                      <a
                        href="#horarios"
                        className="text-slate-300 hover:text-white underline"
                      >
                        Ver detalle completo
                      </a>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 text-left">
                      <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                        <span className="block text-[11px] text-slate-400">
                          Domingos
                        </span>
                        <span className="font-mono text-xs sm:text-sm font-semibold text-white tabular-nums">
                          08:00 AM
                        </span>
                        <span className="block text-[11px] text-blue-300 truncate">
                          Culto General
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                        <span className="block text-[11px] text-slate-400">
                          Miércoles
                        </span>
                        <span className="font-mono text-xs sm:text-sm font-semibold text-white tabular-nums">
                          07:00 PM
                        </span>
                        <span className="block text-[11px] text-blue-300 truncate">
                          Varones
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                        <span className="block text-[11px] text-slate-400">
                          Jueves
                        </span>
                        <span className="font-mono text-xs sm:text-sm font-semibold text-white tabular-nums">
                          04:00 PM
                        </span>
                        <span className="block text-[11px] text-blue-300 truncate">
                          Damas
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Utility Ribbon */}
          <div className="bg-blue-700 text-white border-t border-blue-600">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-medium">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Cultos: Domingos 8:00 AM</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>Miércoles 7:00 PM (Reunión de Varones)</span>
                <span aria-hidden="true">·</span>
                <span>Jueves 4:00 PM (Reunión de Damas)</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>Cra 20 # 13A - 23, Villa Olímpica (San Gil)</span>
                </span>
                <span aria-hidden="true">·</span>
                <a
                  href={CHURCH_INFO.facebookPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-100 font-semibold"
                >
                  Facebook: @IEDCCSanGil
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: HORARIO DE CULTOS */}
        <ScheduleSection
          selectedPhone={selectedPhone}
          onSelectTopicForContact={(topic) => setPreselectedTopic(topic)}
        />

        {/* SECTION 2: VIDEOTECA COMPLETA Y REPRODUCTOR INTEGRADO DEL CANAL @IEDCCSanGil */}
        <LiveStreamSection
          onOpenJoinModal={() => setIsJoinModalOpen(true)}
          isMemberJoined={Boolean(memberProfile)}
          selectedVideoId={selectedVideoId}
          onSelectVideoId={setSelectedVideoId}
        />

        {/* SECTION 3: LECTOR DE LA SANTA BIBLIA EN LÍNEA */}
        <BibleReaderSection
          selectedPhone={selectedPhone}
          onSendVerseToStudyGroup={handleSendVerseToStudyGroup}
        />

        {/* SECTION 3B: GRAN HIMNARIO CRISTIANO DE 224.344.224 HIMNOS CANTADOS CON VOZ */}
        <HymnalSection
          activeHymnNumber={activeHymnNumber}
          isPlayingHymn={isPlayingHymn}
          onPlayHymn={(num) => {
            setActiveHymnNumber(num);
            setIsPlayingHymn(true);
            setIsVoiceActive(true);
          }}
          onTogglePlayPause={() => setIsPlayingHymn((prev) => !prev)}
          onShareHymnToChat={handleSendVerseToStudyGroup}
          isVoiceActive={isVoiceActive}
          onToggleVoiceActive={() => setIsVoiceActive((prev) => !prev)}
          currentVoicedSection={currentVoicedSection}
        />

        {/* SECTION 4: GRUPOS REALES DE ESTUDIO BÍBLICO Y CHAT EN VIVO */}
        <StudyGroupsSection
          defaultUserName={memberProfile?.fullName || ''}
          pendingSharedVerse={pendingSharedVerse}
          onClearSharedVerse={() => setPendingSharedVerse(null)}
          totalRegisteredMembers={totalRegisteredMembers}
          onUpdateRegisteredMembers={(total, list) => {
            setTotalRegisteredMembers(total);
            if (Array.isArray(list)) {
              setRegisteredMembersList(list);
            }
          }}
          onOpenJoinModal={() => setIsJoinModalOpen(true)}
        />

        {/* SECTION 5: DISCIPULADOS PERSONALIZADOS, CONSEJERÍA Y MINISTERIOS */}
        <MinistriesSection
          selectedPhone={selectedPhone}
          onSelectTopicForContact={(topic) => setPreselectedTopic(topic)}
          onOpenJoinModal={() => setIsJoinModalOpen(true)}
        />

        {/* SECTION 6: SUSCRIBIRSE EN FACEBOOK Y DONAR A COALICIÓN POR EL EVANGELIO */}
        <CoalicionAndSocialSection />

        {/* SECTION 7: MAPA DE UBICACIÓN Y FORMULARIO DE CONTACTO + WHATSAPP */}
        <LocationAndContactSection
          preselectedTopic={preselectedTopic}
          selectedPhone={selectedPhone}
          onChangeSelectedPhone={setSelectedPhone}
        />
      </main>

      {/* QUIET INSTITUTIONAL FOOTER */}
      <footer className="bg-slate-950 text-white border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-4">
                <ChurchLogo variant="card" size="sm" />
                <p className="font-serif text-xl sm:text-2xl font-semibold text-white">
                  IGLESIA DISCÍPULOS DE CRISTO DE SAN GIL
                </p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Proclamando el Evangelio de Jesucristo, formando discípulos y edificando familias en San Gil, Santander. Lectura de la Santa Biblia, grupos reales de estudio con chat en vivo, discipulados personalizados y consejería pastoral permanente.
              </p>
              <p className="text-xs text-blue-400 font-medium pt-1">
                Dirección: Cra 20 # 13A - 23, Barrio Villa Olímpica · San Gil
              </p>
            </div>

            <div className="md:col-span-4 space-y-2.5 text-xs text-slate-300">
              <p className="font-semibold text-white text-sm mb-2">
                Horarios de Reunión
              </p>
              <p>
                <span className="text-slate-400">Domingos:</span>{' '}
                <span className="font-mono text-white tabular-nums">
                  08:00 AM
                </span>{' '}
                — Culto General
              </p>
              <p>
                <span className="text-slate-400">Miércoles:</span>{' '}
                <span className="font-mono text-white tabular-nums">
                  07:00 PM
                </span>{' '}
                — Reunión de Varones
              </p>
              <p>
                <span className="text-slate-400">Jueves:</span>{' '}
                <span className="font-mono text-white tabular-nums">
                  04:00 PM
                </span>{' '}
                — Reunión de Damas
              </p>
              <p>
                <span className="text-slate-400">Lunes a Sábado:</span>{' '}
                Discipulados Personalizados y Consejería
              </p>
            </div>

            <div className="md:col-span-3 space-y-3 text-xs">
              <p className="font-semibold text-white text-sm mb-2">
                Redes Sociales y Apoyo
              </p>
              <div className="space-y-2">
                <a
                  href={CHURCH_INFO.facebookPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-white font-semibold transition-colors"
                >
                  Facebook: facebook.com/IEDCCSanGil
                </a>
                <a
                  href={CHURCH_INFO.youtubeSubscribeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-slate-300 hover:text-blue-400 transition-colors"
                >
                  YouTube: @IEDCCSanGil
                </a>
                <a
                  href={buildWhatsAppUrl(
                    '3123480660',
                    'Hola, paz de Cristo. Me comunico con la Iglesia Discípulos de Cristo de San Gil.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-slate-300 hover:text-blue-400 font-mono tabular-nums transition-colors"
                >
                  WhatsApp 1: 312 348 0660
                </a>
                <a
                  href={buildWhatsAppUrl(
                    '3125576600',
                    'Hola, paz de Cristo. Me comunico con la Iglesia Discípulos de Cristo de San Gil.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-slate-300 hover:text-blue-400 font-mono tabular-nums transition-colors"
                >
                  WhatsApp 2: 312 557 6600
                </a>
              </div>
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(true)}
                  className="px-3.5 py-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  Unirse a la Web ({totalRegisteredMembers} registrados)
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} Iglesia Discípulos de Cristo de San Gil (IEDCC San Gil). Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={CHURCH_INFO.facebookPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Facebook Oficial
              </a>
              <span aria-hidden="true">·</span>
              <a
                href={CHURCH_INFO.youtubeSubscribeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Suscribirse en YouTube
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* COMPACT FLOATING WHATSAPP IMMEDIATE ATTENTION WIDGET */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
        {isWhatsappQuickOpen && (
          <div className="mb-3 w-72 bg-slate-950 text-white border border-blue-800 rounded-xl shadow-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <p className="text-xs font-semibold text-white">
                  Atención Inmediata WhatsApp
                </p>
                <p className="text-[11px] text-blue-400">
                  Iglesia Discípulos de Cristo · San Gil
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsWhatsappQuickOpen(false)}
                className="text-slate-400 hover:text-white p-1"
                aria-label="Cerrar selector de WhatsApp"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Selecciona cualquiera de nuestras dos líneas para atención pastoral, consejería o información:
            </p>

            <div className="space-y-2">
              <a
                href={buildWhatsAppUrl(
                  '3123480660',
                  'Hola, paz de Cristo. Deseo atención inmediata de la Iglesia Discípulos de Cristo de San Gil.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3.5 py-2.5 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <span>Línea 1: 312 348 0660</span>
                <MessageCircle className="w-4 h-4 shrink-0" />
              </a>

              <a
                href={buildWhatsAppUrl(
                  '3125576600',
                  'Hola, paz de Cristo. Deseo atención inmediata de la Iglesia Discípulos de Cristo de San Gil.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <span>Línea 2: 312 557 6600</span>
                <PhoneCall className="w-4 h-4 text-blue-400 shrink-0" />
              </a>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsWhatsappQuickOpen((prev) => !prev)}
          className="flex items-center gap-2.5 px-4 py-3 bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold rounded-full shadow-lg border border-blue-500 transition-transform duration-150 hover:scale-105 whitespace-nowrap"
          aria-expanded={isWhatsappQuickOpen}
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>WhatsApp Inmediato</span>
        </button>
      </div>

      {/* RELAXING CHRISTIAN AMBIENT MUSIC PLAYER (224,344,224 SUNG MP3 HYMNS) */}
      <AmbientMusicPlayer
        currentHymnNumber={activeHymnNumber}
        isPlaying={isPlayingHymn}
        onHymnNumberChange={setActiveHymnNumber}
        onPlayingChange={setIsPlayingHymn}
        isVoiceActive={isVoiceActive}
        onVoiceActiveChange={setIsVoiceActive}
        currentVoicedSection={currentVoicedSection}
        onVoicedSectionChange={setCurrentVoicedSection}
      />

      {/* JOIN WEBSITE MODAL */}
      <JoinCommunityModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        existingMember={memberProfile}
        totalRegisteredMembers={totalRegisteredMembers}
        registeredMembersList={registeredMembersList}
        onSaveMember={handleSaveMember}
        onClearMember={handleClearMember}
      />
    </div>
  );
}
