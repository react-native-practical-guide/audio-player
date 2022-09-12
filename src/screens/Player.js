import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { AudioContext } from "../context/AudioProvider";
import { PlayerButton, Screen } from "../components";
import { colors } from "../misc";
import Slider from "@react-native-community/slider";
import { constStyles } from "../styles";
import { pause, play, playNext, resume } from "../misc/audioController";
import { Audio } from "expo-av";
import { storeAudioForNextOpening } from "../misc/helper";

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
    if (context.soundObj === null) {
      const audio = context.currentAudio;
      const status = await play(context.playbackObj, audio.uri);
      context.playbackObj.setOnPlaybackStatusUpdate(
        context.onPlaybackStatusUpdate
      );
      context.playbackObj.setOnPlaybackStatusUpdate(
        context.onPlaybackStatusUpdate
      );
      return context.updateState(context, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: context.currentAudioIndex,
      });
    }

    // pause
    if (context.soundObj && context.soundObj.isPlaying) {
      const status = await pause(context.playbackObj);
      return context.updateState(context, {
        soundObj: status,
        isPlaying: false,
      });
    }
    // resume
    if (context.soundObj && !context.soundObj.isPlaying) {
      const status = await resume(context.playbackObj);
      return context.updateState(context, {
        soundObj: status,
        isPlaying: true,
      });
    }
  };

  const handleNext = async () => {
    const { isLoaded } = await context.playbackObj.getStatusAsync();
    const isLastAudio =
      context.currentAudioIndex + 1 === context.totalAudioCount;
    let audio = context.audioFiles[context.currentAudioIndex + 1];
    let index;
    let status;

    if (!isLoaded && !isLastAudio) {
      index = context.currentAudioIndex + 1;
      status = await play(context.playbackObj, audio.uri);
    }

    if (isLoaded && !isLastAudio) {
      index = context.currentAudioIndex + 1;
      status = await playNext(context.playbackObj, audio.uri);
    }

    if (isLastAudio) {
      index = 0;
      audio = context.audioFiles[index];
      if (isLoaded) {
        status = await playNext(context.playbackObj, audio.uri);
      } else {
        status = await play(context.playbackObj, audio.uri);
      }
    }

    context.updateState(context, {
      currentAudio: audio,
      playbackObj: context.playbackObj,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    storeAudioForNextOpening(audio, index);
  };

  const handlePrevious = async () => {
    const { isLoaded } = await context.playbackObj.getStatusAsync();
    const isLFirstAudio = context.currentAudioIndex === 0;
    let audio = context.audioFiles[context.currentAudioIndex - 1];
    let index;
    let status;

    if (!isLoaded && !isLFirstAudio) {
      index = context.currentAudioIndex - 1;
      status = await play(context.playbackObj, audio.uri);
    }

    if (isLoaded && !isLFirstAudio) {
      index = context.currentAudioIndex - 1;
      status = await playNext(context.playbackObj, audio.uri);
    }

    if (isLFirstAudio) {
      index = context.totalAudioCount - 1;
      audio = context.audioFiles[index];
      if (isLoaded) {
        status = await playNext(context.playbackObj, audio.uri);
      } else {
        status = await play(context.playbackObj, audio.uri);
      }
    }

    context.updateState(context, {
      currentAudio: audio,
      playbackObj: context.playbackObj,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    storeAudioForNextOpening(audio, index);
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
            <PlayerButton onPress={handlePrevious} iconType="PREV" />
            <PlayerButton
              onPress={handlePlayPause}
              style={{ marginHorizontal: 25 }}
              iconType={context.isPlaying ? "PLAY" : "PAUSE"}
            />
            <PlayerButton onPress={handleNext} iconType="NEXT" />
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
