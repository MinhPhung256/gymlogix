import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, StyleSheet, KeyboardAvoidingView, Platform, ImageBackground, TouchableOpacity } from 'react-native';
import { Text, Button, TextInput, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Calendar } from 'react-native-calendars';
import { createOrUpdateWorkoutPlan } from '../../configs/Apis';
import { useNavigation } from '@react-navigation/native';

const WorkoutPlan = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [workouts, setWorkouts] = useState({});
  const [customWorkout, setCustomWorkout] = useState('');
  const [customWorkouts, setCustomWorkouts] = useState([]);
  const navigation = useNavigation();

  const suggestedWorkouts = ['Chạy bộ 30 phút', 'Chống đẩy 3 hiệp', 'Gập bụng 15 phút'];

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const stored = await AsyncStorage.getItem('workouts');
        if (stored) setWorkouts(JSON.parse(stored));
      } catch (error) {
        console.error("Lỗi load workout:", error);
      }
    };
    loadWorkouts();
  }, []);

  const saveWorkouts = async (updated) => {
    try {
      await AsyncStorage.setItem('workouts', JSON.stringify(updated));
      setWorkouts(updated);
    } catch (error) {
      console.error("Lỗi lưu workout:", error);
    }
  };

  const addWorkout = async (workoutName) => {
    if (!workoutName.trim()) {
      Alert.alert('Lỗi', 'Tên bài tập không được để trống');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Chọn ngày trước');
      return;
    }

    const current = workouts[selectedDate] || [];
    const newActivity = { name: workoutName, sets: 3, reps: 10 }; // local
    const updated = [...current, newActivity];
    const updatedWorkouts = { ...workouts, [selectedDate]: updated };

    if (!suggestedWorkouts.includes(workoutName) && !customWorkouts.includes(workoutName)) {
      setCustomWorkouts([...customWorkouts, workoutName]);
    }

    saveWorkouts(updatedWorkouts);
    setCustomWorkout('');

    // Payload chuẩn Django
    const payload = {
      name: `Kế hoạch ${selectedDate.split('-').reverse().join('-')}`,
      date: selectedDate, // YYYY-MM-DD
      description: '',
      activities: updated.map(a => ({
        exercise_name: a.name,
        sets: a.sets,
        reps: a.reps,
      })),
    };

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Chưa có token');
      await createOrUpdateWorkoutPlan(token, payload);
      console.log('Lưu kế hoạch luyện tập thành công');
    } catch (error) {
      console.warn('API lỗi, lưu local tạm thời:', error.message);
    }
  };

  const removeWorkout = (itemIndex) => {
    if (!selectedDate || !workouts[selectedDate]) return;
    const updated = workouts[selectedDate].filter((_, idx) => idx !== itemIndex);
    const updatedWorkouts = { ...workouts, [selectedDate]: updated };
    saveWorkouts(updatedWorkouts);
  };

  const totalSetsReps = () => {
    if (!selectedDate || !workouts[selectedDate]) return 0;
    return workouts[selectedDate].reduce((total, w) => total + (w.sets * w.reps), 0);
  };

  return (
    <ImageBackground
      source={require('../../assets/Images/background1.jpg')}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.box}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
                <MaterialIcons name="arrow-back-ios" size={24} color="#000099" />
              </TouchableOpacity>
              <Text style={styles.title}>Kế hoạch tập luyện</Text>
            </View>

            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: '#000099' },
              }}
              style={{ marginBottom: 12 }}
            />

            {selectedDate ? (
              <View>
                <Text style={{ marginBottom: 8 }}>Ngày: {selectedDate}</Text>

                <Text style={styles.sectionTitle}>Bài tập gợi ý:</Text>
                {suggestedWorkouts.map((w, i) => (
                  <Button
                    key={i}
                    mode="outlined"
                    textColor="#000099"
                    style={styles.addButton}
                    onPress={() => addWorkout(w)}
                  >
                    {w}
                  </Button>
                ))}

                {customWorkouts.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>Bài tập tự thêm:</Text>
                    {customWorkouts.map((w, i) => (
                      <Button
                        key={i}
                        mode="outlined"
                        textColor="#000099"
                        style={styles.addButton}
                        onPress={() => addWorkout(w)}
                      >
                        {w}
                      </Button>
                    ))}
                  </>
                )}

                <TextInput
                  label="Thêm bài tập mới"
                  value={customWorkout}
                  onChangeText={setCustomWorkout}
                  mode="outlined"
                  style={styles.input}
                  outlineColor="#ccc"
                  activeOutlineColor="#000099"
                />
                <Button
                  mode="contained"
                  buttonColor="#000099"
                  textColor="white"
                  onPress={() => addWorkout(customWorkout)}
                  style={{ marginBottom: 12 }}
                >
                  Thêm
                </Button>

                <Text style={styles.sectionTitle}>Danh sách bài tập:</Text>
                {(workouts[selectedDate] || []).map((item, idx) => (
                  <Card key={idx} style={styles.card}>
                    <Card.Content style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                      <Text>{item.name} ({item.sets} x {item.reps})</Text>
                      <Button
                        mode="text"
                        textColor="#B00000"
                        onPress={() => removeWorkout(idx)}
                      >
                        Xóa
                      </Button>
                    </Card.Content>
                  </Card>
                ))}

                {workouts[selectedDate] && workouts[selectedDate].length > 0 && (
                  <Text style={{ marginTop: 8, fontWeight:'bold', color:'#000099' }}>
                    Tổng số sets/reps: {totalSetsReps()}
                  </Text>
                )}
              </View>
            ) : (
              <Text style={{ marginTop: 12, color: 'gray', textAlign:'center' }}>Vui lòng chọn ngày để xem hoặc thêm bài tập hàng ngày</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingVertical: 0, paddingHorizontal: 0 },
  box: {
    width: '100%',
    padding: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: '#000099',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
    marginTop:60
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20, 
    marginTop: 10 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#000099', 
    marginLeft: 30, 
    marginBottom: 10 
  },
  sectionTitle: { 
    fontWeight: 'bold', 
    color: '#000099', 
    marginBottom: 8, 
    marginTop: 12 
  },
  input: { 
    marginBottom: 12, 
    backgroundColor: '#fff', 
    borderRadius: 12 
  },
  addButton: { 
    marginBottom: 8, 
    borderColor: '#000099', 
    borderWidth: 1, 
    borderRadius: 12 
  },
  card: { 
    marginBottom: 8, 
    borderRadius: 12, 
    backgroundColor: '#fff' 
  },
});

export default WorkoutPlan;
