import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import { AudioListItem } from "./src/components";
import AudioProvider from "./src/context/AudioProvider";
import MainNavigator from "./src/routes/MainNavigator";

const App = () => {
  return (
    // <AudioProvider>
    //   <NavigationContainer>
    //     <MainNavigator />
    //   </NavigationContainer>
    // </AudioProvider>
    <View style={{ marginTop: 50 }}>
      <AudioListItem />
    </View>
  );
};

export default App;
