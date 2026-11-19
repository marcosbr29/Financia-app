
import React, { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";

import { useRouter, useFocusEffect } from "expo-router";
import BalanceCard from "../../components/BalanceCard";
import BottomNav from "../../components/BottomNav";
import ExpenseItem from "../../components/ExpenseItem";
import Header from "../../components/Header";
import FeedbackModal from "../../components/FeedbackModal";
import { colors } from "../../theme/colors";
import { getTransactions } from "../../storage/transactions";
import { getUserName } from "../../storage/profile";
import { MONTH_NAMES, parseTransactionDate } from "../../utils/dateUtils";
import { styles } from "./styles";

function getCategoryIcon(category) {
  const normalizedCategory = category?.toLowerCase();

  const categoryIcons = {
    alimentação: {
      icon: "fast-food-outline",
      iconBg: colors.iconFoodBg,
    },
    transporte: {
      icon: "car-outline",
      iconBg: colors.iconTransportBg,
    },
    lazer: {
      icon: "game-controller-outline",
      iconBg: colors.iconLeisureBg,
    },
    saúde: {
      icon: "medkit-outline",
      iconBg: colors.iconFoodBg,
    },
    educação: {
      icon: "school-outline",
      iconBg: colors.iconTransportBg,
    },
    moradia: {
      icon: "home-outline",
      iconBg: colors.iconLeisureBg,
    },
  };

  return (
    categoryIcons[normalizedCategory] || {
      icon: "wallet-outline",
      iconBg: colors.background,
    }
  );
}

export default function HomeScreen() {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [userName, setUserName] = useState("");
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadHomeData() {
        try {
          const [data, name] = await Promise.all([
            getTransactions(),
            getUserName(),
          ]);

          if (isActive) {
            setTransactions(data);
            setUserName(name);
          }
        } catch (error) {
          if (isActive) {
            setFeedbackMessage(
              "Não foi possível carregar as informações."
            );
            setFeedbackVisible(true);
          }
        }
      }

      loadHomeData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthTransactions = transactions.filter((item) => {
    const date = parseTransactionDate(item.date);

    return (
      date &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  });

  const income = monthTransactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.value), 0);

  const expense = monthTransactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.value), 0);

  const balance = income - expense;

  const recentExpenses = monthTransactions
    .filter((item) => item.type === "expense")
    .sort((a, b) => {
      const dateA = parseTransactionDate(a.date);
      const dateB = parseTransactionDate(b.date);

      return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
    })
    .slice(0, 3);

  function openReports(period) {
    setSummaryModalVisible(false);

    router.push({
      pathname: "/reports",
      params: { period },
    });
  }

  return (
    <View style={styles.screen}>
      <Header
        userName={userName}
        month={`${MONTH_NAMES[currentMonth]} de ${currentYear}`}
        onAddPress={() => setSummaryModalVisible(true)}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BalanceCard
          balance={balance}
          income={income}
          expense={expense}
        />

        <View style={styles.expensesHeader}>
          <Text style={styles.expensesTitle}>Despesas recentes</Text>

          <TouchableOpacity onPress={() => router.push("/transactions")}>
            <Text style={styles.seeAll}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.expensesList}>
          {recentExpenses.length > 0 ? (
            recentExpenses.map((item) => {
              const categoryStyle = getCategoryIcon(item.category);

              return (
                <ExpenseItem
                  key={item.id}
                  icon={categoryStyle.icon}
                  iconBg={categoryStyle.iconBg}
                  title={item.description}
                  date={item.date}
                  value={item.value}
                />
              );
            })
          ) : (
            <Text
              style={{
                color: colors.textGray,
                textAlign: "center",
                paddingVertical: 20,
              }}
            >
              Nenhuma despesa neste mês.
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              O que você deseja adicionar?
            </Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setModalVisible(false);
                router.push("/add-expense");
              }}
            >
              <Text style={styles.modalOptionText}>Despesa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setModalVisible(false);
                router.push("/add-income");
              }}
            >
              <Text style={styles.modalOptionText}>Receita</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={summaryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSummaryModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSummaryModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Consultar relatórios
            </Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => openReports("month")}
            >
              <Text style={styles.modalOptionText}>
                Resumo mensal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => openReports("year")}
            >
              <Text style={styles.modalOptionText}>
                Resumo anual
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => setSummaryModalVisible(false)}
            >
              <Text style={styles.modalOptionText}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <FeedbackModal
        visible={feedbackVisible}
        title="Erro"
        message={feedbackMessage}
        type="error"
        onClose={() => setFeedbackVisible(false)}
      />

      <BottomNav
        activeTab="inicio"
        onChangeTab={(tab) => {
          if (tab === "historico") {
            router.push("/transactions");
          } else if (tab === "relatorios") {
            router.push("/reports");
          } else if (tab === "config") {
            router.push("/settings");
          }
        }}
      />
    </View>
  );
}
