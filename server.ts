import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface RegisteredWebMember {
  id: string;
  registrationNumber: number;
  fullName: string;
  phone: string;
  email: string;
  selectedMinistries: string[];
  preferredWhatsappLine: string;
  joinedAt: string;
  memberCode: string;
}

export interface StudyGroupPost {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  scriptureRef?: string;
  createdAt: string;
  timestamp: number;
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

interface RealtimeDatabase {
  registeredMembers: RegisteredWebMember[];
  studyGroups: StudyGroup[];
}

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'church-realtime-db.json');

/**
 * Grupos oficiales de la Iglesia Discípulos de Cristo de San Gil
 * Sin nombres ficticios: los contadores de registrados e integrantes y los mensajes
 * del chat provienen 100% de las personas reales que se registran y escriben.
 */
const INITIAL_STUDY_GROUPS: StudyGroup[] = [
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
      {
        id: 'les-v3',
        title: 'La Armadura de Dios en la Vida del Creyente',
        scripture: 'Efesios 6:10-18',
        completed: false,
      },
    ],
    posts: [],
    createdAt: '2026',
  },
  {
    id: 'grupo-damas-jueves',
    name: 'Círculo de Oración y Estudio de Damas',
    category: 'Damas',
    bookFocus: 'Proverbios y Mujeres de la Biblia',
    schedule: 'Jueves · 04:00 PM',
    modality: 'Presencial (Villa Olímpica)',
    leaderName: 'Ministerio de Damas IEDCC San Gil',
    leaderPhone: '3125576600',
    description:
      'Encuentro de damas todos los jueves a las 4:00 PM dedicado al estudio de la sabiduría bíblica, la intercesión por las familias de San Gil y el crecimiento espiritual.',
    members: [],
    lessons: [
      {
        id: 'les-d1',
        title: 'Sabiduría y Clemencia en el Corazón de la Mujer',
        scripture: 'Proverbios 31:25-30',
        completed: false,
      },
      {
        id: 'les-d2',
        title: 'La Paz de Dios a través de la Oración',
        scripture: 'Filipenses 4:6-7',
        completed: false,
      },
    ],
    posts: [],
    createdAt: '2026',
  },
  {
    id: 'grupo-discipulado-personalizado',
    name: 'Fundamentos de la Fe (Discipulado Personalizado)',
    category: 'Discipulado',
    bookFocus: 'Evangelio de Juan y Romanos',
    schedule: 'Horario Personalizado · Lunes a Sábado',
    modality: 'Virtual / Mixto',
    leaderName: 'Equipo Pastoral IEDCC San Gil',
    leaderPhone: '3123480660',
    description:
      'Sala de estudio y acompañamiento bíblico personalizado para quienes estudian paso a paso las doctrinas esenciales de Cristo.',
    members: [],
    lessons: [
      {
        id: 'les-f1',
        title: 'El Nuevo Nacimiento y la Salvación en Cristo',
        scripture: 'Juan 3:1-18',
        completed: false,
      },
      {
        id: 'les-f2',
        title: 'Vida en el Espíritu y Victoria Cristiana',
        scripture: 'Romanos 8:1-39',
        completed: false,
      },
      {
        id: 'les-f3',
        title: 'La Gran Comisión de Hacer Discípulos',
        scripture: 'Mateo 28:18-20',
        completed: false,
      },
    ],
    posts: [],
    createdAt: '2026',
  },
];

function loadDatabase(): RealtimeDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialDb: RealtimeDatabase = {
        registeredMembers: [],
        studyGroups: INITIAL_STUDY_GROUPS,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      return initialDb;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as RealtimeDatabase;
    return {
      registeredMembers: Array.isArray(parsed.registeredMembers)
        ? parsed.registeredMembers
        : [],
      studyGroups: Array.isArray(parsed.studyGroups)
        ? parsed.studyGroups
        : INITIAL_STUDY_GROUPS,
    };
  } catch {
    return {
      registeredMembers: [],
      studyGroups: INITIAL_STUDY_GROUPS,
    };
  }
}

function saveDatabase(db: RealtimeDatabase): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error guardando base de datos en tiempo real:', err);
  }
}

interface ConnectedClientMeta {
  ws: WebSocket;
  clientId: string;
  userName: string;
  activeGroupId: string;
}

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  app.use(express.json());

  const db: RealtimeDatabase = loadDatabase();
  const clients = new Map<WebSocket, ConnectedClientMeta>();

  // WebSocket Server on the same HTTP server (port 3000)
  const wss = new WebSocketServer({ server, path: '/ws' });

  const getOnlineSummary = () => {
    const onlineUsers: Array<{
      clientId: string;
      userName: string;
      activeGroupId: string;
    }> = [];
    for (const meta of clients.values()) {
      onlineUsers.push({
        clientId: meta.clientId,
        userName: meta.userName,
        activeGroupId: meta.activeGroupId,
      });
    }
    return {
      onlineCount: clients.size,
      onlineUsers,
    };
  };

  const broadcastAll = (payload: Record<string, unknown>) => {
    const message = JSON.stringify({
      ...payload,
      ...getOnlineSummary(),
      totalRegisteredMembers: db.registeredMembers.length,
    });
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  };

  wss.on('connection', (ws) => {
    const clientId = `conn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    clients.set(ws, {
      ws,
      clientId,
      userName: 'Visitante en línea',
      activeGroupId: 'grupo-varones-miercoles',
    });

    // Send full authoritative initial state
    ws.send(
      JSON.stringify({
        type: 'init',
        clientId,
        groups: db.studyGroups,
        registeredMembers: db.registeredMembers,
        totalRegisteredMembers: db.registeredMembers.length,
        ...getOnlineSummary(),
      })
    );

    // Notify everyone of updated online count
    broadcastAll({
      type: 'presence:updated',
    });

    ws.on('message', (rawBuffer) => {
      try {
        const msg = JSON.parse(rawBuffer.toString());
        const meta = clients.get(ws);
        if (!meta) return;

        if (msg.type === 'presence:identify') {
          if (msg.userName && String(msg.userName).trim()) {
            meta.userName = String(msg.userName).trim();
          }
          if (msg.activeGroupId) {
            meta.activeGroupId = String(msg.activeGroupId);
          }
          broadcastAll({ type: 'presence:updated' });
          return;
        }

        if (msg.type === 'chat:typing') {
          broadcastAll({
            type: 'chat:typing',
            groupId: msg.groupId,
            userName: meta.userName || msg.userName || 'Un hermano',
            isTyping: Boolean(msg.isTyping),
            clientId: meta.clientId,
          });
          return;
        }

        if (msg.type === 'chat:message') {
          const { groupId, authorName, content, scriptureRef, messageId } = msg;
          if (!groupId || !authorName || !content) return;

          const group = db.studyGroups.find((g) => g.id === groupId);
          if (!group) return;

          // Idempotency guard
          const cleanId =
            messageId ||
            `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
          if (group.posts.some((p) => p.id === cleanId)) return;

          const cleanAuthor = String(authorName).trim();
          meta.userName = cleanAuthor;

          // Automatically register in group members if not already in the group
          if (
            !group.members.some(
              (m) => m.name.toLowerCase() === cleanAuthor.toLowerCase()
            )
          ) {
            group.members.push({
              name: cleanAuthor,
              joinedAt: new Date().toLocaleDateString('es-CO', {
                day: '2-digit',
                month: 'short',
              }),
            });
          }

          const newPost: StudyGroupPost = {
            id: cleanId,
            authorName: cleanAuthor,
            authorRole: 'Integrante en Vivo',
            content: String(content).trim(),
            scriptureRef: scriptureRef ? String(scriptureRef).trim() : undefined,
            createdAt: new Date().toLocaleTimeString('es-CO', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            timestamp: Date.now(),
          };

          group.posts.push(newPost);
          saveDatabase(db);

          broadcastAll({
            type: 'chat:message_created',
            groupId,
            post: newPost,
            groups: db.studyGroups,
          });
          return;
        }
      } catch {
        // Ignore malformed WS packet
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      broadcastAll({
        type: 'presence:updated',
      });
    });
  });

  // REST API: Get real registered members count & list
  app.get('/api/members', (_req, res) => {
    res.json({
      totalRegisteredMembers: db.registeredMembers.length,
      registeredMembers: db.registeredMembers,
      ...getOnlineSummary(),
    });
  });

  // REST API: Register a real member on the website
  app.post('/api/members', (req, res) => {
    const {
      fullName,
      phone,
      email,
      selectedMinistries,
      preferredWhatsappLine,
    } = req.body;

    if (!fullName || String(fullName).trim().length < 2 || !phone) {
      res.status(400).json({
        error: 'Nombre completo y número de teléfono son obligatorios.',
      });
      return;
    }

    const cleanName = String(fullName).trim();
    const cleanPhone = String(phone).trim();

    // Check if already registered by phone or exact name
    let existing = db.registeredMembers.find(
      (m) =>
        m.phone.replace(/\D/g, '') === cleanPhone.replace(/\D/g, '') ||
        m.fullName.toLowerCase() === cleanName.toLowerCase()
    );

    if (existing) {
      existing.fullName = cleanName;
      existing.phone = cleanPhone;
      existing.email = String(email || '').trim();
      existing.selectedMinistries = Array.isArray(selectedMinistries)
        ? selectedMinistries
        : existing.selectedMinistries;
      existing.preferredWhatsappLine =
        preferredWhatsappLine || existing.preferredWhatsappLine;
    } else {
      const regNumber = db.registeredMembers.length + 1;
      existing = {
        id: `mem-${Date.now()}`,
        registrationNumber: regNumber,
        fullName: cleanName,
        phone: cleanPhone,
        email: String(email || '').trim(),
        selectedMinistries: Array.isArray(selectedMinistries)
          ? selectedMinistries
          : [],
        preferredWhatsappLine: String(preferredWhatsappLine || '3123480660'),
        joinedAt: new Date().toLocaleDateString('es-CO', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        memberCode: `IEDCC-${String(regNumber).padStart(3, '0')}`,
      };
      db.registeredMembers.push(existing);
    }

    saveDatabase(db);
    broadcastAll({
      type: 'member:registered',
      member: existing,
      registeredMembers: db.registeredMembers,
    });

    res.status(201).json({
      member: existing,
      totalRegisteredMembers: db.registeredMembers.length,
      registeredMembers: db.registeredMembers,
    });
  });

  // Get all study groups + real stats
  app.get('/api/groups', (_req, res) => {
    res.json({
      groups: db.studyGroups,
      totalRegisteredMembers: db.registeredMembers.length,
      registeredMembers: db.registeredMembers,
      ...getOnlineSummary(),
    });
  });

  // Create a new real study group
  app.post('/api/groups', (req, res) => {
    const {
      name,
      category,
      bookFocus,
      schedule,
      modality,
      leaderName,
      leaderPhone,
      description,
      firstLessonTitle,
      firstLessonScripture,
    } = req.body;

    if (!name || !bookFocus || !leaderName) {
      res.status(400).json({
        error:
          'El nombre del grupo, libro bíblico y nombre del coordinador son obligatorios.',
      });
      return;
    }

    const cleanLeader = String(leaderName).trim();
    const id = `grupo-${Date.now()}`;
    const newGroup: StudyGroup = {
      id,
      name: String(name).trim(),
      category: category || 'Discipulado',
      bookFocus: String(bookFocus).trim(),
      schedule: String(schedule || 'Horario por acordar').trim(),
      modality: modality || 'Presencial (Villa Olímpica)',
      leaderName: cleanLeader,
      leaderPhone: String(leaderPhone || '3123480660').trim(),
      description: String(
        description || 'Grupo de estudio bíblico y comunión en la Palabra.'
      ).trim(),
      members: [
        {
          name: cleanLeader,
          joinedAt: new Date().toLocaleDateString('es-CO', {
            day: '2-digit',
            month: 'short',
          }),
        },
      ],
      lessons: firstLessonTitle
        ? [
            {
              id: `les-${Date.now()}`,
              title: String(firstLessonTitle).trim(),
              scripture: String(firstLessonScripture || bookFocus).trim(),
              completed: false,
            },
          ]
        : [],
      posts: [],
      createdAt: new Date().toLocaleDateString('es-CO'),
    };

    db.studyGroups = [newGroup, ...db.studyGroups];
    saveDatabase(db);
    broadcastAll({
      type: 'group:created',
      group: newGroup,
      groups: db.studyGroups,
    });
    res.status(201).json({ group: newGroup, groups: db.studyGroups });
  });

  // Join a study group as a real registered participant
  app.post('/api/groups/:groupId/join', (req, res) => {
    const { groupId } = req.params;
    const { memberName } = req.body;

    if (!memberName || String(memberName).trim().length < 2) {
      res
        .status(400)
        .json({ error: 'Ingresa tu nombre real para registrarte en el grupo.' });
      return;
    }

    const group = db.studyGroups.find((g) => g.id === groupId);
    if (!group) {
      res.status(404).json({ error: 'Grupo no encontrado.' });
      return;
    }

    const cleanName = String(memberName).trim();
    const alreadyInGroup = group.members.some(
      (m) => m.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (!alreadyInGroup) {
      group.members.push({
        name: cleanName,
        joinedAt: new Date().toLocaleDateString('es-CO', {
          day: '2-digit',
          month: 'short',
        }),
      });
      saveDatabase(db);
      broadcastAll({
        type: 'group:joined',
        groupId,
        memberName: cleanName,
        groups: db.studyGroups,
      });
    }

    res.json({ group, groups: db.studyGroups });
  });

  // Post a message / Bible study reflection to a group (HTTP fallback in addition to WebSocket)
  app.post('/api/groups/:groupId/posts', (req, res) => {
    const { groupId } = req.params;
    const { authorName, content, scriptureRef, messageId } = req.body;

    if (!authorName || !content) {
      res.status(400).json({
        error: 'El nombre y el mensaje son obligatorios.',
      });
      return;
    }

    const group = db.studyGroups.find((g) => g.id === groupId);
    if (!group) {
      res.status(404).json({ error: 'Grupo no encontrado.' });
      return;
    }

    const cleanId =
      messageId ||
      `post-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    if (group.posts.some((p) => p.id === cleanId)) {
      res.json({ group, groups: db.studyGroups });
      return;
    }

    const cleanAuthor = String(authorName).trim();
    if (
      !group.members.some(
        (m) => m.name.toLowerCase() === cleanAuthor.toLowerCase()
      )
    ) {
      group.members.push({
        name: cleanAuthor,
        joinedAt: new Date().toLocaleDateString('es-CO', {
          day: '2-digit',
          month: 'short',
        }),
      });
    }

    const newPost: StudyGroupPost = {
      id: cleanId,
      authorName: cleanAuthor,
      authorRole: 'Integrante del Estudio',
      content: String(content).trim(),
      scriptureRef: scriptureRef ? String(scriptureRef).trim() : undefined,
      createdAt: new Date().toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: Date.now(),
    };

    group.posts.push(newPost);
    saveDatabase(db);
    broadcastAll({
      type: 'chat:message_created',
      groupId,
      post: newPost,
      groups: db.studyGroups,
    });
    res.status(201).json({ post: newPost, group, groups: db.studyGroups });
  });

  // Delete a chat message
  app.delete('/api/groups/:groupId/posts/:postId', (req, res) => {
    const { groupId, postId } = req.params;
    const group = db.studyGroups.find((g) => g.id === groupId);
    if (!group) {
      res.status(404).json({ error: 'Grupo no encontrado.' });
      return;
    }
    group.posts = group.posts.filter((p) => p.id !== postId);
    saveDatabase(db);
    broadcastAll({
      type: 'chat:message_deleted',
      groupId,
      postId,
      groups: db.studyGroups,
    });
    res.json({ group, groups: db.studyGroups });
  });

  // Add or toggle a lesson in a study group
  app.post('/api/groups/:groupId/lessons', (req, res) => {
    const { groupId } = req.params;
    const { title, scripture } = req.body;

    if (!title) {
      res.status(400).json({ error: 'El título del tema es obligatorio.' });
      return;
    }

    const group = db.studyGroups.find((g) => g.id === groupId);
    if (!group) {
      res.status(404).json({ error: 'Grupo no encontrado.' });
      return;
    }

    const newLesson: StudyLessonItem = {
      id: `les-${Date.now()}`,
      title: String(title).trim(),
      scripture: String(scripture || group.bookFocus).trim(),
      completed: false,
    };

    group.lessons.push(newLesson);
    saveDatabase(db);
    broadcastAll({
      type: 'lesson:created',
      groupId,
      lesson: newLesson,
      groups: db.studyGroups,
    });
    res.status(201).json({ group, groups: db.studyGroups });
  });

  app.patch('/api/groups/:groupId/lessons/:lessonId', (req, res) => {
    const { groupId, lessonId } = req.params;
    const group = db.studyGroups.find((g) => g.id === groupId);
    if (!group) {
      res.status(404).json({ error: 'Grupo no encontrado.' });
      return;
    }
    const lesson = group.lessons.find((l) => l.id === lessonId);
    if (lesson) {
      lesson.completed = !lesson.completed;
      saveDatabase(db);
      broadcastAll({
        type: 'lesson:toggled',
        groupId,
        lessonId,
        groups: db.studyGroups,
      });
    }
    res.json({ group, groups: db.studyGroups });
  });

  // Spanish Reina-Valera Bible Chapter Proxy Endpoint
  const bibleCache = new Map<string, unknown>();
  app.get('/api/bible/:bookId/:chapter', async (req, res) => {
    const bookId = Number(req.params.bookId);
    const chapter = Number(req.params.chapter);
    const cacheKey = `${bookId}-${chapter}`;

    if (bibleCache.has(cacheKey)) {
      res.json(bibleCache.get(cacheKey));
      return;
    }

    try {
      const response = await fetch(
        `https://bolls.life/get-text/RV1960/${bookId}/${chapter}/`
      );
      if (response.ok) {
        const data = (await response.json()) as Array<{
          verse: number;
          text: string;
        }>;
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((item) => ({
            verse: item.verse,
            text: String(item.text)
              .replace(/<[^>]+>/g, '')
              .trim(),
          }));
          const payload = {
            bookId,
            chapter,
            version: 'Reina-Valera 1960',
            verses: formatted,
          };
          bibleCache.set(cacheKey, payload);
          res.json(payload);
          return;
        }
      }
      res
        .status(404)
        .json({ error: 'Capítulo no disponible en servidor externo' });
    } catch {
      res.status(503).json({ error: 'Modo local activo' });
    }
  });

  // Serve the 10 sacred hymn MP3 files directly from /data/mp3
  const mp3Dir = path.join(DATA_DIR, 'mp3');
  const mp3CacheDir = path.join(DATA_DIR, 'mp3-cache');
  if (!fs.existsSync(mp3Dir)) {
    fs.mkdirSync(mp3Dir, { recursive: true });
  }
  if (!fs.existsSync(mp3CacheDir)) {
    fs.mkdirSync(mp3CacheDir, { recursive: true });
  }
  app.use('/mp3', express.static(mp3Dir));

  // Stream & cache any of the 277+ vocal MP3 recordings for the 224,344,224 Hymns catalog
  app.get('/api/hymn-mp3/:filename', async (req, res) => {
    const rawFilename = path.basename(req.params.filename || '');
    const cachedFile = path.join(mp3CacheDir, rawFilename);
    const localDirectFile = path.join(mp3Dir, rawFilename);

    try {
      if (fs.existsSync(localDirectFile)) {
        res.sendFile(localDirectFile);
        return;
      }
      if (fs.existsSync(cachedFile) && fs.statSync(cachedFile).size > 10000) {
        res.sendFile(cachedFile);
        return;
      }

      const remoteUrl = `https://www.palabradeverdad.com/wp-content/uploads/2022/01/${encodeURIComponent(rawFilename)}`;
      const remoteRes = await fetch(remoteUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        },
      });

      if (remoteRes.ok) {
        const arrayBuffer = await remoteRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        if (buffer.length > 10000) {
          fs.writeFileSync(cachedFile, buffer);
          res.sendFile(cachedFile);
          return;
        }
      }
    } catch {
      // Fallback below
    }

    // Resilient fallback to the 10 local sung MP3 files in /data/mp3
    try {
      const localFiles = fs
        .readdirSync(mp3Dir)
        .filter((f) => f.endsWith('.mp3'))
        .sort();
      if (localFiles.length > 0) {
        const hash = rawFilename
          .split('')
          .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
        const fallbackFile = path.join(
          mp3Dir,
          localFiles[hash % localFiles.length]
        );
        res.sendFile(fallbackFile);
        return;
      }
    } catch {
      // Ignore
    }
    res.status(404).json({ error: 'Audio de himno no disponible' });
  });

  // Allow replacing or uploading custom MP3 files directly to /data/mp3
  app.post(
    '/api/mp3-upload/:filename',
    express.raw({ type: '*/*', limit: '50mb' }),
    (req, res) => {
      try {
        const safeName = path
          .basename(req.params.filename)
          .replace(/[^a-zA-Z0-9._-]/g, '-');
        const targetPath = path.join(mp3Dir, safeName);
        if (Buffer.isBuffer(req.body) && req.body.length > 0) {
          fs.writeFileSync(targetPath, req.body);
          res.json({ ok: true, url: `/mp3/${safeName}?t=${Date.now()}` });
          return;
        }
        res.status(400).json({ error: 'Archivo MP3 vacío' });
      } catch {
        res.status(500).json({ error: 'Error al guardar el archivo MP3' });
      }
    }
  );

  // Live YouTube Channel Feed Proxy for @IEDCCSanGil
  app.get('/api/youtube-videos', async (_req, res) => {
    try {
      const rssUrl =
        'https://www.youtube.com/feeds/videos.xml?channel_id=UCBpv_fN8q8wGNz2RqbmFUQA';
      const response = await fetch(rssUrl);
      if (!response.ok) {
        res.json({ videos: [] });
        return;
      }
      const xml = await response.text();
      const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
      const liveVideos = entries
        .map((e) => {
          const videoId = e[1].match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
          const title = e[1].match(/<title>([^<]+)<\/title>/)?.[1];
          return videoId && title
            ? {
                videoId,
                title,
                category: 'Predicaciones',
                speaker: 'IEDCC San Gil',
              }
            : null;
        })
        .filter(Boolean);
      res.json({ videos: liveVideos });
    } catch {
      res.json({ videos: [] });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(
      `Servidor HTTP + WebSocket IEDCC San Gil activo en http://0.0.0.0:${PORT}`
    );
  });
}

startServer();
