"use client";

import { useEffect, useState } from "react";
import { connectToBluetooth } from "../services/bluetooth";
import { playAudio } from "../services/audio";

export default function Home() {
    const [isReceivingAudio, setIsReceivingAudio] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function initBluetooth() {
            while (true) {
                try {
                    const characteristic = await connectToBluetooth();
                    if (!characteristic) {
                        setError("Characteristic is undefined");
                        continue; // If characteristic is undefined, try again
                    }
                    characteristic.addEventListener(
                        "characteristicvaluechanged",
                        (event: any) => {
                            const audioBuffer = event.target.value;
                            playAudio(audioBuffer);
                            setIsReceivingAudio(true);
                        }
                    );
                    break; // If connection is successful, break the loop
                } catch (error) {
                    if (error instanceof Error) {
                        setError(
                            "Failed to initialize Bluetooth: " + error.message
                        );
                    } else {
                        setError(
                            "Failed to initialize Bluetooth: An unknown error occurred"
                        );
                    }
                    // If there's an error, the loop will continue and try again
                }
            }
        }
        initBluetooth();
    }, []);

    return (
        <div>
            <h1>Crime Locator Web App</h1>
            <p>
                {isReceivingAudio
                    ? "Receiving audio..."
                    : "Connecting to ESP32 via Bluetooth..."}
            </p>
            {error && <p>Error: {error}</p>}
        </div>
    );
}
