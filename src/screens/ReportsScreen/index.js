
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import FormHeader from "../../components/FormHeader";
import BottomNav from "../../components/BottomNav";
import FeedbackModal from "../../components/FeedbackModal";
import { getTransactions } from "../../storage/transactions";
import { colors } from "../../theme/colors";
import {
  MONTH_NAMES,
  parseTransactionDate,
} from "../../utils/dateUtils";
import { styles } from "./styles";

function calculateTotals(transactions) {
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.value), 0);

  const expense = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.value), 0);

  return {
    income,
    expense,
    balance: income - expense,
  };
}

function formatMoney(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ReportsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const initialPeriod = Array.isArray(params.period)
    ? params.period[0]
    : params.period;

  const [viewMode, setViewMode] = useState(
    initialPeriod === "year" ? "year" : "month"
  );

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth()
  );

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  const [transactions, setTransactions] = useState([]);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    if (initialPeriod === "year" || initialPeriod === "month") {
      setViewMode(initialPeriod);
    }
  }, [initialPeriod]);

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
            setFeedbackMessage(
              "Não foi possível carregar os relatórios."
            );
            setFeedbackVisible(true);
          }
        }
      }

      loadTransactions();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const yearTransactions = transactions.filter((item) => {
    const date = parseTransactionDate(item.date);

    return date && date.getFullYear() === selectedYear;
  });

  const monthTransactions = yearTransactions.filter((item) => {
    const date = parseTransactionDate(item.date);

    return date && date.getMonth() === selectedMonth;
  });

  const monthlyTotals = calculateTotals(monthTransactions);
  const yearlyTotals = calculateTotals(yearTransactions);

  const monthlyData = MONTH_NAMES.map((name, index) => {
    const monthItems = yearTransactions.filter((item) => {
      const date = parseTransactionDate(item.date);

      return date && date.getMonth() === index;
    });

    return {
      name,
      month: index,
      ...calculateTotals(monthItems),
      count: monthItems.length,
    };
  });

  function changeMonth(direction) {
    if (direction > 0 && selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((year) => year + 1);
      return;
    }

    if (direction < 0 && selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((year) => year - 1);
      return;
    }

    setSelectedMonth((month) => month + direction);
  }

  function changeYear(direction) {
    setSelectedYear((year) => year + direction);
  }

  function openMonth(month) {
    setSelectedMonth(month);
    setViewMode("month");
  }

  return (
    <View style={styles.screen}>
      <FormHeader
        title="Relatórios"
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              viewMode === "month" && styles.modeButtonActive,
            ]}
            onPress={() => setViewMode("month")}
          >
            <Text
              style={[
                styles.modeText,
                viewMode === "month" && styles.modeTextActive,
              ]}
            >
              Mensal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              viewMode === "year" && styles.modeButtonActive,
            ]}
            onPress={() => setViewMode("year")}
          >
            <Text
              style={[
                styles.modeText,
                viewMode === "year" && styles.modeTextActive,
              ]}
            >
              Anual
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.periodSelector}>
          {viewMode === "month" && (
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => changeMonth(-1)}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}

          {viewMode === "year" && (
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => changeYear(-1)}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}

          <View style={styles.periodTextContainer}>
            <Text style={styles.periodTitle}>
              {viewMode === "month"
                ? MONTH_NAMES[selectedMonth]
                : "Ano completo"}
            </Text>

            <Text style={styles.periodSubtitle}>
              {selectedYear}
            </Text>
          </View>

          {viewMode === "month" && (
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => changeMonth(1)}
            >
              <Ionicons
                name="chevron-forward"
                size={22}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}

          {viewMode === "year" && (
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => changeYear(1)}
            >
              <Ionicons
                name="chevron-forward"
                size={22}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Saldo do período</Text>

          <Text
            style={[
              styles.summaryBalance,
              {
                color:
                  (viewMode === "month"
                    ? monthlyTotals.balance
                    : yearlyTotals.balance) >= 0
                    ? colors.primary
                    : colors.expense,
              },
            ]}
          >
            {formatMoney(
              viewMode === "month"
                ? monthlyTotals.balance
                : yearlyTotals.balance
            )}
          </Text>

          <View style={styles.divider} />

          <View style={styles.valuesRow}>
            <View style={styles.valueColumn}>
              <Text style={styles.valueLabel}>Receitas</Text>
              <Text style={[styles.valueAmount, styles.incomeText]}>
                {formatMoney(
                  viewMode === "month"
                    ? monthlyTotals.income
                    : yearlyTotals.income
                )}
              </Text>
            </View>

            <View style={styles.valueColumn}>
              <Text style={styles.valueLabel}>Despesas</Text>
              <Text style={[styles.valueAmount, styles.expenseText]}>
                {formatMoney(
                  viewMode === "month"
                    ? monthlyTotals.expense
                    : yearlyTotals.expense
                )}
              </Text>
            </View>
          </View>
        </View>

        {viewMode === "month" ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Resumo de {MONTH_NAMES[selectedMonth]}
            </Text>

            <View style={styles.informationCard}>
              <Text style={styles.informationText}>
                Total de movimentações
              </Text>

              <Text style={styles.informationValue}>
                {monthTransactions.length}
              </Text>
            </View>

            {monthTransactions.length === 0 && (
              <Text style={styles.emptyText}>
                Nenhuma movimentação registrada neste mês.
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Resumo mensal
            </Text>

            {monthlyData.map((item) => (
              <TouchableOpacity
                key={item.month}
                style={styles.monthCard}
                onPress={() => openMonth(item.month)}
              >
                <View style={styles.monthCardHeader}>
                  <Text style={styles.monthName}>
                    {item.name}
                  </Text>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.textGray}
                  />
                </View>

                <View style={styles.monthValues}>
                  <View>
                    <Text style={styles.monthLabel}>Receitas</Text>
                    <Text style={[styles.monthAmount, styles.incomeText]}>
                      {formatMoney(item.income)}
                    </Text>
                  </View>

                  <View>
                    <Text style={styles.monthLabel}>Despesas</Text>
                    <Text style={[styles.monthAmount, styles.expenseText]}>
                      {formatMoney(item.expense)}
                    </Text>
                  </View>

                  <View>
                    <Text style={styles.monthLabel}>Saldo</Text>
                    <Text
                      style={[
                        styles.monthAmount,
                        {
                          color:
                            item.balance >= 0
                              ? colors.primary
                              : colors.expense,
                        },
                      ]}
                    >
                      {formatMoney(item.balance)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <FeedbackModal
        visible={feedbackVisible}
        title="Erro"
        message={feedbackMessage}
        type="error"
        onClose={() => setFeedbackVisible(false)}
      />

      <BottomNav
        activeTab="relatorios"
        onChangeTab={(tab) => {
          if (tab === "inicio") {
            router.push("/");
          } else if (tab === "historico") {
            router.push("/transactions");
          } else if (tab === "config") {
            router.push("/settings");
          }
        }}
      />
    </View>
  );
}
