// src/screens/Home.tsx
import React, { useEffect, useState } from 'react';
import { ImageBackground, Vibration, ScrollView, View, Linking, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';

import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importa RootStackParamList desde App.tsx




export default function Menu() {

    const [UserName, setUserName] = useState('');

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('user');
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    setUserName(userData.nombre);

                }
            } catch (error) {
                console.error("Error al cargar datos de AsyncStorage:", error);
            }
        };

        cargarDatos();
    }, []);


    const phoneNumber = '+51955467648';

    const message = '¡Ayuda! Estoy en una situación de emergencia';

    const activateAlarm = () => {
        // Vibration - Hace vibrar el teléfono
        Vibration.vibrate([500, 500, 500]);  // Vibra tres veces con intervalos de 500ms

        // Abrir WhatsApp con el mensaje
        const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        Linking.openURL(url).catch((err) => console.error('No se pudo abrir WhatsApp:', err));
    };

    const showSecurityTips = () => {
        Alert.alert(
            "Consejos de Seguridad",
            "• Mantén las puertas y ventanas cerradas\n• Conoce a tus vecinos\n• Ten a mano números de emergencia\n• Mantén iluminado el exterior de tu casa",
            [{ text: "Entendido" }]
        );
    };
    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.text1}>ALERTA URBANA</Text>
                <Text style={styles.text2}>SOMOS TODOS</Text>
                <View style={styles.welcome}>
                    <Text style={styles.welcomeText}>BIENVENIDO {UserName.toUpperCase()},</Text>
                    <Text style={styles.text3}>¿Tienes una emergencia?</Text>
                    {/* Botón SOS */}

                    <TouchableOpacity
                        style={styles.sosButton}
                        onPress={activateAlarm}
                    >
                        <Text style={styles.sosButtonText}>SOS</Text>
                    </TouchableOpacity>
                </View>


                {/* Grid Layout (Botones de menú) */}
                <View style={styles.menuGrid}>
                    <TouchableOpacity
                        style={styles.menuButton}
                    //  onPress={() => navigation.navigate("ReportIncident")}
                    >
                        <Link href="/Reporte">
                            <View style={styles.stackLayout}>
                                <MaterialIcons name="report" size={60} color="red" />
                                <Text style={styles.menuButtonText}>Reportar</Text>
                                <Text style={styles.menuButtonSubText}>Incidente</Text>
                            </View>
                        </Link>

                    </TouchableOpacity>


                    <TouchableOpacity
                        style={styles.menuButton}
                    //  onPress={() => navigation.navigate("EmergencyServices")}
                    >
                        <Link href="/Services">
                            <View style={styles.stackLayout}>
                                <MaterialIcons name="contact-emergency" size={55} color="blue" />
                                <Text style={styles.menuButtonText}>Servicios</Text>
                                <Text style={styles.menuButtonSubText}>Emergencia</Text>
                            </View>
                        </Link>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuButton}
                    //onPress={() => navigation.navigate("Notifications")}
                    >
                        <Link href="/Contacs">
                            <View style={styles.stackLayout}>
                                <AntDesign name="contacts" size={60} color="purple" />
                                <Text style={styles.menuButtonText}>Registrar</Text>
                                <Text style={styles.menuButtonSubText}>Contactos</Text>

                            </View>
                        </Link>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.menuButton}>
                        <Link href="/ChatGlobal" >
                            <View style={styles.stackLayout}>
                                <FontAwesome5 name="user-friends" size={60} color="green" />

                                <Text style={styles.menuButtonText}>Comunidad</Text>

                                <Text style={styles.menuButtonSubText}>Nuestra</Text>

                            </View>
                        </Link>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuButton}
                    //  onPress={() => navigation.navigate("EmergencyServices")}
                    >
                        <Link href="/Perfil">
                            <View style={styles.stackLayout}>
                                <FontAwesome name="user" size={60} color="orange" />
                                <Text style={styles.menuButtonText}>Perfil</Text>
                                <Text style={styles.menuButtonSubText}>Hola!</Text>
                            </View>
                        </Link>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuButton}
                    // onPress={showSecurityTips}
                    >
                        <Link href="/Tips">
                            <View style={styles.stackLayout}>
                                <AntDesign name="checksquare" size={60} color="#d6d900" />
                                <Text style={styles.menuButtonText}>Consejos</Text>
                                <Text style={styles.menuButtonSubText}>informativos</Text>
                            </View>
                        </Link>
                    </TouchableOpacity>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.footerButton}>
                        <Ionicons name="exit-outline" size={30} color="black" />
                        <Text style={styles.menuButtonExit}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
    },

    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute', // Permite que la capa se superponga sobre la imagen
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white', // El color de la capa es negro
        opacity: 0.64, // Ajusta la opacidad (0 es completamente transparente, 1 es completamente opaco)
    },
    welcome: {
        backgroundColor: 'white',
        width: '60%',
        height: 160,
        margin: 10,
        padding: 20,
        borderRadius: 15,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        shadowColor: '#000',
        elevation: 8,
        marginTop: 80,
        alignItems: 'center',
        marginBottom: 160,
        marginLeft: 80
    },
    welcomeText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#2259a0'
    },
    sosButton: {
        backgroundColor: '#1d66c2',
        padding: 20,
        marginTop: '20%',
        marginBottom: '10%',
        borderRadius: 100,
        width: 160,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 90, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 10,
        borderWidth: 5,
        borderColor: '#1d66c2',

    },
    sosButtonText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    footerButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuButtonExit: {
        color: 'black',
        fontSize: 16,
        marginLeft: 10, // espacio entre el icono y el texto

    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },

    menuButton: {
        // estilos para el botón
        backgroundColor: 'white',
        width: '44%',
        height: 160,
        margin: 10,
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        shadowColor: '#000',
        elevation: 8,
    },
    stackLayout: {
        flexDirection: 'column', // apilar icono y textos verticalmente
        alignItems: 'center',
    },
    menuButtonText: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
    },
    menuButtonSubText: {
        fontSize: 14,
        color: 'black',
    },
    text1: {
        fontSize: 33,
        fontWeight: 'bold',
        marginTop: 90,
        marginLeft: 10,
        textAlign: 'center',
        color: '#025d84',
    },
    text2: {
        fontSize: 20,
        marginLeft: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#4d7fc0'
    },
    text3: {
        fontSize: 15,
        textAlign: 'center',
        color: 'black',
    },
});