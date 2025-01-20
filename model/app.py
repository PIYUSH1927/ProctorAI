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



def readb64(uri):
   encoded_data = uri.split(',')[1]
   nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
   img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
   img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
   return img


@app.route('/predict_people',methods=['GET','POST'])
def predict() : 
    data = request.get_json(force = True)
    image= readb64(data['img'])
    im_width, im_height = image.shape[0], image.shape[1]
    image = image.reshape((1, image.shape[0], image.shape[1], 3))
    data = multiple_people_detector(image)

    boxes = data['detection_boxes'].numpy()[0]
    classes = data['detection_classes'].numpy()[0]
    scores = data['detection_scores'].numpy()[0]

    threshold = 0.5
    people = 0
    for i in range(int(data['num_detections'][0])):
        if classes[i] == 1 and scores[i] > threshold:
            people += 1
            ymin, xmin, ymax, xmax = boxes[i]
            (left, right, top, bottom) = (xmin * im_width, xmax * im_width,
                                          ymin * im_height, ymax * im_height)

    return jsonify({ 'people' : int(people) , 'image' : 'image'})


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=8080)