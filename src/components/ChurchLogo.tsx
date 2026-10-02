import React from 'react';

interface ChurchLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'card' | 'inline' | 'banner';
  subtitle?: string;
  className?: string;
}

/**
 * Reproducción vectorial fiel del logo oficial subido por el usuario:
 * Paloma azul turquesa con plumas azul profundo volando hacia el globo terráqueo,
 * tipografía "iedcc" con remates suaves en negro carbón y "San Gil" debajo.
 */
const OfficialIedccSvg: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg
    viewBox="0 0 320 300"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Logo Oficial IEDCC San Gil - Iglesia Discípulos de Cristo de San Gil"
  >
    {/* Globo Terráqueo (Derecha) */}
    <g transform="translate(155, 34)">
      <circle cx="62" cy="62" r="60" fill="#EFEBF1" />
      {/* Continentes estilizados (América, Europa, África) */}
      <path
        d="M25 22C32 18 44 16 52 22C48 28 40 31 35 37C32 42 38 47 43 50C38 55 29 53 23 48C17 43 16 34 25 22Z"
        fill="#CEC6D0"
      />
      <path
        d="M35 66C44 65 55 72 58 81C61 91 52 104 44 114C39 119 35 112 34 103C33 93 26 84 28 74C29 69 31 67 35 66Z"
        fill="#CEC6D0"
      />
      <path
        d="M74 12C86 14 99 22 106 34C101 39 92 38 85 42C79 45 78 52 84 55C92 58 103 54 111 60C117 66 119 79 114 91C108 104 97 112 88 115C83 107 84 95 81 86C77 77 69 73 71 64C73 56 80 51 77 43C74 36 66 32 67 23C68 17 70 13 74 12Z"
        fill="#CEC6D0"
      />
      <circle cx="62" cy="62" r="60" stroke="#D8D0DA" strokeWidth="1.5" />
    </g>

    {/* Paloma Azul Turquesa y Azul Profundo (Izquierda a Centro) */}
    <g transform="translate(22, 36)">
      {/* Pluma exterior azul marino oscuro */}
      <path
        d="M6 26C16 48 34 68 58 78C39 62 24 44 6 26Z"
        fill="#074F7B"
      />
      {/* Segunda pluma azul profundo */}
      <path
        d="M12 16C25 42 45 64 72 75C52 56 34 36 12 16Z"
        fill="#0A6E9D"
      />
      {/* Pluma principal superior turquesa brillante */}
      <path
        d="M20 4C38 30 62 56 96 68C104 48 92 26 68 14C50 6 34 4 20 4Z"
        fill="#29C4E4"
      />
      {/* Cola inferior turquesa */}
      <path
        d="M84 82C72 96 60 112 52 132C70 116 88 102 108 92L84 82Z"
        fill="#35C8E6"
      />
      {/* Cuerpo principal de la paloma volando hacia el globo */}
      <path
        d="M20 4C36 42 64 72 102 86C128 96 156 86 172 64C177 57 184 53 196 54C187 46 175 42 162 43C146 44 132 52 116 58C86 48 52 28 20 4Z"
        fill="#28C3E3"
      />
      {/* Pecho y ala interna */}
      <path
        d="M98 66C116 52 140 43 164 43C176 43 187 47 196 54C184 53 177 57 172 64C157 85 130 95 104 86C92 82 86 74 98 66Z"
        fill="#3AD0EC"
      />
    </g>

    {/* Texto "iedcc" en tipografía slab redondeada color carbón oscuro */}
    <g fill="#1B2129">
      <circle cx="64" cy="156" r="9.5" />
      <path d="M52 172H72V212H78V224H50V212H56V184H52V172Z" />
      <path d="M108 170C125 170 136 181 136 197C136 199 136 201 135 202H96C97 209 102 213 110 213C116 213 121 210 124 207L134 215C128 222 120 225 109 225C91 225 79 213 79 197C79 181 91 170 108 170ZM96 192H120C119 185 114 181 108 181C101 181 97 185 96 192Z" />
      <path d="M178 150H198V212H204V224H182V217C178 222 172 225 164 225C149 225 139 213 139 197C139 181 149 170 164 170C171 170 177 173 181 178V162H178V150ZM169 212C176 212 181 206 181 197C181 188 176 182 169 182C161 182 156 188 156 197C156 206 161 212 169 212Z" />
      <path d="M235 170C247 170 256 176 260 186L245 192C243 186 239 183 234 183C226 183 221 189 221 197C221 206 226 212 234 212C240 212 244 209 246 203L260 209C256 219 247 225 235 225C217 225 205 213 205 197C205 181 217 170 235 170Z" />
      <path d="M289 170C301 170 310 176 314 186L299 192C297 186 293 183 288 183C280 183 275 189 275 197C275 206 280 212 288 212C294 212 298 209 300 203L314 209C310 219 301 225 289 225C271 225 259 213 259 197C259 181 271 170 289 170Z" />
    </g>

    {/* Texto "San Gil" en negro sólido debajo */}
    <text
      x="165"
      y="274"
      textAnchor="middle"
      fill="#000000"
      fontFamily="Plus Jakarta Sans, sans-serif"
      fontWeight="800"
      fontSize="34"
      letterSpacing="-0.5"
    >
      San Gil
    </text>
  </svg>
);

export const ChurchLogo: React.FC<ChurchLogoProps> = ({
  size = 'md',
  variant = 'inline',
  subtitle,
  className = '',
}) => {
  if (variant === 'banner') {
    return (
      <div
        className={`relative w-full h-full flex flex-col items-center justify-center bg-white p-6 sm:p-10 select-none overflow-hidden ${className}`}
      >
        {/* Marco arquitectónico sutil blanco y azul */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(41,196,228,0.08),transparent_70%)]"
          aria-hidden="true"
        />
        <div className="relative z-10 w-48 sm:w-56 md:w-64 aspect-[16/15] flex items-center justify-center">
          <OfficialIedccSvg className="w-full h-full drop-shadow-xs" />
        </div>
        {subtitle && (
          <p className="relative z-10 mt-2 text-xs font-semibold text-slate-600 tracking-wide text-center">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    const dimensions =
      size === 'xl'
        ? 'w-44 h-44 p-4'
        : size === 'lg'
        ? 'w-32 h-32 p-3'
        : size === 'md'
        ? 'w-24 h-24 p-2.5'
        : 'w-14 h-14 p-1.5';

    return (
      <div
        className={`inline-flex items-center justify-center bg-white rounded-2xl shadow-md border border-slate-200/80 shrink-0 select-none ${dimensions} ${className}`}
        title="Logo Oficial IEDCC San Gil - Iglesia Discípulos de Cristo de San Gil"
      >
        <OfficialIedccSvg />
      </div>
    );
  }

  // Inline compact logo
  const iconSize =
    size === 'lg'
      ? 'w-12 h-12'
      : size === 'md'
      ? 'w-10 h-10'
      : 'w-8 h-8';

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`inline-flex items-center justify-center bg-white rounded-lg p-1 shadow-xs border border-slate-200 shrink-0 ${iconSize}`}
      >
        <OfficialIedccSvg />
      </span>
    </span>
  );
};
