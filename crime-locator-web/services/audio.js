// audio player
export function playAudio(audioBuffer) {
    const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
}
