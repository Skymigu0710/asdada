import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title2}>Bienvenido a la aplicación.</Text>
      <Text style={styles.title}>Alerta Urbana</Text>
      <Text style={styles.title3}>¡Ahora podrás notificarnos en tiempo</Text>
      <Text style={styles.title3}>real tus emergencias las 24 horas y</Text>
      <Text style={styles.title4}>acceder a más recursos.</Text>
      <View style={styles.buttonContainer}>
        <Link href='/Menu'>
          <TouchableOpacity style={styles.sosButton}>
            <Text style={styles.sosButtonText}>SOS</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <Text style={styles.title5}>#AlertaUrbanaSomosTodos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
    paddingTop: 20,
    paddingLeft: 10,
    marginHorizontal: 5,
    marginLeft: 30,
  },
  buttonContainer: {
    flex: 1,
    paddingLeft: 70,
  },
  title: {
    fontSize: 70,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    marginBottom: 20,
    color: '#025d84',
  },
  sosButton: {
    backgroundColor: '#bb0000',
    padding: 20,
    borderRadius: 100,
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    marginTop: 100, // Espacio entre el título y el botón SOS
  },
  sosButtonText: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#fff',
  },
  title2: {
    fontSize: 20,
    marginBottom: 0,
    color: '#025d84',
  },
  title3: {
    fontSize: 17,
    color: '#8a8a8a',
    marginBottom: 0,
  },
  title4: {
    fontSize: 17,
    color: '#8a8a8a',
    marginBottom: 50,
  },
  title5: {
    fontSize: 19,
    color: '#32a0ad',
    marginBottom: 130,
    marginLeft: 30,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
