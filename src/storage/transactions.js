
import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseMoneyValue } from "../utils/moneyUtils";

const TRANSACTIONS_KEY = "@financia_app:transactions";

function parseValue(value) {
  const normalized = parseMoneyValue(value);

  if (!Number.isFinite(normalized) || normalized <= 0) {
    throw new Error("Informe um valor válido para a movimentação.");
  }

  return normalized;
}

export async function getTransactions() {
  const storedData = await AsyncStorage.getItem(TRANSACTIONS_KEY);

  if (!storedData) {
    return [];
  }

  const transactions = JSON.parse(storedData);

  if (!Array.isArray(transactions)) {
    throw new Error("Os dados das movimentações estão inválidos.");
  }

  return transactions;
}

export async function addTransaction(data, type) {
  if (type !== "income" && type !== "expense") {
    throw new Error("Tipo de movimentação inválido.");
  }

  if (!data.description?.trim()) {
    throw new Error("Informe uma descrição.");
  }

  const transactions = await getTransactions();

  const newTransaction = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    description: data.description.trim(),
    value: parseValue(data.value),
    category: data.category || "Sem categoria",
    date: data.date,
    createdAt: new Date().toISOString(),
  };

  const updatedTransactions = [newTransaction, ...transactions];

  await AsyncStorage.setItem(
    TRANSACTIONS_KEY,
    JSON.stringify(updatedTransactions)
  );

  return newTransaction;
}

export async function updateTransaction(id, data) {
  const transactions = await getTransactions();

  const transactionIndex = transactions.findIndex(
    (transaction) => transaction.id === id
  );

  if (transactionIndex === -1) {
    throw new Error("Movimentação não encontrada.");
  }

  if (!data.description?.trim()) {
    throw new Error("Informe uma descrição.");
  }

  const updatedTransaction = {
    ...transactions[transactionIndex],
    description: data.description.trim(),
    value: parseValue(data.value),
    category: data.category || "Sem categoria",
    date: data.date,
  };

  const updatedTransactions = [...transactions];
  updatedTransactions[transactionIndex] = updatedTransaction;

  await AsyncStorage.setItem(
    TRANSACTIONS_KEY,
    JSON.stringify(updatedTransactions)
  );

  return updatedTransaction;
}

export async function deleteTransaction(id) {
  const transactions = await getTransactions();

  const updatedTransactions = transactions.filter(
    (transaction) => transaction.id !== id
  );

  await AsyncStorage.setItem(
    TRANSACTIONS_KEY,
    JSON.stringify(updatedTransactions)
  );

  return updatedTransactions;
}
