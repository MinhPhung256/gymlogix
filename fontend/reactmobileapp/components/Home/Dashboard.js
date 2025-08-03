import React from 'react';
import { Card, Button } from 'react-native-paper';
import { View, Text, Image, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Alert} from 'react-native';
import MyStyles from '../../styles/MyStyles';


const  Dashboard = ({ navigation }) => {
  const feature = () => {
    Alert.alert('Thông báo', 'Vui lòng đăng nhập để sử dụng tính năng này');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="light-content" />
      <ScrollView>
        <View style={MyStyles.logoContainer}>
          <Image source={require('../../assets/Images/logo1.jpg')} style={MyStyles.logo} />
          <Text style={MyStyles.title}>HEALIO</Text>
          <Text style={MyStyles.subtitle}>Đồng hành cùng sức khỏe của bạn</Text>
          <View style={MyStyles.buttonContainer}>
            <TouchableOpacity
              style={[MyStyles.button, MyStyles.registerButton]}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={MyStyles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[MyStyles.button, MyStyles.loginButton]}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={MyStyles.buttonText2}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={MyStyles.section}>
        <Text style={MyStyles.sectionTitle}>----- Tính năng nổi bật -----</Text>

        <Card style={MyStyles.card} >
          <Card.Title titleStyle={{ fontWeight: 'bold' }} title="Gợi ý tập luyện" />
          <Card.Content>
            <Text>Bài tập được cá nhân hóa dựa trên mục tiêu và thể trạng cơ thể</Text>
          </Card.Content>
        </Card>

        <Card style={MyStyles.card}>
          <Card.Title titleStyle={{ fontWeight: 'bold' }} title="Dinh dưỡng phù hợp mục tiêu" />
          <Card.Content>
            <Text>Gợi ý thực đơn cho tăng cơ, giảm cân, hoặc duy trì sức khỏe</Text>
          </Card.Content>
        </Card>

        <Card style={MyStyles.card}>
          <Card.Title titleStyle={{ fontWeight: 'bold' }} title="Nhắc nhở thông minh" />
          <Card.Content>
            <Text>Thông báo uống nước, nghỉ ngơi, luyện tập đúng giờ</Text>
          </Card.Content>
        </Card>

        <Card style={MyStyles.card}>
          <Card.Title titleStyle={{ fontWeight: 'bold' }} title="Chat với chuyên gia dinh dưỡng" />
          <Card.Content>
            <Text>Tính năng này yêu cầu đăng nhập</Text>
            <Button mode="outlined" onPress={feature} style={MyStyles.chatButton} labelStyle={{ color: '#B00000' }}>
              Trò chuyện ngay
            </Button>
          </Card.Content>
        </Card>
      </View>


<View style={MyStyles.section}>
        <Text style={MyStyles.sectionTitle}>Bạn là ai?</Text>
        <View style={MyStyles.roleButtons}>
          <TouchableOpacity
            style={[MyStyles.roleButton, { backgroundColor: '#757575' }]}
            onPress={() => navigation.navigate('Register', { role: 'user' })}
          >
            <Text style={MyStyles.roleText}>Tôi là người dùng cá nhân</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[MyStyles.roleButton, { backgroundColor: '#B00000' }]}
            onPress={() => navigation.navigate('Register', { role: 'expert' })}
          >
            <Text style={MyStyles.roleText}>Tôi là chuyên gia</Text>
          </TouchableOpacity>                                                                                   
        </View>
      </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;

