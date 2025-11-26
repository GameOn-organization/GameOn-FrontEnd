import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NotificationProps {
  avatar: any | string; // Pode ser require() ou URL string
  username: string;
  time: string;
  action: string;
  thumbnail?: any | string; // Pode ser require() ou URL string
  highlight?: boolean;
  category?: string;
  onPress?: () => void;
  onMessagePress?: () => void;
}

export const Notification = ({
  avatar,
  username,
  time,
  action,
  thumbnail,
  highlight = false,
  category,
  onPress,
  onMessagePress,
}: NotificationProps) => {
  const handleMessagePress = () => {
    console.log(`Iniciar conversa com ${username}`);
    if (onMessagePress) {
      onMessagePress();
    }
  };

  // Função para determinar a fonte da imagem (require ou URI)
  const getImageSource = (image: any | string) => {
    if (typeof image === 'string') {
      return { uri: image };
    }
    return image;
  };

  return (
    <TouchableOpacity 
      style={[styles.container, highlight && styles.highlight]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image source={getImageSource(avatar)} style={styles.avatar} />
        {category === "MATCH" && (
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>🔥</Text>
          </View>
        )}
      </View>

      <View style={styles.textWrapper}>
        <Text style={styles.text}>
          <Text style={styles.username}>{username}</Text> {action}
        </Text>
        <Text style={styles.time}>{time}</Text>
      </View>

      {category === "MATCH" ? (
        <TouchableOpacity onPress={handleMessagePress} style={styles.messageButton}>
          <LinearGradient
            colors={['#4ecdc4', '#44a08d']}
            style={styles.messageButtonGradient}
          >
            <Text style={styles.messageButtonText}>Diga Olá!</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : thumbnail ? (
        <View style={styles.thumbnailContainer}>
          <Image source={getImageSource(thumbnail)} style={styles.thumbnail} />
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  highlight: {
    backgroundColor: "#f8f9ff",
    borderLeftWidth: 4,
    borderLeftColor: "#667eea",
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  matchBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  matchText: {
    fontSize: 12,
  },
  textWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "#333",
    fontSize: 15,
    lineHeight: 20,
  },
  username: {
    fontWeight: "bold",
    color: "#667eea",
  },
  time: {
    color: "#888",
    fontSize: 13,
    marginTop: 4,
  },
  thumbnailContainer: {
    marginLeft: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  messageButton: {
    marginLeft: 12,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  messageButtonGradient: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  messageButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
    textAlign: 'center',
  },
});
