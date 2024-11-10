import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfile = () => {
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('user');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const usuarioIdStorage = userData.id;

          if (usuarioIdStorage) {
            setUsuarioId(usuarioIdStorage);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos de AsyncStorage:', error);
      }
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (usuarioId) {
        setIsLoading(true);

        try {
          const response = await fetch(`https://newback-sr47.onrender.com/api/usuarios/${usuarioId}`);
          const data = await response.json();

          if (response.ok) {
            setUserData(data);
          } else {
            setError('No se pudo cargar los datos del usuario.');
          }
        } catch (error) {
          console.error('Error al hacer la petición:', error);
          setError('Hubo un error al obtener los datos del usuario.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [usuarioId]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userData ? (
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6326/6326055.png' }} // Imagen de perfil aleatoria
            style={styles.profileImage}
          />
           <Text style={styles.nameText}>
            HOLA,
          </Text>
          <Text style={styles.nameText}>
            {userData.nombre} {userData.apellido}
          </Text>
          <Text style={styles.infoText}>Email: {userData.email}</Text>
          <Text style={styles.infoText}>Teléfono: {userData.telefono}</Text>
          <Text style={styles.infoText}>Dirección: {userData.direccion}</Text>
        </View>
      ) : (
        <Text>No se encontraron datos del usuario.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    height: '100%',
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 50,
    marginBottom: 20,
  },
  nameText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 17,
    color: '#555',
    marginBottom: 5,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default UserProfile;
