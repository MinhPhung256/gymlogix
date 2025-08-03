import React, { useState } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;



const StatisticsScreen = () => {
  const [stats] = useState([
    { date: 'T2', calories: 1800, duration: 40 },
    { date: 'T3', calories: 2100, duration: 60 },
    { date: 'T4', calories: 1700, duration: 30 },
    { date: 'T5', calories: 2000, duration: 50 },
    { date: 'T6', calories: 1950, duration: 45 },
    { date: 'T7', calories: 2200, duration: 55 },
    { date: 'CN', calories: 1500, duration: 25 },
  ]);

  const labels = stats.map(item => item.date);
  const calories = stats.map(item => item.calories);
  const duration = stats.map(item => item.duration);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text variant="titleLarge" style={styles.title}>
      Thống kê hàng tuần
      </Text>

      <Card style={styles.card}>
        <Text style={styles.chartTitleCalories}>🔥 Calo tiêu thụ</Text>
        <BarChart
          data={{
            labels,
            datasets: [{ data: calories }],
          }}
          width={screenWidth - 48}
          height={220}
          fromZero
          showValuesOnTopOfBars
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`,
            labelColor: () => '#444',
            barPercentage: 0.6,
          }}
          style={{ borderRadius: 16 }}
        />
      </Card>

      <Card style={[styles.card, { marginBottom: 0 }]}>
        <Text style={styles.chartTitleDuration}>⏱️ Thời gian tập luyện</Text>
        <BarChart
          data={{
            labels,
            datasets: [{ data: duration }],
          }}
          width={screenWidth - 48}
          height={220}
          fromZero
          showValuesOnTopOfBars
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(30, 136, 229, ${opacity})`,
            labelColor: () => '#444',
            barPercentage: 0.6,
          }}
          style={{ borderRadius: 16 }}
        />
      </Card>
    </ScrollView>
  );
};

export default StatisticsScreen;


const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  title: {
    marginBottom: 24,
    fontWeight: '700',
    color: '#B00000',
    textAlign: 'center',
  },
  card: {
    padding: 20,
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, 
  },
  chartTitleCalories: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#ff6347', 
  },
  chartTitleDuration: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#1e88e5', 
  },
};
