## Simple [cifar10](https://www.cs.toronto.edu/~kriz/cifar.html) machine learning project
using [Tensorflow](https://www.tensorflow.org/) and [Skeleton](http://getskeleton.com/)

### Installation
1. Install [Python](https://www.python.org/) 3.7–3.10 (Tensorflow 2 compatible)
2. Install packages
```
pip install -r requirements.txt
```
3. Run webserver.py
```
py webserver.py
```

webserver.py will start up a local server at http://localhost:8000. It will then search for a saved model to load if not found it will train a new model (Takes around 10 min). After training/loading the model it will be ready to serve. Navigate to http://localhost:8000/ and upload an image to test it out

### Google Colab
You can run the model through Google colab instead!

https://colab.research.google.com/drive/1tCls8ue2ntO0xBTrRKmWcP4Bb-bkx7Ma?usp=sharing