from transformers import AutoTokenizer, AutoModelForTokenClassification
from transformers import pipeline

# Faster smaller version of bert ner

tokenizer = AutoTokenizer.from_pretrained("dslim/distilbert-NER")
model = AutoModelForTokenClassification.from_pretrained("dslim/distilbert-NER")

transcription = " She also Marathon County. Gonna be for a suspect. In a stabbing in the town of Cleveland. Spanning the knolls. 1028306 Union Young David 306 Union Young David 2013 for escape not registered to him. Last seen weapon on State Highway 153. Unknown weapons is located stop hold. To a Marshall to be an address for him. I'm I'm working on it right now. Alright, so that's what you. Working. I have a 2 vehicle. One car took off my color bleeds. I use it. He's in the middle of the road, unable to move it. The other cars done sure the maker model is happening so fast he believes it continues southbound. Again, it's a Kelvin in four. Please the big legend took off."

nlp = pipeline("ner", model=model, tokenizer=tokenizer)
ner_results = nlp(transcription)
for entity in ner_results:
    if entity["entity"] in ["B-LOC", "I-LOC"]:
        print(f"Location: {entity['word']}")   # not showwing results atm


'''
The training dataset distinguishes between the beginning and continuation of an entity so that if there 
are back-to-back entities of the same type, the model can output where the second entity begins. As in 
the dataset, each token will be classified as one of the following classes:

B-LOC	Beginning of a location right after another location
I-LOC	Location
'''