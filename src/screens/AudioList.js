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
class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
      playBackObj: null,
      soundObj: null,
      currentAudio: {},
    };

    this.currentItem = {};
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

  handleAudioPress = async (audio) => {
    const { currentAudio, soundObj, playBackObj } = this.state;
    // playing audio for first time
    if (!soundObj) {
      const playBackObj = new Audio.Sound();
      const status = await playBackObj.loadAsync(
        { uri: audio.uri },
        { shouldPlay: true }
      );

      return this.setState({
        ...this.state,
        currentAudio: audio,
        playBackObj,
        soundObj: status,
      });
    }

    // pause audio
    if (soundObj.isLoaded && soundObj.isPlaying) {
      const status = await playBackObj.setStatusAsync({ shouldPlay: false });
      return this.setState({ ...this.state, soundObj: status });
    }

    // resume audio
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await playBackObj.playAsync();
      return this.setState({ ...this.state, soundObj: status });
    }
  };

  rowRenderer = (type, item) => {
    return (
      <AudioListItem
        title={item.filename}
        duration={item.duration}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
        onAudioPress={() => this.handleAudioPress(item)}
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
              <OptionModal
                onPlayPress={() => console.log("Playig audio")}
                // onPlayListPress={() => {
                //   this.context.updateState(this.context, {
                //     addToPlayList: this.currentItem,
                //   });
                //   this.props.navigation.navigate("PlayList");
                // }}
                // options={[
                //   {
                //     title: "Add to playlist",
                //     onPress: this.navigateToPlaylist,
                //   },
                // ]}
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
