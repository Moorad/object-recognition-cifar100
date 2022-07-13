from http.server import HTTPServer, BaseHTTPRequestHandler
from os import curdir, sep, path, remove, makedirs
import json
from keras.optimizers import Adam
from keras.losses import CategoricalCrossentropy
from keras.models import Sequential, load_model
from keras.layers import Dense, Flatten, Conv2D, MaxPool2D, Dropout
from keras.utils import to_categorical
from keras.datasets import cifar10
import matplotlib.pyplot as plt
import numpy as np
from skimage.transform import resize

plt.style.use('fivethirtyeight')

# Get classification
classification = ['airplane', 'automobile', 'bird', 'cat',
                  'deer', 'dog', 'frog', 'horse', 'ship', 'truck']
model = None
evalutation = None

# Load data
(x_train, y_train), (x_test, y_test) = cifar10.load_data()

# Convert labels to a set of 10 numbers
y_train_one_hot = to_categorical(y_train)
y_test_one_hot = to_categorical(y_test)

# Normalise pixel values
x_train = x_train / 255
x_test = x_test / 255

# Load or train model


def check_model():
    global model, accuracy
    if (model is None):
        try:
            model = load_model('saved_model/')
        except (IOError):
            print('No saved model found. Training new model...')
            train_model()

    # After loading/training calculate accuracy
    accuracy = model.evaluate(x_train, y_train_one_hot)[1]
    print('Model loaded')


# Train model
def train_model():
    global model, x_train, y_train, x_test, y_test, y_train_one_hot, y_test_one_hot

    # Creating model
    model = Sequential()

    # Convolution layer
    model.add(Conv2D(32, (5, 5), activation='relu', input_shape=(32, 32, 3)))
    # Pooling layer
    model.add(MaxPool2D(pool_size=(2, 2)))
    # Another convolution layer
    model.add(Conv2D(32, (5, 5), activation='relu'))
    # Another pooling layer
    model.add(MaxPool2D(pool_size=(2, 2)))
    # Flatten layer
    model.add(Flatten())
    # Adding 1k neurons
    model.add(Dense(1000, activation='relu'))
    # Drop out layer
    model.add(Dropout(0.5))
    # Adding 500 neurons
    model.add(Dense(500, activation='relu'))
    # Drop out layer (again)
    model.add(Dropout(0.5))
    # Adding 250 neurons
    model.add(Dense(250, activation='relu'))
    # Adding 10 neurons
    model.add(Dense(10, activation='softmax'))

    # Model compilation
    model.compile(loss=CategoricalCrossentropy(),
                  optimizer=Adam(),
                  metrics=['accuracy'])

    # Train model
    model.fit(x_train, y_train_one_hot,
              batch_size=256,
              epochs=10,
              validation_split=0.2)

    # save model
    model.save('saved_model/')


# Run a prediciton on the file passed in
def run_model(filename):
    global model, classification

    new_image = plt.imread('images/' + filename)
    resized_image = resize(new_image, (32, 32, 3))

    # Get model prediction
    prediction = model.predict(np.array([resized_image]))

    # Process prediction
    list_index = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    x = prediction

    for i in range(10):
        for j in range(10):
            if (x[0][list_index[i]] > x[0][list_index[j]]):
                temp = list_index[i]
                list_index[i] = list_index[j]
                list_index[j] = temp

    # Print prediction
    print('Prediction: ' + classification[list_index[0]])

    return json.dumps({
        'predictions': list(map(lambda x: classification[x], list_index)),
        'evaluation': accuracy
    })

# Handle get and post requests
class requestHandler(BaseHTTPRequestHandler):
    def _set_headers(self, content_type):
        self.send_response(200)
        self.send_header('content-type', content_type)
        self.end_headers()

    # Serve file from ./public folder
    def do_GET(self):
        if (self.path == '/'):
            self.path = '/index.html'

        self.serveFromPublic(self.path)

    # Save file received and run model
    def do_POST(self):
        result = self.handle_post_file()

        # Check if file was saved sucessfully
        if (result == True):
            self._set_headers('application/json')
            self.wfile.write(run_model(path.basename(self.path)).encode())
            # Delete file once done
            remove('images/' + path.basename(self.path))
        else:
            self.send_error(400, 'Bad request')

    # Serve html and css file from public
    def serveFromPublic(self, file):
        try:
            if (file.endswith('.html') or file.endswith('.css')):
                f = open(curdir + sep + 'public' + sep + file)

                if (file.endswith('.html')):
                    self._set_headers('text/html')
                else:
                    self._set_headers('text/css')

                self.wfile.write(f.read().encode())
                f.close()
                return
            else:
                self.send_error(404, 'File Not Found ' + file)
        except IOError:
            self.send_error(404, 'File Not Found ' + file)

    def handle_post_file(self):
        filename = path.basename(self.path)

        # Don't overwrite files
        if path.exists(filename):
            self.send_response(409, 'Conflict')
            self.end_headers()
            reply_body = '"%s" already exists\n' % filename
            self.wfile.write(reply_body.encode('utf-8'))
            return False

        file_length = int(self.headers['Content-Length'])

        if not path.exists('images'):
            makedirs('images')

        with open('images/' + filename, 'wb') as output_file:
            output_file.write(self.rfile.read(file_length))
        return True


def main():
    PORT = 8000
    server = HTTPServer(('', PORT), requestHandler)  # ('') for localhost
    print('Server is running at port ' + str(PORT))
    check_model()
    server.serve_forever()


if __name__ == '__main__':
    main()
