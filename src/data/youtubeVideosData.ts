export interface ChannelVideoItem {
  videoId: string;
  title: string;
  category:
    | 'Predicaciones'
    | 'Serie Mateo'
    | 'Familia y Crianza'
    | 'Historia y Bienvenida'
    | 'Reflexiones';
  scripture?: string;
  speaker?: string;
  isShort?: boolean;
}

export const IEDCC_CHANNEL_ID = 'UCBpv_fN8q8wGNz2RqbmFUQA';
export const IEDCC_UPLOADS_PLAYLIST_ID = 'UUBpv_fN8q8wGNz2RqbmFUQA';

/**
 * Catálogo completo de los 32 videos reales publicados en el canal oficial
 * de YouTube @IEDCCSanGil (Iglesia Discípulos de Cristo de San Gil)
 */
export const CHANNEL_VIDEOS_CATALOG: ChannelVideoItem[] = [
  {
    videoId: 'i0RJmZ_Z8xw',
    title: 'Efesios 6:19-20 — Orando con Denuedo por el Evangelio',
    category: 'Predicaciones',
    scripture: 'Efesios 6:19-20',
    speaker: 'IEDCC San Gil',
  },
  {
    videoId: 'ilIsF56MKNU',
    title: 'HISTORIA DE LA IEDCC SAN GIL',
    category: 'Historia y Bienvenida',
    speaker: 'Iglesia Discípulos de Cristo de San Gil',
  },
  {
    videoId: 'Mmz5QpTUdWM',
    title: 'SALVACIÓN SEGURA PARA TENER COMPLETA PAZ',
    category: 'Predicaciones',
    speaker: 'IEDCC San Gil',
  },
  {
    videoId: 'x3Cw0f4V7d4',
    title:
      'BIENVENIDO A LA IGLESIA EVANGÉLICA DISCÍPULOS DE CRISTO DE COLOMBIA SEDE SAN GIL',
    category: 'Historia y Bienvenida',
    speaker: 'IEDCC San Gil',
  },
  {
    videoId: 'H8y1pQgk7Po',
    title: 'VIDEO DE BIENVENIDA — IEDCC SAN GIL',
    category: 'Historia y Bienvenida',
    speaker: 'IEDCC San Gil',
    isShort: true,
  },
  {
    videoId: 'Cg3a64BXYfc',
    title: '¿CÓMO DESCANSAR EN CRISTO? - Mateo 11:25-30',
    category: 'Serie Mateo',
    scripture: 'Mateo 11:25-30',
    speaker: 'Pr. Cleiner Duarte',
  },
  {
    videoId: 'KiWKORAz8M4',
    title:
      'EL JUICIO PARA QUIENES NO ATIENDEN AL MENSAJE DEL REY - Mateo 11:1-24',
    category: 'Serie Mateo',
    scripture: 'Mateo 11:1-24',
    speaker: 'Pr. Cleiner Duarte',
  },
  {
    videoId: '2SiXZcTMMbk',
    title: 'RECONÓCELO EN TODOS TUS CAMINOS - Proverbios 3:6',
    category: 'Predicaciones',
    scripture: 'Proverbios 3:6',
    speaker: 'Pr. Cleiner Duarte',
  },
  {
    videoId: 'Z9kMogmTjb8',
    title: '¡LEVÁNTATE, TUS PECADOS TE SON PERDONADOS! - Mateo 9:1-8',
    category: 'Serie Mateo',
    scripture: 'Mateo 9:1-8',
    speaker: 'Pr. Cleiner Duarte',
  },
  {
    videoId: 'ANlWAsiybbY',
    title: 'MÁS CIEGO QUE UN DEMONIO - Mateo 9:28-34',
    category: 'Serie Mateo',
    scripture: 'Mateo 9:28-34',
    speaker: 'Pr. Cleiner Duarte',
  },
  {
    videoId: 'V6rQ82aifA8',
    title: 'EL REY DE LAS OLAS - Mateo 8:18-27',
    category: 'Serie Mateo',
    scripture: 'Mateo 8:18-27',
    speaker: 'Pr. Cleiner Duarte',
  },
  {
    videoId: 'RQy17vdKr7E',
    title:
      'LA AMISTAD SE MUESTRA A TRAVÉS DE LA GENEROSIDAD | Mateo 5:41-42',
    category: 'Serie Mateo',
    scripture: 'Mateo 5:41-42',
    speaker: 'Pst. Cleiner Duarte',
  },
  {
    videoId: 'kPwcbBsNQ0g',
    title: 'EL ADULTERIO | Mateo 5:27-30',
    category: 'Serie Mateo',
    scripture: 'Mateo 5:27-30',
    speaker: 'Pst. Cleiner Duarte',
  },
  {
    videoId: 'Nb4-yWEUajU',
    title: 'UN OBRERO APROBADO | 2 Timoteo 2:15',
    category: 'Predicaciones',
    scripture: '2 Timoteo 2:15',
    speaker: 'Pst. Edwin Nova',
  },
  {
    videoId: 'bARVtc5352A',
    title: 'EL ÚNICO QUE CUMPLE LA LEY | Mateo 5:17-20',
    category: 'Serie Mateo',
    scripture: 'Mateo 5:17-20',
    speaker: 'Pr. Cleiner Duarte',
  },
  {
    videoId: '1Zurw_vTNCo',
    title: '¿ERES LUZ? | Mateo 5:14-16',
    category: 'Serie Mateo',
    scripture: 'Mateo 5:14-16',
    speaker: 'Pr. Cleiner Duarte',
  },
  {
    videoId: 'Ae9_L082SCw',
    title: 'BIENAVENTURADOS LOS MISERICORDIOSOS | Mateo 5:7',
    category: 'Serie Mateo',
    scripture: 'Mateo 5:7',
    speaker: 'Pr. Cleiner Duarte',
  },
  {
    videoId: '4Wu-G9PeYwk',
    title: 'LA DICHA PARA LOS LIMPIOS DE CORAZÓN | Mateo 5:8',
    category: 'Serie Mateo',
    scripture: 'Mateo 5:8',
    speaker: 'Pr. Cleiner Duarte',
  },
  {
    videoId: 'x_EcVsiQegY',
    title: 'UNA TIERRA PARA LOS MANSOS | Mateo 5:5',
    category: 'Serie Mateo',
    scripture: 'Mateo 5:5',
    speaker: 'Pr. Cleiner Duarte',
  },
  {
    videoId: 'js7u15ox8ng',
    title: 'CONSUELO PARA UN CORAZÓN ARREPENTIDO | Mateo 5:4',
    category: 'Serie Mateo',
    scripture: 'Mateo 5:4',
    speaker: 'Pr. Cleiner Duarte',
  },
  {
    videoId: 'R9H3YY2SZho',
    title: 'DE POBRE A RICO | Mateo 5:1-3',
    category: 'Serie Mateo',
    scripture: 'Mateo 5:1-3',
    speaker: 'Pr. Cleiner Duarte',
  },
  {
    videoId: 'VzkIX0NRWhU',
    title: 'LA LUZ DEL REY | Mateo 4:12-22',
    category: 'Serie Mateo',
    scripture: 'Mateo 4:12-22',
    speaker: 'Pr. Cleiner Duarte',
  },
  {
    videoId: 'NdZynX_e4UQ',
    title:
      'EL REY EN MEDIO DE LAS TENTACIONES DEL DESIERTO | Mateo 3:1-11',
    category: 'Serie Mateo',
    scripture: 'Mateo 3:1-11',
    speaker: 'Pr. Cleiner Duarte',
  },
  {
    videoId: 'jsKDvhKBeJQ',
    title: '¿POR QUÉ NOS CUESTA AMAR A NUESTRAS ESPOSAS?',
    category: 'Familia y Crianza',
    speaker: 'IEDCC San Gil',
  },
  {
    videoId: '4aZgVKcXDgg',
    title: '¿CÓMO CRISTO TRATARÍA A TU ESPOSA? Esposos atención aquí',
    category: 'Familia y Crianza',
    speaker: 'IEDCC San Gil',
    isShort: true,
  },
  {
    videoId: 'oWB1g-lnmLA',
    title: 'OBEDECED EN EL SEÑOR #fe #paz',
    category: 'Reflexiones',
    speaker: 'IEDCC San Gil',
    isShort: true,
  },
  {
    videoId: 'TB2wyglVNVM',
    title: 'UN NIÑO CONFORME A LA MENTE DE CRISTO',
    category: 'Familia y Crianza',
    speaker: 'IEDCC San Gil',
    isShort: true,
  },
  {
    videoId: 'nO89aoz-fG8',
    title: 'GUIANDO UN NIÑO HACIA LA CRUZ — PARTE 1',
    category: 'Familia y Crianza',
    speaker: 'IEDCC San Gil',
    isShort: true,
  },
  {
    videoId: 'vjHoK65O_Js',
    title: 'GUIAR A UN NIÑO HACIA LA CRUZ — PARTE 2',
    category: 'Familia y Crianza',
    speaker: 'IEDCC San Gil',
    isShort: true,
  },
  {
    videoId: '7qrRI0m_DxI',
    title: 'GUIAR A UN NIÑO HACIA LA CRUZ — PARTE 3',
    category: 'Familia y Crianza',
    speaker: 'IEDCC San Gil',
    isShort: true,
  },
  {
    videoId: 'ZTsvzaBT6Ks',
    title: 'GUIAR A UN NIÑO HACIA LA CRUZ — PARTE 4',
    category: 'Familia y Crianza',
    speaker: 'IEDCC San Gil',
    isShort: true,
  },
  {
    videoId: '0neLdheyaKU',
    title: 'GUIAR A UN NIÑO HACIA LA CRUZ — PARTE FINAL',
    category: 'Familia y Crianza',
    speaker: 'IEDCC San Gil',
    isShort: true,
  },
];
