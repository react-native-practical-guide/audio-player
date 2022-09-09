import { StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../misc";

const Screen = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.APP_BG,
    /* StatusBar not working for iOS. Use expo-constants */
    paddingTop: StatusBar.currentHeight,
  },
});
