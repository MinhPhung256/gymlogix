import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, ImageBackground } from 'react-native';
import MyStyles from '../../styles/MyStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { iconItems } from '../constant/Icon';
import ActivityList from '../ActivityList';

const Home = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#000099" translucent />
      <ImageBackground 
        source={require('../../assets/Images/background1.jpg')} 
        style={{ flex: 1, width: '100%' }}
        resizeMode="cover"
      >
        {/* Top logo và tiêu đề */}
        <View style={MyStyles.topContainer}>
          <Image source={require('../../assets/Images/logo3.png')} style={MyStyles.logo} />
          <Text style={MyStyles.title1}>HEALIO</Text>
          <Text style={MyStyles.subtitle1}>Chào mừng bạn đã quay trở lại!</Text>
        </View>

        {/* Box trắng chứa nội dung */}
        <View style={[MyStyles.box1, { alignSelf: 'center' }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={MyStyles.featuresContainer}>
              {iconItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={MyStyles.featureItem}
                  onPress={() => navigation.navigate(item.screen)}
                >
                  <View style={MyStyles.iconCircle}>
                    <MaterialCommunityIcons name={item.icon} size={30} color="#000099" />
                  </View>
                  <Text style={MyStyles.featureText}>{item.text}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={MyStyles.activityTitle}>------- Gợi ý các hoạt động -------</Text>
            <ActivityList navigation={navigation} />
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Home;
