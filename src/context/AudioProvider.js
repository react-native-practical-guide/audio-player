import { Alert } from "react-native";
import React, { Component, createContext } from "react";
import * as MediaLibrary from "expo-media-library";

// const audioFiles: MediaLibrary.Asset[] = [];
// export const AudioContext = createContext(audioFiles);
export const AudioContext = createContext();

type Props = { children: any };
type State = { audioFiles: MediaLibrary.Asset[] };
// export default class AudioProvider extends Component<Props, State> {
export default class AudioProvider extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      audioFiles: [],
    };
  }

  permissionAllert = () => {
    Alert.alert("Permission required", "This app needs to read audio files", [
      { text: "OK", onPress: () => this.getPermission() },
      { text: "Cancel", onPress: () => this.permissionAllert() },
    ]);
  };

  getAudioFiles = async () => {
    const getMedia = await MediaLibrary.getAlbumAsync("Lessons");
    let media = await MediaLibrary.getAssetsAsync({ mediaType: "audio" });
    media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      // first: 2,
      album: getMedia,
      first: media.totalCount,
    });

    this.setState({ ...this.state, audioFiles: media.assets });
    console.log(media.assets.length);
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
      }
    }
  };

  componentDidMount() {
    this.getPermission();
  }

  render() {
    return (
      <AudioContext.Provider value={{ audioFiles: this.state.audioFiles }}>
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}
