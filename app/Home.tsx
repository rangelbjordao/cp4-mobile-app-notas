import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../services/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import NotaModal from "./NotaModal";
import { onAuthStateChanged } from "firebase/auth";

type Nota = {
  id: string;
  titulo: string;
  conteudo: string;
  criadoEm: any;
};

const Home = () => {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [notaSelecionada, setNotaSelecionada] = useState<Nota | null>(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "notas"),
        where("uid", "==", user.uid),
        orderBy("criadoEm", "desc"),
      );
      const unsubscribeNotas = onSnapshot(q, (snapshot) => {
        const lista: Nota[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Nota[];
        setNotas(lista);
        setLoading(false);
      });

      return () => unsubscribeNotas();
    });

    return () => unsubscribeAuth();
  }, []);

  const realizarLogout = async () => {
    await AsyncStorage.removeItem("@user"); //Limpa o usuário do Async
    router.replace("/");
  };

  const abrirCriar = () => {
    setNotaSelecionada(null);
    setModalVisivel(true);
  };

  const abrirEditar = (nota: Nota) => {
    setNotaSelecionada(nota);
    setModalVisivel(true);
  };

  const confirmarDeletar = (id: string) => {
    Alert.alert("Deletar nota", "Tem certeza que deseja deletar esta nota?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Deletar", style: "destructive", onPress: () => deletarNota(id) },
    ]);
  };

  const deletarNota = async (id: string) => {
    try {
      await deleteDoc(doc(db, "notas", id));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível deletar a nota.");
    }
  };

  const renderNota = ({ item }: { item: Nota }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardTextos}
        onPress={() => abrirEditar(item)}
      >
        <Text style={styles.cardTitulo} numberOfLines={1}>
          {item.titulo}
        </Text>
        <Text style={styles.cardConteudo} numberOfLines={2}>
          {item.conteudo}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.botaoDeletar}
        onPress={() => confirmarDeletar(item.id)}
      >
        <Text style={styles.textoDeletar}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Minhas Notas</Text>
        <TouchableOpacity onPress={realizarLogout}>
          <Text style={styles.logout}>Sair</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0a0a0a"
          style={{ marginTop: 40 }}
        />
      ) : notas.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioTexto}>Nenhuma nota ainda.</Text>
          <Text style={styles.vazioSubtitulo}>
            Toque em "+" para criar uma nota.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notas}
          keyExtractor={(item) => item.id}
          renderItem={renderNota}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity style={styles.botaoCriar} onPress={abrirCriar}>
        <Text style={styles.botaoCriarTexto}>+</Text>
      </TouchableOpacity>

      <NotaModal
        visivel={modalVisivel}
        onFechar={() => setModalVisivel(false)}
        notaExistente={notaSelecionada}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  titulo: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#0a0a0a",
  },
  botao: {
    backgroundColor: "#0a0a0a",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logout: {
    fontSize: 16,
    color: "#0a0a0a",
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  card: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
  },
  cardTextos: {
    flex: 1,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0a0a0a",
    marginBottom: 4,
  },
  cardConteudo: {
    fontSize: 16,
    color: "#0f0f0f",
  },
  botaoDeletar: {
    padding: 8,
    marginLeft: 8,
  },
  textoDeletar: {
    fontSize: 18,
    color: "#999",
  },
  botaoCriar: {
    position: "absolute",
    bottom: 32,
    right: 24,
    backgroundColor: "#0a0a0a",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  botaoCriarTexto: {
    color: "#fafafa",
    fontSize: 30,
    lineHeight: 34,
  },
  vazio: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  vazioTexto: {
    fontSize: 18,
    color: "#0a0a0a",
    fontWeight: "bold",
  },
  vazioSubtitulo: {
    fontSize: 14,
    color: "#888",
    marginTop: 6,
  },
});
