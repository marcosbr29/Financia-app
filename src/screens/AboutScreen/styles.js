
import { StyleSheet } from "react-native";
import { colors, spacing } from "../../theme/colors";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },

  content: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },

  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },

  appName: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.textDark,
    marginBottom: spacing.md,
  },

  description: {
    fontSize: 16,
    color: colors.textGray,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 320,
    marginBottom: spacing.xl,
  },

  featuresContainer: {
    width: "100%",
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textDark,
    marginBottom: spacing.md,
  },

  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },

  featureInfo: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textDark,
    marginBottom: 4,
  },

  featureDescription: {
    fontSize: 13,
    color: colors.textGray,
    lineHeight: 19,
  },

  storageInfo: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
  },

  storageText: {
    flex: 1,
    fontSize: 13,
    color: colors.textGray,
    lineHeight: 20,
  },

  version: {
    fontSize: 14,
    color: colors.textGray,
    marginTop: spacing.xl,
  },

  footer: {
    fontSize: 13,
    color: colors.textGray,
    textAlign: "center",
    lineHeight: 20,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
});