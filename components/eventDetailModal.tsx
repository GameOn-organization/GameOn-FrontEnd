import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';

interface EventDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    rating: string;
    distance: string;
    price: string;
    description: string;
    imagePlaceholderText: string;
    imagePlaceholderSubtext: string;
    priceNote?: string;
    isSubscribed?: boolean;
    image?: string;
  };
  onSubscribe?: () => void;
  onUnsubscribe?: () => void;
}

const EventDetailModal = ({ isVisible, onClose, event, onSubscribe, onUnsubscribe }: EventDetailModalProps) => {
  if (!event) return null;

  const handleSubscribePress = () => {
    if (event.isSubscribed) {
      onUnsubscribe?.();
    } else {
      onSubscribe?.();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Imagem principal do evento */}
            <View style={styles.imageContainer}>
              {event.image ? (
                <Image source={{ uri: event.image }} style={styles.eventImage} />
              ) : (
                <View style={styles.eventImagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>{event.imagePlaceholderText}</Text>
                  <Text style={styles.imagePlaceholderSubtext}>{event.imagePlaceholderSubtext}</Text>
                </View>
              )}
            </View>

            {/* Informacoes do evento */}
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>* {event.rating}</Text>
                <Text style={styles.distance}># {event.distance}</Text>
              </View>

              <View style={styles.priceContainer}>
                <View style={styles.priceSection}>
                  <Text style={styles.price}>{event.price}</Text>
                  {event.priceNote && (
                    <Text style={styles.priceNote}>{event.priceNote}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={[
                    styles.subscribeButton,
                    event.isSubscribed && styles.unsubscribeButton
                  ]}
                  onPress={handleSubscribePress}
                >
                  <Text style={styles.subscribeText}>
                    {event.isSubscribed ? 'Cancelar Inscricao' : 'Inscrever-se'}
                  </Text>
                </TouchableOpacity>
              </View>

              {event.isSubscribed && (
                <View style={styles.subscribedBadge}>
                  <Text style={styles.subscribedBadgeText}>Voce esta inscrito neste evento</Text>
                </View>
              )}
            </View>

            {/* Separador */}
            <View style={styles.separator} />

            {/* Descricao */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Descricao</Text>
              <Text style={styles.descriptionText}>
                {event.description}
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 0,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    height: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#ff4757',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    resizeMode: 'cover',
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
  unsubscribeButton: {
    backgroundColor: '#ff4757',
  },
  subscribeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  subscribedBadge: {
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  subscribedBadgeText: {
    color: '#4CAF50',
    fontSize: 14,
    textAlign: 'center',
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

export default EventDetailModal;