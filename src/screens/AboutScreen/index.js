
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import FormHeader from "../../components/FormHeader";
import { styles } from "./styles";

const FEATURES = [
  {
    icon: "wallet-outline",
    title: "Controle financeiro",
    description: "Registre e acompanhe suas receitas e despesas.",
  },
  {
    icon: "bar-chart-outline",
    title: "Relatórios",
    description: "Visualize seus resultados financeiros mensais e anuais.",
  },
  {
    icon: "flag-outline",
    title: "Metas financeiras",
    description: "Defina objetivos e acompanhe seu progresso.",
  },
  {
    icon: "shield-checkmark-outline",
    title: "Segurança",
    description: "Proteja o acesso ao aplicativo com PIN e biometria.",
  },
  {
    icon: "document-text-outline",
    title: "Exportação de dados",
    description: "Exporte suas informações em arquivos CSV e PDF.",
  },
];

export default function AboutScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <FormHeader title="Sobre o app" onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="wallet-outline" size={48} color="#FFFFFF" />
        </View>

        <Text style={styles.appName}>Financia-app</Text>

        <Text style={styles.description}>
          Organize suas finanças pessoais, acompanhe suas receitas e despesas,
          planeje seus objetivos e tenha mais controle sobre seu dinheiro.
        </Text>

        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>O que você encontra no app</Text>

          {FEATURES.map((feature) => (
            <View key={feature.title} style={styles.featureItem}>
              <Ionicons
                name={feature.icon}
                size={23}
                color="#0F9D6C"
              />

              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.storageInfo}>
          <Ionicons
            name="phone-portrait-outline"
            size={21}
            color="#0F9D6C"
          />

          <Text style={styles.storageText}>
            Seus dados financeiros são armazenados localmente no dispositivo.
            O aplicativo não possui sincronização automática na nuvem.
          </Text>
        </View>

        <Text style={styles.version}>Versão 1.0.0</Text>

        <Text style={styles.footer}>
          Desenvolvido para ajudar você a cuidar melhor do seu dinheiro.
        </Text>
      </ScrollView>
    </View>
  );
}