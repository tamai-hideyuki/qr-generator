### 全体マイルストーンとブランチ構成
##  QRコードジェネレーター：開発マイルストーン一覧

| No | マイルストーン                        | ブランチ名                      | 内容                                                                 |
|----|---------------------------------|----------------------------|----------------------------------------------------------------------|
| 1  |  プロジェクト構成準備                  | `feature/init-structure`   | `frontend/` と `backend/` ディレクトリ作成、基本README記述など                     |
| 2  |  フロント：UI作成                   | `feature/frontend-ui`      | 入力欄／生成ボタン／QR表示／DLボタンのReactコンポーネント構築                          |
| 3  | ️ バックエンド：FastAPIセットアップ       | `feature/backend-setup`    | FastAPI環境構築＋テストエンドポイント作成（`/ping`など）                             |
| 4  |  バックエンド：QRコード生成API実装        | `feature/qr-api`           | `/generate_qr` POST APIでPNGを生成し返却（Base64 or image/png）       |
| 5  |  API接続：React → FastAPI       | `feature/api-integration`  | ReactからQRコード生成APIを呼び出し、画像として表示                                   |
| 6  |  画像ダウンロード機能                  | `feature/download-support` | canvasではなく `img` ベースで `a download` に対応                         |
| 7  |  テスト・例外処理                    | `feature/test-and-errors`  | バリデーション（空URLなど）＋エラーハンドリング                                      |
| 8  |  UI微調整＋最終仕上げ                 | `feature/ui-polish`        | Tailwindで微調整、アクセシビリティ対応など                                      |


## 概要：
**任意のURLからQRコードを作成し、ダウンロード可能にします。**

## 技術スタック
| 領域    | 使用技術                          | 備考                               |
| ----- | ----------------------------- | -------------------------------- |
| フロント  | React（Vite or Next.js）        | URL入力 → APIにPOST → Blob受け取り表示＋DL |
| バックエンド | FastAPI + `qrcode` + `Pillow` | PNGをメモリ上で生成し、Base64またはバイナリ返却     |
| QR生成 | Pythonで確実・カスタマイズ可能            | 色・誤り訂正・サイズも対応                    |
| 通信  | REST API（POST）                | `/generate_qr` にURLを送信           |


## 使い方

**フロントエンド（React + Vite）**
```
# 依存インストール（一度だけ）
cd qr-generator/frontend
npm install

npm run build
# 出力先は qr-generator/frontend/dist/ 

# 本番プレビュー（ローカルで生成物を確認したい場合やService Workerの動作を確認したい時）
npm run preview
# デフォルトで http://localhost:4173（またはコンソールに表示される URL）で立ち上がります。
# 実際にサーバーにデプロイする場合は、この dist/ を nginx や任意の静的ホスティングに置いてください。

# 開発時にホットリロードで起動したい場合はビルドせずに以下を使ってください
npm run dev
# http://localhost:5173（デフォルト）で開発用サーバーが立ち上がります。
```
**バックエンド（FastAPI）**
```
# 仮想環境作成＆依存インストール（一度だけ）

cd qr-generator/backend

python3 -m venv .venv
source .venv/bin/activate 
# （Windows の場合は  .venv\Scripts\activate）

pip install --upgrade pip
pip install -r requirements.txt

# 開発用サーバー起動
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
# --reload をつけるとソース変更を監視して自動リロードが行われます。
# ブラウザで http://localhost:8000 にアクセスすると API が叩けます。

# 本番用サーバー起動（Gunicorn＋Uvicorn Workers などを使う例）
uvicorn app.main:app --host 0.0.0.0 --port 8000

# 単純に Uvicorn を立ち上げても問題ありませんが、負荷が高い場合は下記のように Gunicorn 経由で Worker 数を増やして起動するといいかも。
pip install gunicorn
gunicorn -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000 --workers 4
# --workers でワーカー数を指定してください（CPU コア数に応じて増減を）

```

## 初期構成案構造
```
.
├── backend
│   ├── app
│   ├── pytest.ini
│   ├── requirements.txt
│   ├── tests
│   └── uvicorn_config.py
├── docs
│   └── feature
├── frontend
│   ├── dist
│   ├── index.html
│   ├── jest.config.js
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   ├── src
│   ├── tsconfig.json
│   ├── types
│   └── vite.config.ts
└── README.md
```

<details>
<summary>作成中メモ</summary>

GitHub と連携しなくても、ローカルで   

git checkout main  

→ git merge --no-commit --no-ff <ブランチ名>   

→ コンフリクトを確認  

→ 問題なければ git commit -m "merge: <ブランチ名> を main ブランチにマージする"   

という流れでマージできる。

--no-commit をつけることでマージ結果をいったんステージング領域に止め、手動で内容を確認してからコミットできる。

--no-ff をつけることで必ずマージコミットを作成し、どのブランチをマージしたかが履歴に残る。

まさに「ぶっつづけ一気に push しなくても大丈夫」というのがローカル Git の強み

</details>
