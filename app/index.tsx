import { Icon } from "react-native-paper";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = () => {
        if (password != "1234") {
            setErrorMessage("As senhas não coincidem");
        } else {
            setErrorMessage(""); // Clear error message
        }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.header}>
          Game On
        </Text>
        <Text style={styles.subHeader}>
          Entrar
        </Text>

        <TextInput
          placeholder="Email ou Telefone"
          style={[styles.input, {marginBottom: 15}]}
          autoComplete="email"
          inputMode="email"
          placeholderTextColor="gray"
        />
        <TextInput
          placeholder="Senha"
          onChangeText={(value) => setPassword(value)}
          style={styles.input}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          inputMode="text"
          secureTextEntry={!showPassword}
          placeholderTextColor="gray"
        />
        {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={() => router.navigate("(tabs)/home")}>
          <Icon source="login" size={20} color="white"/>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>

        <TouchableOpacity onPress={() => router.navigate("auth/forgot-password")}>
          <Text style={styles.linkText}>Esqueci minha senha</Text>
        </TouchableOpacity>

          <View style={styles.row}>
            <Text style={styles.text}>Ainda não tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.navigate("auth/create-account")}>
                <Text style={styles.linkText}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={styles.separatorText}>Ou</Text>
          <View style={styles.separator} />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => console.log("Entrar com Google pressed")}>
          <Icon source="google" size={20} color="white" />
          <Text style={styles.buttonText}>Entrar com Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => console.log("Entrar com Apple pressed")}>
          <Icon source="apple" size={20} color="white" />
          <Text style={styles.buttonText}>Entrar com Apple</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const width = "90%";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  form: {
    width: width,
    height: "100%",
    maxWidth: 400,
    padding: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  subHeader: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    color: "#333",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  iconContainer: {
    marginRight: 10,
  },
  iconButton: {
    padding: 10,
  },
  errorText: {
    color: "red",
  },
  button: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  linkContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  linkText: {
    color: "blue",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "black",
  },
  separatorText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
});