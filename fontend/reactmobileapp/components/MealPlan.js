import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { Card, RadioButton } from 'react-native-paper';

const allMealPlans = {
  gain: [
    {
      id: '1',
      name: 'Bữa sáng tăng cơ',
      date: '2025-06-01',
      description: 'Ức gà nướng, cơm gạo lứt, rau xanh',
      calories_intake: 550,
    },
    {
      id: '2',
      name: 'Bữa phụ giàu protein',
      date: '2025-06-02',
      description: 'Sinh tố bơ + sữa hạnh nhân',
      calories_intake: 450,
    },
  ],
  lose: [
    {
      id: '3',
      name: 'Bữa sáng giảm cân',
      date: '2025-06-01',
      description: 'Salad rau củ, cá hồi nướng',
      calories_intake: 300,
    },
    {
      id: '4',
      name: 'Cháo yến mạch buổi sáng',
      date: '2025-06-02',
      description: 'Cháo yến mạch, trái cây tươi',
      calories_intake: 280,
    },
  ],
  maintain: [
    {
      id: '5',
      name: 'Duy trì năng lượng',
      date: '2025-06-01',
      description: 'Cơm gạo lứt, thịt bò, rau luộc',
      calories_intake: 400,
    },
    {
      id: '6',
      name: 'Canh cá cải bó xôi',
      date: '2025-06-02',
      description: 'Canh cải bó xôi, cá hấp',
      calories_intake: 420,
    },
  ],
};

const MealPlan = () => {
  const [goal, setGoal] = useState('maintain');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gợi ý thực đơn dinh dưỡng</Text>

      <RadioButton.Group onValueChange={setGoal} value={goal}>
        <RadioButton.Item label="Duy trì cân nặng" value="maintain" color="#B00000" />
        <RadioButton.Item label="Giảm cân" value="lose" color="#B00000" />
        <RadioButton.Item label="Tăng cơ" value="gain" color="#B00000" />
      </RadioButton.Group>

      <FlatList
        data={allMealPlans[goal]}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff' 
  },
  title: { 
    marginBottom: 16, 
    color: '#B00000', 
    fontWeight: 'bold', 
    fontSize: 22, 
    textAlign: 'center' 
  },
  card: { 
    marginBottom: 12, 
    borderRadius: 10, 
    elevation: 3, 
    padding: 8 
  },
  name: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#B00000', 
    marginBottom: 10
  },
  date: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 4 
  },
  description: { 
    fontSize: 14, 
    marginTop: 4 
  },
  calories: { 
    fontSize: 14, 
    marginTop: 4, 
    fontStyle: 'italic' 
  },
  empty: { 
    marginTop: 20, 
    textAlign: 'center', 
    color: '#999' 
  },
});

export default MealPlan;
