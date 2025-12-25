import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Alert,
  ActionSheetIOS,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import * as DocumentPicker from 'expo-document-picker'
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../constants/theme'
import { useStore } from '../store'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import type { FileItem, SortOption, FileFilter } from '../types'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'date_desc', label: 'En Yeni' },
  { value: 'date_asc', label: 'En Eski' },
  { value: 'name_asc', label: 'İsim (A-Z)' },
  { value: 'name_desc', label: 'İsim (Z-A)' },
  { value: 'size_desc', label: 'Boyut (Büyük)' },
  { value: 'size_asc', label: 'Boyut (Küçük)' },
]

const filterOptions: { value: FileFilter; label: string; icon: string }[] = [
  { value: 'all', label: 'Tümü', icon: 'grid-outline' },
  { value: 'image', label: 'Resimler', icon: 'image-outline' },
  { value: 'document', label: 'Dökümanlar', icon: 'document-text-outline' },
  { value: 'pdf', label: 'PDF', icon: 'document-outline' },
]

function getFileIcon(type: string): string {
  switch (type) {
    case 'image': return 'image'
    case 'pdf': return 'document'
    case 'document': return 'document-text'
    default: return 'document-attach'
  }
}

function getFileColor(type: string): string {
  switch (type) {
    case 'image': return colors.accent.pink
    case 'pdf': return colors.error
    case 'document': return colors.accent.blue
    default: return colors.textSecondary
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function getFileType(mimeType: string): FileItem['type'] {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType === 'application/pdf') return 'pdf'
  if (mimeType.includes('document') || mimeType.includes('text')) return 'document'
  return 'other'
}

export default function FilesScreen() {
  const { 
    files, 
    addFile, 
    deleteFile,
    fileSortOption, 
    fileFilter,
    setFileSortOption,
    setFileFilter,
    getFilteredFiles,
  } = useStore()
  
  const [sortModalVisible, setSortModalVisible] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [previewVisible, setPreviewVisible] = useState(false)

  const filteredFiles = getFilteredFiles()

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Alert.alert('İzin Gerekli', 'Galeri erişimi için izin vermeniz gerekiyor.')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    })

    if (!result.canceled) {
      result.assets.forEach((asset) => {
        const newFile: FileItem = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          type: 'image',
          uri: asset.uri,
          size: asset.fileSize || 0,
          mimeType: asset.mimeType || 'image/jpeg',
          folderId: null,
          userId: 'demo-user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        addFile(newFile)
      })
    }
  }

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) {
      Alert.alert('İzin Gerekli', 'Kamera erişimi için izin vermeniz gerekiyor.')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    })

    if (!result.canceled) {
      const asset = result.assets[0]
      const newFile: FileItem = {
        id: `file-${Date.now()}`,
        name: `photo_${Date.now()}.jpg`,
        type: 'image',
        uri: asset.uri,
        size: asset.fileSize || 0,
        mimeType: asset.mimeType || 'image/jpeg',
        folderId: null,
        userId: 'demo-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      addFile(newFile)
    }
  }

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      multiple: true,
    })

    if (!result.canceled) {
      result.assets.forEach((asset) => {
        const newFile: FileItem = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: asset.name,
          type: getFileType(asset.mimeType || ''),
          uri: asset.uri,
          size: asset.size || 0,
          mimeType: asset.mimeType || 'application/octet-stream',
          folderId: null,
          userId: 'demo-user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        addFile(newFile)
      })
    }
  }

  const showAddOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['İptal', 'Fotoğraf Çek', 'Galeriden Seç', 'Dosya Seç'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) takePhoto()
          else if (buttonIndex === 2) pickImage()
          else if (buttonIndex === 3) pickDocument()
        }
      )
    } else {
      Alert.alert(
        'Dosya Ekle',
        'Nasıl eklemek istersiniz?',
        [
          { text: 'Fotoğraf Çek', onPress: takePhoto },
          { text: 'Galeriden Seç', onPress: pickImage },
          { text: 'Dosya Seç', onPress: pickDocument },
          { text: 'İptal', style: 'cancel' },
        ]
      )
    }
  }

  const handleDeleteFile = (file: FileItem) => {
    Alert.alert(
      'Dosyayı Sil',
      `"${file.name}" dosyasını silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: () => deleteFile(file.id) },
      ]
    )
  }

  const renderFile = ({ item }: { item: FileItem }) => (
    <TouchableOpacity
      style={styles.fileCard}
      onPress={() => {
        if (item.type === 'image') {
          setSelectedFile(item)
          setPreviewVisible(true)
        }
      }}
      onLongPress={() => handleDeleteFile(item)}
      activeOpacity={0.7}
    >
      {item.type === 'image' ? (
        <Image source={{ uri: item.uri }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.fileIconContainer, { backgroundColor: getFileColor(item.type) + '15' }]}>
          <Ionicons name={getFileIcon(item.type) as any} size={28} color={getFileColor(item.type)} />
        </View>
      )}
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.fileMeta}>
          <Text style={styles.fileSize}>{formatFileSize(item.size)}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.fileDate}>
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: tr })}
          </Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.moreButton}
        onPress={() => handleDeleteFile(item)}
      >
        <Ionicons name="ellipsis-vertical" size={18} color={colors.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <View style={styles.filterTabs}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[styles.filterTab, fileFilter === option.value && styles.filterTabActive]}
              onPress={() => setFileFilter(option.value)}
            >
              <Ionicons 
                name={option.icon as any} 
                size={16} 
                color={fileFilter === option.value ? colors.primary : colors.textTertiary} 
              />
              <Text style={[styles.filterTabText, fileFilter === option.value && styles.filterTabTextActive]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setSortModalVisible(true)}
        >
          <Ionicons name="swap-vertical" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* File List */}
      {filteredFiles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="cloud-upload-outline" size={48} color={colors.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>Dosya yok</Text>
            <Text style={styles.emptyDesc}>
              Resim veya dosya ekleyerek{'\n'}çalışma materyallerini organize et
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={showAddOptions}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.createButtonText}>Dosya Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredFiles}
          renderItem={renderFile}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={showAddOptions}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Sort Modal */}
      <Modal
        visible={sortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setSortModalVisible(false)}
        >
          <Pressable style={styles.sortModalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.sortModalTitle}>Sıralama</Text>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.sortOption}
                onPress={() => {
                  setFileSortOption(option.value)
                  setSortModalVisible(false)
                }}
              >
                <Text style={[
                  styles.sortOptionText,
                  fileSortOption === option.value && styles.sortOptionTextActive
                ]}>
                  {option.label}
                </Text>
                {fileSortOption === option.value && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        visible={previewVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View style={styles.previewOverlay}>
          <TouchableOpacity 
            style={styles.previewClose}
            onPress={() => setPreviewVisible(false)}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          {selectedFile && (
            <Image 
              source={{ uri: selectedFile.uri }} 
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}
          {selectedFile && (
            <View style={styles.previewInfo}>
              <Text style={styles.previewName}>{selectedFile.name}</Text>
              <Text style={styles.previewMeta}>{formatFileSize(selectedFile.size)}</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  filterTabs: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    gap: spacing.xs,
  },
  filterTabActive: {
    backgroundColor: colors.primaryMuted,
  },
  filterTabText: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    fontWeight: fontWeight.medium,
  },
  filterTabTextActive: {
    color: colors.primary,
  },
  sortButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  fileIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  fileName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  fileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileSize: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  metaDot: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginHorizontal: spacing.xs,
  },
  fileDate: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  moreButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sortModalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  sortModalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  sortOptionText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  sortOptionTextActive: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewClose: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  previewImage: {
    width: '100%',
    height: '70%',
  },
  previewInfo: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  previewName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: '#fff',
  },
  previewMeta: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xs,
  },
})
