import { StyleSheet, StatusBar, Platform } from 'react-native';
import { colors, spacing } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 20,
    paddingHorizontal: 20,
    paddingBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  contentCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textGray,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  chartCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 24,
    borderColor: '#2EB872',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenterText: {
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: colors.textGray,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  categoriesList: {
    marginTop: spacing.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  categoryName: {
    fontSize: 15,
    color: colors.textDark,
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginRight: spacing.sm,
  },
  categoryPercentage: {
    fontSize: 13,
    color: colors.textGray,
    minWidth: 40,
    textAlign: 'right',
  },
});