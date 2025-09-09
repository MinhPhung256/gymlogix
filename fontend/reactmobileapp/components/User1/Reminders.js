import React, { useState, useEffect, useRef } from 'react';
import { View, Platform, ScrollView, Alert, StyleSheet, Text as RNText } from 'react-native';
import { Switch, Button, Text, Divider, RadioButton, Card, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

const ReminderScreen = () => {
  const [useDefaultReminders, setUseDefaultReminders] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderType, setReminderType] = useState('water');
  const [customReminders, setCustomReminders] = useState([]);
  const [defaultReminderIds, setDefaultReminderIds] = useState([]);

  const responseListener = useRef();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Thông báo', 'Bạn cần cấp quyền nhận thông báo để sử dụng tính năng này!');
      }
    })();

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Người dùng bấm vào thông báo:', response);
    });

    return () => {
      responseListener.current?.remove();
    };
  }, []);

  const calculateTrigger = (hour, minute) => {
    const now = new Date();
    let triggerDate = new Date();
    triggerDate.setHours(hour, minute, 0, 0);
    if (triggerDate <= now) triggerDate.setDate(triggerDate.getDate() + 1);
    return triggerDate.getTime();
  };

  const onTimeChange = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) setReminderTime(selectedDate);
  };

  const getLabel = (type) => {
    switch (type) {
      case 'water': return 'Uống nước';
      case 'workout': return 'Tập luyện';
      case 'rest': return 'Nghỉ ngơi';
      default: return '';
    }
  };

  const scheduleCustomReminder = async () => {
    const title = getLabel(reminderType);
    const triggerTimestamp = calculateTrigger(reminderTime.getHours(), reminderTime.getMinutes());

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: { title: `Nhắc nhở: ${title}`, body: `Đến giờ cho hoạt động ${title}`, sound: true },
        trigger: { type: 'date', date: new Date(triggerTimestamp) },
      });

      const newReminder = {
        id: Date.now(),
        type: reminderType,
        time: `${reminderTime.getHours()}:${reminderTime.getMinutes().toString().padStart(2, '0')}`,
        notificationId,
      };

      setCustomReminders(prev => [...prev, newReminder]);
      Alert.alert('Thông báo', 'Đã đặt nhắc nhở tùy chỉnh!');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đặt nhắc nhở.');
      console.log(error);
    }
  };

  const deleteReminder = async (id, notificationId) => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    setCustomReminders(prev => prev.filter(r => r.id !== id));
  };

  const toggleDefaultReminders = async () => {
    setUseDefaultReminders(prev => !prev);
    Alert.alert('Thông báo', `Nhắc nhở mặc định đã ${!useDefaultReminders ? 'bật' : 'tắt'}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.box}>
        <RNText style={styles.title}>Cài đặt nhắc nhở</RNText>

        <View style={styles.row}>
          <RNText style={styles.label}>Sử dụng nhắc nhở mặc định</RNText>
          <Switch
            value={useDefaultReminders}
            onValueChange={toggleDefaultReminders}
            trackColor={{ false: '#ccc', true: '#000099' }}
            thumbColor={'#fff'}
          />
        </View>

        <Divider style={{ marginVertical: 16 }} />

        <RNText style={styles.subtitle}>Loại nhắc nhở:</RNText>
        <RadioButton.Group onValueChange={setReminderType} value={reminderType} style={{fontSize: 14}}>
          <RadioButton.Item 
            label="Uống nước" 
            value="water" 
            color="#000099" 
            labelStyle={{ fontSize: 14 }}
          />
          <RadioButton.Item 
            label="Tập luyện" 
            value="workout" 
            color="#000099" 
            labelStyle={{ fontSize: 14 }}
          />
          <RadioButton.Item 
            label="Nghỉ ngơi" 
            value="rest" 
            color="#000099" 
            labelStyle={{ fontSize: 14 }}
          />
        </RadioButton.Group>

        <RNText style={[styles.subtitle, { marginTop: 12 }]}>Chọn giờ nhắc nhở:</RNText>
        <Button
          textColor="#000099"
          mode="outlined"
          onPress={() => setShowTimePicker(true)}
          style={styles.button}
        >
          Chọn thời gian
        </Button>

        {showTimePicker && (
          <DateTimePicker
            value={reminderTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            is24Hour={true}
            onChange={onTimeChange}
          />
        )}

        <RNText style={{ marginVertical: 12 }}>
          Thời gian đã chọn: {reminderTime.getHours()}:{reminderTime.getMinutes().toString().padStart(2, '0')}
        </RNText>

        <Button buttonColor="#000099" textColor="white" mode="contained" onPress={scheduleCustomReminder}>
          Đặt nhắc nhở tùy chỉnh
        </Button>

        <Divider style={{ marginVertical: 20 }} />

        <RNText style={[styles.title, { fontSize: 16 }]}>Danh sách nhắc nhở đã đặt</RNText>
        {customReminders.map(reminder => (
          <Card key={reminder.id} style={styles.reminderCard}>
            <View style={styles.row}>
              <View>
                <RNText>{getLabel(reminder.type)}</RNText>
                <RNText>Lúc: {reminder.time}</RNText>
              </View>
              <IconButton
                icon="delete"
                onPress={() =>
                  Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa nhắc nhở này không?', [
                    { text: 'Không', style: 'cancel' },
                    { text: 'Có', onPress: () => deleteReminder(reminder.id, reminder.notificationId) },
                  ])
                }
              />
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  box: {
    width: '100%',
    alignSelf: 'center',
    padding: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: '#000099',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
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
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: { 
    fontSize: 14
  },
  button: { 
    borderWidth: 1, 
    borderColor: '#000099', 
    borderRadius: 12, 
    marginBottom: 12 
  },
  reminderCard: { 
    marginBottom: 12, 
    padding: 12, 
    borderRadius: 12, 
    backgroundColor: '#ffffff', 
  },
});

export default ReminderScreen;
