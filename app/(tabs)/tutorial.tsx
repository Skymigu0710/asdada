import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Tutorial = () => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Bienvenido',
      content: 'Este es el primer paso de nuestro tutorial.',
    },
    {
      title: 'Paso 2',
      content: 'Aquí aprenderás más sobre nuestra aplicación.',
    },
    {
      title: 'Paso 3',
      content: '¡Casi terminas! Solo un paso más.',
    },
    {
      title: 'Finalizado',
      content: '¡Felicidades! Has completado el tutorial.',
    },
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{steps[step].title}</Text>
      <Text style={styles.content}>{steps[step].content}</Text>
      <View style={styles.buttonContainer}>
        {step > 0 && <Button title="Anterior" onPress={prevStep} />}
        {step < steps.length - 1 ? (
          <Button title="Siguiente" onPress={nextStep} />
        ) : (
          <Button title="Finalizar" onPress={() => alert('Tutorial completado')} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default Tutorial;