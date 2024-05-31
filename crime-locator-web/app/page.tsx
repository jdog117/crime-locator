"use client";

import { useEffect, useState } from "react";
import { connectToBluetooth } from "@/services/bluetooth";
import { playAudio } from "@/services/audio";
import { Button } from "@/components/ui/button";
// import { ModeToggle } from "@/components/ui/themeToggle";

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

    const handleReconnectClick = async () => {
        // Create a button element to fulfill the user gesture requirement
        const button = document.createElement("button");
        button.textContent = "Reconnect to Bluetooth";
        button.style.display = "none"; // Hide the button from view

        // Add an event listener to the button
        button.addEventListener("click", async () => {
            document.body.removeChild(button); // Remove the button after click
            await handleBluetoothConnection(); // Call the Bluetooth connection function
        });

        // Append the button to the document body and simulate a click
        document.body.appendChild(button);
        button.click();
    };

    return (
        <div className="m-5 md:m-20">
            <div>
                <h1 className="my-20 text-2xl font-bold">
                    Crime Locator Web App
                </h1>
                <p className="mt-20 text-xl">
                    {isReceivingAudio
                        ? "Receiving audio!"
                        : "Connecting to ESP32 via Bluetooth..."}
                </p>
                {error && (
                    <p className="my-5 text-lg text-red-600">Error: {error}</p>
                )}
                <Button onClick={handleReconnectClick} className="my-5">
                    Connect
                </Button>
            </div>
        </div>
    );
}
