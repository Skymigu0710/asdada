import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function () {
  const colorScheme: 'light' | 'dark' = useColorScheme() ?? 'light';

  // Estados para manejar los datos del formulario
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: name,
          apellido: lastName,
          email: email,
          telefono: phone,
          contrasena: password,
          direccion: address,
        }),
      });

      const data = await response.json();

      // Verificar si el código de estado es 201
      if (response.status === 201) {
        console.log(response)
        Alert.alert('Éxito', 'Registro exitoso');
      } else {
        console.log("xd")
        Alert.alert('Error', data?.message || 'Ocurrió un error');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Registro</Text>

      <TextInput
        style={[styles.input, { borderColor: Colors[colorScheme].tint }]}
        placeholder="Nombre"
        placeholderTextColor={colorScheme === 'light' ? '#888' : '#aaa'}
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={[styles.input, { borderColor: Colors[colorScheme].tint }]}
        placeholder="Apellido"
        placeholderTextColor={colorScheme === 'light' ? '#888' : '#aaa'}
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={[styles.input, { borderColor: Colors[colorScheme].tint }]}
        placeholder="Correo electrónico"
        placeholderTextColor={colorScheme === 'light' ? '#888' : '#aaa'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={[styles.input, { borderColor: Colors[colorScheme].tint }]}
        placeholder="Número de teléfono"
        placeholderTextColor={colorScheme === 'light' ? '#888' : '#aaa'}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={[styles.input, { borderColor: Colors[colorScheme].tint }]}
        placeholder="Contraseña"
        placeholderTextColor={colorScheme === 'light' ? '#888' : '#aaa'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={[styles.input, { borderColor: Colors[colorScheme].tint }]}
        placeholder="Dirección"
        placeholderTextColor={colorScheme === 'light' ? '#888' : '#aaa'}
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
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
});
