import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import "./Home.css"
import Item from '../../components/Item/Item'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';
import mqtt from "mqtt";

const Home = () => {
    const navigate = useNavigate();
    let rescpacaity=200;
    let grammeperrotation = 20;
    let [Distribution, setDistribution] = useState([]);
    let [counter, setCounter] = useState(0);
    const [brokerUrl, setBrokerUrl] = useState("wss://test.mosquitto.org:8081");
    const [topic, setTopic] = useState("d/test/pee");
    const [message, setMessage] = useState("update");
    const [isConnected, setIsConnected] = useState(false);
    const [client, setClient] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    console.log("this is the used url",API_BASE_URL);
    const connectToBroker = () => {
        const mqttClient = mqtt.connect(brokerUrl);
    
        mqttClient.on("connect", () => {
          console.log("Connected to broker");
          setIsConnected(true);
        });
    
        mqttClient.on("error", (err) => {
          console.error("Connection error: ", err);
          mqttClient.end();
        });
    
        setClient(mqttClient);
      };

      const publishMessage = () => {
        if (client && isConnected) {
          client.publish(topic, message, {}, (err) => {
            if (err) {
              console.error("Publish error: ", err);
            } else {
              console.log(`Message published to ${topic}: ${message}`);
            }
          });
        } else {
          console.error("Client is not connected");
        }
      };



    const remove_distribution = (id) => {
        const updatedItems = Distribution.filter((item) => item.id !== id);
        setDistribution(updatedItems)
    }


    const add_distribution = () => {
        let id = counter;
        let name = `Item ${id}`
        console.log(id, name)
        let item = { id: id, name: name, value: "" ,portion:0}
        console.log(item)
        //console.log(Distribution)
        setDistribution((prevDistributions) => [...prevDistributions, item]);
        setCounter(prev => prev + 1)
    }
    console.log(counter);
    console.log(Distribution)

    const handleChange = (id, field, val) => {
        // Update the specific item's field in the state
        setDistribution((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, ["value"]: val } : item
            )
        );
        
    };


    const HandelportionChanges = (id, field, val) => {
        console.log("i have been changed")
        setDistribution((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, ["portion"]: val } : item
            )
        );
    }

    const Save = async () => {
        console.log("save has been clicked")
        const hasEmptyString = Distribution.some(obj =>
            Object.values(obj).includes("")
        );
        
        const hasEmptyportion = Distribution.some(obj =>
            Object.values(obj).includes(0)
        );

        const hasLargePortion = Distribution.some(obj => obj.portion > 200);
        const hasnegative = Distribution.some(obj => obj.portion <= 0);
        const nonaccepted = Distribution.some(obj => obj.portion % 20 != 0);
        if (hasEmptyString) {
            console.log("At least one object contains an empty string value.");
            Swal.fire({
                title: "Données manquantes!",
                text: "Veuillez remplissez tous les champs!",
                icon: "error"
            })
            return
        }

        

        if (hasLargePortion) {
            
            Swal.fire({
                title: "Données manquantes!",
                text: `les valeur de portion ne doivent pas dépasser ${rescpacaity}g!`,
                icon: "error"
            })
            return
        }
        
        if (hasnegative) {
            
            Swal.fire({
                title: "Données manquantes!",
                text: `les valeur de portion ne doivent pas etre negatives ou égale à zero!`,
                icon: "error"
            })
            return
        }

        if (nonaccepted) {
            
            Swal.fire({
                title: "Données manquantes!",
                text: `les valeur de portion  doivent etre multiple de ${grammeperrotation}!`,
                icon: "error"
            })
            return
        }

        if (Distribution.length === 0) {
            Swal.fire({
                title: "Aucune donnée!",
                text: "Vous devez ajouter au moin une distribution!",
                icon: "error"
            })
            return
        }

        let response = await fetch(`${API_BASE_URL}/save`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                'auth-token': `${localStorage.getItem("auth-token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: Distribution })
        })

        if (response.status === 401){
            Swal.fire({
                title: "Erreur!",
                text: "Vous n'êtes pas autorisé à planifier des distributions!",
                icon: "error",
                confirmButtonText: "OK"
            }).then(() => {
                // Redirect after user acknowledges the alert
                //window.location.replace("/login");
                navigate("/login");
            });
        }
        let data = await response.json()
        if (data.success) {
            Swal.fire({
                title: "Bravo!",
                text: "Données sont sauvegardé avec success!",
                icon: "success"
            })
            setDistribution([])
            publishMessage()
        }
        else {
            console.log("else is here")
            Swal.fire({
                title: "Erreur!",
                text: "une erreur s'est produit lors de soumission au serveur!",
                icon: "error"
            })
        }


    }
    useEffect(()=>{
        connectToBroker()
    },[])
    return (
        <div className='landing'>
            <div className='container'>

                <div className='content'>
                    <h3>Planifiez des distributions</h3>

                    {Distribution.map((item, index) => (
                        <Item key={item.id} index={index + 1} onDelete={remove_distribution} name={item.name} id={item.id} onItemChange={handleChange} onPortionchange={HandelportionChanges} item={item} />
                    ))}
                    {Distribution.length ==0 ?<div className="info">
                        <span>Cliquez sur Ajouter une distribution</span> 
                    </div> :""}
                    
                    <div className='buttons'>
                        <button onClick={add_distribution}>Ajoutez une distribution <FontAwesomeIcon icon={faPlus} /></button>
                        <button onClick={Save}>Sauvegardez <FontAwesomeIcon icon={faFloppyDisk} /></button>
                    </div>

                </div>
            </div>
        </div>

    )
}

export default Home