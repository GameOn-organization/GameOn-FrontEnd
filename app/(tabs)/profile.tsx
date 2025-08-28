import { Icon, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Drawer } from "expo-router/drawer";
import Formulario from "../../components/Formulario";
import { Switch } from "../../components/Switch";

export default function Profile() {
  const router = useRouter();
  
  const [modalTransparent, setModalTransparent] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "info">("posts");

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.form}>
        {/* Formulário de Editar Perfil */}
        <Modal
          animationType="fade"
          transparent={modalTransparent}
          visible={editVisible}
          onRequestClose={() => {
            setEditVisible(!editVisible),
              setModalTransparent(!modalTransparent);
          }}
        >
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor="white"
            style={{ backgroundColor: "#667eea" }}
            onPress={() => {
              setEditVisible(!editVisible),
                setModalTransparent(!modalTransparent);
            }}
          />
          <Formulario />
        </Modal>

        {/* Modal de Configurações - Substituir por Drawer */}
        <Modal
          animationType="slide"
          transparent={modalTransparent}
          visible={settingsVisible}
          onRequestClose={() => {
            setSettingsVisible(!settingsVisible),
              setModalTransparent(!modalTransparent);
          }}
        >
          <SafeAreaView
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor="black"
              onPress={() => {
                setSettingsVisible(!settingsVisible),
                  setModalTransparent(!modalTransparent);
              }}
            />
            <TouchableOpacity style={styles.button}>
              <Text
                style={styles.buttonText}
                onPress={() => console.log("Configuração 1")}
              >
                A
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text
                style={styles.buttonText}
                onPress={() => console.log("Configuração 2")}
              >
                B
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text
                style={styles.buttonText}
                onPress={() => console.log("Configuração 3")}
              >
                C
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text
                style={styles.buttonText}
                onPress={() => console.log("Configuração 4")}
              >
                D
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text
                style={styles.buttonText}
                onPress={() => console.log("Configuração 5")}
              >
                E
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>

        {/* Top Section */}
        <SafeAreaView style={[styles.background, styles.topSection]}>
          <TouchableOpacity
            onPress={() => {
              setSettingsVisible(true), setModalTransparent(false);
            }}
          >
            <IconButton
              icon="dots-vertical-circle-outline"
              size={30}
              iconColor="white"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.navigate("/")}>
            <IconButton icon="logout" size={24} iconColor="white" />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Profile Image */}
        <SafeAreaView style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/icon.jpeg")}
            style={styles.image}
          />
        </SafeAreaView>

        {/* Bottom Section */}
        <SafeAreaView style={[styles.background, styles.bottomSection]}>
          <SafeAreaView style={styles.actionRow}>
            <IconButton
              icon="plus"
              size={24}
              color="black"
              onPress={() => console.log("Add pressed")}
            />
            <IconButton
              icon="pencil-outline"
              size={24}
              color="black"
              onPress={() => {
                setEditVisible(true), setModalTransparent(false);
              }}
            />
          </SafeAreaView>

          <Text style={styles.userName}>Nome do Usuário</Text>
          <Text style={styles.description}>Descrição</Text>

          <Switch activeTab={activeTab} onChangeTab={setActiveTab} />

          {/* Conteúdo */}
          <SafeAreaView
            style={[
              styles.form,
              {
                width: width * 0.8,
                padding: 20,
              },
            ]}
          >
            {activeTab === "posts" ? (
              <Text style={styles.contentText}>Conteúdo dos Posts</Text>
            ) : (
              <Text style={styles.contentText}>Informações do usuário</Text>
            )}
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get("window");

const maxWidth = width;

const styles = StyleSheet.create({
  container: {
    width: width,
    maxWidth,
    height: height,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  form: {
    flex: 1,
    width: width,
    height: "100%",
    maxWidth,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  background: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  topSection: {
    flex: 0.3,
    backgroundColor: "#000",
    flexDirection: "row",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
  },
  bottomSection: {
    flex: 0.7,
    backgroundColor: "#fff",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    transform: [{ translateX: width * 0.27 }, { translateY: 175 }],
    position: "absolute",
    width: 175,
    height: 175,
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 5,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  contentText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  button: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
