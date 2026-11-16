import { StyleSheet, Text, View } from "react-native";
import { type StoryNode, endingLabels } from "@/data/stories";
import type { StoryState } from "@/utils/story";
import { StoryDisplay } from "./StoryDisplay";
import { EndingEffect, endingStyles } from "./EndingEffect";
import { StorySummary } from "./StorySummary";

export function EndingScreen({
  node,
  state,
}: {
  node: StoryNode;
  state: StoryState;
}) {
  const type = node.endingType;
  if (!type) return null;
  const { color, label } = endingStyles[type];
  return (
    <View style={{ gap: 24 }}>
      <View style={styles.heading}>
        <EndingEffect type={type} />
        <View style={{ flex: 1, minWidth: 130, gap: 8 }}>
          <Text accessibilityRole="header" style={[styles.label, { color }]}>
            {label}
          </Text>
          <Text style={styles.name}>{endingLabels[type]}</Text>
        </View>
      </View>
      <StoryDisplay node={node} />
      <StorySummary state={state} />
    </View>
  );
}
const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  label: { fontSize: 10, letterSpacing: 2, fontWeight: "700", lineHeight: 19 },
  name: { color: "#E9E5D7", fontSize: 16, lineHeight: 24 },
});
