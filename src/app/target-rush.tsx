import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useReducer, useState } from "react";
import {
  AppState,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import {
  Action,
  Card,
  LabScreen,
  Label,
  Metric,
  Notice,
  ui,
  useLabTheme,
} from "@/components/lab-ui";
import { drawItem, gameReducer, initialGame, itemPosition } from "@/utils/game";

export default function TargetScreen() {
  const t = useLabTheme();
  const [game, dispatch] = useReducer(gameReducer, initialGame);
  const [area, setArea] = useState({ width: 0, height: 0 });
  const window = useWindowDimensions();
  const playing = game.phase === "playing";
  useFocusEffect(useCallback(() => () => dispatch({ type: "pause" }), []));
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") dispatch({ type: "pause" });
    });
    return () => sub.remove();
  }, []);
  useEffect(() => {
    if (!playing) return;
    let last = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      dispatch({ type: "tick", elapsed: now - last });
      last = now;
    }, 100);
    return () => clearInterval(timer);
  }, [playing]);
  useEffect(() => {
    if (!playing || game.item) return;
    const timer = setTimeout(
      () => dispatch({ type: "spawn", item: drawItem(game.round) }),
      200,
    );
    return () => clearTimeout(timer);
  }, [playing, game.round, game.item]);
  useEffect(() => {
    if (!playing || game.item?.kind !== "bomb") return;
    const id = game.item.id;
    const timer = setTimeout(() => dispatch({ type: "skip", id }), 1300);
    return () => clearTimeout(timer);
  }, [playing, game.item]);
  if (game.phase === "ready" || game.phase === "finished")
    return (
      <LabScreen
        title="Target Rush"
        subtitle="Tập trung. Chạm đúng. Phá kỷ lục."
      >
        <Card style={ui.center}>
          <Text style={{ fontSize: 58 }}>
            {game.phase === "finished" ? "🏆" : "🎯"}
          </Text>
          <Text style={[ui.heading, { color: t.text }]}>
            {game.phase === "finished"
              ? "Một lượt chơi thật tuyệt."
              : "Nhanh tay, tinh mắt."}
          </Text>
          {game.phase === "finished" ? (
            <>
              <View style={ui.row}>
                <Metric label="Điểm số" value={game.score} />
                <Metric label="Combo tốt nhất" value={game.best} />
              </View>
              <Notice>Bạn có thể thử lại để phá kỷ lục của chính mình.</Notice>
            </>
          ) : (
            <>
              <Notice>
                30 giây · 3 mạng · Mục tiêu +1 · Đồng xu +3. Combo từ 5 giúp mục
                tiêu được +2 điểm. Tránh bom và đừng chạm hụt nhé!
              </Notice>
              <Label>CHẠM MỤC TIÊU, BỎ QUA BOM</Label>
            </>
          )}
        </Card>
        <Action
          label={game.phase === "finished" ? "Chơi lại ↻" : "Bắt đầu chơi →"}
          onPress={() => dispatch({ type: "start" })}
        />
      </LabScreen>
    );
  const item = game.item;
  const size = Math.min(
    Math.max(48, 76 - game.combo * 2),
    area.width || 76,
    area.height || 76,
  );
  return (
    <LabScreen subtitle="Chạm mục tiêu. Giữ nhịp. Tránh bom.">
      <Card style={{ padding: 14 }}>
        <View style={ui.row}>
          <Metric label="Điểm" value={game.score} />
          <Metric
            label="Giây còn lại"
            value={Math.ceil(game.remaining / 1000)}
          />
          <Metric label="Combo" value={"×" + game.combo} />
        </View>
        <Text
          style={{ textAlign: "center", color: t.danger, fontWeight: "700" }}
        >
          Mạng {game.lives} / 3
        </Text>
      </Card>
      <View
        onLayout={(event) =>
          setArea({
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
          })
        }
        style={{
          height: Math.max(240, Math.min(430, window.height * 0.45)),
          width: "100%",
          backgroundColor: t.soft,
          borderRadius: 24,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: t.border,
        }}
      >
        {playing && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Vùng trống trong sân chơi"
            style={StyleSheet.absoluteFill}
            onPress={() => dispatch({ type: "miss" })}
          />
        )}
        {playing && item && area.width > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              item.kind === "bomb"
                ? "Bom, hãy tránh"
                : item.kind === "coin"
                  ? "Đồng xu, cộng ba điểm"
                  : "Mục tiêu"
            }
            onPress={() => dispatch({ type: "hit", id: item.id })}
            style={{
              position: "absolute",
              ...itemPosition(item, area.width, area.height, size),
              width: size,
              height: size,
              borderRadius: size / 2,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                item.kind === "bomb"
                  ? "#202738"
                  : item.kind === "coin"
                    ? "#DDB34E"
                    : t.solid,
            }}
          >
            <Text style={{ fontSize: size * 0.45 }}>
              {item.kind === "bomb" ? "💣" : item.kind === "coin" ? "🪙" : "🎯"}
            </Text>
          </Pressable>
        )}
        {game.phase === "paused" && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                gap: 16,
              },
            ]}
          >
            <Text style={[ui.heading, { color: t.text }]}>Nghỉ một nhịp.</Text>
            <Notice>Thời gian đang được tạm dừng.</Notice>
            <Action
              label="Tiếp tục chơi →"
              onPress={() => dispatch({ type: "resume" })}
            />
          </View>
        )}
      </View>
      <Notice>
        {item?.kind === "bomb"
          ? "Đợi bom biến mất. Đừng chạm vào bom!"
          : item?.kind === "coin"
            ? "Chạm đồng xu để nhận 3 điểm."
            : "Chạm vào mục tiêu để ghi điểm."}
      </Notice>
      <Action
        secondary
        label={playing ? "Tạm dừng" : "Chơi lại từ đầu"}
        onPress={() => dispatch({ type: playing ? "pause" : "start" })}
      />
    </LabScreen>
  );
}
