import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../constants/theme'

export default function QuizScreen() {
  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {/* Header Stats */}
      <View style={styles.headerStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Bugün</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0%</Text>
          <Text style={styles.statLabel}>Doğruluk</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>

      {/* Quick Quiz Card */}
      <TouchableOpacity style={styles.quizCard} activeOpacity={0.9}>
        <LinearGradient
          colors={['#5B5FC7', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.quizGradient}
        >
          <View style={styles.quizIconContainer}>
            <Ionicons name="flash" size={28} color="#fff" />
          </View>
          <View style={styles.quizContent}>
            <Text style={styles.quizTitle}>Hızlı Quiz</Text>
            <Text style={styles.quizDesc}>Rastgele 10 soru ile kendini test et</Text>
          </View>
          <View style={styles.quizArrow}>
            <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.8)" />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Daily Review Card */}
      <TouchableOpacity style={styles.quizCard} activeOpacity={0.9}>
        <LinearGradient
          colors={['#10B981', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.quizGradient}
        >
          <View style={styles.quizIconContainer}>
            <Ionicons name="refresh" size={28} color="#fff" />
          </View>
          <View style={styles.quizContent}>
            <Text style={styles.quizTitle}>Günlük Tekrar</Text>
            <Text style={styles.quizDesc}>Spaced repetition ile pekiştir</Text>
          </View>
          <View style={styles.reviewBadge}>
            <Text style={styles.reviewBadgeText}>0</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Kategoriler</Text>
      <View style={styles.categoriesEmpty}>
        <View style={styles.emptyIconSmall}>
          <Ionicons name="layers-outline" size={24} color={colors.textTertiary} />
        </View>
        <Text style={styles.emptyTextSmall}>Klasör oluşturarak kategorileri aktif et</Text>
      </View>

      {/* Recent Activity */}
      <Text style={styles.sectionTitle}>Son Aktivite</Text>
      <View style={styles.activityCard}>
        <View style={styles.activityEmpty}>
          <View style={styles.emptyIconSmall}>
            <Ionicons name="trophy-outline" size={32} color={colors.textTertiary} />
          </View>
          <Text style={styles.activityEmptyTitle}>Henüz quiz çözmedin</Text>
          <Text style={styles.activityEmptyDesc}>İlk quizini başlat ve ilerlemeyi takip et</Text>
        </View>
      </View>

      {/* Tips */}
      <View style={styles.tipCard}>
        <View style={styles.tipIcon}>
          <Ionicons name="bulb" size={18} color={colors.warning} />
        </View>
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>İpucu</Text>
          <Text style={styles.tipText}>
            Düzenli tekrar, öğrenmeyi %40 daha etkili hale getirir. Her gün en az 10 dakika çalış!
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.huge,
  },
  headerStats: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: spacing.xxs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.xs,
  },
  quizCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  quizGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
  },
  quizIconContainer: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizContent: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  quizTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: '#fff',
  },
  quizDesc: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xxs,
  },
  quizArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  reviewBadgeText: {
    color: '#fff',
    fontWeight: fontWeight.bold,
    fontSize: fontSize.sm,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  categoriesEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.md,
  },
  emptyIconSmall: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTextSmall: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },
  activityEmpty: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  activityEmptyTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginTop: spacing.md,
  },
  activityEmptyDesc: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.warningLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  tipText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },
})
