import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, ActivityIndicator } from "react-native";
import { Card, Text } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";

const StaUser = () => {
  const nav = useNavigation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    connectedUsers: 0,
    chattingUsers: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const api = authApis(token);

        // Giữ nguyên cấu trúc xử lý dữ liệu cũ
        const resHealth = await api.get(endpoints["healthrecord-list"]);
        const records = Array.isArray(resHealth.data.results) ? resHealth.data.results : resHealth.data;

        // Giả lập thống kê từ dữ liệu healthRecords
        const totalUsers = records.length;
        const connectedUsers = records.filter(r => r.connected).length;
        const chattingUsers = records.filter(r => r.chatting).length;
        const activeUsers = records.filter(r => r.duration > 0).length;

        setStats({ totalUsers, connectedUsers, chattingUsers, activeUsers });
      } catch (err) {
        console.error("Lỗi fetch thống kê:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#000099" style={{ flex: 1, justifyContent: "center", marginTop: 50 }} />;
  }

  const cardData = [
    { label: "Tổng học viên", value: stats.totalUsers, icon: "people" },
    { label: "Học viên kết nối", value: stats.connectedUsers, icon: "link" },
    { label: "Học viên nhắn tin", value: stats.chattingUsers, icon: "chat" },
    { label: "Học viên hoạt động", value: stats.activeUsers, icon: "flag" },
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
            <Text style={styles.headerText}>Thống kê người dùng</Text>
          </View>

          {/* Cards 2 hàng 2 cột */}
          <View style={styles.cardsContainer}>
            {cardData.map((item, idx) => (
              <Card key={idx} style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <MaterialIcons name={item.icon} size={30} color="#000099" />
                  <Text style={styles.cardLabel}>{item.label}</Text>
                  <Text style={styles.cardValue}>{item.value}</Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%" },
  scrollContainer: { flexGrow: 1, padding: 20 },
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
  headerContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  arrowButton: { marginRight: 20 },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#000099", marginTop: 10 },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // khoảng cách ngang đều
  },
  card: { 
    width: "48%", // 2 cột, cách nhau ~4%
    aspectRatio: 1, // chiều cao bằng chiều rộng → vuông
    marginBottom: 16, // khoảng cách dọc giữa các hàng
    borderRadius: 12, 
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center", // căn giữa nội dung
    padding: 12,
  },
  cardContent: { 
    alignItems: "center", 
    justifyContent: "center", 
  },
  cardLabel: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#333", 
    marginTop: 8, 
    textAlign: "center" 
  },
  cardValue: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#000099", 
    marginTop: 6 
  },
});

export default StaUser;
