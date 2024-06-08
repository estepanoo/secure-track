import React from "react";

const UserComboBox = ({ options, onChange, value }) => {
  return (
    <div className="form-control">
      <select
        className="select select-bordered"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((luggageOption) => (
          <option
            className="hover:bg-green-300"
            key={luggageOption._id}
            value={luggageOption.luggage_custom_name}
          >
            {luggageOption.luggage_custom_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserComboBox;
