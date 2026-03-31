import { useCallback } from 'react';
import * as Speech from 'expo-speech';

// 記号を取り除いてから読み上げるユーティリティ
export function useSpeech() {
  const speak = useCallback((text, lang = 'en-US') => {
    Speech.stop();
    const clean = text.replace(/^[\s★→•\-]+/, '').trim();
    Speech.speak(clean, {
      language: lang,
      rate: 0.9,
    });
  }, []);

  const stop = useCallback(() => {
    Speech.stop();
  }, []);

  return { speak, stop };
}
