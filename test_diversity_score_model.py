import pytest
import diversity_score_model as dsm

@pytest.fixture
def diversity_dictionary():
    """
    Returns:
        Type:       [string]
        Summary:    An example diversity dictionary
    """
    return ["this", "uniqueword1", "uniqueword2"]


@pytest.fixture
def doc():
    """
    Returns:
        Type:       string
        Summary:    An example document
    """
    return "This is an example document"


@pytest.fixture
def doc_collection(doc):
    """
    Returns:
        Type:       [string]
        Summary:    List of raw documents
    """
    doc_2 = "This is an example document uniqueword1"
    doc_3 = "This is an example document uniqueword2"
    return [doc, doc_2, doc_3]    


@pytest.fixture
def tokenized_doc(doc):
    """
    Returns:
        Type:       [string]
        Summary:    An example tokenized document 
    """
    return dsm.tokenize(doc)


@pytest.fixture
def tokenized_doc_collection(doc_collection):
    """
    Returns:
        Type:       [[string]]
        Summary:    List of tokenized documents representing a document collection.
    """
    return [dsm.tokenize(doc) for doc in doc_collection]
    

def test_tokenize(doc):
    assert dsm.tokenize(doc) == ["this", "example", "document"]


def test_tokenize_error_handling():
    doc = 2
    with pytest.raises(TypeError):
        dsm.tokenize(doc) 


def test_tokenized_to_ngram(doc):
    tokenized_doc = dsm.tokenize(doc)
    assert dsm.tokenized_to_ngram(tokenized_doc, 2) == [
        "this example", 
        "example document"
        ]


def test_tokenized_to_ngram_error_handling():
    tokenized_doc = 2
    with pytest.raises(TypeError):
        dsm.tokenized_to_ngram(tokenized_doc, 2)


@pytest.mark.parametrize("term, expected", [
    ("this", 1),
    ("example", 1),
    ("document", 1),
    ("nonsense", 0),
])
def test_tf(tokenized_doc, term, expected):
    assert dsm.tf(term, tokenized_doc) == expected


@pytest.mark.parametrize("term, expected", [
    ("this", 3),
    ("example", 3),
    ("document", 3),
    ("uniqueword1", 1),
    ("uniqueword2", 1),
    ("non_existant_word", 0)
])
def test_df(tokenized_doc_collection, term, expected):
    assert dsm.df(term, tokenized_doc_collection) == expected


@pytest.mark.parametrize("term, expected", [
    ("this", 3/3),
    ("example", 3/3),
    ("document", 3/3),
    ("uniqueword1", 3/1),
    ("uniqueword2", 3/1),
    ("non_existant_word", 0)
])
def test_idf(tokenized_doc_collection, term, expected):
    assert dsm.idf(term, tokenized_doc_collection) == expected


def test_tf_idf(tokenized_doc, tokenized_doc_collection):
    expected_tf_idf = [1, 1, 1]
    for i, term in enumerate(tokenized_doc):
        assert dsm.tf_idf(term, tokenized_doc, tokenized_doc_collection) == expected_tf_idf[i]


def test_get_document_diversity_score(diversity_dictionary, tokenized_doc_collection):
    expected_scores = [1, 4, 4]
    for score, doc in zip(expected_scores, tokenized_doc_collection):
        assert dsm.get_document_diversity_score(diversity_dictionary, doc, tokenized_doc_collection) == score


def test_get_collection_diversity_scores(diversity_dictionary, tokenized_doc_collection):
    expected_scores = [1, 4, 4]
    assert dsm.get_collection_diversity_scores(diversity_dictionary, tokenized_doc_collection) == expected_scores






