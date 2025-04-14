// app.js
const express = require('express');
const app = express();

// 環境変数 PORT が設定されている場合はその値、なければ 3000 番ポートを使用
const PORT = process.env.PORT || 3000;

// シンプルなルートエンドポイントを定義
app.get('/', (req, res) => {
  res.send('Hello World! This is my Node.js application.');
});

// サーバーの起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});