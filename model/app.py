import base64
import matplotlib.pyplot as plt
from flask import Flask

import os
from flask import request, jsonify
import tensorflow as tf 
import tensorflow_hub as hub 
import cv2 
import numpy as np

from flask_cors import CORS 

app = Flask(__name__)
CORS(app) 

multiple_people_detector = hub.load("https://tfhub.dev/tensorflow/efficientdet/d0/1")

COCO_LABELS = {
    1: "person",
    77: "cell phone"
}


def readb64(uri):
   encoded_data = uri.split(',')[1]
   nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
   img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
   img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
   return img


@app.route('/predict_people',methods=['GET','POST'])
def predict():
    data = request.get_json(force=True)
    image = readb64(data['img'])

    im_height, im_width = image.shape[:2]
    image = np.expand_dims(image, axis=0) 

    result = multiple_people_detector(image)

    boxes = result['detection_boxes'].numpy()[0]  
    classes = result['detection_classes'].numpy()[0].astype(int) 
    scores = result['detection_scores'].numpy()[0]  
    
    threshold = 0.5
    people_count = 0
    phone_count = 0

    for i in range(len(scores)):
        if scores[i] > threshold:
            class_id = classes[i]
            if class_id == 1: 
                people_count += 1
            elif class_id == 77:  
                phone_count += 1

    return jsonify({
        'people': people_count,
        'phones': phone_count
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=8080)