import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { AudioContext } from "../context/AudioProvider";
import { PlayerButton, Screen } from "../components";
import { colors } from "../misc";
import Slider from "@react-native-community/slider";
import { constStyles } from "../styles";
import { pause, play, resume } from "../misc/audioController";
import { Audio } from "expo-av";

const Player = () => {
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration } = context;

  const calculateSearchBar = () => {
    if (playbackPosition !== null && playbackDuration !== null)
      return playbackPosition / playbackDuration;
    else return 0;
  };

  useEffect(() => {
    context.loadPreviousAudio();
  }, []);

  const handlePlayPause = async () => {
    // play
    if (!context.soundObj) {
      // const playBackObj = new Audio.Sound();
      const audio = context.currentAudio;
      const status = await play(context.playBackObj, audio.uri);
      return context.updateState(context, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: context.currentAudioIndex,
      });
    }
    // pause
    if (context.soundObj.isLoaded && context.soundObj.isPlaying) {
      const status = await pause(context.playBackObj);
      return context.updateState(this.state, {
        soundObj: status,
        isPlaying: false,
      });
    }

    // resume
    if (context.soundObj.isLoaded && !context.soundObj.isPlaying) {
      const status = await resume(context.playBackObj);
      return context.updateState(this.state, {
        soundObj: status,
        isPlaying: true,
      });
    }
  };

  if (!context.currentAudio) return null;
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.audioCount}>
          {` ${context.currentAudioIndex + 1} / ${context.totalAudioCount}`}
        </Text>
        <View style={styles.midBannerContainer}>
          <MaterialCommunityIcons
            name="music-circle"
            size={300}
            color={context.isPlaying ? colors.ACTIVE_BG : colors.FONT_MEDIUM}
          />
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={1} style={styles.audioTitle}>
            {context.currentAudio.filename}
          </Text>
          <Slider
            style={{ width: constStyles.width, height: 40 }}
            value={calculateSearchBar()}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={colors.FONT_MEDIUM}
            maximumTrackTintColor={colors.ACTIVE_BG}
          />
          <View style={styles.audioControllers}>
            <PlayerButton iconType="PREV" />
            <PlayerButton
              onPress={handlePlayPause}
              style={{ marginHorizontal: 25 }}
              iconType={context.isPlaying ? "PLAY" : "PAUSE"}
            />
            <PlayerButton iconType="NEXT" />
          </View>
        </View>
      </View>
    </Screen>
  );
};

export default Player;

const styles = StyleSheet.create({
  audioControllers: {
    width: constStyles.width,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  audioCount: {
    textAlign: "center",
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
