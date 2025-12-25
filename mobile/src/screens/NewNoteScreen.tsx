import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../constants/theme'
import { useStore } from '../store'

export default function NewNoteScreen({ navigation }: any) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const { addNote } = useStore()

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Başlık Gerekli', 'Lütfen notunuz için bir başlık girin')
      return
    }

    const newNote = {
      id: `note-${Date.now()}`,
      title: title.trim(),
      content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: content }] }] },
      summary: null,
      folderId: null,
      userId: 'demo-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    addNote(newNote)
    navigation.goBack()
  }

  const canSave = title.trim().length > 0

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Yeni Not</Text>
        
        <TouchableOpacity 
          onPress={handleSave}
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          disabled={!canSave}
        >
          <Text style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}>
            Kaydet
          </Text>
        </TouchableOpacity>
      </View>

      {/* Editor */}
      <ScrollView 
        style={styles.editor}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={styles.titleInput}
          placeholder="Başlık"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
          autoFocus
          selectionColor={colors.primary}
        />
        
        <TextInput
          style={styles.contentInput}
          placeholder="Düşüncelerini yaz..."
          placeholderTextColor={colors.textMuted}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          selectionColor={colors.primary}
        />
      </ScrollView>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.toolbarLeft}>
          <TouchableOpacity style={styles.toolButton}>
            <Ionicons name="text" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton}>
            <Ionicons name="list" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton}>
            <Ionicons name="checkbox-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton}>
            <Ionicons name="code-slash" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.toolbarRight}>
          <TouchableOpacity style={styles.folderButton}>
            <Ionicons name="folder-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.folderButtonText}>Klasör Seç</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  saveButtonDisabled: {
    backgroundColor: colors.borderLight,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.sm,
  },
  saveButtonTextDisabled: {
    color: colors.textMuted,
  },
  editor: {
    flex: 1,
    padding: spacing.xl,
  },
  titleInput: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg,
    padding: 0,
  },
  contentInput: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 26,
    minHeight: 300,
    padding: 0,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  toolbarLeft: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  toolButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
  },
  toolbarRight: {
    flexDirection: 'row',
  },
  folderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  folderButtonText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
})
