from flask import Flask, render_template, json
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

@app.route("/")
def api_home():
    return render_template("home.html")

@app.route("/get_scores")
def api_generate_scores():
    scores = model.get_collection_diversity_scores(diversity_dictionary, document_collection)
    response = []
    for score in scores:
        item = {}
        item["score"] = score
        response.append(item)
    return json.dumps(response)


if __name__ == "__main__":
    app.run(debug=True)
