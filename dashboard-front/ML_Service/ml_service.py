from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import tensorflow as tf

app = FastAPI()

# Allow requests from any frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
MODEL_PATH = "fruit_classify_model_110525.h5"
model = tf.keras.models.load_model(MODEL_PATH)

# Load class labels
with open("labels.txt", "r") as f:
    class_names = [line.strip() for line in f.readlines()]

def preprocess_image(image_bytes):
    img = Image.open(image_bytes).convert("RGB")
    img = img.resize((100, 100))  # Fruits 360 default size
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.post("/classify-fruit")
async def classify_fruit(file: UploadFile = File(...)):
    img_array = preprocess_image(file.file)
    preds = model.predict(img_array)
    pred_idx = int(np.argmax(preds[0]))
    print(f"Predicted index: {pred_idx}, Number of labels: {len(class_names)}")
    if pred_idx >= len(class_names):
        return {"error": f"Predicted index {pred_idx} out of range for {len(class_names)} labels."}
    pred_label = class_names[pred_idx]
    confidence = float(np.max(preds[0]))
    return {"predicted_class": pred_label, "confidence": confidence}
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    preds = model.predict(img_array)[0]
    class_idx = int(np.argmax(preds))
    confidence = float(np.max(preds))
    class_name = class_labels[class_idx] if class_idx < len(class_labels) else "Unknown"

    return {
        "class": class_name,
        "confidence": confidence
    }
