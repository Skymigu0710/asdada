import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Contact = {
  id: string;
  name: string;
  phone: string;
};

const emergencyContacts: Contact[] = [
  { id: '1', name: 'Policía', phone: '911' },
  { id: '2', name: 'Bomberos', phone: '911' },
  { id: '3', name: 'Ambulancia', phone: '911' },
  { id: '4', name: 'Protección Civil', phone: '911' },
];

const ContactItem: React.FC<Contact> = ({ name, phone }) => (
  <View style={styles.contactItem}>
    <Feather name="phone" size={24} color="black" style={styles.icon} />
    <View style={styles.contactText}>
      <Text style={styles.contactName}>{name}</Text>
      <Text style={styles.contactPhone}>{phone}</Text>
    </View>
  </View>
);

const EmergencyContactsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contactos de Emergencia</Text>
      <FlatList
        data={emergencyContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContactItem {...item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 10,
  },
  contactText: {
    flexDirection: 'column',
  },
  contactName: {
    fontSize: 18,
  },
  contactPhone: {
    fontSize: 16,
    color: 'gray',
  },
});

export default EmergencyContactsScreen;