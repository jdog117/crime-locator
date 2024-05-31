// audio player
export async function playAudio(audioData) {
    const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

    // Check if audioData.buffer is valid
    if (!audioData || !audioData.buffer) {
        console.error("Invalid audioData or audioData.buffer is detached");
        return;
    }

    try {
        // Convert the received data to an AudioBuffer
        const audioBuffer = await audioContext.decodeAudioData(
            audioData.buffer
        );
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(0);
    } catch (error) {
        console.error("Failed to decode audio data:", error);
    }
}
