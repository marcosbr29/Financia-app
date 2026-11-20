
import { StyleSheet } from "react-native";
import { colors, spacing } from "../../theme/colors";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    backgroundColor: colors.white,
    width: "80%",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textDark,
    textAlign: "center",
    marginBottom: spacing.sm,
  },

  message: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textGray,
    textAlign: "center",
    marginBottom: spacing.lg,
  },

  button: {
    width: "100%",
    padding: 15,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});
