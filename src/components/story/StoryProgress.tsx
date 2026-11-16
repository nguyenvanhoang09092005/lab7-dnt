import { StyleSheet, Text, View } from "react-native";
export function StoryProgress({
  progress,
  choices,
  started,
}: {
  progress: number;
  choices: number;
  started: boolean;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>HÀNH TRÌNH CỦA BẠN</Text>
        <Text style={styles.count}>{progress}%</Text>
      </View>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel="Tiến trình câu chuyện"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        style={styles.track}
      >
        <View
          style={[styles.fill, { width: (progress + "%") as `${number}%` }]}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.detail}>
          {started ? choices + 1 : 0} cảnh đã trải qua
        </Text>
        <Text style={styles.detail}>{choices} lựa chọn</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { gap: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  },
  label: {
    color: "#B7C9C1",
    fontSize: 10,
    letterSpacing: 1.8,
    fontWeight: "700",
  },
  count: { color: "#DFC89A", fontSize: 12, fontWeight: "700" },
  detail: { color: "#A6BDB1", fontSize: 12 },
  track: {
    height: 4,
    backgroundColor: "#FFFFFF14",
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: { height: 4, backgroundColor: "#D2B27D", borderRadius: 3 },
});
