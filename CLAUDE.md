# MetroFlow モバイルアプリ開発ガイド

## プロジェクト概要

MetroFlowは、音楽家、作曲家、音楽教育者向けの高機能メトロノーム＆シーケンサーアプリケーションです。複雑なリズムパターンの作成、マルチトラック対応、豊富な音色選択機能を提供します。

### 主要機能
- **メトロノーム機能**: BPM 40-300、複数セクション管理、カウントイン機能
- **シーケンサー機能**: 最大10トラック同時再生、音符編集、パターン表示
- **音源・音色機能**: 10種類以上の基本音色、シンセサイザータイプ
- **プロジェクト管理**: 自動保存、インポート/エクスポート（JSON形式）

### 技術スタック
- **フレームワーク**: Expo SDK 50+
- **言語**: TypeScript
- **UI**: React Native
- **状態管理**: Zustand / React Context API
- **オーディオ**: expo-av
- **ストレージ**: AsyncStorage / expo-sqlite

## 開発環境セットアップ

### 前提条件
- Node.js 18以上
- npm または yarn
- iOS Simulator (Mac) または Android Emulator

### インストール
```bash
# 依存関係のインストール
npm install

# iOS向けの追加セットアップ（Macのみ）
cd ios && pod install && cd ..
```

## 開発コマンド

### 基本コマンド
```bash
# 開発サーバー起動
npm start

# iOS シミュレーター起動
npm run ios

# Android エミュレーター起動
npm run android

# Web版起動（開発用）
npm run web
```

### ビルド・テスト
```bash
# TypeScript型チェック
npm run typecheck

# ESLintチェック
npm run lint

# テスト実行
npm test

# ビルド（EAS Build使用）
eas build --platform ios
eas build --platform android
```

## プロジェクト構成

```
ios-metroflow/
├── app/                    # アプリケーションのメイン画面
│   ├── (tabs)/            # タブナビゲーション
│   │   ├── index.tsx      # メトロノームメイン画面
│   │   └── explore.tsx    # プロジェクト管理画面
│   └── _layout.tsx        # アプリレイアウト
├── components/            # 再利用可能なコンポーネント
│   ├── metronome/        # メトロノーム関連
│   ├── sequencer/        # シーケンサー関連
│   └── ui/              # 汎用UIコンポーネント
├── hooks/                # カスタムフック
├── services/             # ビジネスロジック
│   ├── audio/           # オーディオエンジン
│   ├── storage/         # データ永続化
│   └── project/         # プロジェクト管理
├── store/               # Zustand状態管理
├── types/               # TypeScript型定義
└── constants/           # 定数定義
```

## 開発プロセス

### Issue駆動開発
本プロジェクトはGitHub Issueを使用したタスク管理を行います。

#### Issue作成ガイドライン

**重要**: Issueは日本語で記載します。これにより、要件の理解と実装の一貫性を保ちます。

```markdown
## 概要
[機能の簡潔な説明を日本語で記載]

## 受け入れ条件
- [ ] 条件1（日本語で記載）
- [ ] 条件2（日本語で記載）
- [ ] 条件3（日本語で記載）

## 技術的詳細
[実装方法、使用ライブラリ、注意点などを日本語で記載]

## テスト項目
- [ ] テスト1（日本語で記載）
- [ ] テスト2（日本語で記載）
```

#### ラベル
- `feature`: 新機能
- `enhancement`: 機能改善
- `bug`: バグ修正
- `setup`: 環境構築
- `docs`: ドキュメント
- `test`: テスト

#### 開発フロー
1. **Issue選択**: 優先度の高いIssueから着手
2. **ブランチ作成**: `feature/issue-{番号}-{簡潔な説明}`
3. **実装**: 受け入れ条件を満たす実装
4. **テスト**: 動作確認とテスト実行
5. **順次コミット**: 
   - 機能単位で細かくコミット
   - タスク完了ごとに即座にコミット
   - WIP（Work In Progress）でも定期的にコミット
6. **PR作成**: Issueと紐付けたPull Request
7. **Issue更新**: 完了時に結果を記載してクローズ

#### コミット方針
- **細かい単位でコミット**: 大きな変更を一度にコミットせず、機能単位で分割
- **タスク完了時に即座にコミット**: 各タスクが完了したら、その都度コミットを実行
- **進捗の可視化**: 定期的なコミットにより、進捗状況を明確に記録
- **ロールバックの容易性**: 細かいコミットにより、問題発生時の切り戻しを容易に

```bash
# 例: BPMスライダー実装時のコミットフロー
git add components/BpmSlider.tsx
git commit -m "feat: BPMスライダーコンポーネントの作成 (#5)"

git add hooks/useBpm.ts
git commit -m "feat: BPM管理用カスタムフックの追加 (#5)"

git add store/metronomeStore.ts
git commit -m "feat: BPM状態管理をZustandストアに追加 (#5)"
```

### 現在のマイルストーン

#### Phase 1: Basic Metronome (Issues #1-#9)
- Setup project foundation
- Implement Zustand state management
- Setup expo-av audio engine
- Create basic UI components
- Implement BPM control
- Implement time signature settings
- Create play/stop controls
- Add visual feedback for beats
- Implement volume control

## 開発ガイドライン

### コーディング規約
- TypeScriptの厳格モード使用
- React Functional Components使用
- カスタムフックによるロジック分離
- エラーハンドリングの徹底

### Git コミット規約
- feat: 新機能追加 (例: `feat: Add BPM control slider`)
- fix: バグ修正 (例: `fix: Correct audio timing issue`)
- refactor: リファクタリング
- docs: ドキュメント更新
- test: テスト追加・修正
- chore: ビルド・設定変更

### ブランチ戦略
- `main`: 本番環境
- `develop`: 開発環境
- `feature/issue-{番号}`: 機能開発
- `fix/issue-{番号}`: バグ修正

### 状態管理方針
- **グローバル状態** (Zustand):
  - 現在のプロジェクト
  - アプリ設定
  - 再生状態
- **ローカル状態** (useState/useReducer):
  - UIの一時的な状態
  - フォーム入力値

### パフォーマンス最適化
- React.memo使用による不要な再レンダリング防止
- useMemo/useCallbackによる計算結果のメモ化
- FlatListによる大量データの効率的レンダリング
- expo-avのバッファサイズ最適化

## GitHub Issues

### 現在のIssue一覧
プロジェクトの進捗は[GitHub Issues](https://github.com/nori5satb/ios-MetoroFlow/issues)で管理しています。

### フェーズ1: Basic Metronome (2週間)

**注意**: 新規Issueは日本語で作成してください。既存の英語Issueは、更新時に日本語化します。

| Issue | タイトル | 優先度 | ステータス |
|-------|---------|--------|------------|
| #1 | プロジェクト基盤の構築 | High | Open |
| #2 | Zustand状態管理の実装 | High | Open |
| #3 | expo-avオーディオエンジンの設定 | High | Open |
| #4 | 基本UIコンポーネントの作成 | Medium | Open |
| #5 | BPMコントロールの実装 (40-300 BPM) | High | Open |
| #6 | 拍子設定機能の実装 | Medium | Open |
| #7 | 再生/停止コントロールの作成 | High | Open |
| #8 | ビートの視覚的フィードバック追加 | Medium | Open |
| #9 | 音量調整機能の実装 | Low | Open |

### Issue対応手順
```bash
# 1. Issueを選択してブランチ作成
git checkout -b feature/issue-1-project-setup

# 2. 実装とテスト（細かい単位で実施）
# 実装の進捗に応じて、以下を繰り返す：
npm run typecheck
npm run lint
npm test

# 3. タスク完了ごとに順次コミット
# 機能単位で細かくコミット（日本語コメントOK）
git add [変更したファイル]
git commit -m "feat: TypeScript設定の追加 (#1)"
git commit -m "feat: ディレクトリ構造の作成 (#1)"
git commit -m "feat: 基本的なpackage.jsonの設定 (#1)"

# 4. 定期的にプッシュ（進捗の共有）
git push origin feature/issue-1-project-setup

# 5. 全タスク完了後、PR作成
gh pr create --title "feat: プロジェクト基盤の構築" --body "Closes #1

## 実装内容
- TypeScript設定
- ディレクトリ構造
- 基本的な依存関係

## テスト結果
- ✅ TypeScriptビルド成功
- ✅ Lintチェック通過"

# 6. マージ後、Issueに結果を記載してクローズ
gh issue close 1 --comment "✅ 実装完了
- TypeScript設定完了
- ディレクトリ構造作成完了
- 基本的な依存関係インストール完了"
```

## トラブルシューティング

### よくある問題と解決方法

#### 音声が再生されない
```bash
# expo-avの再インストール
npm uninstall expo-av
npm install expo-av
npx expo install --fix
```

#### ビルドエラー
```bash
# キャッシュクリア
npm start -- --clear
rm -rf node_modules
npm install
```

#### iOS Simulatorで動作しない
```bash
# Xcodeのコマンドラインツール確認
xcode-select --install
# Podの再インストール
cd ios && pod deintegrate && pod install && cd ..
```

## リソース

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [expo-av API](https://docs.expo.dev/versions/latest/sdk/av/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 連絡先

プロジェクトに関する質問や提案は、Issuesまたは開発チームまでお問い合わせください。