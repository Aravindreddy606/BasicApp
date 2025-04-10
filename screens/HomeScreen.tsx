import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      

          <View style={styles.container}>
              <Text style={styles.text}>Profile Screen</Text>
              <Button
                  title="Go to Profile"
                  onPress={() => navigation.navigate('LoginScreen')}
              />
              <Text style={styles.title}>Welcome to the Home Page</Text>
              <Text style={styles.subtitle}>This is where your app begins 🎉</Text>
              <Button title="Do Something" onPress={() => alert('Button Pressed!')} />
          </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
});

export default HomeScreen;
