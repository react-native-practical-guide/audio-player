import { StyleSheet, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../misc";

const PlayerButton = ({
  iconColor = colors.FONT,
  iconType,
  size = 40,
  onPress,
  ...otherProps
}) => {
  const getIconName = (type) => {
    switch (type) {
      case "PLAY":
        return "pausecircle";
      case "PAUSE":
        return "playcircle";
      case "NEXT":
        return "forward";
      case "PREV":
        return "banckward";
      default:
        break;
    }
  };

  return (
    <AntDesign
      name={getIconName(iconType)}
      size={size}
      color={iconColor}
      onPress={onPress}
      {...otherProps}
    />
  );
};

export default PlayerButton;
