import whisper

model = whisper.load_model("small")
result = model.transcribe("1600_radio_audio.wav")
print(result["text"])