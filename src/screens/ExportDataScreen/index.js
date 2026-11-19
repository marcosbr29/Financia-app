import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { sortTransactionsByDate } from "../../utils/dateUtils";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import FormHeader from "../../components/FormHeader";
import FeedbackModal from "../../components/FeedbackModal";
import { colors } from "../../theme/colors";
import { styles } from "./styles";
import { getTransactions } from "../../storage/transactions";

const EXPORT_OPTIONS = [
  {
    title: "Exportar para CSV",
    description: "Formato compatível com Excel e planilhas.",
    icon: "document-text-outline",
    format: "CSV",
  },
  {
    title: "Exportar para PDF",
    description: "Relatório formatado para consultar ou compartilhar.",
    icon: "document-outline",
    format: "PDF",
  },
];

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function escapeCSV(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getFileDate() {
  return new Date().toISOString().slice(0, 10);
}

function calculateTotals(transactions) {
  return transactions.reduce(
    (totals, transaction) => {
      if (transaction.type === "income") {
        totals.income += Number(transaction.value) || 0;
      } else if (transaction.type === "expense") {
        totals.expense += Number(transaction.value) || 0;
      }

      return totals;
    },
    { income: 0, expense: 0 },
  );
}

export default function ExportDataScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("success");

  function showFeedback(title, message, type = "success") {
    setFeedbackTitle(title);
    setFeedbackMessage(message);
    setFeedbackType(type);
    setFeedbackVisible(true);
  }

  async function shareFile(uri, format) {
    const available = await Sharing.isAvailableAsync();

    if (!available) {
      throw new Error(
        "O compartilhamento não está disponível neste dispositivo.",
      );
    }

    await Sharing.shareAsync(uri, {
      dialogTitle: `Compartilhar arquivo ${format}`,
      mimeType: format === "CSV" ? "text/csv" : "application/pdf",
      UTI:
        format === "CSV"
          ? "public.comma-separated-values-text"
          : "com.adobe.pdf",
    });
  }

  async function exportCSV(transactions) {
    const header = ["Tipo", "Descrição", "Valor", "Categoria", "Data"];

    const rows = transactions.map((transaction) => [
      transaction.type === "income" ? "Receita" : "Despesa",
      transaction.description,
      Number(transaction.value || 0)
        .toFixed(2)
        .replace(".", ","),
      transaction.category || "Sem categoria",
      transaction.date || "",
    ]);

    const csvContent = [
      header.map(escapeCSV).join(";"),
      ...rows.map((row) => row.map(escapeCSV).join(";")),
    ].join("\r\n");

    const fileName = `financia_movimentacoes_${getFileDate()}.csv`;
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(fileUri, `\uFEFF${csvContent}`, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await shareFile(fileUri, "CSV");
  }

  async function exportPDF(transactions) {
    const totals = calculateTotals(transactions);
    const balance = totals.income - totals.expense;

    const rows = transactions
      .map(
        (transaction) => `
          <tr>
            <td>${transaction.type === "income" ? "Receita" : "Despesa"}</td>
            <td>${escapeHTML(transaction.description)}</td>
            <td>${escapeHTML(transaction.category || "Sem categoria")}</td>
            <td>${escapeHTML(transaction.date || "")}</td>
            <td class="value">${formatCurrency(transaction.value)}</td>
          </tr>
        `,
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            * {
              box-sizing: border-box;
            }

            body {
              font-family: Arial, sans-serif;
              color: #1E1E1E;
              padding: 24px;
            }

            h1 {
              color: #0F9D6C;
              font-size: 24px;
              margin-bottom: 6px;
            }

            .subtitle {
              color: #8A8A8E;
              font-size: 12px;
              margin-bottom: 24px;
            }

            .summary {
              display: flex;
              gap: 10px;
              margin-bottom: 24px;
            }

            .summary-card {
              flex: 1;
              padding: 12px;
              background: #F5F6F8;
              border-radius: 8px;
            }

            .summary-card span {
              display: block;
              color: #777;
              font-size: 11px;
              margin-bottom: 8px;
            }

            .summary-card strong {
              font-size: 14px;
            }

            .income {
              color: #1FAA59;
            }

            .expense {
              color: #E24C4C;
            }

            h2 {
              font-size: 16px;
              margin-bottom: 12px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
            }

            th {
              background: #0F9D6C;
              color: white;
              text-align: left;
              padding: 9px 6px;
            }

            td {
              padding: 9px 6px;
              border-bottom: 1px solid #E5E5E5;
            }

            .value {
              text-align: right;
              white-space: nowrap;
            }

            .empty {
              color: #8A8A8E;
              text-align: center;
              padding: 20px;
            }

            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <h1>Financia</h1>
          <p class="subtitle">
            Relatório financeiro gerado em ${new Date().toLocaleDateString("pt-BR")}
          </p>

          <div class="summary">
            <div class="summary-card">
              <span>Receitas</span>
              <strong class="income">${formatCurrency(totals.income)}</strong>
            </div>

            <div class="summary-card">
              <span>Despesas</span>
              <strong class="expense">${formatCurrency(totals.expense)}</strong>
            </div>

            <div class="summary-card">
              <span>Saldo</span>
              <strong>${formatCurrency(balance)}</strong>
            </div>
          </div>

          <h2>Movimentações</h2>

          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Data</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              ${
                rows ||
                '<tr><td colspan="5" class="empty">Nenhuma movimentação cadastrada.</td></tr>'
              }
            </tbody>
          </table>
        </body>
      </html>
    `;

    const result = await Print.printToFileAsync({
      html,
      base64: true,
    });

    if (!result.base64) {
      throw new Error("Não foi possível gerar o conteúdo do PDF.");
    }

    const fileName = `financia_relatorio_${Date.now()}.pdf`;
    const destinationUri = `${FileSystem.cacheDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(destinationUri, result.base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileInfo = await FileSystem.getInfoAsync(destinationUri);

    if (!fileInfo.exists || !fileInfo.size) {
      throw new Error("O arquivo PDF foi gerado vazio.");
    }

    await shareFile(destinationUri, "PDF");
  }

  async function handleExport(format) {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      const transactions = sortTransactionsByDate(await getTransactions());
      if (transactions.length === 0) {
        showFeedback(
          "Nenhuma movimentação",
          "Cadastre pelo menos uma receita ou despesa antes de exportar.",
          "error",
        );
        return;
      }

      if (format === "CSV") {
        await exportCSV(transactions);
      } else {
        await exportPDF(transactions);
      }

      showFeedback(
        format === "CSV" ? "Arquivo gerado!" : "Relatório pronto!",
        format === "CSV"
          ? "Seu arquivo CSV foi preparado para compartilhamento."
          : "Escolha a opção Salvar como PDF na tela de impressão para guardar seu relatório.",
      );
    } catch (error) {
      showFeedback(
        "Erro na exportação",
        error instanceof Error
          ? error.message
          : "Não foi possível exportar seus dados.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <FormHeader title="Exportar dados" onBack={() => router.back()} />

      <View style={styles.content}>
        <Text style={styles.description}>
          Escolha um formato para exportar suas informações financeiras.
        </Text>

        {EXPORT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.format}
            style={styles.option}
            activeOpacity={0.7}
            disabled={loading}
            onPress={() => handleExport(option.format)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={option.icon} size={24} color={colors.primary} />
            </View>

            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>
                {loading ? "Preparando arquivo..." : option.description}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textGray}
            />
          </TouchableOpacity>
        ))}
      </View>

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
