import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlaylistScreen from './src/screens/PlaylistScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import HomeScreen from './src/screens/HomeScreen';
import HelpScreen from './src/screens/HelpScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: { backgroundColor: '#0b1220' },
                    headerTintColor: '#fff'
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Pocket Playlist' }} />
                <Stack.Screen name="Playlist" component={PlaylistScreen} options={{ title: 'Playlist' }} />
                <Stack.Screen name="Player" component={PlayerScreen} options={{ title: 'Player' }} />
                <Stack.Screen name="Help" component={HelpScreen} options={{ title: 'Help' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
