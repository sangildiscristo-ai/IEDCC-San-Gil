export interface BibleBook {
  id: number;
  name: string;
  shortName: string;
  testament: 'AT' | 'NT';
  chapters: number;
  category: string;
}

export interface BibleVerse {
  verse: number;
  text: string;
}

export interface BibleChapterData {
  bookId: number;
  bookName: string;
  chapter: number;
  version: string;
  verses: BibleVerse[];
}

export const BIBLE_BOOKS: BibleBook[] = [
  // Antiguo Testamento (39 libros)
  { id: 1, name: 'Génesis', shortName: 'Gén', testament: 'AT', chapters: 50, category: 'Pentateuco' },
  { id: 2, name: 'Éxodo', shortName: 'Éxo', testament: 'AT', chapters: 40, category: 'Pentateuco' },
  { id: 3, name: 'Levítico', shortName: 'Lev', testament: 'AT', chapters: 27, category: 'Pentateuco' },
  { id: 4, name: 'Números', shortName: 'Núm', testament: 'AT', chapters: 36, category: 'Pentateuco' },
  { id: 5, name: 'Deuteronomio', shortName: 'Deu', testament: 'AT', chapters: 34, category: 'Pentateuco' },
  { id: 6, name: 'Josué', shortName: 'Jos', testament: 'AT', chapters: 24, category: 'Históricos' },
  { id: 7, name: 'Jueces', shortName: 'Jue', testament: 'AT', chapters: 21, category: 'Históricos' },
  { id: 8, name: 'Rut', shortName: 'Rut', testament: 'AT', chapters: 4, category: 'Históricos' },
  { id: 9, name: '1 Samuel', shortName: '1Sa', testament: 'AT', chapters: 31, category: 'Históricos' },
  { id: 10, name: '2 Samuel', shortName: '2Sa', testament: 'AT', chapters: 24, category: 'Históricos' },
  { id: 11, name: '1 Reyes', shortName: '1Re', testament: 'AT', chapters: 22, category: 'Históricos' },
  { id: 12, name: '2 Reyes', shortName: '2Re', testament: 'AT', chapters: 25, category: 'Históricos' },
  { id: 13, name: '1 Crónicas', shortName: '1Cr', testament: 'AT', chapters: 29, category: 'Históricos' },
  { id: 14, name: '2 Crónicas', shortName: '2Cr', testament: 'AT', chapters: 36, category: 'Históricos' },
  { id: 15, name: 'Esdras', shortName: 'Esd', testament: 'AT', chapters: 10, category: 'Históricos' },
  { id: 16, name: 'Nehemías', shortName: 'Neh', testament: 'AT', chapters: 13, category: 'Históricos' },
  { id: 17, name: 'Ester', shortName: 'Est', testament: 'AT', chapters: 10, category: 'Históricos' },
  { id: 18, name: 'Job', shortName: 'Job', testament: 'AT', chapters: 42, category: 'Poéticos' },
  { id: 19, name: 'Salmos', shortName: 'Sal', testament: 'AT', chapters: 150, category: 'Poéticos' },
  { id: 20, name: 'Proverbios', shortName: 'Pro', testament: 'AT', chapters: 31, category: 'Poéticos' },
  { id: 21, name: 'Eclesiastés', shortName: 'Ecl', testament: 'AT', chapters: 12, category: 'Poéticos' },
  { id: 22, name: 'Cantares', shortName: 'Can', testament: 'AT', chapters: 8, category: 'Poéticos' },
  { id: 23, name: 'Isaías', shortName: 'Isa', testament: 'AT', chapters: 66, category: 'Profetas Mayores' },
  { id: 24, name: 'Jeremías', shortName: 'Jer', testament: 'AT', chapters: 52, category: 'Profetas Mayores' },
  { id: 25, name: 'Lamentaciones', shortName: 'Lam', testament: 'AT', chapters: 5, category: 'Profetas Mayores' },
  { id: 26, name: 'Ezequiel', shortName: 'Eze', testament: 'AT', chapters: 48, category: 'Profetas Mayores' },
  { id: 27, name: 'Daniel', shortName: 'Dan', testament: 'AT', chapters: 12, category: 'Profetas Mayores' },
  { id: 28, name: 'Oseas', shortName: 'Ose', testament: 'AT', chapters: 14, category: 'Profetas Menores' },
  { id: 29, name: 'Joel', shortName: 'Joe', testament: 'AT', chapters: 3, category: 'Profetas Menores' },
  { id: 30, name: 'Amós', shortName: 'Amó', testament: 'AT', chapters: 9, category: 'Profetas Menores' },
  { id: 31, name: 'Abdías', shortName: 'Abd', testament: 'AT', chapters: 1, category: 'Profetas Menores' },
  { id: 32, name: 'Jonás', shortName: 'Jon', testament: 'AT', chapters: 4, category: 'Profetas Menores' },
  { id: 33, name: 'Miqueas', shortName: 'Miq', testament: 'AT', chapters: 7, category: 'Profetas Menores' },
  { id: 34, name: 'Nahúm', shortName: 'Nah', testament: 'AT', chapters: 3, category: 'Profetas Menores' },
  { id: 35, name: 'Habacuc', shortName: 'Hab', testament: 'AT', chapters: 3, category: 'Profetas Menores' },
  { id: 36, name: 'Sofonías', shortName: 'Sof', testament: 'AT', chapters: 3, category: 'Profetas Menores' },
  { id: 37, name: 'Hageo', shortName: 'Hag', testament: 'AT', chapters: 2, category: 'Profetas Menores' },
  { id: 38, name: 'Zacarías', shortName: 'Zac', testament: 'AT', chapters: 14, category: 'Profetas Menores' },
  { id: 39, name: 'Malaquías', shortName: 'Mal', testament: 'AT', chapters: 4, category: 'Profetas Menores' },

  // Nuevo Testamento (27 libros)
  { id: 40, name: 'Mateo', shortName: 'Mat', testament: 'NT', chapters: 28, category: 'Evangelios' },
  { id: 41, name: 'Marcos', shortName: 'Mar', testament: 'NT', chapters: 16, category: 'Evangelios' },
  { id: 42, name: 'Lucas', shortName: 'Luc', testament: 'NT', chapters: 24, category: 'Evangelios' },
  { id: 43, name: 'Juan', shortName: 'Jua', testament: 'NT', chapters: 21, category: 'Evangelios' },
  { id: 44, name: 'Hechos', shortName: 'Hch', testament: 'NT', chapters: 28, category: 'Histórico' },
  { id: 45, name: 'Romanos', shortName: 'Rom', testament: 'NT', chapters: 16, category: 'Epístolas Paulinas' },
  { id: 46, name: '1 Corintios', shortName: '1Co', testament: 'NT', chapters: 16, category: 'Epístolas Paulinas' },
  { id: 47, name: '2 Corintios', shortName: '2Co', testament: 'NT', chapters: 13, category: 'Epístolas Paulinas' },
  { id: 48, name: 'Gálatas', shortName: 'Gál', testament: 'NT', chapters: 6, category: 'Epístolas Paulinas' },
  { id: 49, name: 'Efesios', shortName: 'Efe', testament: 'NT', chapters: 6, category: 'Epístolas Paulinas' },
  { id: 50, name: 'Filipenses', shortName: 'Fil', testament: 'NT', chapters: 4, category: 'Epístolas Paulinas' },
  { id: 51, name: 'Colosenses', shortName: 'Col', testament: 'NT', chapters: 4, category: 'Epístolas Paulinas' },
  { id: 52, name: '1 Tesalonicenses', shortName: '1Ts', testament: 'NT', chapters: 5, category: 'Epístolas Paulinas' },
  { id: 53, name: '2 Tesalonicenses', shortName: '2Ts', testament: 'NT', chapters: 3, category: 'Epístolas Paulinas' },
  { id: 54, name: '1 Timoteo', shortName: '1Ti', testament: 'NT', chapters: 6, category: 'Epístolas Pastorales' },
  { id: 55, name: '2 Timoteo', shortName: '2Ti', testament: 'NT', chapters: 4, category: 'Epístolas Pastorales' },
  { id: 56, name: 'Tito', shortName: 'Tit', testament: 'NT', chapters: 3, category: 'Epístolas Pastorales' },
  { id: 57, name: 'Filemón', shortName: 'Flm', testament: 'NT', chapters: 1, category: 'Epístolas Pastorales' },
  { id: 58, name: 'Hebreos', shortName: 'Heb', testament: 'NT', chapters: 13, category: 'Epístolas Generales' },
  { id: 59, name: 'Santiago', shortName: 'Stg', testament: 'NT', chapters: 5, category: 'Epístolas Generales' },
  { id: 60, name: '1 Pedro', shortName: '1Pe', testament: 'NT', chapters: 5, category: 'Epístolas Generales' },
  { id: 61, name: '2 Pedro', shortName: '2Pe', testament: 'NT', chapters: 3, category: 'Epístolas Generales' },
  { id: 62, name: '1 Juan', shortName: '1Jn', testament: 'NT', chapters: 5, category: 'Epístolas Generales' },
  { id: 63, name: '2 Juan', shortName: '2Jn', testament: 'NT', chapters: 1, category: 'Epístolas Generales' },
  { id: 64, name: '3 Juan', shortName: '3Jn', testament: 'NT', chapters: 1, category: 'Epístolas Generales' },
  { id: 65, name: 'Judas', shortName: 'Jud', testament: 'NT', chapters: 1, category: 'Epístolas Generales' },
  { id: 66, name: 'Apocalipsis', shortName: 'Apo', testament: 'NT', chapters: 22, category: 'Profecía' },
];

export interface QuickPassage {
  label: string;
  bookId: number;
  chapter: number;
  theme: string;
}

export const QUICK_PASSAGES: QuickPassage[] = [
  { label: 'Salmos 23', bookId: 19, chapter: 23, theme: 'Jehová es mi Pastor' },
  { label: 'Salmos 91', bookId: 19, chapter: 91, theme: 'Protección del Altísimo' },
  { label: 'Juan 3', bookId: 43, chapter: 3, theme: 'Nuevo Nacimiento y Amor de Dios' },
  { label: 'Juan 14', bookId: 43, chapter: 14, theme: 'El Camino, la Verdad y la Vida' },
  { label: 'Romanos 8', bookId: 45, chapter: 8, theme: 'Más que Vencedores en Cristo' },
  { label: '1 Corintios 13', bookId: 46, chapter: 13, theme: 'La Preeminencia del Amor' },
  { label: 'Proverbios 31', bookId: 20, chapter: 31, theme: 'Mujer Virtuosa (Damas)' },
  { label: '1 Corintios 16', bookId: 46, chapter: 16, theme: 'Estad Firmes en la Fe (Varones)' },
  { label: '2 Timoteo 2', bookId: 55, chapter: 2, theme: 'Discipulado Fiel' },
  { label: 'Mateo 28', bookId: 40, chapter: 28, theme: 'La Gran Comisión' },
  { label: 'Filipenses 4', bookId: 50, chapter: 4, theme: 'Gozo y Paz en la Oración' },
  { label: 'Génesis 1', bookId: 1, chapter: 1, theme: 'La Creación' },
];

/**
 * Biblioteca local integrada Reina-Valera para lectura instantánea y respaldo sin conexión
 */
export const LOCAL_BIBLE_CHAPTERS: Record<string, BibleVerse[]> = {
  '19-23': [
    { verse: 1, text: 'Jehová es mi pastor; nada me faltará.' },
    { verse: 2, text: 'En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará.' },
    { verse: 3, text: 'Confortará mi alma; me guiará por sendas de justicia por amor de su nombre.' },
    { verse: 4, text: 'Aunque ande en valle de sombra de muerte, no temeré mal alguno, porque tú estarás conmigo; tu vara y tu cayado me infundirán aliento.' },
    { verse: 5, text: 'Aderezas mesa delante de mí en presencia de mis angustiadores; unges mi cabeza con aceite; mi copa está rebosando.' },
    { verse: 6, text: 'Ciertamente el bien y la misericordia me seguirán todos los días de mi vida, y en la casa de Jehová moraré por largos días.' },
  ],
  '19-91': [
    { verse: 1, text: 'El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente.' },
    { verse: 2, text: 'Diré yo a Jehová: Esperanza mía, y castillo mío; mi Dios, en quien confiaré.' },
    { verse: 3, text: 'Él te librará del lazo del cazador, de la peste destructora.' },
    { verse: 4, text: 'Con sus plumas te cubrirá, y debajo de sus alas estarás seguro; escudo y adarga es su verdad.' },
    { verse: 5, text: 'No temerás el terror nocturno, ni saeta que vuele de día,' },
    { verse: 6, text: 'Ni pestilencia que ande en oscuridad, ni mortandad que en medio del día destruya.' },
    { verse: 7, text: 'Caerán a tu lado mil, y diez mil a tu diestra; mas a ti no llegará.' },
    { verse: 8, text: 'Ciertamente con tus ojos mirarás y verás la recompensa de los impíos.' },
    { verse: 9, text: 'Porque has puesto a Jehová, que es mi esperanza, al Altísimo por tu habitación,' },
    { verse: 10, text: 'No te sobrevendrá mal, ni plaga tocará tu morada.' },
    { verse: 11, text: 'Pues a sus ángeles mandará acerca de ti, que te guarden en todos tus caminos.' },
    { verse: 12, text: 'En las manos te llevarán, para que tu pie no tropiece en piedra.' },
    { verse: 13, text: 'Sobre el león y el áspid pisarás; hollarás al cachorro del león y al dragón.' },
    { verse: 14, text: 'Por cuanto en mí ha puesto su amor, yo también lo libraré; le pondré en alto, por cuanto ha conocido mi nombre.' },
    { verse: 15, text: 'Me invocará, y yo le responderé; con él estaré yo en la angustia; lo libraré y le glorificaré.' },
    { verse: 16, text: 'Lo saciaré de larga vida, y le mostraré mi salvación.' },
  ],
  '43-3': [
    { verse: 1, text: 'Había un hombre de los fariseos que se llamaba Nicodemo, un principal entre los judíos.' },
    { verse: 2, text: 'Este vino a Jesús de noche, y le dijo: Rabí, sabemos que has venido de Dios como maestro; porque nadie puede hacer estas señales que tú haces, si no está Dios con él.' },
    { verse: 3, text: 'Respondió Jesús y le dijo: De cierto, de cierto te digo, que el que no naciere de nuevo, no puede ver el reino de Dios.' },
    { verse: 4, text: 'Nicodemo le dijo: ¿Cómo puede un hombre nacer siendo viejo? ¿Puede acaso entrar por segunda vez en el vientre de su madre, y nacer?' },
    { verse: 5, text: 'Respondió Jesús: De cierto, de cierto te digo, que el que no naciere de agua y del Espíritu, no puede entrar en el reino de Dios.' },
    { verse: 6, text: 'Lo que es nacido de la carne, carne es; y lo que es nacido del Espíritu, espíritu es.' },
    { verse: 7, text: 'No te maravilles de que te dije: Os es necesario nacer de nuevo.' },
    { verse: 14, text: 'Y como Moisés levantó la serpiente en el desierto, así es necesario que el Hijo del Hombre sea levantado,' },
    { verse: 15, text: 'para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.' },
    { verse: 16, text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.' },
    { verse: 17, text: 'Porque no envió Dios a su Hijo al mundo para condenar al mundo, sino para que el mundo sea salvo por él.' },
    { verse: 18, text: 'El que en él cree, no es condenado; pero el que no cree, ya ha sido condenado, porque no ha creído en el nombre del unigénito Hijo de Dios.' },
  ],
  '43-14': [
    { verse: 1, text: 'No se turbe vuestro corazón; creéis en Dios, creed también en mí.' },
    { verse: 2, text: 'En la casa de mi Padre muchas moradas hay; si así no fuera, yo os lo hubiera dicho; voy, pues, a preparar lugar para vosotros.' },
    { verse: 3, text: 'Y si me fuere y os preparare lugar, vendré otra vez, y os tomaré a mí mismo, para que donde yo estoy, vosotros también estéis.' },
    { verse: 6, text: 'Jesús le dijo: Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí.' },
    { verse: 15, text: 'Si me amáis, guardad mis mandamientos.' },
    { verse: 16, text: 'Y yo rogaré al Padre, y os dará otro Consolador, para que esté con vosotros para siempre:' },
    { verse: 26, text: 'Mas el Consolador, el Espíritu Santo, a quien el Padre enviará en mi nombre, él os enseñará todas las cosas, y os recordará todo lo que yo os he dicho.' },
    { verse: 27, text: 'La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.' },
  ],
  '45-8': [
    { verse: 1, text: 'Ahora, pues, ninguna condenación hay para los que están en Cristo Jesús, los que no andan conforme a la carne, sino conforme al Espíritu.' },
    { verse: 2, text: 'Porque la ley del Espíritu de vida en Cristo Jesús me ha librado de la ley del pecado y de la muerte.' },
    { verse: 14, text: 'Porque todos los que son guiados por el Espíritu de Dios, éstos son hijos de Dios.' },
    { verse: 28, text: 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.' },
    { verse: 31, text: '¿Qué, pues, diremos a esto? Si Dios es por nosotros, ¿quién contra nosotros?' },
    { verse: 35, text: '¿Quién nos separará del amor de Cristo? ¿Tribulación, o angustia, o persecución, o hambre, o desnudez, o peligro, o espada?' },
    { verse: 37, text: 'Antes, en todas estas cosas somos más que vencedores por medio de aquel que nos amó.' },
    { verse: 38, text: 'Por lo cual estoy seguro de que ni la muerte, ni la vida, ni ángeles, ni principados, ni potestades, ni lo presente, ni lo por venir,' },
    { verse: 39, text: 'ni lo alto, ni lo profundo, ni ninguna otra cosa creada nos podrá separar del amor de Dios, que es en Cristo Jesús Señor nuestro.' },
  ],
  '46-13': [
    { verse: 1, text: 'Si yo hablase lenguas humanas y angélicas, y no tengo amor, vengo a ser como metal que resuena, o címbalo que retiñe.' },
    { verse: 2, text: 'Y si tuviese profecía, y entendiese todos los misterios y toda ciencia, y si tuviese toda la fe, de tal manera que trasladase los montes, y no tengo amor, nada soy.' },
    { verse: 4, text: 'El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso, no se envanece;' },
    { verse: 5, text: 'no hace nada indebido, no busca lo suyo, no se irrita, no guarda rencor;' },
    { verse: 6, text: 'no se goza de la injusticia, mas se goza de la verdad.' },
    { verse: 7, text: 'Todo lo sufre, todo lo cree, todo lo espera, todo lo soporta.' },
    { verse: 8, text: 'El amor nunca deja de ser; pero las profecías se acabarán, y cesarán las lenguas, y la ciencia acabará.' },
    { verse: 13, text: 'Y ahora permanecen la fe, la esperanza y el amor, estos tres; pero el mayor de ellos es el amor.' },
  ],
  '20-31': [
    { verse: 10, text: 'Mujer virtuosa, ¿quién la hallará? Porque su estima sobrepasa largamente a la de las piedras preciosas.' },
    { verse: 11, text: 'El corazón de su marido está en ella confiado, y no carecerá de ganancias.' },
    { verse: 20, text: 'Alarga su mano al pobre, y extiende sus manos al menesteroso.' },
    { verse: 25, text: 'Fuerza y honor son su vestidura; y se ríe de lo por venir.' },
    { verse: 26, text: 'Abre su boca con sabiduría, y la ley de clemencia está en su lengua.' },
    { verse: 27, text: 'Considera los caminos de su casa, y no come el pan de balde.' },
    { verse: 28, text: 'Se levantan sus hijos y la llaman bienaventurada; y su marido también la alaba:' },
    { verse: 30, text: 'Engañosa es la gracia, y vana la hermosura; la mujer que teme a Jehová, ésa será alabada.' },
  ],
  '46-16': [
    { verse: 9, text: 'Porque se me ha abierto puerta grande y eficaz, y muchos son los adversarios.' },
    { verse: 13, text: 'Velad, estad firmes en la fe; portaos varonilmente, y esforzaos.' },
    { verse: 14, text: 'Todas vuestras cosas sean hechas con amor.' },
    { verse: 23, text: 'La gracia del Señor Jesucristo esté con vosotros.' },
    { verse: 24, text: 'Mi amor en Cristo Jesús esté con todos vosotros. Amén.' },
  ],
  '55-2': [
    { verse: 1, text: 'Tú, pues, hijo mío, esfuérzate en la gracia que es en Cristo Jesús.' },
    { verse: 2, text: 'Lo que has oído de mí ante muchos testigos, esto encarga a hombres fieles que sean idóneos para enseñar también a otros.' },
    { verse: 3, text: 'Tú, pues, sufre penalidades como buen soldado de Jesucristo.' },
    { verse: 15, text: 'Procura con diligencia presentarte a Dios aprobado, como obrero que no tiene de qué avergonzarse, que usa bien la palabra de verdad.' },
    { verse: 22, text: 'Huye también de las pasiones juveniles, y sigue la justicia, la fe, el amor y la paz, con los que de corazón limpio invocan al Señor.' },
    { verse: 24, text: 'Porque el siervo del Señor no debe ser contencioso, sino amable para con todos, apto para enseñar, sufrido;' },
  ],
  '40-28': [
    { verse: 16, text: 'Pero los once discípulos se fueron a Galilea, al monte donde Jesús les había ordenado.' },
    { verse: 17, text: 'Y cuando le vieron, le adoraron; pero algunos dudaban.' },
    { verse: 18, text: 'Y Jesús se acercó y les habló diciendo: Toda potestad me es dada en el cielo y en la tierra.' },
    { verse: 19, text: 'Por tanto, id, y haced discípulos a todas las naciones, bautizándolos en el nombre del Padre, y del Hijo, y del Espíritu Santo;' },
    { verse: 20, text: 'enseñándoles que guarden todas las cosas que os he mandado; y he aquí yo estoy con vosotros todos los días, hasta el fin del mundo. Amén.' },
  ],
  '50-4': [
    { verse: 4, text: 'Regocijaos en el Señor siempre. Otra vez digo: ¡Regocijaos!' },
    { verse: 5, text: 'Vuestra gentileza sea conocida de todos los hombres. El Señor está cerca.' },
    { verse: 6, text: 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias.' },
    { verse: 7, text: 'Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.' },
    { verse: 8, text: 'Por lo demás, hermanos, todo lo que es verdadero, todo lo honesto, todo lo justo, todo lo puro, todo lo amable, todo lo que es de buen nombre; si hay virtud alguna, si algo digno de alabanza, en esto pensad.' },
    { verse: 13, text: 'Todo lo puedo en Cristo que me fortalece.' },
    { verse: 19, text: 'Mi Dios, pues, suplirá todo lo que os falta conforme a sus riquezas en gloria en Cristo Jesús.' },
  ],
  '1-1': [
    { verse: 1, text: 'En el principio creó Dios los cielos y la tierra.' },
    { verse: 2, text: 'Y la tierra estaba desordenada y vacía, y las tinieblas estaban sobre la faz del abismo, y el Espíritu de Dios se movía sobre la faz de las aguas.' },
    { verse: 3, text: 'Y dijo Dios: Sea la luz; y fue la luz.' },
    { verse: 4, text: 'Y vio Dios que la luz era buena; y separó Dios la luz de las tinieblas.' },
    { verse: 26, text: 'Entonces dijo Dios: Hagamos al hombre a nuestra imagen, conforme a nuestra semejanza; y señoree en los peces del mar, en las aves de los cielos, en las bestias, en toda la tierra, y en todo animal que se arrastra sobre la tierra.' },
    { verse: 27, text: 'Y creó Dios al hombre a su imagen, a imagen de Dios lo creó; varón y hembra los creó.' },
    { verse: 31, text: 'Y vio Dios todo lo que había hecho, y he aquí que era bueno en gran manera. Y fue la tarde y la mañana el día sexto.' },
  ],
};
