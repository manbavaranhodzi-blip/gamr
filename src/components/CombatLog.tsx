/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { CombatLogEntry } from '../types/game';

interface CombatLogProps {
  logs: CombatLogEntry[];
  lastBotThought?: string;
}

export const CombatLog: React.FC<CombatLogProps> = ({ logs, lastBotThought }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-4 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* ХРОНИКА БОЯ (2 колонки на десктопе) */}
        <div className="lg:col-span-2 bg-stone-900/80 border border-stone-800 p-3 flex flex-col">
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-stone-800 text-xs">
            <span className="font-cinzel font-bold text-stone-300">
              ХРОНИКА СРАЖЕНИЯ
            </span>
            <span className="text-stone-500 font-mono text-[11px]">
              Записей: {logs.length}
            </span>
          </div>

          <div
            ref={scrollRef}
            className="h-28 overflow-y-auto space-y-1.5 pr-2 font-mono text-xs scrollbar-thin scrollbar-thumb-stone-700"
          >
            {logs.length === 0 ? (
              <div className="text-stone-500 italic py-2">
                Бой начинается. Выберите первое действие Морвана...
              </div>
            ) : (
              logs.map((entry) => {
                const isMorvan = entry.sender === 'morvan';
                const isElyra = entry.sender === 'elyra';

                return (
                  <div key={entry.id} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-stone-600 text-[10px] tabular-nums mt-0.5">
                      [ХОД {entry.turn}]
                    </span>
                    <div className="flex-1">
                      {isMorvan && (
                        <span className="font-cinzel font-bold text-amber-400 mr-1.5">
                          MORVAN:
                        </span>
                      )}
                      {isElyra && (
                        <span className="font-cinzel font-bold text-purple-400 mr-1.5">
                          ELYRA:
                        </span>
                      )}
                      <span
                        className={
                          entry.type === 'ultimate'
                            ? 'text-yellow-300 font-semibold'
                            : entry.type === 'defense'
                            ? 'text-cyan-300'
                            : entry.type === 'heavy'
                            ? 'text-rose-400 font-semibold'
                            : entry.type === 'system'
                            ? 'text-stone-400 italic'
                            : 'text-stone-200'
                        }
                      >
                        {entry.text}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ТАКТИЧЕСКИЙ АНАЛИЗ ИИ ЭЛИРЫ (1 колонка) */}
        <div className="bg-stone-900/80 border border-stone-800 p-3 flex flex-col justify-between">
          <div>
            <div className="font-cinzel font-bold text-xs text-purple-300 mb-1.5 pb-1 border-b border-stone-800 flex items-center justify-between">
              <span>АНАЛИЗ БОТА (AI ELYRA)</span>
              <span className="text-[10px] text-purple-400/80 font-normal">Учебный ИИ</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed italic bg-purple-950/20 p-2 border border-purple-900/30">
              {lastBotThought || 'Элира внимательно изучает стойку воина и оценивает расстояние.'}
            </p>
          </div>

          <div className="text-[11px] text-stone-500 mt-2 pt-2 border-t border-stone-800/80">
            ИИ учитывает дистанцию, наличие сильных атак, защиту и уровень здоровья оппонента.
          </div>
        </div>
      </div>
    </div>
  );
};
