import { NavigationContainer } from "@react-navigation/native";
import AudioProvider from "./src/context/AudioProvider";
import MainNavigator from "./src/routes/MainNavigator";

const App = () => {
  return (
    <AudioProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </AudioProvider>
  );
};

export default App;
