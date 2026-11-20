
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";

import FormHeader from "../../components/FormHeader";
import FeedbackModal from "../../components/FeedbackModal";
import { colors } from "../../theme/colors";
import {
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
} from "../../storage/goals";
import { styles } from "./styles";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatInputValue(value) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  return Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function GoalsScreen() {
  const router = useRouter();

  const [goals, setGoals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const [name, setName] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [currentValue, setCurrentValue] = useState("");

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("success");

  const [loading, setLoading] = useState(false);

  const showFeedback = (title, message, type = "success") => {
    setFeedbackTitle(title);
    setFeedbackMessage(message);
    setFeedbackType(type);
    setFeedbackVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function load() {
        try {
          const data = await getGoals();

          if (isActive) {
            setGoals(data);
          }
        } catch (error) {
          if (isActive) {
            showFeedback("Erro", error.message, "error");
          }
        }
      }

      load();

      return () => {
        isActive = false;
      };
    }, [])
  );

  function openAddModal() {
    setSelectedGoal(null);
    setName("");
    setTargetValue("");
    setCurrentValue("");
    setModalVisible(true);
  }

  function openEditModal(goal) {
    setSelectedGoal(goal);
    setName(goal.name);
    setTargetValue(formatInputValue(goal.targetValue));
    setCurrentValue(formatInputValue(goal.currentValue));
    setModalVisible(true);
  }

  async function handleSaveGoal() {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      let updatedGoals;

      const data = {
        name,
        targetValue,
        currentValue: currentValue.trim() || "0",
      };

      if (selectedGoal) {
        updatedGoals = await updateGoal(selectedGoal.id, data);
      } else {
        updatedGoals = await addGoal(data);
      }

      setGoals(updatedGoals);
      setModalVisible(false);
      setSelectedGoal(null);

      showFeedback(
        "Sucesso",
        selectedGoal
          ? "Meta atualizada com sucesso."
          : "Meta criada com sucesso."
      );
    } catch (error) {
      showFeedback("Não foi possível salvar", error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  function openDeleteModal(goal) {
    setSelectedGoal(goal);
    setDeleteModalVisible(true);
  }

  async function handleDeleteGoal() {
    try {
      const updatedGoals = await deleteGoal(selectedGoal.id);

      setGoals(updatedGoals);
      setDeleteModalVisible(false);
      setSelectedGoal(null);

      showFeedback("Sucesso", "Meta excluída com sucesso.");
    } catch (error) {
      setDeleteModalVisible(false);
      showFeedback("Erro", error.message, "error");
    }
  }

  function renderGoal(goal) {
    const progress =
      (Number(goal.currentValue) / Number(goal.targetValue)) * 100;

    const percentage = Math.min(Math.max(progress, 0), 100);
    const completed = progress >= 100;

    return (
      <View key={goal.id} style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <View style={styles.goalIcon}>
            <Ionicons
              name="flag-outline"
              size={22}
              color={colors.primary}
            />
          </View>

          <View style={styles.goalInfo}>
            <Text style={styles.goalName}>{goal.name}</Text>
            <Text style={styles.goalStatus}>
              {completed ? "Meta alcançada!" : "Em andamento"}
            </Text>
          </View>

          <View style={styles.goalActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openEditModal(goal)}
            >
              <Ionicons
                name="create-outline"
                size={19}
                color={colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openDeleteModal(goal)}
            >
              <Ionicons
                name="trash-outline"
                size={19}
                color={colors.expense}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>Progresso</Text>
          <Text style={styles.progressPercentage}>
            {Math.round(percentage)}%
          </Text>
        </View>

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${percentage}%`,
                backgroundColor: completed
                  ? colors.income
                  : colors.primary,
              },
            ]}
          />
        </View>

        <View style={styles.valuesContainer}>
          <View>
            <Text style={styles.valueLabel}>Já guardado</Text>
            <Text style={styles.currentValue}>
              {formatCurrency(goal.currentValue)}
            </Text>
          </View>

          <View style={styles.targetContainer}>
            <Text style={styles.valueLabel}>Objetivo</Text>
            <Text style={styles.targetValue}>
              {formatCurrency(goal.targetValue)}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FormHeader
        title="Minhas Metas"
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Text style={styles.description}>
            Defina seus objetivos financeiros e acompanhe seu progresso.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={openAddModal}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={21} color={colors.white} />
          <Text style={styles.addButtonText}>Nova meta</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Suas metas</Text>

        {goals.length > 0 ? (
          goals.map(renderGoal)
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="flag-outline"
                size={34}
                color={colors.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>Nenhuma meta cadastrada</Text>

            <Text style={styles.emptyDescription}>
              Crie sua primeira meta e comece a acompanhar suas conquistas.
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedGoal ? "Editar meta" : "Nova meta"}
            </Text>

            <Text style={styles.inputLabel}>Nome da meta</Text>

            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ex: Comprar um notebook"
              placeholderTextColor={colors.textGray}
              maxLength={40}
            />

            <Text style={styles.inputLabel}>Valor desejado (R$)</Text>

            <TextInput
              style={styles.input}
              value={targetValue}
              onChangeText={setTargetValue}
              placeholder="Ex: 5000,00"
              placeholderTextColor={colors.textGray}
              keyboardType="decimal-pad"
            />

            <Text style={styles.inputLabel}>Valor já guardado (R$)</Text>

            <TextInput
              style={styles.input}
              value={currentValue}
              onChangeText={setCurrentValue}
              placeholder="Ex: 1500,00"
              placeholderTextColor={colors.textGray}
              keyboardType="decimal-pad"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  loading && styles.disabledButton,
                ]}
                onPress={handleSaveGoal}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? "Salvando..." : "Salvar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.deleteIcon}>
              <Ionicons
                name="trash-outline"
                size={26}
                color={colors.expense}
              />
            </View>

            <Text style={styles.modalTitle}>Excluir meta?</Text>

            <Text style={styles.confirmationText}>
              Deseja realmente excluir a meta{" "}
              <Text style={styles.confirmationName}>
                {selectedGoal?.name}
              </Text>
              ?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteGoal}
              >
                <Text style={styles.saveButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FeedbackModal
        visible={feedbackVisible}
        title={feedbackTitle}
        message={feedbackMessage}
        type={feedbackType}
        onClose={() => setFeedbackVisible(false)}
      />
    </View>
  );
}