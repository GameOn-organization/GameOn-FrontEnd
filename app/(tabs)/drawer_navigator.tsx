import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import profile from './profile'; // Assumindo que Profile.tsx está no mesmo nível
import settings from './settings'; // Importa a nova tela de configurações

// Definir os tipos para as rotas do Drawer
export type RootDrawerParamList = {
  Profile: undefined;
  Settings: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function AppDrawerNavigator() {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerPosition: 'left',
            }}
        >
            <Drawer.Screen name="Profile" component={profile} />
            <Drawer.Screen name="Settings" component={settings} />
        </Drawer.Navigator>
    );
}
