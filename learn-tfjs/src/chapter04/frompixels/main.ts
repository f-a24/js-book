import * as tf from '@tensorflow/tfjs';

tf.tidy(() => {
  // DOMから読み取るだけ
  const gantImage = document.querySelector<HTMLImageElement>('#gant')!;
  const gantTensor = tf.browser.fromPixels(gantImage);
  console.log(`Successful conversion from DOM to a ${gantTensor.shape} tensor`);

  // 画像オブジェクトを読み込み
  const cake = new Image();
  cake.crossOrigin = 'anonymous';
  cake.src =
    'https://raw.githubusercontent.com/GantMan/learn-tfjs/master/chapter4/simple/simple-frompixels/cake.jpg';
  cake.onload = () => {
    const cakeTensor = tf.browser.fromPixels(cake);
    console.log(
      `Successful conversion from Image() to a ${cakeTensor.shape} tensor`,
    );
  };
});
