
// 環境変数 PORT が設定されている場合はその値、なければ 3000 番ポートを使用
const PORT = process.env.PORT || 3000;

// サーバーの起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});