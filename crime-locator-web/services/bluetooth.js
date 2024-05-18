import { playAudio } from "./audio";

export async function connectToBluetooth() {
    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ["181a"] }], // custom service UUID
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService("181a"); // custom service UUID
        const characteristic = await service.getCharacteristic("2a58"); // custom characteristic UUID

        characteristic.startNotifications();
        characteristic.addEventListener(
            "characteristicvaluechanged",
            handleCharacteristicValueChanged
        );

        return characteristic;
    } catch (error) {
        console.error("Bluetooth connection failed", error);
    }
}

async function handleCharacteristicValueChanged(event) {
    const value = event.target.value;
    // convert the value to an ArrayBuffer
    const audioData = new Uint8Array(value.buffer);
    // play the audio
    await playAudio(audioData);
}
