import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import { AudioList, Player, PlayList, PlayListDetail } from "../screens";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PlayListScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlayList" component={PlayList} />
      <Stack.Screen name="PlayListDetail" component={PlayListDetail} />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="AudioList"
        component={AudioList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="headset-sharp" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Player"
        component={Player}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="compact-disc" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PlayListNavigator"
        component={PlayListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="library-music" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
