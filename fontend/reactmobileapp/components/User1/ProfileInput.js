import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { TextInput, Button, HelperText, Card, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApis, endpoints } from '../../configs/Apis';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from '@react-navigation/native';

const HealthTracker = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [steps, setSteps] = useState(0);
  const [water, setWater] = useState(0);
  const [heartRate, setHeartRate] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [healthRecords, setHealthRecords] = useState([]);

  const navigation = useNavigation();

  const bmi =
    height && weight && !isNaN(height) && !isNaN(weight)
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

  const fetchRecords = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      const api = authApis(token);
      const res = await api.get(endpoints['healthrecord-list']);
  
      // đảm bảo healthRecords luôn là array
      const records = Array.isArray(res.data) ? res.data : [];
      setHealthRecords(records);
    } catch (err) {
      console.error('Error fetching health records:', err);
      setHealthRecords([]); // tránh map undefined
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
        heart_rate: heartRate ? parseInt(heartRate) : null,
      };

      await api.post(endpoints['healthrecord-create'], data);
      await fetchRecords();

      setHeight('');
      setWeight('');
      setSteps(0);
      setWater(0);
      setHeartRate('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
              <Text style={styles.title}>Theo dõi sức khỏe</Text>
            </View>

            <View style={styles.bmiContainer}>
              <Text style={styles.bmiTitle}>BMI: {bmi}</Text>
              <Text style={styles.bmiStatus}>{getBmiStatus()}</Text>
            </View>

            {msg ? <Text style={styles.errorText}>{msg}</Text> : null}

            <TextInput
              label="Chiều cao (cm)"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Cân nặng (kg)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Nhịp tim"
              value={heartRate}
              onChangeText={setHeartRate}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />

            {/* Ô nhập bước chân có + - */}
            <View style={styles.row}>
              <Button mode="outlined" onPress={() => setSteps(prev => Math.max(0, prev - 10))}>-</Button>
              <TextInput
                label="Bước chân"
                value={steps.toString()}
                onChangeText={(val) => setSteps(parseInt(val) || 0)}
                keyboardType="numeric"
                style={[styles.input, { flex: 1, marginHorizontal: 8 }]}
                mode="outlined"
              />
              <Button mode="outlined" onPress={() => setSteps(prev => prev + 10)}>+</Button>
            </View>

            {/* Ô nhập nước uống có + - */}
            <View style={styles.row}>
              <Button mode="outlined" onPress={() => setWater(prev => Math.max(0, prev - 10))}>-</Button>
              <TextInput
                label="Nước uống (ml)"
                value={water.toString()}
                onChangeText={(val) => setWater(parseInt(val) || 0)}
                keyboardType="numeric"
                style={[styles.input, { flex: 1, marginHorizontal: 8 }]}
                mode="outlined"
              />
              <Button mode="outlined" onPress={() => setWater(prev => prev + 10)}>+</Button>
            </View>

            <Button
              mode="contained"
              buttonColor="#000099"
              textColor="white"
              loading={loading}
              disabled={loading}
              style={styles.button}
              onPress={handleSubmit}
            >
              Lưu thông tin
            </Button>

            {Array.isArray(healthRecords) && healthRecords.length > 0 ? (
              healthRecords.map((item, index) => (
                <Card key={index} style={styles.card}>
                  <Card.Content>
                    <Text>Chiều cao: {item?.height ?? "?"} cm</Text>
                    <Text>Cân nặng: {item?.weight ?? "?"} kg</Text>
                    <Text>Bước chân: {item?.steps ?? 0}</Text>
                    <Text>Nước uống: {item?.water_intake ?? 0} ml</Text>
                    <Text>Nhịp tim: {item?.heart_rate ?? "?"}</Text>
                  </Card.Content>
                </Card>
              ))
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 12 }}>
                Chưa có dữ liệu sức khỏe!
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  arrowButton: {
    position: 'absolute',
    left: 0,
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000099",
  },
  bmiContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bmiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000099',
  },
  bmiStatus: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  button: {
    borderRadius: 12,
    marginVertical: 12,
  },
  card: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
});

export default HealthTracker;
