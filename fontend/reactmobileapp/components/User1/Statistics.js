import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, ActivityIndicator } from "react-native";
import { Card, Text, ProgressBar } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";

const StatisticsBox = () => {
  const nav = useNavigation();
  const [loading, setLoading] = useState(true);
  const [healthRecords, setHealthRecords] = useState([]);
  const [goal, setGoal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const api = authApis(token);

        // Lấy HealthRecord
        const resHealth = await api.get(endpoints["healthrecord-list"]);
        const records = Array.isArray(resHealth.data.results) ? resHealth.data.results : resHealth.data;
        setHealthRecords(records);

        // Lấy Goal
        const resGoal = await api.get(endpoints["usergoal-list"]);
        setGoal(resGoal.data[0] || null);
      } catch (err) {
        console.error("Lỗi fetch thống kê:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#000099" style={{ flex: 1, justifyContent: "center", marginTop: 50 }} />;
  }

  if (!healthRecords.length) {
    return <Text style={{ textAlign: "center", marginTop: 50 }}>Chưa có dữ liệu sức khỏe!</Text>;
  }

  // Tính tổng các chỉ số
  let totalWater = 0,
      totalSteps = 0,
      totalBmi = 0,
      totalCalories = 0,
      totalDuration = 0;

  healthRecords.forEach((r) => {
    totalWater += r.water_intake ?? 0;
    totalSteps += r.steps ?? 0;
    totalBmi += parseFloat(r.bmi) || 0;
    totalCalories += r.calories_burned ?? 0;
    totalDuration += r.duration ?? 0;
  });

  const avgBmi = (totalBmi / healthRecords.length).toFixed(1);

  const cardData = [
    { label: "BMI trung bình", value: avgBmi, icon: "monitor-weight", unit: "" },
    { label: "Tổng bước chân", value: totalSteps, icon: "directions-walk", unit: " bước", progress: goal ? Math.min(totalSteps / (goal.target_steps || 10000), 1) : 0 },
    { label: "Nước đã uống", value: totalWater, icon: "local-drink", unit: " ml", progress: goal ? Math.min(totalWater / (goal.target_water || 2000), 1) : 0 },
    { label: "Calo tiêu thụ", value: totalCalories.toFixed(0), icon: "local-fire-department", unit: " cal", progress: goal ? Math.min(totalCalories / (goal.target_calories || 500), 1) : 0 },
    { label: "Thời gian tập", value: totalDuration, icon: "timer", unit: " phút", progress: goal ? Math.min(totalDuration / (goal.target_duration || 30), 1) : 0 },
  ];

  return (
    <ImageBackground source={require("../../assets/Images/background1.jpg")} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.box}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => nav.goBack()} style={styles.arrowButton}>
              <MaterialIcons name="arrow-back-ios" size={20} color="#000099" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Thống kê sức khỏe</Text>
          </View>

          {/* Cards */}
          {cardData.map((item, idx) => (
            <Card key={idx} style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <MaterialIcons name={item.icon} size={30} color="#000099" />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.cardLabel}>{item.label}</Text>
                  <Text style={styles.cardValue}>{item.value}{item.unit}</Text>
                  {item.progress !== undefined && <ProgressBar progress={item.progress} color="#000099" style={{ marginTop: 6, height: 8, borderRadius: 5 }} />}
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    width: "100%" 
  },
  scrollContainer: { 
    flexGrow: 1, 
    padding: 20 
  },
  box: {
    width: "98%",
    alignSelf: "center",
    padding: 20,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: "#000099",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 50,
    marginBottom: 50,
  },
  headerContainer: {
     flexDirection: "row", 
     alignItems: "center", 
     marginBottom: 20 
    },
  arrowButton: { 
    marginRight: 20 
  },
  headerText: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#000099", 
    marginTop: 10, 
    marginBottom:10, 
    marginLeft:10 
  },
  card: { 
    marginBottom: 16, 
    borderRadius: 12, 
    backgroundColor: "rgba(255,255,255,0.7)" 
  },
  cardContent: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  cardLabel: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#333" 
  },
  cardValue: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#000099", 
    marginTop: 4 
  },
});

export default StatisticsBox;
