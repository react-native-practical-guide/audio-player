import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Screen } from "../components";
import { colors } from "../misc";
import Slider from "@react-native-community/slider";
import { constStyles } from "../styles";

const Player = () => {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.audioCount}>1 / 99</Text>
        <View style={styles.midBannerContainer}>
          <MaterialCommunityIcons
            name="music-circle"
            size={300}
            color={colors.ACTIVE_BG}
          />
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={1} style={styles.audioTitle}>
            audio file name
          </Text>
          <Slider
            style={{ width: constStyles.width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={colors.FONT_MEDIUM}
            maximumTrackTintColor={colors.ACTIVE_BG}
          />
        </View>
      </View>
    </Screen>
  );
};

export default Player;

const styles = StyleSheet.create({
  audioCount: {
    textAlign: "right",
    pading: 15,
    color: colors.FONT_LIGHT,
    fontSize: 14,
  },
  audioTitle: {
    fontSize: 16,
    color: colors.FONT,
    padding: 15,
  },
  container: {
    flex: 1,
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
