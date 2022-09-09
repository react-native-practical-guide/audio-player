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
import { play, pause, resume, playnext } from "../misc/audioController";
class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
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
    const { soundObj, playBackObj, currentAudio, updateState } = this.context;
    // playing audio for first time
    if (!soundObj) {
      const playBackObj = new Audio.Sound();
      const status = await play(playBackObj, audio.uri);

      return updateState(this.context, {
        currentAudio: audio,
        playBackObj,
        soundObj: status,
      });
    }

    // pause audio
    if (
      soundObj.isLoaded &&
      soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await pause(playBackObj);
      return updateState(this.state, { soundObj: status });
    }

    // resume audio
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await resume(playBackObj);
      return updateState(this.state, { soundObj: status });
    }

    // select another audio
    if (soundObj.isLoaded && currentAudio.id != audio.id) {
      console.log("play next");
      const status = await playnext(playBackObj, audio.uri);
      return updateState(this.context, {
        currentAudio: audio,
        playBackObj,
        soundObj: status,
      });
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
