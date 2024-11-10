import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Si usas Ionicons para el ícono

type Mensaje = {
  id: number;
  fechaHora: string;
  remitenteNombre?: string;
  contenido?: string;
  descripcion?: string;
  tipo?: string;
  ubicacionURL?: string;
};

export default function ChatGlobal() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [grupoId, setGrupoId] = useState<number | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);

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
            obtenerMensajes(grupoIdStorage);
          }
        }
      } catch (error) {
        console.error("Error al cargar datos de AsyncStorage:", error);
      }
    };

    cargarDatos();
  }, []);

  const obtenerMensajes = async (grupoId: number) => {
    try {
      const response = await fetch(`https://newback-sr47.onrender.com/api/chat-global/grupo/${grupoId}`);
      const data = await response.json();
      setMensajes(data);

      // Scroll to bottom when messages load
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener los mensajes.');
    }
  };

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;

    try {
      const response = await fetch(`https://newback-sr47.onrender.com/api/chat-global/enviar?grupoId=${grupoId}&usuarioId=${usuarioId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: mensaje,
      });

      if (response.ok) {
        setMensaje('');
        obtenerMensajes(grupoId!);
      } else {
        Alert.alert('Error', 'No se pudo enviar el mensaje.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar al servidor.');
    }
  };

  const handleLinkPress = (url?: string) => {
    if (url) {
      Linking.openURL(url).catch((err) => Alert.alert('Error', 'No se pudo abrir el enlace.'));
    } else {
      Alert.alert('Error', 'La URL no está disponible.');
    }
  };

  const renderMensaje = ({ item, index }: { item: Mensaje; index: number }) => (
    <View
      style={[styles.mensajeContainer, item.remitenteNombre ? styles.mensaje : styles.mensajeSinRemitente, item.tipo ? styles.alerta : null]}
      key={`${item.id}-${index}`}
    >
      <Text style={styles.fecha}>{new Date(item.fechaHora).toLocaleString()}</Text>
      {item.remitenteNombre ? (
        <Text style={styles.nombre}>{item.remitenteNombre}:</Text>
      ) : null}
      <Text style={styles.contenido}>
        {item.contenido || item.descripcion}
      </Text>
      {item.ubicacionURL && (
        <TouchableOpacity onPress={() => handleLinkPress(item.ubicacionURL)} style={styles.linkContainer}>
          <Ionicons name="link" size={16} color="#1D4ED8" style={styles.linkIcon} />
          <Text style={styles.link}>Ver Ubicación</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={mensajes}
        renderItem={renderMensaje}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.listaMensajes}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          value={mensaje}
          onChangeText={setMensaje}
        />
        <TouchableOpacity style={styles.botonEnviar} onPress={enviarMensaje}>
          <Text style={styles.textoBoton}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listaMensajes: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  mensajeContainer: {
    marginVertical: 12,
    padding: 15,
    borderRadius: 12,
    maxWidth: '85%',
    backgroundColor: '#E1FFC7',
  },
  mensaje: {
    alignSelf: 'flex-start',
    backgroundColor: '#E1FFC7',
    borderRadius: 12,
  },
  mensajeSinRemitente: {
    backgroundColor: '#FFCDD2',
    borderLeftWidth: 6,
    borderLeftColor: '#D32F2F',
    paddingLeft: 16,
    borderRadius: 12,
  },
  alerta: {
    alignSelf: 'center',
    backgroundColor: '#FFCDD2',
    borderLeftWidth: 6,
    borderLeftColor: '#D32F2F',
    paddingLeft: 16,
    borderRadius: 12,
  },
  fecha: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  contenido: {
    fontSize: 15,
    color: '#374151',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  linkIcon: {
    marginRight: 6,
  },
  link: {
    fontSize: 14,
    color: '#1D4ED8',
    textDecorationLine: 'underline',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginRight: 12,
    fontSize: 14,
  },
  botonEnviar: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
