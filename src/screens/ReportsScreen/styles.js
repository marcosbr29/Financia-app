
import { StyleSheet } from "react-native";
import { colors, spacing } from "../../theme/colors";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  modeSelector: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing.lg,
  },
  modeButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 9,
  },
  modeButtonActive: {
    backgroundColor: colors.primary,
  },
  modeText: {
    color: colors.textGray,
    fontSize: 14,
    fontWeight: "600",
  },
  modeTextActive: {
    color: colors.white,
  },
  periodSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  arrowButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  periodTextContainer: {
    alignItems: "center",
  },
  periodTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textDark,
  },
  periodSubtitle: {
    fontSize: 14,
    color: colors.textGray,
    marginTop: 3,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textGray,
  },
  summaryBalance: {
    fontSize: 27,
    fontWeight: "700",
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.background,
    marginVertical: spacing.md,
  },
  valuesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  valueColumn: {
    flex: 1,
  },
  valueLabel: {
    fontSize: 13,
    color: colors.textGray,
    marginBottom: 6,
  },
  valueAmount: {
    fontSize: 16,
    fontWeight: "700",
  },
  incomeText: {
    color: colors.income,
  },
  expenseText: {
    color: colors.expense,
  },
  section: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  informationCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  informationText: {
    fontSize: 14,
    color: colors.textGray,
  },
  informationValue: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textDark,
  },
  emptyText: {
    textAlign: "center",
    color: colors.textGray,
    marginTop: spacing.lg,
  },
  monthCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  monthCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  monthName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textDark,
  },
  monthValues: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  monthLabel: {
    fontSize: 11,
    color: colors.textGray,
    marginBottom: 5,
  },
  monthAmount: {
    fontSize: 12,
    fontWeight: "700",
  },
});
