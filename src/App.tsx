/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ActionDef,
  ActionType,
  CharacterState,
  CombatLogEntry,
  Distance,
  GamePhase,
  VisualEffect,
} from './types/game';
import {
  INITIAL_MORVAN,
  INITIAL_ELYRA,
  MORVAN_ACTIONS,
  ELYRA_ACTIONS,
} from './characters/characterData';
import { decideBotAction } from './ai/botAI';
import { soundManager } from './audio/soundManager';
import { HPBar } from './components/HPBar';
import { Arena } from './components/Arena';
import { Controls } from './components/Controls';
import { CombatLog } from './components/CombatLog';
import { Modals } from './components/Modals';
import { Pause, Volume2, VolumeX } from 'lucide-react';

export default function App() {
  // 1. ОСНОВНЫЕ СОСТОЯНИЯ ИГРЫ
  const [phase, setPhase] = useState<GamePhase>('TITLE_MENU');
  const [previousPhase, setPreviousPhase] = useState<GamePhase>('PLAYER_TURN');
  const [distance, setDistance] = useState<Distance>('far'); // По условию: противоположные стороны арены в начале боя
  const [turnNumber, setTurnNumber] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Состояния бойцов
  const [morvan, setMorvan] = useState<CharacterState>(INITIAL_MORVAN);
  const [elyra, setElyra] = useState<CharacterState>(INITIAL_ELYRA);

  // Списки доступных действий и их перезарядки
  const [morvanActions, setMorvanActions] = useState<ActionDef[]>(MORVAN_ACTIONS);
  const [elyraActions, setElyraActions] = useState<ActionDef[]>(ELYRA_ACTIONS);

  // Визуальные эффекты и анимации
  const [activeEffects, setActiveEffects] = useState<VisualEffect[]>([]);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [attackerId, setAttackerId] = useState<'morvan' | 'elyra' | null>(null);
  const [targetId, setTargetId] = useState<'morvan' | 'elyra' | null>(null);

  // Боевой лог и тактический анализ бота
  const [combatLogs, setCombatLogs] = useState<CombatLogEntry[]>([]);
  const [lastBotThought, setLastBotThought] = useState<string>(
    'Элира внимательно оценивает стойку противника...'
  );
  const [botActionHistory, setBotActionHistory] = useState<ActionType[]>([]);

  // Вспомогательный метод для добавления записей в боевой журнал
  const addLog = useCallback(
    (
      sender: 'morvan' | 'elyra' | 'system',
      text: string,
      type: 'attack' | 'heavy' | 'magic' | 'defense' | 'ultimate' | 'system' | 'info'
    ) => {
      const entry: CombatLogEntry = {
        id: Math.random().toString(36).substring(2, 9),
        turn: turnNumber,
        sender,
        text,
        type,
      };
      setCombatLogs((prev) => [...prev, entry]);
    },
    [turnNumber]
  );

  // Метод создания временного визуального эффекта (автоочистка через durationMs)
  const triggerVisualEffect = useCallback(
    (
      type: VisualEffect['type'],
      text?: string,
      color?: string,
      durationMs: number = 800
    ) => {
      const effectId = Math.random().toString(36).substring(2, 9);
      const newEffect: VisualEffect = { id: effectId, type, text, color };
      setActiveEffects((prev) => [...prev, newEffect]);

      setTimeout(() => {
        setActiveEffects((prev) => prev.filter((e) => e.id !== effectId));
      }, durationMs);
    },
    []
  );

  // Переключение звука
  const handleToggleMute = useCallback(() => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  }, []);

  // Старт новой партии
  const handleStartGame = useCallback(() => {
    setMorvan({ ...INITIAL_MORVAN });
    setElyra({ ...INITIAL_ELYRA });
    setDistance('far');
    setTurnNumber(1);
    setMorvanActions(MORVAN_ACTIONS.map((a) => ({ ...a, currentCooldown: 0 })));
    setElyraActions(ELYRA_ACTIONS.map((a) => ({ ...a, currentCooldown: 0 })));
    setActiveEffects([]);
    setIsScreenShaking(false);
    setAttackerId(null);
    setTargetId(null);
    setCombatLogs([]);
    setBotActionHistory([]);
    setLastBotThought('Бой начинается! Элира держит дистанцию на противоположной стороне арены.');
    setPhase('PLAYER_TURN');

    soundManager.startAmbientMusic();
    addLog('system', 'Битва на древней арене началась! Персонажи на противоположных сторонах.', 'system');
  }, [addLog]);

  // Пауза (по нажатию ESC или кнопки)
  const handleTogglePause = useCallback(() => {
    setPhase((current) => {
      if (current === 'PAUSED') {
        return previousPhase;
      } else if (current === 'PLAYER_TURN' || current === 'BOT_THINKING' || current === 'ACTION_EXEC') {
        setPreviousPhase(current);
        return 'PAUSED';
      }
      return current;
    });
  }, [previousPhase]);

  // Возврат в главное меню
  const handleGoToMainMenu = useCallback(() => {
    soundManager.stopAmbientMusic();
    setPhase('TITLE_MENU');
  }, []);

  // -------------------------------------------------------------
  // ЛОГИКА ХОДА ИГРОКА (MORVAN)
  // -------------------------------------------------------------
  const executePlayerAction = useCallback(
    (actionId: ActionType) => {
      if (phase !== 'PLAYER_TURN') return;

      const actionDef = morvanActions.find((a) => a.id === actionId);
      if (!actionDef) return;

      setPhase('ACTION_EXEC');
      setAttackerId('morvan');

      // 1. ДЕЙСТВИЕ: СБЛИЖЕНИЕ
      if (actionId === 'approach') {
        soundManager.playDodge();
        setDistance((prev) => (prev === 'far' ? 'mid' : 'close'));
        addLog('morvan', 'совершает яростный рывок вперед, сокращая дистанцию!', 'info');
        triggerVisualEffect('particles', undefined, undefined, 500);

        finishPlayerTurn(0, false);
        return;
      }

      // 2. ДЕЙСТВИЕ: ОТСКОК НАЗАД
      if (actionId === 'retreat') {
        soundManager.playDodge();
        setDistance((prev) => (prev === 'close' ? 'mid' : 'far'));
        addLog('morvan', 'разрывает дистанцию и отступает на безопасное расстояние.', 'info');
        triggerVisualEffect('particles', undefined, undefined, 500);

        finishPlayerTurn(0, false);
        return;
      }

      // 3. ДЕЙСТВИЕ: БЛОК
      if (actionId === 'block') {
        soundManager.playBlock();
        setMorvan((prev) => ({ ...prev, isBlocking: true, isDodging: false }));
        addLog('morvan', 'встает в глухую защитную стойку, закрывшись топором.', 'defense');
        triggerVisualEffect('block_effect', 'БЛОК', 'text-amber-400', 800);

        finishPlayerTurn(0, false);
        return;
      }

      // 4. ДЕЙСТВИЕ: УКЛОНЕНИЕ
      if (actionId === 'dodge') {
        soundManager.playDodge();
        setMorvan((prev) => ({ ...prev, isDodging: true, isBlocking: false }));
        addLog('morvan', 'готовится к боковому перекату от следующей атаки!', 'defense');
        triggerVisualEffect('dodge_effect', 'УКЛОНЕНИЕ', 'text-cyan-400', 800);

        finishPlayerTurn(0, false);
        return;
      }

      // 5. АТАКА (УДАР ТОПОРОМ, ТЯЖЕЛЫЙ УДАР, УЛЬТИМЕЙТ)
      setTargetId('elyra');

      // Базовый расчет урона
      const rawDamage =
        Math.floor(
          actionDef.minDamage + Math.random() * (actionDef.maxDamage - actionDef.minDamage + 1)
        );

      let finalDamage = rawDamage;
      let logMessage = '';

      // Визуальные эффекты взмаха топора
      triggerVisualEffect('axe_slash', undefined, undefined, 450);

      // Проверка уклонения Элиры
      if (elyra.isDodging) {
        soundManager.playDodge();
        finalDamage = 0;
        logMessage = `атакует (${actionDef.name}), но Элира растворяется в воздухе и уклоняется!`;
        triggerVisualEffect('damage_number', 'УКЛОНЕНИЕ!', 'text-cyan-400', 900);
      }
      // Проверка блокирования Элиры
      else if (elyra.isBlocking) {
        soundManager.playBlock();
        finalDamage = Math.max(2, Math.floor(rawDamage * 0.25)); // 75% поглощения
        logMessage = `наносит (${actionDef.name}), но астральный щит Элиры поглощает часть урона (-${finalDamage} HP)!`;
        triggerVisualEffect('damage_number', `-${finalDamage} [БЛОК]`, 'text-purple-300', 900);
        triggerVisualEffect('hit_flash', undefined, undefined, 300);
        triggerVisualEffect('particles', undefined, undefined, 400);
      }
      // Прямое попадание
      else {
        if (actionId === 'heavy_attack' || actionId === 'ultimate') {
          soundManager.playHeavyHit();
          setIsScreenShaking(true);
          setTimeout(() => setIsScreenShaking(false), 400);
        } else {
          soundManager.playHit();
        }

        logMessage = `наносит сокрушительный удар (${actionDef.name}) на ${finalDamage} урона!`;
        triggerVisualEffect('damage_number', `-${finalDamage}`, 'text-red-500', 900);
        triggerVisualEffect('hit_flash', undefined, undefined, 300);
        triggerVisualEffect('particles', undefined, undefined, 500);
      }

      // Применяем урон к Элире
      const newElyraHp = Math.max(0, elyra.hp - finalDamage);
      setElyra((prev) => ({
        ...prev,
        hp: newElyraHp,
        isBlocking: false,
        isDodging: false,
      }));

      // Заряд ярости ультимейта Морвана
      setMorvan((prev) => ({
        ...prev,
        ultimateCharge: actionId === 'ultimate' ? 0 : Math.min(100, prev.ultimateCharge + 25),
      }));

      addLog(
        'morvan',
        logMessage,
        actionId === 'ultimate' ? 'ultimate' : actionId === 'heavy_attack' ? 'heavy' : 'attack'
      );

      // Проверка условий победы
      if (newElyraHp <= 0) {
        setElyra((prev) => ({ ...prev, status: 'defeated' }));
        soundManager.playVictory();
        setTimeout(() => {
          setPhase('VICTORY');
          addLog('system', 'HP ELYRA достигло 0! MORVAN ОДЕРЖАЛ ПОБЕДУ!', 'ultimate');
        }, 800);
        return;
      }

      finishPlayerTurn(actionDef.cooldownTurns, true, actionId);
    },
    [
      phase,
      morvanActions,
      elyra,
      addLog,
      triggerVisualEffect,
    ]
  );

  // Завершение хода игрока и передача хода боту
  const finishPlayerTurn = (
    cooldownToSet: number,
    wasAttack: boolean,
    usedActionId?: ActionType
  ) => {
    // Обновляем перезарядки способностей Морвана
    setMorvanActions((prev) =>
      prev.map((act) => {
        if (act.id === usedActionId) {
          return { ...act, currentCooldown: cooldownToSet };
        }
        return { ...act, currentCooldown: Math.max(0, act.currentCooldown - 1) };
      })
    );

    // Снимаем атакующие маркеры через короткую задержку анимации
    setTimeout(() => {
      setAttackerId(null);
      setTargetId(null);
      setPhase('BOT_THINKING');
    }, 600);
  };

  // -------------------------------------------------------------
  // ЛОГИКА ХОДА БОТА (ELYRA AI)
  // -------------------------------------------------------------
  useEffect(() => {
    if (phase !== 'BOT_THINKING') return;

    // Искусственная пауза "размышления" бота для естественности боя (800мс)
    const timer = setTimeout(() => {
      // ИИ принимает решение согласно правилам задания
      const decision = decideBotAction(
        elyra,
        morvan,
        distance,
        elyraActions,
        botActionHistory
      );

      setLastBotThought(decision.thought);
      setBotActionHistory((prev) => [...prev, decision.chosenAction]);

      executeBotAction(decision.chosenAction, decision.thought, decision.isMistake);
    }, 850);

    return () => clearTimeout(timer);
  }, [phase, elyra, morvan, distance, elyraActions, botActionHistory]);

  const executeBotAction = (
    actionId: ActionType,
    thought: string,
    isMistake: boolean
  ) => {
    setPhase('ACTION_EXEC');
    setAttackerId('elyra');

    const actionDef = elyraActions.find((a) => a.id === actionId) || elyraActions[0];

    // 1. ДЕЙСТВИЕ БОТА: СБЛИЖЕНИЕ
    if (actionId === 'approach') {
      soundManager.playDodge();
      setDistance((prev) => (prev === 'far' ? 'mid' : 'close'));
      addLog('elyra', 'шагает сквозь туман арены, сближаясь с Морваном.', 'info');
      triggerVisualEffect('particles', undefined, undefined, 500);

      finishBotTurn(0, actionId);
      return;
    }

    // 2. ДЕЙСТВИЕ БОТА: ОТСТУПЛЕНИЕ
    if (actionId === 'retreat') {
      soundManager.playDodge();
      setDistance((prev) => (prev === 'close' ? 'mid' : 'far'));
      addLog('elyra', 'совершает мерцающий отскок назад в безопасную зону.', 'info');
      triggerVisualEffect('particles', undefined, undefined, 500);

      finishBotTurn(0, actionId);
      return;
    }

    // 3. ДЕЙСТВИЕ БОТА: БЛОК (Астральный щит)
    if (actionId === 'block') {
      soundManager.playBlock();
      setElyra((prev) => ({ ...prev, isBlocking: true, isDodging: false }));
      addLog('elyra', 'призывает круговой фиолетовый Астральный щит!', 'defense');
      triggerVisualEffect('block_effect', 'БАРЬЕР', 'text-purple-400', 800);

      finishBotTurn(1, actionId);
      return;
    }

    // 4. ДЕЙСТВИЕ БОТА: УКЛОНЕНИЕ (Теневой фазовый сдвиг)
    if (actionId === 'dodge') {
      soundManager.playDodge();
      setElyra((prev) => ({ ...prev, isDodging: true, isBlocking: false }));
      addLog('elyra', 'переходит в теневую фазу, готовясь избежать удара!', 'defense');
      triggerVisualEffect('dodge_effect', 'ТЕНЬ', 'text-cyan-400', 800);

      finishBotTurn(2, actionId);
      return;
    }

    // 5. ДЕЙСТВИЕ БОТА: АТАКА (МАГИЧЕСКИЙ СНАРЯД, СИЛЬНАЯ МАГИЯ, ПОСОХ, УЛЬТИМЕЙТ)
    setTargetId('morvan');

    // Если бот совершил намеренную учебную ошибку (например, удар посохом издалека)
    if (isMistake && distance === 'far') {
      soundManager.playDodge();
      addLog('elyra', 'ошибается с дистанцией — заклинание рассеивается в воздухе без урона!', 'info');
      triggerVisualEffect('damage_number', 'ПРОМАХ!', 'text-stone-400', 900);
      finishBotTurn(0, actionId);
      return;
    }

    // Визуальные эффекты магии
    if (actionId === 'magic_projectile') {
      soundManager.playMagicProjectile();
      triggerVisualEffect('magic_projectile', undefined, undefined, 650);
    } else if (actionId === 'heavy_attack' || actionId === 'ultimate') {
      soundManager.playHeavyHit();
      setIsScreenShaking(true);
      setTimeout(() => setIsScreenShaking(false), 450);
      triggerVisualEffect('hit_flash', undefined, undefined, 350);
    } else {
      soundManager.playHit();
    }

    const rawDamage =
      Math.floor(
        actionDef.minDamage + Math.random() * (actionDef.maxDamage - actionDef.minDamage + 1)
      );

    let finalDamage = rawDamage;
    let logMessage = '';

    // Проверка уклонения игрока (Morvan)
    if (morvan.isDodging) {
      soundManager.playDodge();
      finalDamage = 0;
      logMessage = `атакует (${actionDef.name}), но Морван совершает перекат и полностью уклоняется!`;
      triggerVisualEffect('damage_number', 'УКЛОНЕНИЕ!', 'text-cyan-400', 900);
    }
    // Проверка блока игрока (Morvan)
    else if (morvan.isBlocking) {
      soundManager.playBlock();
      finalDamage = Math.max(2, Math.floor(rawDamage * 0.25));
      logMessage = `обрушивает (${actionDef.name}), но Морван принимает удар на топор (-${finalDamage} HP)!`;
      triggerVisualEffect('damage_number', `-${finalDamage} [БЛОК]`, 'text-amber-300', 900);
      triggerVisualEffect('hurt_flash', undefined, undefined, 300);
      triggerVisualEffect('particles', undefined, undefined, 400);
    }
    // Прямое попадание магии
    else {
      soundManager.playHurt();
      logMessage = `разит заклинанием (${actionDef.name}) на ${finalDamage} урона!`;
      triggerVisualEffect('damage_number', `-${finalDamage}`, 'text-red-500', 900);
      triggerVisualEffect('hurt_flash', undefined, undefined, 300);
      triggerVisualEffect('particles', undefined, undefined, 500);
    }

    // Применяем урон к Морвану
    const newMorvanHp = Math.max(0, morvan.hp - finalDamage);
    setMorvan((prev) => ({
      ...prev,
      hp: newMorvanHp,
      isBlocking: false,
      isDodging: false,
    }));

    // Заряд энергии ультимейта Элиры
    setElyra((prev) => ({
      ...prev,
      ultimateCharge: actionId === 'ultimate' ? 0 : Math.min(100, prev.ultimateCharge + 25),
    }));

    addLog(
      'elyra',
      logMessage,
      actionId === 'ultimate' ? 'ultimate' : actionId === 'heavy_attack' ? 'heavy' : 'magic'
    );

    // Проверка поражения Морвана
    if (newMorvanHp <= 0) {
      setMorvan((prev) => ({ ...prev, status: 'defeated' }));
      soundManager.playDefeat();
      setTimeout(() => {
        setPhase('DEFEAT');
        addLog('system', 'HP MORVAN достигло 0! ELYRA ОДЕРЖАЛА ПОБЕДУ!', 'ultimate');
      }, 800);
      return;
    }

    finishBotTurn(actionDef.cooldownTurns, actionId);
  };

  const finishBotTurn = (cooldownToSet: number, usedActionId: ActionType) => {
    // Обновляем перезарядки способностей Элиры
    setElyraActions((prev) =>
      prev.map((act) => {
        if (act.id === usedActionId) {
          return { ...act, currentCooldown: cooldownToSet };
        }
        return { ...act, currentCooldown: Math.max(0, act.currentCooldown - 1) };
      })
    );

    setTimeout(() => {
      setAttackerId(null);
      setTargetId(null);
      setTurnNumber((t) => t + 1);
      setPhase('PLAYER_TURN');
    }, 700);
  };

  // -------------------------------------------------------------
  // ОБРАБОТЧИК КЛАВИАТУРЫ (1-6, R, ESC)
  // -------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Нажатие ESC всегда открывает/закрывает паузу
      if (e.key === 'Escape') {
        e.preventDefault();
        handleTogglePause();
        return;
      }

      // Если сейчас не ход игрока — боевые кнопки не срабатывают
      if (phase !== 'PLAYER_TURN') return;

      const key = e.key.toLowerCase();
      const targetAction = morvanActions.find((a) => a.keyboardKey.toLowerCase() === key);

      if (targetAction) {
        // Проверяем возможность применения
        const isDistanceValid =
          !targetAction.requiredDistance || targetAction.requiredDistance.includes(distance);
        const isCooldownActive = targetAction.currentCooldown > 0;
        const isUltimateNotReady = targetAction.isUltimate && morvan.ultimateCharge < 100;

        if (isDistanceValid && !isCooldownActive && !isUltimateNotReady) {
          executePlayerAction(targetAction.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, morvanActions, distance, morvan.ultimateCharge, handleTogglePause, executePlayerAction]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between select-none">
      {/* ВЕРХНЯЯ СТРОКА: БРЕНД + КНОПКИ УПРАВЛЕНИЯ ПАУЗОЙ И ЗВУКОМ */}
      <div className="w-full max-w-6xl mx-auto px-4 py-2 flex items-center justify-between border-b border-stone-800/80">
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-sm font-bold tracking-widest text-amber-500">
            GOTHIC DUEL
          </span>
          <span className="text-xs text-stone-600">·</span>
          <span className="text-xs text-stone-400 hidden sm:inline">
            Morvan vs Elyra
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Кнопка переключения звука */}
          <button
            onClick={handleToggleMute}
            className="p-1.5 bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            title={isMuted ? 'Включить звук' : 'Выключить звук'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* Кнопка паузы (ESC) */}
          <button
            onClick={handleTogglePause}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-900 border border-stone-800 text-xs font-cinzel text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            title="Пауза (ESC)"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>ESC</span>
          </button>
        </div>
      </div>

      {/* ДВЕ БОЛЬШИЕ ПОЛОСКИ ЗДОРОВЬЯ (HP BARS) */}
      <HPBar
        morvan={morvan}
        elyra={elyra}
        distance={distance}
        phase={phase}
      />

      {/* ГОТИЧЕСКАЯ АРЕНА (КАМЕННЫЙ ПОЛ, КОЛОННЫ, СВЕЧИ, АРКИ, ТУМАН, БОЙЦЫ И ЭФФЕКТЫ) */}
      <main className="w-full px-4 my-auto">
        <Arena
          morvan={morvan}
          elyra={elyra}
          distance={distance}
          activeEffects={activeEffects}
          isScreenShaking={isScreenShaking}
          attackerId={attackerId}
          targetId={targetId}
        />
      </main>

      {/* ПАНЕЛЬ ПРИКАЗОВ И КНОПОК УПРАВЛЕНИЯ ДЛЯ MORVAN */}
      <Controls
        actions={morvanActions}
        currentDistance={distance}
        phase={phase}
        ultimateCharge={morvan.ultimateCharge}
        onSelectAction={executePlayerAction}
      />

      {/* ХРОНИКА БОЯ И АНАЛИЗ ДЕЙСТВИЙ БОТА */}
      <CombatLog
        logs={combatLogs}
        lastBotThought={lastBotThought}
      />

      {/* МОДАЛЬНЫЕ ОКНА: ГЛАВНОЕ МЕНЮ, ПАУЗА, ПОБЕДА, ПОРАЖЕНИЕ */}
      <Modals
        phase={phase}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onResume={() => setPhase(previousPhase)}
        onRestart={handleStartGame}
        onGoToMainMenu={handleGoToMainMenu}
        onStartGame={handleStartGame}
      />
    </div>
  );
}
