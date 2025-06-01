#!/usr/bin/env bash
set -euo pipefail

#── 色定義（$'...' を使って ANSI シーケンスを展開） ────────────
RED=$'\033[31m'
GREEN=$'\033[32m'
BLUE=$'\033[34m'
RESET=$'\033[0m'

#── ログに色付きプレフィックスを付ける関数 ─────────────────────
colorize() {
  local prefix="$1"
  local color="$2"
  # sed -u でバッファリングを抑制しつつ、行頭に色付きプレフィックスを付与
  sed -u "s/^/${color}[${prefix}]${RESET} /"
}

#── フロントエンド（青色で [FRONT] プレフィックス）────────────
(
  cd frontend

  echo -e "${BLUE}[FRONT]${RESET} ビルド開始..."
  npm run build

  echo -e "${BLUE}[FRONT]${RESET} プレビュー起動..."
  # stdout と stderr をまとめて sed に渡し、色付きプレフィックスを付与
  npm run preview 2>&1 | colorize "FRONT" "${BLUE}"
) &

#── バックエンド（緑色で [BACK] プレフィックス）────────────────
(
  cd backend

  echo -e "${GREEN}[BACK]${RESET} 仮想環境をアクティベート..."
  source .venv/bin/activate

  echo -e "${GREEN}[BACK]${RESET} Uvicorn 起動 ..."
  # Uvicorn のログを sed で色付け
  uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload 2>&1 | colorize "BACK" "${GREEN}"
) &

#── 両プロセスが終了するまで待機 ──────────────────────────────
wait

