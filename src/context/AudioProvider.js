import { Alert } from "react-native";
import React, { Component, createContext } from "react";
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";

export const AudioContext = createContext();

export default class AudioProvider extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      audioFiles: [],
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      permissionError: false,
      playBackObj: null,
      soundObj: null,
      currentAudio: {},
      isPlaying: false,
      currentAudioIndex: null,
      playbackPosition: null,
      playbackDuration: null,
    };
    this.totalAudioCount = 9;
  }

  permissionAllert = () => {
    Alert.alert("Permission required", "This app needs to read audio files", [
      { text: "OK", onPress: () => this.getPermission() },
      { text: "Cancel", onPress: () => this.permissionAllert() },
    ]);
  };

  getAudioFiles = async () => {
    /* The tutorial does not use the getAlbumAsync! */
    const getMedia = await MediaLibrary.getAlbumAsync("Lessons");
    let media = await MediaLibrary.getAssetsAsync({ mediaType: "audio" });
    media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      // first: 2,
      album: getMedia,
      first: media.totalCount,
    });
    this.totalAudioCount = media.totalCount;

    this.setState({
      ...this.state,
      dataProvider: this.state.dataProvider.cloneWithRows([
        ...this.state.audioFiles,
        ...media.assets,
      ]),
      audioFiles: [...this.state.audioFiles, ...media.assets],
    });
    // console.log(media.assets.length);
  };

  loadPreviousAudio = async () => {
    let previousAudio = await AsyncStorage.getItem("previousAudio");
    let currentAudio;
    let currentAudioIndex;

    if (!previousAudio) {
      currentAudio = this.state.audioFiles[0];
      currentAudioIndex = 0;
    } else {
      previousAudio = JSON.parse(previousAudio);
      currentAudio = previousAudio.audio;
      currentAudioIndex = previousAudio.index;
    }

    this.setState({ ...this.state, currentAudio, currentAudioIndex });
  };

  getPermission = async () => {
    const permission = await MediaLibrary.getPermissionsAsync();

    if (permission.granted) {
      // get all audio files
      this.getAudioFiles();
    }

    if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();

      if (status === "denied" && canAskAgain) {
        // display an alert that user must allow this permission
        this.permissionAllert();
      }

      if (status === "granted") {
        // get all audio files
        this.getAudioFiles();
      }

      if (status === "denied" && !canAskAgain) {
        // display error
        this.setState({ ...this.state, permissionError: true });
      }
    }
  };

  componentDidMount() {
    this.getPermission();
    if (!this.state.playBackObj)
      this.setState({ ...this.state, playBackObj: new Audio.Sound() });
  }

  updateState = (prevState, newState = {}) => {
    this.setState({ ...prevState, ...newState });
  };

  render() {
    const {
      audioFiles,
      dataProvider,
      permissionError,
      playBackObj,
      soundObj,
      currentAudio,
      isPlaying,
      currentAudioIndex,
      playbackPosition,
      playbackDuration,
    } = this.state;

    if (permissionError)
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Text style={{ fontSize: 25, textAlign: "center", color: "red" }}>
            It looks like you haven't accept the permission.
          </Text>
        </View>
      );

    return (
      <AudioContext.Provider
        value={{
          audioFiles,
          dataProvider,
          playBackObj,
          soundObj,
          currentAudio,
          updateState: this.updateState,
          isPlaying,
          currentAudioIndex,
          totalAudioCount: this.totalAudioCount,
          playbackPosition,
          playbackDuration,
          loadPreviousAudio: this.loadPreviousAudio,
        }}>
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}
