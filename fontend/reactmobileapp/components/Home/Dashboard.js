import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import MyStyles from '../../styles/MyStyles';

const Dashboard = ({ navigation }) => {
  return (
    <ImageBackground 
      source={require('../../assets/Images/background1.jpg')} 
      style={MyStyles.background}
      resizeMode="cover"
    >
      <View style={MyStyles.box}>
        <Image 
          source={require('../../assets/Images/logo3.png')} 
          style={MyStyles.logo} 
        />
        <Text style={MyStyles.title}>HEALIO</Text>
        <Text style={MyStyles.subtitle}>Ứng dụng chăm sóc sức khoẻ</Text>

        {/* Nút Đăng ký */}
        <TouchableOpacity 
          style={MyStyles.registerButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={MyStyles.registerText}>Đăng ký</Text>
        </TouchableOpacity>

        {/* Nút Đăng nhập */}
        <TouchableOpacity 
          style={MyStyles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={MyStyles.loginText}>Đăng nhập</Text>
        </TouchableOpacity>

        {/* Hoặc đăng nhập bằng */}
        <Text style={MyStyles.orText}>Hoặc đăng nhập bằng</Text>
        <View style={MyStyles.socialContainer}>
          <TouchableOpacity style={MyStyles.socialButton}>
            <Image 
              source={require('../../assets/Images/google.png')} 
              style={MyStyles.socialIcon} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={MyStyles.socialButton}>
            <Image 
              source={require('../../assets/Images/facebook.png')} 
              style={MyStyles.socialIcon} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Dashboard;
