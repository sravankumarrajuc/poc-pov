import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from './Header';
import { exportToExcel } from "react-json-to-excel";
import { IconName } from "react-icons/bs";
import { BsPencilSquare, BsFillTrashFill, BsClipboard2CheckFill, BsPencilFill, BsFillXSquareFill, BsFileEarmarkExcelFill } from 'react-icons/bs';
import { accountNameList } from './dropdownData';
import { FaIcons } from "react-icons/fa";
import "./loading.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PocListing = (props) => {
    const [empdata, empdatachange] = useState(null);
    const [records, setRecords] = useState(empdata);
    const [editableRows, setEditableRows] = useState([]);
    const navigate = useNavigate();
    const [accountname, setAccountname] = useState(accountNameList)
    const [etavaluedata, etavaluedatachange] = useState("");
    const [logged, setLogged] = useState(localStorage.getItem("user-email"))
    // console.log("deleteAccess - ",deleteAccess)

    const LoadDetail = (id) => {
        navigate("/poc/detail/" + id);
    }
    const LoadEdit = (id) => {
        navigate("/poc/edit/" + id);
    }
    const Removefunction = (id) => {
        if (window.confirm('Do you want to remove?')) {
            fetch("http://localhost:8000/poc/" + id, {
                method: "DELETE"
            }).then((res) => {
                alert('Removed successfully.')
                window.location.reload();
            }).catch((err) => {
                console.log(err.message)
            })
        }
    }
    // Function to toggle editable state of a row
    function toggleEditable(index) {
        if (editableRows.includes(index)) {
            setEditableRows(editableRows.filter(i => i !== index));
        } else {
            setEditableRows([...editableRows, index]);
        }

        console.log("editableRows - ", editableRows)
    }

    const handleEdit = (id, status, statusValue, content, contentValue, etadate, etadateValue) => {
        // "STATUS", editedStatus, "CONTENT_AVAILABILITY", editedContent,"ETA_COMPLETE_DATE", editedETA
        const updatedRowData = records.map((row) => {
            if (row.UNIQUE_ID === id) {
                return {
                    ...row,
                    [status]: statusValue,
                    [content]: contentValue,
                    [etadate]: etadateValue,
                };
            }
            return row;
        });
        console.log("updatedRowData - ", updatedRowData)
        setRecords(updatedRowData);

        // Send updated data to API
        const updatedRow = updatedRowData.find((row) => row.UNIQUE_ID === id);
        console.log("updatedRow - ", updatedRow)
        // fetch(`https://example.com/api/rows/${id}`, {
        //   method: "PUT",
        //   body: JSON.stringify(updatedRow),
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // })
        //   .then((response) => {
        //     if (!response.ok) {
        //       throw new Error("Failed to update row");
        //     }
        //   })
        //   .catch((error) => {
        //     console.error(error);
        //     // Revert the change if the API call fails
        //     setRowData(rowData);
        //   });
    };

    const handleDelete = (id) => {
        const deleteRow = records.find((row) => row.UNIQUE_ID === id);
        console.log("deleteRow - ",deleteRow)
    }

    // Function to handle saving edited data
    function saveData(index) {
        // Iterate over editableRows and send data to backend API
        // You'll need to replace this with your own API call
        editableRows.filter(index => {
            console.log("index - ", index);
            console.log("empdata - ", empdata)
            const data = empdata[index];
            console.log("data - ", data)
            // send data to API endpoint here
        });

        // Clear editableRows state
        setEditableRows([]);
    }
    const loadRevenueDetails = async () => {
        let form_details = {
            "query_type": "poc_details"
        };
        let data = await fetch("https://rre.dev.factspanapps.com:5009/poc_details", {
            method: "POST",
            body: JSON.stringify(form_details),
        });
        const result = await data.json();
        console.log("result", result);
        setRecords(result.DATA)
        empdatachange(result.DATA)
    };

    useEffect(() => {
        // fetch("http://localhost:8000/poc").then((res) => {
        //     return res.json();
        // }).then((resp) => {
        //     empdatachange(resp);
        //     setRecords(resp)
        // }).catch((err) => {
        //     console.log(err.message);
        // })
        loadRevenueDetails();
    }, [])
    console.log("empdata - ", empdata)
    console.log("accountname - ", accountname);

    console.log("records - ", records)
    const handleFilter = (e) => {
        const newData = empdata.filter(row => {
            return (row.ACCOUNT_NAME.toLowerCase().includes(e.target.value.toLowerCase()) || row.REQUESTOR_NAME.toLowerCase().includes(e.target.value.toLowerCase())
                || row.PROJECT_FUNNEL.toLowerCase().includes(e.target.value.toLowerCase()) || row.PRIORITY.toLowerCase().includes(e.target.value.toLowerCase())
                || row.CREATED_DATE.toLowerCase().includes(e.target.value.toLowerCase())
                || row.POV_POC_TITLE.toLowerCase().includes(e.target.value.toLowerCase()) || row.DESCRIPTION.toLowerCase().includes(e.target.value.toLowerCase())
                || row.ETA_COMPLETE_DATE.toLowerCase().includes(e.target.value.toLowerCase())
                || row.COMITTED_ETA.toLowerCase().includes(e.target.value.toLowerCase()) || row.STATUS.toLowerCase().includes(e.target.value.toLowerCase())
                || row.UPDATED_DATE.toLowerCase().includes(e.target.value.toLowerCase()))
        })
        setRecords(newData)
    }
    const handleDateChange = (date) => {
        console.log("date - ", date)
        // convert the selected date to YYYY-MM-DD format
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        const formattedDate = `${year}-${month}-${day}`;
        console.log("formattedDate - ", formattedDate)
        etavaluedatachange(formattedDate);
    };

    
    if (!records) {
        return <div className="container-fuild">
            <Header></Header>
            <div className="spinner-container">
                <div className="loading-spinner"></div>
            </div>
        </div>
    }
    return (

        <div className="container-fuild">
            <Header></Header>
            <div className="card" style={{ fontSize: "12px" }}>
                {/* <div className="card-title">
                    <h2>Employee Listing</h2>
                </div> */}
                <div className="card-body">
                    <div className="divbtn">
                        <button className="btn btn-primary btn-sm excel-download" style={{ backgroundColor: '#0a95ff' }} onClick={() => exportToExcel(records, 'pocReportData')}><BsFileEarmarkExcelFill size={20} className='excel-btn' /></button>
                        {/* <Link to="poc/create" className="btn btn-success">Add POV/POC (+)</Link> */}
                        <Link to="poc/create" className="btn btn-success btn-sm" style={{ fontSize: '10px' }}>Add POV/POC</Link>
                    </div>
                    <div className="filter_div"><input type="text" className="form-control" placeholder="Search..." onChange={handleFilter} /></div>
                    <table className="table table-bordered poc-table">
                        <thead className="table-header">
                            <tr>
                                {/* <td>ID</td> */}
                                <td>Account</td>
                                <td>SOW Name</td>
                                <td>Requestor</td>
                                <td>Growth Leader</td>
                                <td>Project/Funnel</td>
                                <td>Priority</td>
                                <td>Created Date</td>
                                <td>POV/POC</td>
                                <td>Title</td>
                                <td>Description</td>
                                <td>Value</td>
                                <td>ETA Date</td>
                                <td>Committed ETA</td>
                                <td>Status</td>
                                <td>Content Availability</td>
                                <td>Update Date</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((row) => (
                                <TableRow key={row.UNIQUE_ID} row={row} handleEdit={handleEdit} handleDelete={handleDelete} logged ={logged}/>
                            ))}
                            {/* {records &&
                                records.map((item, index) => (
                                    <tr key={item.UNIQUE_ID}> */}
                            {/* <td>{item.id}</td> */}
                            {/* <td>{item.ACCOUNT_NAME}</td>
                                        <td>{item.SOW_NAME}</td>
                                        <td>{item.REQUESTOR_NAME}</td>
                                        <td>{item.GROWTH_LEADER_NAME}</td>
                                        <td>{item.PROJECT_FUNNEL}</td>
                                        <td>{item.PRIORITY}</td>
                                        <td>{formatDate(item.CREATED_DATE)}</td>
                                        <td>{item.FORM_TYPE_POC_POV == "" ? "" : item.FORM_TYPE_POC_POV}</td>
                                        <td>{item.POV_POC_TITLE}</td>
                                        <td>{item.DESCRIPTION}</td>
                                        <td>{item.PROJECT_VALUE}</td>
                                        <td>{formatDate(item.ETA_COMPLETE_DATE)}</td>
                                        <td>{editableRows.includes(item.UNIQUE_ID) ? <input type="date" className="edit-input" value={item.COMITTED_ETA} defaultValue={item.COMITTED_ETA} /> : (item.COMITTED_ETA)}</td>
                                        <td>{editableRows.includes(item.UNIQUE_ID) ? <select id="status-list" value={item.STATUS}>
                                            <option value="Initiated">Initiated</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select> : (item.STATUS)}</td>
                                        <td>{editableRows.includes(item.UNIQUE_ID) ? <input type="text" className="edit-input" defaultValue={item.CONTENT_AVAILABILITY} /> : item.CONTENT_AVAILABILITY}</td>
                                        <td>{formatDate(item.UPDATED_DATE)}</td>
                                        <td> */}
                            {/* <a onClick={() => { Removefunction(item.id) }} className="btn btn-danger btn-sm"><BsFillTrashFill size={12}/></a> */}
                            {/* <a onClick={() => { LoadDetail(item.id) }} className="btn btn-primary">Details</a> */}
                            {/* {editableRows.includes(item.UNIQUE_ID) ? (
                                                <>
                                                <button className="btn btn-danger btn-sm" title="Cancel" onClick={() => toggleEditable(item.UNIQUE_ID)}><BsFillXSquareFill size={12} /></button>
                                                <button className="btn btn-success btn-sm" title="Inline Edit" onClick={() => saveData(item.UNIQUE_ID)}><BsClipboard2CheckFill size={12} /></button>
                                                </>
                                                 ) : (
                                                <>
                                                    <button className="btn btn-success btn-sm" title="Inline Edit" onClick={() => toggleEditable(item.UNIQUE_ID)}><BsPencilSquare size={12} /></button>
                                                </>
                                            )}
                                            <a onClick={() => { LoadEdit(item.UNIQUE_ID) }} className="btn btn-success btn-sm"><BsPencilSquare size={12} /></a>
                                        </td>
                                    </tr>
                                ))
                            } */}

                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}

const TableRow = ({ row, handleEdit,handleDelete,logged }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedETA, seteditedETA] = useState("");
    const [editedStatus, seteditedStatus] = useState("");
    const [editedContent, seteditedContent] = useState("");
    const [deleteAccess, setDeleteAccess] = useState(false)
    // if(logged === "sravankumar.raju@factspan.com"){
    //     setDeleteAccess(true)
    // }
    console.log("logged in ",logged)
    const handleStatusChange = (e) => {
        seteditedStatus(e.target.value);
    };

    const handleETAChange = (e) => {
        seteditedETA(e.target.value);
    };

    const handleContentChange = (e) => {
        seteditedContent(e.target.value);
    };

    const formatDate = (dateString) => {
        const currentDate = new Date(dateString);
        const formattedDate = currentDate.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit"
        });
        return formattedDate;
    }

    const handleEditClick = () => {
        setIsEditing(true);
        seteditedStatus(row.STATUS);
        seteditedETA(row.COMMITTED_ETA);
        seteditedContent(row.CONTENT_AVAILABILITY)
    };

    const handleSaveClick = () => {
        console.log("row.UNIQUE_ID - ", row.UNIQUE_ID)
        console.log("STATUS - ", editedStatus)
        console.log("ETA_COMPLETE_DATE - ", editedETA)
        console.log("CONTENT_AVAILABILITY - ", editedContent)
        setIsEditing(false);
        handleEdit(row.UNIQUE_ID, "STATUS", editedStatus, "CONTENT_AVAILABILITY", editedContent, "COMMITTED_ETA", editedETA);
    };

    const handleDeleteClick = () => {
        console.log("row.UNIQUE_ID - ", row.UNIQUE_ID)
        handleDelete(row.UNIQUE_ID)
    }

    const statusOptions = [
        { value: "Initiated", label: "Initiated" },
        { value: "In Progress", label: "In Progress" },
        { value: "On Hold", label: "On Hold" },
        { value: "Completed", label: "Completed" },
        { value: "Cancelled", label: "Cancelled" },
    ];

    const ContentAvailabilityOptions = [
        { value: "Readily Available", label: "Readily Available" },
        { value: "Modifications Needed", label: "Modifications Needed" },
        { value: "New", label: "New" },
    ];

    return (
        <tr>
            <td>{row.ACCOUNT_NAME}</td>
            <td>{row.SOW_NAME}</td>
            <td>{row.REQUESTOR_NAME}</td>
            <td>{row.GROWTH_LEADER_NAME}</td>
            <td>{row.PROJECT_FUNNEL}</td>
            <td>{row.PRIORITY}</td>
            <td>{formatDate(row.CREATED_DATE)}</td>
            <td>{row.pocCheck}</td>
            <td>{row.POV_POC_TITLE}</td>
            <td>{row.DESCRIPTION}</td>
            <td>{row.PROJECT_VALUE}</td>
            <td>{row.ETA_COMPLETE_DATE == "" ? "" : formatDate(row.ETA_COMPLETE_DATE)}</td>
            <td>{isEditing ? (
                <input
                    type="date"
                    name="phone"
                    value={editedETA}
                    onChange={handleETAChange}
                />
            ) : (
                <span>{row.COMMITTED_ETA == "" ? "" : formatDate(row.COMMITTED_ETA)}</span>
            )}
            </td>
            <td>
                {isEditing ? (
                    <select name="name" value={editedStatus} onChange={handleStatusChange}>
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <span>{row.STATUS}</span>
                )}
            </td>
            <td>
                {isEditing ? (
                    <select name="name" value={editedContent} onChange={handleContentChange}>
                        {ContentAvailabilityOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <span>{row.CONTENT_AVAILABILITY}</span>
                )}
            </td>
            <td>{formatDate(row.UPDATED_DATE)}</td>
            <td>
                {isEditing ? (
                    <>
                        <button className="custom-button-save" onClick={handleSaveClick}><BsClipboard2CheckFill size={12} /></button>
                    </>
                ) : (
                    <>
                    <button className="custom-button" onClick={handleEditClick}><BsPencilSquare size={12} /></button>
                    </>
                )}
                {
                (logged === ("sravankumar.raju@factspan.com" || "ram.mohanreddy@factspan.com") &&
                    <button className="custom-button-delete" onClick={handleDeleteClick}><BsFillTrashFill size={12} /></button>)
                }
            </td>
        </tr>
    );
};

export default PocListing;