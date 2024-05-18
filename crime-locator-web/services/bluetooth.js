export async function connectToBluetooth() {
    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ["181a"] }], // Custom service UUID
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService("181a"); // Custom service UUID
        const characteristic = await service.getCharacteristic("2a58"); // Custom characteristic UUID

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

function handleCharacteristicValueChanged(event) {
    const value = event.target.value;
    // Process the audio signal here
    console.log("Received audio signal:", value);
}
