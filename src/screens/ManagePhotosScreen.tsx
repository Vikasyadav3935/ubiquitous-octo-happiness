import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, buttonHeight } from '../constants/spacing';

const { width } = Dimensions.get('window');
const photoSize = (width - spacing.xl * 2 - spacing.base * 2) / 3;

interface Photo {
  id: string;
  uri?: string;
  isMain: boolean;
}

interface ManagePhotosScreenProps {
  navigation: any;
}

export default function ManagePhotosScreen({ navigation }: ManagePhotosScreenProps) {
  const [photos, setPhotos] = useState<Photo[]>([
    { id: '1', isMain: true },
    { id: '2', isMain: false },
    { id: '3', isMain: false },
    { id: '4', isMain: false },
    { id: '5', isMain: false },
    { id: '6', isMain: false },
  ]);

  const handleAddPhoto = (photoId: string) => {
    Alert.alert(
      'Add Photo',
      'Choose photo source',
      [
        { text: 'Camera', onPress: () => addPhotoFromCamera(photoId) },
        { text: 'Gallery', onPress: () => addPhotoFromGallery(photoId) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const addPhotoFromCamera = (photoId: string) => {
    // Simulate camera photo
    Alert.alert('Success', 'Photo added from camera');
  };

  const addPhotoFromGallery = (photoId: string) => {
    // Simulate gallery photo
    Alert.alert('Success', 'Photo added from gallery');
  };

  const handleRemovePhoto = (photoId: string) => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removePhoto(photoId) }
      ]
    );
  };

  const removePhoto = (photoId: string) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId 
        ? { ...photo, uri: undefined }
        : photo
    ));
  };

  const handleSetMainPhoto = (photoId: string) => {
    setPhotos(photos.map(photo => ({
      ...photo,
      isMain: photo.id === photoId
    })));
    Alert.alert('Success', 'Main photo updated');
  };

  const PhotoSlot = ({ photo }: { photo: Photo }) => (
    <TouchableOpacity
      style={styles.photoSlot}
      onPress={() => photo.uri ? handleRemovePhoto(photo.id) : handleAddPhoto(photo.id)}
      onLongPress={() => photo.uri ? handleSetMainPhoto(photo.id) : undefined}
    >
      {photo.uri ? (
        <View style={styles.photoContainer}>
          <View style={styles.photoPlaceholder}>
            <Ionicons name="image" size={30} color={colors.text.light} />
          </View>
          {photo.isMain && (
            <View style={styles.mainBadge}>
              <Text style={styles.mainBadgeText}>MAIN</Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemovePhoto(photo.id)}
          >
            <Ionicons name="close" size={16} color={colors.text.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptySlot}>
          <Ionicons name="add" size={30} color={colors.text.light} />
          <Text style={styles.addPhotoText}>Add Photo</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const filledPhotos = photos.filter(photo => photo.uri).length;
  const remainingPhotos = 6 - filledPhotos;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Manage Photos</Text>
        
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filledPhotos}</Text>
            <Text style={styles.statLabel}>Photos Added</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{remainingPhotos}</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color={colors.primary} />
            <Text style={styles.infoTitle}>Photo Tips</Text>
          </View>
          <Text style={styles.infoText}>
            • Add at least 2 photos to increase your matches by 3x{'\n'}
            • Show your face clearly in your main photo{'\n'}
            • Include photos that show your interests{'\n'}
            • Long press any photo to set it as main
          </Text>
        </View>

        <View style={styles.photosSection}>
          <Text style={styles.sectionTitle}>Your Photos ({filledPhotos}/6)</Text>
          
          <View style={styles.photosGrid}>
            {photos.map((photo) => (
              <PhotoSlot key={photo.id} photo={photo} />
            ))}
          </View>
        </View>

        <View style={styles.guidelinesSection}>
          <Text style={styles.sectionTitle}>Photo Guidelines</Text>
          
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.guidelineText}>Clear face shots work best</Text>
          </View>
          
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.guidelineText}>Show your genuine smile</Text>
          </View>
          
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.guidelineText}>Include full body shots</Text>
          </View>
          
          <View style={styles.guidelineItem}>
            <Ionicons name="close-circle" size={20} color={colors.error} />
            <Text style={styles.guidelineText}>Avoid group photos as main</Text>
          </View>
          
          <View style={styles.guidelineItem}>
            <Ionicons name="close-circle" size={20} color={colors.error} />
            <Text style={styles.guidelineText}>No blurry or dark photos</Text>
          </View>
          
          <View style={styles.guidelineItem}>
            <Ionicons name="close-circle" size={20} color={colors.error} />
            <Text style={styles.guidelineText}>Avoid sunglasses in all photos</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.verificationCard}>
          <View style={styles.verificationContent}>
            <View style={styles.verificationIcon}>
              <Ionicons name="shield-checkmark" size={24} color={colors.accent} />
            </View>
            <View style={styles.verificationText}>
              <Text style={styles.verificationTitle}>Get Verified</Text>
              <Text style={styles.verificationSubtitle}>
                Stand out with a blue checkmark badge
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.light} />
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  helpButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginTop: spacing.base,
    borderRadius: 16,
    paddingVertical: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  statNumber: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
  },
  infoCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginTop: spacing.base,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  infoTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.sm * 1.2,
  },
  photosSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base,
  },
  photoSlot: {
    width: photoSize,
    height: photoSize,
    borderRadius: 16,
    overflow: 'hidden',
  },
  photoContainer: {
    flex: 1,
    position: 'relative',
  },
  photoPlaceholder: {
    flex: 1,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mainBadgeText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.white,
  },
  removeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlot: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  addPhotoText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.light,
    marginTop: spacing.xs,
  },
  guidelinesSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  guidelineText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.primary,
    marginLeft: spacing.base,
    flex: 1,
  },
  verificationCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  verificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  verificationText: {
    flex: 1,
  },
  verificationTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  verificationSubtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  bottomSpace: {
    height: spacing.xl,
  },
});