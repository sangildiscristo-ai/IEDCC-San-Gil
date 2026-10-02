export interface ServiceScheduleItem {
  id: string;
  dayName: string;
  dayOfWeek: number; // 0 = Sunday, 3 = Wednesday, 4 = Thursday
  timeLabel: string;
  hour24: number;
  minute: number;
  title: string;
  category: 'dominical' | 'semana' | 'personalizado';
  audience: string;
  description: string;
  scriptureRef: string;
  locationDetail: string;
  whatsappPrompt: string;
}

export interface MinistryItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  scheduleSummary: string;
  description: string;
  highlights: string[];
  whatsappMessage: string;
  ctaLabel: string;
}

export const CHURCH_INFO = {
  name: 'IGLESIA DISCÍPULOS DE CRISTO DE SAN GIL',
  shortName: 'Iglesia Discípulos de Cristo',
  alternateSpelling: 'Iglesia Dicipulos de Cristo de San Gil',
  handle: '@IEDCCSanGil',
  address: 'Cra 20 # 13A - 23, Barrio Villa Olímpica',
  city: 'San Gil, Santander, Colombia',
  fullAddress: 'Cra 20 # 13A - 23, Villa Olímpica, San Gil, Santander, Colombia',
  youtubeChannelUrl: 'https://www.youtube.com/@IEDCCSanGil',
  youtubeLiveUrl: 'https://www.youtube.com/@IEDCCSanGil/streams',
  youtubeSubscribeUrl: 'https://www.youtube.com/@IEDCCSanGil?sub_confirmation=1',
  facebookPageUrl: 'https://www.facebook.com/IEDCCSanGil/',
  googleMapsDirectUrl:
    'https://www.google.com/maps/search/?api=1&query=Cra+20+13a-23+Villa+Olimpica+San+Gil+Santander+Colombia',
  googleMapsEmbedUrl:
    'https://maps.google.com/maps?q=Cra.%2020%20%2313a-23,%20San%20Gil,%20Santander,%20Colombia&t=&z=16&ie=UTF8&iwloc=&output=embed',
  phones: [
    {
      id: 'line-1',
      raw: '3123480660',
      display: '312 348 0660',
      international: '573123480660',
      label: 'Línea de Atención Pastoral 1',
    },
    {
      id: 'line-2',
      raw: '3125576600',
      display: '312 557 6600',
      international: '573125576600',
      label: 'Línea de Atención y Consejería 2',
    },
  ],
  images: {
    heroSanctuary: '/src/assets/images/hero_sanctuary_worship_1790797257879.jpg',
    discipleshipCounseling: '/src/assets/images/ministry_discipleship_counseling_1790797268060.jpg',
    fellowshipGroup: '/src/assets/images/fellowship_men_women_1790797277991.jpg',
    liveBroadcast: '/src/assets/images/live_broadcast_studio_1790797287322.jpg',
  },
};

export const SERVICE_SCHEDULE: ServiceScheduleItem[] = [
  {
    id: 'culto-dominical-8am',
    dayName: 'Domingos',
    dayOfWeek: 0,
    timeLabel: '08:00 AM',
    hour24: 8,
    minute: 0,
    title: 'Culto Dominical de Adoración y Palabra',
    category: 'dominical',
    audience: 'Toda la Familia y Congregación General',
    description:
      'Tiempo central de alabanza congregacional, oración intercesora y exposición bíblica para edificar la fe de toda la familia en San Gil.',
    scriptureRef: 'Hebreos 10:24-25',
    locationDetail: 'Templo Principal · Cra 20 # 13A - 23, Villa Olímpica',
    whatsappPrompt:
      'Hola, paz de Cristo. Deseo recibir más información o confirmar mi asistencia al Culto Dominical de las 8:00 AM en la Iglesia Discípulos de Cristo de San Gil.',
  },
  {
    id: 'reunion-varones-miercoles-7pm',
    dayName: 'Miércoles',
    dayOfWeek: 3,
    timeLabel: '07:00 PM',
    hour24: 19,
    minute: 0,
    title: 'Reunión de Varones',
    category: 'semana',
    audience: 'Ministerio de Hombres y Jóvenes',
    description:
      'Espacio de formación espiritual para varones: estudio de las Escrituras, liderazgo cristiano en el hogar, compañerismo y oración.',
    scriptureRef: '1 Corintios 16:13',
    locationDetail: 'Salón Principal · Cra 20 # 13A - 23, Villa Olímpica',
    whatsappPrompt:
      'Hola, bendiciones. Quiero participar en la Reunión de Varones de los miércoles a las 7:00 PM en la Iglesia Discípulos de Cristo de San Gil.',
  },
  {
    id: 'reunion-damas-jueves-4pm',
    dayName: 'Jueves',
    dayOfWeek: 4,
    timeLabel: '04:00 PM',
    hour24: 16,
    minute: 0,
    title: 'Reunión de Damas',
    category: 'semana',
    audience: 'Ministerio de Mujeres',
    description:
      'Encuentro semanal de mujeres dedicadas a la oración, el estudio de la Palabra de Dios, el fortalecimiento familiar y el apoyo mutuo.',
    scriptureRef: 'Proverbios 31:25-26',
    locationDetail: 'Templo Principal · Cra 20 # 13A - 23, Villa Olímpica',
    whatsappPrompt:
      'Hola, bendiciones. Deseo información para asistir a la Reunión de Damas de los jueves a las 4:00 PM en la Iglesia Discípulos de Cristo de San Gil.',
  },
  {
    id: 'discipulados-y-consejeria',
    dayName: 'Lunes a Sábado',
    dayOfWeek: -1,
    timeLabel: 'Cita Previa',
    hour24: 9,
    minute: 0,
    title: 'Discipulados Personalizados y Consejería',
    category: 'personalizado',
    audience: 'Atención Individual, Matrimonios y Familias',
    description:
      'Acompañamiento bíblico uno a uno para el crecimiento en la fe, fundamentos cristianos y orientación pastoral confidencial.',
    scriptureRef: '2 Timoteo 2:2 · Proverbios 11:14',
    locationDetail: 'Presencial en Cra 20 # 13A - 23 Villa Olímpica o Atención Telefónica',
    whatsappPrompt:
      'Hola, paz de Cristo. Me gustaría agendar un espacio de Discipulado Personalizado o Consejería Pastoral en la Iglesia Discípulos de Cristo de San Gil.',
  },
];

export const MINISTRIES_DATA: MinistryItem[] = [
  {
    id: 'discipulado-personalizado',
    index: '01',
    title: 'Discipulados Personalizados',
    subtitle: 'Crecimiento Bíblico Paso a Paso',
    scheduleSummary: 'Horarios flexibles · Presencial en Villa Olímpica o Virtual',
    description:
      'Entendemos que cada persona camina a su propio ritmo. Ofrecemos mentoría bíblica personalizada para nuevos creyentes y miembros que desean profundizar en la doctrina cristiana, la oración y el servicio.',
    highlights: [
      'Fundamentos de la fe en Cristo y estudio bíblico inductivo',
      'Acompañamiento personal adaptado a tu disponibilidad de horario',
      'Material de estudio práctico y seguimiento espiritual continuo',
    ],
    whatsappMessage:
      'Hola, deseo inscribirme en los Discipulados Personalizados de la Iglesia Discípulos de Cristo de San Gil.',
    ctaLabel: 'Solicitar Discipulado Personalizado',
  },
  {
    id: 'consejeria-pastoral',
    index: '02',
    title: 'Consejería Pastoral y Familiar',
    subtitle: 'Orientación Espiritual, Matrimonial y Personal',
    scheduleSummary: 'Atención confidencial · Líneas 312 348 0660 / 312 557 6600',
    description:
      'Brindamos un espacio seguro, confidencial y fundamentado en el amor de Cristo y Su Palabra para escuchar, orar y orientar en momentos de decisión, crisis familiar, restauración matrimonial o necesidad espiritual.',
    highlights: [
      'Consejería para matrimonios, padres, jóvenes e individuos',
      'Intercesión y acompañamiento pastoral con total reserva',
      'Atención inmediata por WhatsApp o cita presencial en nuestra sede',
    ],
    whatsappMessage:
      'Hola, me gustaría solicitar una cita de Consejería Pastoral en la Iglesia Discípulos de Cristo de San Gil.',
    ctaLabel: 'Agendar Consejería Pastoral',
  },
  {
    id: 'ministerios-varones-damas',
    index: '03',
    title: 'Ministerios de Varones y Damas',
    subtitle: 'Comunidad que Edifica el Hogar',
    scheduleSummary: 'Varones: Miércoles 7:00 PM · Damas: Jueves 4:00 PM',
    description:
      'Nuestras reuniones semanales fortalecen el carácter cristiano de hombres y mujeres en San Gil, creando lazos genuinos de hermandad, oración ferviente y estudio práctico de las Escrituras.',
    highlights: [
      'Reunión de Varones todos los miércoles a las 7:00 PM',
      'Reunión de Damas todos los jueves a las 4:00 PM',
      'Culto Congregacional todos los domingos a las 8:00 AM',
    ],
    whatsappMessage:
      'Hola, quiero unirme a las reuniones semanales de Varones (miércoles 7pm) o Damas (jueves 4pm) en la Iglesia Discípulos de Cristo de San Gil.',
    ctaLabel: 'Unirse a Reuniones Semanales',
  },
];

export function buildWhatsAppUrl(phoneRaw: string, message: string): string {
  const cleanPhone = phoneRaw.replace(/\D/g, '');
  const fullPhone = cleanPhone.startsWith('57') ? cleanPhone : `57${cleanPhone}`;
  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
}

export function downloadServiceIcs(item: ServiceScheduleItem): void {
  const now = new Date();
  const targetDay = item.dayOfWeek >= 0 ? item.dayOfWeek : 0;
  const daysUntil = (targetDay - now.getDay() + 7) % 7 || 7;
  const startDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + daysUntil,
    item.hour24,
    item.minute,
    0
  );
  const endDate = new Date(startDate.getTime() + 90 * 60 * 1000);

  const formatIcsDate = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Iglesia Discipulos de Cristo de San Gil//ES',
    'BEGIN:VEVENT',
    `UID:${item.id}-${Date.now()}@iedccsangil.org`,
    `DTSTAMP:${formatIcsDate(now)}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:${item.title} - Iglesia Discípulos de Cristo de San Gil`,
    `DESCRIPTION:${item.description} (${item.scriptureRef})`,
    `LOCATION:${CHURCH_INFO.fullAddress}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${item.id}-san-gil.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
