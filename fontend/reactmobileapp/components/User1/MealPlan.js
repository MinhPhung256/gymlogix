import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, ImageBackground, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Card, RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { getMealPlansByGoal } from '../../configs/Apis';

const MealPlan = () => {
  const [goal, setGoal] = useState('maintain');
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    fetchMealPlans();
  }, [goal]);

  const fetchMealPlans = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await getMealPlansByGoal(token, goal);
      setMealPlans(res.data); // dữ liệu backend trả về
    } catch (error) {
      console.error("Lỗi load meal plans:", error);
      setMealPlans([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/Images/background1.jpg')} 
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.box}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
            <MaterialIcons name="arrow-back-ios" size={20} color="#000099" />
          </TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#000099', marginLeft:15, marginTop: 10, marginBottom: 15}}>
            Thực đơn dinh dưỡng
          </Text>
        </View>

          <RadioButton.Group onValueChange={setGoal} value={goal}>
            <RadioButton.Item label="Duy trì cân nặng" value="maintain" color="#000099" />
            <RadioButton.Item label="Giảm cân" value="lose" color="#000099" />
            <RadioButton.Item label="Tăng cơ" value="gain" color="#000099" />
          </RadioButton.Group>

          {loading ? (
            <ActivityIndicator size="large" color="#000099" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={mealPlans}
              keyExtractor={(item) => item.id.toString()}
              style={{ marginTop: 12 }}
              renderItem={({ item }) => (
                <Card style={styles.card}>
                  <Image 
                    source={item.image ? { uri: item.image } : require('../../assets/Images/default_meal.jpg')}
                    style={styles.cardImage}
                  />
                  <Card.Content>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.date}>Ngày: {item.date}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.calories}>Năng lượng: {item.calories_intake} kcal</Text>
                  </Card.Content>
                </Card>
              )}
              ListEmptyComponent={<Text style={styles.empty}>Không có món ăn phù hợp</Text>}
            />
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 10
  },
  box: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000099',
    padding: 16,
    marginTop: 50
  },
  arrowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30,
    marginBottom: 12
  },
  boxTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000099',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10
  },
  card: { 
    marginBottom: 12, 
    borderRadius: 15, 
    backgroundColor: '#fff', 
    elevation: 3,
    borderWidth: 1,
    borderColor: '#000099'
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginBottom: 8
  },
  name: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#000099', 
    marginBottom: 6
  },
  date: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 4
  },
  description: { 
    fontSize: 14, 
    marginBottom: 4
  },
  calories: { 
    fontSize: 14, 
    fontStyle: 'italic', 
    color: '#B00000'
  },
  empty: { 
    marginTop: 20, 
    textAlign: 'center', 
    color: '#999' 
  },
});

export default MealPlan;
