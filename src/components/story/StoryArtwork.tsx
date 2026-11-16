import { Image } from "expo-image";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import type { StoryNode } from "@/data/stories";
import { sceneImages } from "@/data/scene-images";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function StoryArtwork({ node }: { node: StoryNode }) {
  const reduced = useReducedMotion();
  const { width } = useWindowDimensions();
  return (
    <View
      style={[
        styles.frame,
        { height: width < 400 ? 108 : width < 900 ? 140 : 180 },
      ]}
    >
      <Image
        source={sceneImages[node.image]}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition="center"
        transition={reduced ? 0 : 450}
        accessible
        accessibilityLabel={"Minh họa: " + node.title}
      />
      <View pointerEvents="none" style={styles.shade} />
      <View pointerEvents="none" style={styles.caption}>
        <Text style={styles.symbol}>◈</Text>
        <Text style={styles.text}>
          {node.chapter.toLocaleUpperCase("vi-VN")}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  frame: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#15342B",
    borderWidth: 1,
    borderColor: "#8CA68B33",
  },
  shade: {
    ...StyleSheet.absoluteFill,
    backgroundImage: "linear-gradient(0deg, #041713CC, #04171300 70%)",
  },
  caption: {
    position: "absolute",
    bottom: 16,
    left: 18,
    right: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  symbol: { color: "#E0C291", fontSize: 20 },
  text: {
    color: "#F3E8D1",
    fontSize: 10,
    lineHeight: 18,
    letterSpacing: 2,
    flexShrink: 1,
  },
});
