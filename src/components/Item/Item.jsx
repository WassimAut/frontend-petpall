import React from 'react'
import "./Item.css"
import { DatePicker } from 'rsuite';
import moment from 'moment';
const Item = ({index,onDelete,onItemChange,id,name,item,onPortionchange}) => {
  let todaydate= moment().format('YYYY-MM-DD')+"T00:00";

  console.log("todays date is:",todaydate)
    const handleChange = (e) => {
        const { name, value } = e.target; // Get the field name and value
        onItemChange(id, name, value); // Call the parent handler with id, field, and value
      };
    const handleChange2 = (e)=>{
      const { name, value } = e.target; // Get the field name and value
      onPortionchange(id, name, value);
    }
    
  return (
    <div className='item'>
     <span>dist {index}</span>
    {<input type="datetime-local"  min={todaydate}  name={name} value={item.value} onChange={handleChange}/>}
    {<span>portion en g</span>}
    {<input type="number" placeholder="Portion en g" name={name} value={item.portion}  onChange={handleChange2}/>}
    <button onClick={()=>{onDelete(id)}} >Supprimez</button>

    </div>
  )
}

export default Item