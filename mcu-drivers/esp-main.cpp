#include <Arduino.h>
#include <driver/adc.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define MY_BLUE_LED_PIN 2
const int readInterval = 20;

BLECharacteristic *pCharacteristic;
bool deviceConnected = false;

class MyServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    Serial.println("Device connected");
  };

  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    Serial.println("Device disconnected");
  }
};

void setup() {
  pinMode(MY_BLUE_LED_PIN, OUTPUT);
  adc1_config_width(ADC_WIDTH_BIT_12);
  adc1_config_channel_atten(ADC1_CHANNEL_6, ADC_ATTEN_DB_11);

  // adc2_config_channel_atten(ADC2_CHANNEL_8, ADC_ATTEN_DB_11); // coming soon

  Serial.begin(9600);

  // ble init
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

  pServer->getAdvertising()->start();
}

void loop() {
  if (deviceConnected) {
    int audioSample = adc1_get_raw(ADC1_CHANNEL_6);
    // int audioSample = adc2_get_raw(ADC2_CHANNEL_8, ); // pin 25. use ADC1 for wifi tx // coming soon

    // convert audio to byte array
    uint8_t audioData[2];
    audioData[0] = audioSample & 0xFF;
    audioData[1] = (audioSample >> 8) & 0xFF;

    // send audio over BLE
    pCharacteristic->setValue(audioData, 2);
    pCharacteristic->notify();

    digitalWrite(MY_BLUE_LED_PIN, !digitalRead(MY_BLUE_LED_PIN));
    delay(readInterval);
    
    Serial.println(String(audioSample));
    // Serial.println("Audio data: " + String(audioData[0]) + String(audioData[1]));
  }
}