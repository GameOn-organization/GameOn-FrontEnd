import { Icon } from "react-native-paper";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Formulario from "../../components/Formulario";
import { Switch } from "../../components/Switch";

export default function Profile() {
  const router = useRouter();

  const [modalTransparent, setModalTransparent] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "info">("posts");

  return (
    <View style={styles.container}>
      <View style={styles.form}>
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
          {/* <Icon
            name="arrow-back"
            type="ionicon"
            color="black"
            size={24}
            onPress={() => {
              setEditVisible(!editVisible),
                setModalTransparent(!modalTransparent);
            }}
          /> */}
          <Icon source="camera" size={20} />
          <View style={[styles.background]}>
            <Formulario />
          </View>
        </Modal>

        {/* Modal de Configurações */}
        <Modal
          animationType="slide"
          transparent={modalTransparent}
          visible={settingsVisible}
          onRequestClose={() => {
            setSettingsVisible(!settingsVisible),
              setModalTransparent(!modalTransparent);
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            {/* <Icon
              name="arrow-back"
              type="ionicon"
              color="black"
              size={24}
              onPress={() => {
                setSettingsVisible(!settingsVisible),
                  setModalTransparent(!modalTransparent);
              }}
            /> */}
            <Icon source="camera" size={20} />
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
          </View>
        </Modal>

        {/* Top Section */}
        <View style={[styles.background, styles.topSection]}>
          <TouchableOpacity
            onPress={() => {
              setSettingsVisible(true), setModalTransparent(false);
            }}
          >
            {/* <Icon
              name="settings-outline"
              type="ionicon"
              color="white"
              size={24}
            /> */}
            <Icon source="camera" size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.navigate("/")}>
            {/* <Icon
              name="log-out-outline"
              type="ionicon"
              color="white"
              size={24}
            /> */}
            <Icon source="camera" size={20} />
          </TouchableOpacity>
        </View>

        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/icon.jpeg")}
            style={styles.image}
          />
        </View>

        {/* Bottom Section */}
        <View style={[styles.background, styles.bottomSection]}>
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={() => console.log("Add pressed")}>
              {/* <Icon name="add" type="ionicon" color="black" size={24} /> */}
              <Icon source="camera" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setEditVisible(true), setModalTransparent(false);
              }}
            >
              {/* <Icon
                name="pencil-outline"
                type="ionicon"
                color="black"
                size={24}
              /> */}
              <Icon source="camera" size={20} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>Nome do Usuário</Text>
          <Text style={styles.description}>Descrição</Text>

          <Switch activeTab={activeTab} onChangeTab={setActiveTab} />

          {/* Conteúdo */}
          <View
            style={[
              styles.form,
              {
                width: "80%",
                padding: 20,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              },
            ]}
          >
            {activeTab === "posts" ? (
              <Text style={styles.contentText}>Conteúdo dos Posts</Text>
            ) : (
              <Text style={styles.contentText}>Informações do usuário</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

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
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20,
  },
  imageContainer: {
    position: "absolute",
    top: "30%",
    left: "50%",
    // transform: [{ translateX: -85 }, { translateY: -75 }],
    width: 175,
    height: 175,
    borderRadius: 100,
    // overflow: "hidden",
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
