import string

def postProcessLemma(lemma):
    return lemma.translate(str.maketrans('', '', string.punctuation))

print(postProcessLemma("u.k."))