import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer as RNNavigationContainer } from "@react-navigation/native";

import { HostScreen } from "src/screens/Host";
import { SettingsScreen } from "src/screens/Settings";
import { HostIcon, SettingsIcon } from "src/components/icons";

const Tab = createBottomTabNavigator();

export const AppNavigationContainer = () => {
  return (
    <RNNavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelPosition: "beside-icon",
        }}
        backBehavior="firstRoute"
      >
        <Tab.Screen
          options={{
            tabBarIcon: HostIcon,
          }}
          name="Host"
          component={HostScreen}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: SettingsIcon,
          }}
        />
      </Tab.Navigator>
    </RNNavigationContainer>
  );
};
