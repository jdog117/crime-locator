"use client";

import { useEffect, useState } from "react";
import { connectToBluetooth } from "@/services/bluetooth";
import { playAudio } from "@/services/audio";

export default function Home() {
    const [isReceivingAudio, setIsReceivingAudio] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleBluetoothConnection = async () => {
        setIsReceivingAudio(false);
        setError(null);
        try {
            const { characteristic, message } = await connectToBluetooth();
            if (!characteristic) {
                setError(message);
                return; // If characteristic is undefined, stop
            }
            characteristic.addEventListener(
                "characteristicvaluechanged",
                (event: any) => {
                    const audioBuffer = event.target.value;
                    playAudio(audioBuffer);
                    setIsReceivingAudio(true);
                }
            );
        } catch (error) {
            setError(
                "Failed to initialize Bluetooth: " + (error as Error).message
            );
        }
    };

    useEffect(() => {
        handleBluetoothConnection();
    }, []);

    const handleReconnectClick = async () => {
        handleBluetoothConnection();
    };

    return (
        <div>
            <h1 className="m-20 text-xl">Crime Locator Web App</h1>
            <p className="m-20 text-xl">
                {isReceivingAudio
                    ? "Receiving audio!"
                    : "Connecting to ESP32 via Bluetooth..."}
            </p>
            {error && (
                <p className="m-20 text-lg text-red-600">Error: {error}</p>
            )}
            <button onClick={handleReconnectClick} className="m-20">
                Reconnect
            </button>
        </div>
    );
}
