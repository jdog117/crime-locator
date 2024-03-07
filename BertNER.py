from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
from WhisperTranscript import transcribe_audio

'''
    BERT model for Named Entity Recognition (NER)
    AKA this model extracts named entities like locations "LOC"
'''

# Load pre-trained BERT model for NER
tokenizer = AutoTokenizer.from_pretrained("dslim/bert-base-NER")
model = AutoModelForTokenClassification.from_pretrained("dslim/bert-base-NER")
nlp = pipeline("ner", model=model, tokenizer=tokenizer)

transcription = transcribe_audio("1600_radio_audio.wav")
#example_text = "I live near Broadway and 5th Avenue in New York City."
ner_results = nlp(transcription)

# Print the extracted entities if it is a location
for entity in ner_results:
    if entity["entity"] in ["B-LOC", "I-LOC"]:
        print(f"Location: {entity['word']}")


'''
The training dataset distinguishes between the beginning and continuation of an entity so that if there 
are back-to-back entities of the same type, the model can output where the second entity begins. As in 
the dataset, each token will be classified as one of the following classes:

B-LOC	Beginning of a location right after another location
I-LOC	Location
'''