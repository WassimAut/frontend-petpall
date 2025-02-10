import React from 'react'
import "./item.css"
import { DatePicker } from 'rsuite';
import moment from 'moment';
const Item = ({index,onDelete,onItemChange,id,name,item}) => {
  let todaydate= moment().format('YYYY-MM-DD')+"T00:00";

  console.log("todays date is:",todaydate)
    const handleChange = (e) => {
        const { name, value } = e.target; // Get the field name and value
        onItemChange(id, name, value); // Call the parent handler with id, field, and value
      };
  return (
    <div className='item'>
     <span>distribution {index}</span>
    {<input type="datetime-local"  min={todaydate}  name={name} value={item.value} onChange={handleChange}/>}
    <button onClick={()=>{onDelete(id)}} >Supprimez</button>

    </div>
  )
}

export default Item