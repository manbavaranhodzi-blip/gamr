/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Типы дистанции между бойцами в арене
export type Distance = 'close' | 'mid' | 'far';

// Идентификаторы персонажей
export type CharacterId = 'morvan' | 'elyra';

// Типы боевых действий
export type ActionType =
  | 'light_attack'    // Быстрый / Обычный удар (топор / жезл)
  | 'heavy_attack'    // Сильный сокрушающий удар
  | 'magic_projectile'// Дальний магический снаряд
  | 'approach'        // Сближение (сократить дистанцию)
  | 'retreat'         // Отступление (увеличить дистанцию)
  | 'block'           // Блок (снижает входящий урон на 75%)
  | 'dodge'           // Уклонение (полный уход от атаки)
  | 'ultimate';       // Мощная ультимативная способность

// Описание действия персонажа для UI и логики
export interface ActionDef {
  id: ActionType;
  name: string;
  shortName: string;
  description: string;
  minDamage: number;
  maxDamage: number;
  requiredDistance?: Distance[]; // На каких дистанциях доступно
  cooldownTurns: number;
  currentCooldown: number;
  keyboardKey: string;
  isRanged?: boolean;
  isDefense?: boolean;
  isMovement?: boolean;
  isUltimate?: boolean;
}

// Состояние персонажа в бою
export interface CharacterState {
  id: CharacterId;
  name: string;
  title: string;
  hp: number;
  maxHp: number;
  isBlocking: boolean;
  isDodging: boolean;
  status: 'idle' | 'attacking' | 'blocking' | 'dodging' | 'hit' | 'defeated';
  ultimateCharge: number; // 0 - 100%
  lastActionUsed?: ActionType;
}

// Типы визуальных эффектов
export type VisualEffectType =
  | 'hit_flash'        // Вспышка при ударе
  | 'particles'        // Частицы при попадании
  | 'magic_projectile' // Магический снаряд, летящий к цели
  | 'staff_glow'       // Свечение посоха
  | 'axe_slash'        // Эффект движения топора
  | 'screen_shake'     // Тряска экрана при сильной атаке
  | 'hurt_flash'       // Вспышка при получении урона
  | 'block_effect'     // Эффект блока
  | 'dodge_effect'     // Эффект уклонения
  | 'damage_number';   // Всплывающее число урона

export interface VisualEffect {
  id: string;
  type: VisualEffectType;
  x?: number;
  y?: number;
  color?: string;
  text?: string;
  durationMs?: number;
}

// Фазы состояния игры
export type GamePhase =
  | 'TITLE_MENU'    // Главное меню
  | 'PLAYER_TURN'   // Ход игрока (MORVAN)
  | 'BOT_THINKING'  // Оценка ситуации ботом (ELYRA)
  | 'ACTION_EXEC'   // Воспроизведение анимации и эффектов действия
  | 'PAUSED'        // Пауза (по нажатию ESC)
  | 'VICTORY'       // Победа (Morvan победил)
  | 'DEFEAT';       // Поражение (Elyra победила)

// Запись боевого лога
export interface CombatLogEntry {
  id: string;
  turn: number;
  sender: 'morvan' | 'elyra' | 'system';
  text: string;
  type: 'attack' | 'heavy' | 'magic' | 'defense' | 'ultimate' | 'system' | 'info';
}
