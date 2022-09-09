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
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import { Dimensions } from "react-native";
import { constStyles } from "../styles";
import { AudioListItem, Screen } from "../components";
class AudioList extends Component {
  static contextType = AudioContext;

  layoutProvider = new LayoutProvider(
    (i) => "audio",
    (type, dim) => {
      switch (type) {
        case "audio":
          dim.width = Dimensions.get("window").width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
          break;
      }
    }
  );

  rowRenderer = (type, item) => {
    return (
      <AudioListItem
        title={item.filename}
        duration={item.duration}
        onOptionPress={() => console.log("press")}
      />
    );
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider }) => {
          return (
            <Screen>
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
              />
            </Screen>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  filename: {
    padding: 10,
    borderBottomColor: "red",
    borderBottomWidth: 2,
  },
  seperator: {
    width: constStyles.width - 80,
  },
});

export default AudioList;
