import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { initialStory, storyReducer, storyProgress } from "@/utils/story";
import { stories } from "@/data/stories";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
export function useStoryGame() {
  const [state, dispatch] = useReducer(storyReducer, initialStory);
  const [pending, setPending] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lock = useRef(false);
  const reduced = useReducedMotion();
  const cancelTransition = useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    lock.current = false;
    setPending(null);
  }, []);
  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );
  useFocusEffect(useCallback(() => cancelTransition, [cancelTransition]));
  const choose = (choiceIndex: number) => {
    if (
      lock.current ||
      state.startedAt === null ||
      state.finishedAt !== null ||
      !stories[state.currentId].choices[choiceIndex]
    )
      return;
    lock.current = true;
    setPending(choiceIndex);
    timer.current = setTimeout(
      () => {
        dispatch({
          type: "choose",
          fromId: state.currentId,
          choiceIndex,
          run: state.run,
          now: Date.now(),
        });
        lock.current = false;
        timer.current = null;
        setPending(null);
      },
      reduced ? 0 : 350,
    );
  };
  return {
    state,
    node: stories[state.currentId],
    pending,
    choose,
    progress: storyProgress(state),
    start: () => dispatch({ type: "start", now: Date.now() }),
    restart: () => {
      cancelTransition();
      dispatch({ type: "restart" });
    },
  };
}
