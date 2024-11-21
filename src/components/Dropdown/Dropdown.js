import React from "react";
import Select from "react-dropdown-select";
import './Dropdown.css'

export const Dropdown = ({options,setValues,values}) => {
  
  return (
    <div className="container">
      <Select options={options} values={values} onChange={(values) =>setValues(values)} className="dropdown" style={{borderRadius: 5,borderColor: '#3c3c3c'}}/>
    </div>
  );
};
