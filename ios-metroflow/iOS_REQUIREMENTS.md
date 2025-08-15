# MetroFlow モバイルアプリ 要件定義書（Expo版）

## 1. 概要

### 1.1 プロダクト概要
MetroFlowは、音楽家、作曲家、音楽教育者向けの高機能メトロノーム＆シーケンサーアプリケーションです。複雑なリズムパターンの作成、マルチトラック対応、豊富な音色選択機能を提供し、楽曲練習や作曲活動を支援します。

### 1.2 対象プラットフォーム
- iOS 13.0以降
- Android 6.0（API Level 23）以降
- iPhone / iPad / Androidスマートフォン / Androidタブレット対応
- 画面向き：縦向き・横向き両対応

### 1.3 開発環境・フレームワーク
- **開発フレームワーク**: Expo SDK 50+
- **言語**: TypeScript
- **UIフレームワーク**: React Native
- **状態管理**: React Context API / Zustand
- **オーディオエンジン**: expo-av / react-native-sound
- **ローカルストレージ**: AsyncStorage / expo-sqlite
- **スタイリング**: StyleSheet / NativeWind (TailwindCSS for React Native)

## 2. 機能要件

### 2.1 メトロノーム機能

#### 2.1.1 基本メトロノーム
- **BPM設定**: 40〜300 BPMの範囲で設定可能
- **拍子設定**: 1/4〜12/8まで対応
- **ビジュアルフィードバック**: 現在の拍を視覚的に表示
- **音量調整**: 0〜100%の範囲で調整可能

#### 2.1.2 セクション管理
- **複数セクション作成**: 楽曲構成に応じた複数セクションの作成
- **セクション設定**:
  - セクション名
  - 開始小節・終了小節
  - セクション別BPM
  - テンポ固定機能（再生速度変更の影響を受けない）
- **セクション操作**:
  - 追加・編集・削除
  - 並び替え（ドラッグ&ドロップ）
  - ピン止め（無限ループ再生）

#### 2.1.3 再生制御
- **再生/停止**: 即座の再生開始・停止
- **カウントイン機能**: 
  - 有効/無効の切り替え
  - カウント数設定（1〜8拍）
- **再生速度調整**: 0.5x〜2.0xの範囲で変更可能
- **ループ再生**:
  - 全セクションループ
  - 現在セクションのみループ
  - ピン止めセクションの無限ループ
- **自動スクロール**: 再生中の自動画面追従
- **停止時動作**: 
  - 現在位置で停止
  - 先頭に戻る

### 2.2 シーケンサー機能

#### 2.2.1 マルチトラック
- **トラック数**: 最大10トラックまで同時再生
- **トラック設定**:
  - 音色選択（シンセサイザータイプ）
  - トラックカラー設定
  - ミュート/ソロ機能
- **トラック操作**:
  - 追加・削除
  - 並び替え
  - 複製

#### 2.2.2 ノート編集
- **音符入力**:
  - 全音符、二分音符、四分音符、八分音符、十六分音符
  - 休符の入力
  - タップによる音符配置
  - スワイプによる音符削除
- **音程設定**:
  - C4〜C6の範囲（拡張モード時：C4〜B6）
  - 半音階対応（クロマチックスケール）
  - 音程表示モード（アルファベット/カタカナ）
- **編集機能**:
  - ドラッグによる音程変更
  - ピンチによる音符長変更
  - 選択・コピー・ペースト
  - 元に戻す/やり直し

#### 2.2.3 パターン表示
- **ビートパターン表示**: 視覚的なリズムパターン表現
- **小節線表示**: レジャーライン（小節区切り線）
- **現在位置ハイライト**: 再生中の音符をリアルタイム表示
- **拡大/縮小表示**: ピンチ操作による表示スケール調整

### 2.3 音源・音色機能

#### 2.3.1 シンセサイザータイプ
- **基本音色** (10種類以上):
  - Click（クリック音）
  - Beep（ビープ音）
  - Woodblock（ウッドブロック）
  - Cowbell（カウベル）
  - Clave（クラーベ）
  - Rimshot（リムショット）
  - Digital（デジタル音）
  - Pulse（パルス音）
  - SynthBlock（シンセブロック）
  - Agogo（アゴゴ）

#### 2.3.2 音声合成
- **波形生成**: オシレーター方式による音声合成
- **エンベロープ**: ADSR（Attack, Decay, Sustain, Release）制御
- **周波数マッピング**: 音程に応じた正確な周波数生成

### 2.4 プロジェクト管理

#### 2.4.1 プロジェクト保存
- **自動保存**: 編集時の自動保存（デバウンス処理付き）
- **手動保存**: 明示的な保存操作
- **プロジェクト情報**:
  - プロジェクト名
  - 説明文
  - 作成日時・更新日時
  - BPM範囲
  - 総小節数
  - 演奏時間

#### 2.4.2 プロジェクト一覧
- **一覧表示**:
  - サムネイル表示
  - リスト表示
  - グリッド表示（iPad）
- **ソート機能**:
  - 更新日時順
  - 名前順
  - BPM順
  - 演奏時間順
- **検索・フィルター**:
  - プロジェクト名検索
  - BPM範囲フィルター
  - タグフィルター

#### 2.4.3 インポート/エクスポート
- **JSON形式**:
  - プロジェクトデータのエクスポート
  - 外部JSONファイルのインポート
- **共有機能**:
  - AirDrop経由での共有
  - メール添付
  - iCloud Drive保存

### 2.5 設定機能

#### 2.5.1 アプリ設定
- **音声設定**:
  - デフォルト音色選択
  - デフォルト音量
  - バッファサイズ調整
- **表示設定**:
  - テーマ選択（ライト/ダーク/自動）
  - 音程表示モード（アルファベット/カタカナ）
  - 拡張音域の有効/無効
  - クロマチックスケールの有効/無効
- **再生設定**:
  - デフォルトカウントイン設定
  - 自動スクロールのデフォルト設定
  - ループ設定のデフォルト値

#### 2.5.2 プロジェクト別設定
- **音色プリセット**: プロジェクトごとの音色設定保存
- **表示プリセット**: プロジェクトごとの表示設定保存

## 3. 非機能要件

### 3.1 パフォーマンス要件
- **起動時間**: 3秒以内
- **レスポンス時間**: タップから音声出力まで20ms以内
- **同時トラック数**: 最低10トラック同時再生
- **オーディオレイテンシー**: 10ms以下
- **フレームレート**: 60fps維持（アニメーション時）

### 3.2 ユーザビリティ要件
- **直感的操作**: 音楽知識がなくても基本操作が可能
- **ジェスチャー対応**:
  - タップ、スワイプ、ピンチ、ドラッグ
  - 長押しによるコンテキストメニュー
- **アクセシビリティ**:
  - VoiceOver対応
  - Dynamic Type対応
  - ハプティックフィードバック

### 3.3 信頼性要件
- **データ保護**: 
  - 自動バックアップ
  - クラッシュ時のデータ復旧
- **エラーハンドリング**:
  - 適切なエラーメッセージ表示
  - フォールバック処理
- **バックグラウンド動作**:
  - バックグラウンド再生対応
  - 画面ロック時の継続再生

### 3.4 互換性要件
- **デバイス対応**:
  - iOS: iPhone SE（第1世代）以降、iPad（第5世代）以降
  - Android: RAM 2GB以上、ストレージ 100MB以上の空き容量
- **OS バージョン**: 
  - iOS 13.0以降
  - Android 6.0（API Level 23）以降
- **画面サイズ対応**: 
  - 4インチ〜13インチ
  - Safe Area / Notch対応
  - 各種アスペクト比対応

### 3.5 セキュリティ要件
- **データ保護**: 
  - expo-secure-storeによる機密データの暗号化保存
  - AsyncStorageによる一般データ保存
- **プライバシー**: 個人情報の収集なし
- **権限管理**: 
  - マイク権限（将来的な録音機能用）
  - ストレージ権限（ファイルエクスポート用）

## 4. UI/UX要件

### 4.1 画面構成

#### 4.1.1 メイン画面
- **ヘッダー**: アプリロゴ、設定ボタン、プロジェクト選択
- **セクションリスト**: 現在のプロジェクトのセクション一覧
- **再生コントロール**: 再生/停止、BPM表示、拍子表示
- **ビジュアライザー**: 現在の拍を視覚的に表示

#### 4.1.2 シーケンサー編集画面
- **トラックレーン**: 各トラックの音符配置エリア
- **ツールバー**: 音符選択、編集ツール
- **ピアノロール**: 音程選択用キーボード（オプション）
- **プレビュー再生**: 編集中のパターン再生

#### 4.1.3 プロジェクト管理画面
- **プロジェクト一覧**: カード形式またはリスト形式
- **アクションバー**: 新規作成、インポート、ソート
- **詳細ビュー**: プロジェクト情報の表示・編集

### 4.2 操作フロー

#### 4.2.1 基本操作フロー
1. アプリ起動 → プロジェクト選択/新規作成
2. セクション追加/編集
3. トラック追加/音符配置
4. 再生確認
5. プロジェクト保存

#### 4.2.2 ジェスチャー操作（React Native Gesture Handler使用）
- **シングルタップ**: 選択、音符配置
- **ダブルタップ**: 編集モード切り替え
- **スワイプ**: 
  - 左右：セクション切り替え
  - 上下：数値変更（BPM、音程）
- **ピンチ**: 表示スケール変更
- **長押し**: コンテキストメニュー表示
- **パン**: スクロール操作

### 4.3 ビジュアルデザイン

#### 4.3.1 デザインシステム
- **カラーパレット**:
  - プライマリ：ブルー系
  - セカンダリ：グレー系
  - アクセント：各トラック識別色
- **タイポグラフィ**: 
  - iOS: System Font (SF Pro)
  - Android: Roboto
- **アイコン**: React Native Vector Icons / Expo Icons

#### 4.3.2 アニメーション（React Native Reanimated使用）
- **トランジション**: スムーズな画面遷移（0.3秒）
- **フィードバック**: タップ時のリップルエフェクト
- **再生アニメーション**: 拍に合わせたパルスアニメーション
- **スプリングアニメーション**: 自然な動きの実現

## 5. データ構造

### 5.1 データモデル（TypeScript インターフェース）

#### 5.1.1 Project Interface
```typescript
interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  bpmRange: string;
  totalMeasures: number;
  duration: number;
  sections: Section[];
}
```

#### 5.1.2 Section Interface
```typescript
interface Section {
  id: string;
  name: string;
  startMeasure: number;
  endMeasure: number;
  bpm: number;
  tempoFixed: boolean;
  pinned: boolean;
  orderIndex: number;
  tracks: Track[];
}
```

#### 5.1.3 Track Interface
```typescript
interface Track {
  id: string;
  synthType: SynthType;
  color: string;
  orderIndex: number;
  notes: Note[];
}
```

#### 5.1.4 Note Interface
```typescript
interface Note {
  id: string;
  duration: NoteType;
  pitchIndex: number;
  isRest: boolean;
  orderIndex: number;
}
```

### 5.2 ローカルストレージ戦略

#### 5.2.1 AsyncStorage（軽量データ）
- アプリ設定
- 最近使用したプロジェクトID
- UI状態（表示モードなど）
- ユーザープリファレンス

#### 5.2.2 expo-sqlite（構造化データ）
```sql
-- プロジェクトテーブル
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  data TEXT NOT NULL, -- JSON形式で保存
  created_at INTEGER,
  updated_at INTEGER
);

-- インデックス
CREATE INDEX idx_projects_updated ON projects(updated_at);
```

#### 5.2.3 expo-file-system（大容量データ）
- エクスポートファイル
- 一時ファイル
- キャッシュデータ

## 6. 技術仕様

### 6.1 オーディオエンジン

#### 6.1.1 expo-av実装
```typescript
import { Audio } from 'expo-av';

// オーディオモード設定
Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  playsInSilentModeIOS: true,
  staysActiveInBackground: true,
  shouldDuckAndroid: false,
});
```

#### 6.1.2 音声合成方式
- **サンプル音源**: 事前録音された音源ファイル使用
- **Web Audio API Bridge**: react-native-webviewを使用したWeb Audio API実装
- **ネイティブモジュール**: カスタムネイティブモジュールによる高性能実装（オプション）

### 6.2 データ永続化

#### 6.2.1 ストレージライブラリ
- **AsyncStorage**: 簡易設定データ
- **expo-sqlite**: 構造化データ（プロジェクト）
- **expo-file-system**: ファイルベースの保存
- **expo-secure-store**: セキュアな設定保存

#### 6.2.2 データ同期戦略
```typescript
// ローカルストレージマネージャー
class StorageManager {
  async saveProject(project: Project): Promise<void>
  async loadProject(id: string): Promise<Project>
  async deleteProject(id: string): Promise<void>
  async listProjects(): Promise<Project[]>
}
```

### 6.3 状態管理

#### 6.3.1 グローバル状態（Zustand）
```typescript
interface AppState {
  currentProject: Project | null;
  settings: Settings;
  playbackState: PlaybackState;
  // Actions
  setProject: (project: Project) => void;
  updateSettings: (settings: Partial<Settings>) => void;
}
```

#### 6.3.2 ローカル状態（React Hooks）
- useState: コンポーネントローカルな状態
- useReducer: 複雑な状態管理
- useContext: テーマ・言語設定の共有

## 7. テスト要件

### 7.1 単体テスト（Jest）
- ストレージ操作のテスト
- オーディオ制御ロジックのテスト
- ビジネスロジックのテスト
- カバレッジ目標: 80%以上

### 7.2 統合テスト（React Native Testing Library）
- 画面遷移テスト
- データフローテスト
- 状態管理のテスト

### 7.3 E2Eテスト（Detox）
- 主要操作フローのテスト
- ジェスチャー操作のテスト
- iOS/Android両プラットフォームでのテスト

### 7.4 パフォーマンステスト
- React DevToolsによるレンダリング最適化
- Flipperによるメモリ・CPU監視
- バンドルサイズの最適化

## 8. リリース計画

### 8.1 フェーズ1（MVP）- 2ヶ月
- 基本メトロノーム機能
- シングルトラックシーケンサー
- プロジェクト保存/読み込み
- iOS/Android同時リリース

### 8.2 フェーズ2 - 1ヶ月
- マルチトラック対応
- 音色拡張
- インポート/エクスポート機能
- タブレット最適化

### 8.3 フェーズ3 - 1ヶ月
- パフォーマンス最適化
- 追加音源パック
- 高度な編集機能

## 9. 開発環境セットアップ

### 9.1 必要な開発ツール
```bash
# Node.js 18+ インストール
# Expo CLIインストール
npm install -g expo-cli

# EAS CLIインストール（ビルド用）
npm install -g eas-cli

# プロジェクト作成
expo init MetroFlow --template expo-template-blank-typescript
```

### 9.2 主要な依存パッケージ
```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "expo-av": "~13.10.0",
    "expo-file-system": "~16.0.0",
    "expo-sqlite": "~13.0.0",
    "@react-native-async-storage/async-storage": "~1.21.0",
    "react-native-gesture-handler": "~2.14.0",
    "react-native-reanimated": "~3.6.0",
    "zustand": "^4.4.0",
    "react-native-vector-icons": "^10.0.0"
  }
}
```

## 10. 制約事項

### 10.1 技術的制約
- オフライン専用（ネットワーク機能なし）
- ローカルストレージのみ使用
- 外部サービス連携なし
- Expo Goの制限事項を考慮

### 10.2 リソース制約
- アプリサイズ: 50MB以下（Expo最適化後）
- メモリ使用量: 200MB以下（通常使用時）
- 最小対応デバイス: RAM 2GB以上

## 11. 用語定義

- **セクション**: 楽曲の構成単位（イントロ、Aメロなど）
- **トラック**: 並行して再生される音のレーン
- **シンセサイザータイプ**: 音色の種類
- **ピッチインデックス**: 音程を示す数値（0=C4, 12=C5など）
- **カウントイン**: 再生開始前のカウント
- **ピン止め**: セクションの無限ループ再生
- **レジャーライン**: 小節の区切り線

## 12. Expo特有の考慮事項

### 12.1 Expo管理ワークフロー vs ベアワークフロー
- **管理ワークフロー優先**: 開発効率とメンテナンス性を重視
- **必要に応じてEjectオプション**: カスタムネイティブモジュールが必要な場合

### 12.2 EAS Build使用
- **クラウドビルド**: ローカル環境に依存しないビルド
- **OTA更新**: JavaScript層の更新をストア審査なしで配信
- **プレビュービルド**: テスト版の配布

### 12.3 パフォーマンス最適化
- **Hermes Engine**: JavaScriptエンジンの最適化
- **画像最適化**: expo-image使用による効率的な画像処理
- **遅延ロード**: 画面コンポーネントの動的インポート

### 12.4 プラットフォーム別対応
```typescript
import { Platform } from 'react-native';

// プラットフォーム別の処理
const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  }
});
```