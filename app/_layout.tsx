
import React, { useEffect, useRef, useState } from "react";
import {
  AppState,
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import { colors } from "../src/theme/colors";

const PIN_KEY = "financia_app_security_pin";
const BIOMETRIC_KEY = "financia_app_biometric_enabled";

export default function RootLayout() {
  const [isLocked, setIsLocked] = useState(false);
  const [securityReady, setSecurityReady] = useState(false);

  const [pin, setPin] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);

  const appState = useRef(AppState.currentState);
  const authenticating = useRef(false);
  const autoBiometricAttempted = useRef(false);

  async function checkBiometricAvailability() {
    try {
      const hasHardware =
        await LocalAuthentication.hasHardwareAsync();

      const isEnrolled =
        await LocalAuthentication.isEnrolledAsync();

      return hasHardware && isEnrolled;
    } catch {
      return false;
    }
  }

  async function loadSecurityState() {
    try {
      const savedPin = await SecureStore.getItemAsync(PIN_KEY);

      if (!savedPin) {
        setIsLocked(false);
        setBiometricEnabled(false);
        setPin("");
        setErrorMessage("");
        return;
      }

      const savedBiometricPreference =
        await SecureStore.getItemAsync(BIOMETRIC_KEY);

      const biometricAvailable =
        savedBiometricPreference === "true" &&
        (await checkBiometricAvailability());

      setBiometricEnabled(biometricAvailable);
      setPin("");
      setErrorMessage("");
      setIsLocked(true);
    } catch (error) {
      console.error("Erro ao verificar segurança:", error);
      setIsLocked(true);
      setErrorMessage("Não foi possível verificar a segurança. Tente novamente.");
    }
  }

  useEffect(() => {
    async function initializeSecurity() {
      await loadSecurityState();
      setSecurityReady(true);
    }

    initializeSecurity();

    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        const previousState = appState.current;

        if (
          previousState === "active" &&
          nextAppState === "background"
        ) {
          autoBiometricAttempted.current = false;

          setIsLocked(true);
          setPin("");
          setErrorMessage("");
        }

        if (
          previousState === "background" &&
          nextAppState === "active"
        ) {
          autoBiometricAttempted.current = false;

          await loadSecurityState();
        }

        appState.current = nextAppState;
      }
    );

    return () => subscription.remove();
  }, []);

  async function handlePinUnlock() {
    if (pin.length < 4 || pin.length > 6) {
      setErrorMessage("Digite um PIN válido de 4 a 6 números.");
      return;
    }

    try {
      const savedPin = await SecureStore.getItemAsync(PIN_KEY);

      if (!savedPin) {
        setIsLocked(false);
        return;
      }

      if (pin === savedPin) {
        setIsLocked(false);
        setPin("");
        setErrorMessage("");
        autoBiometricAttempted.current = false;
      } else {
        setErrorMessage("PIN incorreto. Tente novamente.");
        setPin("");
      }
    } catch (error) {
      console.error("Erro ao validar PIN:", error);
      setErrorMessage("Não foi possível validar o PIN.");
    }
  }

  async function handleBiometricUnlock() {
    if (authenticating.current) return;

    authenticating.current = true;
    setBiometricLoading(true);
    setErrorMessage("");

    try {
      const savedPin = await SecureStore.getItemAsync(PIN_KEY);
      const savedPreference =
        await SecureStore.getItemAsync(BIOMETRIC_KEY);

      if (!savedPin) {
        setIsLocked(false);
        return;
      }

      if (savedPreference !== "true") {
        setBiometricEnabled(false);
        return;
      }

      const biometricAvailable =
        await checkBiometricAvailability();

      if (!biometricAvailable) {
        setBiometricEnabled(false);
        setErrorMessage(
          "Biometria indisponível. Utilize seu PIN."
        );
        return;
      }

      const result =
        await LocalAuthentication.authenticateAsync({
          promptMessage: "Desbloquear Financia",
          promptSubtitle: "Confirme sua identidade para continuar",
          cancelLabel: "Usar PIN",
        });

      if (result.success) {
        setIsLocked(false);
        setPin("");
        setErrorMessage("");
        autoBiometricAttempted.current = false;
      } else {
        if (
          result.error !== "user_cancel" &&
          result.error !== "system_cancel" &&
          result.error !== "app_cancel"
        ) {
          setErrorMessage(
            "Não foi possível autenticar. Você pode utilizar seu PIN."
          );
        }
      }
    } catch (error) {
      console.error("Erro na autenticação biométrica:", error);
      setErrorMessage(
        "Erro na biometria. Utilize seu PIN para continuar."
      );
    } finally {
      authenticating.current = false;
      setBiometricLoading(false);
    }
  }

  useEffect(() => {
    if (
      !securityReady ||
      !isLocked ||
      !biometricEnabled ||
      biometricLoading ||
      autoBiometricAttempted.current
    ) {
      return;
    }

    autoBiometricAttempted.current = true;
    handleBiometricUnlock();
  }, [
    securityReady,
    isLocked,
    biometricEnabled,
    biometricLoading,
  ]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />

      <Modal
        visible={!securityReady || isLocked}
        animationType="fade"
        transparent={false}
        statusBarTranslucent
        onRequestClose={() => {
          // O aplicativo permanece bloqueado até a autenticação.
        }}
      >
        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: colors.background,
            justifyContent: "center",
            paddingHorizontal: 28,
          }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {!securityReady ? (
            <View style={{ alignItems: "center" }}>
              <ActivityIndicator
                size="large"
                color={colors.primary}
              />
              <Text
                style={{
                  marginTop: 16,
                  color: colors.textGray,
                  fontSize: 15,
                }}
              >
                Verificando segurança...
              </Text>
            </View>
          ) : (
            <View>
              <View
                style={{
                  alignItems: "center",
                  marginBottom: 36,
                }}
              >
                <View
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 38,
                    backgroundColor: colors.primary + "15",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <Ionicons
                    name="lock-closed"
                    size={34}
                    color={colors.primary}
                  />
                </View>

                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    color: colors.textDark,
                    marginBottom: 8,
                  }}
                >
                  Aplicativo bloqueado
                </Text>

                <Text
                  style={{
                    fontSize: 15,
                    color: colors.textGray,
                    textAlign: "center",
                  }}
                >
                  {biometricEnabled
                    ? "Autentique-se para acessar suas informações."
                    : "Digite seu PIN para continuar."}
                </Text>
              </View>

              {biometricEnabled && (
                <Pressable
                  onPress={handleBiometricUnlock}
                  disabled={biometricLoading}
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: 12,
                    paddingVertical: 15,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                    opacity: biometricLoading ? 0.7 : 1,
                  }}
                >
                  {biometricLoading ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <>
                      <Ionicons
                        name="finger-print"
                        size={23}
                        color={colors.white}
                      />
                      <Text
                        style={{
                          color: colors.white,
                          fontSize: 16,
                          fontWeight: "600",
                          marginLeft: 10,
                        }}
                      >
                        Tentar biometria novamente
                      </Text>
                    </>
                  )}
                </Pressable>
              )}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 22,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "#DADDE1",
                  }}
                />

                <Text
                  style={{
                    color: colors.textGray,
                    fontSize: 13,
                    marginHorizontal: 12,
                  }}
                >
                  Ou use seu PIN
                </Text>

                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "#DADDE1",
                  }}
                />
              </View>

              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: colors.textDark,
                  marginBottom: 10,
                }}
              >
                PIN de segurança
              </Text>

              <TextInput
                value={pin}
                onChangeText={(value) => {
                  setPin(value.replace(/[^0-9]/g, "").slice(0, 6));
                  setErrorMessage("");
                }}
                placeholder="Digite seu PIN"
                placeholderTextColor={colors.textGray}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={6}
                onSubmitEditing={handlePinUnlock}
                style={{
                  backgroundColor: colors.white,
                  borderWidth: 1,
                  borderColor: errorMessage
                    ? colors.expense
                    : "#DADDE1",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 15,
                  fontSize: 18,
                  color: colors.textDark,
                  textAlign: "center",
                  letterSpacing: 8,
                }}
              />

              {errorMessage ? (
                <Text
                  style={{
                    color: colors.expense,
                    fontSize: 13,
                    marginTop: 10,
                    textAlign: "center",
                  }}
                >
                  {errorMessage}
                </Text>
              ) : null}

              <Pressable
                onPress={handlePinUnlock}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: "center",
                  marginTop: 22,
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Desbloquear
                </Text>
              </Pressable>
            </View>
          )}
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
