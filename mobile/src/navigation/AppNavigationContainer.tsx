import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationProp,
  NavigationContainer as RNNavigationContainer,
} from "@react-navigation/native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { HostScreen } from "src/screens/Host";
import { SettingsScreen } from "src/screens/Settings";
import { HostIcon, SettingsIcon } from "src/components/icons";

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};

export type HomeScreenProps = NavigationProp<RootStackParamList>;
export type SettingsScreenProps = NavigationProp<
  RootStackParamList,
  "Settings"
>;

const Tab = createBottomTabNavigator<RootStackParamList>();

export const AppNavigationContainer = () => {
  return (
    <RNNavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelPosition: "beside-icon",
          headerStyle: {
            backgroundColor: "#1E1523",
            shadowColor: "#8457AA",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: "#ECD9FA",
          },
          tabBarStyle: {
            backgroundColor: "#1E1523",
            shadowColor: "#8457AA",
          },
          tabBarLabelStyle: {
            color: "#ECD9FA",
          },
          tabBarActiveBackgroundColor: "#48295C",
        }}
        backBehavior="firstRoute"
      >
        <Tab.Screen
          options={{
            tabBarIcon: HostIcon,
          }}
          name="Home"
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
