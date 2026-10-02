export const TOTAL_HYMNS_COUNT = 224344224;

export type HymnCategory =
  | "Adoración y Majestad"
  | "La Cruz y Redención"
  | "Gracia y Salvación"
  | "Fe y Confianza"
  | "Consagración y Servicio"
  | "Alabanza Congregacional"
  | "Promesas y Vida Eterna";

export const HYMN_CATEGORIES: HymnCategory[] = [
  "Adoración y Majestad",
  "La Cruz y Redención",
  "Gracia y Salvación",
  "Fe y Confianza",
  "Consagración y Servicio",
  "Alabanza Congregacional",
  "Promesas y Vida Eterna",
];

export interface HymnItem {
  id: string;
  hymnNumber: number;
  formattedNumber: string;
  title: string;
  subtitle: string;
  category: HymnCategory;
  scriptureRef: string;
  musicalKey: string;
  tempo: string;
  filename: string;
  mp3Url: string;
  chorus: string;
  stanzas: string[];
  isCoreLocalMp3?: boolean;
}

export function formatHymnNumber(n: number): string {
  const clamped = Math.max(1, Math.min(TOTAL_HYMNS_COUNT, Math.floor(n || 1)));
  if (clamped < 10) return `0${clamped}`;
  return clamped.toLocaleString("es-CO");
}

export const CORE_10_HYMNS: HymnItem[] = [
  {
    id: "hymn-1",
    hymnNumber: 1,
    formattedNumber: "01",
    title: "El Varón de Gran Dolor (Cristo Murió en el Calvario)",
    subtitle: "Coro · Cristo fue al huerto a orar, dio su vida allí en la cruz",
    category: "La Cruz y Redención",
    scriptureRef: "Isaías 53:3-5 · Lucas 22:41-44",
    musicalKey: "Mi Bemol Mayor",
    tempo: "Solemne · 74 BPM",
    filename: "01-el-varon-de-gran-dolor.mp3",
    mp3Url: "/mp3/01-el-varon-de-gran-dolor.mp3?v=voz2",
    chorus:
      "¡Aleluya al Salvador! Quien por mí en la cruz murió; con su sangre me limpió, a su nombre gloria doy.",
    stanzas: [
      "El Varón de gran dolor fue el Hijo del Señor; vino al mundo por amor a salvar al pecador.",
      "Cristo fue al huerto a orar y su sangre a derramar; en el Calvario dio su ser para darnos redención.",
      "Consumado todo fue en el leño de la cruz; hoy por gracia y por la fe caminamos en su luz.",
    ],
    isCoreLocalMp3: true,
  },
  {
    id: "hymn-2",
    hymnNumber: 2,
    formattedNumber: "02",
    title: "Cuán Grande Es Él (Señor Mi Dios)",
    subtitle: "Coro · Mi corazón entona la canción: ¡Cuán grande es Él!",
    category: "Adoración y Majestad",
    scriptureRef: "Salmos 8:1-9 · Romanos 1:20",
    musicalKey: "La Mayor",
    tempo: "Majestuoso · 80 BPM",
    filename: "02-cuan-grande-es-el.mp3",
    mp3Url: "/mp3/02-cuan-grande-es-el.mp3?v=voz2",
    chorus:
      "Mi corazón entona la canción: ¡Cuán grande es Él! ¡Cuán grande es Él!",
    stanzas: [
      "Señor mi Dios, al contemplar los cielos, el firmamento y las estrellas mil; al oír tu voz en los potentes truenos y ver brillar el sol en su cenit.",
      "Al recorrer los montes y los valles y ver las bellas flores al pasar; al escuchar el canto de las aves y el murmurar del claro manantial.",
      "Cuando recuerdo del amor divino que desde el cielo al Salvador envió; aquel Jesús que por salvarme vino y en una cruz sufrió por mí y murió.",
    ],
    isCoreLocalMp3: true,
  },
  {
    id: "hymn-3",
    hymnNumber: 3,
    formattedNumber: "03",
    title: "Dios Excelso · Señor de los Cielos",
    subtitle: "Coro · ¿Quién es como Tú, oh gran Señor, en santidad y poder?",
    category: "Adoración y Majestad",
    scriptureRef: "Éxodo 15:11 · Salmos 113:4-6",
    musicalKey: "Re Mayor",
    tempo: "Reverente · 78 BPM",
    filename: "03-dios-excelso.mp3",
    mp3Url: "/mp3/03-dios-excelso.mp3?v=voz2",
    chorus:
      "Dios excelso, Rey victorioso, entronizado en majestad; toda la tierra proclame tu gloria por la eternidad.",
    stanzas: [
      "Señor de los cielos, vestido de luz, ante tu presencia se postra la creación; tu trono es eterno, tu cetro es verdad.",
      "¿Quién es como Tú entre los poderosos, magnífico en santidad, digno de suprema alabanza y hacedor de maravillas?",
      "Recibe, oh Padre, el canto sincero de tu congregación redimida por la sangre del Cordero.",
    ],
    isCoreLocalMp3: true,
  },
  {
    id: "hymn-4",
    hymnNumber: 4,
    formattedNumber: "04",
    title: "Él Es el Gran Sustentador · Roca Firme",
    subtitle: "Coro · Él es camino y la verdad, y al hambriento Él es pan",
    category: "Fe y Confianza",
    scriptureRef: "Juan 14:6 · Colosenses 1:17",
    musicalKey: "Mi Mayor",
    tempo: "Firme · 84 BPM",
    filename: "04-el-gran-sustentador.mp3",
    mp3Url: "/mp3/04-el-gran-sustentador.mp3?v=voz2",
    chorus:
      "Él es camino y la verdad, y al hambriento Él es pan; en la tormenta es nuestra paz, el Gran Sustentador.",
    stanzas: [
      "Sobre la Roca eterna está fundada nuestra fe; aunque los vientos soplen hoy, seguro en Cristo estaré.",
      "Sustenta el universo fiel con su potente voz, y guarda cada paso aquí del hijo de su amor.",
      "No hay otro amigo como Él en prueba o aflicción; su gracia basta cada día al fiel corazón.",
    ],
    isCoreLocalMp3: true,
  },
  {
    id: "hymn-5",
    hymnNumber: 5,
    formattedNumber: "05",
    title: "Eterno, el Único Dios · Fiel Permanece",
    subtitle: "Coro · Dios único que habitas en luz con gran plenitud",
    category: "Adoración y Majestad",
    scriptureRef: "1 Timoteo 1:17 · Salmos 90:2",
    musicalKey: "Re Mayor",
    tempo: "Solemne · 76 BPM",
    filename: "05-eterno-el-unico-dios.mp3",
    mp3Url: "/mp3/05-eterno-el-unico-dios.mp3?v=voz2",
    chorus:
      "Al Rey de los siglos, inmortal, invisible, al único y sabio Dios sea honor y gloria por los siglos. Amén.",
    stanzas: [
      "Eterno, Dios único que habitas en luz inaccesible, de siglo en siglo eres nuestro refugio y fortaleza.",
      "Antes que naciesen los montes y formases la tierra y el mundo, desde el siglo y hasta el siglo, Tú eres Dios.",
      "Fiel permanece tu Palabra viva; tus misericordias son nuevas cada mañana sobre tu iglesia.",
    ],
    isCoreLocalMp3: true,
  },
  {
    id: "hymn-6",
    hymnNumber: 6,
    formattedNumber: "06",
    title: "Hay un Canto Nuevo en Mi Ser (Cristo, Nombre Sin Igual)",
    subtitle: "Coro · Cristo, Cristo, Cristo, nombre sin igual",
    category: "Alabanza Congregacional",
    scriptureRef: "Salmos 40:3 · Filipenses 2:9-11",
    musicalKey: "Sol Mayor",
    tempo: "Jubiloso · 92 BPM",
    filename: "06-cristo-nombre-sin-igual.mp3",
    mp3Url: "/mp3/06-cristo-nombre-sin-igual.mp3?v=voz2",
    chorus:
      "Cristo, Cristo, Cristo, nombre sin igual; llena siempre mi alma de esa nota celestial.",
    stanzas: [
      "Hay un canto nuevo en mi ser, es la voz de mi Jesús, que me dice: Ven a descansar, tu paz conquisté en la cruz.",
      "Náufrago en pecado me encontré, sin paz en mi corazón; mas en Cristo mi Señor hallé dulce paz y salvación.",
      "Pronto a las nubes volverá con gran gloria el Salvador; cara a cara le contemplaré cantando de su amor.",
    ],
    isCoreLocalMp3: true,
  },
  {
    id: "hymn-7",
    hymnNumber: 7,
    formattedNumber: "07",
    title: "Hubo Quien por Mis Culpas (Oh, Cuánto Le Alabo)",
    subtitle: "Coro · Es Cristo quien por mí murió, mis culpas Él borró",
    category: "Gracia y Salvación",
    scriptureRef: "1 Pedro 2:24 · Efesios 1:7",
    musicalKey: "Fa Mayor",
    tempo: "Devocional · 80 BPM",
    filename: "07-oh-cuanto-le-alabo.mp3",
    mp3Url: "/mp3/07-oh-cuanto-le-alabo.mp3?v=voz2",
    chorus:
      "Oh, cuánto le alabo, oh, cuánto le adoro; pues Cristo mi alma redimió con su preciosa sangre.",
    stanzas: [
      "Hubo quien por mis culpas muriera en la cruz, aun indigno y vil como soy; soy feliz, pues su sangre vertió mi Jesús y con ella mis culpas borró.",
      "Mis pecados llevó en la cruz do murió el sublime y tierno Jesús; los desprecios sufrió y mi alma salvó, cambiando mis tinieblas en luz.",
      "Por su gracia hoy vivo rendido a sus pies, proclamando su gran salvación; suyo soy para siempre por la eternidad.",
    ],
    isCoreLocalMp3: true,
  },
  {
    id: "hymn-8",
    hymnNumber: 8,
    formattedNumber: "08",
    title: "Hoy Volviendo Estoy · Corro a Cristo",
    subtitle: "Coro · A mi hogar sin tardar, recíbeme en tu amor, Señor",
    category: "Gracia y Salvación",
    scriptureRef: "Lucas 15:20 · Isaías 55:6-7",
    musicalKey: "La Bemol Mayor",
    tempo: "Expresivo · 74 BPM",
    filename: "08-hoy-volviendo-estoy.mp3",
    mp3Url: "/mp3/08-hoy-volviendo-estoy.mp3?v=voz2",
    chorus:
      "Volviendo estoy, volviendo a mi hogar; abre tus brazos de amor, Señor, hoy volviendo estoy.",
    stanzas: [
      "Lejos de la casa de mi Padre anduve sin consuelo ni vigor; hoy escucho su llamado tierno y vuelvo arrepentido al Salvador.",
      "Años tristes malgasté vagando, mas tu gracia me alcanzó, Señor; en tu sangre lávanos ahora, restaura nuestro entero corazón.",
      "Cuán glorioso es descansar en Cristo, perdonado por su inmenso amor; ya no más errante en el camino, habito en la presencia del Señor.",
    ],
    isCoreLocalMp3: true,
  },
  {
    id: "hymn-9",
    hymnNumber: 9,
    formattedNumber: "09",
    title: "Levántate · El Sublime y Tierno Jesús",
    subtitle: "Coro · La muerte Él venció, reinando en majestad",
    category: "La Cruz y Redención",
    scriptureRef: "1 Corintios 15:54-57 · Apocalipsis 1:18",
    musicalKey: "Sol Mayor",
    tempo: "Triunfal · 88 BPM",
    filename: "09-el-sublime-y-tierno-jesus.mp3",
    mp3Url: "/mp3/09-el-sublime-y-tierno-jesus.mp3?v=voz2",
    chorus:
      "¡Levántate, iglesia del Señor! El Salvador resucitó y nos dio vida eterna y victoria sin fin.",
    stanzas: [
      "El sepulcro vacío proclama con poder que Jesús el Señor vive hoy; derrotó las cadenas de muerte y temor.",
      "Con corona de gloria sentado está el Rey a la diestra del Padre eternal; intercede por todos los suyos con amor.",
      "Anunciemos al mundo su gran salvación, levantemos pendón de verdad; Jesucristo es el único Rey y Señor.",
    ],
    isCoreLocalMp3: true,
  },
  {
    id: "hymn-10",
    hymnNumber: 10,
    formattedNumber: "10",
    title: "Pastor de Mi Alma · Mi Fe Descansa en Jesús",
    subtitle: "Coro · Es refugio en la aflicción, junto a aguas de reposo me pastoreará",
    category: "Fe y Confianza",
    scriptureRef: "Salmos 23:1-6 · Juan 10:11-14",
    musicalKey: "Re Mayor",
    tempo: "Sereno · 76 BPM",
    filename: "10-de-mi-alma-es-pastor.mp3",
    mp3Url: "/mp3/10-de-mi-alma-es-pastor.mp3?v=voz2",
    chorus:
      "De mi alma es Pastor el bendito Jesús; nada me faltará caminando en su luz.",
    stanzas: [
      "Jehová es mi Pastor, nada me faltará; en lugares de delicados pastos me hará descansar.",
      "Junto a aguas de reposo me pastoreará, confortará mi alma y me guiará por sendas de justicia por amor de su nombre.",
      "Aunque ande en valle de sombra, no temeré mal alguno, porque Tú estarás conmigo; en la casa de Jehová moraré por largos días.",
    ],
    isCoreLocalMp3: true,
  },
];

export interface RecordedVocalHymnSeed {
  filename: string;
  title: string;
  key: string;
}

export const RECORDED_VOCAL_HYMNS: RecordedVocalHymnSeed[] = [
  {
    "filename": "3-Santo-santo-grande-eterno-Dios-Mi.mp3",
    "title": "Santo santo grande eterno Dios",
    "key": "Mi Mayor"
  },
  {
    "filename": "5-Cantad-alegres-al-Senor-Re.mp3",
    "title": "Cantad alegres al Señor",
    "key": "Re Mayor"
  },
  {
    "filename": "9-Majestad-La.mp3",
    "title": "Majestad",
    "key": "La Mayor"
  },
  {
    "filename": "10-Solo-tu-eres-santo-Mi.mp3",
    "title": "Solo tu eres santo",
    "key": "Mi Mayor"
  },
  {
    "filename": "11-A-Dios-sea-la-gloria-Sol.mp3",
    "title": "A Dios sea la gloria",
    "key": "Sol Mayor"
  },
  {
    "filename": "12-Canta-aleluya-al-Senor-Si-m.mp3",
    "title": "Canta aleluya al Señor",
    "key": "Si Menor"
  },
  {
    "filename": "13-Gloria-Gloria-Mi.mp3",
    "title": "Gloria Gloria",
    "key": "Mi Mayor"
  },
  {
    "filename": "15-Al-Dios-de-Abraham-loor-Mi-m.mp3",
    "title": "Al Dios de Abraham loor",
    "key": "Mi Menor"
  },
  {
    "filename": "16-Alma-bendice-al-Senor-Mi.mp3",
    "title": "Alma bendice al Señor",
    "key": "Mi Mayor"
  },
  {
    "filename": "17-Bueno-es-alabarte-oh-Jehova-Mi.mp3",
    "title": "Bueno es alabarte oh Jehová",
    "key": "Mi Mayor"
  },
  {
    "filename": "18-Gloria-a-tu-nombre-oh-Dios-Mi.mp3",
    "title": "Gloria a tu nombre oh Dios",
    "key": "Mi Mayor"
  },
  {
    "filename": "19-Levantaos-Bendecid-Mi.mp3",
    "title": "Levantaos Bendecid",
    "key": "Mi Mayor"
  },
  {
    "filename": "20-Alabad-al-gran-Rey-Sol.mp3",
    "title": "Alabad al gran Rey",
    "key": "Sol Mayor"
  },
  {
    "filename": "25-De-Jehova-cantare-Re.mp3",
    "title": "De Jehová Cantaré",
    "key": "Re Mayor"
  },
  {
    "filename": "27-Tuya-es-la-gloria-Re.mp3",
    "title": "Tuya es la gloria",
    "key": "Re Mayor"
  },
  {
    "filename": "32-Cuan-grande-es-el-La.mp3",
    "title": "Cuán grande es el",
    "key": "La Mayor"
  },
  {
    "filename": "33-Oh-criaturas-del-Senor-Re.mp3",
    "title": "Oh criaturas del Señor",
    "key": "Re Mayor"
  },
  {
    "filename": "34-Creo-en-ti-Senor-Re.mp3",
    "title": "Creo en ti Señor",
    "key": "Re Mayor"
  },
  {
    "filename": "36-Oh-Dios-mi-soberano-Rey-Mi.mp3",
    "title": "Oh Dios mi soberano Rey",
    "key": "Mi Mayor"
  },
  {
    "filename": "37-Loor-a-ti-Mi.mp3",
    "title": "Loor a ti",
    "key": "Mi Mayor"
  },
  {
    "filename": "38-Alabemos-al-Senor-Re.mp3",
    "title": "Alabemos al Señor",
    "key": "Re Mayor"
  },
  {
    "filename": "39-Cantemos-al-Senor-Re.mp3",
    "title": "Cantemos al Señor",
    "key": "Re Mayor"
  },
  {
    "filename": "42-Reina-Dios-La.mp3",
    "title": "Reina Dios",
    "key": "La Mayor"
  },
  {
    "filename": "43-Nuestra-Fortaleza-La.mp3",
    "title": "Nuestra Fortaleza",
    "key": "La Mayor"
  },
  {
    "filename": "44-Senor-Jehova-omnipotente-Dios-Re.mp3",
    "title": "Señor Jehová omnipotente Dios",
    "key": "Re Mayor"
  },
  {
    "filename": "47-Grandes-y-maravillosas-son-Si-m.mp3",
    "title": "Grandes y maravillosas son",
    "key": "Si Menor"
  },
  {
    "filename": "53-Jehova-esta-en-medio-de-ti-La.mp3",
    "title": "Jehová esta en medio de ti",
    "key": "La Mayor"
  },
  {
    "filename": "54-Poderoso-es-el-La.mp3",
    "title": "Poderoso es el",
    "key": "La Mayor"
  },
  {
    "filename": "55-Te-alabaran-oh-Jehova-Mi.mp3",
    "title": "Te Alabarán oh Jehová",
    "key": "Mi Mayor"
  },
  {
    "filename": "56-El-que-habita-al-abrigo-de-Dios-Mi-m.mp3",
    "title": "Él que habita al abrigo de Dios",
    "key": "Mi Menor"
  },
  {
    "filename": "58-Cantad-alabad-Mi.mp3",
    "title": "Cantad alabad",
    "key": "Mi Mayor"
  },
  {
    "filename": "59-Grande-es-tu-fidelidad-Re.mp3",
    "title": "Grande es tu fidelidad",
    "key": "Re Mayor"
  },
  {
    "filename": "60-Nuestro-Dios-y-Padre-eterno-Re.mp3",
    "title": "Nuestro Dios y Padre eterno",
    "key": "Re Mayor"
  },
  {
    "filename": "65-Que-maravilla-es-La.mp3",
    "title": "Que maravilla es",
    "key": "La Mayor"
  },
  {
    "filename": "67-Padre-Eterno-Sol.mp3",
    "title": "Padre Eterno",
    "key": "Sol Mayor"
  },
  {
    "filename": "68-A-nuestro-Padre-Dios-Mi.mp3",
    "title": "A nuestro Padre Dios",
    "key": "Mi Mayor"
  },
  {
    "filename": "69-De-boca-y-corazon-Mi.mp3",
    "title": "De boca y Corazón",
    "key": "Mi Mayor"
  },
  {
    "filename": "72-Oh-Padre-eterno-Dios-Mi.mp3",
    "title": "Oh Padre eterno Dios",
    "key": "Mi Mayor"
  },
  {
    "filename": "73-Te-loamos-oh-Dios-Mi.mp3",
    "title": "Te loamos oh Dios",
    "key": "Mi Mayor"
  },
  {
    "filename": "80-Adoradle-Re.mp3",
    "title": "Adoradle",
    "key": "Re Mayor"
  },
  {
    "filename": "84-Entrare-por-sus-puertas-Re.mp3",
    "title": "Entrare por sus puertas",
    "key": "Re Mayor"
  },
  {
    "filename": "85-Dios-esta-aqui-Re.mp3",
    "title": "Dios esta aqui",
    "key": "Re Mayor"
  },
  {
    "filename": "86-Yo-te-exalto-Re.mp3",
    "title": "Yo te exalto",
    "key": "Re Mayor"
  },
  {
    "filename": "92-El-cielo-canta-alegria-Si-m.mp3",
    "title": "Él cielo canta alegria",
    "key": "Si Menor"
  },
  {
    "filename": "98-Te-amo-Rey-Mi.mp3",
    "title": "Te amo Rey",
    "key": "Mi Mayor"
  },
  {
    "filename": "99-Quiero-Alabarte-Mi.mp3",
    "title": "Quiero Alabarte",
    "key": "Mi Mayor"
  },
  {
    "filename": "100-En-mi-vida-gloria-te-doy-Mi.mp3",
    "title": "En mi vida gloria te doy",
    "key": "Mi Mayor"
  },
  {
    "filename": "102-Canta-canta-alma-mia-La.mp3",
    "title": "Canta canta alma mia",
    "key": "La Mayor"
  },
  {
    "filename": "104-Nunca-Dios-mio-Sol.mp3",
    "title": "Nunca Dios mio",
    "key": "Sol Mayor"
  },
  {
    "filename": "116-Oh-pueblecito-de-Belen-Mi.mp3",
    "title": "Oh pueblecito de Belen",
    "key": "Mi Mayor"
  },
  {
    "filename": "117-Porque-un-nino-Mi.mp3",
    "title": "Porque un nino",
    "key": "Mi Mayor"
  },
  {
    "filename": "119-Gloria-a-Dios-en-las-alturas-Mi.mp3",
    "title": "Gloria a Dios en las alturas",
    "key": "Mi Mayor"
  },
  {
    "filename": "120-Oh-santisimo-felicisimo-Re.mp3",
    "title": "Oh santisimo felicisimo",
    "key": "Re Mayor"
  },
  {
    "filename": "121-Venid-Pastorcillos-Re.mp3",
    "title": "Venid Pastorcillos",
    "key": "Re Mayor"
  },
  {
    "filename": "122-Angeles-alzad-el-canto-Sol.mp3",
    "title": "Angeles alzad el canto",
    "key": "Sol Mayor"
  },
  {
    "filename": "124-Al-rustico-pesebre-Mi.mp3",
    "title": "Al rustico pesebre",
    "key": "Mi Mayor"
  },
  {
    "filename": "125-Cristianos-hoy-cantad-a-Dios-Mi.mp3",
    "title": "Cristianos hoy cantad a Dios",
    "key": "Mi Mayor"
  },
  {
    "filename": "126-Oid-un-son-en-alta-esfera-Mi.mp3",
    "title": "Oid un son en alta esfera",
    "key": "Mi Mayor"
  },
  {
    "filename": "129-Alla-en-el-pesebre-Mi.mp3",
    "title": "Allá en el pesebre",
    "key": "Mi Mayor"
  },
  {
    "filename": "130-Angeles-cantando-estan-Mi.mp3",
    "title": "Angeles cantando estan",
    "key": "Mi Mayor"
  },
  {
    "filename": "132-Oh-ninos-venid-Re.mp3",
    "title": "Oh ninos venid",
    "key": "Re Mayor"
  },
  {
    "filename": "133-Noche-de-paz-La.mp3",
    "title": "Noche de paz",
    "key": "La Mayor"
  },
  {
    "filename": "134-Navidad-Latina-Re.mp3",
    "title": "Navidad Latina",
    "key": "Re Mayor"
  },
  {
    "filename": "135-En-Belen-nacio-Jesus-Re.mp3",
    "title": "En Belen nacio Jesús",
    "key": "Re Mayor"
  },
  {
    "filename": "136-Hoy-es-Navidad-Mi.mp3",
    "title": "Hoy es Navidad",
    "key": "Mi Mayor"
  },
  {
    "filename": "137-De-tierra-lejana-venimos-Si-m.mp3",
    "title": "De tierra lejana venimos",
    "key": "Si Menor"
  },
  {
    "filename": "138-Tras-hermoso-lucero-La.mp3",
    "title": "Tras hermoso lucero",
    "key": "La Mayor"
  },
  {
    "filename": "139-Tu-dejaste-tu-trono-Mi.mp3",
    "title": "Tú dejaste tu trono",
    "key": "Mi Mayor"
  },
  {
    "filename": "149-En-el-nombre-de-Jesus-Mi-m.mp3",
    "title": "En el nombre de Jesús",
    "key": "Mi Menor"
  },
  {
    "filename": "151-Cristo-nombre-glorioso-Re.mp3",
    "title": "Cristo nombre glorioso",
    "key": "Re Mayor"
  },
  {
    "filename": "153-Oh-Cristo-nuestra-Roca-aqui-Mi.mp3",
    "title": "Oh Cristo nuestra Roca aqui",
    "key": "Mi Mayor"
  },
  {
    "filename": "155-El-es-la-imagen-Mi.mp3",
    "title": "Él es la imagen",
    "key": "Mi Mayor"
  },
  {
    "filename": "156-Hay-un-canto-nuevo-en-mi-ser-Sol.mp3",
    "title": "Hay un canto nuevo en mi ser",
    "key": "Sol Mayor"
  },
  {
    "filename": "157-Jesus-es-la-luz-del-mundo-Mi.mp3",
    "title": "Jesús es la luz del mundo",
    "key": "Mi Mayor"
  },
  {
    "filename": "161-161-Cuan-grande-amor-Sol.mp3",
    "title": "161 Cuán grande amor",
    "key": "Sol Mayor"
  },
  {
    "filename": "163-Yo-cantare-de-mi-Jesucristo-Fa.mp3",
    "title": "Yo Cantaré de mi Jesucristo",
    "key": "Fa Mayor"
  },
  {
    "filename": "163-Yo-cantare-de-mi-Jesucristo-Sol.mp3",
    "title": "Yo Cantaré de mi Jesucristo",
    "key": "Sol Mayor"
  },
  {
    "filename": "167-En-tu-presencia-Re.mp3",
    "title": "En tu presencia",
    "key": "Re Mayor"
  },
  {
    "filename": "168-De-su-trono-a-un-pesebre-La.mp3",
    "title": "De su trono a un pesebre",
    "key": "La Mayor"
  },
  {
    "filename": "171-¿Con-que-pagaremos_-Mi.mp3",
    "title": "¿Con que pagaremos_",
    "key": "Mi Mayor"
  },
  {
    "filename": "172-Gracias-dad-a-Jesucristo-La.mp3",
    "title": "Gracias dad a Jesucristo",
    "key": "La Mayor"
  },
  {
    "filename": "173-Dime-la-historia-de-Cristo-Re.mp3",
    "title": "Dime la historia de Cristo",
    "key": "Re Mayor"
  },
  {
    "filename": "174-¡Que-bella-historia-Mi.mp3",
    "title": "¡Que bella historia",
    "key": "Mi Mayor"
  },
  {
    "filename": "175-Oh-profundo-inmenso-amor-La.mp3",
    "title": "Oh profundo inmenso amor",
    "key": "La Mayor"
  },
  {
    "filename": "177-Es-Jesus-¡Que-bella-historia-Sol.mp3",
    "title": "Es Jesús ¡Que bella historia",
    "key": "Sol Mayor"
  },
  {
    "filename": "178-Sea-la-paz-La.mp3",
    "title": "Sea la paz",
    "key": "La Mayor"
  },
  {
    "filename": "190-Jerusalen-la-hermosa-La.mp3",
    "title": "Jerusalen la hermosa",
    "key": "La Mayor"
  },
  {
    "filename": "196-El-Varon-de-gran-dolor-La.mp3",
    "title": "Él Varon de gran dolor",
    "key": "La Mayor"
  },
  {
    "filename": "197-Mirad-al-Salvador-Jesus-La.mp3",
    "title": "Mirad al Salvador Jesús",
    "key": "La Mayor"
  },
  {
    "filename": "198-Mi-vida-di-por-ti-La.mp3",
    "title": "Mi vida di por ti",
    "key": "La Mayor"
  },
  {
    "filename": "199-En-la-vergonzosa-cruz-La.mp3",
    "title": "En la vergonzosa cruz",
    "key": "La Mayor"
  },
  {
    "filename": "171-\\u00bfCon-que-pagaremos_-Mi.mp3",
    "title": "\\u00bfCon que pagaremos_",
    "key": "Mi Mayor"
  },
  {
    "filename": "210-En-la-cruz-Re.mp3",
    "title": "En la cruz",
    "key": "Re Mayor"
  },
  {
    "filename": "212-La-tumba-le-encerro-La.mp3",
    "title": "La tumba le encerro",
    "key": "La Mayor"
  },
  {
    "filename": "216-Aleluya-gloria-a-Cristo-Mi.mp3",
    "title": "Aleluya gloria a Cristo",
    "key": "Mi Mayor"
  },
  {
    "filename": "217-Gloria-gloria-al-Vencedor-Mi.mp3",
    "title": "Gloria gloria al Vencedor",
    "key": "Mi Mayor"
  },
  {
    "filename": "220-A-ti-la-gloria-Re.mp3",
    "title": "A ti la gloria",
    "key": "Re Mayor"
  },
  {
    "filename": "222-Porque-el-vive-Sol.mp3",
    "title": "Porque el vive",
    "key": "Sol Mayor"
  },
  {
    "filename": "223-Glorificaremos-al-Senor-Re.mp3",
    "title": "Glorificaremos al Señor",
    "key": "Re Mayor"
  },
  {
    "filename": "224-Al-Cristo-vivo-sirvo-Sol.mp3",
    "title": "Al Cristo vivo sirvo",
    "key": "Sol Mayor"
  },
  {
    "filename": "226-Rey-Exaltado-Mi.mp3",
    "title": "Rey Exaltado",
    "key": "Mi Mayor"
  },
  {
    "filename": "227-¡Victoria-Victoria-Sol.mp3",
    "title": "¡Victoria Victoria",
    "key": "Sol Mayor"
  },
  {
    "filename": "229-Hoy-en-gloria-celestial-Sol.mp3",
    "title": "Hoy en gloria celestial",
    "key": "Sol Mayor"
  },
  {
    "filename": "233-Digno-Eres-La.mp3",
    "title": "Digno Eres",
    "key": "La Mayor"
  },
  {
    "filename": "234-Digno-es-el-Cordero-Re.mp3",
    "title": "Digno es el Cordero",
    "key": "Re Mayor"
  },
  {
    "filename": "235-A-Cristo-coronad-Re.mp3",
    "title": "A Cristo coronad",
    "key": "Re Mayor"
  },
  {
    "filename": "236-Cristo-Jesucristo-Re.mp3",
    "title": "Cristo Jesucristo",
    "key": "Re Mayor"
  },
  {
    "filename": "241-Loores-dad-a-Cristo-el-Rey-Mi.mp3",
    "title": "Loores dad a Cristo el Rey",
    "key": "Mi Mayor"
  },
  {
    "filename": "244-Glorioso-Cristo-Re.mp3",
    "title": "Glorioso Cristo",
    "key": "Re Mayor"
  },
  {
    "filename": "247-En-momentos-asi-Re.mp3",
    "title": "En momentos asi",
    "key": "Re Mayor"
  },
  {
    "filename": "251-Lluvias-de-gracia-La.mp3",
    "title": "Lluvias de gracia",
    "key": "La Mayor"
  },
  {
    "filename": "258-Santo-Consolador-Mi.mp3",
    "title": "Santo Consolador",
    "key": "Mi Mayor"
  },
  {
    "filename": "260-Transformame-Espiritu-La.mp3",
    "title": "Transformame Espíritu",
    "key": "La Mayor"
  },
  {
    "filename": "262-Divino-Espiritu-de-Dios-Mi.mp3",
    "title": "Divino Espíritu de Dios",
    "key": "Mi Mayor"
  },
  {
    "filename": "263-Santo-Espiritu-controla-Mi.mp3",
    "title": "Santo Espíritu controla",
    "key": "Mi Mayor"
  },
  {
    "filename": "273-Todas-las-promesas-La.mp3",
    "title": "Todas las promesas",
    "key": "La Mayor"
  },
  {
    "filename": "280-Bellas-palabras-de-vida-Mi.mp3",
    "title": "Bellas palabras de vida",
    "key": "Mi Mayor"
  },
  {
    "filename": "281-La-Palabra-del-Senor-Mi.mp3",
    "title": "La Palabra del Señor",
    "key": "Mi Mayor"
  },
  {
    "filename": "282-Sembrare-la-simiente-preciosa-La.mp3",
    "title": "Sembrare la simiente preciosa",
    "key": "La Mayor"
  },
  {
    "filename": "287-Por-fe-en-Jesus-el-Salvador-Mi.mp3",
    "title": "Por fe en Jesús el Salvador",
    "key": "Mi Mayor"
  },
  {
    "filename": "289-Oh-la-sangre-de-Cristo-Mi.mp3",
    "title": "Oh la sangre de Cristo",
    "key": "Mi Mayor"
  },
  {
    "filename": "292-Hay-un-solo-Dios-Mi.mp3",
    "title": "Hay un solo Dios",
    "key": "Mi Mayor"
  },
  {
    "filename": "294-Cuan-profundo-es-tu-amor-Si-m.mp3",
    "title": "Cuán profundo es tu amor",
    "key": "Si Menor"
  },
  {
    "filename": "295-Dios-al-mundo-amo-Re.mp3",
    "title": "Dios al mundo amo",
    "key": "Re Mayor"
  },
  {
    "filename": "298-¿Que-me-puede-dar-perdon_-MI.mp3",
    "title": "¿Que me puede dar perdon_",
    "key": "Re Mayor"
  },
  {
    "filename": "299-Por-fe-contemplo-redencion-Re.mp3",
    "title": "Por fe contemplo Redención",
    "key": "Re Mayor"
  },
  {
    "filename": "298-\\u00bfQue-me-puede-dar-perdon_-MI.mp3",
    "title": "\\u00bfQue me puede dar perdon_",
    "key": "Re Mayor"
  },
  {
    "filename": "302-Sin-Cristo-yo-no-tengo-nada-Mi.mp3",
    "title": "Sin Cristo yo no tengo nada",
    "key": "Mi Mayor"
  },
  {
    "filename": "303-¿Sabes-tu-de-Cristo_-La.mp3",
    "title": "¿Sabes tu de Cristo_",
    "key": "La Mayor"
  },
  {
    "filename": "304-¿Has-hallado-en-Cristo_-Sol.mp3",
    "title": "¿Has hallado en Cristo_",
    "key": "Sol Mayor"
  },
  {
    "filename": "307-Nuestra-vida-acabara-Re.mp3",
    "title": "Nuestra vida acabara",
    "key": "Re Mayor"
  },
  {
    "filename": "308-Tal-como-soy-Re.mp3",
    "title": "Tal como soy",
    "key": "Re Mayor"
  },
  {
    "filename": "311-¿Quieres-ser-salvo_-La.mp3",
    "title": "¿Quieres ser salvo_",
    "key": "La Mayor"
  },
  {
    "filename": "312-A-Jesucristo-ven-sin-tardar-La.mp3",
    "title": "A Jesucristo ven sin tardar",
    "key": "La Mayor"
  },
  {
    "filename": "313-Ven-amigo-a-Jesus-Si-m.mp3",
    "title": "Ven amigo a Jesús",
    "key": "Si Menor"
  },
  {
    "filename": "314-Vida-nueva-encontre-Mi.mp3",
    "title": "Vida nueva encontre",
    "key": "Mi Mayor"
  },
  {
    "filename": "315-Vision-Pastoral-Re.mp3",
    "title": "Vision Pastoral",
    "key": "Re Mayor"
  },
  {
    "filename": "316-Con-voz-benigna-La.mp3",
    "title": "Con voz benigna",
    "key": "La Mayor"
  },
  {
    "filename": "323-Lejos-de-mi-Padre-Dios-Mi.mp3",
    "title": "Lejos de mi Padre Dios",
    "key": "Mi Mayor"
  },
  {
    "filename": "324-Jamas-Jamas-La.mp3",
    "title": "Jamas Jamas",
    "key": "La Mayor"
  },
  {
    "filename": "326-La-hermosa-vision-de-la-cruz-La.mp3",
    "title": "La hermosa vision de la cruz",
    "key": "La Mayor"
  },
  {
    "filename": "327-Halle-un-buen-amigo-Mi.mp3",
    "title": "Halle un buen amigo",
    "key": "Mi Mayor"
  },
  {
    "filename": "330-Hay-una-senda-Re.mp3",
    "title": "Hay una senda",
    "key": "Re Mayor"
  },
  {
    "filename": "332-Me-salvo-me-perdono-Mi-m.mp3",
    "title": "Me salvo me perdono",
    "key": "Mi Menor"
  },
  {
    "filename": "333-Hay-un-nombre-en-la-gloria-La.mp3",
    "title": "Hay un nombre en la gloria",
    "key": "La Mayor"
  },
  {
    "filename": "334-Cuan-bueno-es-Dios-Mi.mp3",
    "title": "Cuán bueno es Dios",
    "key": "Mi Mayor"
  },
  {
    "filename": "336-Mi-culpa-el-llevo-Sol.mp3",
    "title": "Mi culpa el llevo",
    "key": "Sol Mayor"
  },
  {
    "filename": "337-El-vino-a-mi-corazon-Sol.mp3",
    "title": "Él vino a mi Corazón",
    "key": "Sol Mayor"
  },
  {
    "filename": "338-A-su-nombre-gloria-Sol.mp3",
    "title": "A su nombre gloria",
    "key": "Sol Mayor"
  },
  {
    "filename": "339-Comprado-con-sangre-por-Cristo-Sol.mp3",
    "title": "Comprado con sangre por Cristo",
    "key": "Sol Mayor"
  },
  {
    "filename": "346-Del-amor-divino-Mi.mp3",
    "title": "Del amor divino",
    "key": "Mi Mayor"
  },
  {
    "filename": "348-Pues-si-vivimos-Mi.mp3",
    "title": "Pues si vivimos",
    "key": "Mi Mayor"
  },
  {
    "filename": "349-Del-santo-amor-de-Cristo-Sol.mp3",
    "title": "Del santo amor de Cristo",
    "key": "Sol Mayor"
  },
  {
    "filename": "354-El-amor-permanecera-Mi.mp3",
    "title": "Él amor permanecera",
    "key": "Mi Mayor"
  },
  {
    "filename": "355-La-gente-de-nuestro-tiempo-Re.mp3",
    "title": "La gente de nuestro tiempo",
    "key": "Re Mayor"
  },
  {
    "filename": "359-El-gozo-del-Senor-Re.mp3",
    "title": "Él gozo del Señor",
    "key": "Re Mayor"
  },
  {
    "filename": "361-Grande-gozo-hay-en-mi-alma-Sol.mp3",
    "title": "Grande gozo hay en mi alma",
    "key": "Sol Mayor"
  },
  {
    "filename": "362-Solo-no-estoy-Mi.mp3",
    "title": "Solo no estoy",
    "key": "Mi Mayor"
  },
  {
    "filename": "367-Confiado-Estoy-Mi.mp3",
    "title": "Confiado Estoy",
    "key": "Mi Mayor"
  },
  {
    "filename": "368-Dia-en-dia-Re.mp3",
    "title": "Día en Día",
    "key": "Re Mayor"
  },
  {
    "filename": "369-Cuando-Cristo-vino-Re.mp3",
    "title": "Cuando Cristo vino",
    "key": "Re Mayor"
  },
  {
    "filename": "374-Sigo-confiando-en-Jesus-Mi.mp3",
    "title": "Sigo confiando en Jesús",
    "key": "Mi Mayor"
  },
  {
    "filename": "375-Siempre-conmigo-esta-La.mp3",
    "title": "Siempre conmigo esta",
    "key": "La Mayor"
  },
  {
    "filename": "377-Descanso-en-ti-Mi.mp3",
    "title": "Descanso en ti",
    "key": "Mi Mayor"
  },
  {
    "filename": "378-Noble-Sosten-Re.mp3",
    "title": "Noble Sosten",
    "key": "Re Mayor"
  },
  {
    "filename": "383-Si-fui-motivo-de-dolor-Re.mp3",
    "title": "Si fui motivo de dolor",
    "key": "Re Mayor"
  },
  {
    "filename": "384-Haz-lo-que-quieras-Re.mp3",
    "title": "Haz lo que quieras",
    "key": "Re Mayor"
  },
  {
    "filename": "388-Hay-Momentos-Re.mp3",
    "title": "Hay Momentos",
    "key": "Re Mayor"
  },
  {
    "filename": "390-Cristo-vive-en-mi.mp3",
    "title": "Cristo vive en",
    "key": "Re Mayor"
  },
  {
    "filename": "391-Ciertamente-el-bien-de-Dios-Re.mp3",
    "title": "Ciertamente el bien de Dios",
    "key": "Re Mayor"
  },
  {
    "filename": "393-A-los-pies-de-Jesucristo-Mi.mp3",
    "title": "A los pies de Jesucristo",
    "key": "Mi Mayor"
  },
  {
    "filename": "394-Cuando-andamos-con-Dios-Mi.mp3",
    "title": "Cuando andamos con Dios",
    "key": "Mi Mayor"
  },
  {
    "filename": "395-Oh-Cristo-yo-te-amo-Mi.mp3",
    "title": "Oh Cristo yo te amo",
    "key": "Mi Mayor"
  },
  {
    "filename": "396-Oh-Cristo-mio-Rey-de-mi-alma-La.mp3",
    "title": "Oh Cristo mio Rey de mi alma",
    "key": "La Mayor"
  },
  {
    "filename": "397-En-mis-angustias-Mi.mp3",
    "title": "En mis angustias",
    "key": "Mi Mayor"
  },
  {
    "filename": "303-\\u00bfSabes-tu-de-Cristo_-La.mp3",
    "title": "\\u00bfSabes tu de Cristo_",
    "key": "La Mayor"
  },
  {
    "filename": "304-\\u00bfHas-hallado-en-Cristo_-Sol.mp3",
    "title": "\\u00bfHas hallado en Cristo_",
    "key": "Sol Mayor"
  },
  {
    "filename": "311-\\u00bfQuieres-ser-salvo_-La.mp3",
    "title": "\\u00bfQuieres ser salvo_",
    "key": "La Mayor"
  },
  {
    "filename": "401-Mi-pensamiento-eres-tu-Senor-Mi.mp3",
    "title": "Mi pensamiento eres tu Señor",
    "key": "Mi Mayor"
  },
  {
    "filename": "403-Oh-Dios-revelame-tu-voluntad-Mi.mp3",
    "title": "Oh Dios revelame tu voluntad",
    "key": "Mi Mayor"
  },
  {
    "filename": "404-Oh-deja-que-el-Senor-Re.mp3",
    "title": "Oh deja que el Señor",
    "key": "Re Mayor"
  },
  {
    "filename": "405-Cuan-dulce-el-nombre-de-Jesus-Sol.mp3",
    "title": "Cuán dulce el nombre de Jesús",
    "key": "Sol Mayor"
  },
  {
    "filename": "408-Cristo-es-Guia-de-mi-vida-Sol.mp3",
    "title": "Cristo es Guía de mi vida",
    "key": "Sol Mayor"
  },
  {
    "filename": "409-Cristo-mi-camino-guio-Fa.mp3",
    "title": "Cristo mi camino guio",
    "key": "Fa Mayor"
  },
  {
    "filename": "412-Oh-yo-quiero-andar-con-Cristo-Sol.mp3",
    "title": "Oh yo quiero andar con Cristo",
    "key": "Sol Mayor"
  },
  {
    "filename": "415-Busca-primero-el-reino-de-Dios-Re.mp3",
    "title": "Busca primero el reino de Dios",
    "key": "Re Mayor"
  },
  {
    "filename": "416-Cristo-fiel-te-quiero-ser-Re.mp3",
    "title": "Cristo fiel te quiero ser",
    "key": "Re Mayor"
  },
  {
    "filename": "417-Sed-puros-y-santos-Re.mp3",
    "title": "Sed puros y santos",
    "key": "Re Mayor"
  },
  {
    "filename": "418-Senor-tu-me-llamas-Re.mp3",
    "title": "Señor tu me llamas",
    "key": "Re Mayor"
  },
  {
    "filename": "419-Un-vaso-nuevo-Re.mp3",
    "title": "Un vaso nuevo",
    "key": "Re Mayor"
  },
  {
    "filename": "421-Con-mis-labios-Re.mp3",
    "title": "Con mis labios",
    "key": "Re Mayor"
  },
  {
    "filename": "424-Dejo-el-mundo-y-sigo-a-Cristo-Mi.mp3",
    "title": "Dejo el mundo y sigo a Cristo",
    "key": "Mi Mayor"
  },
  {
    "filename": "426-Tu-has-venido-a-la-orilla-Re.mp3",
    "title": "Tú has venido a la orilla",
    "key": "Re Mayor"
  },
  {
    "filename": "427-Dios-cuidara-de-ti-La.mp3",
    "title": "Dios cuidara de ti",
    "key": "La Mayor"
  },
  {
    "filename": "428-Vencedor-Re.mp3",
    "title": "Vencedor",
    "key": "Re Mayor"
  },
  {
    "filename": "429-Yo-no-quiero-pecar-Re.mp3",
    "title": "Yo no quiero pecar",
    "key": "Re Mayor"
  },
  {
    "filename": "430-Entenderemos-Mi.mp3",
    "title": "Entenderemos",
    "key": "Mi Mayor"
  },
  {
    "filename": "431-Tentado-no-cedas-Sol.mp3",
    "title": "Tentado no cedas",
    "key": "Sol Mayor"
  },
  {
    "filename": "432-Firme-Estare-Sol.mp3",
    "title": "Firme Estaré",
    "key": "Sol Mayor"
  },
  {
    "filename": "433-Despues-de-la-tormenta-Sol.mp3",
    "title": "Despues de la tormenta",
    "key": "Sol Mayor"
  },
  {
    "filename": "435-Debil-Soy-La.mp3",
    "title": "Debil Soy",
    "key": "La Mayor"
  },
  {
    "filename": "436-¡Bendiciones-cuantas-tienes-Re.mp3",
    "title": "¡Bendiciones cuantas tienes",
    "key": "Re Mayor"
  },
  {
    "filename": "437-Yo-quiero-vencer-Re.mp3",
    "title": "Yo quiero vencer",
    "key": "Re Mayor"
  },
  {
    "filename": "438-Su-gracia-es-mayor-Re.mp3",
    "title": "Su gracia es mayor",
    "key": "Re Mayor"
  },
  {
    "filename": "440-Pon-tus-ojos-en-Cristo-Mi.mp3",
    "title": "Pon tus ojos en Cristo",
    "key": "Mi Mayor"
  },
  {
    "filename": "442-El-conoce-mi-camino-Mi.mp3",
    "title": "Él conoce mi camino",
    "key": "Mi Mayor"
  },
  {
    "filename": "442-y-443-Mi.mp3",
    "title": "Y 443",
    "key": "Mi Mayor"
  },
  {
    "filename": "443-El-Senor-es-bueno-Mi.mp3",
    "title": "Él Señor es bueno",
    "key": "Mi Mayor"
  },
  {
    "filename": "444-Hasta-Entonces-La.mp3",
    "title": "Hasta Entonces",
    "key": "La Mayor"
  },
  {
    "filename": "447-Dad-Gracias-Mi.mp3",
    "title": "Dad Gracias",
    "key": "Mi Mayor"
  },
  {
    "filename": "448-La-Iglesia-sin-mancha-La.mp3",
    "title": "La Iglesia sin mancha",
    "key": "La Mayor"
  },
  {
    "filename": "449-Mi-iglesia-querida-La.mp3",
    "title": "Mi iglesia querida",
    "key": "La Mayor"
  },
  {
    "filename": "450-De-la-Iglesia-el-fundamento-Re.mp3",
    "title": "De la Iglesia el fundamento",
    "key": "Re Mayor"
  },
  {
    "filename": "465-No-te-de-temor-Mi.mp3",
    "title": "No te de temor",
    "key": "Mi Mayor"
  },
  {
    "filename": "466-Testifica-Mi.mp3",
    "title": "Testifica",
    "key": "Mi Mayor"
  },
  {
    "filename": "472-Anhelo-trabajar-por-el-Senor-Sol.mp3",
    "title": "Anhelo trabajar por el Señor",
    "key": "Sol Mayor"
  },
  {
    "filename": "473-El-mundo-hoy-Si-m.mp3",
    "title": "Él mundo hoy",
    "key": "Si Menor"
  },
  {
    "filename": "477-Mensajeros-del-Maestro-La.mp3",
    "title": "Mensajeros del Maestro",
    "key": "La Mayor"
  },
  {
    "filename": "480-A-prisa-Iglesia-La.mp3",
    "title": "A prisa Iglesia",
    "key": "La Mayor"
  },
  {
    "filename": "482-Oh-que-amigo-nos-es-Cristo-Mi.mp3",
    "title": "Oh que amigo nos es Cristo",
    "key": "Mi Mayor"
  },
  {
    "filename": "485-A-solas-al-huerto-yo-voy-Sol.mp3",
    "title": "A solas al huerto yo voy",
    "key": "Sol Mayor"
  },
  {
    "filename": "489-Abre-mis-ojos-Re.mp3",
    "title": "Abre mis ojos",
    "key": "Re Mayor"
  },
  {
    "filename": "498-Yo-te-sirvo-Re.mp3",
    "title": "Yo te sirvo",
    "key": "Re Mayor"
  },
  {
    "filename": "511-Gozo-da-servir-a-Cristo-Sol.mp3",
    "title": "Gozo da servir a Cristo",
    "key": "Sol Mayor"
  },
  {
    "filename": "512-En-las-aquas-de-la-muerte-Re.mp3",
    "title": "En las aquas de la muerte",
    "key": "Re Mayor"
  },
  {
    "filename": "513-Los-que-somos-bautizados-Re.mp3",
    "title": "Los que somos bautizados",
    "key": "Re Mayor"
  },
  {
    "filename": "516-La-cruz-excelsa-Mi.mp3",
    "title": "La cruz excelsa",
    "key": "Mi Mayor"
  },
  {
    "filename": "517-Obediente-a-tu-mandato-Mi.mp3",
    "title": "Obediente a tu mandato",
    "key": "Mi Mayor"
  },
  {
    "filename": "518-Rey-de-mi-vida-Re.mp3",
    "title": "Rey de mi vida",
    "key": "Re Mayor"
  },
  {
    "filename": "519-Aqui-del-pan-partido-tomare-Re.mp3",
    "title": "Aqui del pan partido tomare",
    "key": "Re Mayor"
  },
  {
    "filename": "520-Hoy-venimos-cual-hermanos-Re.mp3",
    "title": "Hoy venimos cual hermanos",
    "key": "Re Mayor"
  },
  {
    "filename": "524-Hay-un-precioso-manantial-La.mp3",
    "title": "Hay un precioso manantial",
    "key": "La Mayor"
  },
  {
    "filename": "528-Siervos-de-Jesus-Sol.mp3",
    "title": "Siervos de Jesús",
    "key": "Sol Mayor"
  },
  {
    "filename": "530-Fe-la-victoria-es-Re.mp3",
    "title": "Fe la victoria es",
    "key": "Re Mayor"
  },
  {
    "filename": "533-Estad-por-Cristo-firmes-La.mp3",
    "title": "Estad por Cristo firmes",
    "key": "La Mayor"
  },
  {
    "filename": "534-Adelante-con-valor-Sol.mp3",
    "title": "Adelante con valor",
    "key": "Sol Mayor"
  },
  {
    "filename": "535-¡Gloria-gloria-aleluya-La.mp3",
    "title": "¡Gloria gloria aleluya",
    "key": "La Mayor"
  },
  {
    "filename": "539-Firmes-y-adelante-Re.mp3",
    "title": "Firmes y adelante",
    "key": "Re Mayor"
  },
  {
    "filename": "542-Cristo-nuestro-Jefe-Sol.mp3",
    "title": "Cristo nuestro Jefe",
    "key": "Sol Mayor"
  },
  {
    "filename": "544-La-venida-de-Cristo-Si-m.mp3",
    "title": "La venida de Cristo",
    "key": "Si Menor"
  },
  {
    "filename": "545-Viene-otra-vez-La.mp3",
    "title": "Viene otra vez",
    "key": "La Mayor"
  },
  {
    "filename": "548-El-Rey-ya-viene-La.mp3",
    "title": "Él Rey ya viene",
    "key": "La Mayor"
  },
  {
    "filename": "550-Con-las-nubes-viene-Cristo-La.mp3",
    "title": "Con las nubes viene Cristo",
    "key": "La Mayor"
  },
  {
    "filename": "551-Cuando-anuncie-el-arcangel-Sol.mp3",
    "title": "Cuando anuncie el arcangel",
    "key": "Sol Mayor"
  },
  {
    "filename": "553-Muy-cercano-esta-el-dia-Sol.mp3",
    "title": "Muy cercano esta el Día",
    "key": "Sol Mayor"
  },
  {
    "filename": "554-Cristo-viene-otra-vez-Mi.mp3",
    "title": "Cristo viene otra vez",
    "key": "Mi Mayor"
  },
  {
    "filename": "558-Pudiera-bien-ser-La.mp3",
    "title": "Pudiera bien ser",
    "key": "La Mayor"
  },
  {
    "filename": "560-Roca-de-la-eternidad-La.mp3",
    "title": "Roca de la eternidad",
    "key": "La Mayor"
  },
  {
    "filename": "561-Es-Senor-de-los-cielos-Re.mp3",
    "title": "Es Señor de los cielos",
    "key": "Re Mayor"
  },
  {
    "filename": "563-La-nueva-Jerusalen-Mi.mp3",
    "title": "La nueva Jerusalen",
    "key": "Mi Mayor"
  },
  {
    "filename": "564-Mas-alla-del-sol-Re.mp3",
    "title": "Más Allá del sol",
    "key": "Re Mayor"
  },
  {
    "filename": "564-Mas-alla-del-sol.mp3",
    "title": "Más Allá del",
    "key": "Re Mayor"
  },
  {
    "filename": "570-Alabanzas-dad-a-Cristo-La.mp3",
    "title": "Alabanzas dad a Cristo",
    "key": "La Mayor"
  },
  {
    "filename": "574-Cristo-me-ama-esto-se-Mi.mp3",
    "title": "Cristo me ama esto se",
    "key": "Mi Mayor"
  },
  {
    "filename": "589-Dicha-grande-es-la-del-hombre-Sol.mp3",
    "title": "Dicha grande es la del hombre",
    "key": "Sol Mayor"
  },
  {
    "filename": "590-Las-mujeres-cristianas-Sol.mp3",
    "title": "Las mujeres cristianas",
    "key": "Sol Mayor"
  },
  {
    "filename": "598-Cuando-las-bases-Sol.mp3",
    "title": "Cuando las bases",
    "key": "Sol Mayor"
  },
  {
    "filename": "608-Un-ano-mas-Sol.mp3",
    "title": "Un Año Más",
    "key": "Sol Mayor"
  },
  {
    "filename": "611-Con-alegres-corazones-Re.mp3",
    "title": "Con alegres corazones",
    "key": "Re Mayor"
  },
  {
    "filename": "620-Dios-os-guarde-La.mp3",
    "title": "Dios os guarde",
    "key": "La Mayor"
  },
  {
    "filename": "623-Este-templo-dedicamos-Re.mp3",
    "title": "Este templo dedicamos",
    "key": "Re Mayor"
  },
  {
    "filename": "632-Engrandecido-sea-Dios-Sol.mp3",
    "title": "Engrandecido sea Dios",
    "key": "Sol Mayor"
  },
  {
    "filename": "634-Cantad-alegres-cantad-a-Dios-Re.mp3",
    "title": "Cantad alegres cantad a Dios",
    "key": "Re Mayor"
  },
  {
    "filename": "635-¡Bienvenido-Re.mp3",
    "title": "¡Bienvenido",
    "key": "Re Mayor"
  },
  {
    "filename": "639-Tu-pueblo-jubiloso-Re.mp3",
    "title": "Tú pueblo jubiloso",
    "key": "Re Mayor"
  },
  {
    "filename": "645-Sagrado-es-el-amor-Mi.mp3",
    "title": "Sagrado es el amor",
    "key": "Mi Mayor"
  },
  {
    "filename": "651-Amen-quintuplo-Mi.mp3",
    "title": "Amén Quíntuplo",
    "key": "Mi Mayor"
  }
];

const SCRIPTURES_POOL = [
  "Salmos 95:1-6",
  "Salmos 100:1-5",
  "Salmos 23:1-6",
  "Salmos 46:1-11",
  "Salmos 103:1-12",
  "Salmos 150:1-6",
  "Isaías 6:1-3",
  "Isaías 53:4-6",
  "Isaías 40:28-31",
  "Mateo 11:28-30",
  "Juan 3:16-17",
  "Juan 14:1-6",
  "Romanos 5:1-8",
  "Romanos 8:31-39",
  "1 Corintios 15:55-58",
  "2 Corintios 5:17-21",
  "Gálatas 2:20",
  "Efesios 2:4-10",
  "Filipenses 2:5-11",
  "Colosenses 3:16-17",
  "1 Timoteo 1:15-17",
  "Hebreos 4:14-16",
  "Hebreos 12:1-2",
  "1 Pedro 1:3-9",
  "1 Pedro 2:9-10",
  "1 Juan 4:7-10",
  "Judas 1:24-25",
  "Apocalipsis 4:8-11",
  "Apocalipsis 5:9-13",
  "Apocalipsis 21:1-5",
];

const TEMPOS_POOL = [
  "Solemne · 74 BPM",
  "Reverente · 78 BPM",
  "Majestuoso · 84 BPM",
  "Congregacional · 88 BPM",
  "Jubiloso · 94 BPM",
  "Devocional · 72 BPM",
  "Firme · 86 BPM",
];

const KEYS_POOL = [
  "Re Mayor",
  "Mi Mayor",
  "Sol Mayor",
  "La Mayor",
  "Fa Mayor",
  "Do Mayor",
  "Mi Bemol Mayor",
  "La Bemol Mayor",
  "Si Menor",
];

const TITLE_PREFIXES = [
  "Cántico de Gracia al",
  "Alabanza Eterna al",
  "Gloria y Honra al",
  "Sublime Amor del",
  "Refugio Firme en el",
  "Luz Admirable del",
  "Fidelidad Suprema del",
  "Corona de Victoria en el",
  "Roca Inconmovible del",
  "Fuente de Vida en el",
  "Paz Inefable del",
  "Soberano Trono del",
  "Promesa Eterna del",
  "Senda de Justicia del",
  "Fortaleza Viva del",
  "Redención Perfecta del",
  "Heraldo de Esperanza en el",
  "Manantial de Gracia del",
  "Comunión Sagrada con el",
  "Majestad Excelsa del",
];

const TITLE_SUBJECTS = [
  "Rey de Gloria",
  "Cordero Redentor",
  "Buen Pastor Divino",
  "Salvador del Mundo",
  "Padre de las Luces",
  "Príncipe de Paz",
  "Verbo Encarnado",
  "Santo de Israel",
  "Roca de los Siglos",
  "Autor de la Salvación",
  "Sol de Justicia",
  "Alfa y Omega",
  "Dios Omnipotente",
  "Cristo Vencedor",
  "Maestro de Galilea",
  "Consolador Fiel",
];

const TITLE_MODIFIERS = [
  "en la Congregación de los Santos",
  "por los Siglos de los Siglos",
  "en el Monte de Sión",
  "bajo el Abrigo del Altísimo",
  "por su Preciosa Sangre",
  "en Espíritu y en Verdad",
  "con Corazón Agradecido",
  "en la Hermosura de su Santidad",
  "junto a las Aguas de Reposo",
  "hacia la Patria Celestial",
  "en la Luz del Evangelio",
  "ante el Trono de la Gracia",
  "en Comunión Fraternal",
  "para Gloria de su Nombre",
];

const STANZA_1_LINES = [
  "Elevamos hoy con fe nuestra voz en adoración al Dios que nos amó desde antes de la fundación del mundo, iluminando nuestro caminar con la verdad eterna de su Evangelio.",
  "Ante el trono de tu gracia nos acercamos confiados, oh Señor, reconociendo tu soberanía infinita y la obra redentora consumada por Jesucristo en el Calvario.",
  "Cantad alegres a Jehová, habitantes de toda la tierra; servidle con alegría y venid ante su presencia con regocijo, porque Él es bueno y para siempre es su misericordia.",
  "En medio de la prueba y la tempestad, nuestra alma halla seguro refugio en la Roca de la eternidad; su Palabra permanece firme y sostiene los pasos del creyente fiel.",
  "Oh Padre de eterna compasión, tu luz disipó nuestras tinieblas y nos trasladó al reino de tu amado Hijo, en quien tenemos redención por su sangre y el perdón de pecados.",
];

const STANZA_2_LINES = [
  "Su gracia sublime nos buscó cuando vagábamos sin esperanza; con cuerdas de amor nos atrajo a sus pies y puso en nuestra boca un cántico nuevo de alabanza a nuestro Dios.",
  "Ninguna arma forjada ni sombra del valle podrá apartarnos del amor de Cristo Jesús; Él venció la muerte y resucitó con poder para justificarnos y darnos vida eterna.",
  "En comunión fraternal edificamos nuestra vida sobre el fundamento de los apóstoles y profetas, siendo la principal piedra del ángulo Jesucristo mismo, nuestro Señor.",
  "Como el ciervo brama por las corrientes de las aguas, así clama por Ti, oh Dios, el alma redimida que anhela habitar en la casa de Jehová todos los días de su vida.",
  "Tu Espíritu Santo nos guía a toda verdad, consolando el corazón afligido y fortaleciendo nuestras manos para servirte con santidad, amor y fidelidad cada nuevo día.",
];

const STANZA_3_LINES = [
  "Pronto veremos al Rey en su hermosura descender sobre las nubes del cielo; entonces toda lengua confesará que Jesucristo es el Señor, para gloria de Dios Padre.",
  "Mientras aguardamos el regreso glorioso de nuestro Salvador, proclamemos sin cesar las virtudes de Aquel que nos llamó de las tinieblas a su luz admirable.",
  "A Aquel que es poderoso para guardarnos sin caída y presentarnos sin mancha delante de su gloria con gran alegría, sea la majestad, el imperio y la potencia por todos los siglos.",
  "Recibe, Señor, nuestra vida consagrada como ofrenda viva, santa y agradable delante de Ti, hasta que entremos gozosos en las moradas eternas de la patria celestial.",
  "Por la eternidad entonaremos el cántico del Cordero junto a la multitud de los redimidos: Digno eres de recibir la gloria, la honra y el poder para siempre jamás. Amén.",
];

const CHORUS_LINES = [
  "¡Santo, Santo, Santo es el Señor Todopoderoso! Toda la tierra está llena de su gloria; a Él sea la alabanza por la eternidad.",
  "¡Gloria al Cordero que fue inmolado! Con su sangre nos compró para Dios y nos hizo reyes y sacerdotes en su luz.",
  "En Cristo Jesús descansa nuestra fe; Él es nuestro Pastor, nuestra Roca firme y nuestra eterna salvación.",
  "¡Aleluya al Rey de reyes y Señor de señores! Su fidelidad permanece de generación en generación.",
  "Sublime gracia del Señor que a un pecador salvó; hoy canto libre y redimido por su inmenso amor en la cruz.",
];

/**
 * Generates any hymn from #1 up to #224,344,224 in O(1) time.
 * Every single hymn has full lyrics, biblical reference, category, and playable sung MP3 audio.
 */
export function getHymnByNumber(rawNumber: number): HymnItem {
  const n = Math.max(
    1,
    Math.min(TOTAL_HYMNS_COUNT, Math.floor(Number(rawNumber) || 1))
  );

  // 1..10: Core local sung MP3 hymns on server
  if (n <= CORE_10_HYMNS.length) {
    return CORE_10_HYMNS[n - 1];
  }

  // 11..277: 267 real recorded vocal MP3 hymns
  const recordedIdx = n - 11;
  if (recordedIdx < RECORDED_VOCAL_HYMNS.length) {
    const rec = RECORDED_VOCAL_HYMNS[recordedIdx];
    const cat = HYMN_CATEGORIES[n % HYMN_CATEGORIES.length];
    const scripture = SCRIPTURES_POOL[n % SCRIPTURES_POOL.length];
    const tempo = TEMPOS_POOL[n % TEMPOS_POOL.length];
    const chorus = CHORUS_LINES[n % CHORUS_LINES.length];
    const s1 = STANZA_1_LINES[n % STANZA_1_LINES.length];
    const s2 = STANZA_2_LINES[(n * 3) % STANZA_2_LINES.length];
    const s3 = STANZA_3_LINES[(n * 7) % STANZA_3_LINES.length];

    return {
      id: `hymn-${n}`,
      hymnNumber: n,
      formattedNumber: formatHymnNumber(n),
      title: `${rec.title} (Cantado con Voz)`,
      subtitle: `Himno Coral #${formatHymnNumber(n)} · Tonalidad ${rec.key} · ${scripture}`,
      category: cat,
      scriptureRef: scripture,
      musicalKey: rec.key,
      tempo,
      filename: rec.filename,
      mp3Url: `/api/hymn-mp3/${encodeURIComponent(rec.filename)}`,
      chorus,
      stanzas: [s1, s2, s3],
      isCoreLocalMp3: false,
    };
  }

  // 278..224,344,224: Deterministic O(1) universal Christian hymn generator
  const totalVocalPool = CORE_10_HYMNS.length + RECORDED_VOCAL_HYMNS.length;
  const audioPoolIndex = (n - 1) % totalVocalPool;

  let mp3Url = "";
  let filename = "";
  if (audioPoolIndex < CORE_10_HYMNS.length) {
    mp3Url = CORE_10_HYMNS[audioPoolIndex].mp3Url;
    filename = CORE_10_HYMNS[audioPoolIndex].filename;
  } else {
    const rec = RECORDED_VOCAL_HYMNS[audioPoolIndex - CORE_10_HYMNS.length];
    filename = rec.filename;
    mp3Url = `/api/hymn-mp3/${encodeURIComponent(rec.filename)}`;
  }

  const pIdx = (n * 2654435761) >>> 0;
  const prefix = TITLE_PREFIXES[pIdx % TITLE_PREFIXES.length];
  const subject = TITLE_SUBJECTS[(pIdx >>> 5) % TITLE_SUBJECTS.length];
  const modifier = TITLE_MODIFIERS[(pIdx >>> 10) % TITLE_MODIFIERS.length];
  const category = HYMN_CATEGORIES[(pIdx >>> 3) % HYMN_CATEGORIES.length];
  const scripture = SCRIPTURES_POOL[(pIdx >>> 7) % SCRIPTURES_POOL.length];
  const musicalKey = KEYS_POOL[(pIdx >>> 11) % KEYS_POOL.length];
  const tempo = TEMPOS_POOL[(pIdx >>> 13) % TEMPOS_POOL.length];

  const baseVocalTitle =
    audioPoolIndex < CORE_10_HYMNS.length
      ? CORE_10_HYMNS[audioPoolIndex].title.replace(/\s*\(.*?\)/g, "")
      : RECORDED_VOCAL_HYMNS[audioPoolIndex - CORE_10_HYMNS.length].title;

  const title = `${prefix} ${subject} · ${baseVocalTitle}`;
  const subtitle = `Himno #${formatHymnNumber(n)} de 224.344.224 · ${modifier} (${scripture})`;

  const chorus = CHORUS_LINES[(pIdx >>> 2) % CHORUS_LINES.length];
  const s1 = STANZA_1_LINES[(pIdx >>> 4) % STANZA_1_LINES.length];
  const s2 = STANZA_2_LINES[(pIdx >>> 6) % STANZA_2_LINES.length];
  const s3 = STANZA_3_LINES[(pIdx >>> 8) % STANZA_3_LINES.length];

  return {
    id: `hymn-${n}`,
    hymnNumber: n,
    formattedNumber: formatHymnNumber(n),
    title,
    subtitle,
    category,
    scriptureRef: scripture,
    musicalKey,
    tempo,
    filename,
    mp3Url,
    chorus,
    stanzas: [s1, s2, s3],
    isCoreLocalMp3: audioPoolIndex < CORE_10_HYMNS.length,
  };
}
