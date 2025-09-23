import React, { useEffect, useState } from "react";
import { View, ScrollView, ImageBackground, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Card, ActivityIndicator } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/Apis";

const UserDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserHealth = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Chưa đăng nhập");

      const api = authApis(token);
      const res = await api.get(endpoints["healthrecord-list"], { params: { user: userId } });
      
      const allRecords = Array.isArray(res.data.results) ? res.data.results : res.data;

      // lọc theo userId
      const userRecords = allRecords.filter(r => r.user === userId || r.user?.id === userId);
      const updatedRecords = userRecords.map(r => ({
        ...r,
        bmi: r.bmi ?? (r.height && r.weight ? Number((r.weight / ((r.height / 100) ** 2)).toFixed(1)) : null)
      }));
      setHealthRecords(updatedRecords);
    } catch (err) {
      console.error("Error fetching health records:", err.response?.data || err.message);
      setHealthRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserHealth();
  }, []);

  return (
    <ImageBackground source={require("../../assets/Images/background1.jpg")} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.box}>
          {/* Back button + title */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <MaterialIcons name="arrow-back-ios" size={24} color="#000099" />
            </TouchableOpacity>
            <Text style={styles.title}>Thông tin sức khỏe</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#000099" style={{ marginTop: 20 }} />
          ) : healthRecords.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>Chưa có dữ liệu sức khỏe!</Text>
          ) : (
            healthRecords.map((item, index) => (
              <Card key={item.id ?? index} style={styles.card}>
                <Card.Content>
                  <Text>Ngày: {item.date ? new Date(item.date).toLocaleString() : "?"}</Text>
                  <Text>Chiều cao: {item.height ?? "?"} cm</Text>
                  <Text>Cân nặng: {item.weight ?? "?"} kg</Text>
                  <Text>BMI: {item.bmi != null ? item.bmi.toFixed(1) : "?"}</Text>
                  <Text>Bước chân: {item.steps ?? 0}</Text>
                  <Text>Nước uống: {item.water_intake ?? 0} ml</Text>
                  <Text>Nhịp tim: {item.heart_rate ?? "?"}</Text>
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  box: {
    width: "95%",
    alignSelf: "center",
    padding: 20,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: "#000099",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000099",
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000099",
    padding: 12,
  },
});

export default UserDetail;
