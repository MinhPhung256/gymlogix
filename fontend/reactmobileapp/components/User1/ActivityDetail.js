import React from 'react';
import { View, ScrollView, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from '@react-navigation/native';

const ActivityDetail = ({ route }) => {
  const { activity } = route.params;
  const navigation = useNavigation();

  const dateNow = new Date();
  const formattedDate = dateNow.toLocaleDateString();
  const timeRange = activity.time || activity.subtitle || '30 phút';
  
  // Nếu activity chưa có tác dụng, để mặc định
  const effectText = activity.effect || "Hoạt động này giúp cải thiện sức khỏe tổng thể, tăng cường thể lực và tinh thần.";

  return (
    <ImageBackground
      source={require('../../assets/Images/background1.jpg')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.box}>
          {/* Mũi tên quay lại */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back-ios" size={24} color="#000099" />
          </TouchableOpacity>

          {/* Tiêu đề hoạt động */}
          <Text style={styles.title}>{activity.name || activity.title || 'Hoạt động'}</Text>

          {/* Ngày và thời gian */}
          <Text style={styles.dateTime}>Ngày: {formattedDate} | Thời gian: {timeRange}</Text>

          {/* Card chi tiết */}
          <Card style={styles.card}>
            <Card.Cover
              source={
                typeof activity.image_url === 'string'
                  ? { uri: activity.image_url } // URL
                  : activity.image_url         // require local
              }
              style={styles.cardImage}
            />
            <Card.Content style={styles.cardContent}>
              <Text variant="bodyLarge">{activity.description}</Text>
              
              {/* Tác dụng/giới thiệu */}
              <Text style={styles.effectTitle}>Tác dụng:</Text>
              <Text style={styles.effectText}>{effectText}</Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  box: {
    width: '100%',
    padding: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.7)', // box mờ
    borderWidth: 1,
    borderColor: '#000099',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
    marginTop: 60,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000099',
    marginBottom: 8,
    textAlign: "center"
  },
  dateTime: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff', // card không mờ
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#000099',    // viền màu xanh
  },
  cardImage: {
    borderRadius: 12,
  },
  cardContent: {
    marginTop: 12,
  },
  effectTitle: {
    marginTop: 12,
    fontWeight: 'bold',
    color: '#000099',
    fontSize: 16
  },
  effectText: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
});

export default ActivityDetail;
