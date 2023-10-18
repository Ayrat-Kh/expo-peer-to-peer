import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  type NavigationProp,
  NavigationContainer as RNNavigationContainer,
} from '@react-navigation/native';

import { ConnectScreen } from 'src/screens/Connect';
import { HostScreen } from 'src/screens/Host';
import { SettingsScreen } from 'src/screens/Settings';
import { ConnectIcon, HostIcon, SettingsIcon } from 'src/components/icons';
import { HeaderBar } from 'src/screens/shared/Navigation/Header';
import {
  TabBarLabel,
  TabBarButton,
} from 'src/screens/shared/Navigation/TabBar';

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Connect: undefined;
};

export type HomeScreenProps = NavigationProp<RootStackParamList>;
export type SettingsScreenProps = NavigationProp<
  RootStackParamList,
  'Settings'
>;

const Tab = createBottomTabNavigator<RootStackParamList>();

export const AppNavigationContainer = () => {
  return (
    <RNNavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelPosition: 'beside-icon',
          header: HeaderBar,
          tabBarButton: TabBarButton,
          tabBarLabel: TabBarLabel,
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
          name="Connect"
          component={ConnectScreen}
          options={{
            tabBarIcon: ConnectIcon,
          }}
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
