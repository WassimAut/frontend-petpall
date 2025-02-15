import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./Humidity.css"
import mqtt from "mqtt";
const MQTT_BROKER = "wss://test.mosquitto.org:8081"; // 
const MQTT_TOPIC = "d/testpub/pee"; 

const HumidityCircle = () => {
    const [humidity, setHumidity] = useState(40); // Default value

    useEffect(() => {
        // Connect to MQTT broker
        const client = mqtt.connect(MQTT_BROKER);
        client.on("connect", () => {
            console.log("Connected to MQTT broker");
            client.subscribe(MQTT_TOPIC, (err) => {
                if (!err) {
                    console.log(`Subscribed to ${MQTT_TOPIC}`);
                } else {
                    console.error("Subscription error:", err);
                }
            });
        });

        client.on("message", (topic, message) => {
            if (topic === MQTT_TOPIC) {
                const humidityValue = parseFloat(message.toString()); // Convert message to number
                console.log(humidityValue);
                setHumidity(humidityValue);
            }
        });

        return () => {
            client.end(); // Cleanup on unmount
        };
    }, []);

    return (
        <div className="w-40 h-40 humidity">
            <div className="container">
                <div className="content">
                    <h2>Humidity</h2>
                    <CircularProgressbar
                        value={humidity} // Use humidity directly (not as a percentage)
                        minValue={0}
                        maxValue={100}
                        text={`${humidity}%`} // Show the absolute number inside
                        styles={buildStyles({
                            textSize: "16px",
                            pathColor: `rgba(0, 123, 255, ${humidity / 100})`,
                            textColor: "#333",
                            trailColor: "#d6d6d6",
                        })}
                    />
                </div>

            </div>

        </div>
    );
};

export default HumidityCircle;
