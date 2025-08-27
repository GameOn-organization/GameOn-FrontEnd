import { Icon } from 'react-native-paper';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              size={28}
              source="home"
              color={focused ? 'black' : 'gray'} />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Notificações',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              size={28}
              source="bell"
              color={focused ? 'black' : 'gray'} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Comunidade',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              size={28}
              source="human-greeting"
              color={focused ? 'black' : 'gray'} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Eventos',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              size={28}
              source="calendar-alert"
              color={focused ? 'black' : 'gray'} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              size={28}
              source="account"
              color={focused ? 'black' : 'gray'} />
          ),
        }}
      />
    </Tabs>
  );
}
