import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StatusBar, SafeAreaView} from 'react-native';
import MyStyles from '../../styles/MyStyles';

import ActivityList from '../ActivityList';

  const HomeExpert = ({ navigation }) => {
    const [showRole, setShowRole] = useState(false);
    const currentRole = 'user';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="light-content" />
      <ScrollView>
        <View style={MyStyles.logoContainer}>
          <Image source={require('../../assets/Images/logo1.jpg')} style={MyStyles.logo} />
          <Text style={MyStyles.title}>HEALIO</Text>
          <Text style={MyStyles.subtitle}>Chào mừng bạn đã quay trở lại!</Text>
          <Text style={MyStyles.subtitle}>Chuyên gia dinh dưỡng</Text>
          <View style={MyStyles.buttonContainer}>
          </View>
        </View>
        
        <View>
          <Text style={{ color: '#B00000', textAlign: 'center', margin: 20,  fontWeight: 'bold' }}>
            ------- Danh sách các người dùng -------
          </Text>
          <ActivityList navigation={navigation} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeExpert;

