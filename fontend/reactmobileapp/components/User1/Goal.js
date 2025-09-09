import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { TextInput, Button, HelperText, Card, Text, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApis, endpoints } from '../../configs/Apis';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const CreateGoal = () => {
  const [goalType, setGoalType] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [goalsList, setGoalsList] = useState([]);
  
  const navigation = useNavigation();

  const validateInputs = () => {
    if (!goalType || !targetWeight || !targetDate || !description) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin');
      return false;
    }
    if (isNaN(targetWeight) || parseFloat(targetWeight) <= 0) {
      setErrorMessage('Cân nặng mục tiêu phải là số dương');
      return false;
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(targetDate)) {
      setErrorMessage('Ngày mục tiêu phải có định dạng YYYY-MM-DD (VD: 2025-12-31)');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    try {
      setLoading(true);
      setErrorMessage('');

      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      if (!token) {
        throw new Error('Chưa đăng nhập. Vui lòng đăng nhập lại');
      }
      if (!userId) {
        throw new Error('Không tìm thấy ID người dùng');
      }

      const goalData = {
        user: parseInt(userId),
        goal_type: goalType,
        target_weight: parseFloat(targetWeight),
        target_date: targetDate,
        description,
      };

      const api = authApis(token);
      const response = await api.post(endpoints['goal-create'], goalData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        const newGoal = {
          goal_type: goalType,
          target_weight: parseFloat(targetWeight),
          target_date: targetDate,
          description,
          completed: false,
        };

        const storedGoals = await AsyncStorage.getItem('goals');
        const updatedGoals = storedGoals ? JSON.parse(storedGoals) : [];
        updatedGoals.push(newGoal);

        await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
        setGoalsList(updatedGoals);

        Alert.alert('Thành công', 'Mục tiêu đã được tạo!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);

        setGoalType('');
        setTargetWeight('');
        setTargetDate('');
        setDescription('');
      }
    } catch (err) {
      console.error('Error:', err);
      setErrorMessage('Không thể kết nối đến server. Vui lòng kiểm tra lại mạng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const storedGoals = await AsyncStorage.getItem('goals');
        if (storedGoals) {
          setGoalsList(JSON.parse(storedGoals));
        }
      } catch (error) {
        console.error('Error loading goals:', error);
      }
    };
    loadGoals();
  }, []);

  const handleDelete = async (index) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn chắc chắn muốn xóa mục tiêu này?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", onPress: async () => {
          try {
            const updatedGoals = [...goalsList];
            updatedGoals.splice(index, 1);
            await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
            setGoalsList(updatedGoals);
            Alert.alert("Thành công", "Mục tiêu đã được xóa!");
          } catch (error) {
            console.error('Error deleting goal:', error);
            Alert.alert("Lỗi", "Không thể xóa mục tiêu, vui lòng thử lại");
          }
        }}
      ]
    );
  };

  const handleCompletionToggle = async (index) => {
    const updatedGoals = [...goalsList];
    updatedGoals[index].completed = !updatedGoals[index].completed;
    await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
    setGoalsList(updatedGoals);
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
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.box}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowButton}>
                <MaterialIcons name="arrow-back-ios" size={20} color="#000099" />
              </TouchableOpacity>

             <Text style={styles.title}>Tạo mục tiêu</Text>
          </View>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <TextInput
              label="Loại mục tiêu"
              value={goalType}
              onChangeText={setGoalType}
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Cân nặng mục tiêu (kg)"
              value={targetWeight}
              onChangeText={setTargetWeight}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Ngày mục tiêu (YYYY-MM-DD)"
              value={targetDate}
              onChangeText={setTargetDate}
              placeholder="VD: 2025-12-31"
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Mô tả"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={styles.input}
              mode="outlined"
            />

            <Button
              mode="contained"
              buttonColor="#000099"
              textColor="white"
              loading={loading}
              disabled={loading}
              style={styles.button}
              onPress={handleSubmit}
            >
              Tạo mục tiêu
            </Button>

            {goalsList.length > 0 ? (
              goalsList.map((goal, index) => (
                <Card key={index} style={styles.card}>
                  <Card.Content>
                    <Text style={styles.cardTitle}>{goal.goal_type}</Text>
                    <Text>Cân nặng mục tiêu: {goal.target_weight} kg</Text>
                    <Text>Ngày mục tiêu: {goal.target_date}</Text>
                    <Text>Mô tả: {goal.description}</Text>

                    <Button
                      mode="contained"
                      style={styles.deleteButton}
                      onPress={() => handleDelete(index)}
                    >
                      Xóa
                    </Button>

                    <Button
                      mode="outlined"
                      style={styles.completionButton}
                      onPress={() => handleCompletionToggle(index)}
                    >
                      {goal.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}
                    </Button>
                  </Card.Content>
                </Card>
              ))
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 12 }}>
                Chưa có mục tiêu nào được tạo!
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // căn giữa theo chiều ngang
    marginBottom: 16,
    position: 'relative',     // để backButton có thể nằm bên trái
  },
  box: {
    width: '93%',
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
    marginBottom: 20,
    marginTop: 50
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  arrowButton: {
    marginRight: 60, // tăng khoảng cách mũi tên với tiêu đề
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000099",
    marginRight: 60,
    marginBottom:10,
    marginTop: 10
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
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
  card: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#000099',
  },
  deleteButton: {
    marginTop: 8,
    backgroundColor: '#000099',
    borderColor: '#000099',
  },
  completionButton: {
    marginTop: 8,
    borderColor: '#000099',
    borderWidth: 1,
  },
});

export default CreateGoal;