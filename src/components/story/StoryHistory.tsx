import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { ChoiceRecord } from "@/utils/story";
import { stories } from "@/data/stories";

export function StoryHistory({
  history,
  complete = false,
}: {
  history: ChoiceRecord[];
  complete?: boolean;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <View style={styles.panel}>
      <View style={styles.heading}>
        <Text accessibilityRole="header" style={styles.title}>
          Dấu chân của bạn
        </Text>
        <Text style={styles.badge}>
          {String(history.length).padStart(2, "0")}
        </Text>
      </View>
      <Text style={styles.subtitle}>
        {complete
          ? "Hành trình đã khép lại. Chạm để đọc lại từng bước."
          : "Chạm vào một quyết định để đọc lại tình huống."}
      </Text>
      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.mark}>⌁</Text>
          <Text style={styles.subtitle}>Trang đầu tiên vẫn đang đợi bạn.</Text>
        </View>
      ) : (
        <ScrollView style={{ maxHeight: 470 }} nestedScrollEnabled>
          {history.map((entry, index) => {
            const open = expanded === index;
            return (
              <View key={entry.storyId} style={styles.entry}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    "Quyết định " + (index + 1) + ": " + entry.text
                  }
                  accessibilityHint="Xem lại nội dung tình huống và nơi bạn đã đến."
                  aria-expanded={open}
                  onPress={() => setExpanded(open ? null : index)}
                  style={({ pressed }) => [
                    styles.entryButton,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text style={styles.number}>
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                  <View style={{ flex: 1, gap: 5 }}>
                    <Text style={styles.node}>
                      {stories[entry.storyId].title}
                    </Text>
                    <Text style={styles.decision}>{entry.text}</Text>
                  </View>
                  <Text style={styles.number}>{open ? "−" : "+"}</Text>
                </Pressable>
                {open && (
                  <View style={styles.recap}>
                    <Text style={styles.decision}>
                      {stories[entry.storyId].description}
                    </Text>
                    <Text style={styles.destination}>
                      ↳ {stories[entry.nextStoryId].title}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
      <Text style={styles.footer}>
        20 tình huống · 4 kết thúc
        {complete
          ? "\nMột hành trình khác vẫn đang chờ."
          : "\nKhông có lựa chọn nào vô nghĩa."}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  panel: {
    padding: 23,
    borderWidth: 1,
    borderColor: "#6B867044",
    backgroundColor: "#0C211DEB",
    borderRadius: 22,
    gap: 12,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: { color: "#F0E7D6", fontSize: 19, fontWeight: "600", flexShrink: 1 },
  badge: { color: "#D3B786", fontSize: 12, fontVariant: ["tabular-nums"] },
  subtitle: { color: "#AFC2B6", fontSize: 12, lineHeight: 21 },
  empty: {
    minHeight: 160,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  mark: { fontSize: 45, color: "#B89D6F" },
  entry: { borderBottomWidth: 1, borderBottomColor: "#59705D33" },
  entryButton: {
    minHeight: 64,
    flexDirection: "row",
    gap: 13,
    paddingVertical: 17,
  },
  number: { color: "#C8AD7C", fontSize: 11, paddingTop: 3 },
  node: { color: "#D9E1D6", fontSize: 13, fontWeight: "600", lineHeight: 21 },
  decision: { color: "#A4BCAD", fontSize: 12, lineHeight: 20 },
  recap: { paddingLeft: 26, paddingBottom: 18, gap: 12 },
  destination: { color: "#D3B786", fontSize: 12, lineHeight: 20 },
  footer: { color: "#BDAA85", fontSize: 11, lineHeight: 20, paddingTop: 10 },
});
