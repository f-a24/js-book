import * as tf from '@tensorflow/tfjs';

window.addEventListener('load', function () {
  // 単純なテンソルのクロップ
  const startingPoint = [0, 40, 0];
  const newSize = [265, 245, 3];
  const lemonadeImage = document.querySelector<HTMLImageElement>('#lemonade')!;
  const lemonadeCanvas =
    document.querySelector<HTMLCanvasElement>('#lemonadeCanvas')!;
  const lemonadeTensor = tf.browser.fromPixels(lemonadeImage);

  const cropped = tf.slice(lemonadeTensor, startingPoint, newSize);
  tf.browser.toPixels(cropped, lemonadeCanvas).then(() => {
    cropped.dispose();
  });
  lemonadeTensor.dispose();
});
