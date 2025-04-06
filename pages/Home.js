import React, { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import PostCard from '../components/postCard.js';
import AddPost from '../components/postCreate.js';

const Home = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Check if screen is currently focused

  useEffect(() => {
    let timeoutId;

    // Function to handle navigation and app closure
    const handleTimeout = () => {
      if (!isFocused) {
        // Navigate back to Home if not on Home screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });

        setTimeout(() => {
          BackHandler.exitApp();
        }, 1000); // Wait 1 second after navigation
      }
    };

    // Set timeout for 2 hours (2 * 60 * 60 * 1000 = 7200000 milliseconds)
    if (isFocused) {
      timeoutId = setTimeout(handleTimeout, 7200000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isFocused, navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFocused) {
        Alert.alert(
          'Exit App',
          'Do you want to exit the app?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => BackHandler.exitApp(),
            },
          ]
        );
        return true; // Prevent default back action
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isFocused]);

  return (
    <>
    <AddPost/>
      <PostCard />
    </>
  );
};

export default Home;