from flask import jsonify
import spacy

nlp = spacy.load("en_core_web_sm")

def semanticParsing(request):
    request_json = request.get_json()
    if not request_json or not'text' in request_json:
        return 'error'
    doc = nlp(request_json['text'])
    result = []
    for token in doc:
        result.append({
            "text": token.text, 
            "lemma": token.lemma_,
            "pos": token.pos_,
            "tag": token.tag_,
            "dep": token.dep_,
            "stop": token.is_stop,
            "punc": token.is_punct,
            "children": [child.lemma_ for child in token.children],
        })
    return jsonify(tokens = result)