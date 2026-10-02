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
  Mic,
  MicOff,
  Sparkles,
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
import {
  hymnVoiceEngine,
  HymnVoiceSection,
} from '../utils/voiceSynthesis';

interface HymnalSectionProps {
  activeHymnNumber: number;
  isPlayingHymn: boolean;
  onPlayHymn: (hymnNumber: number) => void;
  onTogglePlayPause: () => void;
  onShareHymnToChat?: (reference: string, text: string) => void;
  isVoiceActive?: boolean;
  onToggleVoiceActive?: () => void;
  currentVoicedSection?: string | null;
}

const PAGE_SIZE = 12;
const TOTAL_PAGES = Math.ceil(TOTAL_HYMNS_COUNT / PAGE_SIZE);

export const HymnalSection: React.FC<HymnalSectionProps> = ({
  activeHymnNumber,
  isPlayingHymn,
  onPlayHymn,
  onTogglePlayPause,
  onShareHymnToChat,
  isVoiceActive = true,
  onToggleVoiceActive,
  currentVoicedSection,
}) => {
  const [selectedHymnNumber, setSelectedHymnNumber] =
    useState<number>(activeHymnNumber || 1);
  const [numberInput, setNumberInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<
    'Todos' | HymnCategory
  >('Todos');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isolatedVoicingSection, setIsolatedVoicingSection] = useState<string | null>(null);

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

  // Play a specific stanza or chorus immediately with devotional voice
  const handleSpeakSingleSection = (text: string, section: HymnVoiceSection, label: string) => {
    setIsolatedVoicingSection(section);
    hymnVoiceEngine.speakSingleSnippet(text, section, label, {
      onEnd: () => setIsolatedVoicingSection(null),
      onError: () => setIsolatedVoicingSection(null),
    });
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

  const isSectionActive = (sectionKey: string) => {
    if (isolatedVoicingSection === sectionKey) return true;
    return isCurrentDisplayedPlaying && currentVoicedSection === sectionKey;
  };

  return (
    <section
      id="himnario"
      className="py-20 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 scroll-mt-16 font-sans"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-700/60 rounded-full text-xs font-semibold text-blue-800 dark:text-blue-300">
              <Mic className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Voz Activa en Cada Canción · Cantado y Declamado en Español</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 dark:text-white tracking-tight">
              Gran Himnario Cristiano: 224.344.224 Himnos con Voz
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Cada canción incluye <strong className="font-semibold text-slate-900 dark:text-white">voz humana en español</strong> que recita y canta las estrofas y el coro en armonía con la música, disponible para cualquiera de los{' '}
              <strong className="font-semibold text-slate-900 dark:text-white font-mono">
                224.344.224
              </strong>{' '}
              himnos cristianos desde el <span className="font-mono font-semibold">#01</span> hasta el{' '}
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
              Ir con Voz
            </button>
            <button
              type="button"
              onClick={handleRandomHymn}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              title="Escuchar un himno aleatorio con voz entre los 224.344.224 himnos"
            >
              <Shuffle className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Aleatorio</span>
            </button>
          </form>
        </div>

        {/* Quick Milestone Jump Bar (#1 to #224.344.224) */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2 flex items-center gap-1">
              <Mic className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Saltos con voz en el catálogo:
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

            {/* Primary Audio & Voice Actions */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
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
                      <span>Pausar Canción #{displayedHymn.formattedNumber}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current shrink-0" />
                      <span>Cantar Himno #{displayedHymn.formattedNumber} con Voz</span>
                    </>
                  )}
                </button>

                {onToggleVoiceActive && (
                  <button
                    type="button"
                    onClick={onToggleVoiceActive}
                    className={`px-4 py-3 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
                      isVoiceActive
                        ? 'bg-blue-950/80 border-blue-500 text-blue-300 hover:bg-blue-900/80'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={isVoiceActive ? 'Voz activada' : 'Voz desactivada'}
                  >
                    {isVoiceActive ? (
                      <>
                        <Mic className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>Voz: SÍ</span>
                      </>
                    ) : (
                      <>
                        <MicOff className="w-4 h-4 shrink-0" />
                        <span>Voz: NO</span>
                      </>
                    )}
                  </button>
                )}
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
                <span>Voz y Música Activas</span>
              </span>
              <span className="font-mono text-slate-300">
                224.344.224 Canciones
              </span>
            </div>
          </div>

          {/* Right 7 Cols: Complete Stanzas & Chorus Lyrics Reader with Interactive Voice */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-2">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0" />
                <div>
                  <h4 className="font-serif text-lg font-bold text-slate-950 dark:text-white">
                    Letra con Voz: Himno #{displayedHymn.formattedNumber}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Lectura bíblica: {displayedHymn.scriptureRef} · Haz clic en cualquier estrofa para escuchar su voz
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 px-2 py-1 rounded self-start sm:self-auto">
                {displayedHymn.stanzas.length} Estrofas + Coro con Voz
              </span>
            </div>

            <div className="space-y-4">
              {/* Stanza I */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  isSectionActive('stanza-0')
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-blue-500/50 shadow-md'
                    : 'border-slate-200 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-blue-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-blue-700 dark:text-blue-400 font-bold flex items-center gap-1.5">
                    <span>Estrofa I</span>
                    {isSectionActive('stanza-0') && (
                      <span className="px-1.5 py-0.2 bg-blue-600 text-white text-[10px] rounded animate-pulse">
                        Voz sonando ahora
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeakSingleSection(
                        displayedHymn.stanzas[0],
                        'stanza-0',
                        'Estrofa I'
                      )
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                    title="Escuchar Estrofa I con voz"
                  >
                    <Mic className="w-3 h-3 text-blue-500" />
                    <span>Oír Estrofa</span>
                  </button>
                </div>
                <p className="font-serif text-base sm:text-lg text-slate-800 dark:text-slate-200 leading-relaxed">
                  {displayedHymn.stanzas[0]}
                </p>
              </div>

              {/* Chorus */}
              <div
                className={`p-5 rounded-xl border-l-4 border-blue-700 dark:border-blue-500 transition-all ${
                  isSectionActive('chorus-1') || isSectionActive('chorus-2') || isSectionActive('chorus-final')
                    ? 'border-blue-600 bg-blue-100/90 dark:bg-blue-950/80 ring-2 ring-blue-500/50 shadow-md'
                    : 'bg-blue-50/70 dark:bg-blue-950/30 border-r border-t border-b border-blue-100 dark:border-blue-900/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-blue-800 dark:text-blue-300 font-bold flex items-center gap-1.5">
                    <span>Coro Congregacional</span>
                    {(isSectionActive('chorus-1') || isSectionActive('chorus-2') || isSectionActive('chorus-final')) && (
                      <span className="px-1.5 py-0.2 bg-blue-700 text-white text-[10px] rounded animate-pulse">
                        Voz cantando el coro
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeakSingleSection(
                        `Coro: ${displayedHymn.chorus}`,
                        'chorus-1',
                        'Coro Congregacional'
                      )
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-slate-900 hover:bg-blue-700 hover:text-white text-blue-900 dark:text-blue-200 text-xs font-semibold transition-colors shadow-sm"
                    title="Cantar el coro con voz"
                  >
                    <Mic className="w-3 h-3 text-blue-600" />
                    <span>Cantar Coro</span>
                  </button>
                </div>
                <p className="font-serif text-base sm:text-lg font-semibold text-slate-950 dark:text-white leading-relaxed italic">
                  “{displayedHymn.chorus}”
                </p>
              </div>

              {/* Remaining Stanzas */}
              {displayedHymn.stanzas.slice(1).map((stanza, idx) => {
                const sectionKey = `stanza-${idx + 1}` as HymnVoiceSection;
                const stanzaNumber = idx === 0 ? 'II' : idx === 1 ? 'III' : `${idx + 2}`;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      isSectionActive(sectionKey)
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-blue-500/50 shadow-md'
                        : 'border-slate-200 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-blue-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-mono uppercase tracking-wider text-blue-700 dark:text-blue-400 font-bold flex items-center gap-1.5">
                        <span>Estrofa {stanzaNumber}</span>
                        {isSectionActive(sectionKey) && (
                          <span className="px-1.5 py-0.2 bg-blue-600 text-white text-[10px] rounded animate-pulse">
                            Voz sonando ahora
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleSpeakSingleSection(
                            stanza,
                            sectionKey,
                            `Estrofa ${stanzaNumber}`
                          )
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                        title={`Escuchar Estrofa ${stanzaNumber} con voz`}
                      >
                        <Mic className="w-3 h-3 text-blue-500" />
                        <span>Oír Estrofa</span>
                      </button>
                    </div>
                    <p className="font-serif text-base sm:text-lg text-slate-800 dark:text-slate-200 leading-relaxed">
                      {stanza}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar for the 224,344,224 Hymns */}
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
                <span>Catálogo de los 224.344.224 Himnos con Voz</span>
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs rounded-full font-sans font-medium">
                  Voz Incluida
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selecciona cualquier himno para escucharlo inmediatamente cantado y declamado con voz humana en español
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
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        <Mic className="w-3 h-3" />
                        <span>Con Voz</span>
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
                          <span>Pausar Voz</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                          <span>Cantar con Voz</span>
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
              {TOTAL_HYMNS_COUNT.toLocaleString('es-CO')} canciones con voz
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
