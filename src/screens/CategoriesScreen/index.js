
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
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../storage/categories";
import { styles } from "./styles";

export default function CategoriesScreen() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("success");

  const showFeedback = (title, message, type = "success") => {
    setFeedbackTitle(title);
    setFeedbackMessage(message);
    setFeedbackType(type);
    setFeedbackVisible(true);
  };

  const loadCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      showFeedback("Erro", error.message, "error");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [loadCategories])
  );

  function openAddModal() {
    setSelectedCategory(null);
    setCategoryName("");
    setModalVisible(true);
  }

  function openEditModal(category) {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setModalVisible(true);
  }

  async function handleSaveCategory() {
    try {
      let updatedCategories;

      if (selectedCategory) {
        updatedCategories = await updateCategory(
          selectedCategory.id,
          categoryName
        );
      } else {
        updatedCategories = await addCategory(categoryName);
      }

      setCategories(updatedCategories);
      setModalVisible(false);
      setCategoryName("");
      setSelectedCategory(null);

      showFeedback(
        "Sucesso",
        selectedCategory
          ? "Categoria atualizada com sucesso."
          : "Categoria adicionada com sucesso."
      );
    } catch (error) {
      showFeedback("Não foi possível salvar", error.message, "error");
    }
  }

  function openDeleteModal(category) {
    setSelectedCategory(category);
    setDeleteModalVisible(true);
  }

  async function handleDeleteCategory() {
    try {
      const updatedCategories = await deleteCategory(selectedCategory.id);

      setCategories(updatedCategories);
      setDeleteModalVisible(false);
      setSelectedCategory(null);

      showFeedback(
        "Sucesso",
        "Categoria excluída com sucesso."
      );
    } catch (error) {
      setDeleteModalVisible(false);
      showFeedback("Não foi possível excluir", error.message, "error");
    }
  }

  return (
    <View style={styles.screen}>
      <FormHeader
        title="Categorias"
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          Organize suas despesas por categorias. As categorias padrão não
          podem ser editadas ou excluídas.
        </Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={openAddModal}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={21} color={colors.white} />
          <Text style={styles.addButtonText}>Adicionar categoria</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Suas categorias</Text>

        {categories.map((category) => (
          <View key={category.id} style={styles.category}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${category.color}20` },
              ]}
            >
              <Ionicons
                name={category.icon}
                size={22}
                color={category.color}
              />
            </View>

            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryType}>
                {category.isDefault ? "Categoria padrão" : "Personalizada"}
              </Text>
            </View>

            {category.isDefault ? (
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={colors.textGray}
              />
            ) : (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openEditModal(category)}
                >
                  <Ionicons
                    name="create-outline"
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openDeleteModal(category)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={colors.expense}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {categories.length === 0 && (
          <Text style={styles.emptyText}>
            Nenhuma categoria encontrada.
          </Text>
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
              {selectedCategory ? "Editar categoria" : "Nova categoria"}
            </Text>

            <Text style={styles.inputLabel}>Nome da categoria</Text>

            <TextInput
              style={styles.input}
              value={categoryName}
              onChangeText={setCategoryName}
              placeholder="Ex: Viagem"
              placeholderTextColor={colors.textGray}
              maxLength={30}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveCategory}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
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

            <Text style={styles.modalTitle}>Excluir categoria?</Text>

            <Text style={styles.confirmationText}>
              Deseja realmente excluir a categoria{" "}
              <Text style={styles.confirmationName}>
                {selectedCategory?.name}
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
                onPress={handleDeleteCategory}
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
