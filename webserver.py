from flask import Flask, render_template
from flask_cors import CORS, cross_origin

done_training = True

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/status")
def status():
    return {
		"done_training": done_training,
		"model_accuracy": 0.12
	}
    
@app.route("/doneTraining")
def doneTraining():
	global done_training
	done_training = True	
	return "ok"

if __name__ == "__main__":
    app.run(debug=True)