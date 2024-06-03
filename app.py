import os
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load your model (ensure the path to your model is correct)
model = load_model(r"E:\Projects\fire_detection\python\my_model.h5")


def predict_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0) / 255.0
    classes = model.predict(x)
    return np.argmax(classes[0]), float(max(classes[0]))


@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file:
        img_path = "uploaded_image.jpg"
        file.save(img_path)
        predicted_class, confidence = predict_image(img_path)
        os.remove(img_path)

        class_names = ["fire", "no fire"]
        predicted_class_name = class_names[predicted_class]

        return jsonify(
            {"predicted_class": predicted_class_name, "confidence": confidence}
        )


if __name__ == "__main__":
    app.run(debug=True)
