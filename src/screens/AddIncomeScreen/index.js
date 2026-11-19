
import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import FormHeader from "../../components/FormHeader";
import FormField from "../../components/FormField";
import FeedbackModal from "../../components/FeedbackModal";
import { SaveButton, CancelButton } from "../../components/FormButtons";
import { colors } from "../../theme/colors";
import { formatDateInput, isValidDate } from "../../utils/dateUtils";
import { styles } from "./styles";

function formatValue(value) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return String(value);
  }

  return number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function AddIncomeScreen({
  onBack,
  onSave,
  initialData,
}) {
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );

  const [value, setValue] = useState(
    formatValue(initialData?.value)
  );

  const [date, setDate] = useState(
    formatDateInput(initialData?.date)
  );

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  function handleSave() {
    if (!isValidDate(date)) {
      setFeedbackMessage(
        "Informe uma data válida no formato DD/MM/AAAA."
      );
      setFeedbackVisible(true);
      return;
    }

    onSave && onSave({ description, value, date });
  }

  return (
    <View style={styles.screen}>
      <FormHeader
        title={initialData ? "Editar Receita" : "Nova Receita"}
        onBack={onBack}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FormField
          label="Descrição"
          value={description}
          onChangeText={setDescription}
          placeholder="Ex: Salário"
        />

        <FormField
          label="Valor"
          value={value}
          onChangeText={setValue}
          placeholder="R$ 0,00"
          keyboardType="numeric"
        />

        <FormField
          label="Data"
          value={date}
          onChangeText={setDate}
          placeholder="DD/MM/AAAA"
          dateInput
          rightIcon={
            <Ionicons
              name="calendar-outline"
              size={20}
              color={colors.textGray}
            />
          }
        />
      </ScrollView>

      <View style={styles.footer}>
        <SaveButton onPress={handleSave} />
        <CancelButton onPress={onBack} />
      </View>

      <FeedbackModal
        visible={feedbackVisible}
        title="Data inválida"
        message={feedbackMessage}
        type="error"
        onClose={() => setFeedbackVisible(false)}
      />
    </View>
  );
}
