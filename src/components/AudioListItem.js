import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../misc";
import { constStyles } from "../styles";

const getThumbnailText = (filename) => filename[0];

const convertTime = (minutes) => {
  if (minutes) {
    const hrs = minutes / 60;
    const minute = hrs.toString().split(".")[0];
    const percent = parseInt(hrs.toString().split(".")[1].slice(0, 2));
    const sec = Math.ceil((60 * percent) / 100);

    if (parseInt(minute) < 10 && sec < 10) {
      return `0${minute}:0${sec}`;
    }

    if (parseInt(minute) < 10) {
      return `0${minute}:${sec}`;
    }

    if (sec < 10) {
      return `${minute}:0${sec}`;
    }

    return `${minute}:${sec}`;
  }
};

const AudioListItem = ({ title, duration, onOptionPress, onAudioPress }) => {
  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onAudioPress}>
          <View style={styles.leftContainer}>
            <View style={styles.thumbnail}>
              <Text style={styles.thumbnailText}>
                {getThumbnailText(title)}
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
