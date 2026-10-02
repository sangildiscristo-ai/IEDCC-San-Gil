export interface IedccChannelItem {
  id: string;
  name: string;
  handle: string;
  channelId: string;
  uploadsPlaylistId: string;
  cityOrRegion: string;
  category: 'Sede Local IEDCC' | 'Sede Central';
  description: string;
  youtubeUrl: string;
  subscribeUrl: string;
  facebookUrl?: string;
  isCurrentChurch?: boolean;
}

/**
 * Canales oficiales promovidos: únicamente IEDCC San Gil e IEDCC Central.
 */
export const IEDCC_CHANNELS_DIRECTORY: IedccChannelItem[] = [
  {
    id: 'iedcc-san-gil',
    name: 'IEDCC San Gil',
    handle: '@IEDCCSanGil',
    channelId: 'UCBpv_fN8q8wGNz2RqbmFUQA',
    uploadsPlaylistId: 'UUBpv_fN8q8wGNz2RqbmFUQA',
    cityOrRegion: 'San Gil, Santander (Cra 20 # 13A - 23 Villa Olímpica)',
    category: 'Sede Local IEDCC',
    description:
      'Nuestro anhelo es glorificar a Dios, exponiendo el Evangelio para la edificación de su iglesia por medio de una enseñanza bíblica fiel en San Gil.',
    youtubeUrl: 'https://www.youtube.com/@IEDCCSanGil',
    subscribeUrl: 'https://www.youtube.com/@IEDCCSanGil?sub_confirmation=1',
    facebookUrl: 'https://www.facebook.com/IEDCCSanGil/',
    isCurrentChurch: true,
  },
  {
    id: 'iedcc-central',
    name: 'IEDCC Central',
    handle: '@MediosDiscristo',
    channelId: 'UC8lK1wX4j1NfQAdl3NScKXw',
    uploadsPlaylistId: 'UU8lK1wX4j1NfQAdl3NScKXw',
    cityOrRegion: 'Bogotá, Colombia',
    category: 'Sede Central',
    description:
      'Buscamos llevar el evangelio mucho más allá de nuestras barreras físicas y contribuir en la edificación espiritual de muchas personas y familias.',
    youtubeUrl: 'https://www.youtube.com/@MediosDiscristo',
    subscribeUrl: 'https://www.youtube.com/@MediosDiscristo?sub_confirmation=1',
  },
];
