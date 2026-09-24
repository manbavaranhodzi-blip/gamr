/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CharacterState } from '../types/game';

interface CharacterSpriteProps {
  character: CharacterState;
  isAttacking: boolean;
  isTakingHit: boolean;
  isActing: boolean;
  facing: 'right' | 'left';
}

export const CharacterSprite: React.FC<CharacterSpriteProps> = ({
  character,
  isAttacking,
  isTakingHit,
  isActing,
  facing,
}) => {
  const isMorvan = character.id === 'morvan';
  const flip = facing === 'left' ? 'scale-x-[-1]' : '';

  return (
    <div
      className={`relative w-44 h-64 md:w-56 md:h-80 flex items-center justify-center transition-transform duration-300 ${flip} ${
        isTakingHit ? 'animate-bounce filter brightness-150 contrast-125' : ''
      } ${character.status === 'defeated' ? 'opacity-40 rotate-90 translate-y-16' : ''}`}
    >
      {/* Тень под ногами персонажа */}
      <div className="absolute bottom-2 w-32 md:w-40 h-6 bg-black/60 rounded-[100%] blur-sm" />

      {/* ЭФФЕКТ БЛОКА (Свечение щита или барьера) */}
      {character.isBlocking && (
        <div
          className={`absolute inset-0 rounded-full border-2 animate-pulse pointer-events-none ${
            isMorvan
              ? 'border-amber-400/80 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.5)]'
              : 'border-purple-400/80 bg-purple-500/15 shadow-[0_0_25px_rgba(168,85,247,0.6)]'
          }`}
        />
      )}

      {/* ЭФФЕКТ УКЛОНЕНИЯ (Теневое размытие) */}
      {character.isDodging && (
        <div className="absolute inset-0 rounded-xl bg-cyan-500/20 blur-md animate-ping pointer-events-none" />
      )}

      {/* ОТОБРАЖЕНИЕ СПРАЙТА: MORVAN ИЛИ ELYRA */}
      {isMorvan ? (
        <svg
          viewBox="0 0 200 260"
          className={`w-full h-full drop-shadow-2xl transition-all duration-200 ${
            isAttacking ? 'translate-x-6 rotate-3' : isActing ? 'translate-x-3' : ''
          }`}
        >
          {/* МАНТИЯ И МЕХ */}
          <path
            d="M 50 80 Q 20 160 30 220 L 70 230 Q 65 140 75 90 Z"
            fill="#3e2723"
            stroke="#1b1210"
            strokeWidth="2"
          />
          <path
            d="M 120 85 Q 165 155 160 220 L 125 225 Q 115 145 105 90 Z"
            fill="#4a2e2b"
            stroke="#1b1210"
            strokeWidth="2"
          />

          {/* НОГИ В ЖЕЛЕЗНЫХ ПОНОЖАХ */}
          <rect x="68" y="170" width="22" height="60" rx="4" fill="#2d3748" stroke="#1a202c" strokeWidth="2" />
          <rect x="102" y="170" width="22" height="60" rx="4" fill="#1a202c" stroke="#111827" strokeWidth="2" />
          {/* Ботинки */}
          <path d="M 64 225 L 94 225 L 98 240 L 58 240 Z" fill="#1c1917" />
          <path d="M 98 225 L 128 225 L 132 240 L 94 240 Z" fill="#0c0a09" />

          {/* ТОРС: ТЯЖЕЛЫЙ ЛАТНЫЙ ДОСПЕХ */}
          <path
            d="M 60 85 L 132 85 L 124 175 L 68 175 Z"
            fill="#334155"
            stroke="#0f172a"
            strokeWidth="3"
          />
          {/* Нагрудные заклепки и пластины */}
          <path d="M 96 85 L 96 175" stroke="#1e293b" strokeWidth="2" />
          <path d="M 66 115 L 126 115" stroke="#1e293b" strokeWidth="2" />
          <circle cx="80" cy="100" r="3" fill="#cbd5e1" />
          <circle cx="112" cy="100" r="3" fill="#cbd5e1" />

          {/* ПОЯС С МЕТАЛЛИЧЕСКОЙ ПРЯЖКОЙ */}
          <rect x="64" y="165" width="64" height="12" fill="#78350f" stroke="#451a03" strokeWidth="2" />
          <rect x="88" y="162" width="16" height="18" fill="#d97706" stroke="#78350f" strokeWidth="2" />

          {/* МЕХОВЫЕ НАПЛЕЧНИКИ */}
          <ellipse cx="55" cy="88" rx="20" ry="14" fill="#713f12" stroke="#422006" strokeWidth="2" />
          <ellipse cx="137" cy="88" rx="20" ry="14" fill="#58310e" stroke="#422006" strokeWidth="2" />

          {/* ГОЛОВА: ШЛЕМ С РОГАМИ И СВЕТЯЩИМСЯ ВЗОРОМ */}
          <ellipse cx="96" cy="58" rx="18" ry="22" fill="#475569" stroke="#1e293b" strokeWidth="2" />
          {/* Т-образное забрало шлема */}
          <path d="M 86 52 L 106 52 M 96 52 L 96 68" stroke="#0f172a" strokeWidth="4" />
          {/* Горящий боевой взгляд */}
          <circle cx="91" cy="52" r="2.5" fill="#f59e0b" />
          <circle cx="101" cy="52" r="2.5" fill="#f59e0b" />
          {/* Рога на шлеме */}
          <path
            d="M 80 50 Q 60 30 52 18 Q 70 30 82 44 Z"
            fill="#e2e8f0"
            stroke="#64748b"
            strokeWidth="1.5"
          />
          <path
            d="M 112 50 Q 132 30 140 18 Q 122 30 110 44 Z"
            fill="#e2e8f0"
            stroke="#64748b"
            strokeWidth="1.5"
          />

          {/* РУКИ И ОРУЖИЕ: БОЕВОЙ ТОПОР */}
          <g
            className={`transition-transform origin-[130px_100px] duration-200 ${
              isAttacking ? 'rotate-45 translate-x-4' : ''
            }`}
          >
            {/* Рукоять топора */}
            <line x1="120" y1="160" x2="160" y2="40" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
            <line x1="120" y1="160" x2="160" y2="40" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />

            {/* Двуручное широкое лезвие топора */}
            <path
              d="M 155 55 Q 190 20 180 75 Q 165 65 152 65 Z"
              fill="#94a3b8"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            <path
              d="M 150 45 Q 120 20 135 70 Q 145 60 152 55 Z"
              fill="#64748b"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            {/* Заточенная сияющая кромка топора */}
            <path d="M 180 75 Q 190 20 155 55" fill="none" stroke="#f8fafc" strokeWidth="2" />
            <circle cx="152" cy="58" r="4" fill="#d97706" />
          </g>

          {/* Рука спереди */}
          <circle cx="118" cy="115" r="9" fill="#475569" stroke="#1e293b" strokeWidth="2" />
        </svg>
      ) : (
        /* ELYRA: ГОТИЧЕСКАЯ КОЛДУНЬЯ */
        <svg
          viewBox="0 0 200 260"
          className={`w-full h-full drop-shadow-2xl transition-all duration-200 ${
            isAttacking ? '-translate-x-4 scale-105' : isActing ? '-translate-x-2' : ''
          }`}
        >
          {/* СВЕТЯЩАЯСЯ МАГИЧЕСКАЯ АУРА */}
          <ellipse
            cx="100"
            cy="130"
            rx="55"
            ry="90"
            fill="none"
            stroke="rgba(168, 85, 247, 0.2)"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="animate-spin origin-center"
            style={{ animationDuration: '14s' }}
          />

          {/* ДЛИННОЕ ТЕМНОЕ ПЛАТЬЕ/МАНТИЯ */}
          <path
            d="M 75 90 Q 55 180 40 235 L 145 235 Q 135 180 118 90 Z"
            fill="#2e1065"
            stroke="#170536"
            strokeWidth="2.5"
          />
          {/* Внутренние складки и руны подола */}
          <path d="M 96 95 L 90 235" stroke="#3b0764" strokeWidth="2" />
          <path d="M 78 120 L 70 235" stroke="#3b0764" strokeWidth="1.5" />
          <path d="M 112 120 L 118 235" stroke="#3b0764" strokeWidth="1.5" />
          {/* Светящиеся руны на подоле */}
          <circle cx="65" cy="220" r="2" fill="#c084fc" />
          <circle cx="85" cy="225" r="2.5" fill="#e879f9" />
          <circle cx="105" cy="225" r="2.5" fill="#e879f9" />
          <circle cx="125" cy="220" r="2" fill="#c084fc" />

          {/* КОРСЕТ И ТОРС */}
          <path
            d="M 80 85 L 115 85 L 110 145 L 82 145 Z"
            fill="#1e1b4b"
            stroke="#0f172a"
            strokeWidth="2"
          />
          {/* Шнуровка корсета */}
          <line x1="92" y1="95" x2="102" y2="105" stroke="#a855f7" strokeWidth="1.5" />
          <line x1="102" y1="105" x2="92" y2="115" stroke="#a855f7" strokeWidth="1.5" />
          <line x1="92" y1="115" x2="102" y2="125" stroke="#a855f7" strokeWidth="1.5" />

          {/* ГОЛОВА: ГОТИЧЕСКИЙ КАПЮШОН И ЛИЦО */}
          <path
            d="M 78 68 Q 96 30 116 68 Q 120 90 96 85 Q 74 90 78 68 Z"
            fill="#3b0764"
            stroke="#1e0538"
            strokeWidth="2"
          />
          {/* Бледное лицо в тени капюшона */}
          <ellipse cx="97" cy="64" rx="11" ry="13" fill="#e2e8f0" />
          {/* Светящиеся фиолетовые глаза */}
          <ellipse cx="93" cy="62" rx="2" ry="3" fill="#c084fc" />
          <ellipse cx="101" cy="62" rx="2" ry="3" fill="#c084fc" />
          {/* Серебряная диадема с рожками */}
          <path d="M 86 52 L 97 42 L 108 52" fill="none" stroke="#e0e7ff" strokeWidth="2" />
          <circle cx="97" cy="46" r="2.5" fill="#a855f7" />

          {/* ПОСОХ КОЛДУНЬИ С КРИСТАЛЛОМ */}
          <g
            className={`transition-transform origin-[125px_130px] duration-200 ${
              isAttacking ? '-rotate-15 -translate-x-3' : ''
            }`}
          >
            {/* Древко посоха */}
            <line x1="125" y1="230" x2="125" y2="45" stroke="#374151" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="125" y1="230" x2="125" y2="45" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />

            {/* Серебряное навершие посоха */}
            <path
              d="M 116 48 Q 125 35 134 48 Q 138 25 125 18 Q 112 25 116 48 Z"
              fill="#4b5563"
              stroke="#111827"
              strokeWidth="1.5"
            />

            {/* ПАРИРУЮЩИЙ АСТРАЛЬНЫЙ КРИСТАЛЛ */}
            <g className="animate-float-orb">
              <polygon
                points="125,20 133,32 125,44 117,32"
                fill="#d8b4fe"
                stroke="#a855f7"
                strokeWidth="1.5"
              />
              <circle cx="125" cy="32" r="3" fill="#ffffff" />
            </g>
          </g>

          {/* Левая рука, направляющая заклинание */}
          <path
            d="M 80 100 Q 60 110 50 120"
            fill="none"
            stroke="#4b5563"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="50" cy="120" r="4.5" fill="#e2e8f0" />
        </svg>
      )}
    </div>
  );
};
