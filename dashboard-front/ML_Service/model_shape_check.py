import tensorflow as tf

model = tf.keras.models.load_model("fruit_classify_model_110525.h5")
print("Model output shape:", model.output_shape)
