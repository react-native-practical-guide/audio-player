import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { AudioListItem } from "./src/components";
import AudioProvider from "./src/context/AudioProvider";
import { colors } from "./src/misc";
import MainNavigator from "./src/routes/MainNavigator";

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.APP_BG,
  },
};

const App = () => {
  return (
    <AudioProvider>
      <NavigationContainer theme={customTheme}>
        <MainNavigator />
      </NavigationContainer>
    </AudioProvider>
  );
};

export default App;
