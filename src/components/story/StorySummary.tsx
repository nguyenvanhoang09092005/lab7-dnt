import { StyleSheet, Text, View } from "react-native";
import { storySummary, type StoryState } from "@/utils/story";

export function StorySummary({ state }: { state: StoryState }) {
  const summary = storySummary(state);
  if (!summary) return null;
  return (
    <View style={styles.panel}>
      <Text accessibilityRole="header" style={styles.title}>
        Hành trình đã viết nên bạn
      </Text>
      <Text style={styles.result}>{summary.result}</Text>
      <View style={styles.stats}>
        {[
          [String(summary.scenes), "cảnh đã khám phá"],
          [String(summary.choices), "lựa chọn đã thực hiện"],
          [summary.duration, "thời gian hành trình"],
        ].map(([value, label]) => (
          <View key={label} style={styles.stat}>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.caption}>{label}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.label}>NHỮNG QUYẾT ĐỊNH QUAN TRỌNG</Text>
      {summary.keyDecisions.map((entry) => (
        <View key={entry.storyId} style={styles.decision}>
          <Text style={styles.number}>
            {String(entry.step).padStart(2, "0")}
          </Text>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.scene}>{entry.title}</Text>
            <Text style={styles.caption}>{entry.text}</Text>
            <Text style={styles.destination}>↳ {entry.destination}</Text>
          </View>
        </View>
      ))}
      <Text style={styles.note}>
        Xem toàn bộ lựa chọn trong Dấu chân của bạn. Chơi lại để khám phá một
        lối đi khác.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  panel: {
    gap: 18,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#FFFFFF22",
  },
  title: { color: "#F0E7D6", fontSize: 20, fontWeight: "600", lineHeight: 28 },
  result: { color: "#D2C29F", fontSize: 14, lineHeight: 23 },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
    paddingVertical: 6,
  },
  stat: { flexGrow: 1, flexBasis: 120, gap: 4 },
  value: { color: "#F7E8C9", fontSize: 22, fontWeight: "700", lineHeight: 32 },
  caption: { color: "#B1C4B6", fontSize: 12, lineHeight: 20 },
  label: {
    color: "#D3B786",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.8,
    lineHeight: 18,
  },
  decision: {
    flexDirection: "row",
    gap: 12,
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: "#D3B78655",
  },
  number: { color: "#D3B786", fontSize: 11, lineHeight: 22 },
  scene: { color: "#E7EBDF", fontWeight: "600", fontSize: 14, lineHeight: 22 },
  destination: { color: "#C7B28B", fontSize: 12, lineHeight: 20 },
  note: { color: "#A7BDB0", fontSize: 12, lineHeight: 21 },
});
