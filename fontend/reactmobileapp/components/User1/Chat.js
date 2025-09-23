import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Text, Avatar, Card, TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { endpoints, authApis } from '../../configs/Apis';

const ChatScreen = ({ route }) => {
  const { selectedUser } = route.params || {}; // user bạn chat cùng
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  const loadMessages = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const currentUserId = Number(await AsyncStorage.getItem('userId'));
      const res = await authApis(token).get(endpoints['chatmessage-list']);

      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      const msgs = data
        .filter(msg => msg.sender && msg.receiver)
        .filter(
          msg =>
            (msg.sender.id === currentUserId && msg.receiver.id === selectedUser.id) ||
            (msg.sender.id === selectedUser.id && msg.receiver.id === currentUserId)
        )
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      setMessages(msgs);
    } catch (err) {
      console.log(err);
      Alert.alert('Lỗi', 'Không thể tải tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await authApis(token).post(endpoints['chatmessage-create'], {
        receiver: selectedUser.id,
        message: text.trim(),
      });

      setText('');
      await loadMessages();
    } catch (err) {
      console.log(err);
      Alert.alert('Lỗi', 'Không gửi được tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        {loading && <ActivityIndicator size="large" color="#000099" />}
        {messages.map(msg => {
          if (!msg.sender || !msg.receiver) return null;

          const currentUserId = Number(AsyncStorage.getItem('userId'));
          const isMyMessage = msg.sender.id === currentUserId;
          const avatarUrl = msg.sender.avatar_url || 'https://i.pravatar.cc/150?img=1';
          const username = msg.sender.username || 'Người dùng';

          return (
            <Card
              key={msg.id}
              style={[styles.card, isMyMessage ? styles.myMessage : styles.theirMessage]}
            >
              <View style={styles.row}>
                <Avatar.Image size={36} source={{ uri: avatarUrl }} />
                <View style={styles.messageBox}>
                  <Text style={styles.username}>{username}</Text>
                  <Text style={styles.messageText}>{msg.message}</Text>
                  <Text style={styles.timestamp}>
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                  </Text>
                </View>
              </View>
            </Card>
          );
        })}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          placeholder="Nhập tin nhắn..."
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <Button mode="contained" onPress={sendMessage} style={styles.sendButton}>
          Gửi
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 10 },
  scroll: { 
    flex: 1, 
    marginBottom: 10 
  },
  card: { 
    padding: 8, 
    marginVertical: 4, 
    borderRadius: 12 
  },
  myMessage: { 
    backgroundColor: '#000099', 
    alignSelf: 'flex-end' 
  },
  theirMessage: { 
    backgroundColor: '#e5e5ea', 
    alignSelf: 'flex-start' 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'flex-start' 
  },
  messageBox: { 
    marginLeft: 8, 
    flexShrink: 1 
  },
  username: { 
    fontWeight: 'bold', 
    color: '#000099', 
    marginBottom: 2 
  },
  messageText: { 
    fontSize: 14, 
    color: '#000' 
  },
  timestamp: { 
    fontSize: 10, 
    color: '#555', 
    alignSelf: 'flex-end', 
    marginTop: 2 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  input: { 
    flex: 1, 
    marginRight: 8, 
    borderRadius: 16, 
    backgroundColor: '#fff' 
  },
  sendButton: { 
    borderRadius: 16, 
    backgroundColor: '#000099' 
  },
});

export default ChatScreen;
