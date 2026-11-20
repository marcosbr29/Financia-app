
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AddIncomeScreen from "../src/screens/AddIncomeScreen";
import FeedbackModal from "../src/components/FeedbackModal";
import {
  addTransaction,
  getTransactions,
  updateTransaction,
} from "../src/storage/transactions";

type IncomeData = {
  description: string;
  value: string;
  date: string;
};

export default function AddIncome() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();

  const transactionId = Array.isArray(id) ? id[0] : id;

  const [initialData, setInitialData] = useState<IncomeData | undefined>();
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
          (item) => item.id === transactionId && item.type === "income"
        );

        if (!transaction) {
          throw new Error("Receita não encontrada.");
        }

        if (isActive) {
          setInitialData({
            description: transaction.description,
            value: String(transaction.value),
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
              : "Não foi possível carregar a receita."
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

  async function handleSave(data: IncomeData) {
    try {
      if (transactionId) {
        await updateTransaction(transactionId, data);
      } else {
        await addTransaction(data, "income");
      }

      setFeedbackTitle(
        transactionId ? "Receita atualizada!" : "Receita salva!"
      );
      setFeedbackMessage(
        transactionId
          ? "Sua receita foi atualizada com sucesso."
          : "Sua receita foi registrada com sucesso."
      );
      setFeedbackType("success");
      setShouldNavigateBackOnClose(true);
      setFeedbackVisible(true);
    } catch (error) {
      setFeedbackTitle("Erro ao salvar");
      setFeedbackMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a receita."
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
        <AddIncomeScreen
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
