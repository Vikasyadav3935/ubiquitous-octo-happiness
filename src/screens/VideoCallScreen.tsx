import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';

const { width, height } = Dimensions.get('window');

interface VideoCallScreenProps {
  navigation: any;
  route: any;
}

export default function VideoCallScreen({ navigation, route }: VideoCallScreenProps) {
  const { user } = route.params;
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');

  useEffect(() => {
    // Simulate call connection
    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 3000);

    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    let durationTimer: NodeJS.Timeout;
    
    if (callStatus === 'connected') {
      durationTimer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(durationTimer);
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    Alert.alert(
      'Call Ended',
      `Call duration: ${formatDuration(callDuration)}`,
      [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]
    );
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const handleMinimize = () => {
    Alert.alert('Minimize', 'Call would minimize to picture-in-picture mode');
  };

  const handleAddParticipant = () => {
    Alert.alert('Add Participant', 'Group call feature would be available in premium');
  };

  const handleSwitchCamera = () => {
    Alert.alert('Camera Switched', 'Switched to front/back camera');
  };

  const CallStatusIndicator = () => (
    <View style={styles.statusContainer}>
      <View style={[
        styles.statusDot,
        { backgroundColor: callStatus === 'connected' ? colors.success : colors.warning }
      ]} />
      <Text style={styles.statusText}>
        {callStatus === 'connecting' 
          ? 'Connecting...' 
          : callStatus === 'connected' 
            ? formatDuration(callDuration)
            : 'Call Ended'
        }
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      
      <View style={styles.videoContainer}>
        {/* Remote Video (Full Screen) */}
        <View style={styles.remoteVideo}>
          <View style={styles.videoPlaceholder}>
            {isVideoOff ? (
              <View style={styles.avatarContainer}>
                <View style={styles.largeAvatar}>
                  <Text style={styles.largeAvatarText}>
                    {user.name?.charAt(0) || 'U'}
                  </Text>
                </View>
                <Text style={styles.participantName}>{user.name || 'User'}</Text>
              </View>
            ) : (
              <View style={styles.videoStream}>
                <Ionicons name="videocam" size={60} color="rgba(255, 255, 255, 0.3)" />
                <Text style={styles.videoText}>Video Stream</Text>
              </View>
            )}
          </View>
          
          {/* Local Video (Picture in Picture) */}
          <TouchableOpacity style={styles.localVideo} onPress={handleSwitchCamera}>
            <View style={styles.localVideoContent}>
              {isVideoOff ? (
                <View style={styles.localVideoOff}>
                  <Ionicons name="videocam-off" size={20} color={colors.text.white} />
                </View>
              ) : (
                <View style={styles.localVideoStream}>
                  <Ionicons name="person" size={20} color="rgba(255, 255, 255, 0.7)" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.topButton} onPress={handleMinimize}>
            <Ionicons name="contract-outline" size={24} color={colors.text.white} />
          </TouchableOpacity>
          
          <CallStatusIndicator />
          
          <TouchableOpacity style={styles.topButton} onPress={handleAddParticipant}>
            <Ionicons name="person-add-outline" size={24} color={colors.text.white} />
          </TouchableOpacity>
        </View>

        {/* User Info (when connecting) */}
        {callStatus === 'connecting' && (
          <View style={styles.connectingInfo}>
            <View style={styles.connectingAvatar}>
              <Text style={styles.connectingAvatarText}>
                {user.name?.charAt(0) || 'U'}
              </Text>
            </View>
            <Text style={styles.connectingName}>{user.name || 'User'}</Text>
            <Text style={styles.connectingStatus}>Calling...</Text>
            
            <View style={styles.connectingAnimation}>
              <View style={[styles.pulseRing, styles.pulseRing1]} />
              <View style={[styles.pulseRing, styles.pulseRing2]} />
              <View style={[styles.pulseRing, styles.pulseRing3]} />
            </View>
          </View>
        )}

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity 
            style={[styles.controlButton, isMuted && styles.controlButtonActive]}
            onPress={handleToggleMute}
          >
            <Ionicons 
              name={isMuted ? "mic-off" : "mic"} 
              size={28} 
              color={isMuted ? colors.error : colors.text.white} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, isVideoOff && styles.controlButtonActive]}
            onPress={handleToggleVideo}
          >
            <Ionicons 
              name={isVideoOff ? "videocam-off" : "videocam"} 
              size={28} 
              color={isVideoOff ? colors.error : colors.text.white} 
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
            <Ionicons name="call" size={32} color={colors.text.white} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, isSpeakerOn && styles.controlButtonActive]}
            onPress={handleToggleSpeaker}
          >
            <Ionicons 
              name={isSpeakerOn ? "volume-high" : "volume-low"} 
              size={28} 
              color={isSpeakerOn ? colors.accent : colors.text.white} 
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={handleSwitchCamera}>
            <Ionicons name="camera-reverse-outline" size={28} color={colors.text.white} />
          </TouchableOpacity>
        </View>

        {/* Call Quality Indicator */}
        {callStatus === 'connected' && (
          <View style={styles.qualityIndicator}>
            <View style={styles.qualityBars}>
              <View style={[styles.qualityBar, styles.qualityBarActive]} />
              <View style={[styles.qualityBar, styles.qualityBarActive]} />
              <View style={[styles.qualityBar, styles.qualityBarActive]} />
              <View style={styles.qualityBar} />
            </View>
            <Text style={styles.qualityText}>HD</Text>
          </View>
        )}

        {/* Mute Indicator */}
        {isMuted && (
          <View style={styles.muteIndicator}>
            <Ionicons name="mic-off" size={16} color={colors.error} />
            <Text style={styles.muteText}>Muted</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    position: 'relative',
  },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  largeAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  largeAvatarText: {
    fontSize: typography.fontSize['5xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.white,
  },
  participantName: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.white,
  },
  videoStream: {
    alignItems: 'center',
    opacity: 0.5,
  },
  videoText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.white,
    marginTop: spacing.md,
  },
  localVideo: {
    position: 'absolute',
    top: spacing.xl + 20,
    right: spacing.base,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
  },
  localVideoContent: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  localVideoOff: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.text.secondary,
  },
  localVideoStream: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topControls: {
    position: 'absolute',
    top: spacing.base,
    left: spacing.base,
    right: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.white,
  },
  connectingInfo: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  connectingAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  connectingAvatarText: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.white,
  },
  connectingName: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.white,
    marginBottom: spacing.sm,
  },
  connectingStatus: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  connectingAnimation: {
    position: 'absolute',
    top: -10,
    left: '50%',
    marginLeft: -60,
    width: 120,
    height: 120,
  },
  pulseRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 60,
    width: 120,
    height: 120,
  },
  pulseRing1: {
    // Animation would be applied here
  },
  pulseRing2: {
    // Animation would be applied here with delay
  },
  pulseRing3: {
    // Animation would be applied here with delay
  },
  bottomControls: {
    position: 'absolute',
    bottom: spacing.xl + 20,
    left: spacing.xl,
    right: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255, 68, 88, 0.8)',
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '135deg' }],
  },
  qualityIndicator: {
    position: 'absolute',
    top: spacing.xl * 2 + 40,
    left: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  qualityBars: {
    flexDirection: 'row',
    marginRight: spacing.xs,
    gap: 2,
  },
  qualityBar: {
    width: 3,
    height: 12,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  qualityBarActive: {
    backgroundColor: colors.success,
  },
  qualityText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.white,
  },
  muteIndicator: {
    position: 'absolute',
    top: spacing.xl * 3 + 60,
    left: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(225, 112, 85, 0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  muteText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.white,
    marginLeft: spacing.xs,
  },
});