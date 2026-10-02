import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Pause,
  Play,
  Sliders,
  SkipBack,
  SkipForward,
  Upload,
  Check,
  Mic,
  Shuffle,
  Hash,
} from 'lucide-react';
import {
  TOTAL_HYMNS_COUNT,
  HymnItem,
  getHymnByNumber,
} from '../data/hymnsCatalogData';

interface AmbientMusicPlayerProps {
  currentHymnNumber?: number;
  isPlaying?: boolean;
  onHymnNumberChange?: (hymnNumber: number) => void;
  onPlayingChange?: (playing: boolean) => void;
}

function formatSeconds(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const AmbientMusicPlayer: React.FC<AmbientMusicPlayerProps> = ({
  currentHymnNumber: controlledHymnNumber,
  isPlaying: controlledIsPlaying,
  onHymnNumberChange,
  onPlayingChange,
}) => {
  const [internalHymnNumber, setInternalHymnNumber] = useState<number>(1);
  const [internalIsPlaying, setInternalIsPlaying] = useState<boolean>(false);
  const [customOverrides, setCustomOverrides] = useState<
    Record<number, { title: string; mp3Url: string }>
  >({});
  const [jumpInput, setJumpInput] = useState<string>('');
  const [volume, setVolume] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hasAutoStarted, setHasAutoStarted] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeHymnNumber =
    typeof controlledHymnNumber === 'number'
      ? controlledHymnNumber
      : internalHymnNumber;

  const isPlaying =
    typeof controlledIsPlaying === 'boolean'
      ? controlledIsPlaying
      : internalIsPlaying;

  const setActiveHymnNumber = useCallback(
    (nextNum: number) => {
      const clamped = Math.max(
        1,
        Math.min(TOTAL_HYMNS_COUNT, Math.floor(nextNum || 1))
      );
      setInternalHymnNumber(clamped);
      onHymnNumberChange?.(clamped);
    },
    [onHymnNumberChange]
  );

  const setPlayingState = useCallback(
    (nextPlaying: boolean) => {
      setInternalIsPlaying(nextPlaying);
      onPlayingChange?.(nextPlaying);
    },
    [onPlayingChange]
  );

  const currentTrack: HymnItem = useMemo(() => {
    const base = getHymnByNumber(activeHymnNumber);
    const override = customOverrides[activeHymnNumber];
    if (override) {
      return {
        ...base,
        title: override.title,
        mp3Url: override.mp3Url,
      };
    }
    return base;
  }, [activeHymnNumber, customOverrides]);

  // Quick window of 12 nearby hymns around the active hymn number
  const nearbyHymns: HymnItem[] = useMemo(() => {
    const start = Math.max(
      1,
      Math.min(TOTAL_HYMNS_COUNT - 11, activeHymnNumber - 2)
    );
    const items: HymnItem[] = [];
    for (let i = 0; i < 12; i++) {
      const n = start + i;
      if (n <= TOTAL_HYMNS_COUNT) {
        const base = getHymnByNumber(n);
        const override = customOverrides[n];
        items.push(
          override
            ? { ...base, title: override.title, mp3Url: override.mp3Url }
            : base
        );
      }
    }
    return items;
  }, [activeHymnNumber, customOverrides]);

  // Sync volume & mute to the HTML5 <audio> element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const playCurrentAudio = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.muted = isMuted;
      await audioRef.current.play();
      setPlayingState(true);
    } catch {
      setPlayingState(false);
    }
  }, [isMuted, volume, setPlayingState]);

  const pauseCurrentAudio = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setPlayingState(false);
  }, [setPlayingState]);

  const togglePlay = () => {
    setHasAutoStarted(true);
    if (isPlaying) {
      pauseCurrentAudio();
    } else {
      playCurrentAudio();
    }
  };

  const handleNextTrack = useCallback(() => {
    const nextNum =
      activeHymnNumber < TOTAL_HYMNS_COUNT ? activeHymnNumber + 1 : 1;
    setActiveHymnNumber(nextNum);
    setPlayingState(true);
  }, [activeHymnNumber, setActiveHymnNumber, setPlayingState]);

  const handlePrevTrack = useCallback(() => {
    const prevNum =
      activeHymnNumber > 1 ? activeHymnNumber - 1 : TOTAL_HYMNS_COUNT;
    setActiveHymnNumber(prevNum);
    setPlayingState(true);
  }, [activeHymnNumber, setActiveHymnNumber, setPlayingState]);

  const handleRandomHymn = () => {
    setHasAutoStarted(true);
    const randomNum = Math.floor(Math.random() * TOTAL_HYMNS_COUNT) + 1;
    setActiveHymnNumber(randomNum);
    setPlayingState(true);
  };

  const handleJumpFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = jumpInput.replace(/[^0-9]/g, '');
    if (!cleaned) return;
    const num = Number(cleaned);
    if (Number.isFinite(num) && num >= 1) {
      setHasAutoStarted(true);
      setActiveHymnNumber(num);
      setPlayingState(true);
      setJumpInput('');
    }
  };

  // Sync play/pause & track changes with the <audio> element
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setPlayingState(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [activeHymnNumber, currentTrack.mp3Url, isPlaying, setPlayingState]);

  // Start sung MP3 playback automatically on the user's first click anywhere on the page
  useEffect(() => {
    if (hasAutoStarted) return;

    const handleFirstInteraction = () => {
      if (!hasAutoStarted) {
        setHasAutoStarted(true);
        playCurrentAudio();
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
    };
  }, [hasAutoStarted, playCurrentAudio]);

  // Allow the user to upload their local MP3 files to replace tracks
  const handleUploadMp3Files = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploadStatus('Guardando MP3 con voz...');
    const filesArray: File[] = Array.from(fileList);
    const nextOverrides = { ...customOverrides };

    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      const targetNum =
        filesArray.length === 1
          ? activeHymnNumber
          : Math.min(TOTAL_HYMNS_COUNT, activeHymnNumber + i);
      const targetHymn = getHymnByNumber(targetNum);

      try {
        const arrayBuf = await file.arrayBuffer();
        const res = await fetch(
          `/api/mp3-upload/${encodeURIComponent(targetHymn.filename)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': file.type || 'audio/mpeg',
            },
            body: arrayBuf,
          }
        );
        if (res.ok) {
          const data = await res.json();
          const cleanFileName = file.name.replace(/\.[^/.]+$/, '');
          nextOverrides[targetNum] = {
            title: cleanFileName || targetHymn.title,
            mp3Url: data.url || `/mp3/${targetHymn.filename}?t=${Date.now()}`,
          };
        }
      } catch {
        const localBlobUrl = URL.createObjectURL(file);
        const cleanFileName = file.name.replace(/\.[^/.]+$/, '');
        nextOverrides[targetNum] = {
          title: cleanFileName || targetHymn.title,
          mp3Url: localBlobUrl,
        };
      }
    }

    setCustomOverrides(nextOverrides);
    setUploadStatus('¡MP3 con voz actualizados!');
    setPlayingState(true);
    window.setTimeout(() => setUploadStatus(''), 3500);
    e.target.value = '';
  };

  return (
    <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start">
      {/* Native HTML5 Sung MP3 Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.mp3Url}
        preload="auto"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || 0);
          }
        }}
        onEnded={handleNextTrack}
      />

      {/* Expanded Sung MP3 Playlist & Controls Panel */}
      {isExpanded && (
        <div className="mb-3 w-80 sm:w-96 bg-slate-950/95 backdrop-blur-md text-white border border-blue-800/80 rounded-xl shadow-2xl p-4 space-y-3.5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">
                  Himnos Cantados con Voz (MP3)
                </p>
                <p className="text-[11px] text-blue-400">
                  224.344.224 Himnos Disponibles · Reproducción Continua
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Minimizar
            </button>
          </div>

          {/* Direct Jump to Any Hymn (1 - 224,344,224) */}
          <form
            onSubmit={handleJumpFormSubmit}
            className="flex items-center gap-1.5"
          >
            <div className="relative flex-1">
              <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                inputMode="numeric"
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                placeholder="Ir al himno # (1 - 224344224)"
                className="w-full pl-7 pr-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
            >
              Ir
            </button>
            <button
              type="button"
              onClick={handleRandomHymn}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-blue-400 rounded-lg transition-colors shrink-0"
              title="Himno aleatorio entre los 224.344.224 himnos"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Now Playing Card */}
          <div className="p-3 bg-slate-900/95 border border-blue-900/60 rounded-lg space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-blue-400 font-semibold truncate">
                HIMNO #{currentTrack.formattedNumber} / 224.344.224
              </span>
              <span className="font-mono text-[11px] text-slate-400 tabular-nums shrink-0">
                {formatSeconds(currentTime)} / {formatSeconds(duration)}
              </span>
            </div>

            <div>
              <p className="text-sm font-serif font-semibold text-white truncate">
                {currentTrack.title}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {currentTrack.subtitle}
              </p>
            </div>

            {/* Progress Seek Bar */}
            <input
              type="range"
              min={0}
              max={duration > 0 ? duration : 100}
              step={1}
              value={currentTime}
              onChange={(e) => {
                const newTime = Number(e.target.value);
                setCurrentTime(newTime);
                if (audioRef.current) {
                  audioRef.current.currentTime = newTime;
                }
              }}
              aria-label="Progreso del himno cantado MP3"
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />

            {/* Transport Controls: Prev / Play-Pause / Next */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={handlePrevTrack}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                title="Himno anterior"
              >
                <SkipBack className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 shrink-0" />
                    <span>Pausar Voz</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                    <span>Escuchar con Voz</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleNextTrack}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                title="Siguiente himno"
              >
                <span>Siguiente</span>
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Nearby Hymns Window from the 224,344,224 Catalog */}
          <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
            {nearbyHymns.map((track) => {
              const isSelected = track.hymnNumber === activeHymnNumber;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => {
                    setHasAutoStarted(true);
                    setActiveHymnNumber(track.hymnNumber);
                    setPlayingState(true);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-colors flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-blue-950/85 border-blue-500 text-white'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">
                      <span className="font-mono text-blue-400 mr-1.5">
                        #{track.formattedNumber}
                      </span>
                      {track.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {track.category} · {track.musicalKey}
                    </p>
                  </div>
                  {isSelected && isPlaying && (
                    <span className="flex items-end gap-0.5 h-3 shrink-0">
                      <span className="w-0.5 h-2 bg-blue-400 animate-pulse" />
                      <span className="w-0.5 h-3 bg-blue-400 animate-pulse" />
                      <span className="w-0.5 h-1.5 bg-blue-400 animate-pulse" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Volume & Optional Custom MP3 File Loader */}
          <div className="pt-2 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMuted((prev) => !prev)}
                className="p-1.5 text-slate-300 hover:text-white rounded bg-slate-900 border border-slate-800"
                aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-blue-400" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setIsMuted(false);
                  setVolume(Number(e.target.value));
                }}
                aria-label="Volumen del reproductor MP3"
                className="flex-1 accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <span className="font-mono text-[11px] text-slate-400 w-9 text-right tabular-nums">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <a
                href="#himnario"
                onClick={() => setIsExpanded(false)}
                className="w-full py-1.5 px-3 bg-blue-950/80 hover:bg-blue-900/80 text-blue-200 border border-blue-800 rounded-lg text-[11px] font-semibold text-center transition-colors"
              >
                Abrir Himnario Completo (224.344.224 Himnos)
              </a>

              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                multiple
                onChange={handleUploadMp3Files}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-lg text-[11px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                {uploadStatus ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-emerald-400">{uploadStatus}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Subir tus propios archivos MP3 desde tu equipo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compact Floating MP3 Control Bar */}
      <div className="flex items-center gap-1.5 bg-slate-950/95 backdrop-blur-md text-white p-1.5 rounded-full shadow-lg border border-blue-800/80">
        <button
          type="button"
          onClick={togglePlay}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
            isPlaying
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-200'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 shrink-0" />
              <span className="max-w-44 truncate">
                #{currentTrack.formattedNumber} · {currentTrack.title}
              </span>
              <span className="flex items-end gap-0.5 h-3 ml-0.5 shrink-0">
                <span className="w-0.5 h-2 bg-white animate-pulse" />
                <span className="w-0.5 h-3 bg-white animate-pulse" />
                <span className="w-0.5 h-1.5 bg-white animate-pulse" />
              </span>
            </>
          ) : (
            <>
              <Music className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>224.344.224 Himnos MP3</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleNextTrack}
          className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-slate-900 transition-colors"
          aria-label="Siguiente himno cantado MP3"
          title="Siguiente himno cantado MP3"
        >
          <SkipForward className="w-3.5 h-3.5 text-blue-400" />
        </button>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-slate-900 transition-colors"
          aria-label="Ver catálogo de 224.344.224 himnos cantados MP3"
          title="Ver catálogo de 224.344.224 himnos cantados MP3"
        >
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
        </button>
      </div>
    </div>
  );
};
