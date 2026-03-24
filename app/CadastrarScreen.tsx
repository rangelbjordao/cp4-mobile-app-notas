import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../services/firebaseConfig";
import { criarPerfilUsuario } from "../services/userDataService";

export default function CadastroScreen() {
  // Estados para armazenar os valores digitados
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const router = useRouter(); //Hook de navegação

  // Função para simular o envio do formulário
  const handleCadastro = () => {
    if (!nome || !email || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos!");
      return;
    }
    createUserWithEmailAndPassword(auth, email, senha)
      .then(async (userCredential) => {
        const user = userCredential.user;

        //Cria/atualiza o perfil inicial em usuarios/{uid}
        await criarPerfilUsuario({
          uid: user.uid,
          email: user.email,
          nome,
        });

        //Salvando o usuário no AsyncStorage
        await AsyncStorage.setItem("@user", JSON.stringify(user));
        router.replace("/Home?novoCadastro=true");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + " " + errorMessage);

        if (errorCode === "auth/email-already-in-use") {
          Alert.alert("Atenção", "Este e-mail já está em uso.");
        } else if (errorCode === "auth/weak-password") {
          Alert.alert("Atenção", "A senha deve ter pelo menos 6 caracteres.");
        } else if (errorCode === "auth/invalid-email") {
          Alert.alert("Atenção", "E-mail inválido.");
        } else {
          Alert.alert(
            "Erro",
            "Não foi possível criar a conta. Tente novamente.",
          );
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Criar Conta</Text>

      {/* Campo Nome */}
      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        placeholderTextColor="#aaa"
        value={nome}
        onChangeText={setNome}
      />

      {/* Campo Email */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Campo Senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {/* Botão */}
      <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
        <Text style={styles.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>

      <Link href="/" style={styles.linkLogin}>
        Login
      </Link>
    </View>
  );
}

// Estilização
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    justifyContent: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0a0a0a",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fafafa",
    color: "#0a0a0a",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  botao: {
    backgroundColor: "#0a0a0a",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBotao: {
    color: "#fafafa",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkLogin: {
    backgroundColor: "#0a0a0a",
    padding: 15,
    color: "#fafafa",
    textAlign: "center",
    fontSize: 18,
    borderRadius: 10,
    fontWeight: "bold",
    marginTop: 10,
  },
});
