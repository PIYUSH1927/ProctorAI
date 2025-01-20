## SETUP :

_STEP 1 :_ Create a virtual environment in model folder

- Change working directory to model :

```bash
cd model
```

- Install virtualenv package if it is not installed already :

```bash
pip install virtualenv
```

- Create virtual environment :

```bash
virtualenv venv
```

_STEP 2 :_ Activate virtual environment :

```bash
venv\Scripts\activate
```

> This command need administrative permissions.
> Use command prompt to execute this
> Will not work in powershell

_STEP 3 :_ Install required libraries

```py
pip install -r requirements.txt
```

_STEP 4 :_ Run flask app

```bash
python app.py
```

---

After this the api will be up and running on : _localhost:8080_
You can now give api calls from react frontend.

API ROUTES :

1. '/predict_people' : To predict number of people in input image

NOTE :

> The number of people detected can be changed via lowering the threshold
> To do that go to predict funtion in app.py and change the variable threshold
> Our default value is 0.5

```py
threshold = 0.5
```

---

- Link for object detection model 👉 [MODEL_LINK](https://tfhub.dev/tensorflow/efficientdet/d0/1)
