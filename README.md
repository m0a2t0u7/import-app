# import - うごく単語帳

## セットアップ手順

```bash
npx create-expo-app import-app --template blank
cd import-app
npx expo install expo-speech expo-keep-awake react-native-gesture-handler
mkdir -p constants data hooks components screens
npx expo start
```

## ファイル構成

```
import-app/
├── App.js
├── constants/theme.js         ← カラー定数
├── data/vocab.js              ← 単語データ（ここを編集）
├── hooks/useSpeech.js         ← TTS hook
├── components/
│   ├── AnimationCanvas.js     ← 全28種アニメーション
│   └── ProgressBar.js
└── screens/FlashcardScreen.js ← メイン画面
```

## 単語データのカスタマイズ

`data/vocab.js` の配列を編集して単語を追加・変更できます。

```js
{ word: "jump over", meaning: "〜を飛び越える", category: "Phrasal Verb",
  animation: "anim-jump-over", exEn: "He jumps over the box.", exJa: "彼は箱を飛び越える。" }
```
