import React, { useState } from 'react';
import { CalendarPlus, MessageCircle, Clock, ArrowUpRight } from 'lucide-react';
import {
  SERVICE_SCHEDULE,
  CHURCH_INFO,
  ServiceScheduleItem,
  buildWhatsAppUrl,
  downloadServiceIcs,
} from '../data/churchData';

interface ScheduleSectionProps {
  selectedPhone: string;
  onSelectTopicForContact: (topic: string) => void;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  selectedPhone,
  onSelectTopicForContact,
}) => {
  const [activeFilter, setActiveFilter] = useState<
    'todos' | 'dominical' | 'semana' | 'personalizado'
  >('todos');
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const filteredSchedule = SERVICE_SCHEDULE.filter((item) =>
    activeFilter === 'todos' ? true : item.category === activeFilter
  );

  const handleDownloadCalendar = (item: ServiceScheduleItem) => {
    downloadServiceIcs(item);
    setDownloadedId(item.id);
    setTimeout(() => setDownloadedId(null), 3000);
  };

  return (
    <section
      id="horarios"
      className="py-20 lg:py-28 bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header + Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-400 font-medium mb-3">
              <span>Agenda Congregacional</span>
              <span aria-hidden="true">·</span>
              <span>Cra 20 # 13A - 23, Villa Olímpica</span>
              <span aria-hidden="true">·</span>
              <span>San Gil</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Horario de Cultos y Reuniones Semanales
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Te esperamos con los brazos abiertos en cada uno de nuestros encuentros semanales de adoración, enseñanza bíblica, comunión de varones y damas, y espacios de discipulado personalizado.
            </p>
          </div>

          {/* Interactive Filter Controls (Functional Buttons) */}
          <div
            className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 self-start lg:self-auto"
            role="tablist"
            aria-label="Filtrar horarios de cultos"
          >
            {[
              { id: 'todos', label: 'Todos los Horarios' },
              { id: 'dominical', label: 'Domingos 8:00 AM' },
              { id: 'semana', label: 'Varones y Damas' },
              { id: 'personalizado', label: 'Discipulados y Consejería' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeFilter === tab.id}
                onClick={() =>
                  setActiveFilter(
                    tab.id as 'todos' | 'dominical' | 'semana' | 'personalizado'
                  )
                }
                className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'bg-slate-950 dark:bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Highlight Banner for the 3 Core Weekly Times */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800 bg-slate-950 text-white rounded-xl my-10 border border-slate-800 overflow-hidden">
          <div className="p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-blue-400 font-medium">
                <span>Culto General</span>
                <span aria-hidden="true">·</span>
                <span>Todos los Domingos</span>
              </div>
              <p className="font-mono text-3xl lg:text-4xl font-semibold text-white tabular-nums mt-2">
                08:00 AM
              </p>
              <h3 className="font-serif text-xl font-medium text-white mt-2">
                Culto Dominical de Adoración
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Alabanza, oración congregacional y predicación de la Palabra para toda la familia.
            </p>
          </div>

          <div className="p-6 lg:p-8 flex flex-col justify-between bg-blue-950/30">
            <div>
              <div className="flex items-center gap-2 text-xs text-blue-400 font-medium">
                <span>Ministerio de Hombres</span>
                <span aria-hidden="true">·</span>
                <span>Todos los Miércoles</span>
              </div>
              <p className="font-mono text-3xl lg:text-4xl font-semibold text-white tabular-nums mt-2">
                07:00 PM
              </p>
              <h3 className="font-serif text-xl font-medium text-white mt-2">
                Reunión de Varones
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-4">
              Formación bíblica, liderazgo espiritual en el hogar y fraternidad de varones.
            </p>
          </div>

          <div className="p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-blue-400 font-medium">
                <span>Ministerio de Mujeres</span>
                <span aria-hidden="true">·</span>
                <span>Todos los Jueves</span>
              </div>
              <p className="font-mono text-3xl lg:text-4xl font-semibold text-white tabular-nums mt-2">
                04:00 PM
              </p>
              <h3 className="font-serif text-xl font-medium text-white mt-2">
                Reunión de Damas
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Tarde de intercesión, estudio de la Palabra y edificación para todas las damas.
            </p>
          </div>
        </div>

        {/* Detailed Schedule Table / Editorial List */}
        <div className="divide-y divide-slate-200 dark:divide-slate-800 border-t border-b border-slate-200 dark:border-slate-800">
          {filteredSchedule.map((item) => (
            <div
              key={item.id}
              className="py-8 first:pt-6 last:pb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50/70 dark:hover:bg-slate-900/50 transition-colors px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-lg"
            >
              {/* Left: Day & Time in Tabular Monospace */}
              <div className="lg:w-56 shrink-0">
                <div className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                  {item.dayName}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-mono text-2xl font-semibold text-slate-950 dark:text-white tabular-nums">
                    {item.timeLabel}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {item.scriptureRef}
                </div>
              </div>

              {/* Center: Title, Audience Metadata & Description */}
              <div className="flex-1 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {item.audience}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{item.locationDetail}</span>
                </div>
                <h3 className="font-serif text-2xl font-semibold text-slate-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Right: Functional Actions */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                {item.dayOfWeek >= 0 ? (
                  <button
                    type="button"
                    onClick={() => handleDownloadCalendar(item)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg hover:border-blue-600 transition-colors whitespace-nowrap"
                  >
                    <CalendarPlus className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
                    <span>
                      {downloadedId === item.id
                        ? 'Recordatorio Descargado'
                        : 'Agendar Recordatorio'}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTopicForContact(
                        'Discipulado Personalizado y Consejería'
                      );
                      const el = document.getElementById('contacto');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg hover:border-blue-600 transition-colors whitespace-nowrap"
                  >
                    <span>Solicitar en Formulario</span>
                    <ArrowUpRight className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
                  </button>
                )}

                <a
                  href={buildWhatsAppUrl(selectedPhone, item.whatsappPrompt)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Quiet Operational Strip */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">
              Dirección del Templo:
            </span>
            <span>{CHURCH_INFO.address}</span>
            <span aria-hidden="true">·</span>
            <span>{CHURCH_INFO.city}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span>Atención telefónica y WhatsApp:</span>
            <span className="font-mono font-semibold text-slate-950 dark:text-white tabular-nums">
              312 348 0660
            </span>
            <span aria-hidden="true">/</span>
            <span className="font-mono font-semibold text-slate-950 dark:text-white tabular-nums">
              312 557 6600
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
