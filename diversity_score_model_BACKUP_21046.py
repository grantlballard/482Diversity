import numpy as np
import math
import re
import string
import pandas

def tokenize(d):
    """
    Parameters:
        d -> string. Document or query as raw string
    Returns:
        [string]. Tokenized version of 'd'
    """
    if not isinstance(d, str):
        raise TypeError

    punc_space_pattern = r'[\W{} ]+'.format(string.punctuation)
    d = d.lower() # Lowercase
    d = re.split(punc_space_pattern, d)            # Split on punctuation and whitespace
    d = list(filter(lambda tok: len(tok) >= 3, d)) # Remove tokens of size < 3
    return d

def tokenized_to_ngram(tokenized_doc, ngram_size=2):
    """
    Parameters:
        tokenized_doc -> [string]. Tokenized document which is a list of tokens
        ngram_size -> int. size of n-grams
    Returns:
        [string]. List of tokens concatenated into ngrams of size 'ngram_size'
    """
    ngrams = []
    for i in range(len(tokenized_doc)):
        new_ngram = ""
        if i+ngram_size <= len(tokenized_doc):
            for j in range(i, i+ngram_size):
                new_ngram += tokenized_doc[j] + " "
            ngrams.append(new_ngram.strip())
    return ngrams


def tf(t, d, log=False):
    """
    Parameters:
        t -> string. Token
        d -> list[string]. Tokenized document
        log -> boolean. True/False -> return log-weight/raw term frequency
    Returns:
        int. term frequency
    """
    if log:
        return 1 + math.log(d.count(t))
    else:
        return d.count(t)


def df(t, docs):
    """
    Parameters:
        t -> string. Token
        docs -> list[list[string]]. Tokenized collection of documents
    Returns:
        int. document frequency
    """
    dfVal = 0
    for doc in docs:
        if t in doc:
            dfVal += 1
    return dfVal


def idf(t, docs, log=False):
    """
    Parameters:
        t    -> string. Token
        docs -> list[list[string]]. Tokenized collection of documents
        log  -> boolean. True/False -> return log-weight/raw idf
    Returns:
        double. inverted document frequency
    """
    N = len(docs)
    dfVal = df(t, docs)
    if dfVal == 0:
        return 0
    elif log:
        return math.log(N / dfVal)
    else:
        return N / dfVal


def tf_idf(t, d, docs, log=False):
    """
    Parameters:
        t -> string. Token
        d -> list[string]. Tokenized document
        docs -> list[list[string]]. Tokenized collection of documents
        log  -> boolean. True/False -> return log-weight/raw tf_idf
    Returns:
        double. term-frequency inverted document frequency score
    """
    return tf(t, d, log) * idf(t, docs, log)


def get_document_diversity_score(diversity_dictionary, document, document_collection):
    """
    Parameters:
        diversity_dictionary -> [string]. List of strings representing the concept of diversity.
        document -> [string] tokenized company document to score.
        document_colleciton -> [[string]] list of all tokenized company documents.
    Returns:
        double. Diversity score of the document
    """
    total_diversity_score = 0.0
    for term in diversity_dictionary:
        diversity_score = tf_idf(term, document, document_collection)
        total_diversity_score += diversity_score
    return total_diversity_score


def get_collection_diversity_scores(diversity_dictionary, document_collection):
    """
    Parameters:
        diversity_dictionary -> [string]. List of strings representing the concept of diversity.
        document_colleciton -> [[string]] list of all tokenized company documents.
    Returns:
        tuple(string,double). List of tuples, first element in the tuple is the company name, second is the generated score
    """
    scores = []
    doc_collect = [i[1] for i in document_collection]
<<<<<<< HEAD:model.py
    for name,document in document_collection:
        tokenized_document = tokenized_to_ngram(tokenize(document))
        document_score = get_document_diversity_score(diversity_dictionary, tokenized_document, doc_collect)
=======
    for name, document in document_collection:
        document_score = get_document_diversity_score(diversity_dictionary, document, doc_collect)
>>>>>>> 342f63747cd55ccbe1da2b55e21ab4ae0c713175:diversity_score_model.py
        scores.append([name,document_score,"placeholercusip"])
    scores = pandas.DataFrame(scores, columns = ['comp_name','score','cusip'])
    return scores
