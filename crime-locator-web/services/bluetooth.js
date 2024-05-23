import { playAudio } from "@/services/audio";

export async function connectToBluetooth() {
    let device, server, service, characteristic;

    try {
        device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ["181a"] }], // custom service UUID
        });

        server = await device.gatt.connect();
        service = await server.getPrimaryService("181a"); // custom service UUID
        characteristic = await service.getCharacteristic("2a58"); // custom characteristic UUID
    } catch (error) {
        return {
            characteristic: null,
            message: "Bluetooth connection failed: " + error.message,
        };
    }

    try {
        await characteristic.startNotifications();
        characteristic.addEventListener(
            "characteristicvaluechanged",
            handleCharacteristicValueChanged
        );
    } catch (error) {
        return {
            characteristic: null,
            message: "Failed to start notifications: " + error.message,
        };
    }

    return { characteristic, message: "Bluetooth connected successfully" };
}

async function handleCharacteristicValueChanged(event) {
    const value = event.target.value;
    // convert the value to an ArrayBuffer
    const audioData = new Uint8Array(value.buffer);
    // play the audio
    await playAudio(audioData);
}
