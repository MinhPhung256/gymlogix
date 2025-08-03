import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, HelperText, Card, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApis, endpoints } from '../../configs/Apis';
import { useNavigation } from '@react-navigation/native';

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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <HelperText type="error" visible={!!errorMessage}>{errorMessage}</HelperText>

        <TextInput
          label="Loại mục tiêu"
          value={goalType}
          onChangeText={setGoalType}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#B00000' } }}
        />
        <TextInput
          label="Cân nặng mục tiêu (kg)"
          value={targetWeight}
          onChangeText={setTargetWeight}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#B00000' } }}
        />
        <TextInput
          label="Ngày mục tiêu (YYYY-MM-DD)"
          value={targetDate}
          onChangeText={setTargetDate}
          placeholder="VD: 2025-12-31"
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#B00000' } }}
        />
        <TextInput
          label="Mô tả"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#B00000' } }}
        />
        <Button
          mode="contained"
          loading={loading}
          disabled={loading}
          style={styles.button}
          buttonColor="#B00000"
          onPress={handleSubmit}
        >
          Tạo mục tiêu
        </Button>

        <View style={styles.goalsContainer}>
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
                    labelStyle={{ color: '#B00000' }}
                    style={styles.completionButton}
                    onPress={() => handleCompletionToggle(index)}
                  >
                    {goal.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}
                  </Button>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text>Chưa có mục tiêu nào được tạo!</Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 16,
  },
  goalsContainer: {
    marginTop: 20,
  },
  card: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#B00000',
  },
  deleteButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#B00000',
    borderColor: '#B00000',
    borderWidth: 1,
    color: '#FFFFFF',
  },
  completionButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    borderColor: '#B00000',
    borderWidth: 1,
    color: '#B00000',
  },
});

export default CreateGoal;
