import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const chatListData = [
  { id: '1', name: 'Milano', message: 'tempor incididunt ut labore et dolore', time: '10:45', status: 'online', avatar: 'path/to/avatar1.png' },
  { id: '2', name: 'Samuel Ella', message: 'Lorem ipsum dolor sit amet', time: '11:00', status: 'offline', avatar: 'path/to/avatar2.png' },
  { id: '3', name: 'Emmet Perry', message: 'Excepteur sint occaecat cupidatat non', time: '12:50', status: 'offline', avatar: 'path/to/avatar3.png' },
  { id: '4', name: 'Walter Lindsey', message: 'Quis nostrud exercitation ullamco', time: '1 Day ago', status: 'offline', avatar: 'path/to/avatar4.png' },
  { id: '5', name: 'Velma Cole', message: 'Excepteur sint occaecat cupidatat non', time: '2 Days ago', status: 'offline', avatar: 'path/to/avatar5.png' },
];

const ChatListScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>All chats</Text>
      <FlatList
        data={chatListData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate('Chat', { chat: item })}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{item.name}</Text>
              <Text style={styles.chatMessage}>{item.message}</Text>
            </View>
            <View style={styles.chatMeta}>
              <Text style={styles.chatTime}>{item.time}</Text>
              {item.status === 'online' && <View style={styles.onlineIndicator} />}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatMessage: {
    fontSize: 14,
    color: '#999',
  },
  chatMeta: {
    alignItems: 'flex-end',
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    marginTop: 5,
  },
});

export default ChatListScreen;
