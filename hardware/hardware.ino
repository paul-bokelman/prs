#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>
#include <ezButton.h>
#include <string.h>
#include "environment.h"

const char* ssid = NETWORK_SSID;
const char* password = NETWORK_PASSWORD;
const char* ws_server_host = WS_SERVER_HOST;
const uint16_t ws_server_port = WS_SERVER_PORT;

ezButton rightButton(12);
ezButton leftButton(15);
ezButton middleButton(13);

using namespace websockets;
using namespace std;
WebsocketsClient client;

unsigned long previousMillis = 0; 
const long interval = 2000;  

// connection states
// yellow: connecting, red: failed, green: connected

void setup() {
    Serial.begin(115200);

    WiFi.begin(ssid, password);

    Serial.println("");

    for(int i = 0; i < 20 && WiFi.status() != WL_CONNECTED; i++) {
        Serial.print(".");
        delay(1000);
    }

    if(WiFi.status() != WL_CONNECTED) {
        Serial.println("No Wifi!");
        return;
    }

    Serial.println("Connected to Wifi, Connecting to server.");
    // bool connected = client.connect("ws://" + WS_SERVER_HOST + "" + WS_SERVER_PORT + "/ws?client=physical");
    bool connected = client.connect(ws_server_host, ws_server_port, "/ws?client=physical");
    if(connected) {
        Serial.println("Connected!");
    } else {
        Serial.println("Not Connected!");
    }
    
    client.onMessage([&](WebsocketsMessage message) {
        Serial.print("Got Message: ");
        Serial.println(message.data());
    });

     
    rightButton.setDebounceTime(50);
    leftButton.setDebounceTime(50);
    middleButton.setDebounceTime(50);
}

void loop() {
    rightButton.loop();
    leftButton.loop();
    middleButton.loop();

    unsigned long currentMillis = millis();

    if (currentMillis - previousMillis >= interval) {
      previousMillis = currentMillis;
      client.ping();
    }


    if(client.available()) {
      if(middleButton.isPressed()) {
        client.send("[\"confirm\", \"{}\"]");
        return;
      }

      if(rightButton.isPressed()) {
        client.send("[\"moveIndex\", {\"direction\":\"right\"}]");
        return;
      }
      
      if(leftButton.isPressed()) {
        client.send("[\"moveIndex\", {\"direction\":\"left\"}]");
        return;
      }
      client.poll();
    }
}