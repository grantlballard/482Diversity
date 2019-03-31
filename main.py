from flask import Flask, render_template, json, request, session
import model

app = Flask(__name__)

# Toy diversity dictionary
diversity_dictionary = ["diverse teams", "diverse people", "love teamwork"]

# Toy document collection
company_1_document = "We believe in building diverse teams that are great at communication and love teamwork."
company_2_document = "We love teamwork. We believe teamwork is the best way to succeed."
company_3_document = "Diverse people make our company succeed. It's all about teamwork."
document_collection = [company_1_document, company_2_document, company_3_document]
document_collection = [model.tokenize(doc) for doc in document_collection]
document_collection = [model.tokenized_to_ngram(doc, 2) for doc in document_collection]

app.secret_key = 'A0Zr98j23yX R~Xav!jmN]LWX@,?RT'

@app.route("/")
def api_home():
	outfile = open('divdict.csv','w')
	outfile.write("LGBT policies, diversity organization, diverse people")
	outfile.close()
	return render_template("home.html")


@app.route("/upload_dict", methods = ["POST","GET"])
def upload_dictionary():
	if request.method == 'POST':

		d_content  = request.form
		d_content = d_content.to_dict()
		initdict = ''.join(d_content['test'])
		convdict = initdict.replace('\n',',')
		outfile = open('divdict.csv','w')
		outfile.write(convdict)
		outfile.close()
		return 'success'
	return " fail"


@app.route("/results")
def results():
    return render_template("results.html")

@app.route("/get_scores", methods = ["POST"])
def api_generate_scores():
	infile = open('divdict.csv','r')
	diversity_dictionary = infile.read().split(',')
	infile.close()
	print(diversity_dictionary)
	scores = model.get_collection_diversity_scores(diversity_dictionary, document_collection)
	response = []
	for score in scores:
	    item = {}
	    item["score"] = score
	    response.append(item)
	return json.dumps(response)


if __name__ == "__main__":
    app.run(debug=True)
