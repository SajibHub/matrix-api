import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MatrixSplash } from './pages/Splash.js';
import { LogIn } from './pages/LoginPage.js';
import { Provider } from 'react-redux';
import { store } from './redux/store.js'
import Register from './pages/Registration.js';
import Home from './pages/Home.js';



function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Splash"
        onPress={() => navigation.navigate('Splash')}
      />
    </View>
  );
}
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen options={{ headerShown: false }} name="Splash" component={MatrixSplash} />
          <Stack.Screen options={{ headerBackVisible: false }} name="Home" component={Home} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="Registration" component={Register} />
          <Stack.Screen name="Login" component={LogIn} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}