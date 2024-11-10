import { Link } from 'expo-router';
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';

type Chat = {
    id: string;
    name: string;
    lastMessage: string;
};

const chats: Chat[] = [
    { id: '1', name: 'Vecino 1', lastMessage: 'Hola, ¿cómo estás?' },
    { id: '2', name: 'Vecino 2', lastMessage: '¿Viste las noticias?' },
    { id: '3', name: 'Vecino 3', lastMessage: 'Reunión mañana a las 5 PM' },
    { id: '4', name: 'Vecino 4', lastMessage: 'Gracias por la ayuda' },
];

const ChatItem: React.FC<Chat> = ({ name, lastMessage }) => (
    <TouchableOpacity style={styles.chatItem}>
        <Text style={styles.chatName}>{name}</Text>
        <Text style={styles.chatMessage}>{lastMessage}</Text>
    </TouchableOpacity>
);

export default function HomeScreen() {
    const activateAlarm = () => {
        // Lógica para activar la alarma
    };

    const showSecurityTips = () => {
        Alert.alert(
            "Consejos de Seguridad",
            "• Mantén las puertas y ventanas cerradas\n• Conoce a tus vecinos\n• Ten a mano números de emergencia\n• Mantén iluminado el exterior de tu casa",
            [{ text: "Entendido" }]
        );
    };

    return (
        <View style={styles.container}>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    chatItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    chatName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    chatMessage: {
        fontSize: 16,
        color: 'gray',
    },
});