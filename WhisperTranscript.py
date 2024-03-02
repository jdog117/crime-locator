from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
import whisper

# using medium model, 1.42GB
model = whisper.load_model("medium")
result = model.transcribe("1600_radio_audio.wav")
transcription = result["text"]
print(transcription)

'''
    BERT model for Named Entity Recognition (NER)
    AKA this model extracts named entities like locations "LOC" 
'''

# Load pre-trained BERT model for NER
tokenizer = AutoTokenizer.from_pretrained("dslim/bert-base-NER")
model = AutoModelForTokenClassification.from_pretrained("dslim/bert-base-NER")
nlp = pipeline("ner", model=model, tokenizer=tokenizer)

#example_text = "I live near Broadway and 5th Avenue in New York City."
ner_results = nlp(transcription)

# Print the extracted entities if it is a location
for entity in ner_results:
    if entity["entity"] in ["B-LOC", "I-LOC"]:
        print(f"Location: {entity['word']}")

'''
try bert question answer model
'''