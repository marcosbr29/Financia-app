import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { sortTransactionsByDate } from "../../utils/dateUtils";

import FormHeader from "../../components/FormHeader";
import FeedbackModal from "../../components/FeedbackModal";
import { colors } from "../../theme/colors";
import { getTransactions, deleteTransaction } from "../../storage/transactions";
import { styles } from "./styles";

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function TransactionsScreen() {
  const router = useRouter();

  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("success");

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadTransactions() {
        try {
          const data = await getTransactions();

          if (isActive) {
            setTransactions(data);
          }
        } catch (error) {
          if (isActive) {
            setFeedbackTitle("Erro");
            setFeedbackMessage("Não foi possível carregar suas movimentações.");
            setFeedbackType("error");
            setFeedbackVisible(true);
          }
        }
      }

      loadTransactions();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const filteredTransactions = sortTransactionsByDate(
    transactions.filter((item) => {
      if (filter === "income") {
        return item.type === "income";
      }

      if (filter === "expense") {
        return item.type === "expense";
      }

      return true;
    }),
  );
  function handleEdit(transaction) {
    if (transaction.type === "expense") {
      router.push({
        pathname: "/add-expense",
        params: { id: transaction.id },
      });
    } else {
      router.push({
        pathname: "/add-income",
        params: { id: transaction.id },
      });
    }
  }

  async function handleDelete() {
    if (!selectedTransaction) {
      return;
    }

    try {
      const updatedTransactions = await deleteTransaction(
        selectedTransaction.id,
      );

      setTransactions(updatedTransactions);
      setDeleteModalVisible(false);
      setSelectedTransaction(null);
      setFeedbackTitle("Movimentação excluída!");
      setFeedbackMessage("A movimentação foi removida com sucesso.");
      setFeedbackType("success");
      setFeedbackVisible(true);
    } catch (error) {
      setDeleteModalVisible(false);
      setFeedbackTitle("Erro ao excluir");
      setFeedbackMessage("Não foi possível excluir a movimentação.");
      setFeedbackType("error");
      setFeedbackVisible(true);
    }
  }

  return (
    <View style={styles.screen}>
      <FormHeader title="Movimentações" onBack={() => router.back()} />

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "all" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.filterTextActive,
            ]}
          >
            Todas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "income" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("income")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "income" && styles.filterTextActive,
            ]}
          >
            Receitas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "expense" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("expense")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "expense" && styles.filterTextActive,
            ]}
          >
            Despesas
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((item) => {
            const isIncome = item.type === "income";

            return (
              <View key={item.id} style={styles.transactionCard}>
                <View
                  style={[
                    styles.iconContainer,
                    isIncome ? styles.incomeIcon : styles.expenseIcon,
                  ]}
                >
                  <Ionicons
                    name={isIncome ? "arrow-down-outline" : "arrow-up-outline"}
                    size={22}
                    color={isIncome ? colors.income : colors.expense}
                  />
                </View>

                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>
                    {item.description}
                  </Text>

                  <Text style={styles.transactionDetails}>
                    {isIncome ? "Receita" : item.category} • {item.date}
                  </Text>

                  <Text
                    style={[
                      styles.transactionValue,
                      {
                        color: isIncome ? colors.income : colors.expense,
                      },
                    ]}
                  >
                    {isIncome ? "+ " : "- "}
                    {formatCurrency(item.value)}
                  </Text>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEdit(item)}
                  >
                    <Ionicons
                      name="create-outline"
                      size={21}
                      color={colors.primary}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      setSelectedTransaction(item);
                      setDeleteModalVisible(true);
                    }}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={21}
                      color={colors.expense}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="file-tray-outline"
              size={48}
              color={colors.textGray}
            />
            <Text style={styles.emptyTitle}>
              Nenhuma movimentação encontrada
            </Text>
            <Text style={styles.emptyText}>
              As movimentações cadastradas aparecerão aqui.
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Ionicons
              name="alert-circle-outline"
              size={42}
              color={colors.expense}
            />

            <Text style={styles.modalTitle}>Excluir movimentação?</Text>

            <Text style={styles.modalMessage}>
              Tem certeza de que deseja excluir{" "}
              {selectedTransaction?.description
                ? `"${selectedTransaction.description}"`
                : "esta movimentação"}
              ? Essa ação não poderá ser desfeita.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setSelectedTransaction(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>Excluir</Text>
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
