
import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseMoneyValue } from "../utils/moneyUtils";

const GOALS_KEY = "@financia_app:goals";

function parseValue(value, fieldName) {
  const normalized = parseMoneyValue(value);

  if (!Number.isFinite(normalized) || normalized < 0) {
    throw new Error(`Informe um valor válido para ${fieldName}.`);
  }

  return normalized;
}

export async function getGoals() {
  const storedData = await AsyncStorage.getItem(GOALS_KEY);

  if (!storedData) {
    return [];
  }

  const goals = JSON.parse(storedData);

  if (!Array.isArray(goals)) {
    throw new Error("Os dados das metas estão inválidos.");
  }

  return goals;
}

export async function addGoal(data) {
  const name = String(data.name ?? "").trim();

  if (!name) {
    throw new Error("Informe o nome da meta.");
  }

  const targetValue = parseValue(data.targetValue, "valor desejado");

  if (targetValue <= 0) {
    throw new Error("O valor desejado deve ser maior que zero.");
  }

  const currentValue = parseValue(data.currentValue ?? 0, "valor guardado");

  const goals = await getGoals();

  const newGoal = {
    id: `goal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    targetValue,
    currentValue,
    createdAt: new Date().toISOString(),
  };

  const updatedGoals = [...goals, newGoal];

  await AsyncStorage.setItem(
    GOALS_KEY,
    JSON.stringify(updatedGoals)
  );

  return updatedGoals;
}

export async function updateGoal(id, data) {
  const goals = await getGoals();

  const goalIndex = goals.findIndex((goal) => goal.id === id);

  if (goalIndex === -1) {
    throw new Error("Meta não encontrada.");
  }

  const name = String(data.name ?? "").trim();

  if (!name) {
    throw new Error("Informe o nome da meta.");
  }

  const targetValue = parseValue(data.targetValue, "valor desejado");

  if (targetValue <= 0) {
    throw new Error("O valor desejado deve ser maior que zero.");
  }

  const currentValue = parseValue(data.currentValue, "valor guardado");

  const updatedGoals = [...goals];

  updatedGoals[goalIndex] = {
    ...updatedGoals[goalIndex],
    name,
    targetValue,
    currentValue,
  };

  await AsyncStorage.setItem(
    GOALS_KEY,
    JSON.stringify(updatedGoals)
  );

  return updatedGoals;
}

export async function deleteGoal(id) {
  const goals = await getGoals();

  const updatedGoals = goals.filter((goal) => goal.id !== id);

  if (updatedGoals.length === goals.length) {
    throw new Error("Meta não encontrada.");
  }

  await AsyncStorage.setItem(
    GOALS_KEY,
    JSON.stringify(updatedGoals)
  );

  return updatedGoals;
}
