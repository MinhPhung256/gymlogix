import React, { useState, useContext, useCallback } from "react";
import { View, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { Text, Card } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MyDispatchContext } from "../../configs/UserContext";
import { authApis, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
          let res = await authApis(token).get(endpoints["current-user"]);
          if (isActive) {
            setUser(res.data);
          }
        } catch (err) {
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

  // Danh sách menu card
  const menuItems = [
    { title: "Chỉnh sửa hồ sơ", screen: "EditProfile" },
    { title: "Đổi mật khẩu", screen: "ChangePassword" },
    { title: "Lịch sử hoạt động", screen: "ActivityHistory" },
    { title: "Cài đặt thông báo", screen: "NotificationSettings" },
  ];

  return (
    <View style={styles.container}>
      {/* Card thông tin user */}
      <Card style={styles.card}>
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
            Vai trò: <Text style={styles.value}>
              {user.role === 1 ? "Người dùng" : user.role === 2 ? "Huấn luyện viên" : "Khác"}
            </Text>
          </Text>
        </Card.Content>
      </Card>

      {/* ===== PHẦN ĐÃ SỬA: menu card nằm dưới card chính ===== */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuCard}
            onPress={() => nav.navigate(item.screen, { userId: user.id })}
          >
            <Text style={styles.menuText}>{item.title}</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#000099" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Button đăng xuất */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={logout}
      >
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderWidth: 1, 
    borderColor: '#000099', 
    borderRadius: 25, 
    marginBottom: 10
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
    color: '#023468'
  },
  value: {
    fontWeight: "normal",
    fontSize: 13
  },

  // ===== PHẦN ĐÃ SỬA: menu card =====
  menuContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  menuCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000099",
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    width: "95%",
    alignSelf: "center",
    backgroundColor: "white",
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000099",
  },

  logoutButton: {
    marginTop: 20,
    backgroundColor: "#000099",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    width: "85%",
    alignSelf: "center",
  },
  logoutText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
