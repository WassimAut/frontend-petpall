import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import LiquidFillGauge from "react-liquid-gauge";
import "./Humidity.css"
import mqtt from "mqtt";
const MQTT_BROKER = "wss://test.mosquitto.org:8081"; // 
const MQTT_TOPIC_humidity = "d/testpub/humidity";
const MQTT_TOPIC_reservoir = "d/testpub/reservoir";
const HumidityCircle = () => {
    const [humidity, setHumidity] = useState(40); // Default value
    const [nivreservoir, setNivreserv] = useState(30);
    useEffect(() => {
        const client = mqtt.connect(MQTT_BROKER);

        client.on("connect", () => {
            console.log("Connected to MQTT broker");
            client.subscribe([MQTT_TOPIC_humidity, MQTT_TOPIC_reservoir], (err) => {
                if (err) {
                    console.error("Subscription error:", err);
                } else {
                    console.log("Subscribed to topics");
                }
            });
        });

        client.on("message", (topic, message) => {
            let msg = Number(message);
            console.log(`Received message: ${msg} from topic: ${topic}`);

            if (topic === MQTT_TOPIC_humidity) {
                setHumidity(msg);
            } else if (topic === MQTT_TOPIC_reservoir) {
                if (msg > 400 || msg < 2) {
                    msg = 0;
                }

                //else if(){}

                setNivreserv(msg);
            }
        });

        return () => {
            client.end();
        };
    }, []);

    return (
        <>
            <div className="w-40 h-40 datawidget">
                <div className="container">
                    <div className="content">
                        <div className="box humidity">
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

                        <div className="box reservoir">
                            <div >
                                <h2 >Niveau Reservoir</h2>
                                <LiquidFillGauge
                                    value={nivreservoir}
                                    text={() => `${nivreservoir}`}

                                    circleColor="#3b82f6"
                                    waveColor="rgba(59, 130, 246, 0.7)"
                                    textColor="#333"
                                    textSize={1}
                                    
                                />
                            </div>
                        </div>


                    </div>

                </div>

            </div>


        </>
    );
};

export default HumidityCircle;
