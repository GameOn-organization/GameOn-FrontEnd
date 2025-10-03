import { useRouter, Stack } from 'expo-router';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

import { ThemedText } from '@/components/examples/ThemedText';
import { ThemedView } from '@/components/examples/ThemedView';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops: Rota Errada!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">Essa Tela Não Existe.</ThemedText>
        <TouchableOpacity style={styles.link} onPress={() => router.back()}>
            <Text style={styles.linkText}>Voltar</Text>
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
      color: "blue",
      textDecorationLine: "underline",
      fontSize: 16,
  },
});
