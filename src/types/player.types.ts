export type Player = {
  level: number,
  xp: number,
  levelUpExp: number,
  gold: number,
  maxHealth: number,
  currentHealth: number,
  autoDamage: number,   // Daño automático cada X ms
  clickDamage: number,
  inventory: [],
  mult: multiplier      // Daño al hacer clic
};

type multiplier = {
  damage: number,
  maxHealth: number,
  xp: number,
  gold: number
}

export const PlayerStats: Player = {
  level: 1,
  xp: 0,
  levelUpExp: 10,
  gold: 1000,
  maxHealth: 100,
  currentHealth: 100,
  autoDamage: 1,   // Daño automático cada X ms
  clickDamage: 25,        // Daño al hacer clic
  inventory: [],
  mult: {
    damage: 1,
    maxHealth: 1,
    xp: 1,
    gold: 1
  }
}
