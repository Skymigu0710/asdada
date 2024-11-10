import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator, ScrollView, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hook para manejar permisos
const usePermission = (requestPermission: Function, permissionType: string) => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    const request = async () => {
        const { status } = await requestPermission();
        setHasPermission(status === 'granted');
        if (status !== 'granted') {
            Alert.alert(`${permissionType} Denegado`, `Se requiere permiso para acceder a ${permissionType}.`);
        }
    };

    return [hasPermission, request] as const;
};

export default function ReportIncident() {
    const [images, setImages] = useState<any[]>([]);
    const [audioRecording, setAudioRecording] = useState<Audio.Recording | null>(null); const [isLoading, setIsLoading] = useState(false);
    const [alertMessages, setAlertMessages] = useState<string[]>([]); // Historial de alertas
    const [showDetails, setShowDetails] = useState<boolean>(false); // Estado para mostrar los detalles del envío
    const [submittedData, setSubmittedData] = useState<any>(null); // Para guardar los datos del reporte enviado
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<Location.LocationObject | null>(null);
    const [grupoId, setGrupoId] = useState<number | null>(null);
    const [usuarioId, setUsuarioId] = useState<number | null>(null);
    const [ubicacionURL, setUbicacionURL] = useState<String>("");
    const [description, setDescription] = useState<string>("");
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('user');
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    const grupoIdStorage = userData.id_group;
                    const usuarioIdStorage = userData.id;

                    if (grupoIdStorage && usuarioIdStorage) {
                        setGrupoId(grupoIdStorage);
                        setUsuarioId(usuarioIdStorage);
                    }
                }
            } catch (error) {
                console.error("Error al cargar datos de AsyncStorage:", error);
            }
        };

        cargarDatos();
    }, []);

    const enviarAlerta = async () => {
        console.log("grupo " + grupoId + "   usuario " + usuarioId + " ubicacion ::: " + ubicacionURL + " descripcion  " + description);
        if (grupoId && usuarioId && ubicacionURL && description) {
            // Codificar la URL del parámetro 'ubicacion' para manejar caracteres especiales
            const encodedUbicacion = encodeURIComponent(ubicacionURL);

            console.log(":::>>>  " + encodedUbicacion);
            const url = `https://newback-sr47.onrender.com/api/alertas/crear?grupoId=${grupoId}&usuarioId=${usuarioId}&ubicacion=${encodedUbicacion}&descripcion=${description}`;

            try {
                const response = await fetch(url, {
                    method: 'POST',
                });

                // Verificar si la respuesta es JSON
                const contentType = response.headers.get("content-type");

                if (!response.ok) {
                    throw new Error(`Error en la respuesta: ${response.statusText}`);
                }

                // Registrar el cuerpo de la respuesta para depuración
                const textResponse = await response.text();
                console.log('Respuesta del servidor:', textResponse);

                // Verificar si la respuesta es JSON
                if (contentType && contentType.includes('application/json')) {
                    const data = JSON.parse(textResponse);
                    console.log('Alerta enviada exitosamente:', data);

                    // Mostrar un mensaje de éxito al usuario
                    Alert.alert('Alerta Enviada', 'La alerta ha sido enviada correctamente.', [
                        { text: 'OK', onPress: () => console.log('Alert Closed') }
                    ]);
                }
            } catch (error) {
                console.error('Error al enviar la alerta:', error);
                // Mostrar un mensaje de error al usuario
                Alert.alert('Error', 'Ocurrió un error al enviar la alerta. Inténtalo de nuevo.');
            }
        } else {
            console.log("Por favor, complete todos los campos antes de enviar la alerta.");
            // Mostrar un mensaje de advertencia si faltan campos
            Alert.alert('Campos Incompletos', 'Por favor complete todos los campos antes de enviar la alerta.');
        }
    };



    // Permisos
    const [cameraPermission, requestCameraPermission] = usePermission(ImagePicker.requestCameraPermissionsAsync, "Cámara");
    const [locationPermission, requestLocationPermission] = usePermission(Location.requestForegroundPermissionsAsync, "Ubicación");
    const [audioPermission, requestAudioPermission] = usePermission(Audio.requestPermissionsAsync, "Micrófono");

    // Solicitar permisos al montar el componente
    useEffect(() => {
        requestCameraPermission();
        requestLocationPermission();
        requestAudioPermission();
    }, []);

    // Maneja la selección de un punto en el mapa
    const handleMapPress = (event: any) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ coords: { latitude, longitude } });
    };
    // Función para enviar el reporte con la ubicación seleccionada
    const handleSendReport = () => {
        if (selectedLocation) {
            const { latitude, longitude } = selectedLocation.coords;
            const message = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            setUbicacionURL(message);
            setAlertMessages([...alertMessages, `Ubicación seleccionada capturada. ${message}`]); // Añadir mensaje de alerta
        } else {
            alert('Por favor selecciona una ubicación en el mapa.');
        }
    };
    // Función para abrir Google Maps en la ubicación actual
    const handleLocation = async () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${location.coords.latitude},${location.coords.longitude}`;
        setAlertMessages([...alertMessages, `Ubicación actual capturada. ${url}`]); // Añadir mensaje de alerta
    };

    const openMap = async () => {
        if (!locationPermission) {
            Alert.alert("Permiso necesario", "Por favor, habilita el permiso de ubicación.");
            return;
        }

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permiso denegado", "Se requiere permiso para acceder a la ubicación.");
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
    }

    // Función para abrir la galería de imágenes
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImages([...images, ...result.assets]);
        }
    };

    // Función para tomar una foto (Abrir la cámara)
    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setImages([...images, result.assets[0]]);
            setAlertMessages([...alertMessages, "Foto tomada con éxito."]);
        }
    };

    // Función para eliminar una imagen seleccionada
    const removeImage = (index: number) => {
        const updatedImages = images.filter((_, idx) => idx !== index);
        setImages(updatedImages);
    };

    // Función para iniciar la grabación de audio
    const startRecording = async () => {
        if (!audioPermission) {
            setAlertMessages([...alertMessages, "Es necesario que habilites el permiso de micrófono."]);
            return;
        }

        try {
            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync();
            await recording.startAsync();
            setAudioRecording(recording);
            setAlertMessages([...alertMessages, "Grabación iniciada."]);
        } catch (error) {
            console.error("Error al iniciar la grabación", error);
            setAlertMessages([...alertMessages, "No se pudo iniciar la grabación."]);
        }
    };

    // Función para detener la grabación de audio
    const stopRecording = async () => {
        if (!audioRecording) return;

        try {
            await audioRecording.stopAndUnloadAsync();
            const uri = audioRecording.getURI();
            setAudioRecording(null);
            setAlertMessages([...alertMessages, `Grabación completada. Archivo guardado en: ${uri}`]);
        } catch (error) {
            console.error("Error al detener la grabación", error);
            setAlertMessages([...alertMessages, "No se pudo detener la grabación."]);
        }
    };

    // Función para enviar el reporte
    const submitReport = () => {
        if (!description || images.length === 0) {
            setAlertMessages([...alertMessages, "Por favor, completa todos los campos."]);
            return;
        }

        setIsLoading(true);

        // Guardar los datos del reporte
        const reportData = { description, location, images };
        setSubmittedData(reportData);  // Guardar datos para mostrar en el modal

        setAlertMessages([...alertMessages, "Tu reporte ha sido enviado."]);

        // Limpiar los campos
        setDescription("");
        setImages([]);
        setLocation(null);

        setIsLoading(false);
    };

    // Función para ver los detalles del envío
    const viewDetails = () => {
        setShowDetails(true); // Mostrar los detalles
    };

    // Función para cerrar el modal de detalles
    const closeDetails = () => {
        setShowDetails(false); // Cerrar el modal
    };
    const handlePress = () => {
        submitReport();
        enviarAlerta();
    };

    return (
        <ScrollView>
            <View style={styles.containerGeneral}>

                <View style={styles.container}>
                    <Text style={styles.title}>¿Sucedió algo?</Text>
                    <Text style={{ fontSize: 20, textAlign: 'center' }}>Reportalo!!!</Text>
                    {/* Sección de imágenes seleccionadas */}
                    <View style={styles.imageContainer}>
                        {images.length === 0 ? (
                            <Text>No se han seleccionado imágenes.</Text>
                        ) : (
                            images.map((img, index) => (
                                <View key={index} style={styles.imageWrapper}>
                                    <Image
                                        source={{ uri: img.uri }}
                                        style={styles.image}
                                        resizeMode="contain" // Mantener la proporción de la imagen dentro del marco
                                    />
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => removeImage(index)}
                                    >
                                        <MaterialIcons name="delete" size={20} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            ))
                        )}
                    </View>
                    <View style={styles.ubicationContent} >
                        <TouchableOpacity
                            style={{
                                height: 60,
                                backgroundColor: 'green',
                                marginTop: 3,
                                marginBottom: 3,
                                width: 180,
                                padding: 7,
                                borderRadius: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }} onPress={openMap}>
                            <Text style={styles.buttonText}>Mostrar mapa</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            {location ? (
                                <MapView
                                    style={{ flex: 1 }}
                                    initialRegion={{
                                        latitude: location.coords.latitude,
                                        longitude: location.coords.longitude,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                    onPress={handleMapPress} // Captura la selección en el mapa
                                >
                                    {/* Marcador de la ubicación actual */}
                                    <Marker
                                        coordinate={{
                                            latitude: location.coords.latitude,
                                            longitude: location.coords.longitude,
                                        }}
                                        title="Ubicación actual"
                                        pinColor="blue" // Color para la ubicación actual
                                    />

                                    {/* Marcador de la ubicación seleccionada */}
                                    {selectedLocation && (
                                        <Marker
                                            coordinate={{
                                                latitude: selectedLocation.coords.latitude,
                                                longitude: selectedLocation.coords.longitude,
                                            }}
                                            title="Ubicación seleccionada"
                                            pinColor="red" // Color para la ubicación seleccionada
                                        />
                                    )}
                                </MapView>
                            ) : (
                                <Text>Loading map...</Text>
                            )}

                            <View style={styles.buttonContent}>
                                <TouchableOpacity style={styles.button} onPress={handleSendReport}>
                                    <Text style={styles.buttonText}>Ubicación seleccionada</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button1} onPress={handleLocation}>
                                    <Text style={styles.buttonText}>Ubicación actual</Text>
                                </TouchableOpacity>

                            </View>

                        </View>

                    </View>

                    {/* Botones de multimedia */}
                    <View style={styles.mediaButtons}>

                        <TouchableOpacity onPress={takePhoto} style={styles.iconContainer}>
                            <MaterialIcons name="camera-alt" size={30} color="#000" />
                            <Text>Cámara</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={pickImage} style={styles.iconContainer}>
                            <MaterialIcons name="folder" size={30} color="#000" />
                            <Text>Galería</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={audioRecording ? stopRecording : startRecording} style={styles.iconContainer}>
                            <MaterialIcons name={audioRecording ? "stop" : "mic"} size={30} color="#000" />
                            <Text>{audioRecording ? 'Detener Audio' : 'Grabar Audio'}</Text>
                        </TouchableOpacity>


                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Ingrese una descripción"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />



                    <TouchableOpacity style={styles.submitButton} onPress={handlePress}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>Enviar</Text>
                        )}
                    </TouchableOpacity>

                    {/* Historial de alertas */}
                    <View style={styles.alertContainer}>
                        {alertMessages.length > 0 && (
                            <ScrollView style={styles.alertHistory}>
                                {alertMessages.map((message, index) => (
                                    <View key={index} style={styles.alertItem}>
                                        <Text style={styles.alertText}>{message}</Text>
                                        <TouchableOpacity onPress={viewDetails} style={styles.viewDetailsButton}>
                                            <MaterialIcons name="visibility" size={20} color="#0066CC" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    {/* Modal para ver los detalles */}
                    <Modal
                        visible={showDetails}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={closeDetails}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Detalles del Reporte</Text>
                                <Text>Descripción: {submittedData?.description}</Text>
                                <Text>Ubicación: {submittedData?.location ? `${submittedData.location.coords.latitude}, ${submittedData.location.coords.longitude}` : 'No disponible'}</Text>
                                <Text>Imágenes: {submittedData?.images.length}</Text>
                                <TouchableOpacity onPress={closeDetails} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>Cerrar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    containerGeneral: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
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
        textAlign: 'center',
    },
    imageContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    imageWrapper: {
        marginBottom: 10,
        position: 'relative',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 10,
    },
    ubicationContent: {
        width: '100%',
        height: 500,
    },
    removeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
        borderRadius: 20,
        padding: 5,
    },
    mediaButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    iconContainer: {
        alignItems: 'center',
    },
    input: {
        height: 100,
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#0066CC',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    alertContainer: {
        marginTop: 20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    alertHistory: {
        maxHeight: 150,
    },
    alertItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    alertText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    viewDetailsButton: {
        padding: 5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalButton: {
        marginTop: 20,
        backgroundColor: '#0066CC',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },

    buttonContent: {
        display: 'flex',
        flexDirection: 'row',
        width: 'auto',
        alignItems: 'center',
        marginTop: 10,
        gap: 3,
        overflow:'hidden'
    },
    button: {
       
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 10,
        height: 60,
        width: 150,
        color: 'white',
        borderRadius: 10,
        justifyContent: 'center',
    },
    button1: {
        alignItems: 'center',
        backgroundColor: 'blue',
        padding: 10,
        height: 60,
        width: 150,
        color: 'white',
        borderRadius: 10,
        justifyContent: 'center',
    },

    buttonText: {
        color: 'white',
        justifyContent: 'center',
    }


}); 