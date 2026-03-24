import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../services/firebaseConfig";

type Nota = {
  id: string;
  titulo: string;
  conteudo: string;
  criadoEm: any;
};

type Props = {
  visivel: boolean;
  onFechar: () => void;
  notaExistente?: Nota | null;
};

const NotaModal = ({ visivel, onFechar, notaExistente }: Props) => {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [salvando, setSalvando] = useState(false);

  const editando = !!notaExistente;

  useEffect(() => {
    if (notaExistente) {
      setTitulo(notaExistente.titulo);
      setConteudo(notaExistente.conteudo);
    } else {
      setTitulo("");
      setConteudo("");
    }
  }, [notaExistente, visivel]);

  const handleSalvar = async () => {
    if (!titulo.trim()) {
      Alert.alert("Atenção", "O título não pode estar vazio.");
      return;
    }

    setSalvando(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      if (editando && notaExistente) {
        await updateDoc(doc(db, "notas", notaExistente.id), {
          titulo: titulo.trim(),
          conteudo: conteudo.trim(),
        });
      } else {
        await addDoc(collection(db, "notas"), {
          uid: user.uid,
          titulo: titulo.trim(),
          conteudo: conteudo.trim(),
          criadoEm: serverTimestamp(),
        });
      }

      onFechar();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a nota.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal
      visible={visivel}
      animationType="slide"
      transparent
      onRequestClose={onFechar}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.titulo}>
              {editando ? "Editar Nota" : "Nova Nota"}
            </Text>
            <TouchableOpacity onPress={onFechar}>
              <Text style={styles.fechar}>✕</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Título"
            placeholderTextColor="#aaa"
            value={titulo}
            onChangeText={setTitulo}
            maxLength={80}
          />

          <TextInput
            style={[styles.input, styles.inputConteudo]}
            placeholder="Escreva sua nota..."
            placeholderTextColor="#aaa"
            value={conteudo}
            onChangeText={setConteudo}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={styles.botao}
            onPress={handleSalvar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#fafafa" />
            ) : (
              <Text style={styles.textoBotao}>
                {editando ? "Salvar alterações" : "Criar nota"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default NotaModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fafafa",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: "#000",
    borderWidth: 1,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0a0a0a",
  },
  fechar: {
    fontSize: 20,
    color: "#888",
  },
  input: {
    backgroundColor: "#fafafa",
    color: "#0a0a0a",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#000",
  },
  inputConteudo: {
    height: 140,
  },
  botao: {
    backgroundColor: "#0a0a0a",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  textoBotao: {
    color: "#fafafa",
    fontSize: 18,
    fontWeight: "bold",
  },
});
