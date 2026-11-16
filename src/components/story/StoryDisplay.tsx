import { useEffect, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
} from "react-native";
import type { StoryNode } from "@/data/stories";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { StoryArtwork } from "./StoryArtwork";

export function StoryDisplay({
  node,
  transitioning = false,
}: {
  node: StoryNode;
  transitioning?: boolean;
}) {
  const [value] = useState(() => new Animated.Value(1));
  const reduced = useReducedMotion();
  const { width } = useWindowDimensions();
  useEffect(() => {
    if (!transitioning) value.setValue(reduced ? 1 : 0);
    const animation = Animated.timing(value, {
      toValue: transitioning && !reduced ? 0.35 : 1,
      duration: reduced ? 0 : transitioning ? 250 : 450,
      useNativeDriver: Platform.OS !== "web",
    });
    animation.start();
    return () => animation.stop();
  }, [node.id, transitioning, value, reduced]);
  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      style={{
        gap: 18,
        opacity: value,
        transform: [
          {
            translateY: value.interpolate({
              inputRange: [0, 1],
              outputRange: [12, 0],
            }),
          },
        ],
      }}
    >
      <StoryArtwork node={node} />
      <Text
        accessibilityRole="header"
        style={[styles.title, width < 400 && styles.smallTitle]}
      >
        {node.title}
      </Text>
      <Text style={styles.description}>{node.description}</Text>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  title: {
    color: "#FBF4E6",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 32,
    lineHeight: 42,
    fontWeight: "500",
  },
  smallTitle: { fontSize: 27, lineHeight: 36 },
  description: { color: "#D2DFD7", fontSize: 16, lineHeight: 28 },
});
