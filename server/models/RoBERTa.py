from transformers import AutoTokenizer, AutoModelForQuestionAnswering, pipeline
from WhisperTranscript import transcribe_audio

# Load the pre-trained RoBERTa model for question answering
tokenizer = AutoTokenizer.from_pretrained("roberta-base")
model = AutoModelForQuestionAnswering.from_pretrained("roberta-base")

# Create a pipeline for question answering
nlp = pipeline("question-answering", model=model, tokenizer=tokenizer)

# Transcribe the audio
#transcription = transcribe_audio("1600_radio_audio.wav")

# Example context (passage)
context = """
RoBERTa is a transformers model pretrained on a large corpus of English data in a self-supervised fashion.
This means it was pretrained on the raw texts only, with no humans labelling them in any way.
RoBERTa uses an automatic process to generate inputs and labels from those texts.
"""

# Example question
question = "What does RoBERTa use for pretraining?"

# Get the answer
answer = nlp(question=question, context=context)
print(f"Answer: {answer['answer']}")
