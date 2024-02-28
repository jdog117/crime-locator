import torch
from transformers import Speech2TextProcessor, Speech2TextForConditionalGeneration
import soundfile as sf

# Load the pre-trained Speech2Text model
model = Speech2TextForConditionalGeneration.from_pretrained("facebook/s2t-small-librispeech-asr")
processor = Speech2TextProcessor.from_pretrained("facebook/s2t-small-librispeech-asr")

audio_file = "1600_radio_audio.wav"

# Load the audio file and extract features
audio, sampling_rate = sf.read(audio_file)
inputs = processor(audio, sampling_rate=sampling_rate, return_tensors="pt")

# Generate the transcript
generated_ids = model.generate(
    inputs["input_features"],
    attention_mask=inputs["attention_mask"],
)

transcription = processor.batch_decode(generated_ids, skip_special_tokens=True)
print(transcription)

#source venv/bin/activate
