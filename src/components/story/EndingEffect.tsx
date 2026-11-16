import { useEffect, useState } from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import type { EndingType } from "@/data/stories";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export const endingStyles: Record<
  EndingType,
  { color: string; symbol: string; label: string }
> = {
  good: { color: "#A9E3C0", symbol: "☀", label: "KẾT THÚC TỐT" },
  bad: { color: "#E1A7B2", symbol: "☾", label: "KẾT THÚC XẤU" },
  secret: { color: "#D4B5FF", symbol: "✧", label: "KẾT THÚC BÍ MẬT" },
  alternative: { color: "#EDCA89", symbol: "⌂", label: "KẾT THÚC KHÁC" },
};

export function EndingEffect({ type }: { type: EndingType }) {
  const [value] = useState(() => new Animated.Value(0));
  const reduced = useReducedMotion();
  const { color, symbol } = endingStyles[type];
  useEffect(() => {
    value.setValue(reduced ? 1 : 0);
    if (reduced) return;
    const animation = Animated.timing(value, {
      toValue: 1,
      duration: type === "bad" ? 2200 : 1800,
      useNativeDriver: Platform.OS !== "web",
    });
    animation.start();
    return () => animation.stop();
  }, [type, reduced, value]);

  return (
    <View
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.stage}
    >
      {!reduced &&
        Array.from({ length: type === "bad" ? 3 : 7 }, (_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                backgroundColor: color,
                left: 8 + i * 19,
                top: type === "bad" ? 25 + i * 15 : 54 + (i % 3) * 9,
                width: type === "bad" ? 82 : type === "good" ? 4 : 3,
                height: type === "bad" ? 9 : type === "good" ? 14 : 3,
                opacity: value.interpolate({
                  inputRange: [0, 0.25, 0.8, 1],
                  outputRange: [0, 0.55, 0.25, 0],
                }),
                transform: [
                  {
                    translateY: value.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, type === "bad" ? 8 : -(25 + i * 5)],
                    }),
                  },
                  {
                    translateX: value.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        0,
                        type === "bad" ? (i % 2 ? -35 : 35) : (i - 3) * 7,
                      ],
                    }),
                  },
                  { rotate: type === "good" ? i * 24 - 72 + "deg" : "0deg" },
                ],
              },
            ]}
          />
        ))}
      <Animated.View
        style={[
          styles.emblem,
          {
            borderColor: color + "88",
            backgroundColor: color + "0C",
            boxShadow: "0 0 45px " + color + "22",
            opacity: value.interpolate({
              inputRange: [0, 0.4, 1],
              outputRange: [0.4, 1, 1],
            }),
            transform: [
              {
                scale: value.interpolate({
                  inputRange: [0, 1],
                  outputRange: [type === "bad" ? 1.15 : 0.8, 1],
                }),
              },
              {
                rotate: value.interpolate({
                  inputRange: [0, 1],
                  outputRange: [type === "secret" ? "-45deg" : "0deg", "0deg"],
                }),
              },
              {
                translateY: value.interpolate({
                  inputRange: [0, 1],
                  outputRange: [type === "alternative" ? 16 : 0, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={{ fontSize: 42, color }}>{symbol}</Text>
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  stage: {
    width: 160,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  emblem: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    borderWidth: 1,
  },
  particle: { position: "absolute", borderRadius: 8 },
});
