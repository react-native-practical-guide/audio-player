import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";

import { AudioContext } from "../context/AudioProvider";
import { PlayerButton, Screen } from "../components";
import { colors } from "../misc";
import { constStyles } from "../styles";
import {
  pause,
  play,
  playNext,
  selectAudio,
  changeAudio,
  moveAudio,
} from "../misc/audioController";
import { storeAudioForNextOpening, convertTime } from "../misc/helper";

const Player = () => {
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration } = context;
  const [currentPosition, setCurrentPosition] = useState(0);

  useEffect(() => {
    context.loadPreviousAudio();
  }, []);

  const handlePlayPause = async () => {
    await selectAudio(context.currentAudio, context);
  };

  const handleNext = async () => {
    await changeAudio(context, "next");
  };

  const handlePrevious = async () => {
    await changeAudio(context, "previous");
  };

  const renderCurrentTime = () => {
    if (!context.soundObj && context.currentAudio.lastPosition) {
      return convertTime(context.currentAudio.lastPosition / 1000);
    }
    return convertTime(context.playbackPosition / 1000);
  };

  const calculateSlider = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }

    if (context.currentAudio.lastPosition) {
      return (
        context.currentAudio.lastPosition /
        (context.currentAudio.duration * 1000)
      );
    }

    return 0;
  };

  if (!context.currentAudio) return null;
  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.audioCountContainer}>
          <View style={{ flexDirection: "row" }}>
            {context.isPlayListRunning && (
              <>
                <Text style={{ fontWeight: "bold" }}>From Playlist: </Text>
                <Text>{context.activePlayList.title}</Text>
              </>
            )}
          </View>
          <Text style={styles.audioCount}>{`${
            context.currentAudioIndex + 1
          } / ${context.totalAudioCount}`}</Text>
        </View>
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 15,
            }}>
            <Text>
              {currentPosition ? currentPosition : renderCurrentTime()}
            </Text>
            <Text>{convertTime(context.currentAudio.duration)}</Text>
          </View>
          <Slider
            style={{ width: constStyles.width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSlider()}
            minimumTrackTintColor={colors.FONT_MEDIUM}
            maximumTrackTintColor={colors.ACTIVE_BG}
            onValueChange={(value) => {
              setCurrentPosition(
                convertTime(value * context.currentAudio.duration)
              );
            }}
            onSlidingStart={async () => {
              if (!context.isPlaying) return;

              try {
                await pause(context.playbackObj);
              } catch (error) {
                console.log("error inside onSlidingStart callback", error);
              }
            }}
            onSlidingComplete={async (value) => {
              await moveAudio(context, value);
              setCurrentPosition(0);
            }}
          />
          <View style={styles.audioControllers}>
            <PlayerButton iconType="PREV" onPress={handlePrevious} />
            <PlayerButton
              onPress={handlePlayPause}
              style={{ marginHorizontal: 25 }}
              iconType={context.isPlaying ? "PLAY" : "PAUSE"}
            />
            <PlayerButton iconType="NEXT" onPress={handleNext} />
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
  audioCountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  audioCount: {
    textAlign: "center",
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
  timeStampContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
});
