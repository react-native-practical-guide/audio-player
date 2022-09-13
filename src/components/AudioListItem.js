import React from "react";
import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import { Entypo } from "@expo/vector-icons";

import { colors } from "../misc";
import { constStyles } from "../styles";
import { convertTime } from "../misc/helper";

const getThumbnailText = (filename) => filename[0];

const renderPlayPauseIcon = (isPlaying) => {
  if (!isPlaying)
    return <Entypo name="controller-play" size={24} color="black" />;
  else
    return (
      <Entypo name="controller-paus" size={24} color={colors.ACTIVE_FONT} />
    );
};

const AudioListItem = ({
  title,
  duration,
  onOptionPress,
  onAudioPress,
  isPlaying,
  activeListItem,
}) => {
  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onAudioPress}>
          <View style={styles.leftContainer}>
            <View
              style={[
                styles.thumbnail,
                {
                  backgroundColor: activeListItem
                    ? colors.ACTIVE_BG
                    : colors.FONT_LIGHT,
                },
              ]}>
              <Text style={styles.thumbnailText}>
                {activeListItem
                  ? renderPlayPauseIcon(isPlaying)
                  : getThumbnailText(title)}
              </Text>
            </View>
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} stlye={styles.title}>
                {title}
              </Text>
              <Text style={styles.timeText}>{convertTime(duration)}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.rightContainer}>
          <Entypo
            name="dots-three-vertical"
            size={20}
            color={colors.FONT_MEDIUM}
            style={{ padding: 10 }}
            onPress={onOptionPress}
          />
        </View>
      </View>
      <View style={styles.seperator} />
    </>
  );
};

export default AudioListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    width: constStyles.width - 80,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightContainer: {
    flexBasis: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  seperator: {
    width: constStyles.width - 80,
    backgroundColor: "#333",
    opacity: 0.3,
    height: 0.5,
    alignSelf: "center",
    marginTop: 10,
  },
  thumbnail: {
    height: 50,
    backgroundColor: colors.FONT_LIGHT,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  thumbnailText: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.FONT,
  },
  timeText: {
    fontSize: 14,
    color: colors.FONT_LIGHT,
  },
  titleContainer: {
    width: constStyles.width - 180,
    paddingLeft: 10,
  },
  title: {
    color: colors.FONT,
  },
});
