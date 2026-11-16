import { Image } from "expo-image";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Action, LabScreen } from "@/components/lab-ui";
import { useStoryGame } from "@/hooks/use-story-game";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { sceneImages } from "@/data/scene-images";
import { StoryDisplay } from "./StoryDisplay";
import { StoryChoices } from "./StoryChoices";
import { StoryProgress } from "./StoryProgress";
import { StoryHistory } from "./StoryHistory";
import { EndingScreen } from "./EndingScreen";
import { GameControls } from "./GameControls";
import { StoryArtwork } from "./StoryArtwork";

export function StoryGame() {
  const { state, node, pending, choose, start, restart, progress } =
    useStoryGame();
  const { width } = useWindowDimensions();
  const reduced = useReducedMotion();
  const started = state.startedAt !== null;
  const progressPanel = (
    <View
      style={[styles.progress, width < 900 && { width: "100%", padding: 16 }]}
    >
      <StoryProgress
        progress={progress}
        choices={state.history.length}
        started={started}
      />
    </View>
  );
  return (
    <LabScreen
      wide
      compactHeader={width < 900}
      scrollResetKey={state.run + ":" + node.id + ":" + started}
      title="Destini"
      subtitle="KHU RỪNG CỦA NHỮNG ĐIỀU BỎ QUÊN"
      background={
        <>
          <Image
            source={sceneImages[node.image]}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={reduced ? 0 : 600}
            accessible={false}
          />
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundImage: "linear-gradient(90deg, #041713E6, #07191266)",
                backgroundColor: "#06181055",
              },
            ]}
          />
        </>
      }
    >
      <View
        style={[
          styles.columns,
          width < 900 && { flexDirection: "column", gap: 16 },
        ]}
      >
        {width < 900 && progressPanel}
        <View style={[styles.story, width < 400 && { padding: 18, gap: 22 }]}>
          {started ? (
            node.isEnding ? (
              <EndingScreen
                key={node.id + state.run}
                node={node}
                state={state}
              />
            ) : (
              <>
                <StoryDisplay node={node} transitioning={pending !== null} />
                <View style={styles.divider} />
                <StoryChoices
                  choices={node.choices}
                  pending={pending}
                  onChoose={choose}
                />
              </>
            )
          ) : (
            <View style={{ gap: 24 }}>
              <StoryArtwork node={node} />
              <Text style={styles.eyebrow}>
                MỘT CÂU CHUYỆN DO BẠN VIẾT TIẾP
              </Text>
              <Text
                accessibilityRole="header"
                style={[
                  styles.welcome,
                  width < 400 && { fontSize: 30, lineHeight: 41 },
                ]}
              >
                Có những lối đi{"\n"}chỉ bạn mới tìm thấy.
              </Text>
              <Text style={styles.intro}>
                Một chiếc la bàn kỳ lạ. Một khu rừng giữ những ký ức. Và một
                hành trình mà mỗi quyết định đều thay đổi điều đang chờ phía
                trước.
              </Text>
              <View style={{ alignSelf: "flex-start", minWidth: 210 }}>
                <Action label="Bắt đầu hành trình →" onPress={start} />
              </View>
              <Text style={styles.meta}>
                20 TÌNH HUỐNG / 4 KẾT THÚC / MỘT LỰA CHỌN CỦA BẠN
              </Text>
            </View>
          )}
          <GameControls onRestart={restart} started={started} />
        </View>
        <View style={[styles.sidebar, width < 900 && { width: "100%" }]}>
          {width >= 900 && progressPanel}
          <StoryHistory
            key={state.run}
            history={state.history}
            complete={!!node.isEnding}
          />
        </View>
      </View>
    </LabScreen>
  );
}
const styles = StyleSheet.create({
  columns: { flexDirection: "row", gap: 26, alignItems: "flex-start" },
  story: {
    flex: 1,
    minWidth: 0,
    gap: 28,
    padding: 24,
    backgroundColor: "#081E18E8",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#7B987044",
  },
  sidebar: { width: 300, gap: 20 },
  progress: {
    padding: 22,
    backgroundColor: "#0C211DEE",
    borderWidth: 1,
    borderColor: "#6B867044",
    borderRadius: 20,
  },
  divider: { height: 1, backgroundColor: "#8AA17B33" },
  eyebrow: {
    color: "#D3B786",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    lineHeight: 19,
  },
  welcome: {
    color: "#F6EFD9",
    fontFamily: "serif",
    fontSize: 38,
    lineHeight: 50,
  },
  intro: { color: "#C3D4C7", fontSize: 16, lineHeight: 29, maxWidth: 480 },
  meta: { color: "#B6C3A4", fontSize: 9, lineHeight: 19, letterSpacing: 1.1 },
});
