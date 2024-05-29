import { playAudio } from "@/services/audio";

export async function connectToBluetooth() {
    let device, server, service, characteristic;
    console.log("Connecting to Bluetooth..."); // FOR DEBUG
    try {
        device = await navigator.bluetooth
            .requestDevice({
                filters: [{ services: ["0x181A"] }], // can try by name and other methods
            })
            .catch((error) => {
                console.log(error.message); // FOR DEBUG
                return {
                    characteristic: null,
                    message: "Bluetooth connection failed: " + error.message,
                };
            });

        server = await device.gatt.connect().catch((error) => {
            return {
                characteristic: null,
                message: "Failed to connect to server: " + error.message,
            };
        });
        console.log(
            // FOR DEBUG
            "Server connect! " +
                server.connected +
                ", device name: " +
                device.name
        );

        console.log("Server connected gatt: " + device.name);
        service = await server.getPrimaryService("0x181A").catch((error) => {
            return {
                characteristic: null,
                message: "Failed to get primary service: " + error.message,
            };
        });

        characteristic = await service
            .getCharacteristic("0x2A58")
            .catch((error) => {
                return {
                    characteristic: null,
                    message: "Failed to get characteristic: " + error.message,
                };
            });
    } catch (error) {
        return {
            characteristic: null,
            message: "Failed to initialize Bluetooth: " + error.message,
        };
    }

    try {
        await characteristic.startNotifications().catch((error) => {
            return {
                characteristic: null,
                message: "Failed to start notifications: " + error.message,
            };
        });
        characteristic.addEventListener(
            "characteristicvaluechanged",
            (event) => {
                const audioBuffer = event.target.value;
                playAudio(audioBuffer);
            }
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
    // sends to page.tsx through playAudio
    await playAudio(audioData);
}
