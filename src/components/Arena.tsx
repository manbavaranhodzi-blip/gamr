/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CharacterState, Distance, VisualEffect } from '../types/game';
import { CharacterSprite } from './CharacterSprite';

interface ArenaProps {
  morvan: CharacterState;
  elyra: CharacterState;
  distance: Distance;
  activeEffects: VisualEffect[];
  isScreenShaking: boolean;
  attackerId: 'morvan' | 'elyra' | null;
  targetId: 'morvan' | 'elyra' | null;
}

export const Arena: React.FC<ArenaProps> = ({
  morvan,
  elyra,
  distance,
  activeEffects,
  isScreenShaking,
  attackerId,
  targetId,
}) => {
  // Вычисляем горизонтальные позиции бойцов в зависимости от текущей дистанции
  const getPositions = () => {
    switch (distance) {
      case 'far':
        return { morvanX: '10%', elyraX: '72%' };
      case 'mid':
        return { morvanX: '22%', elyraX: '60%' };
      case 'close':
        return { morvanX: '33%', elyraX: '49%' };
    }
  };

  const { morvanX, elyraX } = getPositions();

  return (
    <div
      className={`relative w-full max-w-6xl mx-auto h-[380px] md:h-[480px] bg-stone-950 border-2 border-stone-800 shadow-2xl overflow-hidden rounded-sm select-none ${
        isScreenShaking ? 'animate-screen-shake' : ''
      }`}
    >
      {/* 1. ЗАДНИЙ ПЛАН: ТЕМНЫЕ СТЕНЫ И ГОТИЧЕСКИЕ АРКИ */}
      <div className="absolute inset-0 bg-radial from-stone-900/60 via-stone-950/90 to-black pointer-events-none" />

      {/* Готические декоративные арки на стене */}
      <svg className="absolute top-0 inset-x-0 w-full h-64 opacity-25 pointer-events-none" preserveAspectRatio="none">
        {/* Арка 1 слева */}
        <path d="M 50 250 L 50 100 Q 150 10 250 100 L 250 250" fill="none" stroke="#78716c" strokeWidth="4" />
        <path d="M 70 250 L 70 110 Q 150 35 230 110 L 230 250" fill="none" stroke="#57534e" strokeWidth="2" />
        {/* Арка 2 по центру */}
        <path d="M 350 250 L 350 90 Q 500 0 650 90 L 650 250" fill="none" stroke="#78716c" strokeWidth="4" />
        <path d="M 370 250 L 370 100 Q 500 25 630 100 L 630 250" fill="none" stroke="#57534e" strokeWidth="2" />
        {/* Арка 3 справа */}
        <path d="M 750 250 L 750 100 Q 850 10 950 100 L 950 250" fill="none" stroke="#78716c" strokeWidth="4" />
        <path d="M 770 250 L 770 110 Q 850 35 930 110 L 930 250" fill="none" stroke="#57534e" strokeWidth="2" />
      </svg>

      {/* 2. РАЗРУШЕННЫЕ ГОТИЧЕСКИЕ КОЛОННЫ */}
      {/* Колонна 1 (Слева, обломанная) */}
      <div className="absolute bottom-28 left-6 md:left-12 w-14 md:w-20 pointer-events-none opacity-80">
        <div className="h-44 md:h-60 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-900 border-x border-stone-600/50 relative">
          <div className="absolute top-0 inset-x-0 h-6 bg-stone-700 clip-path-jagged" />
          {/* Трещины на колонне */}
          <svg className="absolute inset-0 w-full h-full opacity-40">
            <path d="M 5 20 L 18 50 L 10 90 L 15 130" stroke="#1c1917" strokeWidth="2" fill="none" />
            <path d="M 12 60 L 22 75" stroke="#1c1917" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
        <div className="h-5 bg-stone-900 border border-stone-700" />
      </div>

      {/* Колонна 2 (Справа, полуразрушенная) */}
      <div className="absolute bottom-28 right-6 md:right-12 w-14 md:w-20 pointer-events-none opacity-80">
        <div className="h-52 md:h-72 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-900 border-x border-stone-600/50 relative">
          <svg className="absolute inset-0 w-full h-full opacity-40">
            <path d="M 15 10 L 8 60 L 16 110 L 10 160" stroke="#1c1917" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div className="h-5 bg-stone-900 border border-stone-700" />
      </div>

      {/* 3. ГОРЯЩИЕ СВЕЧИ СО СВЕТОМ */}
      {/* Свечной канделябр 1 (слева) */}
      <div className="absolute bottom-32 left-28 md:left-36 flex flex-col items-center pointer-events-none">
        <div className="w-2.5 h-3.5 bg-amber-400 rounded-full blur-[1px] animate-flicker shadow-[0_0_15px_rgba(251,191,36,0.9)]" />
        <div className="w-1.5 h-7 bg-stone-200 border-x border-stone-400" />
        <div className="w-4 h-1.5 bg-stone-700" />
      </div>

      {/* Свечной канделябр 2 (в центре арены) */}
      <div className="absolute bottom-36 left-1/2 -translate-x-1/2 flex items-end gap-3 pointer-events-none opacity-75">
        <div className="flex flex-col items-center">
          <div className="w-2 h-3 bg-amber-400 rounded-full blur-[1px] animate-flicker shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
          <div className="w-1.5 h-6 bg-stone-200" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-2.5 h-4 bg-amber-300 rounded-full blur-[1px] animate-flicker shadow-[0_0_16px_rgba(251,191,36,0.9)]" />
          <div className="w-2 h-9 bg-stone-200" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-2 h-3 bg-amber-400 rounded-full blur-[1px] animate-flicker shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
          <div className="w-1.5 h-5 bg-stone-200" />
        </div>
      </div>

      {/* Свечной канделябр 3 (справа) */}
      <div className="absolute bottom-32 right-28 md:right-36 flex flex-col items-center pointer-events-none">
        <div className="w-2.5 h-3.5 bg-amber-400 rounded-full blur-[1px] animate-flicker shadow-[0_0_15px_rgba(251,191,36,0.9)]" />
        <div className="w-1.5 h-7 bg-stone-200 border-x border-stone-400" />
        <div className="w-4 h-1.5 bg-stone-700" />
      </div>

      {/* 4. КАМЕННЫЙ ПОЛ АРЕНЫ С ПЛИТАМИ И ТРЕЩИНАМИ */}
      <div className="absolute bottom-0 inset-x-0 h-32 md:h-40 bg-gradient-to-t from-stone-950 via-stone-900 to-stone-850 border-t-2 border-stone-700">
        {/* Сетка каменных плит */}
        <div className="absolute inset-0 grid grid-cols-6 md:grid-cols-12 opacity-30 pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="border-r border-b border-black h-16" />
          ))}
        </div>

        {/* Глубокие трещины в каменном полу */}
        <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none">
          <path d="M 120 10 L 160 40 L 140 80 L 190 120" stroke="#0c0a09" strokeWidth="2.5" fill="none" />
          <path d="M 155 45 L 180 55" stroke="#0c0a09" strokeWidth="1.5" fill="none" />
          <path d="M 450 15 L 490 50 L 520 40 L 550 90 L 590 110" stroke="#0c0a09" strokeWidth="2.5" fill="none" />
          <path d="M 520 40 L 540 20" stroke="#0c0a09" strokeWidth="1.5" fill="none" />
          <path d="M 800 20 L 830 60 L 870 95 L 850 130" stroke="#0c0a09" strokeWidth="2.5" fill="none" />
        </svg>

        {/* Древний рунический круг в центре пола арены */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-72 md:w-96 h-28 border border-stone-700/40 rounded-[100%] pointer-events-none flex items-center justify-center">
          <div className="w-56 md:w-80 h-20 border border-stone-600/30 rounded-[100%]" />
        </div>
      </div>

      {/* 5. СЛАБЫЙ ТУМАН (ДВА СЛОЯ АНИМИРОВАННОЙ МГЛЫ) */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-stone-900/50 via-purple-950/20 to-transparent pointer-events-none animate-mist" />
      <div
        className="absolute bottom-4 inset-x-0 h-20 bg-gradient-to-r from-transparent via-stone-400/10 to-transparent pointer-events-none animate-mist"
        style={{ animationDirection: 'reverse', animationDuration: '24s' }}
      />

      {/* 6. ПЕРСОНАЖИ В АРЕНЕ (С ПЛАВНЫМ ПЕРЕМЕЩЕНИЕМ ПРИ СБЛИЖЕНИИ/ОТХОДЕ) */}
      {/* MORVAN (Слева) */}
      <div
        className="absolute bottom-10 transition-all duration-500 ease-out"
        style={{ left: morvanX }}
      >
        <CharacterSprite
          character={morvan}
          isAttacking={attackerId === 'morvan'}
          isTakingHit={targetId === 'morvan'}
          isActing={morvan.status === 'attacking'}
          facing="right"
        />
      </div>

      {/* ELYRA (Справа) */}
      <div
        className="absolute bottom-10 transition-all duration-500 ease-out"
        style={{ left: elyraX }}
      >
        <CharacterSprite
          character={elyra}
          isAttacking={attackerId === 'elyra'}
          isTakingHit={targetId === 'elyra'}
          isActing={elyra.status === 'attacking'}
          facing="left"
        />
      </div>

      {/* 7. ВИЗУАЛЬНЫЕ ЭФФЕКТЫ (Particles, Projectiles, Axe Slashes, Damage Numbers) */}
      {activeEffects.map((effect) => {
        // А) ЭФФЕКТ МАГИЧЕСКОГО СНАРЯДА (Сфера Бездны)
        if (effect.type === 'magic_projectile') {
          return (
            <div
              key={effect.id}
              className="absolute top-1/2 left-0 right-0 pointer-events-none flex items-center justify-center z-30"
            >
              <div className="relative animate-ping">
                <div className="w-12 h-12 rounded-full bg-purple-500 blur-sm shadow-[0_0_30px_#a855f7]" />
                <div className="absolute inset-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>
          );
        }

        // Б) ЭФФЕКТ ДВИЖЕНИЯ ТОПОРА (Рассекающая дуга)
        if (effect.type === 'axe_slash') {
          return (
            <div
              key={effect.id}
              className="absolute top-1/3 left-1/2 -translate-x-1/2 pointer-events-none z-30"
            >
              <svg className="w-48 h-48 animate-spin" viewBox="0 0 200 200">
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_12px_#f59e0b]"
                />
              </svg>
            </div>
          );
        }

        // В) ВСПЫШКА ПРИ УДАРЕ / УРОНЕ
        if (effect.type === 'hit_flash' || effect.type === 'hurt_flash') {
          return (
            <div
              key={effect.id}
              className="absolute inset-0 bg-red-600/25 pointer-events-none z-20 animate-pulse"
            />
          );
        }

        // Г) ЧАСТИЦЫ ПРИ ПОПАДАНИИ
        if (effect.type === 'particles') {
          return (
            <div
              key={effect.id}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-amber-400/40 blur-md animate-ping" />
              <div className="absolute w-2 h-2 rounded-full bg-yellow-200 translate-x-4 -translate-y-4 animate-bounce" />
              <div className="absolute w-2 h-2 rounded-full bg-amber-300 -translate-x-4 translate-y-3 animate-bounce" />
              <div className="absolute w-3 h-3 rounded-full bg-purple-400 -translate-x-3 -translate-y-3 animate-ping" />
            </div>
          );
        }

        // Д) ЧИСЛО УРОНА ИЛИ СТАТУС БЛОКА/УКЛОНЕНИЯ
        if (effect.type === 'damage_number') {
          return (
            <div
              key={effect.id}
              className={`absolute top-20 left-1/2 -translate-x-1/2 font-cinzel font-black text-2xl md:text-4xl pointer-events-none z-40 animate-bounce tracking-widest ${
                effect.color || 'text-red-500'
              }`}
              style={{
                textShadow: '0 0 10px rgba(0,0,0,0.9), 0 0 20px rgba(239,68,68,0.6)',
              }}
            >
              {effect.text}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
