import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Tip {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// Lista de consejos de seguridad con íconos y colores
const safetyTips: Tip[] = [
  { id: '1', title: 'Mantén tu ubicación privada', description: 'Evita compartir tu ubicación en redes sociales o con desconocidos.', icon: 'location-sharp' },
  { id: '2', title: 'Conoce tu entorno', description: 'Siempre ten en cuenta tus alrededores y posibles rutas de escape.', icon: 'map' },
  { id: '3', title: 'Confía en tus instintos', description: 'Si algo se siente mal, confía en tus instintos y busca un lugar seguro.', icon: 'eye' },
  { id: '4', title: 'Comparte información con amigos', description: 'Haz saber a alguien de confianza dónde estás o hacia dónde vas.', icon: 'people' },
  { id: '5', title: 'Ten números de emergencia a mano', description: 'Guarda números de emergencia en tu teléfono y asegúrate de que sean accesibles.', icon: 'call' },
];

const SafetyTipsScreen: React.FC = () => {
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedTip(prev => (prev === id ? null : id));
  };

  const renderTip = ({ item }: { item: Tip }) => {
    const isExpanded = item.id === expandedTip;

    return (
      <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.tipContainer}>
        <View style={styles.tipHeader}>
          <Ionicons name={item.icon as any} size={24} color="#2ecc71" style={styles.icon} />
          <Text style={styles.tipTitle}>{item.title}</Text>
        </View>
        {isExpanded && (
          <Animated.View style={styles.tipDescriptionContainer}>
            <Text style={styles.tipDescription}>{item.description}</Text>
          </Animated.View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Consejos de Seguridad</Text>
      <FlatList
        data={safetyTips}
        renderItem={renderTip}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

// Estilos con tonos de verde amigables
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F6EF', 
    padding: 20,
  },

  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  tipContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 30,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    justifyContent: 'center',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  icon: {
    marginRight: 10,
    fontSize: 35,
    justifyContent: 'center',
  },
  tipTitle: {
    fontSize: 27,
    fontWeight: '600',
    color: '#2ecc71', // Verde principal para los títulos
    justifyContent: 'center',
  },
  tipDescriptionContainer: {
    marginTop: 10,
    height: 80,
    justifyContent: 'center',
  },
  tipDescription: {
    fontSize: 20,
    color: '#555', // Gris para el texto de descripción
    justifyContent: 'center',
  },
});

export default SafetyTipsScreen;
