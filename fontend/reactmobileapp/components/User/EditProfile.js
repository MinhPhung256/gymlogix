import React, { useState, useEffect } from "react";
import { ActivityIndicator } from 'react-native';
import { View, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView } from "react-native";
import { TextInput, Button, Text, Avatar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/Apis";
import { useRoute, useNavigation } from "@react-navigation/native";

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
  
        // Fetch current user
        const res = await authApis(token).get(endpoints["current-user"]);
  
        setFormData({
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          username: res.data.username || "",
          email: res.data.email || "",
          avatar: res.data.avatar_url || res.data.avatar || null,
        });
      } catch (err) {
        console.error(
          "Error loading user:",
          err.response?.status,
          err.response?.data || err.message
        );
        if (err.response?.status === 401) {
          Alert.alert("Lỗi", "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", [
            { text: "OK", onPress: () => nav.navigate("Login") },
          ]);
        } else {
          Alert.alert("Lỗi", "Không thể tải thông tin người dùng.");
        }
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
        Alert.alert(
          "Cấp quyền",
          "Cần quyền truy cập thư viện ảnh để chọn ảnh đại diện"
        );
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
        if (!token) {
          Alert.alert("Lỗi", "Bạn chưa đăng nhập", [
            { text: "OK", onPress: () => nav.navigate("Login") },
          ]);
          return;
        }
  
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value) {
            if (key === "avatar" && value.uri) {
              const uriParts = value.uri.split(".");
              const ext = uriParts[uriParts.length - 1].toLowerCase();
              const mimeType =
                ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`;
              data.append("avatar", {
                uri:
                  Platform.OS === "android"
                    ? value.uri
                    : value.uri.replace("file://", ""),
                type: mimeType,
                name: `avatar.${ext}`,
              });
            } else {
              data.append(key, value);
            }
          }
        });
  
        // Gọi API PUT cập nhật profile không cần userId trong URL
        const res = await authApis(token).patch(endpoints["update-user"], data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        Alert.alert("Thành công", "Thông tin đã được cập nhật");
        nav.goBack();
      } catch (err) {
        console.error(
          "Update error:",
          err.response?.status,
          err.response?.data || err.message
        );
        if (err.response?.status === 400) {
          const errors = err.response.data;
          const errorMessage =
            Object.values(errors).flat().join("\n") || "Dữ liệu không hợp lệ.";
          Alert.alert("Lỗi", errorMessage);
        } else if (err.response?.status === 401) {
          Alert.alert("Lỗi", "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", [
            { text: "OK", onPress: () => nav.navigate("Login") },
          ]);
        } else if (err.response?.status === 403) {
          Alert.alert("Lỗi", "Bạn không có quyền cập nhật thông tin này.");
        } else {
          Alert.alert("Lỗi", "Không thể cập nhật thông tin.");
        }
      } finally {
        setLoading(false);
      }
    };
  
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#B00000" />
        </View>
      );
    }
  
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text variant="titleLarge" style={styles.header}>
            Chỉnh sửa hồ sơ
          </Text>
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
            <Button
              mode="outlined"
              onPress={pickImage}
              style={styles.avatarButton}
              textColor="#B00000"
            >
              Đổi ảnh
            </Button>
          </View>
          <TextInput
            label="Tên"
            value={formData.first_name}
            onChangeText={(v) => setFormData({ ...formData, first_name: v })}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: "#B00000" } }}
          />
          <TextInput
            label="Họ"
            value={formData.last_name}
            onChangeText={(v) => setFormData({ ...formData, last_name: v })}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: "#B00000" } }}
          />
          <TextInput
            label="Tên người dùng"
            value={formData.username}
            onChangeText={(v) => setFormData({ ...formData, username: v })}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: "#B00000" } }}
          />
          <TextInput
            label="Email"
            value={formData.email}
            keyboardType="email-address"
            onChangeText={(v) => setFormData({ ...formData, email: v })}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: "#B00000" } }}
          />
          <Button
            mode="contained"
            onPress={handleSave}
            disabled={loading}
            loading={loading}
            style={styles.button}
            buttonColor="#B00000"
          >
            Lưu thay đổi
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      marginBottom: 20,
      textAlign: "center",
      color: "#B00000",
    },
    avatarContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    avatarButton: {
      marginTop: 8,
      borderColor: "#B00000",
    },
    input: {
      marginBottom: 16,
      backgroundColor: "white",
    },
    button: {
      marginTop: 16,
    },
  });
  
  export default EditProfile;