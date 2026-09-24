/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ActionDef, ActionType, Distance, GamePhase } from '../types/game';
import { Swords, Shield, Footprints, Flame, Sparkles, Wind } from 'lucide-react';

interface ControlsProps {
  actions: ActionDef[];
  currentDistance: Distance;
  phase: GamePhase;
  ultimateCharge: number;
  onSelectAction: (actionId: ActionType) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  actions,
  currentDistance,
  phase,
  ultimateCharge,
  onSelectAction,
}) => {
  const isPlayerTurn = phase === 'PLAYER_TURN';

  const getActionIcon = (action: ActionDef) => {
    switch (action.id) {
      case 'light_attack':
        return <Swords className="w-4 h-4 text-amber-400" />;
      case 'heavy_attack':
        return <Flame className="w-4 h-4 text-rose-500" />;
      case 'approach':
        return <Footprints className="w-4 h-4 text-emerald-400" />;
      case 'retreat':
        return <Wind className="w-4 h-4 text-cyan-400" />;
      case 'block':
        return <Shield className="w-4 h-4 text-amber-300" />;
      case 'dodge':
        return <Wind className="w-4 h-4 text-blue-400" />;
      case 'ultimate':
        return <Sparkles className="w-4 h-4 text-yellow-300" />;
      default:
        return <Swords className="w-4 h-4 text-stone-400" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-3 select-none">
      {/* Заголовок панели управления */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-xs md:text-sm font-bold tracking-wider text-stone-300">
            ПРИКАЗЫ ДЛЯ MORVAN
          </span>
          <span className="text-xs text-stone-500 hidden sm:inline">
            (Выберите действие мышью или клавишами 1-6 / R)
          </span>
        </div>
        {!isPlayerTurn && (
          <span className="text-xs font-mono text-purple-400">
            Ожидание хода противника...
          </span>
        )}
      </div>

      {/* Сетка кнопок действий */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
        {actions.map((action) => {
          // Проверяем валидность дистанции для данного действия
          const isDistanceValid =
            !action.requiredDistance || action.requiredDistance.includes(currentDistance);
          const isCooldownActive = action.currentCooldown > 0;
          const isUltimateNotReady = action.isUltimate && ultimateCharge < 100;
          const isDisabled =
            !isPlayerTurn || !isDistanceValid || isCooldownActive || isUltimateNotReady;

          return (
            <button
              key={action.id}
              disabled={isDisabled}
              onClick={() => onSelectAction(action.id)}
              className={`relative flex flex-col justify-between p-2.5 text-left border transition-all duration-150 rounded-sm cursor-pointer ${
                isDisabled
                  ? 'bg-stone-950/60 border-stone-850 opacity-40 cursor-not-allowed text-stone-500'
                  : action.isUltimate
                  ? 'bg-amber-950/50 border-amber-500 hover:bg-amber-900/60 hover:border-amber-400 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-stone-900/90 border-stone-700/80 hover:bg-stone-800 hover:border-stone-500 text-stone-200 shadow-md'
              }`}
            >
              {/* Верхняя строка кнопки: Иконка + Горячая клавиша */}
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-1.5">
                  {getActionIcon(action)}
                  <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-stone-950 border border-stone-700 text-stone-300">
                    {action.keyboardKey.toUpperCase()}
                  </span>
                </div>
                {isCooldownActive && (
                  <span className="font-mono text-[10px] text-rose-400 font-bold">
                    КД: {action.currentCooldown}
                  </span>
                )}
              </div>

              {/* Название действия */}
              <div className="font-cinzel text-xs font-bold tracking-wide truncate w-full">
                {action.name}
              </div>

              {/* Урон или описание */}
              <div className="text-[11px] text-stone-400 mt-1 truncate w-full">
                {action.minDamage > 0 ? (
                  <span className="text-amber-300 font-mono font-medium">
                    Урон: {action.minDamage}-{action.maxDamage}
                  </span>
                ) : action.isDefense ? (
                  <span className="text-cyan-300 font-medium">Защита</span>
                ) : action.isMovement ? (
                  <span className="text-emerald-300 font-medium">Перемещение</span>
                ) : (
                  <span>Спецприем</span>
                )}
              </div>

              {/* Предупреждение о неподходящей дистанции */}
              {!isDistanceValid && (
                <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-[1px] flex items-center justify-center p-1 text-center">
                  <span className="text-[10px] font-medium text-amber-400/90 leading-tight">
                    Недоступно на этой дистанции
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
