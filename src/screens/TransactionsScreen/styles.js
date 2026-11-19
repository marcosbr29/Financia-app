
import { StyleSheet } from "react-native";
import { colors, spacing } from "../../theme/colors";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterContainer: {
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: 9,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textGray,
  },
  filterTextActive: {
    color: colors.white,
  },
  scroll: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  incomeIcon: {
    backgroundColor: "#E4F6EC",
  },
  expenseIcon: {
    backgroundColor: "#FCE9E9",
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionTitle: {
    color: colors.textDark,
    fontSize: 15,
    fontWeight: "700",
  },
  transactionDetails: {
    color: colors.textGray,
    fontSize: 12,
    marginTop: 4,
  },
  transactionValue: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 7,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 70,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 16,
    textAlign: "center",
  },
  emptyText: {
    color: colors.textGray,
    fontSize: 13,
    marginTop: 7,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  confirmModal: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: {
    color: colors.textDark,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
  },
  modalMessage: {
    color: colors.textGray,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 10,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    marginTop: 24,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  cancelButtonText: {
    color: colors.textDark,
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: colors.expense,
  },
  deleteButtonText: {
    color: colors.white,
    fontWeight: "700",
  },
});
