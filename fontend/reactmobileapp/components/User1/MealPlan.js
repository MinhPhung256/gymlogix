import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, ImageBackground, Image, Alert, ActivityIndicator, Text as RNText, TouchableOpacity } from 'react-native';
import { Card, RadioButton, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getMealPlansByGoal } from '../../configs/Apis';

const MealPlan = () => {
  const [goal, setGoal] = useState('maintain');
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedMeals, setSavedMeals] = useState([]);
  const navigation = useNavigation();

  const fetchMealPlans = async (selectedGoal) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Chưa có token');

      const res = await getMealPlansByGoal(token, selectedGoal);
      const plans = Array.isArray(res.data) ? res.data : res.data.results || [];
      setMealPlans(plans);
    } catch (err) {
      console.error('Lỗi fetch meal plans:', err);
      setMealPlans([]);
      Alert.alert('Lỗi', 'Không thể tải thực đơn từ server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealPlans(goal);
  }, [goal]);

  const saveMeal = (meal) => {
    if (savedMeals.find(m => m.id === meal.id)) {
      Alert.alert('Thông báo', 'Món này đã lưu rồi!');
      return;
    }
    setSavedMeals(prev => [...prev, meal]);
    Alert.alert('Thành công', 'Đã thêm món vào thực đơn của tôi');
  };

  const stripHtml = (html) => {
    if (!html) return '';
    // loại bỏ thẻ HTML và decode entities cơ bản
    return html.replace(/<[^>]*>/g, '')
               .replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&quot;/g, '"')
               .replace(/&#39;/g, "'");
  };

  return (
    <ImageBackground source={require('../../assets/Images/background1.jpg')} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.box}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
              <MaterialIcons name="arrow-back-ios" size={24} color="#000099" />
            </TouchableOpacity>
            <RNText style={styles.title}>Thực đơn dinh dưỡng</RNText>
          </View>

          {/* chọn goal */}
          <RadioButton.Group onValueChange={setGoal} value={goal}>
            <RadioButton.Item label="Duy trì cân nặng" value="maintain" color="#000099" />
            <RadioButton.Item label="Giảm cân" value="lose" color="#000099" />
            <RadioButton.Item label="Tăng cơ" value="gain" color="#000099" />
          </RadioButton.Group>

          {loading ? (
            <ActivityIndicator size="large" color="#000099" style={{ marginTop: 20 }} />
          ) : (
            <>
              {mealPlans.length === 0 && (
                <RNText style={styles.empty}>Không có món ăn phù hợp</RNText>
              )}
              {mealPlans.map(item => (
                <Card key={item.id} style={styles.card}>
                  <View style={styles.cardRow}>
                    {item.image ? (
                      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover"/>
                    ) : (
                      <View style={[styles.image, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
                        <RNText>Chưa có ảnh</RNText>
                      </View>
                    )}
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <RNText style={styles.name}>{stripHtml(item.name)}</RNText>
                      <RNText style={styles.dateText}>
                        Ngày cập nhật: {item.date ? new Date(item.date).toLocaleDateString() : 'Không rõ'}
                      </RNText>
                      <RNText style={styles.description}>{stripHtml(item.description)}</RNText>
                      <RNText style={styles.calories}>Năng lượng: {item.calories_intake} kcal</RNText>
                      <Button
                        mode="contained"
                        buttonColor="#000099"
                        textColor="white"
                        style={{ marginTop: 6 }}
                        onPress={() => saveMeal(item)}
                      >
                        Lưu vào thực đơn
                      </Button>
                    </View>
                  </View>
                </Card>
              ))}
            </>
          )}

          {/* Thực đơn của tôi */}
          {savedMeals.length > 0 && (
            <>
              <RNText style={styles.savedTitle}>Thực đơn của tôi</RNText>
              {savedMeals.map(meal => (
                <Card key={`saved-${meal.id}`} style={styles.card}>
                  <View style={styles.cardRow}>
                    {meal.image ? (
                      <Image source={{ uri: meal.image }} style={styles.image} resizeMode="cover"/>
                    ) : (
                      <View style={[styles.image, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
                        <RNText>Chưa có ảnh</RNText>
                      </View>
                    )}
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <RNText style={styles.name}>{stripHtml(meal.name)}</RNText>
                      <RNText style={styles.dateText}>Ngày cập nhật: {meal.date ? new Date(meal.date).toLocaleDateString() : 'Không rõ'}</RNText>
                      <RNText style={styles.description}>{stripHtml(meal.description)}</RNText>
                      <RNText style={styles.calories}>Năng lượng: {meal.calories_intake} kcal</RNText>
                    </View>
                  </View>
                </Card>
              ))}
              <Button
                mode="outlined"
                buttonColor="#000099"
                textColor="#fff"
                style={{ marginTop: 12, borderRadius: 12 }}
                onPress={() => Alert.alert('Thêm bữa ăn mới')}
              >
                + Thêm bữa ăn
              </Button>
            </>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 20, paddingHorizontal: 0 },
  box: {
    width: '95%',
    alignSelf: 'center',
    padding: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: '#000099',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 50,
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#000099', marginLeft: 20, marginTop: 10, marginBottom: 10 },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#000099',
  },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start' },
  image: { width: 80, height: 80, borderRadius: 12 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#000099', marginBottom: 4 },
  description: { fontSize: 14, color: '#333', marginBottom: 6, lineHeight: 20 },
  calories: { fontSize: 14, fontStyle: 'italic', color: '#B00000', marginBottom: 6 },
  empty: { textAlign: 'center', color: '#777', marginTop: 20 },
  dateText: { fontSize: 12, color: '#555', marginBottom: 4 },
  savedTitle: { fontWeight: 'bold', fontSize: 16, marginTop: 16, marginBottom: 8, color: '#000099' },
});

export default MealPlan;
