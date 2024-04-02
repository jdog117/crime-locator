import whisper

def transcribe_audio(audio_path):
    # using medium model, 1.42GB
    model = whisper.load_model("medium")
    result = model.transcribe(audio_path)
    transcription = result["text"]
    return transcription