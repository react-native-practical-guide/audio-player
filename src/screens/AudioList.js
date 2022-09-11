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

  onPlaybackStatusUpdate = async (playbackStatus) => {
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      this.context.updateState(this.context, {
        playbackPosition: playbackStatus.positionMillis,
        playbackDuration: playbackStatus.durationMillis,
      });
    }

    /* If there is no next audio */
    if (playbackStatus.didJustFinish) {
      const nextAudioIndex = this.context.currentAudioIndex + 1;
      if (nextAudioIndex >= this.context.totalAudioCount) {
        this.context.playBackObj.unloadAsync();
        return this.context.updateState(this.context, {
          soundObj: null,
          currentAudio: this.context.audioFiles[0],
          isPlaying: false,
          currentAudioIndex: 0,
          playbackPosition: null,
          playbackDuration: null,
        });
      }

      /* Else select next audio */
      const audio = this.context.audioFiles[nextAudioIndex];
      const status = await playnext(this.context.playBackObj, audio.uri);

      return this.context.updateState(this.context, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
      });
    }
  };

  handleAudioPress = async (audio) => {
    const { soundObj, playBackObj, currentAudio, updateState, audioFiles } =
      this.context;
    // playing audio for first time
    if (!soundObj) {
      const playBackObj = new Audio.Sound();
      const status = await play(playBackObj, audio.uri);

      const index = audioFiles.indexOf(audio);

      updateState(this.context, {
        currentAudio: audio,
        playBackObj,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      return playBackObj.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
    }

    // pause audio
    if (
      soundObj.isLoaded &&
      soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await pause(playBackObj);
      return updateState(this.state, { soundObj: status, isPlaying: false });
    }

    // resume audio
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await resume(playBackObj);
      return updateState(this.state, { soundObj: status, isPlaying: true });
    }

    // select another audio
    if (soundObj.isLoaded && currentAudio.id != audio.id) {
      console.log("play next");
      const status = await playnext(playBackObj, audio.uri);
      const index = audioFiles.indexOf(audio);
      return updateState(this.context, {
        currentAudio: audio,
        playBackObj,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
    }
  };

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
        onAudioPress={() => this.handleAudioPress(item)}
      />
    );
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying }) => {
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
