import React, { useState, useContext, useCallback } from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MyDispatchContext } from "../../configs/UserContext";
import { authApis, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const dispatch = useContext(MyDispatchContext);
  const nav = useNavigation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    dispatch({ type: "logout" });
    nav.navigate("HomeStack", { screen: "Dashboard" });
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadUser = async () => {
        try {
          setLoading(true);
          const token = await AsyncStorage.getItem("token");
          console.log("Token hiện tại:", token);
          let res = await authApis(token).get(endpoints["current-user"]);
          if (isActive) {
            setUser(res.data);
          }
        } catch (err) {
          console.error("Lỗi khi lấy thông tin user:", err);
          if (isActive) setUser(null);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      loadUser();

      return () => {
        isActive = false; 
      };
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Không thể tải thông tin người dùng.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
          ) : (
            <Image
              source={require("../../assets/Images/default_avatar.jpg")}
              style={styles.avatar}
            />
          )}
        </View>
        <Card.Content>
          <Text style={styles.label}>
            Tên người dùng: <Text style={styles.value}>{user.username}</Text>
          </Text>
          <Text style={styles.label}>
            Email: <Text style={styles.value}>{user.email}</Text>
          </Text>
          <Text style={styles.label}>
            Họ: <Text style={styles.value}>{user.last_name}</Text>
          </Text>
          <Text style={styles.label}>
            Tên: <Text style={styles.value}>{user.first_name}</Text>
          </Text>
          <Text style={styles.label}>
            Vai trò:{" "}
            <Text style={styles.value}>
              {user.role === 1
                ? "Người dùng tự theo dõi"
                : user.role === 2
                ? "Người dùng kết nối với chuyên gia"
                : user.role == 3
                ? "Huấn luyện viên"
                : "Khác"}
            </Text>
          </Text>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            textColor="#B00000"
            style={{ borderColor: "#B00000", borderWidth: 1, marginLeft: 20, marginBottom: 10 }}
            mode="outlined"
            onPress={() => nav.navigate("EditProfile", { userId: user.id })}
          >
            Chỉnh sửa
          </Button>
          <Button
            buttonColor="#B00000"
            textColor="white"
            style={{ marginRight: 20, marginBottom: 10 }}
            mode="contained"
            onPress={logout}
          >
            Đăng xuất
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  label: {
    fontWeight: "bold",
    marginTop: 8,
  },
  value: {
    fontWeight: "normal",
  },
  actions: {
    justifyContent: "space-between",
    marginTop: 16,
  },
});