import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../services/firebaseConfig";
import { registrarUltimoLogin } from "../services/userDataService";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const router = useRouter();

  //Verifica se há persistência no Async Storage
  useEffect(() => {
    const verificarUsuarioLogado = async () => {
      try {
        const usuarioSalvo = await AsyncStorage.getItem("@user");
        if (usuarioSalvo) {
          router.replace("/Home");
        }
      } catch (error) {
        console.log("Error ao verificar login: ", error);
      }
    };
    verificarUsuarioLogado(); //Chama a função para verificar se o usuário está logado.
  }, []);

  // Função para simular o envio do formulário
  const handleLogin = () => {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos!");
      return;
    }
    signInWithEmailAndPassword(auth, email, senha)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        //Atualiza o campo de último login no doc do usuario/{uid}
        await registrarUltimoLogin(user.uid, user.email);

        //Salvando o usuário no AsyncStorage
        await AsyncStorage.setItem("@user", JSON.stringify(user));
        //Redericionar para a tela home
        router.replace("/Home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        Alert.alert(
          "ATENÇÃO",
          "Credenciais Inválidas, verifique e-mail e senha:",
          [{ text: "OK" }],
        );
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bem-Vindo</Text>

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
      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.textoBotao}>Login</Text>
      </TouchableOpacity>

      <Link href="/CadastrarScreen" style={styles.linkCadastrar}>
        Cadastrar
      </Link>
    </View>
  );
};

export default LoginScreen;

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
  linkCadastrar: {
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
