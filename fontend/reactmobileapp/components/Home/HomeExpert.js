import React, { useState, useEffect } from "react";
import { View, Text, Image, StatusBar, ImageBackground, FlatList, Alert } from "react-native";
import MyStyles from "../../styles/MyStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";
import { Card, Button, ActivityIndicator } from "react-native-paper";

const defaultAvatar = require("../../assets/Images/default_avatar.jpg");

const HomeExpert = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

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
      Alert.alert("Lỗi", "Không thể lấy danh sách người dùng.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewProfile = (user) => {
    navigation.navigate("UserDetail", { userId: user.id });
  };

  const handleChat = (user) => {
    navigation.navigate("ChatStack", {
      screen: "Chat",          // tên màn hình thực tế trong ChatStack
      params: { selectedUser: user }, // truyền param đúng
    });
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Image
          source={item.avatar_url ? { uri: item.avatar_url } : defaultAvatar}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{item.username}</Text>
          {item.email && <Text style={styles.email}>{item.email}</Text>}
        </View>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button
          mode="outlined"
          buttonColor="#fff"
          textColor="#000099"
          style={{ flex: 1, marginRight: 8, borderRadius: 12 }}
          onPress={() => handleViewProfile(item)}
        >
          Xem thêm
        </Button>
        <Button
          mode="contained"
          buttonColor="#000099"
          textColor="#fff"
          style={{ flex: 1, borderRadius: 12 }}
          onPress={() => handleChat(item)}
        >
          Nhắn tin
        </Button>
      </Card.Actions>
    </Card>
  );

  const renderHeader = () => (
    <View>
      <View style={MyStyles.topContainer}>
        <Image source={require("../../assets/Images/logo3.png")} style={MyStyles.logo} />
        <Text style={MyStyles.title1}>HEALIO</Text>
        <Text style={MyStyles.subtitle1}>Chào mừng bạn đã quay trở lại!</Text>
      </View>

      {/* Box mờ chứa danh sách user */}
      <View style={styles.boxContainer}>
        <Text style={[MyStyles.activityTitle, { alignSelf: "center", marginVertical: 8, marginBottom: 20}]}>
          ------- Danh sách người dùng -------
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#000099" style={{ marginTop: 20 }} />
        ) : users.length === 0 ? (
          <Text style={{ textAlign: "center", marginVertical: 20 }}>Chưa có người dùng nào</Text>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            scrollEnabled={false} // để FlatList bên ngoài scroll
          />
        )}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#000099" translucent />
      <ImageBackground
        source={require("../../assets/Images/background1.jpg")}
        style={{ flex: 1, width: "100%" }}
        resizeMode="cover"
      >
        <FlatList
          data={[]} // không cần data, chỉ dùng để scroll
          renderItem={null}
          ListHeaderComponent={renderHeader()}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </ImageBackground>
    </View>
  );
};

const styles = {
  boxContainer: {
    width: "99%",
    alignSelf: "center",
    padding: 16,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: "#000099",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 20,
    marginBottom: 20,
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
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 2,
    marginBottom: 4,
  },
};

export default HomeExpert;
