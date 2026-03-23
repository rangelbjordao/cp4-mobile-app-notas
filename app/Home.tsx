import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Home = () => {
  return (
    <View>
      <Text style={styles.titulo}>Home</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  titulo: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
