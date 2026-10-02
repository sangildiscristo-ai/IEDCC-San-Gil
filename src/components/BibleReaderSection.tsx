import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  Users,
  Check,
  Sparkles,
} from 'lucide-react';
import {
  BIBLE_BOOKS,
  QUICK_PASSAGES,
  LOCAL_BIBLE_CHAPTERS,
  BibleVerse,
} from '../data/bibleData';
import { buildWhatsAppUrl } from '../data/churchData';

export interface SavedBookmark {
  id: string;
  reference: string;
  text: string;
  bookId: number;
  chapter: number;
  verse: number;
  savedAt: string;
}

interface BibleReaderSectionProps {
  selectedPhone: string;
  onSendVerseToStudyGroup: (reference: string, text: string) => void;
}

const BOOKMARKS_STORAGE_KEY = 'iedcc_sangil_bible_bookmarks';

export const BibleReaderSection: React.FC<BibleReaderSectionProps> = ({
  selectedPhone,
  onSendVerseToStudyGroup,
}) => {
  const [testamentFilter, setTestamentFilter] = useState<'TODOS' | 'AT' | 'NT'>(
    'TODOS'
  );
  const [selectedBookId, setSelectedBookId] = useState<number>(43); // Juan
  const [selectedChapter, setSelectedChapter] = useState<number>(3); // Cap 3
  const [verses, setVerses] = useState<BibleVerse[]>(
    LOCAL_BIBLE_CHAPTERS['43-3'] || []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fontSize, setFontSize] = useState<'base' | 'lg' | 'xl'>('lg');
  const [bookmarks, setBookmarks] = useState<SavedBookmark[]>([]);
  const [copiedVerseKey, setCopiedVerseKey] = useState<string | null>(null);
  const [showBookmarksPanel, setShowBookmarksPanel] = useState<boolean>(false);

  const currentBook =
    BIBLE_BOOKS.find((b) => b.id === selectedBookId) || BIBLE_BOOKS[42];

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (raw) {
        setBookmarks(JSON.parse(raw));
      }
    } catch {
      // Ignore storage error
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const key = `${selectedBookId}-${selectedChapter}`;

    async function fetchChapter() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/bible/${selectedBookId}/${selectedChapter}`
        );
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.verses) && data.verses.length > 0) {
            setVerses(data.verses);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to local chapter library
      }

      if (!isMounted) return;

      if (LOCAL_BIBLE_CHAPTERS[key]) {
        setVerses(LOCAL_BIBLE_CHAPTERS[key]);
      } else {
        // Provide core chapter verses if offline and chapter isn't in the preloaded 12
        setVerses([
          {
            verse: 1,
            text: `Lectura de ${currentBook.name} capítulo ${selectedChapter} (Reina-Valera). Lámpara es a mis pies tu palabra, y lumbrera a mi camino.`,
          },
          {
            verse: 2,
            text: `Toda la Escritura es inspirada por Dios, y útil para enseñar, para redargüir, para corregir, para instruir en justicia, a fin de que el hombre de Dios sea perfecto, enteramente preparado para toda buena obra.`,
          },
          {
            verse: 3,
            text: `Selecciona cualquiera de los pasajes destacados o conéctate a internet para cargar los ${currentBook.chapters} capítulos completos de ${currentBook.name}.`,
          },
        ]);
      }
      setIsLoading(false);
    }

    fetchChapter();
    return () => {
      isMounted = false;
    };
  }, [selectedBookId, selectedChapter, currentBook.name, currentBook.chapters]);

  const filteredBooks = BIBLE_BOOKS.filter((b) =>
    testamentFilter === 'TODOS' ? true : b.testament === testamentFilter
  );

  const filteredVerses = verses.filter((v) =>
    searchQuery.trim() === ''
      ? true
      : v.text.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        String(v.verse) === searchQuery.trim()
  );

  const toggleBookmark = (v: BibleVerse) => {
    const id = `${selectedBookId}-${selectedChapter}-${v.verse}`;
    const exists = bookmarks.some((b) => b.id === id);
    let updated: SavedBookmark[];
    if (exists) {
      updated = bookmarks.filter((b) => b.id !== id);
    } else {
      updated = [
        {
          id,
          reference: `${currentBook.name} ${selectedChapter}:${v.verse}`,
          text: v.text,
          bookId: selectedBookId,
          chapter: selectedChapter,
          verse: v.verse,
          savedAt: new Date().toLocaleDateString('es-CO'),
        },
        ...bookmarks,
      ];
    }
    setBookmarks(updated);
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleCopyVerse = (v: BibleVerse) => {
    const ref = `${currentBook.name} ${selectedChapter}:${v.verse}`;
    const fullText = `“${v.text}” — ${ref} (Reina-Valera · Iglesia Discípulos de Cristo de San Gil)`;
    navigator.clipboard?.writeText(fullText);
    setCopiedVerseKey(`${selectedBookId}-${selectedChapter}-${v.verse}`);
    setTimeout(() => setCopiedVerseKey(null), 2500);
  };

  const handlePrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter((c) => c - 1);
    } else if (selectedBookId > 1) {
      const prevBook = BIBLE_BOOKS.find((b) => b.id === selectedBookId - 1);
      if (prevBook) {
        setSelectedBookId(prevBook.id);
        setSelectedChapter(prevBook.chapters);
      }
    }
  };

  const handleNextChapter = () => {
    if (selectedChapter < currentBook.chapters) {
      setSelectedChapter((c) => c + 1);
    } else if (selectedBookId < 66) {
      const nextBook = BIBLE_BOOKS.find((b) => b.id === selectedBookId + 1);
      if (nextBook) {
        setSelectedBookId(nextBook.id);
        setSelectedChapter(1);
      }
    }
  };

  return (
    <section
      id="biblia"
      className="py-20 lg:py-28 bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top Editorial Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-400 font-medium mb-3">
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Santa Biblia en Línea</span>
              <span aria-hidden="true">·</span>
              <span>Reina-Valera 1960</span>
              <span aria-hidden="true">·</span>
              <span>66 Libros (Antiguo y Nuevo Testamento)</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Lectura de la Santa Biblia y Estudio de la Palabra
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Escudriña las Escrituras directamente desde nuestra página web. Guarda tus versículos favoritos, ajusta el tamaño de letra para lectura diurna o nocturna, y envía cualquier pasaje con un clic a nuestros{' '}
              <strong className="text-slate-900 dark:text-white">
                Grupos Reales de Estudio Bíblico
              </strong>
              .
            </p>
          </div>

          {/* Font Size & Saved Bookmarks Controls */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            <div
              className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800"
              aria-label="Tamaño de texto bíblico"
            >
              {[
                { id: 'base', label: 'A-' },
                { id: 'lg', label: 'A' },
                { id: 'xl', label: 'A+' },
              ].map((sizeOpt) => (
                <button
                  key={sizeOpt.id}
                  type="button"
                  onClick={() =>
                    setFontSize(sizeOpt.id as 'base' | 'lg' | 'xl')
                  }
                  className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-md transition-colors ${
                    fontSize === sizeOpt.id
                      ? 'bg-blue-700 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {sizeOpt.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowBookmarksPanel((prev) => !prev)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                showBookmarksPanel
                  ? 'bg-slate-950 dark:bg-blue-600 text-white border-slate-950 dark:border-blue-500'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-blue-600'
              }`}
            >
              <Bookmark className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Versículos Guardados ({bookmarks.length})</span>
            </button>
          </div>
        </div>

        {/* Quick Curated Church Passages Bar */}
        <div className="py-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Lecturas recomendadas para Cultos, Varones, Damas y Discipulados:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_PASSAGES.map((qp) => {
              const isSelected =
                selectedBookId === qp.bookId && selectedChapter === qp.chapter;
              return (
                <button
                  key={qp.label}
                  type="button"
                  onClick={() => {
                    setSelectedBookId(qp.bookId);
                    setSelectedChapter(qp.chapter);
                    setSearchQuery('');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-600'
                  }`}
                  title={qp.theme}
                >
                  <span className="font-semibold">{qp.label}</span>
                  <span className="opacity-75 ml-1.5 hidden sm:inline">
                    · {qp.theme}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Saved Bookmarks Drawer (if open) */}
        {showBookmarksPanel && (
          <div className="my-6 p-6 bg-slate-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-semibold text-slate-950 dark:text-white">
                Mis Versículos Guardados en esta Página
              </h3>
              <button
                type="button"
                onClick={() => setShowBookmarksPanel(false)}
                className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white underline"
              >
                Ocultar lista
              </button>
            </div>
            {bookmarks.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aún no has guardado ningún versículo. Haz clic en el ícono de marcador junto a cualquier versículo mientras lees la Biblia.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="p-4 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBookId(bm.bookId);
                            setSelectedChapter(bm.chapter);
                            setShowBookmarksPanel(false);
                          }}
                          className="font-serif text-base font-semibold text-blue-700 dark:text-blue-400 hover:underline"
                        >
                          {bm.reference}
                        </button>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {bm.savedAt}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed">
                        “{bm.text}”
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <button
                        type="button"
                        onClick={() =>
                          onSendVerseToStudyGroup(bm.reference, bm.text)
                        }
                        className="text-blue-700 dark:text-blue-400 font-semibold hover:underline"
                      >
                        Compartir en Grupo de Estudio
                      </button>
                      <span aria-hidden="true">·</span>
                      <button
                        type="button"
                        onClick={() =>
                          toggleBookmark({
                            verse: bm.verse,
                            text: bm.text,
                          })
                        }
                        className="text-slate-500 hover:text-red-600 transition-colors"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Bible Reader Grid: Sidebar Book/Chapter Selector + Reading Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          {/* Left Control Column: Book, Testament & Chapter Selector (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-5">
              {/* Testament Filter Tabs */}
              <div>
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Testamento:
                </span>
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/70 dark:bg-slate-950 rounded-lg">
                  {[
                    { id: 'TODOS', label: 'Todos (66)' },
                    { id: 'AT', label: 'A.T. (39)' },
                    { id: 'NT', label: 'N.T. (27)' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() =>
                        setTestamentFilter(t.id as 'TODOS' | 'AT' | 'NT')
                      }
                      className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        testamentFilter === t.id
                          ? 'bg-slate-950 dark:bg-blue-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Book Dropdown */}
              <div>
                <label
                  htmlFor="bible-book-select"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Seleccionar Libro de la Biblia:
                </label>
                <select
                  id="bible-book-select"
                  value={selectedBookId}
                  onChange={(e) => {
                    setSelectedBookId(Number(e.target.value));
                    setSelectedChapter(1);
                    setSearchQuery('');
                  }}
                  className="w-full px-3.5 py-2.5 text-sm font-medium bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white focus:outline-none focus:border-blue-600"
                >
                  {filteredBooks.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.name} ({book.chapters} cap. · {book.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Chapter Grid Selector */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Capítulo de {currentBook.name}:
                  </span>
                  <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    Cap. {selectedChapter} de {currentBook.chapters}
                  </span>
                </div>
                <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-6 gap-1.5 max-h-52 overflow-y-auto p-1">
                  {Array.from(
                    { length: currentBook.chapters },
                    (_, i) => i + 1
                  ).map((chapNum) => (
                    <button
                      key={chapNum}
                      type="button"
                      onClick={() => {
                        setSelectedChapter(chapNum);
                        setSearchQuery('');
                      }}
                      className={`py-1.5 text-xs font-mono font-semibold rounded border tabular-nums transition-colors ${
                        selectedChapter === chapNum
                          ? 'bg-blue-700 text-white border-blue-700'
                          : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-600'
                      }`}
                    >
                      {chapNum}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter inside chapter */}
              <div>
                <label
                  htmlFor="bible-verse-search"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Buscar palabra o número de versículo en este capítulo:
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="bible-verse-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ej. pastor, amor, fe, 16..."
                    className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Reading Canvas (8 cols) */}
          <div className="lg:col-span-8">
            <div className="bg-slate-50/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              {/* Chapter Title Bar + Prev/Next Chapter Navigation */}
              <div className="px-6 py-5 bg-slate-950 text-white border-b border-blue-950 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-blue-400 font-medium">
                    <span>
                      {currentBook.testament === 'AT'
                        ? 'Antiguo Testamento'
                        : 'Nuevo Testamento'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{currentBook.category}</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white mt-0.5">
                    {currentBook.name} {selectedChapter}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevChapter}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg transition-colors"
                    title="Capítulo anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextChapter}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                    title="Siguiente capítulo"
                  >
                    <span>Siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scripture Verses Body */}
              <div className="p-6 sm:p-8 lg:p-10 space-y-5 max-h-[640px] overflow-y-auto">
                {isLoading ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Cargando {currentBook.name} {selectedChapter}...
                    </p>
                  </div>
                ) : filteredVerses.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      No se encontraron versículos con “{searchQuery}” en este capítulo.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-xs font-semibold text-blue-600 underline"
                    >
                      Mostrar todo el capítulo
                    </button>
                  </div>
                ) : (
                  filteredVerses.map((v) => {
                    const verseKey = `${selectedBookId}-${selectedChapter}-${v.verse}`;
                    const isBookmarked = bookmarks.some(
                      (b) => b.id === verseKey
                    );
                    const reference = `${currentBook.name} ${selectedChapter}:${v.verse}`;

                    return (
                      <div
                        key={v.verse}
                        className={`group p-3.5 -mx-3.5 rounded-xl transition-colors border ${
                          isBookmarked
                            ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60'
                            : 'border-transparent hover:bg-white dark:hover:bg-slate-950/70 hover:border-slate-200 dark:hover:border-slate-800'
                        }`}
                      >
                        <p
                          className={`leading-relaxed text-slate-900 dark:text-slate-100 ${
                            fontSize === 'xl'
                              ? 'text-xl'
                              : fontSize === 'lg'
                              ? 'text-base sm:text-lg'
                              : 'text-sm sm:text-base'
                          }`}
                        >
                          <span className="font-mono text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-400 mr-2.5 select-none tabular-nums">
                            {v.verse}
                          </span>
                          <span>{v.text}</span>
                        </p>

                        {/* Verse Action Toolbar */}
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs opacity-90 sm:opacity-75 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => toggleBookmark(v)}
                            className={`inline-flex items-center gap-1 font-medium transition-colors ${
                              isBookmarked
                                ? 'text-blue-700 dark:text-blue-400 font-semibold'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                            }`}
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>
                              {isBookmarked ? 'Guardado' : 'Guardar versículo'}
                            </span>
                          </button>

                          <span
                            aria-hidden="true"
                            className="text-slate-300 dark:text-slate-700"
                          >
                            ·
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              onSendVerseToStudyGroup(reference, v.text)
                            }
                            className="inline-flex items-center gap-1 font-semibold text-blue-700 dark:text-blue-400 hover:underline"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>Llevar a Grupo de Estudio</span>
                          </button>

                          <span
                            aria-hidden="true"
                            className="text-slate-300 dark:text-slate-700"
                          >
                            ·
                          </span>

                          <button
                            type="button"
                            onClick={() => handleCopyVerse(v)}
                            className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
                          >
                            {copiedVerseKey === verseKey ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                  Copiado
                                </span>
                              </>
                            ) : (
                              <>
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Copiar cita</span>
                              </>
                            )}
                          </button>

                          <span
                            aria-hidden="true"
                            className="text-slate-300 dark:text-slate-700"
                          >
                            ·
                          </span>

                          <a
                            href={buildWhatsAppUrl(
                              selectedPhone,
                              `“${v.text}” — ${reference} (Leído en la Biblia de la Iglesia Discípulos de Cristo de San Gil)`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            Enviar por WhatsApp
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
