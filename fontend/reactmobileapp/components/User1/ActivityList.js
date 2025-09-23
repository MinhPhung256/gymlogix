import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, Text as RNText } from 'react-native';
import { Card, Button, Avatar } from 'react-native-paper';

const sampleActivities = [
  {
    id: 1,
    name: 'Chạy bộ buổi sáng',
    description: 'Chạy nhẹ 30 phút để khởi động cơ thể',
    calories_burned: 200,
    image_url: require('../../assets/ImgPlan/chaybo.jpg'),
  },
  {
    id: 2,
    name: 'Tập Yoga',
    description: 'Thư giãn và tăng độ dẻo dai',
    calories_burned: 150,
    image_url: require('../../assets/ImgPlan/yoga.jpg'),
  },
  {
    id: 3,
    name: 'Đạp xe',
    description: 'Đạp xe ngoài trời 45 phút',
    calories_burned: 300,
    image_url: require('../../assets/ImgPlan/dapxe.jpg'),
  },
  {
    id: 4,
    name: 'Tập thể dục',
    description: 'Tập thể dục buổi sáng',
    calories_burned: 300,
    image_url: require('../../assets/ImgPlan/theduc.jpg'),
  },
];

const LeftContent = (icon) => (props) => <Avatar.Icon {...props} icon={icon} style={styles.avatar} />;

const ActivityCard = ({ activity, onPress }) => (
  <TouchableOpacity onPress={() => onPress(activity)}>
    <Card style={styles.card}>
      <Card.Title
        title={activity.name}
        subtitle={activity.calories_burned ? `${activity.calories_burned} calo` : ''}
        left={LeftContent('run')}
      />
      <Card.Cover source={activity.image_url} style={styles.cardImage} />
      <Card.Content style={styles.cardContent}>
        <RNText style={styles.cardDescription}>{activity.description}</RNText>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button
          mode="contained"
          buttonColor="#000099"
          textColor="white"
          style={styles.button}
          onPress={() => onPress(activity)}
        >
          Xem
        </Button>
      </Card.Actions>
    </Card>
  </TouchableOpacity>
);

const ActivityList = ({ navigation }) => {
  const [activities] = useState(sampleActivities);

  const onActivityPress = (activity) => {
    navigation.navigate('ActivityDetail', { activity });
  };

  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ActivityCard activity={item} onPress={onActivityPress} />}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 16,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,            // thêm borderWidth để hiển thị viền
    borderColor: '#000099',    // viền màu xanh
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
    width: '95%',              // card rộng 95% parent
    alignSelf: 'center',       // căn giữa card
    textAlign: 'center',
  },
  cardContent: {
    marginTop: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#333',
  },
  cardImage: {
    borderRadius: 12,
  },
  cardActions: {
    marginTop: 12,
  },
  button: {
    borderRadius: 12,
  },
  avatar: {
    backgroundColor: '#000099',
  },
});

export default ActivityList;
