
import React from "react";
import { View, Text, TextInput } from "react-native";
import { styles } from "./styles";
import { formatDateInput } from "../../utils/dateUtils";

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  rightIcon,
  dateInput = false,
}) {
  function handleChange(text) {
    if (dateInput) {
      onChangeText(formatDateInput(text));
      return;
    }

    onChangeText(text);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor="#B0B0B5"
          keyboardType={dateInput ? "number-pad" : keyboardType}
          maxLength={dateInput ? 10 : undefined}
        />

        {rightIcon}
      </View>
    </View>
  );
}
