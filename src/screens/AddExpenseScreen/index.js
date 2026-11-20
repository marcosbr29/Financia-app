
import React, { useCallback, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

import FormHeader from "../../components/FormHeader";
import FormField from "../../components/FormField";
import FeedbackModal from "../../components/FeedbackModal";
import { SaveButton, CancelButton } from "../../components/FormButtons";
import { getCategories } from "../../storage/categories";
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

export default function AddExpenseScreen({
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

  const [category, setCategory] = useState(
    initialData?.category ?? ""
  );

  const [date, setDate] = useState(
    formatDateInput(initialData?.date)
  );

  const [categories, setCategories] = useState([]);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackTitle, setFeedbackTitle] = useState("Erro");

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadCategories() {
        try {
          const data = await getCategories();

          if (isActive) {
            setCategories(data);
          }
        } catch (error) {
          if (isActive) {
            setFeedbackTitle("Erro ao carregar categorias");
            setFeedbackMessage(
              error.message || "Não foi possível carregar as categorias."
            );
            setFeedbackVisible(true);
          }
        }
      }

      loadCategories();

      return () => {
        isActive = false;
      };
    }, [])
  );

  function handleSave() {
    if (!isValidDate(date)) {
      setFeedbackTitle("Data inválida");
      setFeedbackMessage(
        "Informe uma data válida no formato DD/MM/AAAA."
      );
      setFeedbackVisible(true);
      return;
    }

    onSave && onSave({ description, value, category, date });
  }

  return (
    <View style={styles.screen}>
      <FormHeader
        title={initialData ? "Editar Despesa" : "Nova Despesa"}
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
          placeholder="Ex: Mercado"
        />

        <FormField
          label="Valor"
          value={value}
          onChangeText={setValue}
          placeholder="R$ 0,00"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Categoria</Text>

        <TouchableOpacity
          style={styles.selectWrapper}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Text
            style={[
              styles.selectText,
              !category && { color: colors.textGray },
            ]}
          >
            {category || "Selecione uma categoria"}
          </Text>

          <Ionicons
            name="chevron-down"
            size={18}
            color={colors.textGray}
          />
        </TouchableOpacity>

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

      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setCategoryModalVisible(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            padding: 28,
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={{
              backgroundColor: colors.white,
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.textDark,
                marginBottom: 12,
              }}
            >
              Escolha uma categoria
            </Text>

            {categories.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setCategory(item.name);
                  setCategoryModalVisible(false);
                }}
                style={{
                  paddingVertical: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.background,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.textDark,
                    fontSize: 16,
                  }}
                >
                  {item.name}
                </Text>

                {category === item.name && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <FeedbackModal
        visible={feedbackVisible}
        title={feedbackTitle}
        message={feedbackMessage}
        type="error"
        onClose={() => setFeedbackVisible(false)}
      />
    </View>
  );
}