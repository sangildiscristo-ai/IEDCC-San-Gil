/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  MicOff,
  Shuffle,
  Hash,
  Sparkles,
} from 'lucide-react';
import {
  TOTAL_HYMNS_COUNT,
  HymnItem,
  getHymnByNumber,
} from '../data/hymnsCatalogData';
import {
  hymnVoiceEngine,
  HymnVoiceSection,
} from '../utils/voiceSynthesis';

export type VoiceMode = 'both' | 'voice-only' | 'music-only';

export interface AmbientMusicPlayerProps {
  currentHymnNumber?: number;
  isPlaying?: boolean;
  onHymnNumberChange?: (hymnNumber: number) => void;
  onPlayingChange?: (playing: boolean) => void;
  isVoiceActive?: boolean;
  onVoiceActiveChange?: (active: boolean) => void;
  currentVoicedSection?: string | null;
  onVoicedSectionChange?: (section: string | null) => void;
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
  isVoiceActive: controlledIsVoiceActive,
  onVoiceActiveChange,
  onVoicedSectionChange,
}) => {
  const [internalHymnNumber, setInternalHymnNumber] = useState<number>(1);
  const [internalIsPlaying, setInternalIsPlaying] = useState<boolean>(false);
  const [internalVoiceActive, setInternalVoiceActive] = useState<boolean>(true); // Voice ON by default
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('both');
  const [voiceVolume, setVoiceVolume] = useState<number>(1.0);
  const [musicVolume, setMusicVolume] = useState<number>(0.45); // Balance music below voice
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentSectionLabel, setCurrentSectionLabel] = useState<string>('Voz Lista');
  const [activeVoicedSection, setActiveVoicedSection] = useState<HymnVoiceSection | null>(null);

  const [customOverrides, setCustomOverrides] = useState<
    Record<number, { title: string; mp3Url: string }>
  >({});
  const [jumpInput, setJumpInput] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hasAutoStarted, setHasAutoStarted] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [voiceRate, setVoiceRate] = useState<number>(0.94);
  const [hasStudioAudio, setHasStudioAudio] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const studioVoiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeHymnNumber =
    typeof controlledHymnNumber === 'number'
      ? controlledHymnNumber
      : internalHymnNumber;

  const isPlaying =
    typeof controlledIsPlaying === 'boolean'
      ? controlledIsPlaying
      : internalIsPlaying;

  const isVoiceActive =
    typeof controlledIsVoiceActive === 'boolean'
      ? controlledIsVoiceActive
      : internalVoiceActive;

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

  const setVoiceActiveState = useCallback(
    (nextActive: boolean) => {
      setInternalVoiceActive(nextActive);
      onVoiceActiveChange?.(nextActive);
      if (!nextActive) {
        hymnVoiceEngine.stop();
        if (studioVoiceAudioRef.current) {
          studioVoiceAudioRef.current.pause();
        }
        setActiveVoicedSection(null);
        onVoicedSectionChange?.(null);
        setCurrentSectionLabel('Voz desactivada');
      }
    },
    [onVoiceActiveChange, onVoicedSectionChange]
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

  // Load available Spanish voices from browser
  useEffect(() => {
    const updateVoices = () => {
      const voices = hymnVoiceEngine.getAvailableSpanishVoices();
      setAvailableVoices(voices);
      const pref = hymnVoiceEngine.getPreferredSpanishVoice();
      if (pref && !selectedVoiceURI) {
        setSelectedVoiceURI(pref.voiceURI);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [selectedVoiceURI]);

  // Sync voice settings changes
  useEffect(() => {
    hymnVoiceEngine.updateSettings({
      rate: voiceRate,
      volume: isMuted ? 0 : voiceVolume,
      voiceURI: selectedVoiceURI || undefined,
    });
  }, [voiceRate, voiceVolume, isMuted, selectedVoiceURI]);

  // Check if studio voice file is available on server
  useEffect(() => {
    let isSubscribed = true;
    async function checkStudioVoice() {
      try {
        const res = await fetch(`/api/hymn-voice/${activeHymnNumber}`, {
          method: 'HEAD',
        });
        if (isSubscribed) {
          setHasStudioAudio(res.ok);
        }
      } catch {
        if (isSubscribed) {
          setHasStudioAudio(false);
        }
      }
    }
    checkStudioVoice();
    return () => {
      isSubscribed = false;
    };
  }, [activeHymnNumber]);

  // Sync background music volume
  useEffect(() => {
    if (audioRef.current) {
      const effectiveMusicVolume =
        isMuted || voiceMode === 'voice-only' ? 0 : musicVolume;
      audioRef.current.volume = effectiveMusicVolume;
      audioRef.current.muted = isMuted || voiceMode === 'voice-only';
    }
  }, [musicVolume, isMuted, voiceMode]);

  // Sync studio audio voice volume
  useEffect(() => {
    if (studioVoiceAudioRef.current) {
      const effectiveVoiceVol =
        isMuted || voiceMode === 'music-only' || !isVoiceActive ? 0 : voiceVolume;
      studioVoiceAudioRef.current.volume = effectiveVoiceVol;
      studioVoiceAudioRef.current.muted = isMuted || !isVoiceActive;
    }
  }, [voiceVolume, isMuted, voiceMode, isVoiceActive]);

  // Start voice recitation for current hymn
  const startVoiceForCurrentHymn = useCallback(() => {
    if (!isVoiceActive || voiceMode === 'music-only') {
      return;
    }

    // If studio AI voice is available on server, play it via studioVoiceAudioRef
    if (hasStudioAudio && studioVoiceAudioRef.current) {
      hymnVoiceEngine.stop();
      studioVoiceAudioRef.current.currentTime = 0;
      studioVoiceAudioRef.current
        .play()
        .then(() => {
          setCurrentSectionLabel('Voz de Estudio con IA Activa');
          setActiveVoicedSection('intro');
          onVoicedSectionChange?.('intro');
        })
        .catch(() => {
          // Fall back to Web Speech synthesis
          startWebSpeech();
        });
      return;
    }

    startWebSpeech();

    function startWebSpeech() {
      setCurrentSectionLabel('Iniciando voz devocional...');
      hymnVoiceEngine.speakFullHymn(currentTrack, {
        onSectionStart: (section, label) => {
          setActiveVoicedSection(section);
          setCurrentSectionLabel(label);
          onVoicedSectionChange?.(section);
        },
        onEnd: () => {
          setActiveVoicedSection('complete');
          setCurrentSectionLabel('Himno completado');
          onVoicedSectionChange?.('complete');
        },
        onError: () => {
          setCurrentSectionLabel('Voz lista');
        },
      });
    }
  }, [isVoiceActive, voiceMode, hasStudioAudio, currentTrack, onVoicedSectionChange]);

  // Play / Pause handling
  const playAll = useCallback(async () => {
    try {
      // 1. Play background music
      if (audioRef.current && voiceMode !== 'voice-only') {
        audioRef.current.volume = isMuted ? 0 : musicVolume;
        await audioRef.current.play();
      }
      setPlayingState(true);

      // 2. Play vocal voice
      if (isVoiceActive && voiceMode !== 'music-only') {
        if (hymnVoiceEngine.isPausedState()) {
          hymnVoiceEngine.resume();
        } else if (!hymnVoiceEngine.isActive()) {
          startVoiceForCurrentHymn();
        }
      }
    } catch {
      setPlayingState(false);
    }
  }, [voiceMode, isMuted, musicVolume, setPlayingState, isVoiceActive, startVoiceForCurrentHymn]);

  const pauseAll = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (studioVoiceAudioRef.current) {
      studioVoiceAudioRef.current.pause();
    }
    if (hymnVoiceEngine.isActive()) {
      hymnVoiceEngine.pause();
    }
    setPlayingState(false);
  }, [setPlayingState]);

  const togglePlay = () => {
    setHasAutoStarted(true);
    if (isPlaying) {
      pauseAll();
    } else {
      playAll();
    }
  };

  const handleNextTrack = useCallback(() => {
    hymnVoiceEngine.stop();
    if (studioVoiceAudioRef.current) {
      studioVoiceAudioRef.current.pause();
    }
    const nextNum =
      activeHymnNumber < TOTAL_HYMNS_COUNT ? activeHymnNumber + 1 : 1;
    setActiveHymnNumber(nextNum);
    setPlayingState(true);
  }, [activeHymnNumber, setActiveHymnNumber, setPlayingState]);

  const handlePrevTrack = useCallback(() => {
    hymnVoiceEngine.stop();
    if (studioVoiceAudioRef.current) {
      studioVoiceAudioRef.current.pause();
    }
    const prevNum =
      activeHymnNumber > 1 ? activeHymnNumber - 1 : TOTAL_HYMNS_COUNT;
    setActiveHymnNumber(prevNum);
    setPlayingState(true);
  }, [activeHymnNumber, setActiveHymnNumber, setPlayingState]);

  const handleRandomHymn = () => {
    setHasAutoStarted(true);
    hymnVoiceEngine.stop();
    if (studioVoiceAudioRef.current) {
      studioVoiceAudioRef.current.pause();
    }
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
      hymnVoiceEngine.stop();
      if (studioVoiceAudioRef.current) {
        studioVoiceAudioRef.current.pause();
      }
      setActiveHymnNumber(num);
      setPlayingState(true);
      setJumpInput('');
    }
  };

  // Sync track changes & play/pause state
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      if (voiceMode !== 'voice-only') {
        audioRef.current.play().catch(() => {});
      }
      if (isVoiceActive && voiceMode !== 'music-only') {
        startVoiceForCurrentHymn();
      }
    } else {
      audioRef.current.pause();
      if (studioVoiceAudioRef.current) {
        studioVoiceAudioRef.current.pause();
      }
      hymnVoiceEngine.pause();
    }
  }, [activeHymnNumber, currentTrack.mp3Url, isPlaying, voiceMode, isVoiceActive, startVoiceForCurrentHymn]);

  // First interaction auto-start
  useEffect(() => {
    if (hasAutoStarted) return;
    const handleFirstInteraction = () => {
      if (!hasAutoStarted) {
        setHasAutoStarted(true);
        playAll();
      }
    };
    window.addEventListener('click', handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
    };
  }, [hasAutoStarted, playAll]);

  // Clean up voice on unmount
  useEffect(() => {
    return () => {
      hymnVoiceEngine.stop();
    };
  }, []);

  // Upload custom MP3 / voice file
  const handleUploadMp3Files = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Quick 10 nearby hymns window
  const nearbyHymns: HymnItem[] = useMemo(() => {
    const start = Math.max(
      1,
      Math.min(TOTAL_HYMNS_COUNT - 9, activeHymnNumber - 2)
    );
    const items: HymnItem[] = [];
    for (let i = 0; i < 10; i++) {
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

  return (
    <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start font-sans">
      {/* Background Melody Audio Element */}
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

      {/* Studio Vocal Audio Element (when available from server) */}
      <audio
        ref={studioVoiceAudioRef}
        src={`/api/hymn-voice/${activeHymnNumber}`}
        preload="none"
        onEnded={() => {
          setActiveVoicedSection('complete');
          setCurrentSectionLabel('Voz completada');
          onVoicedSectionChange?.('complete');
        }}
      />

      {/* Expanded Sung MP3 Playlist & Voice Mixer Panel */}
      {isExpanded && (
        <div className="mb-3 w-80 sm:w-96 bg-slate-950/98 backdrop-blur-md text-white border border-blue-700/80 rounded-2xl shadow-2xl p-4 sm:p-5 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-600/30 border border-blue-500 rounded-lg">
                <Mic className="w-4 h-4 text-blue-400 shrink-0" />
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Himnos con Voz en Español</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded">
                    Voz Activa
                  </span>
                </p>
                <p className="text-[11px] text-blue-300">
                  224.344.224 Canciones con Voz y Música
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

          {/* Voice Engine Mode Switcher: Both | Voice Only | Music Only */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-400" />
                Modo de Reproducción de Voz
              </span>
              <button
                type="button"
                onClick={() => setVoiceActiveState(!isVoiceActive)}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                  isVoiceActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isVoiceActive ? 'Voz: SÍ' : 'Voz: NO'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => {
                  setVoiceMode('both');
                  if (!isVoiceActive) setVoiceActiveState(true);
                }}
                className={`py-1.5 px-2 rounded-lg text-center font-medium transition-all ${
                  voiceMode === 'both' && isVoiceActive
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Voz + Música
              </button>
              <button
                type="button"
                onClick={() => {
                  setVoiceMode('voice-only');
                  if (!isVoiceActive) setVoiceActiveState(true);
                }}
                className={`py-1.5 px-2 rounded-lg text-center font-medium transition-all ${
                  voiceMode === 'voice-only' && isVoiceActive
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Solo Voz
              </button>
              <button
                type="button"
                onClick={() => {
                  setVoiceMode('music-only');
                  setVoiceActiveState(false);
                }}
                className={`py-1.5 px-2 rounded-lg text-center font-medium transition-all ${
                  voiceMode === 'music-only' || !isVoiceActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Solo Música
              </button>
            </div>
          </div>

          {/* Now Playing Vocal Monitor */}
          <div className="p-3.5 bg-slate-900/90 border border-blue-900/70 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-blue-400 font-semibold truncate">
                HIMNO #{currentTrack.formattedNumber} / 224.344.224
              </span>
              <span className="font-mono text-[11px] text-slate-400 tabular-nums shrink-0">
                {formatSeconds(currentTime)} / {formatSeconds(duration)}
              </span>
            </div>

            <div>
              <p className="text-sm font-serif font-bold text-white truncate">
                {currentTrack.title}
              </p>
              <p className="text-[11px] text-slate-300 truncate">
                {currentTrack.subtitle}
              </p>
            </div>

            {/* Vocal Realtime Section Status Banner */}
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-blue-950/70 border border-blue-800/80 rounded-lg text-[11px]">
              <span className="text-blue-300 font-medium flex items-center gap-1.5 truncate">
                {isVoiceActive ? (
                  <Mic className="w-3.5 h-3.5 text-blue-400 animate-pulse shrink-0" />
                ) : (
                  <MicOff className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                )}
                <span className="truncate">
                  {isVoiceActive ? currentSectionLabel : 'Voz pausada'}
                </span>
              </span>
              <span className="font-mono text-[10px] text-blue-400 uppercase shrink-0">
                {hasStudioAudio ? 'Voz Estudio IA' : 'Voz Natural'}
              </span>
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
              aria-label="Progreso del himno cantado con voz"
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
                className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors shadow-md"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 shrink-0" />
                    <span>Pausar Himno</span>
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
                onClick={handleNextTrack}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                title="Siguiente himno"
              >
                <span>Siguiente</span>
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dual Volume Controls: Voice Volume & Background Music Volume */}
          <div className="space-y-2.5 p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
            {/* Slider 1: Voice Volume */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-blue-400" />
                  Volumen de la Voz:
                </span>
                <span className="font-mono text-blue-400 tabular-nums">
                  {Math.round(voiceVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={voiceVolume}
                onChange={(e) => setVoiceVolume(Number(e.target.value))}
                aria-label="Volumen de la voz"
                className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Slider 2: Background Music Volume */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-slate-400" />
                  Música de Acompañamiento:
                </span>
                <span className="font-mono text-slate-400 tabular-nums">
                  {Math.round(musicVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={musicVolume}
                onChange={(e) => setMusicVolume(Number(e.target.value))}
                aria-label="Volumen del acompañamiento musical"
                className="w-full accent-slate-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Voice Tone / Speed Selector */}
            <div className="pt-1.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Cadencia de la Voz:</span>
              <div className="flex items-center gap-1">
                {[
                  { label: 'Solemne', rate: 0.88 },
                  { label: 'Normal', rate: 0.95 },
                  { label: 'Fluida', rate: 1.05 },
                ].map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setVoiceRate(s.rate)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                      Math.abs(voiceRate - s.rate) < 0.05
                        ? 'bg-blue-700 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Spanish Voice Selector (if multiple available on device) */}
            {availableVoices.length > 1 && (
              <div className="pt-1">
                <label className="block text-[10px] text-slate-400 mb-1">
                  Voz en Español del Dispositivo:
                </label>
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => setSelectedVoiceURI(e.target.value)}
                  className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-[11px] text-white focus:outline-none focus:border-blue-500"
                >
                  {availableVoices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Jump directly to any hymn #1 - 224,344,224 with voice */}
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
              Cantar
            </button>
            <button
              type="button"
              onClick={handleRandomHymn}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-blue-400 rounded-lg transition-colors shrink-0"
              title="Himno aleatorio"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Nearby Hymns List */}
          <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
            <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider px-1">
              Canciones cercanas con voz:
            </p>
            {nearbyHymns.map((track) => {
              const isSelected = track.hymnNumber === activeHymnNumber;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => {
                    setHasAutoStarted(true);
                    hymnVoiceEngine.stop();
                    if (studioVoiceAudioRef.current) {
                      studioVoiceAudioRef.current.pause();
                    }
                    setActiveHymnNumber(track.hymnNumber);
                    setPlayingState(true);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg border text-xs transition-colors flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-blue-950/90 border-blue-500 text-white'
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

          {/* Bottom Actions */}
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5">
            <a
              href="#himnario"
              onClick={() => setIsExpanded(false)}
              className="w-full py-1.5 px-3 bg-blue-950/80 hover:bg-blue-900/80 text-blue-200 border border-blue-800 rounded-lg text-[11px] font-semibold text-center transition-colors"
            >
              Ver Letra Completa en el Himnario (224.344.224 Himnos)
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
                  <span>Subir tus propias grabaciones de voz o MP3</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Compact Floating Audio & Voice Dock */}
      <div className="flex items-center gap-1.5 bg-slate-950/98 backdrop-blur-md text-white p-1.5 rounded-full shadow-2xl border border-blue-700/80">
        {/* Play / Pause Toggle Button */}
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
              <span className="max-w-36 sm:max-w-48 truncate">
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
              <Mic className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Cantar #{currentTrack.formattedNumber} con Voz</span>
            </>
          )}
        </button>

        {/* Quick Voice Toggle Pill */}
        <button
          type="button"
          onClick={() => setVoiceActiveState(!isVoiceActive)}
          className={`p-2 rounded-full transition-colors ${
            isVoiceActive
              ? 'bg-blue-900/80 text-blue-300 hover:bg-blue-800'
              : 'bg-slate-900 text-slate-500 hover:text-white'
          }`}
          title={isVoiceActive ? 'Voz del himno activa (clic para silenciar voz)' : 'Activar voz del himno'}
          aria-label={isVoiceActive ? 'Silenciar voz del himno' : 'Activar voz del himno'}
        >
          {isVoiceActive ? (
            <Mic className="w-3.5 h-3.5 text-blue-400" />
          ) : (
            <MicOff className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Skip Forward Button */}
        <button
          type="button"
          onClick={handleNextTrack}
          className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-slate-900 transition-colors"
          aria-label="Siguiente himno cantado con voz"
          title="Siguiente himno cantado con voz"
        >
          <SkipForward className="w-3.5 h-3.5 text-blue-400" />
        </button>

        {/* Sliders / Details Expander */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-slate-900 transition-colors"
          aria-label="Ajustar voz, volumen y catálogo de himnos"
          title="Ajustar voz, volumen y catálogo de himnos"
        >
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
        </button>
      </div>
    </div>
  );
};
