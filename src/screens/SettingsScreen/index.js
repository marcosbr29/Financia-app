import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import BottomNav from "../../components/BottomNav";
import { colors } from "../../theme/colors";
import { getUserName, saveUserName } from "../../storage/profile";
import { styles } from "./styles";

const SETTINGS_OPTIONS = [
  {
    title: "Meu perfil",
    icon: "person-outline",
  },
  {
    title: "Categorias",
    icon: "grid",
  },
  {
    title: "Metas",
    icon: "disc-outline",
  },
  {
    title: "Exportar dados",
    icon: "share-outline",
  },
  {
    title: "Segurança",
    icon: "lock-closed",
  },
  {
    title: "Sobre o app",
    icon: "information-circle-outline",
  },
  {
    title: "Ajuda",
    icon: "help-circle",
  },
];

export default function SettingsScreen() {
  const router = useRouter();

  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const name = await getUserName();
        setUserName(name);
        setNameInput(name);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar seu perfil.");
      }
    }

    loadProfile();
  }, []);

  function openProfile() {
    setNameInput(userName);
    setProfileModalVisible(true);
  }

  async function handleSaveProfile() {
    if (!nameInput.trim()) {
      Alert.alert("Nome obrigatório", "Digite seu nome para continuar.");
      return;
    }

    try {
      const savedName = await saveUserName(nameInput);

      setUserName(savedName);
      setNameInput(savedName);
      setProfileModalVisible(false);

      Alert.alert("Perfil atualizado", "Seu nome foi salvo com sucesso.");
    } catch (error) {
      Alert.alert("Erro", error.message || "Não foi possível salvar seu nome.");
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {SETTINGS_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.title}
            style={styles.option}
            activeOpacity={0.7}
            onPress={() => {
              if (option.title === "Meu perfil") {
                openProfile();
              } else if (option.title === "Sobre o app") {
                router.push("/about");
              } else if (option.title === "Categorias") {
                router.push("/categories");
              } else if (option.title === "Metas") {
                router.push("/goals");
              } else if (option.title === "Exportar dados") {
                router.push("/export-data");
              } else if (option.title === "Segurança") {
                router.push("/security");
              } else if (option.title === "Ajuda") {
                router.push("/help");
              }
            }}
          >
            <Ionicons name={option.icon} size={20} color={colors.textDark} />

            <Text style={styles.optionText}>
              {option.title}
              {option.title === "Meu perfil" && userName
                ? ` (${userName})`
                : ""}
            </Text>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textGray}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={profileModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: 18,
              padding: 22,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: colors.textDark,
                marginBottom: 8,
              }}
            >
              Meu perfil
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: colors.textGray,
                marginBottom: 18,
              }}
            >
              Como você gostaria de ser chamado no aplicativo?
            </Text>

            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.textDark,
                marginBottom: 8,
              }}
            >
              Seu nome
            </Text>

            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Digite seu nome"
              placeholderTextColor={colors.textGray}
              autoCapitalize="words"
              maxLength={40}
              style={{
                borderWidth: 1,
                borderColor: colors.textGray,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 16,
                color: colors.textDark,
                marginBottom: 20,
              }}
            />

            <TouchableOpacity
              onPress={handleSaveProfile}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 10,
                paddingVertical: 14,
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                Salvar nome
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setProfileModalVisible(false)}
              style={{
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.textGray,
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNav
        activeTab="config"
        onChangeTab={(tab) => {
          if (tab === "inicio") {
            router.push("/");
          } else if (tab === "historico") {
            router.push("/transactions");
          } else if (tab === "relatorios") {
            router.push("/reports");
          }
        }}
      />
    </View>
  );
}
