import {
  ScrollView,
  ScrollViewComponent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import default_styles from "../styles/default_styles";
import React, { Component } from "react";
import { AudioContext } from "../context/AudioProvider";

class AudioList extends Component {
  static contextType = AudioContext;

  render() {
    return (
      <ScrollView>
        {this.context.audioFiles.map((item) => (
          <Text style={styles.filename} key={item.id}>
            {item.filename}
          </Text>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  filename: {
    padding: 10,
    borderBottomColor: "red",
    borderBottomWidth: 2,
  },
});

export default AudioList;
