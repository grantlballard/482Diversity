from flask import Flask, render_template


app = Flask(__name__, static_folder="./static/js")


@app.route("/")
def api_home():
	return render_template("home.html")

@app.route("/results")
def results():
    return render_template("results.html")



if __name__ == "__main__":
    app.run(debug=True)
