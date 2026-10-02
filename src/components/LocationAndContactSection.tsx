import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { CHURCH_INFO, buildWhatsAppUrl } from '../data/churchData';

interface ContactSubmission {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  topic: string;
  targetWhatsapp: string;
  message: string;
  submittedAt: string;
}

interface LocationAndContactSectionProps {
  preselectedTopic: string;
  selectedPhone: string;
  onChangeSelectedPhone: (phone: string) => void;
}

const CONTACT_TOPICS = [
  'Información de Cultos (Domingos 8:00 AM)',
  'Reunión de Varones (Miércoles 7:00 PM)',
  'Reunión de Damas (Jueves 4:00 PM)',
  'Discipulado Personalizado',
  'Consejería Pastoral y Familiar',
  'Petición de Oración',
];

export const LocationAndContactSection: React.FC<
  LocationAndContactSectionProps
> = ({ preselectedTopic, selectedPhone, onChangeSelectedPhone }) => {
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Contact Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(CONTACT_TOPICS[3]);
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [lastSubmission, setLastSubmission] =
    useState<ContactSubmission | null>(null);

  useEffect(() => {
    if (preselectedTopic) {
      setTopic(preselectedTopic);
    }
  }, [preselectedTopic]);

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText(CHURCH_INFO.fullAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 3000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || fullName.trim().length < 3) {
      setFormError('Por favor ingresa tu nombre completo.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 7) {
      setFormError('Por favor ingresa un número de teléfono o WhatsApp válido.');
      return;
    }
    if (!message.trim() || message.trim().length < 5) {
      setFormError(
        'Por favor escribe brevemente tu mensaje, consulta o petición de oración.'
      );
      return;
    }

    setFormError('');
    const submission: ContactSubmission = {
      id: `MSG-${Date.now()}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      topic,
      targetWhatsapp: selectedPhone,
      message: message.trim(),
      submittedAt: new Date().toLocaleString('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem('iedcc_sangil_contacts') || '[]'
      );
      localStorage.setItem(
        'iedcc_sangil_contacts',
        JSON.stringify([submission, ...existing.slice(0, 9)])
      );
    } catch {
      // Ignore storage quota issues
    }

    setLastSubmission(submission);
    setFullName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  return (
    <section
      id="ubicacion"
      className="py-20 lg:py-28 bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-100 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-24">
        {/* PART 1: UBICACIÓN Y MAPA (Cra 20 # 13A - 23 Villa Olímpica, San Gil) */}
        <div>
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-400 font-medium mb-3">
              <span>Sede Principal</span>
              <span aria-hidden="true">·</span>
              <span>Barrio Villa Olímpica</span>
              <span aria-hidden="true">·</span>
              <span>San Gil, Santander</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Ubicación y Mapa del Templo
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Encuéntranos en el corazón del barrio Villa Olímpica en San Gil. Contamos con un ambiente familiar y accesible para todos nuestros cultos y reuniones semanales.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Address & Immediate Directions Card (5 cols) */}
            <div className="lg:col-span-5 bg-slate-950 text-white rounded-xl p-6 sm:p-8 border border-slate-800 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-blue-400 font-medium">
                    Dirección Oficial
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white mt-1">
                    Cra 20 # 13A - 23, Villa Olímpica
                  </h3>
                  <p className="text-sm text-slate-300 mt-1">
                    San Gil, Santander · Colombia
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800 text-xs sm:text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Domingos (Culto):</span>
                    <span className="font-mono font-semibold text-white tabular-nums">
                      08:00 AM
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Miércoles (Varones):</span>
                    <span className="font-mono font-semibold text-white tabular-nums">
                      07:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Jueves (Damas):</span>
                    <span className="font-mono font-semibold text-white tabular-nums">
                      04:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">
                      Discipulados y Consejería:
                    </span>
                    <span className="text-blue-400 font-medium">
                      Cita Previa
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <p className="text-xs text-slate-400">
                    Líneas de Atención Inmediata por WhatsApp:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {CHURCH_INFO.phones.map((line) => (
                      <a
                        key={line.id}
                        href={buildWhatsAppUrl(
                          line.raw,
                          'Hola, paz de Cristo. Me gustaría recibir indicaciones para llegar a la Iglesia Discípulos de Cristo de San Gil en Cra 20 # 13A - 23 Villa Olímpica.'
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-slate-900 hover:bg-blue-900/50 border border-slate-800 hover:border-blue-500 transition-colors"
                      >
                        <div>
                          <span className="block font-mono text-xs font-semibold text-white tabular-nums">
                            {line.display}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            WhatsApp Directo
                          </span>
                        </div>
                        <MessageCircle className="w-4 h-4 text-blue-400 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-slate-800">
                <a
                  href={CHURCH_INFO.googleMapsDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>Abrir en Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
                </a>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-800 transition-colors whitespace-nowrap"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-emerald-400">Dirección Copiada</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 shrink-0" />
                      <span>Copiar Dirección</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Interactive Embedded Map (7 cols) */}
            <div className="lg:col-span-7 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[380px] flex flex-col">
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Cra 20 # 13A - 23, Villa Olímpica · San Gil, Santander
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                  Mapa Interactivo
                </span>
              </div>
              <div className="relative flex-1 w-full min-h-[340px]">
                <iframe
                  title="Mapa de ubicación Iglesia Discípulos de Cristo de San Gil - Cra 20 13a 23 Villa Olímpica"
                  src={CHURCH_INFO.googleMapsEmbedUrl}
                  className="w-full h-full min-h-[340px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>

        {/* PART 2: FORMULARIO DE CONTACTO Y ATENCIÓN INMEDIATA POR WHATSAPP */}
        <div
          id="contacto"
          className="pt-16 border-t border-slate-200 dark:border-slate-800"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Direct WhatsApp Attention & Pastoral Info (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-400 font-medium mb-3">
                  <span>Atención Pastoral Inmediata</span>
                  <span aria-hidden="true">·</span>
                  <span>Líneas Oficiales</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  Contáctanos o Solicita Oración y Consejería
                </h2>
                <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Estamos para servirte. Puedes escribirnos en cualquier momento a través de nuestro formulario de contacto o comunicarte de forma inmediata a nuestras dos líneas oficiales de WhatsApp.
                </p>
              </div>

              {/* Dual WhatsApp Immediate Contact Cards */}
              <div className="space-y-4">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Botones de Contacto por WhatsApp para Atención Inmediata:
                </p>

                {CHURCH_INFO.phones.map((phoneItem, idx) => (
                  <div
                    key={phoneItem.id}
                    className={`p-5 rounded-xl border transition-colors ${
                      selectedPhone === phoneItem.raw
                        ? 'bg-slate-950 text-white border-blue-700'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-950 dark:text-slate-100 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span
                          className={`text-xs font-medium ${
                            selectedPhone === phoneItem.raw
                              ? 'text-blue-400'
                              : 'text-blue-700 dark:text-blue-400'
                          }`}
                        >
                          {phoneItem.label}
                        </span>
                        <p className="font-mono text-2xl font-semibold tabular-nums mt-0.5">
                          {phoneItem.display}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onChangeSelectedPhone(phoneItem.raw)}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors ${
                          selectedPhone === phoneItem.raw
                            ? 'bg-blue-700 text-white border-blue-600'
                            : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {selectedPhone === phoneItem.raw
                          ? 'Línea Activa'
                          : 'Seleccionar'}
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800/20 dark:border-slate-800 flex flex-wrap items-center gap-3">
                      <a
                        href={buildWhatsAppUrl(
                          phoneItem.raw,
                          `Hola, paz de Cristo. Me comunico desde la página web de la Iglesia Discípulos de Cristo de San Gil para recibir atención sobre: ${topic}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                          idx === 0 || selectedPhone === phoneItem.raw
                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                            : 'bg-slate-950 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <MessageCircle className="w-4 h-4 shrink-0" />
                        <span>Escribir al {phoneItem.display}</span>
                      </a>
                      <a
                        href={`tel:+57${phoneItem.raw}`}
                        className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap ${
                          selectedPhone === phoneItem.raw
                            ? 'border-slate-700 text-slate-200 hover:bg-slate-900'
                            : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-950'
                        }`}
                      >
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span>Llamar</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Interactive Validated Contact Form (7 cols) */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-10">
              <div className="mb-6">
                <h3 className="font-serif text-2xl font-semibold text-slate-950 dark:text-white">
                  Formulario de Contacto y Solicitudes
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Completa tus datos para inscribirte en discipulados personalizados, agendar consejería, enviar una petición de oración o consultar sobre nuestros cultos.
                </p>
              </div>

              {lastSubmission ? (
                <div className="bg-white dark:bg-slate-950 border border-blue-200 dark:border-blue-800 rounded-xl p-6 space-y-5">
                  <div className="flex items-start gap-3.5">
                    <CheckCircle2 className="w-6 h-6 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-mono text-blue-700 dark:text-blue-400 font-semibold">
                        Solicitud Registrada · {lastSubmission.submittedAt}
                      </p>
                      <h4 className="font-serif text-xl font-semibold text-slate-950 dark:text-white mt-1">
                        ¡Gracias por escribirnos, {lastSubmission.fullName}!
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        Hemos registrado tu mensaje sobre{' '}
                        <strong className="text-slate-900 dark:text-white">
                          {lastSubmission.topic}
                        </strong>
                        . Para recibir respuesta inmediata en tu celular, puedes enviar ahora mismo esta solicitud a nuestra línea de WhatsApp:
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Motivo:
                      </span>{' '}
                      {lastSubmission.topic}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Teléfono de contacto:
                      </span>{' '}
                      <span className="font-mono tabular-nums">
                        {lastSubmission.phone}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Mensaje:
                      </span>{' '}
                      “{lastSubmission.message}”
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    <a
                      href={buildWhatsAppUrl(
                        lastSubmission.targetWhatsapp,
                        `Hola, paz de Cristo. Soy ${lastSubmission.fullName} (Tel: ${lastSubmission.phone}). Escribo desde el formulario web de la Iglesia Discípulos de Cristo de San Gil.\n\nMotivo: ${lastSubmission.topic}\nMensaje: ${lastSubmission.message}`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-blue-700 hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>
                        Enviar Ahora por WhatsApp ({lastSubmission.targetWhatsapp})
                      </span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setLastSubmission(null)}
                      className="px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 transition-colors whitespace-nowrap"
                    >
                      Enviar Nuevo Mensaje
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleContactSubmit}
                  className="space-y-5"
                  noValidate
                >
                  {formError && (
                    <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-medium rounded-lg">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
                      >
                        Nombre Completo *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Tu nombre y apellido"
                        className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
                      >
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ej. 312 348 0660"
                        className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-topic"
                        className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
                      >
                        Motivo de tu Mensaje *
                      </label>
                      <select
                        id="contact-topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white focus:outline-none focus:border-blue-600"
                      >
                        {CONTACT_TOPICS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
                      >
                        Correo Electrónico (Opcional)
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="correo@ejemplo.com"
                        className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
                    >
                      Mensaje, Solicitud de Discipulado/Consejería o Petición de Oración *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Escribe aquí tu consulta, disponibilidad para discipulado personalizado o consejería, o tu petición de oración..."
                      className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Línea WhatsApp seleccionada:{' '}
                      <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                        {selectedPhone}
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                    >
                      <Send className="w-4 h-4 shrink-0" />
                      <span>Enviar Mensaje Pastoral</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
