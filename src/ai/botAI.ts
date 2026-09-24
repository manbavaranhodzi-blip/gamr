/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActionDef, ActionType, CharacterState, Distance } from '../types/game';

/**
 * Искусственный Интеллект для ELYRA (Компьютерный оппонент).
 * 
 * Модуль разработан по принципам учебного проекта:
 * - Оценивает дистанцию до игрока
 * - Приближается, если слишком далеко
 * - Использует дальние магические атаки
 * - Умеет блокировать и уклоняться
 * - Избегает спама одной и той же атаки
 * - Применяет сильные атаки, когда выгодно
 * - Запускает ультимейт при низком HP игрока
 * - Иногда совершает небольшую случайную ошибку (10% шанс)
 */

export interface AIReasoning {
  chosenAction: ActionType;
  thought: string; // Понятное пояснение логики хода для игрока и обучения
  isMistake: boolean;
}

export function decideBotAction(
  bot: CharacterState,
  player: CharacterState,
  distance: Distance,
  actions: ActionDef[],
  actionHistory: ActionType[]
): AIReasoning {
  const lastAction = actionHistory.length > 0 ? actionHistory[actionHistory.length - 1] : undefined;
  const isPlayerLowHp = player.hp <= 45;
  const isBotLowHp = bot.hp <= 35;
  const canUseUltimate = bot.ultimateCharge >= 100;

  // 1. ПРОВЕРКА УЛЬТИМЕЙТА:
  // "использовать ультимейт, когда HP игрока достаточно низкое"
  if (canUseUltimate && isPlayerLowHp) {
    return {
      chosenAction: 'ultimate',
      thought: 'У MORVAN мало здоровья — идеальный момент для решающего Астрального катаклизма!',
      isMistake: false,
    };
  }

  // 2. СЛУЧАЙНАЯ ОШИБКА (10% шанс):
  // "иногда совершать небольшую случайную ошибку"
  const mistakeRoll = Math.random();
  if (mistakeRoll < 0.10) {
    // Ошибка: бот может запутаться в заклинании или попытаться ударить посохом издалека
    if (distance === 'far') {
      return {
        chosenAction: 'light_attack',
        thought: 'Элира ошиблась с расчетом дистанции и замахнулась посохом слишком далеко!',
        isMistake: true,
      };
    } else {
      return {
        chosenAction: 'retreat',
        thought: 'Элира растерялась и сделала неловкий шаг назад.',
        isMistake: true,
      };
    }
  }

  // 3. ОЦЕНКА ВЫГОДЫ ДЛЯ СИЛЬНОЙ АТАКИ:
  // "использовать сильные атаки, когда это выгодно"
  const heavyAction = actions.find((a) => a.id === 'heavy_attack');
  const heavyAvailable = heavyAction && heavyAction.currentCooldown === 0;
  
  if (heavyAvailable && (distance === 'close' || distance === 'mid') && !player.isBlocking && lastAction !== 'heavy_attack') {
    // Если игрок открыт и мы на подходящей дистанции — применяем сильную магию
    if (Math.random() < 0.65) {
      return {
        chosenAction: 'heavy_attack',
        thought: 'MORVAN открылся для атаки — Элира обрушивает взрыв темной материи!',
        isMistake: false,
      };
    }
  }

  // 4. ОЦЕНКА ДИСТАНЦИИ:
  // А) ДАЛЬНЯЯ ДИСТАНЦИЯ ('far')
  if (distance === 'far') {
    // Если слишком далеко — бот либо обстреливает магией, либо сближается
    const roll = Math.random();
    if (roll < 0.60 && lastAction !== 'magic_projectile') {
      return {
        chosenAction: 'magic_projectile',
        thought: 'Дистанция дальняя — запускает прицельную Сферу Бездны через арену.',
        isMistake: false,
      };
    } else if (roll < 0.85) {
      return {
        chosenAction: 'approach',
        thought: 'Дистанция слишком велика — Элира сокращает разрыв для удобной позиции.',
        isMistake: false,
      };
    } else {
      return {
        chosenAction: 'block',
        thought: 'Готовит астральный щит на случай встречного рывка воина.',
        isMistake: false,
      };
    }
  }

  // Б) СРЕДНЯЯ ДИСТАНЦИЯ ('mid')
  if (distance === 'mid') {
    const candidates: { action: ActionType; weight: number; desc: string }[] = [
      { action: 'magic_projectile', weight: 35, desc: 'Запуск магического снаряда на средней дистанции.' },
      { action: 'heavy_attack', weight: heavyAvailable ? 30 : 0, desc: 'Сильный выброс энергии посоха.' },
      { action: 'dodge', weight: 15, desc: 'Уклонение от возможного броска топора.' },
      { action: 'block', weight: 15, desc: 'Магический барьер для поглощения урона.' },
      { action: 'approach', weight: 10, desc: 'Шаг вперед для усиления давления.' },
    ];

    // Штрафуем последнее использованное действие (не спамить)
    return pickWeightedAction(candidates, lastAction);
  }

  // В) БЛИЗКАЯ ДИСТАНЦИЯ ('close')
  // В ближнем бою топор Морвана крайне опасен! Колдунье выгодно блокировать, уклоняться или отходить
  if (distance === 'close') {
    const candidates: { action: ActionType; weight: number; desc: string }[] = [
      { action: 'block', weight: 28, desc: 'Морван вплотную с топором! Элира экстренно поднимает барьер.' },
      { action: 'dodge', weight: 24, desc: 'Теневой фазовый сдвиг, чтобы увернуться от удара топора.' },
      { action: 'retreat', weight: 22, desc: 'Разрыв дистанции назад в безопасную зону.' },
      { action: 'heavy_attack', weight: heavyAvailable ? 20 : 0, desc: 'Отчаянный мощный взрыв в упор.' },
      { action: 'light_attack', weight: 15, desc: 'Быстрый отталкивающий удар посохом.' },
    ];

    return pickWeightedAction(candidates, lastAction);
  }

  // Запасной безопасный ход
  return {
    chosenAction: 'magic_projectile',
    thought: 'Элира выпускает базовое заклинание.',
    isMistake: false,
  };
}

// Вспомогательная функция взвешенного выбора с анти-спамом
function pickWeightedAction(
  candidates: { action: ActionType; weight: number; desc: string }[],
  lastAction?: ActionType
): AIReasoning {
  // Уменьшаем вес последнего действия в 3 раза, чтобы бот не спамил
  const adjusted = candidates.map((c) => ({
    ...c,
    weight: c.action === lastAction ? Math.max(2, Math.floor(c.weight / 3)) : c.weight,
  }));

  const totalWeight = adjusted.reduce((sum, item) => sum + item.weight, 0);
  let randomVal = Math.random() * totalWeight;

  for (const item of adjusted) {
    if (randomVal <= item.weight) {
      return {
        chosenAction: item.action,
        thought: item.desc,
        isMistake: false,
      };
    }
    randomVal -= item.weight;
  }

  const fallback = adjusted[0];
  return {
    chosenAction: fallback.action,
    thought: fallback.desc,
    isMistake: false,
  };
}
