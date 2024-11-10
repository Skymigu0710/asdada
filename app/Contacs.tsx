import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';

interface Contact {
  id: number;
  nombre: string;
  telefono: string;
}

const ContactsScreen = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [nombre, setName] = useState('');
  const [telefono, setPhone] = useState('');
  const userId = '2'; // Reemplaza con el id de usuario necesario

  // Cargar contactos desde la API al iniciar la aplicación
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const response = await fetch(`https://newback-sr47.onrender.com/api/contactos-emergencia/${userId}`);
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error('Error al cargar contactos:', error);
      }
    };
    loadContacts();
  }, []);

  // Agregar un nuevo contacto usando la API
  const addContact = async () => {
    if (!nombre.trim() || !telefono.trim()) {
      Alert.alert('Error', 'Por favor, ingrese nombre y número de teléfono.');
      return;
    }

      const newContact = { nombre: name, telefono: telefono };
      const response = await fetch(`https://newback-sr47.onrender.com/api/contactos-emergencia/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContact),
      });

      if (!response.ok) {
        throw new Error('No se pudo agregar el contacto');
      }

      const addedContact = await response.json();
      setContacts([...contacts, addedContact]);
      setName('');
      setPhone('');

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Contactos de Emergencia</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Número de Teléfono"
          value={telefono}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.addButton} onPress={addContact}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subTitle}>Lista de Contactos de Emergencia</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Text style={styles.contactText}>{item.nombre}</Text>
            <Text style={styles.contactText}>{item.telefono}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
    borderColor: '#cccccc',
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  contactItem: {
    backgroundColor: '#d8f3dc',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ContactsScreen;
