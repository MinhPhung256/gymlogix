import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, ActivityIndicator, Platform, KeyboardAvoidingView, FlatList, Alert } from 'react-native';
import { TextInput as PaperTextInput, Button as PaperButton, HelperText } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApis, endpoints } from '../../configs/Apis';

const HealthTracker = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('Giữ dáng');
  const [steps, setSteps] = useState(0);
  const [water, setWater] = useState(0);
  const [heartRate, setHeartRate] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [healthRecords, setHealthRecords] = useState([]);

  const bmi = height && weight && !isNaN(height) && !isNaN(weight)
    ? (weight / ((height / 100) ** 2)).toFixed(1)
    : 'N/A';

  const getBmiStatus = () => {
    const val = parseFloat(bmi);
    if (isNaN(val)) return 'Chưa tính được';
    if (val < 18.5) return 'Thiếu cân';
    if (val < 24.9) return 'Bình thường';
    if (val < 29.9) return 'Thừa cân';
    return 'Béo phì';
  };

  const validate = () => {
    if (!height || !weight) {
      setMsg('Vui lòng nhập đầy đủ thông tin chiều cao và cân nặng!');
      return false;
    }
    if (isNaN(height) || isNaN(weight)) {
      setMsg('Chiều cao hoặc cân nặng không hợp lệ!');
      return false;
    }
    setMsg(null);
    return true;
  };

  const fetchRecords = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const api = authApis(token);
      const res = await api.get(endpoints['healthrecord-list']);

      setHealthRecords(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu sức khỏe!');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const api = authApis(token);

      const data = {
        height: parseFloat(height),
        weight: parseFloat(weight),
        steps: steps,
        water_intake: water,
        heart_rate: parseInt(heartRate),
      };

      await api.post(endpoints['healthrecord-create'], data);

      await fetchRecords();

      setHeight('');
      setWeight('');
      setGoal('Giữ dáng');
      setSteps(0);
      setWater(0);
      setHeartRate('');
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể lưu dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  const renderRecordItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.label}>Chiều cao: {item.height} cm</Text>
      <Text style={styles.label}>Cân nặng: {item.weight} kg</Text>
      <Text style={styles.label}>Bước chân: {item.steps}</Text>
      <Text style={styles.label}>Nước uống: {item.water_intake} ml</Text>
      <Text style={styles.label}>Nhịp tim: {item.heart_rate}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.content}>
            <View style={styles.bmiContainer}>
              <Text style={styles.bmiTitle}>Chỉ số cơ thể (BMI)</Text>
              <Text style={styles.bmi}>{bmi}</Text>
              <Text style={styles.bmiStatus}>{getBmiStatus()}</Text>
            </View>

            <HelperText type="error" visible={!!msg}>{msg}</HelperText>

            <PaperTextInput label="Chiều cao (cm)" keyboardType="numeric" value={height} onChangeText={setHeight} mode="outlined" style={styles.input} theme={{ colors: { primary: '#B00000' } }} />
            <PaperTextInput label="Cân nặng (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} mode="outlined" style={styles.input} theme={{ colors: { primary: '#B00000' } }} />
            <PaperTextInput label="Nhịp tim" keyboardType="numeric" value={heartRate} onChangeText={setHeartRate} mode="outlined" style={styles.input} theme={{ colors: { primary: '#B00000' } }} />

            <View style={styles.card}>
              <Text style={styles.label}>Bước chân hôm nay: {steps}</Text>
              <Button title="+100 bước" onPress={() => setSteps(prev => prev + 100)} />
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Nước đã uống: {water} ml</Text>
              <Button title="+250ml" onPress={() => setWater(prev => prev + 250)} />
            </View>

            <PaperButton
              mode="contained"
              onPress={handleSubmit}
              style={{ marginTop: 20, backgroundColor: '#B00000' }}
              disabled={loading}
            >
              Lưu thông tin
            </PaperButton>

            {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
          </View>
        }
        data={healthRecords}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecordItem}
        contentContainerStyle={{ padding: 20, paddingBottom: 30 }}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  bmiContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bmiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B00000',
  },
  bmi: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#B00000',
  },
  bmiStatus: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
});

export default HealthTracker;
