import React, { useState, useEffect } from 'react'
import "./History.css"
import Item from '../../components/Item/Item'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

import Swal from 'sweetalert2';
import moment from 'moment';
const History = () => {
  const navigate = useNavigate();
  let todaydate = moment().format('YYYY-MM-DD');
  let pastedate = moment(todaydate).subtract(7, 'days').format("YYYY-MM-DD")
  let [date, setDate] = useState({
    date1: pastedate,
    date2: todaydate
  });
  let [historyData,setHistorydata] = useState([])
  let todayTimestamp = moment.utc(todaydate, 'YYYY-MM-DD').startOf('day').valueOf();
  let pastTimestamp = moment.utc(pastedate, 'YYYY-MM-DD').startOf('day').valueOf();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  console.log()
  //console.log(pastTimestamp)
  const HandelChange = (e) => {
    setDate((prev) => { return { ...date, [e.target.name]: e.target.value } })
  }
  console.log(date)
  useEffect(() => {
    const fetchData = async () => {
      try {
        let itemResponse = await fetch(`${API_BASE_URL}/history`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            'auth-token': `${localStorage.getItem("auth-token")}`,
            "Content-Type": "application/json"
          },

          body: JSON.stringify({ startdate: date.date1, enddate: date.date2 })
        });
        //let itemResponseData = await itemResponse.json();
        if (itemResponse.status === 401) {
          console.log("this is before swalfire")
          Swal.fire({
            title: "Erreur!",
            text: "Vous devez vous identifier au premier!",
            icon: "error",
            confirmButtonText: "OK"
          }).then(() => {
            // Redirect after user acknowledges the alert
            //window.location.replace("/login");
            navigate("/login");
          });
        }
        let itemResponseData = await itemResponse.json()

        console.log("this is the result", itemResponseData.data)
        setHistorydata(itemResponseData.data)

      }

      catch (err) {
        console.log("Error loading the data", err)
      }
    }
    fetchData()
  }, [])

  const getData = async () => {
    console.log("path has been clicked")
    try {
      let itemResponse = await fetch(`${API_BASE_URL}/history`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          'auth-token': `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({ startdate: date.date1, enddate: date.date2 })
      });
      let itemResponseData = await itemResponse.json();
      console.log("this is the result", itemResponseData.data)
      setHistorydata(itemResponseData.data)
    }

    catch (err) {
      console.log("Error loading the data", err)
    }
  }
  return (
    <div className='history'>
      <div className='container'>

        <div className='content'>
          <h3>Historique des distributions servies</h3>
          <div className='topdiv'>
            <div>
              <span> Entre </span>
              <input min="2024-02-01" value={date.date1} name="date1" type="date" onChange={HandelChange} />
              <span> et </span>
              <input min="2024-02-02" value={date.date2} onChange={HandelChange} name="date2" type="date" />
              {<button onClick={getData}>OK</button>}
            </div>
          </div>
          {/* <div className='item-dist'>
            <div className='icon'><FontAwesomeIcon icon={faCheck} /></div>
            <div className='details'>
              <span className='date'>{todaydate}</span>
              <span className='hours'>13:00 AM</span>
            </div>
          </div> */}
          {historyData.map((item, index) => (
            
            <div key={index} className='item-dist'>
              <div className='icon'>
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <div className='details'>
                <span className='date'>{formatDate(item.delivery_time)}</span>
                <span className='hours'>{formatTime(item.delivery_time) }</span>
              </div>
            </div>
          ))}
          {/* <div className='item-dist'>
            <div className='icon'><FontAwesomeIcon icon={faCheck} /></div>
            <div className='details'>
              <span className='date'>{pastedate}</span>
              <span className='hours'>15:00 AM</span>
            </div>
          </div> */}
          {/*Distribution.map((item, index) => (
                        <Item key={item.id} index={index + 1} onDelete={remove_distribution} name={item.name} id={item.id} onItemChange={handleChange} item={item} />
                    ))*/}


        </div>
      </div>
    </div>
  )
}

const formatDate = (timestamp) => {

  /* const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, add 1
  const day = date.getDate().toString().padStart(2, '0'); // Pad with zero if needed
  return `${year}-${month}-${day}`; */

  const date = new Date(Number(timestamp)); // Ensure it's a number
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // UTC month
  const day = date.getUTCDate().toString().padStart(2, '0'); // UTC day

  return `${year}-${month}-${day}`;

};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
};
export default History