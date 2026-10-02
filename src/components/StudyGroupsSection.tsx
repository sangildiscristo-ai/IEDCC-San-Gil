import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Plus,
  BookOpen,
  MessageSquare,
  CheckSquare,
  Square,
  Send,
  UserPlus,
  MessageCircle,
  X,
  Trash2,
  Wifi,
} from 'lucide-react';
import { buildWhatsAppUrl } from '../data/churchData';
import { MemberProfile } from './JoinCommunityModal';

export interface StudyGroupPost {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  scriptureRef?: string;
  createdAt: string;
  timestamp?: number;
}

export interface StudyLessonItem {
  id: string;
  title: string;
  scripture: string;
  completed: boolean;
}

export interface StudyGroupMember {
  name: string;
  joinedAt: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  category:
    | 'Varones'
    | 'Damas'
    | 'Discipulado'
    | 'Dominical'
    | 'Jóvenes y Familia';
  bookFocus: string;
  schedule: string;
  modality: 'Presencial (Villa Olímpica)' | 'Virtual / Mixto';
  leaderName: string;
  leaderPhone: string;
  description: string;
  members: StudyGroupMember[];
  lessons: StudyLessonItem[];
  posts: StudyGroupPost[];
  createdAt: string;
}

interface StudyGroupsSectionProps {
  defaultUserName: string;
  pendingSharedVerse: { reference: string; text: string } | null;
  onClearSharedVerse: () => void;
  totalRegisteredMembers: number;
  onUpdateRegisteredMembers: (
    total: number,
    list?: MemberProfile[]
  ) => void;
  onOpenJoinModal: () => void;
}

const FALLBACK_INITIAL_GROUPS: StudyGroup[] = [
  {
    id: 'grupo-varones-miercoles',
    name: 'Fraternidad y Estudio Bíblico de Varones',
    category: 'Varones',
    bookFocus: '1 Corintios y Epístolas Pastorales',
    schedule: 'Miércoles · 07:00 PM',
    modality: 'Presencial (Villa Olímpica)',
    leaderName: 'Ministerio de Varones IEDCC San Gil',
    leaderPhone: '3123480660',
    description:
      'Grupo oficial de estudio bíblico de los miércoles a las 7:00 PM en Cra 20 # 13A - 23 Villa Olímpica para fortalecer el liderazgo cristiano, la fe en el hogar y el estudio de la Palabra.',
    members: [],
    lessons: [
      {
        id: 'les-v1',
        title: 'Firmes en la Fe y el Amor Fraternal',
        scripture: '1 Corintios 16:13-14',
        completed: false,
      },
      {
        id: 'les-v2',
        title: 'El Obrero Aprobado que Usa Bien la Palabra',
        scripture: '2 Timoteo 2:15',
        completed: false,
      },
    ],
    posts: [],
    createdAt: '2026',
  },
];

export const StudyGroupsSection: React.FC<StudyGroupsSectionProps> = ({
  defaultUserName,
  pendingSharedVerse,
  onClearSharedVerse,
  totalRegisteredMembers,
  onUpdateRegisteredMembers,
  onOpenJoinModal,
}) => {
  const [groups, setGroups] = useState<StudyGroup[]>(FALLBACK_INITIAL_GROUPS);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    'grupo-varones-miercoles'
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('Todos');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Real-time WebSocket & Presence State
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const myClientIdRef = useRef<string>('');
  const typingTimeoutRef = useRef<number | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Active group interaction state
  const [participantName, setParticipantName] = useState<string>(
    defaultUserName || ''
  );
  const [postContent, setPostContent] = useState<string>('');
  const [postScriptureRef, setPostScriptureRef] = useState<string>('');
  const [newLessonTitle, setNewLessonTitle] = useState<string>('');
  const [newLessonScripture, setNewLessonScripture] = useState<string>('');
  const [showAddLessonForm, setShowAddLessonForm] = useState<boolean>(false);
  const [feedbackBanner, setFeedbackBanner] = useState<string>('');

  // Create New Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] =
    useState<StudyGroup['category']>('Discipulado');
  const [newGroupBook, setNewGroupBook] = useState('');
  const [newGroupSchedule, setNewGroupSchedule] = useState('');
  const [newGroupModality, setNewGroupModality] =
    useState<StudyGroup['modality']>('Presencial (Villa Olímpica)');
  const [newGroupLeader, setNewGroupLeader] = useState(defaultUserName || '');
  const [newGroupPhone, setNewGroupPhone] = useState('3123480660');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupLessonTitle, setNewGroupLessonTitle] = useState('');
  const [createGroupError, setCreateGroupError] = useState('');

  useEffect(() => {
    if (defaultUserName && !participantName) {
      setParticipantName(defaultUserName);
      setNewGroupLeader(defaultUserName);
    }
  }, [defaultUserName, participantName]);

  // If user clicked "Llevar a Grupo de Estudio" in the Bible Reader
  useEffect(() => {
    if (pendingSharedVerse) {
      setPostScriptureRef(pendingSharedVerse.reference);
      setPostContent(
        `Comparto este versículo para nuestro estudio: “${pendingSharedVerse.text}”`
      );
      setFeedbackBanner(
        `Versículo listo en el chat: ${pendingSharedVerse.reference}. Escribe tu nombre y pulsa Enviar.`
      );
      onClearSharedVerse();
    }
  }, [pendingSharedVerse, onClearSharedVerse]);

  // Connect to Real WebSocket Server (/ws) + Initial HTTP Sync
  useEffect(() => {
    let isMounted = true;
    let reconnectTimer: number | null = null;

    async function loadInitialRest() {
      try {
        const res = await fetch('/api/groups');
        if (res.ok) {
          const data = await res.json();
          if (!isMounted) return;
          if (Array.isArray(data.groups) && data.groups.length > 0) {
            setGroups(data.groups);
          }
          if (typeof data.totalRegisteredMembers === 'number') {
            onUpdateRegisteredMembers(
              data.totalRegisteredMembers,
              data.registeredMembers
            );
          }
          if (typeof data.onlineCount === 'number') {
            setOnlineCount(data.onlineCount);
          }
        }
      } catch {
        // Keep current state
      }
    }

    function connectWebSocket() {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        const socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          if (!isMounted) return;
          setWsConnected(true);
          if (participantName.trim()) {
            socket.send(
              JSON.stringify({
                type: 'presence:identify',
                userName: participantName.trim(),
                activeGroupId: selectedGroupId,
              })
            );
          }
        };

        socket.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            if (data.clientId && data.type === 'init') {
              myClientIdRef.current = data.clientId;
            }
            if (Array.isArray(data.groups)) {
              setGroups(data.groups);
            }
            if (typeof data.totalRegisteredMembers === 'number') {
              onUpdateRegisteredMembers(
                data.totalRegisteredMembers,
                data.registeredMembers
              );
            }
            if (typeof data.onlineCount === 'number') {
              setOnlineCount(data.onlineCount);
            }
            if (
              data.type === 'chat:typing' &&
              data.groupId === selectedGroupId &&
              data.clientId !== myClientIdRef.current
            ) {
              if (data.isTyping) {
                setTypingUser(data.userName);
                if (typingTimeoutRef.current) {
                  window.clearTimeout(typingTimeoutRef.current);
                }
                typingTimeoutRef.current = window.setTimeout(() => {
                  setTypingUser(null);
                }, 3000);
              } else {
                setTypingUser(null);
              }
            }
          } catch {
            // Ignore malformed message
          }
        };

        socket.onclose = () => {
          if (!isMounted) return;
          setWsConnected(false);
          reconnectTimer = window.setTimeout(connectWebSocket, 3000);
        };
      } catch {
        setWsConnected(false);
      }
    }

    loadInitialRest();
    connectWebSocket();

    return () => {
      isMounted = false;
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      if (typingTimeoutRef.current)
        window.clearTimeout(typingTimeoutRef.current);
      wsRef.current?.close();
    };
  }, []);

  // Notify server when user changes active group or name
  useEffect(() => {
    if (
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN &&
      participantName.trim()
    ) {
      wsRef.current.send(
        JSON.stringify({
          type: 'presence:identify',
          userName: participantName.trim(),
          activeGroupId: selectedGroupId,
        })
      );
    }
  }, [selectedGroupId, participantName]);

  const filteredGroups = groups.filter((g) =>
    categoryFilter === 'Todos' ? true : g.category === categoryFilter
  );

  const activeGroup =
    groups.find((g) => g.id === selectedGroupId) ||
    filteredGroups[0] ||
    groups[0];

  // Auto-scroll chat box when new messages arrive in the active group
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeGroup?.posts.length]);

  const totalGroupParticipants = groups.reduce(
    (acc, g) => acc + g.members.length,
    0
  );

  const handleJoinGroup = async () => {
    if (!participantName.trim() || participantName.trim().length < 2) {
      setFeedbackBanner(
        'Por favor escribe tu nombre real en la casilla de participante para registrarte en este grupo.'
      );
      return;
    }

    try {
      const res = await fetch(`/api/groups/${activeGroup.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberName: participantName.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.groups)) {
          setGroups(data.groups);
        }
        setFeedbackBanner(
          `¡Registrado! ${participantName.trim()} ahora forma parte de "${activeGroup.name}".`
        );
        setTimeout(() => setFeedbackBanner(''), 4000);
      }
    } catch {
      // Ignore network error
    }
  };

  const handleTypingChange = (val: string) => {
    setPostContent(val);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'chat:typing',
          groupId: activeGroup.id,
          userName: participantName.trim() || 'Un hermano',
          isTyping: val.trim().length > 0,
        })
      );
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantName.trim()) {
      setFeedbackBanner('Por favor escribe tu nombre antes de enviar al chat.');
      return;
    }
    if (!postContent.trim()) {
      setFeedbackBanner('Escribe tu mensaje, versículo o reflexión.');
      return;
    }

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const payload = {
      type: 'chat:message',
      messageId,
      groupId: activeGroup.id,
      authorName: participantName.trim(),
      content: postContent.trim(),
      scriptureRef: postScriptureRef.trim() || undefined,
    };

    // Send over WebSocket if connected, plus HTTP POST for guaranteed persistence
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
      wsRef.current.send(
        JSON.stringify({
          type: 'chat:typing',
          groupId: activeGroup.id,
          userName: participantName.trim(),
          isTyping: false,
        })
      );
      setPostContent('');
      setPostScriptureRef('');
      return;
    }

    try {
      const res = await fetch(`/api/groups/${activeGroup.id}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.groups)) {
          setGroups(data.groups);
        }
        setPostContent('');
        setPostScriptureRef('');
      }
    } catch {
      setFeedbackBanner('Error de conexión al enviar el mensaje.');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const res = await fetch(
        `/api/groups/${activeGroup.id}/posts/${postId}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.groups)) {
          setGroups(data.groups);
        }
      }
    } catch {
      // Ignore
    }
  };

  const handleToggleLesson = async (lessonId: string) => {
    try {
      const res = await fetch(
        `/api/groups/${activeGroup.id}/lessons/${lessonId}`,
        { method: 'PATCH' }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.groups)) {
          setGroups(data.groups);
        }
      }
    } catch {
      // Ignore
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) return;

    try {
      const res = await fetch(`/api/groups/${activeGroup.id}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newLessonTitle.trim(),
          scripture: newLessonScripture.trim() || activeGroup.bookFocus,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.groups)) {
          setGroups(data.groups);
        }
        setNewLessonTitle('');
        setNewLessonScripture('');
        setShowAddLessonForm(false);
      }
    } catch {
      // Ignore
    }
  };

  const handleCreateNewGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newGroupBook.trim() || !newGroupLeader.trim()) {
      setCreateGroupError(
        'Por favor completa el nombre del grupo, el libro o tema bíblico y el nombre del líder.'
      );
      return;
    }

    setCreateGroupError('');
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newGroupName.trim(),
          category: newGroupCategory,
          bookFocus: newGroupBook.trim(),
          schedule: newGroupSchedule.trim() || 'Horario por definir',
          modality: newGroupModality,
          leaderName: newGroupLeader.trim(),
          leaderPhone: newGroupPhone,
          description:
            newGroupDesc.trim() ||
            `Grupo de estudio bíblico enfocado en ${newGroupBook.trim()} en la Iglesia Discípulos de Cristo de San Gil.`,
          firstLessonTitle:
            newGroupLessonTitle.trim() ||
            `Introducción a ${newGroupBook.trim()}`,
          firstLessonScripture: newGroupBook.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.groups)) {
          setGroups(data.groups);
        }
        if (data.group?.id) {
          setSelectedGroupId(data.group.id);
        }
        setIsCreateModalOpen(false);
        setNewGroupName('');
        setNewGroupBook('');
        setNewGroupSchedule('');
        setNewGroupDesc('');
        setNewGroupLessonTitle('');
      }
    } catch {
      setCreateGroupError('No se pudo crear el grupo. Intenta nuevamente.');
    }
  };

  return (
    <section
      id="grupos-estudio"
      className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-900/60 text-slate-950 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header + Real Registration Metrics + Create Group CTA */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-blue-700 dark:text-blue-400 font-medium mb-3">
              <Wifi className="w-4 h-4 shrink-0" />
              <span>
                {wsConnected
                  ? 'Chat WebSocket en Tiempo Real Activo'
                  : 'Sincronizando con Servidor...'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">
                {onlineCount} {onlineCount === 1 ? 'conectado' : 'conectados'}{' '}
                ahora
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Grupos de Estudio Bíblico y Chat en Vivo
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Participa en el chat real en vivo de cada grupo de estudio o crea un grupo nuevo. Los contadores muestran únicamente el{' '}
              <strong className="text-slate-900 dark:text-white">
                número real de personas registradas
              </strong>{' '}
              en nuestro servidor sin datos simulados.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            <button
              type="button"
              onClick={onOpenJoinModal}
              className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 hover:border-blue-600 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
              <span>
                Registrados en la Web:{' '}
                <strong className="font-mono tabular-nums">
                  {totalRegisteredMembers}
                </strong>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-blue-700 hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Crear Nuevo Grupo de Estudio</span>
            </button>
          </div>
        </div>

        {/* Real-Time Server Registration Counters Banner */}
        <div className="my-6 p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div>
              <span className="text-slate-500 dark:text-slate-400">
                Miembros Registrados en la Web:{' '}
              </span>
              <span className="font-mono font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                {totalRegisteredMembers}
              </span>
            </div>
            <span
              aria-hidden="true"
              className="text-slate-300 dark:text-slate-700"
            >
              ·
            </span>
            <div>
              <span className="text-slate-500 dark:text-slate-400">
                Inscritos en Grupos de Estudio:{' '}
              </span>
              <span className="font-mono font-bold text-slate-950 dark:text-white tabular-nums">
                {totalGroupParticipants}
              </span>
            </div>
            <span
              aria-hidden="true"
              className="text-slate-300 dark:text-slate-700"
            >
              ·
            </span>
            <div>
              <span className="text-slate-500 dark:text-slate-400">
                Usuarios Conectados Ahora:{' '}
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {onlineCount}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenJoinModal}
            className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline"
          >
            Inscribirme en el Registro Oficial →
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="py-4 flex flex-wrap items-center justify-between gap-4">
          <div
            className="flex flex-wrap items-center gap-1 p-1.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800"
            role="tablist"
          >
            {[
              'Todos',
              'Varones',
              'Damas',
              'Discipulado',
              'Dominical',
              'Jóvenes y Familia',
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={categoryFilter === cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-slate-950 dark:bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {feedbackBanner && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200 text-xs sm:text-sm font-medium rounded-xl flex items-center justify-between gap-4">
            <span>{feedbackBanner}</span>
            <button
              type="button"
              onClick={() => setFeedbackBanner('')}
              className="text-xs underline shrink-0"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Main 2-Column Layout: Left Group Directory (4 cols) + Right Live Study Room & Real Chat (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: List of Study Groups */}
          <div className="lg:col-span-4 space-y-3">
            {filteredGroups.map((group) => {
              const isSelected = group.id === activeGroup.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`w-full text-left p-5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-950 text-white border-blue-600 shadow-md'
                      : 'bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-100 border-slate-200 dark:border-slate-800 hover:border-blue-600'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                    <span
                      className={
                        isSelected
                          ? 'text-blue-400 font-semibold'
                          : 'text-blue-700 dark:text-blue-400 font-semibold'
                      }
                    >
                      {group.category}
                    </span>
                    <span
                      className={`font-mono tabular-nums ${
                        isSelected
                          ? 'text-slate-300'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {group.members.length}{' '}
                      {group.members.length === 1
                        ? 'registrado'
                        : 'registrados'}{' '}
                      · {group.posts.length} msj
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-semibold leading-snug">
                    {group.name}
                  </h3>

                  <p
                    className={`text-xs mt-1.5 ${
                      isSelected
                        ? 'text-slate-300'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Estudio: <strong>{group.bookFocus}</strong>
                  </p>

                  <div
                    className={`mt-3 pt-2.5 border-t text-[11px] flex items-center justify-between ${
                      isSelected
                        ? 'border-slate-800 text-blue-300'
                        : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <span>{group.schedule}</span>
                    <span>Abrir Chat en Vivo →</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Study Group Room + Real WebSocket Chat */}
          {activeGroup && (
            <div className="lg:col-span-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              {/* Group Room Banner */}
              <div className="p-6 sm:p-8 bg-slate-950 text-white border-b border-blue-950">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-blue-400 font-medium">
                      <span>Ministerio: {activeGroup.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeGroup.schedule}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeGroup.modality}</span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white mt-1.5">
                      {activeGroup.name}
                    </h3>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-2xl">
                      {activeGroup.description}
                    </p>
                  </div>

                  <a
                    href={buildWhatsAppUrl(
                      activeGroup.leaderPhone,
                      `Hola, paz de Cristo. Quiero participar en el grupo de estudio "${activeGroup.name}" (${activeGroup.schedule}) de la Iglesia Discípulos de Cristo de San Gil.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 self-start"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>WhatsApp del Grupo</span>
                  </a>
                </div>

                {/* Real Group Registration Bar */}
                <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-slate-300">
                    <span>Registrados reales en este grupo: </span>
                    <strong className="font-mono text-white tabular-nums">
                      {activeGroup.members.length}
                    </strong>
                    <span className="mx-2">·</span>
                    <span>Enfoque Bíblico: </span>
                    <strong className="text-blue-300">
                      {activeGroup.bookFocus}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={participantName}
                      onChange={(e) => setParticipantName(e.target.value)}
                      placeholder="Tu nombre completo real..."
                      className="px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleJoinGroup}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-950 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span>Inscribirme al Grupo</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-8">
                {/* 1. REAL-TIME LIVE CHAT OF THE STUDY GROUP */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                      <h4 className="font-serif text-xl font-semibold text-slate-950 dark:text-white">
                        Chat en Vivo del Grupo de Estudio
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          wsConnected
                            ? 'bg-emerald-500 animate-pulse'
                            : 'bg-amber-500'
                        }`}
                      />
                      <span>
                        {wsConnected
                          ? `En línea (${onlineCount} conectados)`
                          : 'Reconectando...'}
                      </span>
                    </div>
                  </div>

                  {/* Live Chat Messages Window */}
                  <div className="bg-slate-100/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 h-80 overflow-y-auto flex flex-col space-y-3">
                    {activeGroup.posts.length === 0 ? (
                      <div className="m-auto text-center max-w-sm space-y-2 py-8">
                        <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto opacity-80" />
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          Sala de Chat Lista (0 mensajes)
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Este chat es 100% real y en tiempo real. Escribe tu nombre abajo y envía el primer mensaje, pregunta o versículo bíblico al grupo.
                        </p>
                      </div>
                    ) : (
                      activeGroup.posts.map((post) => {
                        const isMe =
                          participantName.trim().length > 0 &&
                          post.authorName.toLowerCase() ===
                            participantName.trim().toLowerCase();

                        return (
                          <div
                            key={post.id}
                            className={`flex flex-col max-w-[85%] sm:max-w-[75%] rounded-xl p-3.5 border ${
                              isMe
                                ? 'self-end bg-blue-700 text-white border-blue-600'
                                : 'self-start bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 text-[11px] mb-1">
                              <span
                                className={`font-semibold ${
                                  isMe
                                    ? 'text-blue-100'
                                    : 'text-blue-700 dark:text-blue-400'
                                }`}
                              >
                                {post.authorName} {isMe && '(Tú)'}
                              </span>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-mono ${
                                    isMe
                                      ? 'text-blue-200'
                                      : 'text-slate-400 dark:text-slate-500'
                                  }`}
                                >
                                  {post.createdAt}
                                </span>
                                {isMe && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeletePost(post.id)}
                                    className="text-blue-200 hover:text-white transition-colors"
                                    title="Eliminar mi mensaje"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {post.scriptureRef && (
                              <div
                                className={`text-xs font-mono font-semibold mb-1 ${
                                  isMe
                                    ? 'text-blue-200'
                                    : 'text-blue-700 dark:text-blue-400'
                                }`}
                              >
                                Cita: {post.scriptureRef}
                              </div>
                            )}

                            <p className="text-xs sm:text-sm leading-relaxed break-words">
                              {post.content}
                            </p>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Typing indicator */}
                  {typingUser && (
                    <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium animate-pulse">
                      {typingUser} está escribiendo en el chat...
                    </div>
                  )}

                  {/* Real-Time Chat Input Form */}
                  <form
                    onSubmit={handleCreatePost}
                    className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={participantName}
                        onChange={(e) => setParticipantName(e.target.value)}
                        placeholder="Tu nombre para chatear *"
                        className="px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white"
                      />
                      <input
                        type="text"
                        value={postScriptureRef}
                        onChange={(e) => setPostScriptureRef(e.target.value)}
                        placeholder="Cita bíblica opcional (Ej. Juan 3:16)"
                        className="px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        value={postContent}
                        onChange={(e) => handleTypingChange(e.target.value)}
                        placeholder="Escribe un mensaje en tiempo real para el grupo..."
                        className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white focus:outline-none focus:border-blue-600"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                      >
                        <Send className="w-4 h-4 shrink-0" />
                        <span>Enviar</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2. Plan de Lecciones y Pasajes del Grupo */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                      <h4 className="font-serif text-xl font-semibold text-slate-950 dark:text-white">
                        Plan de Lecciones Bíblicas del Grupo
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddLessonForm((prev) => !prev)}
                      className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline"
                    >
                      {showAddLessonForm
                        ? 'Cancelar'
                        : '+ Agregar Tema de Estudio'}
                    </button>
                  </div>

                  {showAddLessonForm && (
                    <form
                      onSubmit={handleAddLesson}
                      className="mb-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col sm:flex-row gap-3"
                    >
                      <input
                        type="text"
                        required
                        value={newLessonTitle}
                        onChange={(e) => setNewLessonTitle(e.target.value)}
                        placeholder="Título del tema (Ej. La Oración Eficaz)"
                        className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white"
                      />
                      <input
                        type="text"
                        value={newLessonScripture}
                        onChange={(e) => setNewLessonScripture(e.target.value)}
                        placeholder="Cita bíblica (Ej. Santiago 5:16)"
                        className="sm:w-48 px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg whitespace-nowrap"
                      >
                        Guardar Tema
                      </button>
                    </form>
                  )}

                  <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                    {activeGroup.lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        className="p-3.5 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between gap-4 text-xs sm:text-sm"
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleLesson(lesson.id)}
                          className="flex items-center gap-3 text-left flex-1"
                        >
                          {lesson.completed ? (
                            <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <div>
                            <span
                              className={`font-medium ${
                                lesson.completed
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-900 dark:text-slate-100'
                              }`}
                            >
                              Lección 0{idx + 1}: {lesson.title}
                            </span>
                          </div>
                        </button>
                        <span className="font-mono text-xs text-blue-700 dark:text-blue-400 font-semibold shrink-0">
                          {lesson.scripture}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Lista Real de Integrantes Inscritos en este Grupo */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Personas reales inscritas en este grupo (
                    <span className="font-mono">{activeGroup.members.length}</span>
                    ):
                  </p>
                  {activeGroup.members.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Aún no hay inscritos en este grupo. Ingresa tu nombre arriba y pulsa “Inscribirme al Grupo” o envía un mensaje en el chat para ser el primero.
                    </p>
                  ) : (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      {activeGroup.members.map((member, index) => (
                        <React.Fragment key={`${member.name}-${index}`}>
                          <span className="font-medium text-slate-900 dark:text-slate-200">
                            {member.name}{' '}
                            <span className="text-[11px] text-slate-400 font-mono">
                              ({member.joinedAt})
                            </span>
                          </span>
                          {index < activeGroup.members.length - 1 && (
                            <span aria-hidden="true">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Crear un Nuevo Grupo Real de Estudio Bíblico */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden my-8">
            <div className="bg-slate-950 text-white px-6 py-5 border-b border-blue-900/40 flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-400 font-medium">
                  Iglesia Discípulos de Cristo de San Gil
                </p>
                <h3 className="font-serif text-2xl font-semibold text-white">
                  Crear Nuevo Grupo de Estudio Bíblico
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewGroup} className="p-6 space-y-4">
              {createGroupError && (
                <div className="p-3 bg-red-50 text-red-800 border border-red-200 text-xs font-medium rounded-lg">
                  {createGroupError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Nombre del Grupo de Estudio *
                </label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Ej. Estudio del Evangelio de Marcos"
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Categoría / Ministerio *
                  </label>
                  <select
                    value={newGroupCategory}
                    onChange={(e) =>
                      setNewGroupCategory(
                        e.target.value as StudyGroup['category']
                      )
                    }
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white"
                  >
                    <option value="Discipulado">Discipulado</option>
                    <option value="Varones">Varones (Miércoles 7pm)</option>
                    <option value="Damas">Damas (Jueves 4pm)</option>
                    <option value="Dominical">Dominical (8am)</option>
                    <option value="Jóvenes y Familia">Jóvenes y Familia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Modalidad *
                  </label>
                  <select
                    value={newGroupModality}
                    onChange={(e) =>
                      setNewGroupModality(
                        e.target.value as StudyGroup['modality']
                      )
                    }
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white"
                  >
                    <option value="Presencial (Villa Olímpica)">
                      Presencial (Villa Olímpica)
                    </option>
                    <option value="Virtual / Mixto">Virtual / Mixto</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Libro o Pasaje Bíblico *
                  </label>
                  <input
                    type="text"
                    required
                    value={newGroupBook}
                    onChange={(e) => setNewGroupBook(e.target.value)}
                    placeholder="Ej. Hechos de los Apóstoles"
                    className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Día y Hora de Reunión *
                  </label>
                  <input
                    type="text"
                    required
                    value={newGroupSchedule}
                    onChange={(e) => setNewGroupSchedule(e.target.value)}
                    placeholder="Ej. Viernes · 06:30 PM"
                    className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Nombre del Líder / Coordinador *
                  </label>
                  <input
                    type="text"
                    required
                    value={newGroupLeader}
                    onChange={(e) => setNewGroupLeader(e.target.value)}
                    placeholder="Tu nombre real"
                    className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Línea WhatsApp de Contacto
                  </label>
                  <select
                    value={newGroupPhone}
                    onChange={(e) => setNewGroupPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white"
                  >
                    <option value="3123480660">312 348 0660 (Línea 1)</option>
                    <option value="3125576600">312 557 6600 (Línea 2)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Primera Lección del Grupo
                </label>
                <input
                  type="text"
                  value={newGroupLessonTitle}
                  onChange={(e) => setNewGroupLessonTitle(e.target.value)}
                  placeholder="Ej. Capítulo 1: La Promesa del Espíritu Santo"
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Propósito y Descripción
                </label>
                <textarea
                  rows={2}
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="Describe brevemente el objetivo de este grupo de estudio..."
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-lg"
                >
                  Publicar Grupo de Estudio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
