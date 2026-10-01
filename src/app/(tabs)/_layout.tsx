import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

export default function TabLayout() {
  const { role, t } = useApp();

  const isOfficer = role === 'officer';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Theme.colors.primaryDark,
        tabBarInactiveTintColor: Theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: Theme.colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: isOfficer ? 'Dashboard' : t('tabsHome'),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name={isOfficer ? 'dashboard' : 'agriculture'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="silage"
        options={{
          title: isOfficer ? 'Alerts' : t('tabsSilage'),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name={isOfficer ? 'notifications-active' : 'inventory-2'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="storage"
        options={{
          title: t('tabsStorage'),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="warehouse" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: isOfficer ? 'Batch Ledger' : t('tabsHistory'),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: isOfficer ? 'Settings' : t('tabsMore'),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name={isOfficer ? 'settings' : 'grid-view'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
