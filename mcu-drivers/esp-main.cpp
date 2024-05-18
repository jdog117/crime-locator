#include <Arduino.h>
#include <driver/adc.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define MY_BLUE_LED_PIN 2
#define AUDIO_INPUT_PIN 34  // ADC1 channel 6

BLECharacteristic *pCharacteristic;
bool deviceConnected = false;
const int readInterval = 50; // interval to read and send audio signal

void setup() {
  pinMode(MY_BLUE_LED_PIN, OUTPUT);
  adc1_config_width(ADC_WIDTH_BIT_12);
  adc1_config_channel_atten(ADC1_CHANNEL_6, ADC_ATTEN_DB_11);

  Serial.begin(9600);

  // Initialize BLE
  BLEDevice::init("ESP32Audio");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *pService = pServer->createService(BLEUUID((uint16_t)0x181A)); // Custom service UUID

  pCharacteristic = pService->createCharacteristic(
                      BLEUUID((uint16_t)0x2A58), // Custom characteristic UUID
                      BLECharacteristic::PROPERTY_READ |
                      BLECharacteristic::PROPERTY_WRITE |
                      BLECharacteristic::PROPERTY_NOTIFY
                    );

  pCharacteristic->addDescriptor(new BLE2902());

  pService->start();

  // start advertising
  pServer->getAdvertising()->start();
}

void loop() {
  if (deviceConnected) {
    // read audio signal
    int audioSignal = adc1_get_raw(ADC1_CHANNEL_6);

    // convert audio to byte array
    uint8_t audioData[2];
    audioData[0] = audioSignal & 0xFF;
    audioData[1] = (audioSignal >> 8) & 0xFF;

    // send audio over BLE
    pCharacteristic->setValue(audioData, 2);
    pCharacteristic->notify();

    // audio activity LED
    digitalWrite(MY_BLUE_LED_PIN, HIGH);
    delay(readInterval);
    digitalWrite(MY_BLUE_LED_PIN, LOW);
    delay(readInterval);
  }
}

class MyServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
  };

  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
  }
};