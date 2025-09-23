import React, { useState, useEffect } from "react";
import { View, ScrollView, Image, StyleSheet, Alert } from "react-native";
import { Card, Text, Button, ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/Apis";

const defaultAvatar = require("../../assets/Images/default_avatar.jpg");

const ExpertInfo = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // trạng thái xác nhận từng user
  const [confirmedIds, setConfirmedIds] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Chưa đăng nhập");

      const res = await authApis(token).get(endpoints["get-all-users"], { params: { role: 1 } });
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
      Alert.alert("Lỗi", "Không thể lấy danh sách người dùng");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleConfirm = (userId) => {
    setConfirmedIds(prev => [...prev, userId]);
  };

  const handleCancel = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setConfirmedIds(prev => prev.filter(id => id !== userId));
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#000099" />
      </View>
    );
  }

  if (!users.length) {
    return (
      <View style={styles.center}>
        <Text>Chưa có người dùng nào!</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {users.map((user) => {
        const isConfirmed = confirmedIds.includes(user.id);

        return (
          <Card key={user.id} style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Image
                source={user.avatar_url ? { uri: user.avatar_url } : defaultAvatar}
                style={styles.avatar}
              />
              <View style={styles.info}>
                <Text style={styles.name}>{user.username}</Text>
                {user.email && <Text style={styles.email}>{user.email}</Text>}
                {user.specialty && <Text style={styles.specialty}>{user.specialty}</Text>}
              </View>
            </Card.Content>
            <Card.Actions>
              {isConfirmed ? (
                <Text style={styles.confirmedText}>Đã xác nhận</Text>
              ) : (
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                  <Button
                    mode="contained"
                    buttonColor="#000099"
                    textColor="#fff"
                    style={styles.actionBtn}
                    onPress={() => handleConfirm(user.id)}
                  >
                    Xác nhận
                  </Button>
                  <Button
                    mode="outlined"
                    buttonColor="#fff"
                    textColor="#000099"
                    style={styles.actionBtn}
                    onPress={() => handleCancel(user.id)}
                  >
                    Huỷ
                  </Button>
                </View>
              )}
            </Card.Actions>

          </Card>
        );
      })}
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
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
  },
  confirmedText: {
    flex: 1,
    color: "#008000",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ExpertInfo;
