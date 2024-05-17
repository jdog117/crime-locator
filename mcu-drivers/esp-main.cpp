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
const int readInterval = 50; // Interval to read and send audio signal

void setup() {
  pinMode(MY_BLUE_LED_PIN, OUTPUT);
  adc1_config_width(ADC_WIDTH_BIT_12);
  adc1_config_channel_atten(ADC1_CHANNEL_6, ADC_ATTEN_DB_11);

  // Initialize Serial communication
  Serial.begin(115200);

  // Initialize BLE
  BLEDevice::init("ESP32Audio");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create BLE Service
  BLEService *pService = pServer->createService(BLEUUID((uint16_t)0x181A)); // Custom service UUID

  // Create BLE Characteristic
  pCharacteristic = pService->createCharacteristic(
                      BLEUUID((uint16_t)0x2A58), // Custom characteristic UUID
                      BLECharacteristic::PROPERTY_READ |
                      BLECharacteristic::PROPERTY_WRITE |
                      BLECharacteristic::PROPERTY_NOTIFY
                    );

  pCharacteristic->addDescriptor(new BLE2902());

  // Start the service
  pService->start();

  // Start advertising
  pServer->getAdvertising()->start();
}

void loop() {
  if (deviceConnected) {
    // Read audio signal
    int audioSignal = adc1_get_raw(ADC1_CHANNEL_6);

    // Convert audio signal to byte array
    uint8_t audioData[2];
    audioData[0] = audioSignal & 0xFF;
    audioData[1] = (audioSignal >> 8) & 0xFF;

    // Send audio signal over BLE
    pCharacteristic->setValue(audioData, 2);
    pCharacteristic->notify();

    // Blink LED to indicate activity
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