// web to mcu bluetooth service

const uuid = "ESP32Audio";
export async function connectToBluetooth() {
    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ["your_service_uuid"] }],
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService("your_service_uuid");
        const characteristic = await service.getCharacteristic(
            "your_characteristic_uuid"
        );

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
