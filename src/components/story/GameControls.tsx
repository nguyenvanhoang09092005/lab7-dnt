import { View } from "react-native";
import { Action } from "@/components/lab-ui";
export function GameControls({
  onRestart,
  started,
}: {
  onRestart: () => void;
  started: boolean;
}) {
  return started ? (
    <View style={{ alignSelf: "flex-start" }}>
      <Action label="↻  Chơi lại từ đầu" secondary onPress={onRestart} />
    </View>
  ) : null;
}
