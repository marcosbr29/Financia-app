
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import FormHeader from "../../components/FormHeader";
import { colors } from "../../theme/colors";
import { styles } from "./styles";

const HELP_ITEMS = [
  {
    question: "Como adicionar uma receita?",
    answer:
      "Na tela inicial, toque no botão de adicionar e escolha a opção Receita para registrar uma entrada de dinheiro.",
    icon: "trending-up-outline",
  },
  {
    question: "Como adicionar uma despesa?",
    answer:
      "Na tela inicial, toque no botão de adicionar e escolha a opção Despesa para registrar um gasto.",
    icon: "trending-down-outline",
  },
  {
    question: "Como acompanhar minhas finanças?",
    answer:
      "Utilize as telas de Histórico e Relatórios para consultar suas movimentações e visualizar informações financeiras.",
    icon: "stats-chart-outline",
  },
  {
    question: "Para que servem as configurações?",
    answer:
      "Na tela Configurações, você encontra opções relacionadas às categorias, exportação de dados, segurança, informações do aplicativo e ajuda.",
    icon: "settings-outline",
  },
  {
    question: "Como consultar o histórico de movimentações?",
    answer:
      "Acesse a opção Histórico para visualizar suas receitas e despesas cadastradas. Você também pode utilizar os filtros para encontrar movimentações específicas.",
    icon: "receipt-outline",
  },
  {
    question: "Posso editar ou excluir uma movimentação?",
    answer:
      "Sim. No Histórico, você pode selecionar uma movimentação para consultar seus detalhes, editar suas informações ou excluí-la.",
    icon: "create-outline",
  },
  {
    question: "Como funcionam os relatórios?",
    answer:
      "Na tela Relatórios, você pode acompanhar o resumo das suas receitas, despesas e saldo, além de consultar informações por mês ou por ano.",
    icon: "bar-chart-outline",
  },
  {
    question: "Como criar uma meta financeira?",
    answer:
      "Acesse Minhas Metas, escolha Nova meta e informe o nome, o valor desejado e quanto já conseguiu guardar. O aplicativo acompanhará seu progresso.",
    icon: "flag-outline",
  },
  {
    question: "Posso editar ou excluir minhas metas?",
    answer:
      "Sim. Na tela Minhas Metas, utilize os ícones de edição e exclusão disponíveis em cada meta para atualizar ou remover seus objetivos.",
    icon: "trophy-outline",
  },
  {
    question: "Como gerenciar minhas categorias?",
    answer:
      "Nas Configurações, acesse a área de Categorias para consultar, adicionar, editar ou excluir categorias personalizadas. Categorias utilizadas em movimentações possuem restrições para evitar inconsistências.",
    icon: "pricetags-outline",
  },
  {
    question: "Como exportar meus dados?",
    answer:
      "Acesse a opção de exportação nas Configurações. Você pode gerar arquivos nos formatos CSV e PDF para consultar ou compartilhar suas informações financeiras.",
    icon: "download-outline",
  },
  {
    question: "Como proteger o acesso ao aplicativo?",
    answer:
      "Na seção Segurança das Configurações, você pode cadastrar ou alterar um PIN de 4 a 6 dígitos. Se o seu dispositivo oferecer suporte, também poderá ativar a autenticação biométrica.",
    icon: "shield-checkmark-outline",
  },
  {
    question: "Posso alterar meu nome no aplicativo?",
    answer:
      "Sim. Acesse a área de perfil nas Configurações para consultar e atualizar o nome utilizado no aplicativo.",
    icon: "person-outline",
  },
  {
    question: "Onde meus dados ficam armazenados?",
    answer:
      "As informações financeiras são armazenadas localmente no dispositivo, utilizando o armazenamento interno do aplicativo. Atualmente, não há sincronização automática com uma conta ou serviço na nuvem.",
    icon: "phone-portrait-outline",
  },
  {
    question: "Posso cadastrar movimentações com datas futuras?",
    answer:
      "Sim. O aplicativo permite cadastrar movimentações com datas futuras de até um ano a partir do dia atual. Datas fora desse limite não são aceitas.",
    icon: "calendar-outline",
  },
];

export default function HelpScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <FormHeader title="Ajuda" onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="help-circle-outline"
              size={42}
              color={colors.primary}
            />
          </View>

          <Text style={styles.title}>Como podemos ajudar?</Text>

          <Text style={styles.description}>
            Confira algumas orientações para utilizar o Financia-app.
          </Text>
        </View>

        {HELP_ITEMS.map((item) => (
          <View key={item.question} style={styles.helpItem}>
            <View style={styles.questionRow}>
              <Ionicons
                name={item.icon}
                size={21}
                color={colors.primary}
              />

              <Text style={styles.question}>{item.question}</Text>
            </View>

            <Text style={styles.answer}>{item.answer}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
