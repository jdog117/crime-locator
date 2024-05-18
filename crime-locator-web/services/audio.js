// audio player
export async function playAudio(audioData) {
    const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

    // Convert the received data to an AudioBuffer
    const audioBuffer = await audioContext.decodeAudioData(audioData.buffer);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
}
