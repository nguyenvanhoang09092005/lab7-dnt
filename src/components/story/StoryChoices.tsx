import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { StoryChoice } from "@/data/stories";
function Choice({
  choice,
  index,
  pending,
  onChoose,
}: {
  choice: StoryChoice;
  index: number;
  pending: number | null;
  onChoose: (index: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const selected = pending === index;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={choice.text}
      accessibilityHint={choice.hint}
      aria-disabled={pending !== null}
      aria-busy={selected}
      disabled={pending !== null}
      onPress={() => onChoose(index)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ pressed }) => [
        styles.choice,
        (hovered || focused || selected) && styles.hovered,
        {
          transform: [
            { translateX: hovered || focused ? 3 : 0 },
            { scale: pressed ? 0.985 : 1 },
          ],
        },
        { opacity: pending !== null && !selected ? 0.5 : pressed ? 0.8 : 1 },
      ]}
    >
      <Text style={styles.number}>{String(index + 1).padStart(2, "0")}</Text>
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={styles.text}>{choice.text}</Text>
        <Text style={styles.hint}>{choice.hint}</Text>
      </View>
      {selected ? (
        <ActivityIndicator color="#DFC191" />
      ) : (
        <Text style={styles.arrow}>↗</Text>
      )}
    </Pressable>
  );
}
export function StoryChoices({
  choices,
  pending,
  onChoose,
}: {
  choices: StoryChoice[];
  pending: number | null;
  onChoose: (index: number) => void;
}) {
  return (
    <View style={{ gap: 12 }}>
      <Text accessibilityLiveRegion="polite" style={styles.label}>
        {pending !== null ? "ĐANG MỞ RA MỘT CHƯƠNG MỚI…" : "BẠN SẼ LÀM GÌ?"}
      </Text>
      {choices.map((choice, index) => (
        <Choice
          key={choice.nextStoryId}
          choice={choice}
          index={index}
          pending={pending}
          onChoose={onChoose}
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  label: {
    color: "#AFC5B9",
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 2,
    lineHeight: 18,
  },
  choice: {
    minHeight: 85,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#708A7555",
    backgroundColor: "#152D27CC",
  },
  hovered: { borderColor: "#D4B784", backgroundColor: "#2A3E30" },
  number: { color: "#CBAF7A", fontSize: 12, fontWeight: "700" },
  text: { color: "#FAF3E7", fontSize: 15, lineHeight: 23, fontWeight: "600" },
  hint: { color: "#A7BDB0", fontSize: 12, lineHeight: 20 },
  arrow: { color: "#E1C792", fontSize: 22 },
});
