import React, { useState, useEffect, useRef } from 'react';
import { View, Platform, ScrollView, Alert } from 'react-native';
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
    if (triggerDate <= now) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }
    return triggerDate.getTime();
  };

  const onTimeChange = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setReminderTime(selectedDate);
    }
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
        content: {
          title: `Nhắc nhở: ${title}`,
          body: `Đến giờ cho hoạt động ${title}`,
          sound: true,
        },
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
      Alert.alert('Lỗi', 'Không thể đặt nhắc nhở. Vui lòng thử lại.');
      console.log('Lỗi đặt notification:', error);
    }
  };

  const deleteReminder = async (id, notificationId) => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    setCustomReminders(prev => prev.filter(r => r.id !== id));
  };

  const scheduleDefaultReminders = async () => {
    const reminders = [
      { hour: 8, minute: 0, body: 'Nhớ uống nước buổi sáng!' },
      { hour: 10, minute: 0, body: 'Uống thêm nước nhé!' },
      { hour: 18, minute: 0, body: 'Tập thể dục nào!' },
      { hour: 22, minute: 0, body: 'Nghỉ ngơi và đi ngủ sớm nhé!' },
    ];

    try {
      // Hủy các thông báo mặc định cũ
      for (const id of defaultReminderIds) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }
      setDefaultReminderIds([]);

      const newIds = [];
      for (const r of reminders) {
        const triggerTimestamp = calculateTrigger(r.hour, r.minute);
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: { title: 'Nhắc nhở mặc định', body: r.body, sound: true },
          trigger: new Date(triggerTimestamp),
        });
        newIds.push(notificationId);
      }
      setDefaultReminderIds(newIds);
      Alert.alert('Thông báo', 'Đã bật nhắc nhở mặc định!');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đặt nhắc nhở mặc định.');
      console.log('Lỗi đặt nhắc mặc định:', error);
    }
  };

  const toggleDefaultReminders = async () => {
    setUseDefaultReminders(prev => !prev);
    if (!useDefaultReminders) {
      await scheduleDefaultReminders();
    } else {
      for (const id of defaultReminderIds) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }
      setDefaultReminderIds([]);
      Alert.alert('Thông báo', 'Đã tắt nhắc nhở mặc định');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text variant="titleLarge" style={{ marginBottom: 16, fontSize: 18, color: "#B00000" , fontWeight:'bold'}}>
        Cài đặt nhắc nhở
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ flex: 1 }}>Sử dụng nhắc nhở mặc định</Text>
        <Switch
          value={useDefaultReminders}
          onValueChange={toggleDefaultReminders}
          trackColor={{ false: '#ccc', true: '#B00000' }}
          thumbColor={'#f4f3f4'}
        />
      </View>

      <Divider style={{ marginVertical: 20 }} />

      <Text style={{ marginBottom: 8, fontSize: 18 }}>Loại nhắc nhở:</Text>
      <RadioButton.Group onValueChange={setReminderType} value={reminderType}>
        <RadioButton.Item label="Uống nước" value="water" color='#B00000' />
        <RadioButton.Item label="Tập luyện" value="workout" color='#B00000' />
        <RadioButton.Item label="Nghỉ ngơi" value="rest" color='#B00000' />
      </RadioButton.Group>

      <Text style={{ marginTop: 16, fontSize: 18 }}>Chọn giờ nhắc nhở:</Text>
      <Button
        textColor="#B00000"
        mode="outlined"
        onPress={() => setShowTimePicker(true)}
        style={{ marginTop: 8, borderColor: '#B00000', borderWidth: 1 }}
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

      <Text style={{ marginTop: 12, marginBottom: 12 }}>
        Thời gian đã chọn: {reminderTime.getHours()}:{reminderTime.getMinutes().toString().padStart(2, '0')}
      </Text>

      <Button buttonColor="#B00000" textColor="white" mode="contained" onPress={scheduleCustomReminder}>
        Đặt nhắc nhở tùy chỉnh
      </Button>

      <Divider style={{ marginVertical: 24 }} />

      <Text variant="titleMedium" style={{ marginBottom: 12, fontSize: 18, color: "#B00000" }}>
        Danh sách nhắc nhở đã đặt
      </Text>
      {customReminders.map(reminder => (
        <Card key={reminder.id} style={{ marginBottom: 12, padding: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ marginLeft: 7 }}>{getLabel(reminder.type)}</Text>
              <Text style={{ marginLeft: 7 }}>Lúc: {reminder.time}</Text>
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
    </ScrollView>
  );
};

export default ReminderScreen;