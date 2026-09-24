/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { CharacterState, Distance, GamePhase } from '../types/game';

interface HPBarProps {
  morvan: CharacterState;
  elyra: CharacterState;
  distance: Distance;
  phase: GamePhase;
}

export const HPBar: React.FC<HPBarProps> = ({ morvan, elyra, distance, phase }) => {
  // Плавное отставание красной полосы урона (Ghost bar effect)
  const [morvanGhostHp, setMorvanGhostHp] = useState(morvan.hp);
  const [elyraGhostHp, setElyraGhostHp] = useState(elyra.hp);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMorvanGhostHp(morvan.hp);
    }, 450);
    return () => clearTimeout(timer);
  }, [morvan.hp]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setElyraGhostHp(elyra.hp);
    }, 450);
    return () => clearTimeout(timer);
  }, [elyra.hp]);

  const morvanPct = Math.max(0, Math.min(100, (morvan.hp / morvan.maxHp) * 100));
  const morvanGhostPct = Math.max(0, Math.min(100, (morvanGhostHp / morvan.maxHp) * 100));

  const elyraPct = Math.max(0, Math.min(100, (elyra.hp / elyra.maxHp) * 100));
  const elyraGhostPct = Math.max(0, Math.min(100, (elyraGhostHp / elyra.maxHp) * 100));

  const distanceLabel =
    distance === 'close'
      ? 'БЛИЗКАЯ ДИСТАНЦИЯ'
      : distance === 'mid'
      ? 'СРЕДНЯЯ ДИСТАНЦИЯ'
      : 'ДАЛЬНЯЯ ДИСТАНЦИЯ';

  return (
    <header className="w-full max-w-6xl mx-auto px-4 pt-3 pb-2 select-none">
      {/* Верхний ряд: Две большие полоски здоровья */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 items-center">
        
        {/* ЛЕВАЯ ПОЛОСА: MORVAN */}
        <div className="bg-stone-900/80 border border-stone-800 p-3 shadow-xl backdrop-blur-sm">
          <div className="flex items-baseline justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg md:text-xl font-bold tracking-wider text-amber-100">
                MORVAN
              </span>
              {morvan.isBlocking && (
                <span className="text-[11px] font-semibold text-amber-300 border border-amber-500/40 px-1.5 py-0.2 bg-amber-950/40">
                  БЛОК
                </span>
              )}
              {morvan.isDodging && (
                <span className="text-[11px] font-semibold text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 bg-emerald-950/40">
                  УКЛОНЕНИЕ
                </span>
              )}
            </div>
            <span className="font-mono text-sm md:text-base font-bold tabular-nums text-stone-300">
              {morvan.hp} / {morvan.maxHp}
            </span>
          </div>

          {/* Контейнер полосы здоровья Morvan */}
          <div className="relative h-6 w-full bg-stone-950 border border-stone-700/80 overflow-hidden">
            {/* Красный след урона (Ghost bar) */}
            <div
              className="absolute top-0 bottom-0 left-0 bg-red-800/80 transition-all duration-700 ease-out"
              style={{ width: `${morvanGhostPct}%` }}
            />
            {/* Основная плавная полоса здоровья (Зелено-янтарная) */}
            <div
              className={`absolute top-0 bottom-0 left-0 transition-all duration-300 ease-out ${
                morvanPct > 45 ? 'bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-500' :
                morvanPct > 20 ? 'bg-gradient-to-r from-amber-600 to-amber-500' :
                'bg-gradient-to-r from-red-600 to-rose-500'
              }`}
              style={{ width: `${morvanPct}%` }}
            />
            {/* Текстура делений шкалы */}
            <div className="absolute inset-0 grid grid-cols-10 pointer-events-none opacity-30">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="border-r border-black" />
              ))}
            </div>
          </div>

          {/* Индикатор заряда ультимейта Morvan */}
          <div className="flex items-center justify-between text-xs mt-1.5 text-stone-400">
            <span className="text-[11px] text-stone-400">Ярость берсерка:</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-stone-950 border border-stone-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${morvan.ultimateCharge}%` }}
                />
              </div>
              <span className="font-mono text-[11px] tabular-nums text-amber-300">
                {morvan.ultimateCharge}%
              </span>
            </div>
          </div>
        </div>

        {/* ПРАВАЯ ПОЛОСА: ELYRA */}
        <div className="bg-stone-900/80 border border-stone-800 p-3 shadow-xl backdrop-blur-sm">
          <div className="flex items-baseline justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg md:text-xl font-bold tracking-wider text-purple-200">
                ELYRA
              </span>
              {elyra.isBlocking && (
                <span className="text-[11px] font-semibold text-purple-300 border border-purple-500/40 px-1.5 py-0.2 bg-purple-950/40">
                  БАРЬЕР
                </span>
              )}
              {elyra.isDodging && (
                <span className="text-[11px] font-semibold text-cyan-300 border border-cyan-500/40 px-1.5 py-0.2 bg-cyan-950/40">
                  ТЕНЬ
                </span>
              )}
            </div>
            <span className="font-mono text-sm md:text-base font-bold tabular-nums text-stone-300">
              {elyra.hp} / {elyra.maxHp}
            </span>
          </div>

          {/* Контейнер полосы здоровья Elyra */}
          <div className="relative h-6 w-full bg-stone-950 border border-stone-700/80 overflow-hidden">
            {/* Красный след урона (Ghost bar) */}
            <div
              className="absolute top-0 bottom-0 left-0 bg-red-800/80 transition-all duration-700 ease-out"
              style={{ width: `${elyraGhostPct}%` }}
            />
            {/* Основная плавная полоса здоровья (Фиолетово-пурпурная) */}
            <div
              className={`absolute top-0 bottom-0 left-0 transition-all duration-300 ease-out ${
                elyraPct > 45 ? 'bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-500' :
                elyraPct > 20 ? 'bg-gradient-to-r from-amber-600 to-purple-500' :
                'bg-gradient-to-r from-red-600 to-rose-500'
              }`}
              style={{ width: `${elyraPct}%` }}
            />
            {/* Текстура делений шкалы */}
            <div className="absolute inset-0 grid grid-cols-10 pointer-events-none opacity-30">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="border-r border-black" />
              ))}
            </div>
          </div>

          {/* Индикатор маны ультимейта Elyra */}
          <div className="flex items-center justify-between text-xs mt-1.5 text-stone-400">
            <span className="text-[11px] text-stone-400">Астральная энергия:</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-stone-950 border border-stone-800 overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-300"
                  style={{ width: `${elyra.ultimateCharge}%` }}
                />
              </div>
              <span className="font-mono text-[11px] tabular-nums text-purple-300">
                {elyra.ultimateCharge}%
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Центральный статус: Текущая дистанция и чей сейчас ход */}
      <div className="flex items-center justify-between mt-2 px-2 text-xs border-t border-stone-800/60 pt-1.5 text-stone-400">
        <div className="flex items-center gap-2">
          <span className="text-stone-500">Дистанция арены:</span>
          <span className="font-cinzel font-semibold tracking-wider text-amber-200">
            {distanceLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-500">Инициатива:</span>
          {phase === 'PLAYER_TURN' && (
            <span className="font-cinzel font-bold text-amber-400 animate-pulse">
              ВАШ ХОД (MORVAN)
            </span>
          )}
          {phase === 'BOT_THINKING' && (
            <span className="font-cinzel font-bold text-purple-400 animate-pulse">
              ХОД ELYRA...
            </span>
          )}
          {phase === 'ACTION_EXEC' && (
            <span className="font-cinzel font-bold text-stone-300">
              ВЫПОЛНЕНИЕ ДЕЙСТВИЯ...
            </span>
          )}
          {phase === 'PAUSED' && (
            <span className="font-cinzel font-bold text-yellow-400">
              ПАУЗА
            </span>
          )}
          {(phase === 'VICTORY' || phase === 'DEFEAT') && (
            <span className="font-cinzel font-bold text-stone-200">
              БОЙ ОКОНЧЕН
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
