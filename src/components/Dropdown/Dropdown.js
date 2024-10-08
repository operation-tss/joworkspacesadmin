import React from "react";
import Select from "react-dropdown-select";
import './Dropdown.css'

export const Dropdown = ({options,setValues}) => {
  
  return (
    <div className="container">
      <Select options={options} onChange={(values) => setValues(values)} className="dropdown" />
    </div>
  );
};
