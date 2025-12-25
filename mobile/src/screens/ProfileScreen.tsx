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
import { useStore } from '../store'

const menuSections = [
  {
    title: 'Hesap',
    items: [
      { icon: 'person-outline', label: 'Profil Düzenle', chevron: true },
      { icon: 'notifications-outline', label: 'Bildirimler', chevron: true },
      { icon: 'shield-checkmark-outline', label: 'Gizlilik', chevron: true },
    ],
  },
  {
    title: 'Tercihler',
    items: [
      { icon: 'moon-outline', label: 'Karanlık Mod', toggle: true },
      { icon: 'language-outline', label: 'Dil', value: 'Türkçe' },
      { icon: 'cloud-outline', label: 'Yedekleme', chevron: true },
    ],
  },
  {
    title: 'Destek',
    items: [
      { icon: 'help-circle-outline', label: 'Yardım Merkezi', chevron: true },
      { icon: 'chatbubble-outline', label: 'Geri Bildirim', chevron: true },
      { icon: 'star-outline', label: 'Uygulamayı Değerlendir', chevron: true },
    ],
  },
]

export default function ProfileScreen() {
  const { notes, folders } = useStore()

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.avatarLarge}
        >
          <Text style={styles.avatarText}>M</Text>
        </LinearGradient>
        <Text style={styles.name}>Mehrdad</Text>
        <Text style={styles.email}>mehrdad@example.com</Text>
        
        <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
          <Ionicons name="pencil" size={14} color={colors.primary} />
          <Text style={styles.editButtonText}>Düzenle</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: colors.infoLight }]}>
            <Ionicons name="document-text" size={18} color={colors.info} />
          </View>
          <Text style={styles.statValue}>{notes.length}</Text>
          <Text style={styles.statLabel}>Not</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: colors.primaryMuted }]}>
            <Ionicons name="folder" size={18} color={colors.primary} />
          </View>
          <Text style={styles.statValue}>{folders.length}</Text>
          <Text style={styles.statLabel}>Klasör</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: colors.successLight }]}>
            <Ionicons name="checkmark-done" size={18} color={colors.success} />
          </View>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Quiz</Text>
        </View>
      </View>

      {/* Menu Sections */}
      {menuSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>{section.title}</Text>
          <View style={styles.menuCard}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity 
                key={itemIndex} 
                style={[
                  styles.menuItem,
                  itemIndex === section.items.length - 1 && styles.menuItemLast,
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIcon}>
                    <Ionicons name={item.icon as any} size={20} color={colors.textSecondary} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <View style={styles.menuItemRight}>
                  {item.value && (
                    <Text style={styles.menuValue}>{item.value}</Text>
                  )}
                  {item.chevron && (
                    <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                  )}
                  {item.toggle && (
                    <View style={styles.toggleOff}>
                      <View style={styles.toggleKnob} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>

      {/* Version */}
      <Text style={styles.version}>StudyApp v1.0.0</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.huge,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarText: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: '#fff',
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginTop: spacing.lg,
  },
  email: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  editButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSize.xxs,
    color: colors.textTertiary,
    marginTop: spacing.xxs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  menuSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  menuSectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuLabel: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  menuValue: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  toggleOff: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.border,
    padding: 2,
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.errorLight,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xxl,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
  },
  logoutText: {
    fontSize: fontSize.md,
    color: colors.error,
    fontWeight: fontWeight.semibold,
  },
  version: {
    textAlign: 'center',
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.xl,
  },
})
