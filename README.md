## Simple [cifar10](https://www.cs.toronto.edu/~kriz/cifar.html) machine learning project

using [Tensorflow](https://www.tensorflow.org/)

### Installation

1. Install [Python 3.7](https://www.python.org/) (Latest python version that is Tensorflow 1 compatible)
2. Install packages

```
pip install -r requirements.txt
```

3. Run webserver.py

```
py webserver.py
```

webserver.py will start up a local server at http://localhost:8000. It will train a new model (Takes around 10 min). After training/loading the model it will be ready to serve. Navigate to http://localhost:8000/ and upload an image to test it out

### Google Colab

You can run the model from the cloud through Google colab instead!

https://colab.research.google.com/drive/1tCls8ue2ntO0xBTrRKmWcP4Bb-bkx7Ma?usp=sharing

**Switch from Tensorflow 2 to 1**

For this project I switched from Tensorflow 2 to 1 because Tensorflow 2 is incompatible with 32 bit systems (like my raspberry pi) and I would like to host this project on my pi. You can find the old version of this on the [commit 49107de](https://github.com/Moorad/cifar10-ml/tree/49107de159d4aa6a691bf1a61b27e4cbabebabcf) or use the jupyter notebook or try this on the cloud with the Google Colab link above

### Server

```
flask --app webserver run
```
