import test from 'node:test';
import assert from 'node:assert/strict';
import { gameReducer, initialGame, itemPosition } from '../src/utils/game.ts';
test('targets stay inside small, tablet and landscape boards', () => {
  for (const [width, height] of [
    [240, 240],
    [600, 280],
    [320, 430],
  ])
    for (const x of [0, 0.5, 1])
      for (const y of [0, 0.5, 1]) {
        const p = itemPosition(
          { kind: 'target', x, y, id: 1 },
          width,
          height,
          76,
        );
        assert.ok(
          p.left >= 0 &&
            p.top >= 0 &&
            p.left + 76 <= width &&
            p.top + 76 <= height,
        );
      }
});
function spawn(s, kind = 'target') {
  return gameReducer(s, {
    type: 'spawn',
    item: { kind, x: 0.5, y: 0.5, id: s.round },
  });
}
test('game prevents duplicate points, applies combo, coin, bomb rules and pauses', () => {
  let s = gameReducer(initialGame, { type: 'start' });
  s = spawn(s);
  const id = s.item.id;
  s = gameReducer(s, { type: 'hit', id });
  assert.equal(s.score, 1);
  assert.equal(gameReducer(s, { type: 'hit', id }).score, 1);
  for (let i = 0; i < 4; i++) {
    s = spawn(s);
    s = gameReducer(s, { type: 'hit', id: s.item.id });
  }
  assert.equal(s.score, 6);
  assert.equal(s.best, 5);
  s = spawn(s, 'coin');
  s = gameReducer(s, { type: 'hit', id: s.item.id });
  assert.equal(s.score, 9);
  s = spawn(s, 'bomb');
  assert.equal(gameReducer(s, { type: 'miss' }).lives, 3);
  s = gameReducer(s, { type: 'hit', id: s.item.id });
  assert.equal(s.lives, 2);
  assert.equal(s.combo, 0);
  s = gameReducer(s, { type: 'pause' });
  assert.equal(
    gameReducer(s, { type: 'tick', elapsed: 5000 }).remaining,
    30000,
  );
  s = gameReducer(s, { type: 'resume' });
  s = gameReducer(s, { type: 'tick', elapsed: 31000 });
  assert.equal(s.phase, 'finished');
  assert.equal(
    gameReducer(s, {
      type: 'spawn',
      item: { kind: 'coin', id: s.round, x: 0, y: 0 },
    }).item,
    null,
  );
});
test('losing three lives ends game and ignores old timers after restart', () => {
  let s = gameReducer(initialGame, { type: 'start' });
  for (let i = 0; i < 3; i++) {
    s = spawn(s, 'bomb');
    s = gameReducer(s, { type: 'hit', id: s.item.id });
  }
  assert.equal(s.lives, 0);
  assert.equal(s.phase, 'finished');
  const old = s.round;
  s = gameReducer(s, { type: 'start' });
  assert.equal(
    gameReducer(s, {
      type: 'spawn',
      item: { id: old, x: 0, y: 0, kind: 'target' },
    }).item,
    null,
  );
});
