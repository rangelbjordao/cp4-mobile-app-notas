import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const realizarLogout = async () => {
    await AsyncStorage.removeItem("@user"); //Limpa o usuário do Async
    router.replace("/");
  };
  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.titulo}>Home</Text>

      <TouchableOpacity style={styles.botao} onPress={realizarLogout}>
        <Text style={styles.textoBotao}>Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  titulo: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
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
});
