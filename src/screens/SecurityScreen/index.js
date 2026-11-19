
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";

import FormHeader from "../../components/FormHeader";
import FeedbackModal from "../../components/FeedbackModal";
import { colors } from "../../theme/colors";
import { styles } from "./styles";

const PIN_KEY = "financia_app_security_pin";
const BIOMETRIC_KEY = "financia_app_biometric_enabled";

export default function SecurityScreen() {
  const router = useRouter();

  const [hasPin, setHasPin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [action, setAction] = useState("create");
  const [step, setStep] = useState("new");

  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("success");
  const [reopenPinModal, setReopenPinModal] = useState(false);

  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(true);

  useEffect(() => {
    loadPin();
    loadBiometricSettings();
  }, []);

  async function loadPin() {
    try {
      const savedPin = await SecureStore.getItemAsync(PIN_KEY);
      setHasPin(!!savedPin);
    } catch (error) {
      showFeedback(
        "Erro",
        "Não foi possível verificar as configurações de segurança.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadBiometricSettings() {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      const available = hasHardware && isEnrolled;

      setBiometricAvailable(available);

      const savedPreference = await SecureStore.getItemAsync(BIOMETRIC_KEY);

      setBiometricEnabled(available && savedPreference === "true");
    } catch (error) {
      setBiometricAvailable(false);
      setBiometricEnabled(false);
    } finally {
      setBiometricLoading(false);
    }
  }

  function showFeedback(
    title,
    message,
    type = "success",
    reopen = false
  ) {
    setModalVisible(false);

    setFeedbackTitle(title);
    setFeedbackMessage(message);
    setFeedbackType(type);
    setReopenPinModal(reopen);
    setFeedbackVisible(true);
  }

  function closeFeedback() {
    setFeedbackVisible(false);

    if (reopenPinModal) {
      setModalVisible(true);
      setReopenPinModal(false);
    }
  }

  function openModal(type) {
    if (type === "remove" && biometricEnabled) {
      showFeedback(
        "Desative a biometria primeiro",
        "Para remover o PIN, primeiro desative a biometria na seção Biometria.",
        "error"
      );

      return;
    }

    setAction(type);
    setPin("");
    setNewPin("");

    if (type === "create") {
      setStep("new");
    } else {
      setStep("current");
    }

    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setPin("");
    setNewPin("");
  }

  async function handleSubmit() {
    if (!/^\d{4,6}$/.test(pin)) {
      setPin("");

      showFeedback(
        "PIN inválido",
        "Digite um PIN com 4 a 6 números.",
        "error",
        true
      );

      return;
    }

    try {
      if (step === "current") {
        const savedPin = await SecureStore.getItemAsync(PIN_KEY);

        if (!savedPin || pin !== savedPin) {
          setPin("");

          showFeedback(
            "PIN incorreto",
            "O PIN informado está incorreto.",
            "error",
            true
          );

          return;
        }

        if (action === "remove") {
          const savedBiometricPreference =
            await SecureStore.getItemAsync(BIOMETRIC_KEY);

          if (savedBiometricPreference === "true") {
            setBiometricEnabled(true);
            setPin("");

            showFeedback(
              "Desative a biometria primeiro",
              "Para remover o PIN, primeiro desative a biometria na seção Biometria.",
              "error"
            );

            return;
          }

          await SecureStore.deleteItemAsync(PIN_KEY);

          setHasPin(false);
          closeModal();

          showFeedback(
            "PIN removido",
            "Seu PIN foi removido com sucesso."
          );

          return;
        }

        setPin("");
        setStep("new");
        return;
      }

      if (step === "new") {
        setNewPin(pin);
        setPin("");
        setStep("confirm");
        return;
      }

      if (step === "confirm") {
        if (pin !== newPin) {
          setPin("");

          showFeedback(
            "PIN diferente",
            "Os PINs não coincidem. Digite novamente.",
            "error",
            true
          );

          return;
        }

        await SecureStore.setItemAsync(PIN_KEY, newPin);

        setHasPin(true);
        closeModal();

        showFeedback(
          "Sucesso",
          action === "create"
            ? "Seu PIN foi criado com sucesso."
            : "Seu PIN foi alterado com sucesso."
        );
      }
    } catch (error) {
      showFeedback(
        "Erro",
        "Não foi possível realizar essa operação. Tente novamente.",
        "error",
        true
      );
    }
  }

  async function handleBiometricToggle() {
    if (!hasPin) {
      showFeedback(
        "PIN necessário",
        "Primeiro, configure um PIN de segurança para ativar a biometria.",
        "error"
      );

      return;
    }

    if (!biometricAvailable) {
      showFeedback(
        "Biometria indisponível",
        "Cadastre uma impressão digital ou outro método biométrico nas configurações do celular.",
        "error"
      );

      return;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: biometricEnabled
          ? "Confirme para desativar a biometria"
          : "Confirme para ativar a biometria",
        promptSubtitle: "Segurança do Financia",
        cancelLabel: "Cancelar",
      });

      if (!result.success) {
        if (
          result.error !== "user_cancel" &&
          result.error !== "system_cancel" &&
          result.error !== "app_cancel"
        ) {
          showFeedback(
            "Autenticação não realizada",
            "Não foi possível confirmar sua identidade. Tente novamente.",
            "error"
          );
        }

        return;
      }

      const newValue = !biometricEnabled;

      await SecureStore.setItemAsync(
        BIOMETRIC_KEY,
        String(newValue)
      );

      setBiometricEnabled(newValue);

      showFeedback(
        newValue ? "Biometria ativada" : "Biometria desativada",
        newValue
          ? "A autenticação biométrica foi ativada com sucesso."
          : "A autenticação biométrica foi desativada com sucesso."
      );
    } catch (error) {
      showFeedback(
        "Erro",
        "Não foi possível alterar a configuração biométrica.",
        "error"
      );
    }
  }

  function getModalTitle() {
    if (step === "current") return "Digite seu PIN atual";
    if (step === "new") return "Crie seu PIN";
    return "Confirme seu PIN";
  }

  function getModalDescription() {
    if (step === "current") {
      return "Para continuar, informe seu PIN atual.";
    }

    if (step === "new") {
      return "Digite um PIN numérico de 4 a 6 dígitos.";
    }

    return "Digite novamente o PIN para confirmar.";
  }

  function getButtonText() {
    if (step === "current") return "Continuar";
    if (step === "new") return "Avançar";
    return "Confirmar PIN";
  }

  return (
    <View style={styles.screen}>
      <FormHeader
        title="Segurança"
        onBack={() => router.back()}
      />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="shield-checkmark-outline"
            size={44}
            color={colors.primary}
          />
        </View>

        <Text style={styles.title}>
          Segurança dos seus dados
        </Text>

        <Text style={styles.description}>
          Proteja suas informações financeiras configurando um PIN
          de segurança para o aplicativo.
        </Text>

        <View style={styles.securityCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color={colors.primary}
              />
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>
                PIN de segurança
              </Text>

              <Text style={styles.cardDescription}>
                Bloqueio por código numérico
              </Text>
            </View>

            <View
              style={[
                styles.status,
                hasPin && styles.statusActive,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  hasPin && styles.statusTextActive,
                ]}
              >
                {loading
                  ? "Verificando..."
                  : hasPin
                    ? "Ativo"
                    : "Inativo"}
              </Text>
            </View>
          </View>

          {!loading && (
            <View style={styles.actions}>
              <Pressable
                style={styles.primaryButton}
                onPress={() =>
                  openModal(hasPin ? "change" : "create")
                }
              >
                <Text style={styles.primaryButtonText}>
                  {hasPin ? "Alterar PIN" : "Ativar PIN"}
                </Text>
              </Pressable>

              {hasPin && (
                <Pressable
                  style={styles.removeButton}
                  onPress={() => openModal("remove")}
                >
                  <Text style={styles.removeButtonText}>
                    Remover PIN
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>

        <View style={styles.securityCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Ionicons
                name="finger-print-outline"
                size={24}
                color={colors.primary}
              />
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>
                Biometria
              </Text>

              <Text style={styles.cardDescription}>
                {biometricLoading
                  ? "Verificando disponibilidade..."
                  : biometricAvailable
                    ? "Desbloqueio por impressão digital"
                    : "Cadastre uma biometria no celular"}
              </Text>
            </View>

            <View
              style={[
                styles.status,
                biometricEnabled && styles.statusActive,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  biometricEnabled && styles.statusTextActive,
                ]}
              >
                {biometricLoading
                  ? "Verificando..."
                  : !biometricAvailable
                    ? "Indisponível"
                    : biometricEnabled
                      ? "Ativo"
                      : "Inativo"}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={[
                styles.primaryButton,
                (loading || biometricLoading || !biometricAvailable) && {
                  opacity: 0.5,
                },
              ]}
              onPress={handleBiometricToggle}
              disabled={
                loading ||
                biometricLoading ||
                !biometricAvailable
              }
            >
              <Text style={styles.primaryButtonText}>
                {biometricEnabled
                  ? "Desativar biometria"
                  : "Ativar biometria"}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={colors.primary}
          />

          <Text style={styles.infoText}>
            Seu PIN e suas preferências de segurança são armazenados
            de forma segura no dispositivo. O bloqueio automático
            do aplicativo será implementado em uma próxima etapa.
          </Text>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIcon}>
              <Ionicons
                name="lock-closed-outline"
                size={30}
                color={colors.primary}
              />
            </View>

            <Text style={styles.modalTitle}>
              {getModalTitle()}
            </Text>

            <Text style={styles.modalDescription}>
              {getModalDescription()}
            </Text>

            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={setPin}
              placeholder="Digite seu PIN"
              placeholderTextColor={colors.textGray}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={6}
              autoFocus
            />

            <Pressable
              style={styles.primaryButton}
              onPress={handleSubmit}
            >
              <Text style={styles.primaryButtonText}>
                {getButtonText()}
              </Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={closeModal}
            >
              <Text style={styles.cancelButtonText}>
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <FeedbackModal
        visible={feedbackVisible}
        title={feedbackTitle}
        message={feedbackMessage}
        type={feedbackType}
        onClose={closeFeedback}
      />
    </View>
  );
}
