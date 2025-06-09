// train_priority_model.js
import * as tf from '@tensorflow/tfjs-node';  // ✅ use tfjs-node for Node.js environment

// 1) GENERATE SYNTHETIC DATA
const N = 5000;
const xs = [];
const ys = [];
for (let i = 0; i < N; i++) {
  const days = Math.random() * 30;           // 0–30 days
  const temp = 30 + Math.random() * 40;      // 30–70°F
  const cond = 1 + Math.random() * 4;        // score 1–5

  // “Ground truth” logistic formula
  let score = 1 / (1 + Math.exp(
       0.1 * days
    - 0.05 * (temp - 50)
    + 0.2  * (cond - 3)
  ));
  score = Math.min(1, Math.max(0, score + (Math.random() - 0.5) * 0.1));

  xs.push([ days / 30, (temp - 30) / 40, (cond - 1) / 4 ]);
  ys.push(score);
}

// Split 90/10 for training/validation
const split = Math.floor(N * 0.9);
const xTrain = tf.tensor2d(xs.slice(0, split));
const yTrain = tf.tensor2d(ys.slice(0, split), [split, 1]);
const xVal   = tf.tensor2d(xs.slice(split));
const yVal   = tf.tensor2d(ys.slice(split), [N - split, 1]);

// 2) BUILD MODEL
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [3], units: 16, activation: 'relu' }));
model.add(tf.layers.dense({ units: 8,  activation: 'relu' }));
model.add(tf.layers.dense({ units: 1,  activation: 'sigmoid' }));

model.compile({
  optimizer: 'adam',
  loss: 'meanSquaredError',
  metrics: ['mse']
});

// 3) TRAIN & EVALUATE
(async () => {
  await model.fit(xTrain, yTrain, {
    epochs: 30,
    batchSize: 64,
    validationData: [xVal, yVal]
  });

  const evalResult = model.evaluate(xVal, yVal);
  evalResult[0].print();
  console.log('Validation MSE above');

  // 4) SAVE FOR INFERENCE (Node.js format)
  await model.save('file://./models/priority_model');  // ✅ saves to /app/models inside Docker
  console.log('✅ Model trained & saved to ./models/priority_model');
})();
