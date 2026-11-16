import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import {
  stories,
  START_STORY_ID,
  STORY_IDS,
  endingLabels,
} from "../src/data/stories.ts";
import {
  initialStory,
  storyReducer,
  storyProgress,
  formatDuration,
  storySummary,
} from "../src/utils/story.ts";

test("story has 20 reachable scenes, four distinct endings, valid links, no cycles or dead ends", () => {
  assert.ok(Object.keys(stories).length >= 15);
  assert.deepEqual(Object.keys(stories).sort(), [...STORY_IDS].sort());
  const imageSource = readFileSync(
    new URL("../src/data/scene-images.ts", import.meta.url),
    "utf8",
  );
  const visited = new Set(),
    endings = new Set();
  function visit(id, ancestors = new Set()) {
    assert.ok(stories[id], "Missing node: " + id);
    assert.ok(!ancestors.has(id), "Cycle can trap the player: " + id);
    const node = stories[id];
    assert.equal(node.id, id);
    assert.ok(node.title && node.description && node.image);
    assert.ok(
      imageSource.includes(node.image + ": require("),
      "Missing image mapping: " + node.image,
    );
    assert.ok(
      existsSync(
        new URL("../assets/story/" + node.image + ".svg", import.meta.url),
      ),
    );
    assert.equal(
      new Set(node.choices.map((c) => c.nextStoryId)).size,
      node.choices.length,
      "Choices must lead to distinct scenes",
    );
    visited.add(id);
    if (node.isEnding) {
      assert.ok(node.endingType);
      assert.equal(node.choices.length, 0);
      endings.add(node.endingType);
      return;
    }
    assert.ok(
      node.choices.length >= 2,
      id + " must offer at least two choices",
    );
    for (const choice of node.choices) {
      assert.ok(choice.text && choice.hint);
      visit(choice.nextStoryId, new Set(ancestors).add(id));
    }
  }
  visit(START_STORY_ID);
  assert.equal(visited.size, Object.keys(stories).length);
  assert.deepEqual(endings, new Set(["good", "bad", "secret", "alternative"]));
});

test("every complete route records correct choices, progresses and ends; restart resets each route", () => {
  let routes = 0;
  const counts = {};
  function walk(s, depth = 0) {
    assert.ok(depth < 20);
    const node = stories[s.currentId];
    if (node.isEnding) {
      routes++;
      counts[node.endingType] = (counts[node.endingType] ?? 0) + 1;
      const summary = storySummary(s);
      assert.equal(summary.endingType, node.endingType);
      assert.equal(
        summary.result,
        endingLabels[node.endingType] + " · " + node.title,
      );
      assert.equal(summary.scenes, depth + 1);
      assert.equal(summary.choices, depth);
      assert.equal(summary.duration, formatDuration(0, depth * 1000));
      assert.deepEqual(
        summary.keyDecisions.map((entry) => entry.storyId),
        s.history
          .filter((entry) => stories[entry.storyId].keyDecision)
          .map((entry) => entry.storyId),
      );
      assert.ok(summary.keyDecisions.length >= 2);
      for (const entry of summary.keyDecisions) {
        assert.equal(entry.text, s.history[entry.step - 1].text);
        assert.equal(entry.destination, stories[entry.nextStoryId].title);
      }
      assert.equal(storyReducer(s, { type: "start", now: 99999 }), s);
      assert.equal(
        storyReducer(s, {
          type: "choose",
          fromId: s.currentId,
          choiceIndex: 0,
          run: s.run,
          now: 99999,
        }),
        s,
      );
      assert.equal(storyProgress(s), 100);
      assert.equal(s.history.length, depth);
      assert.equal(s.finishedAt, depth * 1000);
      const reset = storyReducer(s, { type: "restart" });
      assert.equal(reset.currentId, START_STORY_ID);
      assert.equal(reset.startedAt, null);
      assert.equal(reset.finishedAt, null);
      assert.deepEqual(reset.history, []);
      assert.equal(storySummary(reset), null);
      assert.equal(storyProgress(reset), 0);
      assert.ok(reset.run > s.run);
      return;
    }
    node.choices.forEach((choice, choiceIndex) => {
      const next = storyReducer(s, {
        type: "choose",
        fromId: node.id,
        choiceIndex,
        run: s.run,
        now: (depth + 1) * 1000,
      });
      assert.equal(next.currentId, choice.nextStoryId);
      assert.deepEqual(next.history.at(-1), {
        storyId: node.id,
        nextStoryId: choice.nextStoryId,
        text: choice.text,
      });
      assert.ok(storyProgress(next) >= storyProgress(s));
      walk(next, depth + 1);
    });
  }
  walk(storyReducer(initialStory, { type: "start", now: 0 }));
  assert.equal(routes, 30);
  assert.deepEqual(counts, { secret: 3, good: 13, bad: 10, alternative: 4 });
  console.log("Validated all " + routes + " complete story routes.");
});

test("invalid, rapid, stale and pre-start choices cannot corrupt a game", () => {
  const action = {
    type: "choose",
    fromId: START_STORY_ID,
    choiceIndex: 0,
    run: 0,
    now: 100,
  };
  assert.equal(storyReducer(initialStory, action), initialStory);
  let s = storyReducer(initialStory, { type: "start", now: 0 });
  assert.equal(storyReducer(s, { ...action, choiceIndex: -1 }), s);
  assert.equal(storyReducer(s, { ...action, choiceIndex: 99 }), s);
  for (const choiceIndex of [0.5, NaN, Infinity, "0", null])
    assert.equal(storyReducer(s, { ...action, choiceIndex }), s);
  assert.equal(storySummary(s), null);
  assert.equal(storyReducer(s, { type: "start", now: 400 }), s);
  const next = storyReducer(s, action);
  assert.equal(storyReducer(next, action), next);
  s = storyReducer(next, { type: "restart" });
  s = storyReducer(s, { type: "start", now: 200 });
  assert.equal(storyReducer(s, action), s);
  assert.equal(formatDuration(0, 65000), "1 phút 5 giây");
  assert.equal(formatDuration(null, null), "—");
});
