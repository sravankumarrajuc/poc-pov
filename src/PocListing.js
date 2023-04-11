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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmpdataFilter from './pocAccountFilter'


const PocListing = (props) => {
    const [empdata, empdatachange] = useState(null);
    const [records, setRecords] = useState(empdata);
    const [editableRows, setEditableRows] = useState([]);
    const navigate = useNavigate();
    const [accountname, setAccountname] = useState(accountNameList)
    const [etavaluedata, etavaluedatachange] = useState("");
    const [logged, setLogged] = useState(localStorage.getItem("user-email"))
    const [requestemail, setRequestemail] = useState(localStorage.getItem("user-email"))
    const [requestorname, setRequestorname] = useState(localStorage.getItem("user-name"))
    const [filteredData, setFilteredData] = useState(empdata);
    const [selectedAccountNames, setSelectedAccountNames] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
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
        // console.log("updatedRowData - ", updatedRowData)
        setRecords(updatedRowData);

        // Send updated data to API
        const updatedRow = updatedRowData.find((row) => row.UNIQUE_ID === id);
        console.log("updatedRow - ", updatedRow)
        updatePOCDetails(updatedRow)
    };

    const updatePOCDetails = async (updatedRow) => {
        console.log("Update - ", updatedRow)
        let form_details = {
            "user_details": [
                {
                    "EMAIL_ID": requestemail,
                    "USERNAME": requestorname
                }
            ],
            "POC_DATA": [updatedRow]
        };
        let data = await fetch("http://43.205.208.162:5009/edit_poc", {
            method: "POST",
            body: JSON.stringify(form_details),
        }).then(response => response.json())
            .then(result => {
                // Handle the result
                console.log(result);
                toast.success(result.Message, {
                    autoClose: 3000,
                    position: toast.POSITION.TOP_RIGHT
                });
                loadPOCDetails();
            })
            .catch(error => {
                // Handle errors
                console.error(error);
                toast.error("An error occurred.", {
                    autoClose: 3000,
                    position: toast.POSITION.TOP_RIGHT
                });
            });
    };

    const handleDelete = (id) => {
        const deleteRow = records.find((row) => row.UNIQUE_ID === id);
        console.log("deleteRow - ", deleteRow)
        deletePOCDetails(deleteRow)
    }
    const deletePOCDetails = async (deleteRow) => {
        console.log("Delete - ", deleteRow)
        let form_details = {
            "user_details": [
                {
                    "EMAIL_ID": requestemail,
                    "USERNAME": requestorname
                }
            ],
            "POC_DATA": [deleteRow]
        };
        let data = await fetch("http://43.205.208.162:5009/delete_poc", {
            method: "POST",
            body: JSON.stringify(form_details),
        })
            .then(response => response.json())
            .then(result => {
                // Handle the result
                console.log(result);
                toast.success(result.Message, {
                    autoClose: 3000,
                    position: toast.POSITION.TOP_RIGHT
                });
                loadPOCDetails();
            })
            .catch(error => {
                // Handle errors
                console.error(error);
                toast.error("An error occurred.", {
                    autoClose: 3000,
                    position: toast.POSITION.TOP_RIGHT
                });
            });
    };

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
    const loadPOCDetails = async () => {
        let form_details = {
            "query_type": "poc_details"
        };
        let data = await fetch("http://43.205.208.162:5009/poc_details", {
            method: "POST",
            body: JSON.stringify(form_details),
        });
        const result = await data.json();
        console.log("result", result);
        setRecords(result.DATA)
        empdatachange(result.DATA)
    };
    const handleFilterChange = (selectedAccounts) => {
        if (selectedAccounts.length === 0) {
            setRecords(empdata);
        } else {
            const filtered = empdata.filter((item) => selectedAccounts.includes(item.ACCOUNT_NAME));
            setRecords(filtered);
        }
    }
    // handle account name dropdown change
    // const handleAccountNameChange = (e) => {
    //     const selectedNames = Array.from(e.target.selectedOptions, option => option.value);
    //     setSelectedAccountNames(selectedNames);

    //     // filter data based on selected account names and status
    //     const newData = empdata.filter((item) => {
    //         const isSelectedAccountName = selectedNames.includes(item.ACCOUNT_NAME);
    //         const isSelectedStatus = !selectedStatus || item.STATUS === selectedStatus;
    //         return isSelectedAccountName && isSelectedStatus;
    //     });
    //     setRecords(newData);
    // };
    const handleAccountChange = (e) => {
        const { value } = e.target;
        if (value === "All") {
            setRecords(empdata);
        } else {
          const selectedAccounts = value.split(",");
          const newData = empdata.filter(
            (data) => selectedAccounts.indexOf(data.ACCOUNT_NAME) > -1
          );
          setRecords(newData);
        }
      };

    // handle status dropdown change
    const handleStatusChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedStatus(selectedValue);

        // filter data based on selected account names and status
        const newData = empdata.filter((item) => {
            const isSelectedAccountName = !selectedAccountNames.length || selectedAccountNames.includes(item.ACCOUNT_NAME);
            const isSelectedStatus = !selectedValue || item.STATUS === selectedValue;
            return isSelectedAccountName && isSelectedStatus;
        });
        setRecords(newData);
    };

    useEffect(() => {
        console.log("Use State")
        loadPOCDetails();
    }, [])
    console.log("empdata - ", empdata)
    console.log("accountname - ", accountname);

    console.log("records - ", records)
    const handleFilter = (e) => {
        const newData = empdata.filter(row => {
            return (
                (row.ACCOUNT_NAME && row.ACCOUNT_NAME.toLowerCase().includes(e.target.value.toLowerCase())) ||
                (row.SOW_NAME && row.SOW_NAME.toLowerCase().includes(e.target.value.toLowerCase())) ||
                (row.FORM_TYPE_POC_POV && row.FORM_TYPE_POC_POV.toLowerCase().includes(e.target.value.toLowerCase())) ||
                (row.REQUESTOR_NAME && row.REQUESTOR_NAME.toLowerCase().includes(e.target.value.toLowerCase())) ||
                (row.PROJECT_FUNNEL && row.PROJECT_FUNNEL.toLowerCase().includes(e.target.value.toLowerCase())) ||
                (row.PRIORITY && row.PRIORITY.toLowerCase().includes(e.target.value.toLowerCase())) ||
                (row.CREATED_DATE && row.CREATED_DATE.toLowerCase().includes(e.target.value.toLowerCase())) ||
                (row.POV_POC_TITLE && row.POV_POC_TITLE.toLowerCase().includes(e.target.value.toLowerCase())) ||
                (row.DESCRIPTION && row.DESCRIPTION.toLowerCase().includes(e.target.value.toLowerCase())) ||
                (row.ETA_COMPLETE_DATE && row.ETA_COMPLETE_DATE.toLowerCase().includes(e.target.value.toLowerCase())) ||
                (row.COMITTED_ETA && row.COMITTED_ETA.toLowerCase().includes(e.target.value.toLowerCase())) ||
                (row.STATUS && row.STATUS.toLowerCase().includes(e.target.value.toLowerCase())) ||
                (row.UPDATED_DATE && row.UPDATED_DATE.toLowerCase().includes(e.target.value.toLowerCase()))
            )
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
    let accountOptions = []
    if(empdata != null){
        accountOptions = ["All", ...new Set(empdata.map((data) => data.ACCOUNT_NAME))];    
    }

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
            <div className="card" style={{ fontSize: "12px", top: "75px" }}>
                {/* <div className="card-title">
                    <h2>Employee Listing</h2>
                </div> */}
                <div className="card-body">
                    <div className="divbtn">
                        {/* <Link to="poc/create" className="btn btn-success">Add POV/POC (+)</Link> */}
                        <Link to="poc/create" className="btn btn-success btn-sm" style={{ fontSize: '10px' }}>POV/POC Request</Link>
                    </div>
                    <div className="filter_div">
                        <button className="btn btn-primary btn-sm excel-download" onClick={() => exportToExcel(records, 'pocReportData')}>Download Excel</button>
                        <input type="text" className="form-control" placeholder="Search..." onChange={handleFilter} />
                    </div>
                    {/* <EmpdataFilter empdata={empdata} onFilterChange={handleFilterChange} /> */}
                    <div className="row">
                        {/* <label htmlFor="account-name-dropdown">Filter by Account Name: </label> */}
                        <select id="account-name-dropdown" className="form-select account-dropdown" onChange={handleAccountChange}>
                            {accountOptions.map((account) => (
                                <option value={account} key={account}>
                                    {account}
                                </option>
                            ))}
                        </select>
                        {/* <label htmlFor="status-dropdown">Filter by Status: </label> */}
                        <select id="status-dropdown" className="form-select account-dropdown" onChange={handleStatusChange}>
                            <option value="">All</option>
                            {Array.from(new Set(empdata.map((item) => item.STATUS))).map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                    </div>
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
                                <td>Customer current Tech stack</td>
                                <td>Customer Use cases</td>
                                <td>Description</td>
                                <td>Value</td>
                                <td>ETA Date</td>
                                <td>Committed ETA</td>
                                <td>Status</td>
                                <td>Content Availability</td>
                                <td>Update Date</td>
                                {
                                    ((logged === "ram.mohanreddy@factspan.com" || logged === "sravankumar.raju@factspan.com")) && <td></td>
                                }

                            </tr>
                        </thead>
                        <tbody>
                            {records.map((row) => (
                                <TableRow key={row.UNIQUE_ID} row={row} handleEdit={handleEdit} handleDelete={handleDelete} logged={logged} />
                            ))}
                            <ToastContainer />
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}

const TableRow = ({ row, handleEdit, handleDelete, logged }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedETA, seteditedETA] = useState("");
    const [editedStatus, seteditedStatus] = useState("");
    const [editedContent, seteditedContent] = useState("");
    const [deleteAccess, setDeleteAccess] = useState(false)
    // if(logged === "sravankumar.raju@factspan.com"){
    //     setDeleteAccess(true)
    // }
    console.log("logged in ", logged)
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
        { value: "-1", label: "Selected Status" },
        { value: "Initiated", label: "Initiated" },
        { value: "In Progress", label: "In Progress" },
        { value: "On Hold", label: "On Hold" },
        { value: "Completed", label: "Completed" },
        { value: "Cancelled", label: "Cancelled" },
    ];

    const ContentAvailabilityOptions = [
        { value: "-1", label: "Select Availability" },
        { value: "Readily Available", label: "Readily Available" },
        { value: "Modifications Needed", label: "Modifications Needed" },
        { value: "New", label: "New" },
    ];
    console.log("logged - ", logged)
    return (
        <tr>
            <td>{row.ACCOUNT_NAME}</td>
            <td>{(row.SOW_NAME).replace(/_/g, " ")}</td>
            <td>{row.REQUESTOR_NAME}</td>
            <td>{row.GROWTH_LEADER_NAME}</td>
            <td>{row.PROJECT_FUNNEL}</td>
            <td>{row.PRIORITY}</td>
            <td>{formatDate(row.CREATED_DATE)}</td>
            <td>{row.FORM_TYPE_POC_POV}</td>
            <td>{row.POV_POC_TITLE}</td>
            <td>{row.CUSTOMER_CURRENT_TECH_STACK}</td>
            <td>{row.CUSTOMER_USE_CASES}</td>
            <td>{row.DESCRIPTION}</td>
            <td>{row.PROJECT_VALUE}</td>
            <td>{row.ETA_COMPLETE_DATE == "" ? "" : formatDate(row.ETA_COMPLETE_DATE)}</td>
            <td>{isEditing ? (
                <input
                    type="date"
                    name="phone"
                    className="edit-input"
                    value={editedETA}
                    onChange={handleETAChange}
                />
            ) : (
                <span>{row.COMMITTED_ETA == "" ? "" : formatDate(row.COMMITTED_ETA)}</span>
            )}
            </td>
            <td>
                {isEditing ? (
                    <select name="name" className="edit-input" value={editedStatus} onChange={handleStatusChange}>
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
                    <select name="name" className="edit-input" value={editedContent} onChange={handleContentChange}>
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
            {
                ((logged === "ram.mohanreddy@factspan.com" || logged === "sravankumar.raju@factspan.com")) &&
                <td>

                    {(isEditing ? (
                        <>
                            <button className="custom-button-save" onClick={handleSaveClick}><BsClipboard2CheckFill size={12} /></button>
                        </>
                    ) : (
                        <>
                            <button className="custom-button" onClick={handleEditClick}><BsPencilSquare size={12} /></button>
                        </>
                    ))}
                    {
                        (
                            <button className="custom-button-delete" onClick={handleDeleteClick}><BsFillTrashFill size={12} /></button>
                        )
                    }
                </td>
            }
        </tr>
    );
};

export default PocListing;