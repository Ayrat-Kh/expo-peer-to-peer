import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer as RNNavigationContainer } from "@react-navigation/native";
import { HostScreen } from "src/screens/Host";
import { HostIcon } from "src/components/icons";
import { ConnectIcon } from "src/components/icons/Connect";

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
          name="Client"
          component={View}
          options={{
            tabBarIcon: ConnectIcon,
          }}
        />
      </Tab.Navigator>
    </RNNavigationContainer>
  );
};
