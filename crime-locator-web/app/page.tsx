"use client";

import { useEffect, useState } from "react";
import { connectToBluetooth } from "@/services/bluetooth";
import { playAudio } from "@/services/audio";

export default function Home() {
    const [isReceivingAudio, setIsReceivingAudio] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function initBluetooth() {
            while (true) {
                try {
                    const { characteristic, message } =
                        await connectToBluetooth();
                    if (!characteristic) {
                        setError(message);
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
                    setError(
                        "Failed to initialize Bluetooth: " +
                            (error as Error).message
                    );
                    // wait 2 seconds before trying again
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                }
            }
        }
        initBluetooth();
    }, []);

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
        </div>
    );
}
