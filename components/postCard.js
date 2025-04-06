import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Platform,
  Share,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather, Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

// Demo data
const demoPosts = [
  {
    _id: '1',
    user: {
      _id: 'user1',
      fullName: 'John Doe',
      username: 'johndoe',
      profile: 'https://example.com/profile.jpg',
      verify: true,
    },
    caption: 'This is a demo post',
    images: ['https://example.com/image.jpg'],
    likes: 15,
    comment: 5,
    postSave: 3,
    time: '2h ago',
    isLike: false,
    isSave: false,
    myPost: true,
  },
  // Add more demo posts as needed
];

const PostCard = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params || {};

  const [posts, setPosts] = useState(demoPosts);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [loader, setLoader] = useState({ status: false, id: null });
  const [deletePostLoader, setDeletePostLoader] = useState({ status: false, id: null });

  const goToProfile = (isPost, username) => {
    navigation.navigate('Profile', { username: isPost ? 'me' : username });
  };

  const likePostHandler = async (id, isLike, likes) => {
    setLoader({ status: true, id });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === id 
          ? { ...post, isLike: !isLike, likes: isLike ? likes - 1 : likes + 1 }
          : post
      )
    );
    setLoader({ status: false, id: null });
  };

  const savePostHandler = async (id, isSave, postSave) => {
    setLoader({ status: true, id });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === id 
          ? { ...post, isSave: !isSave, postSave: isSave ? postSave - 1 : postSave + 1 }
          : post
      )
    );
    setLoader({ status: false, id: null });
  };

  const handleDelete = async () => {
    if (postToDelete) {
      setDeletePostLoader({ status: true, id: postToDelete._id });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postToDelete._id));
      setDeletePostLoader({ status: false, id: null });
      setIsModalOpen(false);
      Toast.show({ type: 'success', text1: 'Post deleted successfully' });
      setPostToDelete(null);
    }
  };

  const handleShare = async (id) => {
    try {
      const url = `https://yourapp.com/post/${id}`;
      await Share.share({
        message: url,
        title: 'Matrix Media Post',
      });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error sharing post' });
    }
  };

  const copyLink = async (id) => {
    const url = `https://yourapp.com/post/${id}`;
    await Clipboard.setStringAsync(url);
    Toast.show({ type: 'success', text1: 'Link copied to clipboard' });
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.profileContainer}
          onPress={() => goToProfile(item.myPost, item.user.username)}
        >
          <Image source={{ uri: item.user.profile }} style={styles.profileImage} />
          <View style={styles.onlineStatus} />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Text 
              style={styles.username}
              onPress={() => goToProfile(item.myPost, item.user.username)}
            >
              {item.user.fullName}
            </Text>
            {item.user.verify && <MaterialIcons name="verified" size={16} color="#1DA1F2" />}
          </View>
          <Text style={styles.time}>{item.time}</Text>
        </View>

        <TouchableOpacity onPress={() => setOpenMenuId(openMenuId === item._id ? null : item._id)}>
          <Feather name="more-vertical" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Menu */}
      {openMenuId === item._id && (
        <View style={styles.menu}>
          {item.myPost && (
            <>
              <TouchableOpacity style={styles.menuItem}>
                <Feather name="edit-2" size={20} color="#333" />
                <Text style={styles.menuText}>Edit Post</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setPostToDelete(item);
                  setIsModalOpen(true);
                  setOpenMenuId(null);
                }}
              >
                <AntDesign name="delete" size={20} color="#333" />
                <Text style={styles.menuText}>Delete Post</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => copyLink(item._id)}
          >
            <Feather name="link" size={20} color="#333" />
            <Text style={styles.menuText}>Copy Link</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleShare(item._id)}
          >
            <Feather name="share" size={20} color="#333" />
            <Text style={styles.menuText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => savePostHandler(item._id, item.isSave, item.postSave)}
          >
            {item.isSave ? (
              <Ionicons name="bookmark" size={20} color="#333" />
            ) : (
              <Ionicons name="bookmark-outline" size={20} color="#333" />
            )}
            <Text style={styles.menuText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      <Text style={styles.caption}>{item.caption}</Text>
      {item.images?.length > 0 && (
        <Image source={{ uri: item.images[0] }} style={styles.postImage} />
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionItem}
          onPress={() => likePostHandler(item._id, item.isLike, item.likes)}
        >
          {loader.status && loader.id === item._id ? (
            <ActivityIndicator size="small" color="#1DA1F2" />
          ) : (
            <AntDesign 
              name={item.isLike ? "like1" : "like2"} 
              size={20} 
              color={item.isLike ? "#1DA1F2" : "#333"} 
            />
          )}
          <Text style={[styles.actionText, item.isLike && styles.likedText]}>
            {item.likes} {item.isLike ? 'Liked' : 'Like'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Feather name="message-circle" size={20} color="#333" />
          <Text style={styles.actionText}>{item.comment} Comments</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionItem}
          onPress={() => handleShare(item._id)}
        >
          <Feather name="share" size={20} color="#333" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionItem}
          onPress={() => savePostHandler(item._id, item.isSave, item.postSave)}
        >
          {item.isSave ? (
            <Ionicons name="bookmark" size={20} color="#333" />
          ) : (
            <Ionicons name="bookmark-outline" size={20} color="#333" />
          )}
          <Text style={styles.actionText}>{item.postSave} Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <Modal
        visible={isModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Post?</Text>
            <Text style={styles.modalText}>This action cannot be undone.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setIsModalOpen(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={handleDelete}
                disabled={deletePostLoader.status}
              >
                {deletePostLoader.status ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1DA1F2" />
          </View>
        }
      />
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00FF00',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  menu: {
    position: 'absolute',
    right: 10,
    top: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    elevation: 5,
    zIndex: 100,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  menuText: {
    fontSize: 14,
    color: '#333',
  },
  caption: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
  },
  likedText: {
    color: '#1DA1F2',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: '#FF0000',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default PostCard;