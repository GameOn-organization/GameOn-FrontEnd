import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function App() {
  return (
    <SafeAreaView style={styles.container}>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Imagem principal do evento */}
        <View style={styles.imageContainer}>
          <View style={styles.eventImagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>NBA HOUSE</Text>
            <Text style={styles.imagePlaceholderSubtext}>Evento em destaque</Text>
          </View>
        </View>

        {/* Informações do evento */}
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>NBA HOUSE</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ 4.8 (500 avaliações)</Text>
            <Text style={styles.distance}>📍 1.2 km</Text>
          </View>
          
          <View style={styles.priceContainer}>
            <View style={styles.priceSection}>
              <Text style={styles.price}>R$200</Text>
              <Text style={styles.priceNote}>p/ Late</Text>
            </View>
            <TouchableOpacity style={styles.subscribeButton}>
              <Text style={styles.subscribeText}>Inscrever-se</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Separador */}
        <View style={styles.separator} />

        {/* Descrição */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Descrição</Text>
          <Text style={styles.descriptionText}>
            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#000',
  },
  timeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalText: {
    color: '#fff',
    marginRight: 5,
  },
  wifiText: {
    marginRight: 5,
  },
  batteryText: {
    // Ícone da bateria
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  eventImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imagePlaceholderText: {
    color: '#ff4757',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagePlaceholderSubtext: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  eventInfo: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginRight: 15,
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flex: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  priceNote: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  subscribeButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  subscribeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
