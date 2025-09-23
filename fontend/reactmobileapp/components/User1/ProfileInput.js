import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApis, endpoints } from '../../configs/Apis';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from '@react-navigation/native';

const HealthTracker = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [steps, setSteps] = useState('');
  const [water, setWater] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [healthRecords, setHealthRecords] = useState([]);

  const navigation = useNavigation();

  // --- BMI ---
  const bmi = height && weight && !isNaN(height) && !isNaN(weight)
    ? (weight / ((height / 100) ** 2))
    : null;

  const getBmiStatus = () => {
    if (bmi == null) return 'Chưa tính được';
    if (bmi < 18.5) return 'Thiếu cân';
    if (bmi < 24.9) return 'Bình thường';
    if (bmi < 29.9) return 'Thừa cân';
    return 'Béo phì';
  };

  const validate = () => {
    if (!height || !weight) {
      setMsg('Vui lòng nhập đầy đủ chiều cao và cân nặng!');
      return false;
    }
    if (isNaN(height) || isNaN(weight)) {
      setMsg('Chiều cao hoặc cân nặng không hợp lệ!');
      return false;
    }
    setMsg(null);
    return true;
  };

  // --- Lấy dữ liệu ---
  const fetchRecords = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const api = authApis(token);
      const res = await api.get(endpoints['healthrecord-list']);
      const records = Array.isArray(res.data.results) ? res.data.results : [];
      setHealthRecords(records);

      await AsyncStorage.setItem("healthRecords", JSON.stringify(records));
    } catch (err) {
      console.error('Không lấy được từ API, thử lấy local:', err);
      const local = await AsyncStorage.getItem("healthRecords");
      setHealthRecords(local ? JSON.parse(local) : []);
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  // --- Lưu dữ liệu ---
  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    const data = {
      height: parseFloat(height),
      weight: parseFloat(weight),
      steps: steps && !isNaN(steps) ? parseInt(steps) : 0,
      water_intake: water && !isNaN(water) ? parseFloat(water) : 0,
      heart_rate: heartRate && !isNaN(heartRate) ? parseInt(heartRate) : null,
    };

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token');

      const api = authApis(token);
      const res = await api.post(endpoints['healthrecord-create'], data);

      // Tạo record mới để hiển thị ngay
      const newRecord = {
        id: res.data.id,
        height: data.height,
        weight: data.weight,
        steps: data.steps,
        water_intake: data.water_intake,
        heart_rate: data.heart_rate,
        date: res.data.date || new Date().toISOString(),
        bmi: parseFloat((data.weight / ((data.height / 100) ** 2)).toFixed(1)),
      };

      setHealthRecords(prev => [newRecord, ...prev]);
      await AsyncStorage.setItem("healthRecords", JSON.stringify([newRecord, ...healthRecords]));

      Alert.alert("Thành công", "Thông tin đã được lưu.");
    } catch (err) {
      console.error('API lỗi:', err.response?.data || err.message);
      Alert.alert(
        "Lỗi",
        err.response?.data ? JSON.stringify(err.response.data) : "Không thể lưu thông tin."
      );
    } finally {
      setHeight('');
      setWeight('');
      setSteps('');
      setWater('');
      setHeartRate('');
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../../assets/Images/background1.jpg')} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.box}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowButton}>
                <MaterialIcons name="arrow-back-ios" size={20} color="#000099" />
              </TouchableOpacity>
              <Text style={styles.title}>Theo dõi sức khỏe</Text>
            </View>

            <View style={styles.bmiContainer}>
              <Text style={styles.bmiTitle}>BMI: {bmi != null ? bmi.toFixed(1) : "?"}</Text>
              <Text style={styles.bmiStatus}>{getBmiStatus()}</Text>
            </View>

            {msg && <Text style={styles.errorText}>{msg}</Text>}

            <TextInput label="Chiều cao (cm)" value={height} onChangeText={setHeight} keyboardType="numeric" style={styles.input} mode="outlined" />
            <TextInput label="Cân nặng (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" style={styles.input} mode="outlined" />
            <TextInput label="Nhịp tim" value={heartRate} onChangeText={setHeartRate} keyboardType="numeric" style={styles.input} mode="outlined" />

            <View style={styles.row}>
              <Button mode="outlined" onPress={() => setSteps(prev => Math.max(0, (parseInt(prev) || 0) - 10))}>-</Button>
              <TextInput
                label="Bước chân"
                value={steps.toString()}
                onChangeText={setSteps}
                keyboardType="numeric"
                style={[styles.input, { flex: 1, marginHorizontal: 8 }]}
                mode="outlined"
              />
              <Button mode="outlined" onPress={() => setSteps(prev => (parseInt(prev) || 0) + 10)}>+</Button>
            </View>

            <View style={styles.row}>
              <Button mode="outlined" onPress={() => setWater(prev => Math.max(0, (parseInt(prev) || 0) - 10))}>-</Button>
              <TextInput
                label="Nước uống (ml)"
                value={water.toString()}
                onChangeText={setWater}
                keyboardType="numeric"
                style={[styles.input, { flex: 1, marginHorizontal: 8 }]}
                mode="outlined"
              />
              <Button mode="outlined" onPress={() => setWater(prev => (parseInt(prev) || 0) + 10)}>+</Button>
            </View>

            <Button mode="contained" buttonColor="#000099" textColor="white" loading={loading} disabled={loading} style={styles.button} onPress={handleSubmit}>
              Lưu thông tin
            </Button>

            {Array.isArray(healthRecords) && healthRecords.length > 0 ? (
              healthRecords.map((item, index) => (
                <Card key={item.id ?? index} style={styles.card}>
                  <Card.Content>
                    <Text>Thời gian: {item.date ? new Date(item.date).toLocaleString() : "?"}</Text>
                    <Text>Chiều cao: {item.height ?? "?"} cm</Text>
                    <Text>Cân nặng: {item.weight ?? "?"} kg</Text>
                    <Text>BMI: {item.bmi != null && !isNaN(item.bmi) ? Number(item.bmi).toFixed(1) : "?"}</Text>
                    <Text>Bước chân: {item.steps ?? 0}</Text>
                    <Text>Nước uống: {item.water_intake ?? 0} ml</Text>
                    <Text>Nhịp tim: {item.heart_rate ?? "?"}</Text>
                  </Card.Content>
                </Card>
              ))
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 12 }}>Chưa có dữ liệu sức khỏe!</Text>
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
    paddingVertical: 20 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 16, 
    position: 'relative' 
  },
  arrowButton: { 
    position: 'absolute', 
    left: 0 
  },
  box: { 
    width: '93%', 
    alignSelf: 'center', 
    padding: 20, 
    borderRadius: 25, 
    backgroundColor: 'rgba(255,255,255,0.85)', 
    borderWidth: 1, borderColor: '#000099', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowRadius: 5, elevation: 5, 
    marginBottom: 20, 
    marginTop: 50 
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#000099", 
    marginTop: 10, 
    marginBottom: 10 
  },
  bmiContainer: { 
    alignItems: 'center', 
    marginBottom: 20 
  },
  bmiTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#000099' 
  },
  bmiStatus: { 
    fontSize: 16, 
    fontStyle: 'italic', 
    color: '#666' 
  },
  errorText: { 
    color: 'red', 
    marginBottom: 12, 
    textAlign: 'center' 
  },
  input: { 
    marginBottom: 12, 
    backgroundColor: '#fff', 
    borderRadius: 12 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center',
     marginBottom: 12 
    },
  button: { 
    borderRadius: 12, 
    marginVertical: 12 
  },
  card: { 
    marginBottom: 12, 
    padding: 12, 
    borderRadius: 12, 
    backgroundColor: '#fff' 
  },
});

export default HealthTracker;
