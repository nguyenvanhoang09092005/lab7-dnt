export type Kind = 'target' | 'coin' | 'bomb';
export type Item = { kind: Kind; x: number; y: number; id: number };
export type Game = {
  phase: 'ready' | 'playing' | 'paused' | 'finished';
  score: number;
  lives: number;
  remaining: number;
  combo: number;
  best: number;
  round: number;
  item: Item | null;
};
export const initialGame: Game = {
  phase: 'ready',
  score: 0,
  lives: 3,
  remaining: 30000,
  combo: 0,
  best: 0,
  round: 0,
  item: null,
};
export type GameAction =
  | { type: 'start' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'tick'; elapsed: number }
  | { type: 'spawn'; item: Item }
  | { type: 'hit'; id: number }
  | { type: 'miss' }
  | { type: 'skip'; id: number };
export function drawItem(id: number, random: () => number = Math.random): Item {
  const r = random();
  return {
    id,
    kind: r < 0.25 ? 'bomb' : r < 0.4 ? 'coin' : 'target',
    x: random(),
    y: random(),
  };
}
export function itemPosition(
  item: Item,
  width: number,
  height: number,
  size: number,
) {
  return {
    left: Math.max(0, width - size) * Math.max(0, Math.min(1, item.x)),
    top: Math.max(0, height - size) * Math.max(0, Math.min(1, item.y)),
  };
}
export function gameReducer(s: Game, a: GameAction): Game {
  if (a.type === 'start')
    return { ...initialGame, phase: 'playing', round: s.round + 1 };
  if (a.type === 'pause')
    return s.phase === 'playing' ? { ...s, phase: 'paused' } : s;
  if (a.type === 'resume')
    return s.phase === 'paused' ? { ...s, phase: 'playing' } : s;
  if (s.phase !== 'playing') return s;
  if (a.type === 'tick') {
    const remaining = Math.max(0, s.remaining - Math.max(0, a.elapsed));
    return {
      ...s,
      remaining,
      phase: remaining === 0 ? 'finished' : 'playing',
      item: remaining === 0 ? null : s.item,
    };
  }
  if (a.type === 'spawn')
    return s.item || a.item.id !== s.round ? s : { ...s, item: a.item };
  if (a.type === 'skip')
    return s.item?.id === a.id ? { ...s, item: null, round: s.round + 1 } : s;
  if (a.type === 'miss' && (!s.item || s.item.kind === 'bomb')) return s;
  if (a.type === 'hit' && s.item?.id !== a.id) return s;
  if (a.type === 'miss' || a.type === 'hit') {
    if (!s.item) return s;
    const penalty = a.type === 'miss' || s.item.kind === 'bomb',
      lives = s.lives - (penalty ? 1 : 0),
      combo = penalty ? 0 : s.combo + 1;
    const points = penalty
      ? 0
      : s.item.kind === 'coin'
        ? 3
        : combo >= 5
          ? 2
          : 1;
    return {
      ...s,
      lives,
      combo,
      score: s.score + points,
      best: Math.max(s.best, combo),
      item: null,
      round: s.round + 1,
      phase: lives <= 0 ? 'finished' : 'playing',
    };
  }
  return s;
}
