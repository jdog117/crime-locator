import { playAudio } from "@/services/audio";

export async function connectToBluetooth() {
    let device, server, service, characteristic;
    console.log("Connecting to Bluetooth..."); // FOR DEBUG

    try {
        // Directly request the Bluetooth device without waiting for a user gesture
        device = await navigator.bluetooth
            .requestDevice({
                filters: [{ name: ["ESP32Audio"] }], // keep this filter
                optionalServices: ["0000181a-0000-1000-8000-00805f9b34fb"], // this needs to be the name of the service on the mcu
            })
            .then((device) => {
                console.log("Device found!!! " + device.name); // FOR DEBUG
                return device;
            })
            .catch((error) => {
                console.log(error.message); // FOR DEBUG
                return {
                    characteristic: null,
                    message:
                        "Bluetooth connection failed step 1: " + error.message,
                };
            });

        if (!device) {
            throw new Error("No device found");
        }

        server = await device.gatt
            .connect()
            .then((server) => {
                console.log("Server connected!"); // FOR DEBUG
                return server;
            })
            .catch((error) => {
                throw new Error(
                    "Failed to connect to server: " + error.message
                );
            });

        console.log(
            "Server connected! " +
                server.connected +
                ", device name: " +
                device.name
        ); // FOR DEBUG

        service = await server
            .getPrimaryService("0000181a-0000-1000-8000-00805f9b34fb")
            .catch((error) => {
                throw new Error(
                    "Failed to get primary service: " + error.message
                );
            });

        characteristic = await service
            .getCharacteristic("00002a58-0000-1000-8000-00805f9b34fb")
            .then((characteristic) => {
                console.log("Characteristic found!"); // FOR DEBUG
                return characteristic;
            })
            .catch((error) => {
                throw new Error(
                    "Failed to get characteristic: " + error.message
                );
            });

        await characteristic.startNotifications().catch((error) => {
            throw new Error("Failed to start notifications: " + error.message);
        });

        characteristic.addEventListener(
            "characteristicvaluechanged",
            (event) => {
                const audioBuffer = event.target.value;
                console.log(audioBuffer); // FOR DEBUG
                playAudio(audioBuffer);
            }
        );

        return { characteristic, message: "Bluetooth connected successfully" };
    } catch (error) {
        console.log(error.message); // FOR DEBUG
        return {
            characteristic: null,
            message: "Failed to initialize Bluetooth: " + error.message,
        };
    }
}
