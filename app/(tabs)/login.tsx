import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
type LoginProps = {
  onLogin: () => void; 
};

export default function Login() {
  const colorScheme: 'light' | 'dark' = useColorScheme() ?? 'light';
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleLogin = async () => {
    try {
      const response = await fetch('https://newback-sr47.onrender.com/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telefono: phone,
          contrasena: password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const { contrasena, contactosEmergencia, ...userData } = data;
        console.log(data);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        router.push('/Menu');
        Alert.alert('Bienvenido', 'Inicio de sesión exitoso');
      } else {
        Alert.alert('Error', data?.message || 'Ocurrió un error');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>

      <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Inicia Sesión</Text>

      <TextInput
        style={[styles.input, { borderColor: Colors[colorScheme].tint }]}
        placeholder="Número de teléfono"
        placeholderTextColor={colorScheme === 'light' ? '#888' : '#aaa'}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input, { borderColor: Colors[colorScheme].tint }]}
        placeholder="Contraseña"
        placeholderTextColor={colorScheme === 'light' ? '#888' : '#aaa'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={{ color: Colors[colorScheme].text }}>¿No tienes una cuenta? </Text>

        <Link href="/register">
            <Text style={{ color: Colors[colorScheme].tint, fontWeight: 'bold' }}>Regístrate</Text>
        </Link>


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  sosButton: {
    backgroundColor: '#7f0000',
    padding: 20,
    borderRadius: 100,
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30, // Espacio adicional entre el botón SOS y el formulario
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  sosButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  }
});
