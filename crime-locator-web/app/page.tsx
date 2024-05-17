"use client";

import { useEffect } from "react";
import { connectToBluetooth } from "../services/bluetooth";
import { playAudio } from "../services/audio";

export default function Home() {
    useEffect(() => {
        async function initBluetooth() {
            const characteristic = await connectToBluetooth();
            characteristic.addEventListener(
                "characteristicvaluechanged",
                (event: any) => {
                    const audioBuffer = event.target.value;
                    playAudio(audioBuffer);
                }
            );
        }

        initBluetooth();
    }, []);

    return (
        <div>
            <h1>Crime Locator Web App</h1>
            <p>Connecting to ESP32 via Bluetooth...</p>
        </div>
    );
}
