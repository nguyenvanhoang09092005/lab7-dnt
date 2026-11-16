import {
  START_STORY_ID,
  stories,
  endingLabels,
  type StoryId,
} from "../data/stories.ts";
export interface ChoiceRecord {
  storyId: StoryId;
  nextStoryId: StoryId;
  text: string;
}
export interface StoryState {
  currentId: StoryId;
  history: ChoiceRecord[];
  startedAt: number | null;
  finishedAt: number | null;
  run: number;
}
export const initialStory: StoryState = {
  currentId: START_STORY_ID,
  history: [],
  startedAt: null,
  finishedAt: null,
  run: 0,
};
export type StoryAction =
  | { type: "start"; now: number }
  | {
      type: "choose";
      fromId: StoryId;
      choiceIndex: number;
      run: number;
      now: number;
    }
  | { type: "restart" };
export function storyReducer(s: StoryState, a: StoryAction): StoryState {
  if (a.type === "restart") return { ...initialStory, run: s.run + 1 };
  if (a.type === "start")
    return s.startedAt === null ? { ...s, startedAt: a.now } : s;
  if (
    s.startedAt === null ||
    s.finishedAt !== null ||
    a.run !== s.run ||
    a.fromId !== s.currentId
  )
    return s;
  if (!Number.isInteger(a.choiceIndex)) return s;
  const node = stories[s.currentId];
  const choice = node?.choices[a.choiceIndex];
  const next = choice && stories[choice.nextStoryId];
  if (!choice || !next || node.isEnding) return s;
  return {
    ...s,
    currentId: next.id,
    finishedAt: next.isEnding ? a.now : null,
    history: [
      ...s.history,
      { storyId: node.id, nextStoryId: next.id, text: choice.text },
    ],
  };
}
export function storyProgress(state: StoryState): number {
  // Longest remaining path gives a path-dependent progress without treating all nodes as one route.
  const remaining = (id: StoryId, visited = new Set<StoryId>()): number => {
    const node = stories[id];
    if (!node || node.isEnding || visited.has(id)) return 0;
    const nextVisited = new Set(visited).add(id);
    return (
      1 +
      Math.max(
        0,
        ...node.choices.map((c) => remaining(c.nextStoryId, nextVisited)),
      )
    );
  };
  if (stories[state.currentId]?.isEnding) return 100;
  const total = state.history.length + remaining(state.currentId);
  return total ? Math.round((state.history.length / total) * 100) : 0;
}
export function formatDuration(
  start: number | null,
  end: number | null,
): string {
  if (start === null || end === null) return "—";
  const seconds = Math.max(0, Math.floor((end - start) / 1000));
  return Math.floor(seconds / 60) + " phút " + (seconds % 60) + " giây";
}

export function storySummary(state: StoryState) {
  const node = stories[state.currentId];
  if (!node.isEnding || !node.endingType || state.finishedAt === null)
    return null;
  return {
    endingType: node.endingType,
    result: endingLabels[node.endingType] + " · " + node.title,
    scenes: state.history.length + 1,
    choices: state.history.length,
    duration: formatDuration(state.startedAt, state.finishedAt),
    keyDecisions: state.history.flatMap((entry, index) =>
      stories[entry.storyId].keyDecision
        ? [
            {
              ...entry,
              step: index + 1,
              title: stories[entry.storyId].title,
              destination: stories[entry.nextStoryId].title,
            },
          ]
        : [],
    ),
  };
}
