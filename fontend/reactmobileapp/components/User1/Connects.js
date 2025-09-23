import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, Image } from "react-native";
import { Card, Text, Button, ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";

const defaultAvatar = require("../../assets/Images/default_avatar.jpg"); // ảnh mặc định nếu không có avatar

const Connects = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Chưa đăng nhập");

      const res = await authApis(token).get(endpoints["get-all-users"], { params: { role: 2 } });

      // đảm bảo coaches là array
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setCoaches(data);
    } catch (err) {
      console.error("Error fetching coaches:", err.response?.data || err.message);
      Alert.alert("Lỗi", "Không thể lấy danh sách huấn luyện viên.");
      setCoaches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const handleConnect = (coach) => {
    navigation.navigate("ChatStack", {
      screen: "Chat",
      params: { coachId: coach.id, coachName: coach.username },
    });
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!coaches.length) {
    return (
      <View style={styles.center}>
        <Text>Chưa có huấn luyện viên nào!</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {coaches.map((coach) => (
        <Card key={coach.id} style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Image
              source={coach.avatar_url ? { uri: coach.avatar_url } : defaultAvatar}
              style={styles.avatar}
            />
            <View style={styles.info}>
              <Text style={styles.name}>{coach.username}</Text>
              {coach.email && <Text style={styles.email}>{coach.email}</Text>}
              {coach.specialty && <Text style={styles.specialty}>{coach.specialty}</Text>}
            </View>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              buttonColor="#000099"
              textColor="#fff"
              onPress={() => handleConnect(coach)}
              style={{ flex: 1, borderRadius: 12, marginTop: 10 }}
            >
              Kết nối
            </Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 30,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000099",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000099",
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  specialty: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
  },
});

export default Connects;
