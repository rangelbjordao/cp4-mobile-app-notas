import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <View>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />

      <TextInput style={styles.input} placeholder="Senha" secureTextEntry onChangeText={setSenha} />

      <TouchableOpacity style={styles.botao} >
        <Text style={styles.textoBotao} >Login</Text>
      </TouchableOpacity>

    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 24
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    width: 250,
  },
  botao: {
    backgroundColor: "#40acff",
    borderRadius: 10,
    padding: 10,
  },
  textoBotao: {
    fontWeight: "bold",
    textAlign: "center"
  }
});
