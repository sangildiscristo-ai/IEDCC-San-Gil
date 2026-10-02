import React, { useState } from 'react';
import {
  Facebook,
  Youtube,
  ExternalLink,
  Play,
  Radio,
  MapPin,
} from 'lucide-react';
import { CHURCH_INFO } from '../data/churchData';
import {
  IEDCC_CHANNELS_DIRECTORY,
  IedccChannelItem,
} from '../data/iedccChannelsData';
import { ChurchLogo } from './ChurchLogo';

export const CoalicionAndSocialSection: React.FC = () => {
  const [activePreviewChannel, setActivePreviewChannel] =
    useState<IedccChannelItem>(IEDCC_CHANNELS_DIRECTORY[0]);

  const handleSelectChannelPreview = (ch: IedccChannelItem) => {
    setActivePreviewChannel(ch);
    const playerEl = document.getElementById('reproductor-canales-iedcc');
    playerEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <section
      id="redes-sociales"
      className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-900/50 text-slate-950 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div id="canales-iedcc" className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-blue-700 dark:text-blue-400 font-semibold mb-3">
              <Radio className="w-4 h-4 shrink-0" />
              <span>Canales Oficiales IEDCC</span>
              <span aria-hidden="true">·</span>
              <span>IEDCC San Gil e IEDCC Central</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Canales Oficiales: IEDCC San Gil e IEDCC Central
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Suscríbete y acompaña las transmisiones y predicaciones de nuestra sede{' '}
              <strong className="text-slate-900 dark:text-white">
                IEDCC San Gil (@IEDCCSanGil)
              </strong>{' '}
              y de la{' '}
              <strong className="text-slate-900 dark:text-white">
                IEDCC Central (@MediosDiscristo)
              </strong>
              , además de nuestra página oficial de Facebook.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={CHURCH_INFO.facebookPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              <Facebook className="w-4 h-4 shrink-0" />
              <span>Suscribirse en Facebook (@IEDCCSanGil)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
            </a>
          </div>
        </div>

        {/* Two Official Channels Cards: IEDCC San Gil & IEDCC Central */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {IEDCC_CHANNELS_DIRECTORY.map((ch, index) => {
            const isSelectedPreview = activePreviewChannel.id === ch.id;
            return (
              <article
                key={ch.id}
                className={`rounded-xl border p-6 sm:p-8 flex flex-col justify-between transition-all ${
                  isSelectedPreview
                    ? 'bg-slate-950 text-white border-blue-600 ring-2 ring-blue-600/40 shadow-xl'
                    : 'bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-100 border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span
                      className={`font-mono font-semibold ${
                        isSelectedPreview
                          ? 'text-blue-400'
                          : 'text-blue-700 dark:text-blue-400'
                      }`}
                    >
                      #{String(index + 1).padStart(2, '0')} · {ch.category}
                    </span>
                    {ch.isCurrentChurch && (
                      <span className="font-mono text-[11px] font-semibold text-blue-500 underline underline-offset-4">
                        Nuestra Sede San Gil
                      </span>
                    )}
                  </div>

                  <div>
                    <h3
                      className={`font-serif text-2xl font-semibold leading-snug ${
                        isSelectedPreview
                          ? 'text-white'
                          : 'text-slate-950 dark:text-white'
                      }`}
                    >
                      {ch.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
                      <span
                        className={`font-mono ${
                          isSelectedPreview
                            ? 'text-blue-300'
                            : 'text-blue-700 dark:text-blue-400'
                        }`}
                      >
                        {ch.handle}
                      </span>
                      <span aria-hidden="true" className="text-slate-400">
                        ·
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 ${
                          isSelectedPreview
                            ? 'text-slate-300'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{ch.cityOrRegion}</span>
                      </span>
                    </div>
                  </div>

                  <p
                    className={`text-sm leading-relaxed ${
                      isSelectedPreview
                        ? 'text-slate-300'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {ch.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/80 dark:border-slate-800 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <a
                      href={ch.subscribeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                    >
                      <Youtube className="w-4 h-4 shrink-0" />
                      <span>Suscribirse a {ch.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleSelectChannelPreview(ch)}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                        isSelectedPreview
                          ? 'bg-blue-950 border-blue-500 text-blue-300'
                          : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {isSelectedPreview ? 'En Reproductor' : 'Ver Canal Aquí'}
                      </span>
                    </button>
                  </div>

                  {ch.facebookUrl && (
                    <a
                      href={ch.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-blue-950 text-white border border-blue-800/60 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                    >
                      <Facebook className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Suscribirse en Facebook (@IEDCCSanGil)</span>
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Interactive Preview Player for IEDCC San Gil or IEDCC Central */}
        <div
          id="reproductor-canales-iedcc"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          <div className="lg:col-span-7 bg-slate-950 text-white rounded-xl border border-blue-900/60 overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <Youtube className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-blue-400 font-semibold">
                  Reproduciendo Canal:
                </span>
                <span className="font-semibold text-white">
                  {activePreviewChannel.name}
                </span>
                <span className="font-mono text-slate-400">
                  ({activePreviewChannel.handle})
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {IEDCC_CHANNELS_DIRECTORY.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActivePreviewChannel(c)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                      activePreviewChannel.id === c.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <iframe
                key={activePreviewChannel.uploadsPlaylistId}
                src={`https://www.youtube.com/embed/videoseries?list=${activePreviewChannel.uploadsPlaylistId}&rel=0`}
                title={`Videos de ${activePreviewChannel.name}`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-semibold text-white">
                  {activePreviewChannel.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {activePreviewChannel.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <a
                  href={activePreviewChannel.subscribeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  <Youtube className="w-4 h-4 shrink-0" />
                  <span>Suscribirse a {activePreviewChannel.name}</span>
                </a>
                <a
                  href={activePreviewChannel.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  <span>Abrir Canal</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-950 text-white rounded-xl border border-blue-900/60 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <ChurchLogo variant="card" size="sm" />
                <span className="text-xs font-mono text-blue-400">
                  @IEDCCSanGil · @MediosDiscristo
                </span>
              </div>

              <h3 className="font-serif text-2xl font-semibold text-white">
                IEDCC San Gil e IEDCC Central
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                Conéctate con las transmisiones y enseñanzas bíblicas de nuestra iglesia local en{' '}
                <strong className="text-white">San Gil (@IEDCCSanGil)</strong> y de la{' '}
                <strong className="text-white">
                  Sede Central (@MediosDiscristo)
                </strong>
                .
              </p>

              <div className="p-4 bg-slate-900/90 rounded-lg border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">Canal IEDCC San Gil:</span>
                  <span className="font-mono text-white">
                    youtube.com/@IEDCCSanGil
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">Canal IEDCC Central:</span>
                  <span className="font-mono text-blue-300">
                    youtube.com/@MediosDiscristo
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">Facebook San Gil:</span>
                  <span className="font-mono text-blue-400">
                    facebook.com/IEDCCSanGil
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <a
                href="https://www.youtube.com/@IEDCCSanGil?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                <Youtube className="w-4 h-4 shrink-0" />
                <span>Suscribirse a IEDCC San Gil</span>
              </a>

              <a
                href="https://www.youtube.com/@MediosDiscristo?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                <Youtube className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Suscribirse a IEDCC Central</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
