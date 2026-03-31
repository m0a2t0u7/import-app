/**
 * FlashcardScreen.js
 * メイン画面。スワイプ・自動再生・TTS・進捗バー統合。
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, PanResponder, ScrollView,
} from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';

import { vocabData } from '../data/vocab';
import { useSpeech } from '../hooks/useSpeech';
import AnimationCanvas from '../components/AnimationCanvas';
import ProgressBar from '../components/ProgressBar';
import { colors } from '../constants/theme';

const REVEAL_DELAY = 4000;   // ms: 単語表示 → 意味表示
const NEXT_DELAY   = 4000;   // ms: 意味表示 → 次のカード
const TOTAL_DURATION = REVEAL_DELAY + NEXT_DELAY; // = 8000ms

export default function FlashcardScreen() {
  useKeepAwake();  // 自動再生中にスリープさせない

  const [idx, setIdx]           = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [progress, setProgress] = useState(0);
  const { speak }               = useSpeech();
  const data                    = vocabData[idx];

  // ── スワイプ（PanResponder） ───────────────────
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 12 && Math.abs(gs.dy) < 60,
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -50) goNext(true);
        else if (gs.dx > 50) goPrev(true);
      },
    })
  ).current;

  // ── カード移動 ───────────────────────────────
  const goNext = useCallback((manual = false) => {
    if (manual) setAutoPlay(false);
    setIdx((i) => (i + 1) % vocabData.length);
    setRevealed(false);
    setProgress(0);
  }, []);

  const goPrev = useCallback(() => {
    setAutoPlay(false);
    setIdx((i) => (i - 1 + vocabData.length) % vocabData.length);
    setRevealed(false);
    setProgress(0);
  }, []);

  // ── TTS: カード切り替え時に単語を読み上げ ───────
  useEffect(() => {
    speak(data.word);
  }, [idx]);

  // ── TTS: 意味・例文が表示されたら例文を読み上げ ─
  useEffect(() => {
    if (revealed) speak(data.exEn);
  }, [revealed]);

  // ── 自動再生ループ ───────────────────────────
  // autoPlay または idx が変化するたびに再評価。
  // autoPlay=true の間は 8s ごとに次カードへ進む。
  useEffect(() => {
    if (!autoPlay) {
      setProgress(0);
      return;
    }

    setRevealed(false);
    setProgress(0);
    const startTime = Date.now();

    // プログレスバー更新（100ms ごと）
    const intervalId = setInterval(() => {
      const p = Math.min((Date.now() - startTime) / TOTAL_DURATION, 1);
      setProgress(p);
    }, 100);

    // REVEAL_DELAY 後に意味・例文を表示
    const t1 = setTimeout(() => setRevealed(true), REVEAL_DELAY);

    // TOTAL_DURATION 後に次のカードへ
    const t2 = setTimeout(() => {
      clearInterval(intervalId);
      setIdx((i) => (i + 1) % vocabData.length);
    }, TOTAL_DURATION);

    return () => {
      clearInterval(intervalId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [autoPlay, idx]);

  // ── レンダリング ─────────────────────────────
  return (
    <SafeAreaView style={styles.container}>

      {/* ── アニメーションエリア ──── */}
      <View {...panResponder.panHandlers}>
        <AnimationCanvas animType={data.animation} />
        <ProgressBar progress={progress} />
      </View>

      {/* ── 自動再生ステータス ─────── */}
      {autoPlay && (
        <TouchableOpacity
          style={styles.autoStatus}
          onPress={() => setAutoPlay(false)}
        >
          <Text style={styles.autoStatusText}>▶ 自動再生中 — タップで停止</Text>
        </TouchableOpacity>
      )}

      {/* ── 単語エリア ────────────── */}
      <View style={styles.wordArea}>
        <Text style={styles.category}>{data.category.toUpperCase()}</Text>
        <Text style={styles.word}>{data.word}</Text>
        <Text style={[styles.meaning, { opacity: revealed ? 1 : 0 }]}>
          {data.meaning}
        </Text>
      </View>

      {/* ── 例文カード ────────────── */}
      <View style={[styles.exampleCard, { opacity: revealed ? 1 : 0 }]}>
        <Text style={styles.exEn}>{data.exEn.replace(/^★\s*/, '')}</Text>
        <Text style={styles.exJa}>{data.exJa.replace(/^→\s*/, '')}</Text>
      </View>

      {/* ── コントロール ─────────── */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.navBtn} onPress={goPrev}>
          <Text style={styles.navText}>‹</Text>
        </TouchableOpacity>

        {autoPlay ? (
          <TouchableOpacity
            style={[styles.mainBtn, styles.mainBtnStop]}
            onPress={() => setAutoPlay(false)}
          >
            <Text style={styles.mainBtnText}>■ 停止</Text>
          </TouchableOpacity>
        ) : revealed ? (
          <TouchableOpacity
            style={styles.mainBtn}
            onPress={() => setRevealed(false)}
          >
            <Text style={styles.mainBtnText}>隠す</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.mainBtn}
            onPress={() => setRevealed(true)}
          >
            <Text style={styles.mainBtnText}>意味・例文を表示</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.navBtn} onPress={() => goNext(true)}>
          <Text style={styles.navText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* ── 自動再生ボタン（停止中のみ） ─ */}
      {!autoPlay && (
        <TouchableOpacity
          style={styles.autoPlayBtn}
          onPress={() => setAutoPlay(true)}
        >
          <Text style={styles.autoPlayText}>▶ 自動再生スタート</Text>
        </TouchableOpacity>
      )}

      {/* ── カード番号 ──────────── */}
      <Text style={styles.counter}>
        {idx + 1} / {vocabData.length}
      </Text>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // 自動再生ステータスバー
  autoStatus: {
    backgroundColor: 'rgba(59,130,246,0.15)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59,130,246,0.3)',
  },
  autoStatusText: {
    color: colors.accent,
    fontSize: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // 単語エリア
  wordArea: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  category: {
    fontSize: 11,
    color: colors.textSub,
    letterSpacing: 2,
    marginBottom: 4,
  },
  word: {
    fontSize: 38,
    fontWeight: '900',
    color: colors.textMain,
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  meaning: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent,
    minHeight: 26,
    textAlign: 'center',
  },

  // 例文カード
  exampleCard: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    justifyContent: 'center',
  },
  exEn: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMain,
    lineHeight: 24,
    marginBottom: 10,
  },
  exJa: {
    fontSize: 14,
    color: colors.textSub,
    lineHeight: 22,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: colors.accent,
  },

  // コントロール
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    color: colors.textMain,
    fontSize: 26,
    fontWeight: '300',
    lineHeight: 30,
  },
  mainBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  mainBtnStop: {
    backgroundColor: '#444',
  },
  mainBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  // 自動再生スタートボタン
  autoPlayBtn: {
    marginHorizontal: 20,
    marginBottom: 8,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  autoPlayText: {
    color: colors.textSub,
    fontSize: 14,
  },

  // カード番号
  counter: {
    textAlign: 'center',
    color: colors.textSub,
    fontSize: 12,
    paddingBottom: 10,
  },
});
