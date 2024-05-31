# Crime Locator

This app provides GPS locations for local crime/police activity. It uses an ESP32 microcontroller and a handheld ham radio for monitoring and the web app displays corodinates.

# Requirements

-   Only locally run models
-   Fast transcription and location data

# Hardware

### ESP32 Microcontroller

-   Sends radio audio to phone via Bluetooth.

### Qancheng UV-K6 radio

-   Inexpensive handheld ham radio used to pick up local police traffic. It's well built and can even be loaded with custom firmware.

# Software

-   HuggingFace AI models
-   Vite React web app
-   ESP32 Drivers

## ToDo

-   [ ] containerize server code for cloud deployment
-   [x] create web app as bridge to mcu

### Python virtual environment

> source venv/bin/activate
