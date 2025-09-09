import React, { useState } from "react";
import { View, Text as RNText, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { Button, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/Apis"; 
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ChangePassword = () => {
  const nav = useNavigation();
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fields = [
    { label: "Mật khẩu hiện tại", field: "current_password", icon: "lock", secure: true },
    { label: "Mật khẩu mới", field: "new_password", icon: "lock", secure: true },
    { label: "Xác nhận mật khẩu mới", field: "confirm_password", icon: "lock-check", secure: true },
  ];

  const updatePassword = (value, field) => {
    setPasswords({ ...passwords, [field]: value });
    setErrors({ ...errors, [field]: false });
  };

  const validateFields = () => {
    const newErrors = {};
    let isValid = true;
    Object.keys(passwords).forEach((key) => {
      if (!passwords[key]) {
        newErrors[key] = true;
        isValid = false;
      }
    });
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

      await authApis(token).patch(endpoints['change-password'], {
        current_password: passwords.current_password,
        new_password: passwords.new_password,
        confirm_password: passwords.confirm_password
      });

      Alert.alert("Đổi mật khẩu", "Mật khẩu đã được thay đổi.");
      setPasswords({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      console.error(err);
      Alert.alert("Đổi mật khẩu", "Không thể thay đổi mật khẩu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/Images/background1.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.box}>
            {/* Header với mũi tên */}
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={() => nav.goBack()} style={styles.arrowButton}>
                <MaterialIcons name="arrow-back-ios" size={20} color="#000099" />
              </TouchableOpacity>
              <RNText style={styles.headerText}>Đổi mật khẩu</RNText>
            </View>

            {/* Inputs */}
            {fields.map((f) => (
              <TextInput
                key={f.field}
                label={f.label}
                value={passwords[f.field]}
                onChangeText={(t) => updatePassword(t, f.field)}
                secureTextEntry={f.secure}
                style={styles.input}
                mode="outlined"
                theme={{ colors: { primary: "#000099" } }}
                outlineColor={errors[f.field] ? "red" : "#000099"}
                activeOutlineColor="#000099"
                dense
                right={<TextInput.Icon icon={f.icon} />}
              />
            ))}

            {/* Button */}
            <Button
              mode="contained"
              onPress={changePassword}
              loading={loading}
              disabled={loading}
              style={styles.button}
              buttonColor="#000099"
            >
              Đổi mật khẩu
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", padding: 20 },
  box: {
    width: "90%",
    alignSelf: "center",
    padding: 20,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: "#000099",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  headerContainer: { 
    flexDirection: "row", 
    alignItems: "center", marginBottom: 20 
  },
  arrowButton: { 
    marginRight: 35
  },
  headerText: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#000099", 
    marginRight: 35
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
    borderRadius: 20
  },
});

export default ChangePassword;