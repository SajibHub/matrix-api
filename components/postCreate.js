import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

// Placeholder for profile data
const demoProfileData = {
  profile: 'https://example.com/profile.jpg',
};

const AddPost = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const textInputRef = useRef(null);

  // Simulate profile data loading
  useEffect(() => {
    setTimeout(() => {
      setLoadingProfile(false);
    }, 1000);
  }, []);

  // Handle image upload using Expo ImagePicker
  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Toast.show({
        type: 'error',
        text1: 'Permission to access gallery was denied',
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Simulate post creation (replace with actual API call)
  const createPost = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setText('');
      setImage(null);
      Toast.show({
        type: 'success',
        text1: 'Post Created Successfully!',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Post Creation Failed!',
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.header}>
          <View style={styles.profileSkeleton} />
          <TextInput
            placeholder="What's on your mind?"
            style={styles.textInputSkeleton}
            editable={false}
          />
        </View>
        <View style={styles.imageSkeleton} />
        <View style={styles.actions}>
          <View style={styles.iconSkeleton} />
          <View style={styles.iconSkeleton} />
          <TouchableOpacity style={styles.postButtonSkeleton}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Main component
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          {loadingProfile ? (
            <View style={styles.profileSkeleton} />
          ) : (
            <Image
              source={{ uri: demoProfileData.profile }}
              style={styles.profileImage}
            />
          )}
        </View>
        <TextInput
          ref={textInputRef}
          value={text}
          onChangeText={setText}
          placeholder="What's on your mind?"
          style={styles.textInput}
          multiline
          maxLength={500}
        />
      </View>

      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.uploadedImage} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImage(null)}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleImageUpload}>
          <Ionicons name="image-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.postButton}
          onPress={createPost}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Makes the container take up the full screen height
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingContainer: {
    flex: 1, // Full screen for loading state too
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
  },
  profileContainer: {
    marginRight: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  profileSkeleton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 10,
    textAlignVertical: 'top',
  },
  textInputSkeleton: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    backgroundColor: '#ddd',
  },
  imageContainer: {
    marginTop: 15,
    position: 'relative',
  },
  uploadedImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  imageSkeleton: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    backgroundColor: '#ddd',
    marginTop: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  iconSkeleton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ddd',
  },
  postButton: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  postButtonSkeleton: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddPost;