import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../constants/theme'
import { useStore } from '../store'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function NotesScreen({ navigation }: any) {
  const { notes } = useStore()

  const renderNote = ({ item, index }: any) => (
    <TouchableOpacity
      style={[
        styles.noteCard,
        index === 0 && styles.noteCardFirst,
        index === notes.length - 1 && styles.noteCardLast,
      ]}
      onPress={() => navigation.navigate('NoteDetail', { noteId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.noteIcon}>
        <Ionicons name="document-text" size={20} color={colors.primary} />
      </View>
      <View style={styles.noteContent}>
        <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.noteMeta}>
          {item.folder && (
            <>
              <View style={[styles.folderDot, { backgroundColor: item.folder.color || colors.primary }]} />
              <Text style={styles.folderName}>{item.folder.name}</Text>
              <Text style={styles.metaDivider}>•</Text>
            </>
          )}
          <Text style={styles.noteDate}>
            {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true, locale: tr })}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="document-text-outline" size={48} color={colors.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>Henüz not yok</Text>
            <Text style={styles.emptyDesc}>
              Düşüncelerini, notlarını ve öğrendiklerini{'\n'}burada organize et
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('NewNote')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.createButtonText}>İlk Notunu Oluştur</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={notes}
          renderItem={renderNote}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewNote')}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.xl,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderBottomWidth: 0,
  },
  noteCardFirst: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  noteCardLast: {
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    borderBottomWidth: 1,
  },
  noteIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  noteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  folderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  folderName: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  metaDivider: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginHorizontal: spacing.xs,
  },
  noteDate: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.xxxl,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  emptyIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.xl,
    gap: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.md,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
})
