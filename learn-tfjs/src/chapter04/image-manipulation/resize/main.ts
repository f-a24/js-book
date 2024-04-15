import * as tf from '@tensorflow/tfjs';

window.addEventListener('load', function () {
  // 単純なテンソルのリサイズ
  const newSize: [number, number] = [768, 560]; // 4倍拡大
  const littleGantImage =
    document.querySelector<HTMLImageElement>('#littleGant')!;
  const nnCanvas = document.querySelector<HTMLCanvasElement>('#nnCanvas')!;
  const blCanvas = document.querySelector<HTMLCanvasElement>('#blCanvas')!;
  const gantTensor = tf.browser.fromPixels(littleGantImage);

  const nnResizeTensor = tf.image.resizeNearestNeighbor(
    gantTensor,
    newSize,
    true,
  );
  tf.browser.toPixels(nnResizeTensor, nnCanvas).then(() => {
    nnResizeTensor.dispose();
  });

  const blResizeTensor = tf.image.resizeBilinear(gantTensor, newSize, true);
  const blResizeTensorInt = blResizeTensor.asType('int32');
  tf.browser.toPixels(blResizeTensorInt, blCanvas).then(() => {
    blResizeTensor.dispose();
    blResizeTensorInt.dispose();
  });

  // すべて完了
  gantTensor.dispose();
});
