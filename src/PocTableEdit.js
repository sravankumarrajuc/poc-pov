import React, { useState} from "react";

const PocTableEdit = ({ row, handleEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedPhone, setEditedPhone] = useState("");
  
    const handleNameChange = (e) => {
      setEditedName(e.target.value);
    };
  
    const handlePhoneChange = (e) => {
      setEditedPhone(e.target.value);
    };
  
    const handleEditClick = () => {
      setIsEditing(true);
      setEditedName(row.name);
      setEditedPhone(row.phone);
    };
  
    const handleSaveClick = () => {
      setIsEditing(false);
      handleEdit(row.id, "name", editedName);
      handleEdit(row.id, "phone", editedPhone);
    };
  
    return (
      <tr>
        <td>{row.id}</td>
        <td>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editedName}
              onChange={handleNameChange}
            />
          ) : (
            <span>{row.name}</span>
          )}
        </td>
        <td>{row.email}</td>
        <td>
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={editedPhone}
              onChange={handlePhoneChange}
            />
          ) : (
            <span>{row.phone}</span>
          )}
        </td>
        <td>
          {isEditing ? (
            <button onClick={handleSaveClick}>Save</button>
          ) : (
            <button onClick={handleEditClick}>Edit</button>
          )}
        </td>
      </tr>
    );
  };

export default PocTableEdit;