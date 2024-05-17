#include <Arduino.h>
#include <driver/adc.h>
#include <BluetoothSerial.h>

#define MY_BLUE_LED_PIN 2
#define AUDIO_INPUT_PIN 34  // ADC1 channel 6

BluetoothSerial SerialBT;

void setup() {
  pinMode(MY_BLUE_LED_PIN, OUTPUT);
  adc1_config_width(ADC_WIDTH_BIT_12);
  adc1_config_channel_atten(ADC1_CHANNEL_6, ADC_ATTEN_DB_11);
  SerialBT.begin("ESP32Audio"); // Bluetooth device name

  // Initialize Serial communication
  Serial.begin(115200);
}

void loop() {
  digitalWrite(MY_BLUE_LED_PIN, LOW);
  delay(500);
  digitalWrite(MY_BLUE_LED_PIN, HIGH);
  delay(500);

  // Read audio signal
  int audioSignal = adc1_get_raw(ADC1_CHANNEL_6);

  // Print audio signal to Serial Monitor
  Serial.println(audioSignal);

  // Send audio signal over Bluetooth
  SerialBT.write(audioSignal);
}