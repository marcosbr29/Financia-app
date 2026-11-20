
import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../theme/colors";
import { styles } from "./styles";

export default function FeedbackModal({
  visible,
  title,
  message,
  type = "success",
  onClose,
  buttonText = "Entendi",
}) {
  const isError = type === "error";

  const iconName = isError
    ? "alert-circle-outline"
    : "checkmark-circle-outline";

  const iconColor = isError
    ? colors.expense
    : colors.primary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={iconName}
              size={38}
              color={iconColor}
            />
          </View>

          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.message}>
            {message}
          </Text>

          <Pressable
            style={styles.button}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>
              {buttonText}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
