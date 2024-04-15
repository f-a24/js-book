import * as tf from '@tensorflow/tfjs';

window.addEventListener('load', function () {
  // 単純なテンソルの反転
  const lemonadeImage = document.querySelector<HTMLImageElement>('#lemonade')!;
  const lemonadeCanvas =
    document.querySelector<HTMLCanvasElement>('#lemonadeCanvas')!;
  const lemonadeTensor = tf.browser.fromPixels(lemonadeImage);
  const flippedLemonadeTensor = tf.reverse(lemonadeTensor, 1);
  tf.browser.toPixels(flippedLemonadeTensor, lemonadeCanvas).then(() => {
    lemonadeTensor.dispose();
    flippedLemonadeTensor.dispose();
  });

  // バッチ化されたテンソルな反転
  const cakeImage = document.querySelector<HTMLImageElement>('#cake')!;
  const cakeCanvas = document.querySelector<HTMLCanvasElement>('#cakeCanvas')!;
  const flipCake = tf.tidy<tf.Tensor<tf.Rank.R3>>(() => {
    const cakeTensor = tf.expandDims<tf.Tensor<tf.Rank.R4>>(
      tf.browser.fromPixels(cakeImage).asType('float32'),
    );
    return tf
      .squeeze<tf.Tensor<tf.Rank.R3>>(tf.image.flipLeftRight(cakeTensor))
      .asType('int32');
  });
  tf.browser.toPixels(flipCake, cakeCanvas).then(() => {
    flipCake.dispose();
  });
});
