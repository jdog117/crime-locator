"use client";

import { useEffect, useState } from "react";
import { connectToBluetooth } from "../services/bluetooth";
import { playAudio } from "../services/audio";

export default function Home() {
    const [isReceivingAudio, setIsReceivingAudio] = useState(false);

    useEffect(() => {
        async function initBluetooth() {
            const characteristic = await connectToBluetooth();
            characteristic.addEventListener(
                "characteristicvaluechanged",
                (event: any) => {
                    const audioBuffer = event.target.value;
                    playAudio(audioBuffer);
                    setIsReceivingAudio(true);
                }
            );
        }

        initBluetooth();
    }, []);

    return (
        <div>
            <h1>Crime Locator Web App</h1>
            <p>Connecting to ESP32 via Bluetooth...</p>
            {isReceivingAudio && <p>Receiving audio...</p>}
        </div>
    );
}
