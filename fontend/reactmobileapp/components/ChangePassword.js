import React, { useState } from "react";
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../configs/Apis"; 
import { useNavigation } from "@react-navigation/native";

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "", // đã thay confirm thành confirm_password
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const nav = useNavigation();

  const users = {
    current_password: {
      title: "Mật khẩu hiện tại",
      field: "current_password",
      secure: true,
      icon: "eye",
    },
    new_password: {
      title: "Mật khẩu mới",
      field: "new_password",
      secure: true,
      icon: "lock",
    },
    confirm_password: { 
      title: "Xác nhận mật khẩu mới",
      field: "confirm_password", 
      secure: true,
      icon: "lock-check",
    },
  };

  const updatePassword = (value, field) => {
    setPasswords({ ...passwords, [field]: value });
    setErrors({ ...errors, [field]: false });
  };

  const validateFields = () => {
    const newErrors = {};
    let isValid = true;
    if (!passwords.current_password) {
      newErrors.current_password = true;
      isValid = false;
    }
    if (!passwords.new_password) {
      newErrors.new_password = true;
      isValid = false;
    }
    if (!passwords.confirm_password) { 
      newErrors.confirm_password = true; 
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const changePassword = async () => {
    if (!validateFields()) {
      Alert.alert("Đổi mật khẩu", "Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (passwords.new_password !== passwords.confirm_password) { 
      Alert.alert("Đổi mật khẩu", "Mật khẩu và xác nhận không trùng khớp!");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Lỗi", "Bạn chưa đăng nhập");
        return;
      }

      const api = authApis(token);
      await api.patch(endpoints['change-password'], {
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      });

      Alert.alert("Đổi mật khẩu", "Mật khẩu đã được thay đổi.");
      setPasswords({
        current_password: "",
        new_password: "",
        confirm_password: "", 
      });
    } catch (error) {
      Alert.alert("Đổi mật khẩu", "Không thể thay đổi mật khẩu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        {Object.values(users).map((u) => (
          <TextInput
            key={u.field}
            label={u.title}
            value={passwords[u.field]}
            onChangeText={(t) => updatePassword(t, u.field)}
            secureTextEntry={u.secure}
            style={styles.input}
            left={<TextInput.Icon icon={u.icon} />}
            mode="outlined"
            outlineColor={errors[u.field] ? "red" : undefined}
            theme={{ colors: { primary: "#B00000" } }}
          />
        ))}
        <Button
          mode="contained"
          onPress={changePassword}
          loading={loading}
          disabled={loading}
          style={styles.button}
          buttonColor="#B00000"
        >
          Đổi mật khẩu
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  scrollView: {
    flexGrow: 1,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white",
  },
  button: {
    marginTop: 16,
    marginBottom: 20,
  },
});

export default ChangePassword;
