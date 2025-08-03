import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Button, TextInput, Dialog, Portal, List } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { createOrUpdateWorkoutPlan } from '../../configs/Apis';

const WorkoutPlan = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [workouts, setWorkouts] = useState({});
  const [customWorkout, setCustomWorkout] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);

  const suggestedWorkouts = ['Chạy bộ 30 phút', 'Chống đẩy 3 hiệp', 'Gập bụng 15 phút'];
  const [customWorkouts, setCustomWorkouts] = useState([]);

  const addWorkout = async (workout) => {
    if (!workout.trim()) {
      Alert.alert('Lỗi', 'Tên bài tập không được để trống');
      return;
    }
  
    if (!selectedDate) {
      Alert.alert('Chọn ngày trước');
      return;
    }
  
    const current = workouts[selectedDate] || [];
    const updatedWorkouts = [...current, workout];
  
    setWorkouts({
      ...workouts,
      [selectedDate]: updatedWorkouts,
    });
  
    if (!suggestedWorkouts.includes(workout) && !customWorkouts.includes(workout)) {
      setCustomWorkouts([...customWorkouts, workout]);
    }
  
    try {
      const token = await AsyncStorage.getItem('token');
      await createOrUpdateWorkoutPlan(token, selectedDate, updatedWorkouts);
    } catch (error) {
      // Alert.alert("Lỗi", "Không thể lưu kế hoạch tập luyện");
    }
  
    setCustomWorkout('');
    setDialogVisible(false);
  };

  const removeWorkout = (workout) => {
    setCustomWorkouts(customWorkouts.filter(item => item !== workout));

    if (selectedDate && workouts[selectedDate]) {
      setWorkouts({
        ...workouts,
        [selectedDate]: workouts[selectedDate].filter(item => item !== workout),
      });
    }
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text variant="titleLarge" style={{textAlign: 'center',fontSize:18, marginBottom: 16, color:'#B00000', fontWeight:'bold'}}>Lịch tập luyện cá nhân</Text>

      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#BB0000' },
        }}
      />

      {selectedDate ? (
        <View style={{ marginTop: 16 }}>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>Ngày: {selectedDate}</Text>

          <Text style={{ fontWeight: 'bold', marginBottom: 8, color:'#B00000' }}>Gợi ý bài tập:</Text>
          {suggestedWorkouts.map((workout, index) => (
            <Button
              key={`suggested-${index}`}
              mode="outlined"
              onPress={() => addWorkout(workout)}
              textColor="#B00000"
              style={{ borderColor: '#B00000', borderWidth: 1, marginBottom: 8 }}
            >
              {workout}
            </Button>
          ))}

          {customWorkouts.length > 0 && (
            <>
              <Text style={{ fontWeight: 'bold', marginTop: 12, marginBottom: 8, color:'#B00000' }}>
                Bài tập tự thêm:
              </Text>
              {customWorkouts.map((workout, index) => (
                <View
                  key={`custom-${index}`}
                  style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    marginBottom: 8, 
                    borderWidth: 1,
                    borderColor: '#B00000',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ color: '#B00000', fontSize: 16 }}>{workout}</Text>
                  <Button
                    onPress={() => removeWorkout(workout)}
                    textColor="#B00000"
                    compact
                    mode="text"
                  >
                    Xoá
                  </Button>
                </View>
              ))}
            </>
          )}

          <Button buttonColor="#B00000" textColor="white" mode="contained" onPress={() => setDialogVisible(true)} style={{ marginTop: 12 }}>
            ➕ Thêm bài tập
          </Button>

          <Text style={{ fontWeight: 'bold', marginTop: 20, color:'#B00000' }}>Danh sách bài tập:</Text>
          {(workouts[selectedDate] || []).map((item, idx) => (
            <List.Item key={idx} title={item} left={props => <List.Icon {...props} icon="check" />} />
          ))}
        </View>
      ) : (
        <View>
          <Text style={{ marginTop: 20, color: 'gray' }}>Vui lòng chọn ngày để xem hoặc thêm bài tập</Text>
        </View>
      )}

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} style={{ backgroundColor: '#fff' }}>
          <Dialog.Title>Thêm bài tập</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Tên bài tập"
              value={customWorkout}
              onChangeText={setCustomWorkout}
              mode="outlined"
              outlineColor="#ccc"          
              activeOutlineColor="#B00000" 
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)} textColor='#B00000'>Huỷ</Button>
            <Button onPress={() => addWorkout(customWorkout)} textColor='#B00000'>Lưu</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

export default WorkoutPlan;
