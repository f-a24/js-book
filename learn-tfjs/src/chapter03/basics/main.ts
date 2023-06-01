import * as tf from '@tensorflow/tfjs';

// テンソルなしの状態から開始
console.log('start', tf.memory().numTensors);

let keeper: tf.Tensor<tf.Rank>;
let chaser: tf.Tensor<tf.Rank>;
let seeker: tf.Tensor<tf.Rank>;
let beater: tf.Tensor<tf.Rank>;

// tidy内でテンソルを作成
tf.tidy(() => {
  keeper = tf.tensor([1, 2, 3]);
  chaser = tf.tensor([1, 2, 3]);
  seeker = tf.tensor([1, 2, 3]);
  beater = tf.tensor([1, 2, 3]);
  // メモリ上に4つのテンソルがある
  console.log('inside tidy', tf.memory().numTensors);

  // テンソルを保護
  tf.keep(keeper);
  // returnされたテンソルは破棄されない
  return chaser;
});

// 2まで減る
console.log('after tidy', tf.memory().numTensors);

keeper!.dispose();
chaser!.dispose();

// ゼロに戻る
console.log('end', tf.memory().numTensors);

// 再度テンソルを作成する
const snap = tf.tensor([1, 2, 3]);
const crackle = tf.tensor([3.141592654]);
const pop = tf.tensor([
  [1, 2, 3],
  [4, 5, 6],
]);

// 構造を確認できるだけで値は得られない
console.log(snap);
// テンソルの構造ではなくデータが表示される
crackle.print();

// JavaScriptに戻す
console.log('Welcome Back Array!', pop.arraySync());
console.log('Welcome Back Typed!', pop.dataSync());

// 残っているテンソルを削除
tf.dispose([snap, crackle, pop]);
