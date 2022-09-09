// play audio
const play = async (playBackObj, uri) => {
  try {
    return await playBackObj.loadAsync({ uri }, { shouldPlay: true });
  } catch (error) {
    console.log("Error in play func", error.message);
  }
};

// pause audio
const pause = async (playBackObj) => {
  try {
    return await playBackObj.setStatusAsync({ shouldPlay: false });
  } catch (error) {
    console.log("Error in pause func", error.message);
  }
};

// resume audio
const resume = async (playBackObj) => {
  try {
    return await playBackObj.playAsync();
  } catch (error) {
    console.log("Error in resume func", error.message);
  }
};

// select another audio

export { play, pause, resume };
