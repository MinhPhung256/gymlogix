import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, TouchableOpacity, ImageBackground, Text as RNText, Alert } from "react-native";
import { TextInput, Button, Avatar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const EditProfile = () => {
  const nav = useNavigation();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    avatar: null,
  });

  const [loading, setLoading] = useState(false);

  const loadUser = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Chưa đăng nhập");

      const res = await authApis(token).get(endpoints["current-user"]);

      setFormData({
        first_name: res.data.first_name || "",
        last_name: res.data.last_name || "",
        username: res.data.username || "",
        email: res.data.email || "",
        avatar: res.data.avatar_url || res.data.avatar || null,
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể tải thông tin người dùng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Cấp quyền", "Cần quyền truy cập thư viện ảnh để chọn ảnh đại diện");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFormData({ ...formData, avatar: result.assets[0] });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          if (key === "avatar" && value.uri) {
            const ext = value.uri.split(".").pop().toLowerCase();
            const mimeType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`;
            data.append("avatar", {
              uri: Platform.OS === "android" ? value.uri : value.uri.replace("file://", ""),
              type: mimeType,
              name: `avatar.${ext}`,
            });
          } else {
            data.append(key, value);
          }
        }
      });

      await authApis(token).patch(endpoints["update-user"], data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Thành công", "Thông tin đã được cập nhật");
      nav.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000099" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/Images/background1.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Box trắng */}
          <View style={styles.box}>
            {/* Tiêu đề với mũi tên */}
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={() => nav.goBack()} style={styles.arrowButton}>
                <MaterialIcons name="arrow-back-ios" size={20} color="#000099" />
              </TouchableOpacity>
              <RNText style={styles.headerText}>Chỉnh sửa hồ sơ</RNText>
            </View>

            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <Avatar.Image
                size={100}
                source={
                  formData.avatar?.uri
                    ? { uri: formData.avatar.uri }
                    : formData.avatar
                    ? { uri: formData.avatar }
                    : require("../../assets/Images/default_avatar.jpg")
                }
              />
              <Button mode="outlined" onPress={pickImage} style={styles.avatarButton} textColor="#000099">
                Đổi ảnh
              </Button>
            </View>

            {/* Inputs */}
            <TextInput
              label="Tên"
              value={formData.first_name}
              onChangeText={(v) => setFormData({ ...formData, first_name: v })}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: "#000099" } }}
              outlineColor="#000099"
              activeOutlineColor="#000099"
              dense
            />
            <TextInput
              label="Họ"
              value={formData.last_name}
              onChangeText={(v) => setFormData({ ...formData, last_name: v })}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: "#000099" } }}
              outlineColor="#000099"
              activeOutlineColor="#000099"
              dense
            />
            <TextInput
              label="Tên người dùng"
              value={formData.username}
              onChangeText={(v) => setFormData({ ...formData, username: v })}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: "#000099" } }}
              outlineColor="#000099"
              activeOutlineColor="#000099"
              dense
            />
            <TextInput
              label="Email"
              value={formData.email}
              keyboardType="email-address"
              onChangeText={(v) => setFormData({ ...formData, email: v })}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: "#000099" } }}
              outlineColor="#000099"
              activeOutlineColor="#000099"
              dense
            />

            {/* Button Lưu */}
            <Button
              mode="contained"
              onPress={handleSave}
              disabled={loading}
              loading={loading}
              style={styles.button}
              buttonColor="#000099"
            >
              Lưu thay đổi
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "90%",
    alignSelf: "center",
    padding: 20,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.7)", // làm mờ box
    borderWidth: 1,
    borderColor: "#000099",
    alignItems: "center",
    shadowColor: "#000",            // thêm bóng đổ nhẹ
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
  },

  arrowButton: {
      marginRight: 30, // tăng khoảng cách mũi tên với tiêu đề
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000099",
    marginRight: 20
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarButton: {
    marginTop: 8,
    borderColor: "#000099",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 20, // bo góc ô input
    width: "95%",
  },
  button: {
    marginTop: 16,
    width: "100%",
    borderRadius: 20, // bo góc button
  },
});

export default EditProfile;
