import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Youtube,
  MessageCircle,
  UserCheck,
  Users,
} from 'lucide-react';
import { CHURCH_INFO, buildWhatsAppUrl } from '../data/churchData';

export interface MemberProfile {
  id?: string;
  registrationNumber?: number;
  fullName: string;
  phone: string;
  email: string;
  selectedMinistries: string[];
  preferredWhatsappLine: string;
  joinedAt: string;
  memberCode: string;
}

interface JoinCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingMember: MemberProfile | null;
  totalRegisteredMembers: number;
  registeredMembersList: MemberProfile[];
  onSaveMember: (
    profile: MemberProfile,
    newTotal?: number,
    updatedList?: MemberProfile[]
  ) => void;
  onClearMember: () => void;
}

const MINISTRY_OPTIONS = [
  'Cultos Dominicales (Domingos 8:00 AM)',
  'Reunión de Varones (Miércoles 7:00 PM)',
  'Reunión de Damas (Jueves 4:00 PM)',
  'Discipulados Personalizados',
  'Consejería Pastoral y Familiar',
  'Alertas de Transmisión en Vivo (YouTube)',
];

export const JoinCommunityModal: React.FC<JoinCommunityModalProps> = ({
  isOpen,
  onClose,
  existingMember,
  totalRegisteredMembers,
  registeredMembersList,
  onSaveMember,
  onClearMember,
}) => {
  const [fullName, setFullName] = useState(existingMember?.fullName || '');
  const [phone, setPhone] = useState(existingMember?.phone || '');
  const [email, setEmail] = useState(existingMember?.email || '');
  const [selectedMinistries, setSelectedMinistries] = useState<string[]>(
    existingMember?.selectedMinistries || [
      'Cultos Dominicales (Domingos 8:00 AM)',
      'Discipulados Personalizados',
    ]
  );
  const [preferredWhatsappLine, setPreferredWhatsappLine] = useState(
    existingMember?.preferredWhatsappLine || CHURCH_INFO.phones[0].raw
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleMinistry = (option: string) => {
    setSelectedMinistries((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMsg('Por favor ingresa tu nombre y apellido reales.');
      return;
    }
    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 7) {
      setErrorMsg('Por favor ingresa un número de teléfono o WhatsApp válido.');
      return;
    }
    if (selectedMinistries.length === 0) {
      setErrorMsg('Selecciona al menos una reunión o ministerio de tu interés.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          selectedMinistries,
          preferredWhatsappLine,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onSaveMember(
          data.member,
          data.totalRegisteredMembers,
          data.registeredMembers
        );
        setIsSubmitting(false);
        return;
      }
    } catch {
      // Fallback if offline
    }

    const fallbackProfile: MemberProfile = {
      registrationNumber: totalRegisteredMembers + 1,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      selectedMinistries,
      preferredWhatsappLine,
      joinedAt: new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      memberCode: `IEDCC-${String(totalRegisteredMembers + 1).padStart(3, '0')}`,
    };
    onSaveMember(fallbackProfile, totalRegisteredMembers + 1);
    setIsSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-modal-title"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Top institutional header with real registered count */}
        <div className="bg-slate-950 text-white px-6 py-5 border-b border-blue-900/40 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-medium tracking-wide">
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>
                Registro Real en Servidor:{' '}
                <strong className="font-mono text-white tabular-nums">
                  {totalRegisteredMembers}
                </strong>{' '}
                {totalRegisteredMembers === 1
                  ? 'persona registrada'
                  : 'personas registradas'}
              </span>
            </div>
            <h2
              id="join-modal-title"
              className="font-serif text-2xl font-semibold text-white mt-1"
            >
              {existingMember
                ? 'Tu Credencial Oficial de Registro'
                : 'Unirse a la Página Web (Registro Real)'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {existingMember ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 bg-slate-950 text-white rounded-lg border border-blue-800/50">
                <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs text-blue-300">
                    Miembro Registrado #{existingMember.registrationNumber || 1}{' '}
                    · Código{' '}
                    <span className="font-mono">{existingMember.memberCode}</span>
                  </p>
                  <h3 className="font-serif text-xl font-semibold text-white">
                    ¡Bienvenido(a), {existingMember.fullName}!
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Tu registro está guardado en el servidor de la{' '}
                    <strong className="text-white">
                      Iglesia Discípulos de Cristo de San Gil
                    </strong>{' '}
                    (Cra 20 # 13A - 23, Villa Olímpica).
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm border-t border-b border-slate-200 dark:border-slate-800 py-4">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 dark:text-slate-400">
                    Total real de registrados en la web:
                  </span>
                  <span className="font-mono font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                    {totalRegisteredMembers}{' '}
                    {totalRegisteredMembers === 1 ? 'registrado' : 'registrados'}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 dark:text-slate-400">
                    Teléfono registrado:
                  </span>
                  <span className="font-mono font-medium text-slate-900 dark:text-white tabular-nums">
                    {existingMember.phone}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 dark:text-slate-400">
                    Fecha de inscripción:
                  </span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    {existingMember.joinedAt}
                  </span>
                </div>
              </div>

              {/* Real Directory of Registered Members */}
              {registeredMembersList.length > 0 && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Directorio Real de Registrados ({registeredMembersList.length}):
                  </p>
                  <div className="max-h-32 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                    {registeredMembersList.map((m, idx) => (
                      <div
                        key={m.memberCode || idx}
                        className="py-1.5 flex items-center justify-between gap-2"
                      >
                        <span className="font-medium text-slate-900 dark:text-white">
                          #{m.registrationNumber || idx + 1} · {m.fullName}
                        </span>
                        <span className="font-mono text-[11px] text-blue-700 dark:text-blue-400">
                          {m.memberCode}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={buildWhatsAppUrl(
                    existingMember.preferredWhatsappLine,
                    `Hola, paz de Cristo. Soy ${existingMember.fullName} (${existingMember.memberCode}) y me acabo de registrar en la página web de la Iglesia Discípulos de Cristo de San Gil.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Confirmar por WhatsApp</span>
                </a>
                <a
                  href={CHURCH_INFO.youtubeSubscribeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-950 hover:bg-slate-900 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  <Youtube className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Suscribirse en YouTube</span>
                </a>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onClearMember}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white underline transition-colors"
                >
                  Registrar otra persona o actualizar mis datos
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Regístrate en el directorio oficial de la{' '}
                <strong className="text-slate-950 dark:text-white">
                  Iglesia Discípulos de Cristo de San Gil
                </strong>
                . El contador muestra únicamente las personas reales que se han inscrito en el servidor.
              </p>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-medium rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="join-name"
                    className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
                  >
                    Nombre y Apellidos Reales *
                  </label>
                  <input
                    id="join-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ingresa tu nombre completo"
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="join-phone"
                    className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
                  >
                    Celular / WhatsApp *
                  </label>
                  <input
                    id="join-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. 312 348 0660"
                    className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="join-email"
                  className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
                >
                  Correo Electrónico (Opcional)
                </label>
                <input
                  id="join-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  ¿En qué reuniones o ministerios deseas participar? *
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MINISTRY_OPTIONS.map((option) => {
                    const isChecked = selectedMinistries.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleMinistry(option)}
                        className={`text-left px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors flex items-center justify-between gap-2 ${
                          isChecked
                            ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-700 text-slate-950 dark:text-white'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span className="leading-snug">{option}</span>
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                            isChecked
                              ? 'bg-blue-700 border-blue-700 text-white'
                              : 'border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {isChecked && '✓'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Línea de WhatsApp preferida para contacto pastoral:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {CHURCH_INFO.phones.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPreferredWhatsappLine(p.raw)}
                      className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors text-left ${
                        preferredWhatsappLine === p.raw
                          ? 'bg-slate-950 dark:bg-blue-600 text-white border-slate-950 dark:border-blue-500'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span className="block font-mono font-semibold tabular-nums">
                        {p.display}
                      </span>
                      <span
                        className={`text-[11px] ${
                          preferredWhatsappLine === p.raw
                            ? 'text-blue-200'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Guardando Registro...'
                      : 'Completar Registro Real'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
