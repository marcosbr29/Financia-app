
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTransactions } from "./transactions";

const CATEGORIES_KEY = "@financia_app:categories";

const DEFAULT_CATEGORIES = [
  {
    id: "default-food",
    name: "Alimentação",
    icon: "restaurant-outline",
    color: "#F2A541",
    isDefault: true,
  },
  {
    id: "default-transport",
    name: "Transporte",
    icon: "car-outline",
    color: "#438BE5",
    isDefault: true,
  },
  {
    id: "default-leisure",
    name: "Lazer",
    icon: "game-controller-outline",
    color: "#A66BE0",
    isDefault: true,
  },
  {
    id: "default-health",
    name: "Saúde",
    icon: "medkit-outline",
    color: "#E26D75",
    isDefault: true,
  },
  {
    id: "default-education",
    name: "Educação",
    icon: "book-outline",
    color: "#36A3D9",
    isDefault: true,
  },
  {
    id: "default-housing",
    name: "Moradia",
    icon: "home-outline",
    color: "#8A79D6",
    isDefault: true,
  },
  {
    id: "default-other",
    name: "Outros",
    icon: "ellipsis-horizontal-circle-outline",
    color: "#8A8A8E",
    isDefault: true,
  },
];

function validateName(name) {
  const normalized = String(name ?? "").trim();

  if (!normalized) {
    throw new Error("Informe o nome da categoria.");
  }

  return normalized;
}

function checkDuplicate(categories, name, ignoredId = null) {
  const normalized = name.toLocaleLowerCase("pt-BR");

  return categories.some(
    (category) =>
      category.id !== ignoredId &&
      category.name.toLocaleLowerCase("pt-BR") === normalized
  );
}

export async function getCategories() {
  const storedData = await AsyncStorage.getItem(CATEGORIES_KEY);

  if (!storedData) {
    await AsyncStorage.setItem(
      CATEGORIES_KEY,
      JSON.stringify(DEFAULT_CATEGORIES)
    );

    return DEFAULT_CATEGORIES;
  }

  const categories = JSON.parse(storedData);

  if (!Array.isArray(categories)) {
    throw new Error("Os dados das categorias estão inválidos.");
  }

  const existingIds = new Set(categories.map((category) => category.id));
  const missingDefaults = DEFAULT_CATEGORIES.filter(
    (category) => !existingIds.has(category.id)
  );

  if (missingDefaults.length > 0) {
    const updatedCategories = [...categories, ...missingDefaults];

    await AsyncStorage.setItem(
      CATEGORIES_KEY,
      JSON.stringify(updatedCategories)
    );

    return updatedCategories;
  }

  return categories;
}

export async function addCategory(name) {
  const categories = await getCategories();
  const normalizedName = validateName(name);

  if (checkDuplicate(categories, normalizedName)) {
    throw new Error("Já existe uma categoria com esse nome.");
  }

  const newCategory = {
    id: `category-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: normalizedName,
    icon: "pricetag-outline",
    color: "#0F9D6C",
    isDefault: false,
  };

  const updatedCategories = [...categories, newCategory];

  await AsyncStorage.setItem(
    CATEGORIES_KEY,
    JSON.stringify(updatedCategories)
  );

  return updatedCategories;
}

export async function updateCategory(id, name) {
  const categories = await getCategories();
  const normalizedName = validateName(name);

  const categoryIndex = categories.findIndex(
    (category) => category.id === id
  );

  if (categoryIndex === -1) {
    throw new Error("Categoria não encontrada.");
  }

  const currentCategory = categories[categoryIndex];

  if (currentCategory.isDefault) {
    throw new Error("As categorias originais não podem ser editadas.");
  }

  if (checkDuplicate(categories, normalizedName, id)) {
    throw new Error("Já existe uma categoria com esse nome.");
  }

  const updatedCategories = [...categories];

  updatedCategories[categoryIndex] = {
    ...currentCategory,
    name: normalizedName,
  };

  const transactions = await getTransactions();

  const updatedTransactions = transactions.map((transaction) => {
    if (
      transaction.type === "expense" &&
      transaction.category === currentCategory.name
    ) {
      return {
        ...transaction,
        category: normalizedName,
      };
    }

    return transaction;
  });

  await AsyncStorage.setItem(
    CATEGORIES_KEY,
    JSON.stringify(updatedCategories)
  );

  if (
    updatedTransactions.some(
      (transaction, index) =>
        transaction.category !== transactions[index]?.category
    )
  ) {
    await AsyncStorage.setItem(
      "@financia_app:transactions",
      JSON.stringify(updatedTransactions)
    );
  }

  return updatedCategories;
}

export async function deleteCategory(id) {
  const categories = await getCategories();

  const category = categories.find((item) => item.id === id);

  if (!category) {
    throw new Error("Categoria não encontrada.");
  }

  if (category.isDefault) {
    throw new Error("As categorias originais não podem ser excluídas.");
  }

  const transactions = await getTransactions();

  const isBeingUsed = transactions.some(
    (transaction) =>
      transaction.type === "expense" &&
      transaction.category === category.name
  );

  if (isBeingUsed) {
    throw new Error(
      "Esta categoria está sendo utilizada em uma ou mais despesas. Não é possível excluí-la."
    );
  }

  const updatedCategories = categories.filter(
    (item) => item.id !== id
  );

  await AsyncStorage.setItem(
    CATEGORIES_KEY,
    JSON.stringify(updatedCategories)
  );

  return updatedCategories;
}
