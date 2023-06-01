import * as tf from '@tensorflow/tfjs';

// Tidyで処理の後はテンソルをクリーンアップする
tf.tidy(() => {
  const users = ['Gant', 'Todd', 'Jed', 'Justin'];
  const bands = [
    'Nirvana',
    'Nine Inch Nails',
    'Backstreet Boys',
    'N Sync',
    'Night Club',
    'Apashe',
    'STP',
  ];
  const features = [
    'Grunge',
    'Rock',
    'Industrial',
    'Boy Band',
    'Dance',
    'Techno',
  ];
  // ユーザーの投票
  const user_votes = tf.tensor([
    [10, 9, 1, 1, 8, 7, 8],
    [6, 8, 2, 2, 0, 10, 0],
    [0, 2, 10, 9, 3, 7, 0],
    [7, 4, 2, 3, 6, 5, 5],
  ]);
  // 音楽ジャンル
  const band_feats = tf.tensor([
    [1, 1, 0, 0, 0, 0],
    [1, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 1],
    [0, 0, 1, 0, 0, 1],
    [1, 1, 0, 0, 0, 0],
  ]);

  // ユーザーの好きなジャンル
  const user_feats = tf.matMul(user_votes, band_feats);
  // 結果を表示
  user_feats.print();

  // 結果をわかりやすくする
  const top_user_features = tf.topk(user_feats, features.length);
  // JavaScriptに戻す
  const top_genres = top_user_features.indices.arraySync() as number[][];

  // 結果を表示
  users.map((u, i) => {
    const rankedCategories = top_genres[i].map(v => features[v]);
    console.log(u, rankedCategories);
  });
});
