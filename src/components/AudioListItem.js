import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import { color } from "../misc";
import { constStyles } from "../styles";

const AudioListItem = () => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <View style={styles.thumbnail}>
            <Text style={styles.thumbnailText}>A</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} stlye={styles.title}>
              This is a very very long title text. This is a very very long
              title text.
            </Text>
            <Text style={styles.timeText}>03:59</Text>
          </View>
        </View>
        <View style={styles.rightContainer}>
          <Entypo
            name="dots-three-vertical"
            size={20}
            color={color.FONT_MEDIUM}
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
    backgroundColor: color.FONT_LIGHT,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  thumbnailText: {
    fontSize: 22,
    fontWeight: "bold",
    color: color.FONT,
  },
  timeText: {
    fontSize: 14,
    color: color.FONT_LIGHT,
  },
  titleContainer: {
    width: constStyles.width - 180,
    paddingLeft: 10,
  },
  title: {
    color: color.FONT,
  },
});
