import React, { Component } from "react";
import {
  ScrollView,
  ScrollViewComponent,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";

import { AudioContext } from "../context/AudioProvider";
import { constStyles, default_styles } from "../styles";
import { AudioListItem, Screen, OptionModal } from "../components";
import { Audio } from "expo-av";
import {
  play,
  pause,
  resume,
  playNext,
  selectAudio,
} from "../misc/audioController";
import { storeAudioForNextOpening } from "../misc/helper";
import AsyncStorage from "@react-native-async-storage/async-storage";
class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
    };

    this.currentItem = {};
  }

  componentDidMount() {
    this.context.loadPreviousAudio();
  }

  layoutProvider = new LayoutProvider(
    (i) => "audio",
    (type, dim) => {
      switch (type) {
        case "audio":
          dim.width = constStyles.width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
          break;
      }
    }
  );

  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.filename}
        isPlaying={extendedState.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
        duration={item.duration}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
        onAudioPress={async () => {
          await selectAudio(item, this.context);
        }}
      />
    );
  };

  navigateToPlaylist = () => {
    this.context.updateState(this.context, {
      addToPlayList: this.currentItem,
    });
    this.props.navigation.navigate("PlayListNavigator");
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying }) => {
          if (!dataProvider._data.length) return null;

          return (
            <Screen>
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }}
              />
              <OptionModal
                onPlayPress={() => console.log("Playig audio")}
                // onPlayListPress={() => {
                //   this.context.updateState(this.context, {
                //     addToPlayList: this.currentItem,
                //   });
                //   this.props.navigation.navigate("PlayList");
                // }}
                onPlayListPress={() => {
                  this.context.updateState(this.context, {
                    addToPlayList: this.currentItem,
                  });
                  this.props.navigation.navigate("PlayListNavigator");
                }}
                options={[
                  {
                    title: "Add to playlist",
                    onPress: this.navigateToPlaylist,
                  },
                ]}
                currentItem={this.currentItem}
                onClose={() =>
                  this.setState({ ...this.state, optionModalVisible: false })
                }
                visible={this.state.optionModalVisible}
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
