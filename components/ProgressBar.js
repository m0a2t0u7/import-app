import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

// progress: 0.0 〜 1.0
export default function ProgressBar({ progress }) {
  const width = `${Math.min(Math.max(progress, 0), 1) * 100}%`;
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
});
