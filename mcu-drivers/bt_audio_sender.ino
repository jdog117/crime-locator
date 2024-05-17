/*
  Streaming of sound data with Bluetooth to other Bluetooth device.
  We generate 2 tones which will be sent to the 2 channels.
  
  Src: 2020 Phil Schatzmann
*/


// Boilerplate //

#include "BluetoothA2DPSource.h"
#include <math.h> 

#define c3_frequency  130.81

BluetoothA2DPSource a2dp_source;

// The supported audio codec in ESP32 A2DP is SBC. SBC audio stream is encoded
// from PCM data normally formatted as 44.1kHz sampling rate, two-channel 16-bit sample data
int32_t get_data_frames(Frame *frame, int32_t frame_count) {
    static float m_time = 0.0;
    float m_amplitude = 10000.0;  // -32,768 to 32,767
    float m_deltaTime = 1.0 / 44100.0;
    float m_phase = 0.0;
    float pi_2 = PI * 2.0;
    // fill the channel data
    for (int sample = 0; sample < frame_count; ++sample) {
        float angle = pi_2 * c3_frequency * m_time + m_phase;
        frame[sample].channel1 = m_amplitude * sin(angle);
        frame[sample].channel2 = frame[sample].channel1;
        m_time += m_deltaTime;
    }
    // to prevent watchdog
    delay(1);

    return frame_count;
}


void setup() {
  a2dp_source.set_auto_reconnect(false);
  a2dp_source.start("LEXON MINO L", get_data_frames);  
  a2dp_source.set_volume(30);
}

void loop() {
  // to prevent watchdog in release > 1.0.6
  delay(1000);
}