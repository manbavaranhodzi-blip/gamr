/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GamePhase } from '../types/game';
import { Volume2, VolumeX, Play, RotateCcw, Home, Swords, Shield, Zap } from 'lucide-react';

interface ModalsProps {
  phase: GamePhase;
  isMuted: boolean;
  onToggleMute: () => void;
  onResume: () => void;
  onRestart: () => void;
  onGoToMainMenu: () => void;
  onStartGame: () => void;
}

export const Modals: React.FC<ModalsProps> = ({
  phase,
  isMuted,
  onToggleMute,
  onResume,
  onRestart,
  onGoToMainMenu,
  onStartGame,
}) => {
  // 1. ГЛАВНОЕ МЕНЮ (TITLE_MENU)
  if (phase === 'TITLE_MENU') {
    return (
      <div className="fixed inset-0 z-50 bg-stone-950/95 flex items-center justify-center p-4 overflow-y-auto">
        <div className="max-w-3xl w-full bg-stone-900 border border-stone-800 p-6 md:p-10 shadow-2xl text-center relative">
          {/* Кнопка звука в углу */}
          <button
            onClick={onToggleMute}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 border border-stone-700 transition-colors"
            title={isMuted ? 'Включить звук' : 'Выключить звук'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          {/* Заголовок */}
          <div className="mb-2 text-xs md:text-sm tracking-widest text-amber-500 font-cinzel font-semibold">
            ТАКТИЧЕСКАЯ ГОТИЧЕСКАЯ ДУЭЛЬ
          </div>
          <h1 className="font-cinzel text-3xl md:text-5xl font-black text-stone-100 tracking-wider mb-4">
            MORVAN <span className="text-stone-600 font-light text-2xl md:text-4xl">ПРОТИВ</span> ELYRA
          </h1>

          <p className="text-stone-400 text-sm md:text-base max-w-xl mx-auto mb-8">
            Сразитесь на древней готической каменной арене. Управляйте берсерком Морваном против колдуньи Элиры, оценивающей расстояние и выбирающей заклинания.
          </p>

          {/* Превью двух персонажей */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8 max-w-2xl mx-auto">
            {/* MORVAN */}
            <div className="bg-stone-950/80 border border-stone-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Swords className="w-5 h-5 text-amber-500" />
                <span className="font-cinzel font-bold text-amber-200">MORVAN (ИГРОК)</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Смертоносный воин ближнего боя с боевым топором. Сильные сокрушительные разрубы в упор, рывок для сближения и ярость берсерка.
              </p>
            </div>

            {/* ELYRA */}
            <div className="bg-stone-950/80 border border-stone-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <span className="font-cinzel font-bold text-purple-200">ELYRA (БОТ AI)</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Колдунья Бездны с сияющим посохом. Запускает дальнобойные снаряды, ставит астральный щит и телепортируется сквозь тени.
              </p>
            </div>
          </div>

          {/* Главная кнопка запуска */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartGame}
              className="w-full sm:w-auto px-8 py-3.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-cinzel font-black tracking-widest text-base shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              НАЧАТЬ БОЙ
            </button>
          </div>

          {/* Памятка по клавишам */}
          <div className="mt-8 pt-4 border-t border-stone-800/80 text-xs text-stone-500 flex flex-wrap items-center justify-center gap-4">
            <span>Клавиши: <b>1-6</b> действия</span>
            <span>·</span>
            <span><b>R</b> ультимейт</span>
            <span>·</span>
            <span><b>ESC</b> меню паузы</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. МЕНЮ ПАУЗЫ (ESC)
  // В точности по требованиям:
  // "При нажатии ESC открыть меню:
  // ПАУЗА
  // • ПРОДОЛЖИТЬ
  // • НАЧАТЬ ЗАНОВО
  // • В ГЛАВНОЕ МЕНЮ"
  if (phase === 'PAUSED') {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-900 border-2 border-stone-700 p-8 text-center shadow-2xl">
          <h2 className="font-cinzel text-3xl font-black text-amber-200 tracking-wider mb-6">
            ПАУЗА
          </h2>

          <div className="flex flex-col gap-3">
            {/* ПРОДОЛЖИТЬ */}
            <button
              onClick={onResume}
              className="w-full py-3 bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-100 font-cinzel font-bold text-sm tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              ПРОДОЛЖИТЬ
            </button>

            {/* НАЧАТЬ ЗАНОВО */}
            <button
              onClick={onRestart}
              className="w-full py-3 bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-100 font-cinzel font-bold text-sm tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              НАЧАТЬ ЗАНОВО
            </button>

            {/* В ГЛАВНОЕ МЕНЮ */}
            <button
              onClick={onGoToMainMenu}
              className="w-full py-3 bg-stone-950 hover:bg-stone-800 border border-stone-700 text-stone-300 font-cinzel font-bold text-sm tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              В ГЛАВНОЕ МЕНЮ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. ОКНО ПОБЕДЫ
  // В точности по требованиям:
  // "Если HP ELYRA становится 0:
  // показать:
  // “ПОБЕДА”
  // “MORVAN ПОБЕДИЛ”
  // Кнопки:
  // • ИГРАТЬ СНОВА
  // • В ГЛАВНОЕ МЕНЮ"
  if (phase === 'VICTORY') {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-900 border-2 border-amber-500/80 p-8 text-center shadow-[0_0_50px_rgba(245,158,11,0.3)]">
          <div className="inline-block p-3 bg-amber-500/10 border border-amber-500/40 rounded-full mb-3">
            <Swords className="w-8 h-8 text-amber-400" />
          </div>

          <h2 className="font-cinzel text-4xl font-black text-amber-400 tracking-widest mb-2">
            ПОБЕДА
          </h2>
          <div className="font-cinzel text-xl font-bold text-stone-200 tracking-wider mb-8">
            MORVAN ПОБЕДИЛ
          </div>

          <div className="flex flex-col gap-3">
            {/* ИГРАТЬ СНОВА */}
            <button
              onClick={onRestart}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-cinzel font-black text-sm tracking-wider shadow-lg transition-colors cursor-pointer"
            >
              ИГРАТЬ СНОВА
            </button>

            {/* В ГЛАВНОЕ МЕНЮ */}
            <button
              onClick={onGoToMainMenu}
              className="w-full py-3 bg-stone-950 hover:bg-stone-800 border border-stone-700 text-stone-300 font-cinzel font-bold text-sm tracking-wider transition-colors cursor-pointer"
            >
              В ГЛАВНОЕ МЕНЮ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. ОКНО ПОРАЖЕНИЯ
  // В точности по требованиям:
  // "Если HP MORVAN становится 0:
  // “ПОРАЖЕНИЕ”
  // “ELYRA ПОБЕДИЛА”
  // Кнопки:
  // • ИГРАТЬ СНОВА
  // • В ГЛАВНОЕ МЕНЮ"
  if (phase === 'DEFEAT') {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-900 border-2 border-rose-700/80 p-8 text-center shadow-[0_0_50px_rgba(225,29,72,0.3)]">
          <div className="inline-block p-3 bg-rose-500/10 border border-rose-500/40 rounded-full mb-3">
            <Shield className="w-8 h-8 text-rose-500" />
          </div>

          <h2 className="font-cinzel text-4xl font-black text-rose-500 tracking-widest mb-2">
            ПОРАЖЕНИЕ
          </h2>
          <div className="font-cinzel text-xl font-bold text-stone-200 tracking-wider mb-8">
            ELYRA ПОБЕДИЛА
          </div>

          <div className="flex flex-col gap-3">
            {/* ИГРАТЬ СНОВА */}
            <button
              onClick={onRestart}
              className="w-full py-3.5 bg-rose-700 hover:bg-rose-600 text-white font-cinzel font-black text-sm tracking-wider shadow-lg transition-colors cursor-pointer"
            >
              ИГРАТЬ СНОВА
            </button>

            {/* В ГЛАВНОЕ МЕНЮ */}
            <button
              onClick={onGoToMainMenu}
              className="w-full py-3 bg-stone-950 hover:bg-stone-800 border border-stone-700 text-stone-300 font-cinzel font-bold text-sm tracking-wider transition-colors cursor-pointer"
            >
              В ГЛАВНОЕ МЕНЮ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
