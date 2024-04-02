import soundfile as sf
import librosa

# Specify the paths
input_wav_file = "radio_audio.wav"
output_wav_file = "1600_radio_audio.wav"

# Load the audio file
audio, original_sampling_rate = librosa.load(input_wav_file, sr=None)

# Set the target sampling rate (e.g., 16000)
target_sampling_rate = 16000

# Resample the audio
resampled_audio = librosa.resample(audio, orig_sr=original_sampling_rate, target_sr=target_sampling_rate)

# Save the resampled audio to a new WAV file using soundfile
sf.write(output_wav_file, resampled_audio, target_sampling_rate)
