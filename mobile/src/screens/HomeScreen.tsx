import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../constants/theme'
import { useStore } from '../store'

const { width } = Dimensions.get('window')
const cardWidth = (width - spacing.xl * 2 - spacing.md) / 2

export default function HomeScreen({ navigation }: any) {
  const { notes, folders } = useStore()
  const insets = useSafeAreaInsets()
  
  const today = new Date()
  const hour = today.getHours()
  const greeting = hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar'

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting} 👋</Text>
          <Text style={styles.subtitle}>Bugün ne öğrenmek istersin?</Text>
        </View>
        <TouchableOpacity style={styles.avatarButton}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>M</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: colors.infoLight }]}>
            <Ionicons name="document-text" size={18} color={colors.info} />
          </View>
          <Text style={styles.statValue}>{notes.length}</Text>
          <Text style={styles.statLabel}>Not</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: colors.primaryMuted }]}>
            <Ionicons name="folder" size={18} color={colors.primary} />
          </View>
          <Text style={styles.statValue}>{folders.length}</Text>
          <Text style={styles.statLabel}>Klasör</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: colors.successLight }]}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
          </View>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Çözülen</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: colors.warningLight }]}>
            <Ionicons name="flame" size={18} color={colors.warning} />
          </View>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('NewNote')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#5B5FC7', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionGradient}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="add" size={24} color="#fff" />
            </View>
            <Text style={styles.actionTitle}>Yeni Not</Text>
            <Text style={styles.actionDesc}>Hemen başla</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Folders')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionGradient}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="folder-open" size={24} color="#fff" />
            </View>
            <Text style={styles.actionTitle}>Klasörler</Text>
            <Text style={styles.actionDesc}>Organize et</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
          <LinearGradient
            colors={['#F97316', '#EAB308']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionGradient}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="play" size={24} color="#fff" />
            </View>
            <Text style={styles.actionTitle}>Quiz</Text>
            <Text style={styles.actionDesc}>Kendini test et</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
          <LinearGradient
            colors={['#0EA5E9', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionGradient}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="refresh" size={24} color="#fff" />
            </View>
            <Text style={styles.actionTitle}>Tekrar</Text>
            <Text style={styles.actionDesc}>Pekiştir</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Recent Notes */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Son Notlar</Text>
        {notes.length > 0 && (
          <TouchableOpacity onPress={() => navigation.navigate('Notes')}>
            <Text style={styles.seeAll}>Tümünü Gör</Text>
          </TouchableOpacity>
        )}
      </View>

      {notes.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="document-text-outline" size={32} color={colors.textTertiary} />
          </View>
          <Text style={styles.emptyTitle}>Henüz not yok</Text>
          <Text style={styles.emptyDesc}>İlk notunu oluşturarak başla</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('NewNote')}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.emptyButtonText}>Not Oluştur</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.notesList}>
          {notes.slice(0, 3).map((note, index) => (
            <TouchableOpacity
              key={note.id}
              style={[styles.noteCard, index === notes.slice(0, 3).length - 1 && styles.noteCardLast]}
              onPress={() => navigation.navigate('NoteDetail', { noteId: note.id })}
              activeOpacity={0.7}
            >
              <View style={styles.noteContent}>
                <Text style={styles.noteTitle} numberOfLines={1}>{note.title}</Text>
                {note.folder && (
                  <View style={styles.noteMeta}>
                    <View style={[styles.folderDot, { backgroundColor: note.folder.color || colors.primary }]} />
                    <Text style={styles.folderName}>{note.folder.name}</Text>
                  </View>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  greeting: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  avatarButton: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statIcon: {
    width: 36,
    height: 36,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  seeAll: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  actionCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  actionGradient: {
    padding: spacing.lg,
    minHeight: 110,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: '#fff',
  },
  actionDesc: {
    fontSize: fontSize.xs,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xxs,
  },
  emptyState: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderStyle: 'dashed',
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  emptyDesc: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.sm,
  },
  notesList: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  noteCardLast: {
    borderBottomWidth: 0,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  noteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  folderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  folderName: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
})
