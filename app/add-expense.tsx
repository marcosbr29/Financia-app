
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AddExpenseScreen from "../src/screens/AddExpenseScreen";
import FeedbackModal from "../src/components/FeedbackModal";
import {
  addTransaction,
  getTransactions,
  updateTransaction,
} from "../src/storage/transactions";

type ExpenseData = {
  description: string;
  value: string;
  category: string;
  date: string;
};

export default function AddExpense() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();

  const transactionId = Array.isArray(id) ? id[0] : id;

  const [initialData, setInitialData] = useState<ExpenseData | undefined>();
  const [isReady, setIsReady] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("success");
  const [shouldNavigateBackOnClose, setShouldNavigateBackOnClose] =
    useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadTransaction() {
      if (!transactionId) {
        setIsReady(true);
        return;
      }

      try {
        const transactions = await getTransactions();
        const transaction = transactions.find(
          (item) => item.id === transactionId && item.type === "expense"
        );

        if (!transaction) {
          throw new Error("Despesa não encontrada.");
        }

        if (isActive) {
          setInitialData({
            description: transaction.description,
            value: String(transaction.value),
            category: transaction.category,
            date: transaction.date,
          });
          setIsReady(true);
        }
      } catch (error) {
        if (isActive) {
          setFeedbackTitle("Erro");
          setFeedbackMessage(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar a despesa."
          );
          setFeedbackType("error");
          setShouldNavigateBackOnClose(true);
          setFeedbackVisible(true);
          setIsReady(true);
        }
      }
    }

    loadTransaction();

    return () => {
      isActive = false;
    };
  }, [transactionId]);

  async function handleSave(data: ExpenseData) {
    try {
      if (transactionId) {
        await updateTransaction(transactionId, data);
      } else {
        await addTransaction(data, "expense");
      }

      setFeedbackTitle(
        transactionId ? "Despesa atualizada!" : "Despesa salva!"
      );
      setFeedbackMessage(
        transactionId
          ? "Sua despesa foi atualizada com sucesso."
          : "Sua despesa foi registrada com sucesso."
      );
      setFeedbackType("success");
      setShouldNavigateBackOnClose(true);
      setFeedbackVisible(true);
    } catch (error) {
      setFeedbackTitle("Erro ao salvar");
      setFeedbackMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a despesa."
      );
      setFeedbackType("error");
      setShouldNavigateBackOnClose(false);
      setFeedbackVisible(true);
    }
  }

  function handleFeedbackClose() {
    setFeedbackVisible(false);

    if (shouldNavigateBackOnClose) {
      setShouldNavigateBackOnClose(false);
      router.back();
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {isReady && (!transactionId || initialData) && (
        <AddExpenseScreen
          initialData={initialData}
          onBack={() => router.back()}
          onSave={handleSave}
        />
      )}

      <FeedbackModal
        visible={feedbackVisible}
        title={feedbackTitle}
        message={feedbackMessage}
        type={feedbackType}
        onClose={handleFeedbackClose}
      />
    </View>
  );
}
