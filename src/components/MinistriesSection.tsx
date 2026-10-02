import React, { useState } from 'react';
import { MessageCircle, ArrowRight, Check } from 'lucide-react';
import { MINISTRIES_DATA, buildWhatsAppUrl } from '../data/churchData';
import { ChurchLogo } from './ChurchLogo';

interface MinistriesSectionProps {
  selectedPhone: string;
  onSelectTopicForContact: (topic: string) => void;
  onOpenJoinModal: () => void;
}

export const MinistriesSection: React.FC<MinistriesSectionProps> = ({
  selectedPhone,
  onSelectTopicForContact,
  onOpenJoinModal,
}) => {
  const [selectedCareType, setSelectedCareType] = useState<
    'discipulado' | 'consejeria'
  >('discipulado');
  const [preferredDay, setPreferredDay] = useState('Entre semana (Tarde)');

  const careMessage =
    selectedCareType === 'discipulado'
      ? `Hola, paz de Cristo. Deseo solicitar un Discipulado Personalizado en la Iglesia Discípulos de Cristo de San Gil. Mi disponibilidad preferida es: ${preferredDay}.`
      : `Hola, paz de Cristo. Deseo agendar una cita de Consejería Pastoral en la Iglesia Discípulos de Cristo de San Gil. Mi disponibilidad preferida es: ${preferredDay}.`;

  return (
    <section
      id="ministerios"
      className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-900/40 text-slate-950 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top Editorial Introduction */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-400 font-medium mb-3">
            <span>Formación Espiritual y Cuidado Pastoral</span>
            <span aria-hidden="true">·</span>
            <span>Iglesia Discípulos de Cristo de San Gil</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Discipulados Personalizados, Consejería y Vida en Comunidad
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Nuestra misión en el barrio Villa Olímpica de San Gil va más allá de una reunión semanal: caminamos junto a cada persona y familia a través del estudio personal de las Escrituras y la consejería fundamentada en Cristo.
          </p>
        </div>

        {/* Asymmetric Editorial Bento Grid with Official Logo Emblems */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          {/* Primary Spotlight: Discipulados Personalizados y Consejería (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
            <div className="relative w-full overflow-hidden border-b border-slate-200 dark:border-slate-800">
              <div className="aspect-[16/9] w-full">
                <ChurchLogo
                  variant="banner"
                  subtitle="Discipulados Personalizados y Consejería Pastoral · Cra 20 # 13A - 23 Villa Olímpica"
                />
              </div>
              <div className="px-6 py-4 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-blue-400 font-medium">
                  <span>Acompañamiento Uno a Uno</span>
                  <span aria-hidden="true">·</span>
                  <span>Presencial o Telefónico</span>
                </div>
                <span className="font-mono text-xs text-slate-300">
                  IEDCC San Gil
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-slate-950 dark:text-white">
                  Discipulados Personalizados y Consejería Pastoral
                </h3>
                <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Ya sea que estés dando tus primeros pasos en la fe cristiana o atravieses una etapa que requiere consejo espiritual, sabiduría bíblica y oración confidencial, nuestro equipo pastoral está disponible para atenderte personalmente en{' '}
                  <strong className="text-slate-900 dark:text-white">
                    Cra 20 # 13A - 23, Villa Olímpica
                  </strong>
                  .
                </p>
              </div>

              {/* Interactive Quick-Scheduler for Discipleship or Counseling */}
              <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    Configura tu solicitud de atención personalizada:
                  </span>
                  <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-950 rounded-md">
                    <button
                      type="button"
                      onClick={() => setSelectedCareType('discipulado')}
                      className={`px-3 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                        selectedCareType === 'discipulado'
                          ? 'bg-slate-950 dark:bg-blue-600 text-white'
                          : 'text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                      }`}
                    >
                      Discipulado Personalizado
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCareType('consejeria')}
                      className={`px-3 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                        selectedCareType === 'consejeria'
                          ? 'bg-slate-950 dark:bg-blue-600 text-white'
                          : 'text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                      }`}
                    >
                      Consejería Pastoral
                    </button>
                  </div>
                </div>

                <div>
                  <span className="block text-xs text-slate-600 dark:text-slate-400 mb-2">
                    Selecciona tu horario o jornada de preferencia:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Mañanas (8:30 AM - 11:30 AM)',
                      'Entre semana (Tarde)',
                      'Noches (Después de las 6:30 PM)',
                      'Fines de Semana',
                    ].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setPreferredDay(slot)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
                          preferredDay === slot
                            ? 'bg-blue-700 text-white border-blue-700'
                            : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-blue-600'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={buildWhatsAppUrl(selectedPhone, careMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>
                      Agendar{' '}
                      {selectedCareType === 'discipulado'
                        ? 'Discipulado'
                        : 'Consejería'}{' '}
                      por WhatsApp
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTopicForContact(
                        selectedCareType === 'discipulado'
                          ? 'Discipulado Personalizado'
                          : 'Consejería Pastoral y Familiar'
                      );
                      document
                        .getElementById('contacto')
                        ?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-blue-600 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 transition-colors whitespace-nowrap"
                  >
                    <span>Dejar Datos en el Formulario</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Spotlight: Varones y Damas with Official Logo (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950 text-white border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
            <div className="relative w-full overflow-hidden border-b border-slate-800">
              <div className="aspect-[16/10] w-full">
                <ChurchLogo
                  variant="banner"
                  subtitle="Ministerio de Varones (Mié 7:00 PM) · Ministerio de Damas (Jue 4:00 PM)"
                />
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-blue-400 font-medium mb-1">
                    <span>Miércoles 7:00 PM</span>
                    <span aria-hidden="true">·</span>
                    <span>Jueves 4:00 PM</span>
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-white">
                    Reunión de Varones y Reunión de Damas
                  </h3>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Fortalecemos la vida espiritual de cada integrante de la familia con reuniones dedicadas a las necesidades específicas de los hombres y las mujeres de nuestra congregación.
                </p>

                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-semibold text-white">
                      Reunión de Varones
                    </span>
                    <span className="font-mono text-xs text-blue-400 font-semibold tabular-nums">
                      Miércoles · 07:00 PM
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Estudio bíblico para hombres, sacerdocio en el hogar y oración fraterna.
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-semibold text-white">
                      Reunión de Damas
                    </span>
                    <span className="font-mono text-xs text-blue-400 font-semibold tabular-nums">
                      Jueves · 04:00 PM
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Tarde de comunión femenina, intercesión por las familias y enseñanza de la Palabra.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenJoinModal}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  <span>Unirse a la Página Web</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Editorial Numbered Pillars (01, 02, 03) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800">
          {MINISTRIES_DATA.map((ministry) => (
            <div
              key={ministry.id}
              className="flex flex-col justify-between bg-white dark:bg-slate-950 p-6 sm:p-7 rounded-xl border border-slate-200 dark:border-slate-800"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <span className="font-mono font-semibold text-blue-700 dark:text-blue-400">
                    {ministry.index}.
                  </span>
                  <span>{ministry.subtitle}</span>
                </div>
                <h3 className="font-serif text-2xl font-semibold text-slate-950 dark:text-white">
                  {ministry.index}. {ministry.title}
                </h3>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mt-1.5">
                  {ministry.scheduleSummary}
                </p>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {ministry.description}
                </p>

                <ul className="mt-5 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                  {ministry.highlights.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <Check className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={buildWhatsAppUrl(selectedPhone, ministry.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline transition-colors"
                >
                  <span>{ministry.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
