/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Music,
  Play,
  Pause,
  Search,
  Shuffle,
  BookOpen,
  SkipBack,
  SkipForward,
  Volume2,
  Share2,
  Hash,
} from 'lucide-react';
import {
  TOTAL_HYMNS_COUNT,
  HymnCategory,
  HymnItem,
  getHymnByNumber,
  formatHymnNumber,
  CORE_10_HYMNS,
  RECORDED_VOCAL_HYMNS,
} from '../data/hymnsCatalogData';

interface HymnalSectionProps {
  activeHymnNumber: number;
  isPlayingHymn: boolean;
  onPlayHymn: (hymnNumber: number) => void;
  onTogglePlayPause: () => void;
  onShareHymnToChat?: (reference: string, text: string) => void;
}

const PAGE_SIZE = 12;
const TOTAL_PAGES = Math.ceil(TOTAL_HYMNS_COUNT / PAGE_SIZE);

export const HymnalSection: React.FC<HymnalSectionProps> = ({
  activeHymnNumber,
  isPlayingHymn,
  onPlayHymn,
  onTogglePlayPause,
  onShareHymnToChat,
}) => {
  const [selectedHymnNumber, setSelectedHymnNumber] =
    useState<number>(activeHymnNumber || 1);
  const [numberInput, setNumberInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<
    'Todos' | HymnCategory
  >('Todos');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const displayedHymn: HymnItem = useMemo(
    () => getHymnByNumber(selectedHymnNumber),
    [selectedHymnNumber]
  );

  const isCurrentDisplayedPlaying =
    isPlayingHymn && activeHymnNumber === displayedHymn.hymnNumber;

  const handleJumpToNumber = (targetNum: number) => {
    const clamped = Math.max(
      1,
      Math.min(TOTAL_HYMNS_COUNT, Math.floor(targetNum || 1))
    );
    setSelectedHymnNumber(clamped);
    setCurrentPage(Math.ceil(clamped / PAGE_SIZE));
    setSearchQuery('');
    setSelectedCategory('Todos');
  };

  const handleNumberFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = numberInput.replace(/[^0-9]/g, '');
    if (!cleaned) return;
    const parsed = Number(cleaned);
    if (Number.isFinite(parsed) && parsed >= 1) {
      handleJumpToNumber(parsed);
    }
  };

  const handleRandomHymn = () => {
    const randomNum = Math.floor(Math.random() * TOTAL_HYMNS_COUNT) + 1;
    handleJumpToNumber(randomNum);
    onPlayHymn(randomNum);
  };

  // Compute current page of hymns from the 224,344,224 catalog
  const currentHymnPageItems: HymnItem[] = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const numericOnly = q.replace(/\./g, '').replace(/,/g, '');
    const isExactNumberQuery =
      /^\d+$/.test(numericOnly) && Number(numericOnly) >= 1;

    // If user typed a number in the search box, show hymns starting at that exact number
    if (isExactNumberQuery) {
      const startNum = Math.min(
        TOTAL_HYMNS_COUNT,
        Math.max(1, Number(numericOnly))
      );
      const results: HymnItem[] = [];
      for (let i = 0; i < PAGE_SIZE; i++) {
        const num = startNum + i;
        if (num <= TOTAL_HYMNS_COUNT) {
          results.push(getHymnByNumber(num));
        }
      }
      return results;
    }

    // If user typed a keyword or filtered by category
    if (q.length > 0 || selectedCategory !== 'Todos') {
      const matches: HymnItem[] = [];
      const maxRecorded = CORE_10_HYMNS.length + RECORDED_VOCAL_HYMNS.length;
      const startOffset = (currentPage - 1) * PAGE_SIZE;
      let matchedCount = 0;

      // Scan recorded vocal hymns first, then deterministic catalog
      for (let n = 1; n <= Math.max(maxRecorded + 2500, startOffset + 1500); n++) {
        if (n > TOTAL_HYMNS_COUNT) break;
        const item = getHymnByNumber(n);
        const categoryOk =
          selectedCategory === 'Todos' || item.category === selectedCategory;
        if (!categoryOk) continue;

        if (q.length > 0) {
          const haystack =
            `${item.title} ${item.subtitle} ${item.scriptureRef} ${item.musicalKey} ${item.chorus}`.toLowerCase();
          if (!haystack.includes(q)) continue;
        }

        if (matchedCount >= startOffset && matches.length < PAGE_SIZE) {
          matches.push(item);
        }
        matchedCount++;
        if (matches.length >= PAGE_SIZE) break;
      }
      return matches;
    }

    // Standard O(1) virtual page slice across all 224,344,224 hymns
    const startNumber = (currentPage - 1) * PAGE_SIZE + 1;
    const list: HymnItem[] = [];
    for (let i = 0; i < PAGE_SIZE; i++) {
      const n = startNumber + i;
      if (n <= TOTAL_HYMNS_COUNT) {
        list.push(getHymnByNumber(n));
      }
    }
    return list;
  }, [searchQuery, selectedCategory, currentPage]);

  return (
    <section
      id="himnario"
      className="py-20 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 scroll-mt-16 font-sans"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="space-y-3 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-400">
              Alabanza Congregacional · Catálogo Universal · #1 al #224.344.224
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 dark:text-white tracking-tight">
              Gran Himnario Cristiano: 224.344.224 Himnos
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Explora, lee la letra completa y escucha cualquiera de los{' '}
              <strong className="font-semibold text-slate-900 dark:text-white font-mono">
                224.344.224
              </strong>{' '}
              himnos cristianos disponibles en nuestro catálogo universal desde
              el Himno <span className="font-mono font-semibold">#01</span>{' '}
              hasta el Himno{' '}
              <span className="font-mono font-semibold">#224.344.224</span>.
            </p>
          </div>

          {/* Direct Jump to Any Hymn Number (1 to 224,344,224) */}
          <form
            onSubmit={handleNumberFormSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0"
          >
            <div className="relative">
              <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                inputMode="numeric"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
                placeholder="Ir al # (1 - 224344224)"
                aria-label="Ir al número de himno entre 1 y 224.344.224"
                className="w-full sm:w-56 pl-9 pr-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              Ir al Himno
            </button>
            <button
              type="button"
              onClick={handleRandomHymn}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              title="Escuchar un himno aleatorio entre los 224.344.224 himnos"
            >
              <Shuffle className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Aleatorio</span>
            </button>
          </form>
        </div>

        {/* Quick Milestone Jump Bar (#1 to #224.344.224) */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2">
              Saltos rápidos en los 224.344.224 himnos:
            </span>
            {[
              { label: 'Himno #01', num: 1 },
              { label: 'Himno #02', num: 2 },
              { label: 'Himno #03', num: 3 },
              { label: 'Himno #04', num: 4 },
              { label: 'Himno #05', num: 5 },
              { label: 'Himno #10', num: 10 },
              { label: 'Himno #50', num: 50 },
              { label: 'Himno #1.000', num: 1000 },
              { label: 'Himno #100.000', num: 100000 },
              { label: 'Himno #224.344.224', num: TOTAL_HYMNS_COUNT },
            ].map((item) => {
              const isSelected = selectedHymnNumber === item.num;
              return (
                <button
                  key={item.num}
                  type="button"
                  onClick={() => handleJumpToNumber(item.num)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                    isSelected
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Selected Hymn Viewer + Full Lyrics & Audio Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 5 Cols: Active Hymn Card & Audio Controls */}
          <div className="lg:col-span-5 bg-slate-950 text-white rounded-2xl border border-blue-900/80 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="space-y-2 border-b border-slate-800 pb-5">
              <div className="flex items-center justify-between gap-2 text-xs font-mono text-blue-400">
                <span>
                  HIMNO #{displayedHymn.formattedNumber} DE 224.344.224
                </span>
                <span className="px-2 py-0.5 bg-blue-950 border border-blue-800 rounded text-[11px] text-blue-300">
                  {displayedHymn.musicalKey}
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                {displayedHymn.title}
              </h3>
              <p className="text-sm text-slate-300">{displayedHymn.subtitle}</p>
              <div className="pt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span>{displayedHymn.category}</span>
                <span aria-hidden="true">·</span>
                <span>{displayedHymn.scriptureRef}</span>
                <span aria-hidden="true">·</span>
                <span>{displayedHymn.tempo}</span>
              </div>
            </div>

            {/* Primary Audio Action */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (activeHymnNumber === displayedHymn.hymnNumber) {
                      onTogglePlayPause();
                    } else {
                      onPlayHymn(displayedHymn.hymnNumber);
                    }
                  }}
                  className="flex-1 py-3 px-5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl inline-flex items-center justify-center gap-2.5 transition-colors shadow-md"
                >
                  {isCurrentDisplayedPlaying ? (
                    <>
                      <Pause className="w-4 h-4 shrink-0" />
                      <span>Pausar Himno #{displayedHymn.formattedNumber}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current shrink-0" />
                      <span>Escuchar Himno #{displayedHymn.formattedNumber}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Prev / Next Across All 224,344,224 Hymns */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const prevNum =
                      displayedHymn.hymnNumber > 1
                        ? displayedHymn.hymnNumber - 1
                        : TOTAL_HYMNS_COUNT;
                    setSelectedHymnNumber(prevNum);
                    onPlayHymn(prevNum);
                  }}
                  className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <SkipBack className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Himno Anterior</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextNum =
                      displayedHymn.hymnNumber < TOTAL_HYMNS_COUNT
                        ? displayedHymn.hymnNumber + 1
                        : 1;
                    setSelectedHymnNumber(nextNum);
                    onPlayHymn(nextNum);
                  }}
                  className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Siguiente Himno</span>
                  <SkipForward className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                </button>
              </div>

              {onShareHymnToChat && (
                <button
                  type="button"
                  onClick={() =>
                    onShareHymnToChat(
                      `Himno #${displayedHymn.formattedNumber} (${displayedHymn.scriptureRef})`,
                      `${displayedHymn.title} — "${displayedHymn.chorus}"`
                    )
                  }
                  className="w-full py-2.5 px-4 bg-slate-900/90 hover:bg-slate-800 border border-blue-900/60 text-blue-300 text-xs font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Compartir este Himno en el Chat de Estudio</span>
                </button>
              )}
            </div>

            {/* Catalog Stats Summary */}
            <div className="pt-4 border-t border-slate-800/90 flex items-center justify-between text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Audio MP3 Activo</span>
              </span>
              <span className="font-mono text-slate-300">
                Total: 224.344.224 himnos
              </span>
            </div>
          </div>

          {/* Right 7 Cols: Complete Stanzas & Chorus Lyrics Reader */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0" />
                <div>
                  <h4 className="font-serif text-lg font-bold text-slate-950 dark:text-white">
                    Letra Congregacional del Himno #{displayedHymn.formattedNumber}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Lectura bíblica de respaldo: {displayedHymn.scriptureRef} (Reina-Valera 1960)
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {displayedHymn.stanzas.length} Estrofas + Coro
              </span>
            </div>

            <div className="space-y-5">
              {/* Stanza I */}
              <div className="space-y-1.5">
                <p className="text-xs font-mono uppercase tracking-wider text-blue-700 dark:text-blue-400 font-semibold">
                  Estrofa I
                </p>
                <p className="font-serif text-base sm:text-lg text-slate-800 dark:text-slate-200 leading-relaxed">
                  {displayedHymn.stanzas[0]}
                </p>
              </div>

              {/* Chorus */}
              <div className="p-4 sm:p-5 bg-blue-50/70 dark:bg-blue-950/30 border-l-4 border-blue-700 dark:border-blue-500 rounded-r-xl space-y-1.5">
                <p className="text-xs font-mono uppercase tracking-wider text-blue-800 dark:text-blue-300 font-semibold">
                  Coro Congregacional
                </p>
                <p className="font-serif text-base sm:text-lg font-semibold text-slate-950 dark:text-white leading-relaxed italic">
                  “{displayedHymn.chorus}”
                </p>
              </div>

              {/* Remaining Stanzas */}
              {displayedHymn.stanzas.slice(1).map((stanza, idx) => (
                <div key={idx} className="space-y-1.5">
                  <p className="text-xs font-mono uppercase tracking-wider text-blue-700 dark:text-blue-400 font-semibold">
                    Estrofa {idx === 0 ? 'II' : idx === 1 ? 'III' : idx + 2}
                  </p>
                  <p className="font-serif text-base sm:text-lg text-slate-800 dark:text-slate-200 leading-relaxed">
                    {stanza}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar for the 224,344,224 Hymns */}
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-950 dark:text-white">
                Catálogo General de los 224.344.224 Himnos
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Busca por número exacto (1 a 224.344.224), título, pasaje bíblico o explora por páginas
              </p>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Buscar por título, pasaje o # (ej. 224344224)..."
                aria-label="Buscar en los 224.344.224 himnos"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Interactive Category Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Todos');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === 'Todos'
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Todos los Himnos
            </button>
            {['Adoración y Majestad', 'La Cruz y Redención', 'Gracia y Salvación', 'Fe y Confianza', 'Consagración y Servicio', 'Alabanza Congregacional', 'Promesas y Vida Eterna'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat as HymnCategory);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Hymns Grid for Current Page */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {currentHymnPageItems.map((hymn) => {
              const isPlayingThis =
                isPlayingHymn && activeHymnNumber === hymn.hymnNumber;
              const isSelected = selectedHymnNumber === hymn.hymnNumber;

              return (
                <div
                  key={hymn.id}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between gap-3 transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 bg-white dark:bg-slate-900/60'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-blue-700 dark:text-blue-400 font-semibold">
                        HIMNO #{hymn.formattedNumber}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {hymn.musicalKey}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-slate-950 dark:text-white line-clamp-1">
                      {hymn.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {hymn.chorus}
                    </p>

                    <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      <span>{hymn.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{hymn.scriptureRef}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedHymnNumber(hymn.hymnNumber);
                        if (activeHymnNumber === hymn.hymnNumber) {
                          onTogglePlayPause();
                        } else {
                          onPlayHymn(hymn.hymnNumber);
                        }
                      }}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                        isPlayingThis
                          ? 'bg-blue-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      {isPlayingThis ? (
                        <>
                          <Pause className="w-3.5 h-3.5 shrink-0" />
                          <span>Pausar</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                          <span>Escuchar</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedHymnNumber(hymn.hymnNumber)}
                      className="py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Ver Letra
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls Across All 18,695,352 Pages (224,344,224 Hymns) */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
              Página {currentPage.toLocaleString('es-CO')} de{' '}
              {TOTAL_PAGES.toLocaleString('es-CO')} · Total:{' '}
              {TOTAL_HYMNS_COUNT.toLocaleString('es-CO')} himnos
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Inicio (#1)
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))
                }
                disabled={currentPage >= TOTAL_PAGES}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Siguiente
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentPage(TOTAL_PAGES);
                  setSelectedHymnNumber(TOTAL_HYMNS_COUNT);
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-mono font-semibold transition-colors"
              >
                Último (#224.344.224)
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
