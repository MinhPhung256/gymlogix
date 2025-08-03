import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StatusBar, SafeAreaView} from 'react-native';
import MyStyles from '../../styles/MyStyles';
import ChooseRole from '../User/ChooseRole';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { iconItems } from '../constant/Icon';
import ActivityList from '../ActivityList';


const Home = ({ navigation }) => {
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
          <Text style={MyStyles.subtitle}>Chế độ tự theo dõi bản thân</Text>
          <View style={MyStyles.buttonContainer}>
            <TouchableOpacity
              style={[MyStyles.button, MyStyles.registerButton]}
              onPress={() => setShowRole(true)}
            >
              <Text style={MyStyles.buttonText}>Đổi chế độ</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={MyStyles.featuresContainer}>
          {iconItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={MyStyles.featureItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={[MyStyles.iconCircle, { backgroundColor: '#FFEBEE' }]}>
              <MaterialCommunityIcons name={item.icon} size={30} color="#BB0000" />
              </View>
              <Text style={MyStyles.featureText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View>
          <Text style={{ color: '#B00000', textAlign: 'center', margin: 20,  fontWeight: 'bold' }}>
            ------- Gợi ý các hoạt động -------
          </Text>
          <ActivityList navigation={navigation} />
        </View>
      </ScrollView>

      <ChooseRole
        visible={showRole}
        onClose={() => setShowRole(false)}
        currentRole={currentRole}
      />
    </SafeAreaView>
  );
};

export default Home;

