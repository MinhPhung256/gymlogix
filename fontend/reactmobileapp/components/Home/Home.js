import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, ImageBackground, FlatList } from 'react-native';
import MyStyles from '../../styles/MyStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { iconItems } from '../constant/Icon';
import ActivityList from '../User1/ActivityList';

const Home = ({ navigation }) => {

  const renderHeader = () => (
    <View>
      {/* Top logo và tiêu đề */}
      <View style={MyStyles.topContainer}>
        <Image source={require('../../assets/Images/logo3.png')} style={MyStyles.logo} />
        <Text style={MyStyles.title1}>HEALIO</Text>
        <Text style={MyStyles.subtitle1}>Chào mừng bạn đã quay trở lại!</Text>
      </View>

      {/* Box trắng chứa icon + activity */}
      <View style={[MyStyles.box1, { alignSelf: 'center', marginBottom: 20 }]}>
        {/* Icon features */}
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

        {/* Tiêu đề hoạt động */}
        <Text style={[MyStyles.activityTitle, { alignSelf: 'center', marginVertical: 8 }]}>
          ------- Gợi ý các hoạt động -------
        </Text>

        {/* ActivityList nằm trong box */}
        <ActivityList navigation={navigation} />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#000099" translucent />

      <ImageBackground 
        source={require('../../assets/Images/background1.jpg')} 
        style={{ flex: 1, width: '100%' }}
        resizeMode="cover"
      >
        <FlatList
          data={[]} // Không cần data ở đây
          renderItem={null}
          ListHeaderComponent={renderHeader()}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </ImageBackground>
    </View>
  );
};

export default Home;
