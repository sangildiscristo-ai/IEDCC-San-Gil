import React, { useState, useEffect } from 'react';
import {
  Youtube,
  Facebook,
  Radio,
  UserPlus,
  Share2,
  Check,
  Play,
  Search,
  ChevronLeft,
  ChevronRight,
  Film,
} from 'lucide-react';
import { CHURCH_INFO } from '../data/churchData';
import {
  CHANNEL_VIDEOS_CATALOG,
  ChannelVideoItem,
  IEDCC_UPLOADS_PLAYLIST_ID,
} from '../data/youtubeVideosData';

interface LiveStreamSectionProps {
  onOpenJoinModal: () => void;
  isMemberJoined: boolean;
  selectedVideoId: string;
  onSelectVideoId: (videoId: string) => void;
}

const CATEGORIES = [
  'Todos',
  'Predicaciones',
  'Serie Mateo',
  'Familia y Crianza',
  'Historia y Bienvenida',
  'Reflexiones',
] as const;

export const LiveStreamSection: React.FC<LiveStreamSectionProps> = ({
  onOpenJoinModal,
  isMemberJoined,
  selectedVideoId,
  onSelectVideoId,
}) => {
  const [videos, setVideos] = useState<ChannelVideoItem[]>(
    CHANNEL_VIDEOS_CATALOG
  );
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [playMode, setPlayMode] = useState<'single' | 'playlist'>('single');

  // Sync any newly published videos from the channel RSS feed
  useEffect(() => {
    let mounted = true;
    async function syncLiveFeed() {
      try {
        const res = await fetch('/api/youtube-videos');
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && Array.isArray(data.videos) && data.videos.length > 0) {
          setVideos((prev) => {
            const existingIds = new Set(prev.map((v) => v.videoId));
            const newOnes = data.videos.filter(
              (v: ChannelVideoItem) => v.videoId && !existingIds.has(v.videoId)
            );
            return newOnes.length > 0 ? [...newOnes, ...prev] : prev;
          });
        }
      } catch {
        // Keep full built-in catalog
      }
    }
    syncLiveFeed();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredVideos = videos.filter((video) => {
    const matchesCat =
      activeCategory === 'Todos' || video.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      video.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      (video.scripture &&
        video.scripture
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())) ||
      (video.speaker &&
        video.speaker.toLowerCase().includes(searchQuery.trim().toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const activeVideo =
    videos.find((v) => v.videoId === selectedVideoId) || videos[0];

  const currentIndex = filteredVideos.findIndex(
    (v) => v.videoId === activeVideo.videoId
  );

  const handlePrevVideo = () => {
    if (filteredVideos.length === 0) return;
    const prevIdx =
      currentIndex > 0 ? currentIndex - 1 : filteredVideos.length - 1;
    setPlayMode('single');
    onSelectVideoId(filteredVideos[prevIdx].videoId);
  };

  const handleNextVideo = () => {
    if (filteredVideos.length === 0) return;
    const nextIdx =
      currentIndex >= 0 && currentIndex < filteredVideos.length - 1
        ? currentIndex + 1
        : 0;
    setPlayMode('single');
    onSelectVideoId(filteredVideos[nextIdx].videoId);
  };

  const handleCopyChannelUrl = () => {
    navigator.clipboard?.writeText(CHURCH_INFO.youtubeChannelUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 3000);
  };

  const embedSrc =
    playMode === 'playlist'
      ? `https://www.youtube.com/embed/videoseries?list=${IEDCC_UPLOADS_PLAYLIST_ID}&rel=0`
      : `https://www.youtube.com/embed/${activeVideo.videoId}?rel=0`;

  return (
    <section
      id="en-vivo"
      className="py-20 lg:py-28 bg-slate-950 text-white border-b border-blue-950"
    >
      <div id="videos-canal" className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-800">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs text-blue-400 font-medium tracking-wide mb-3">
              <Radio className="w-4 h-4 text-blue-400 animate-pulse shrink-0" />
              <span>Videoteca Oficial Integrada</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{CHURCH_INFO.handle}</span>
              <span aria-hidden="true">·</span>
              <span>Reproducción Directa en la Web</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
              Todos los Videos y Predicaciones de Nuestro Canal (@IEDCCSanGil)
            </h2>

            <p className="mt-4 text-base text-slate-300 leading-relaxed">
              Mira todas las predicaciones, estudios del Evangelio de Mateo, enseñanzas para matrimonios, historia de nuestra iglesia y reflexiones{' '}
              <strong className="text-white">
                directamente aquí en nuestra página web sin necesidad de salir a YouTube
              </strong>
              .
            </p>
          </div>

          {/* Subscribe & Join Website Actions */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            <a
              href={CHURCH_INFO.youtubeSubscribeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              <Youtube className="w-4 h-4 shrink-0" />
              <span>Suscribirse en YouTube</span>
            </a>

            <a
              href={CHURCH_INFO.facebookPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-blue-950 text-white border border-blue-700/70 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              <Facebook className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Suscribirse en Facebook</span>
            </a>

            <button
              type="button"
              onClick={onOpenJoinModal}
              className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-100 text-slate-950 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                {isMemberJoined ? 'Mi Credencial Web' : 'Unirse a la Página Web'}
              </span>
            </button>
          </div>
        </div>

        {/* MAIN IN-PAGE VIDEO THEATRE + PLAYLIST SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10 items-start">
          {/* Left 8 Cols: Embedded YouTube Player (Watch directly on the page) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-900 border border-blue-900/60 rounded-xl overflow-hidden shadow-2xl">
              {/* Top Player Control Bar */}
              <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <Film className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-blue-400 font-semibold">
                    Reproductor en Página
                  </span>
                  <span aria-hidden="true" className="text-slate-600">
                    ·
                  </span>
                  <span className="text-slate-300">
                    {activeVideo.category}
                  </span>
                </div>

                {/* Switch between Individual Video & Full Channel Playlist */}
                <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPlayMode('single')}
                    className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                      playMode === 'single'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Video Seleccionado
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlayMode('playlist')}
                    className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                      playMode === 'playlist'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Reproducir Todo el Canal
                  </button>
                </div>
              </div>

              {/* Embedded 16:9 YouTube Player */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  key={embedSrc}
                  src={embedSrc}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              {/* Now Playing Info + Prev/Next Buttons */}
              <div className="p-5 sm:p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-blue-400">
                    <span>Reproduciendo ahora</span>
                    {activeVideo.scripture && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono font-semibold text-blue-300">
                          {activeVideo.scripture}
                        </span>
                      </>
                    )}
                    {activeVideo.speaker && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-300">
                          {activeVideo.speaker}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-white">
                    {activeVideo.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handlePrevVideo}
                    className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextVideo}
                    className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors whitespace-nowrap"
                  >
                    <span>Siguiente Video</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quiet Helper Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 px-1">
              <span>
                Total de videos disponibles en esta página:{' '}
                <strong className="text-white font-mono">
                  {videos.length}
                </strong>{' '}
                videos oficiales de @IEDCCSanGil
              </span>

              <button
                type="button"
                onClick={handleCopyChannelUrl}
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">
                      Enlace del canal copiado
                    </span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Compartir enlace del canal</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right 4 Cols: Quick Scrollable Playlist of All Channel Videos */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-semibold text-white">
                  Lista de Videos del Canal ({filteredVideos.length})
                </h3>
                <span className="text-xs font-mono text-blue-400">
                  @IEDCCSanGil
                </span>
              </div>

              {/* Search inside channel videos */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar predicación, pasaje o pastor..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-800/80 max-h-[440px] overflow-y-auto">
              {filteredVideos.map((vid, idx) => {
                const isPlaying =
                  playMode === 'single' && vid.videoId === activeVideo.videoId;
                return (
                  <button
                    key={vid.videoId}
                    type="button"
                    onClick={() => {
                      setPlayMode('single');
                      onSelectVideoId(vid.videoId);
                    }}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                      isPlaying
                        ? 'bg-blue-950/70 text-white'
                        : 'hover:bg-slate-950/60 text-slate-200'
                    }`}
                  >
                    {/* Thumbnail preview from official i.ytimg.com */}
                    <div className="relative w-24 aspect-video rounded overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                      <img
                        src={`https://i.ytimg.com/vi/${vid.videoId}/mqdefault.jpg`}
                        alt={vid.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play
                          className={`w-4 h-4 ${
                            isPlaying
                              ? 'text-blue-400 fill-blue-400'
                              : 'text-white/90'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] text-blue-400 font-mono">
                        <span>#{String(idx + 1).padStart(2, '0')}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{vid.category}</span>
                      </div>
                      <p
                        className={`text-xs font-semibold leading-snug line-clamp-2 mt-0.5 ${
                          isPlaying ? 'text-white' : 'text-slate-200'
                        }`}
                      >
                        {vid.title}
                      </p>
                      {vid.speaker && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {vid.speaker}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* COMPLETE FILTERABLE VIDEO GALLERY BELOW THE PLAYER */}
        <div className="mt-14 pt-10 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-white">
                Catálogo Completo de Predicaciones y Enseñanzas ({filteredVideos.length})
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Haz clic en cualquier video para reproducirlo inmediatamente en el reproductor superior sin salir de la página.
              </p>
            </div>

            {/* Category Filter Buttons */}
            <div
              className="flex flex-wrap items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800"
              role="tablist"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredVideos.map((vid) => {
              const isPlaying =
                playMode === 'single' && vid.videoId === activeVideo.videoId;
              return (
                <button
                  key={vid.videoId}
                  type="button"
                  onClick={() => {
                    setPlayMode('single');
                    onSelectVideoId(vid.videoId);
                    document
                      .getElementById('videos-canal')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`group text-left rounded-xl overflow-hidden border transition-all flex flex-col justify-between ${
                    isPlaying
                      ? 'bg-blue-950/50 border-blue-500 ring-1 ring-blue-500'
                      : 'bg-slate-900/70 border-slate-800 hover:border-blue-600'
                  }`}
                >
                  <div>
                    <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                      <img
                        src={`https://i.ytimg.com/vi/${vid.videoId}/hqdefault.jpg`}
                        alt={vid.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent flex items-center justify-center">
                        <span
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                            isPlaying
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-950/85 text-white border border-white/20'
                          }`}
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-blue-400 font-medium mb-1">
                        <span>{vid.category}</span>
                        {vid.scripture && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono">{vid.scripture}</span>
                          </>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-white line-clamp-2 leading-snug">
                        {vid.title}
                      </h4>
                    </div>
                  </div>

                  <div className="px-4 pb-3.5 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate">
                      {vid.speaker || 'IEDCC San Gil'}
                    </span>
                    <span className="text-blue-400 font-semibold shrink-0">
                      {isPlaying ? 'Reproduciendo' : 'Ver aquí →'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
