import '@tensorflow/tfjs';
import * as toxicity from '@tensorflow-models/toxicity';

// ポジティブな予測の信頼度（confidence）の最小値
// 値を渡さなければデフォルト値は0.85になる
const threshold = 0.5;

// モデルの読み込み
const model = await toxicity.load(threshold, []);
const sentences = ['You are poopy head!', 'I like turtles', 'Shut up!'];
// モデルに入力の分類を依頼
const predictions = await model.classify(sentences);

// 整形された結果
console.log(JSON.stringify(predictions, null, 2));
