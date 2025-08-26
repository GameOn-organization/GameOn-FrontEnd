import { Icon } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Tab {
  key: string;
  title: string;
  icon?: string; // Nome do ícone (opcional)
}

interface Props {
  tabs: Tab[];
  activeTab: string;
  onChangeTab: (key: string) => void;
}

export const Switch = ({ tabs, activeTab, onChangeTab }: Props) => {
  const tabIndex = tabs.findIndex((tab) => tab.key === activeTab);
  const animation = useRef(new Animated.Value(tabIndex)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: tabIndex,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [tabIndex]);

  const translateX = animation.interpolate({
    inputRange: tabs.map((_, i) => i),
    outputRange: tabs.map((_, i) => `${(100 / tabs.length) * i}%`),
  });

  return (
    <View style={styles.switchWrapper}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.backgroundGradient}
      />
      <Animated.View
        style={[
          styles.animatedBackground,
          {
            width: `${100 / tabs.length}%`,
            transform: [{ translateX }],
          },
        ]}
      />
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onChangeTab(tab.key)}
          style={styles.switchButton}
        >
          {tab.icon && (
            // <Icon
            //   name={tab.icon}
            //   type="ionicon"
            //   size={18}
            //   color={tab.key === activeTab ? "#333" : "#fff"}
            //   style={{ marginBottom: 4 }}
            // />
            <Icon source="camera" size={20} />
          )}
          <Text style={tab.key === activeTab ? styles.activeText : styles.inactiveText}>
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  switchWrapper: {
    width: "80%",
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    position: "relative",
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  backgroundGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  animatedBackground: {
    position: "absolute",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 28,
    zIndex: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  switchButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  activeText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 14,
  },
  inactiveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});


// Exemplo de uso do componente Switch:
// <SwitchIcon
//   tabs={[
//     { key: "posts", title: "Posts", icon: "home-outline" },
//     { key: "info", title: "Info", icon: "information-circle-outline" },
//   ]}
//   activeTab={activeTab}
//   onChangeTab={setActiveTab}
// />