import React, { useState, useEffect } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, Alert, StyleSheet, View, ActivityIndicator, Text as RNText } from 'react-native';
import { TextInput, Button, Card, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { endpoints, authApis } from '../../configs/Apis';

const HealthDiary = () => {
  const [diary, setDiary] = useState([]);
  const [text, setText] = useState('');
  const [feeling, setFeeling] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const styles = getStyles();

  const loadDiary = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const res = await authApis(token).get(endpoints['healthdiary-my-diaries']);

      let diariesData = [];
      if (Array.isArray(res.data)) {
        diariesData = res.data;
      } else if (res.data?.results) {
        diariesData = res.data.results;
      }

      diariesData.sort((a, b) => new Date(b.date) - new Date(a.date));

      setDiary(diariesData);
    } catch (err) {
      console.error("Lỗi khi tải nhật ký:", err);
      Alert.alert('Lỗi', 'Không thể tải nhật ký');
      setDiary([]);
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!text.trim() || !feeling.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ nội dung và cảm xúc!');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Chưa có token');

      const payload = {
        content: text.trim(),
        feeling: isNaN(Number(feeling)) ? feeling.trim() : Number(feeling),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      };

      if (editId) {
        await authApis(token).put(`${endpoints['healthdiary-list']}${editId}/`, payload);
        Alert.alert('Cập nhật thành công');
      } else {
        await authApis(token).post(endpoints['healthdiary-list'], payload);
        Alert.alert('Đã lưu nhật ký');
      }

      setText('');
      setFeeling('');
      setEditId(null);

      await loadDiary();
    } catch (err) {
      console.error("Lỗi khi lưu nhật ký:", err);
      Alert.alert('Lỗi', 'Không thể lưu nhật ký. Dữ liệu vẫn được giữ local tạm thời.');

      const local = await AsyncStorage.getItem('healthDiaryLocal');
      const localArr = local ? JSON.parse(local) : [];
      const tempEntry = { id: Date.now(), content: text, feeling, date: new Date().toISOString() };
      await AsyncStorage.setItem('healthDiaryLocal', JSON.stringify([tempEntry, ...localArr]));
      setDiary(prev => [tempEntry, ...prev]);

      setText('');
      setFeeling('');
      setEditId(null);
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id) => {
    Alert.alert('Xoá nhật ký', 'Bạn có chắc muốn xoá nhật ký này?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            const token = await AsyncStorage.getItem('token');
            await authApis(token).delete(`${endpoints['healthdiary-list']}${id}/`);
            await loadDiary();
          } catch (err) {
            console.error(err);
            Alert.alert('Lỗi', 'Không thể xoá nhật ký');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const startEdit = (id, content, feelingValue) => {
    Alert.alert('Xác nhận chỉnh sửa', 'Bạn có muốn chỉnh sửa nhật ký này không?', [
      { text: 'Không', style: 'cancel' },
      { text: 'Có', onPress: () => { setEditId(id); setText(content); setFeeling(feelingValue); } },
    ]);
  };

  useEffect(() => {
    loadDiary();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.box}>
          <RNText style={styles.title}>Chia sẻ cảm xúc của bạn</RNText>

          <TextInput
            label="Viết cảm nhận sau buổi tập..."
            mode="outlined"
            multiline
            numberOfLines={5}
            value={text}
            onChangeText={setText}
            style={styles.input}
            placeholder="Hôm nay bạn cảm thấy thế nào?"
            editable={!loading}
            outlineColor="#ccc"
            activeOutlineColor="#000099"
          />

          <TextInput
            label="Cảm xúc (ví dụ: Tốt, Mệt mỏi, Vui vẻ)"
            mode="outlined"
            value={feeling}
            onChangeText={setFeeling}
            style={styles.input}
            placeholder="Nhập cảm xúc của bạn"
            editable={!loading}
            outlineColor="#ccc"
            activeOutlineColor="#000099"
          />

          <Button
            buttonColor="#000099"
            textColor="white"
            mode="contained"
            onPress={saveEntry}
            style={styles.button}
            disabled={loading}
          >
            {editId ? 'Cập nhật nhật ký' : 'Lưu nhật ký'}
          </Button>

          {editId && (
            <Button
              mode="outlined"
              onPress={() => { setEditId(null); setText(''); setFeeling(''); }}
              textColor="#000099"
              style={{ borderColor: '#000099', borderWidth: 1, marginBottom: 12 }}
            >
              Huỷ chỉnh sửa
            </Button>
          )}

          {loading && <ActivityIndicator size="large" style={{ marginVertical: 20 }} />}

          <RNText style={styles.subtitle}>Danh sách nhật ký</RNText>
          {diary.length === 0 && !loading && (
            <RNText style={styles.emptyText}>Bạn chưa có nhật ký nào.</RNText>
          )}
          {diary.map(({ id, date, content, feeling }) => (
            <Card key={id} style={styles.card}>
              <View style={styles.row}>
                <View>
                  <RNText style={styles.dateText}>
                    {date ? new Date(date).toLocaleDateString() : 'Không rõ ngày'}
                  </RNText>
                </View>
                <View style={styles.cardActions}>
                  <IconButton icon="pencil" size={20} onPress={() => startEdit(id, content, feeling)} />
                  <IconButton icon="delete" size={20} onPress={() => deleteEntry(id)} />
                </View>
              </View>
              <RNText style={styles.cardContent}>{content}</RNText>
              <RNText style={styles.cardFeeling}>Cảm xúc: {feeling}</RNText>
            </Card>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const getStyles = () =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: 0,
      paddingVertical: 20,
    },
    box: {
      width: '90%',
      alignSelf: 'center',
      padding: 20,
      borderRadius: 25,
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderWidth: 1,
      borderColor: '#000099',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 5,
      elevation: 5,
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000099',
      alignSelf: 'center',
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '500',
      color: '#000099',
      marginVertical: 8,
    },
    input: {
      marginBottom: 12,
      backgroundColor: '#fff',
      borderRadius: 12,
    },
    button: {
      borderRadius: 12,
      marginBottom: 12,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    card: {
      marginBottom: 12,
      padding: 12,
      borderRadius: 12,
      backgroundColor: '#fff',
    },
    cardActions: {
      flexDirection: 'row',
    },
    cardContent: {
      marginTop: 4,
      fontSize: 14,
      color: '#333',
    },
    cardFeeling: {
      fontSize: 12,
      fontStyle: 'italic',
      color: '#555',
    },
    dateText: {
      fontSize: 12,
      color: '#555',
    },
    emptyText: {
      textAlign: 'center',
      color: '#777',
      marginVertical: 12,
    },
  });

export default HealthDiary;
