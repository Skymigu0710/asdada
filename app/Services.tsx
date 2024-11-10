import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Contact = {
    id: string;
    name: string;
    phone: string;
};

const emergencyContacts: Contact[] = [
    { id: '1', name: 'Policía', phone: '911 ' },
    { id: '2', name: 'Bomberos', phone: '456' },
    { id: '3', name: 'Ambulancia', phone: '789' },
    { id: '4', name: 'Protección Civil', phone: '101' },
];

const ContactItem: React.FC<Contact> = ({ name, phone }) => {
    const handlePress = () => {
        const url = `tel:${phone}`;
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert('Error', 'No se puede abrir el marcador de teléfono.');
                }
            })
            .catch((err) => console.error('Error al abrir el marcador: ', err));
    };

    return (
        <TouchableOpacity style={styles.contactItem} onPress={handlePress}>
            <Feather name="phone" size={24} color="green" style={styles.icon} />
            <View style={styles.contactText}>
                <Text style={styles.contactName}>{name}</Text>
                <Text style={styles.contactPhone}>{phone}</Text>
            </View>
        </TouchableOpacity>
    );
};

const EmergencyContactsScreen: React.FC = () => {
    return (
        <View style={styles.containerGeneral}>
            <View style={styles.container}>

                <Text style={styles.title}>Contactos de Emergencia</Text>
                <FlatList
                    data={emergencyContacts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ContactItem {...item} />}
                />
                <Text style={{fontSize:16}}>*Presiona en el ícono para llamar</Text>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    containerGeneral:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
        padding: 20,
    },
    container: {
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
        color: 'green',
    },
});

export default EmergencyContactsScreen;
