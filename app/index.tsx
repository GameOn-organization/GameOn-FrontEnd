import { Icon } from "react-native-paper";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, SafeAreaView } from "react-native";

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
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.form}>
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

        <SafeAreaView style={styles.linkContainer}>

        <TouchableOpacity onPress={() => router.navigate("auth/forgot-password")}>
          <Text style={styles.linkText}>Esqueci minha senha</Text>
        </TouchableOpacity>

          <SafeAreaView style={styles.row}>
            <Text style={styles.text}>Ainda não tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.navigate("auth/create-account")}>
                <Text style={styles.linkText}>Cadastre-se</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>

        <SafeAreaView style={styles.separatorContainer}>
          <SafeAreaView style={styles.separator} />
          <Text style={styles.separatorText}>Ou</Text>
          <SafeAreaView style={styles.separator} />
        </SafeAreaView>

        <TouchableOpacity style={[styles.button, {backgroundColor: '#aaa'}]} onPress={() => console.log("Entrar com Google pressed")}>
          <Icon source="google" size={20} color="lightgreen" />
          <Text style={styles.buttonText}>Entrar com Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, {backgroundColor: '#aaa'}]} onPress={() => console.log("Entrar com Apple pressed")}>
          <Icon source="apple" size={20} color="black" />
          <Text style={styles.buttonText}>Entrar com Apple</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  form: {
    width: width,
    height: height,
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