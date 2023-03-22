import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from './Header';
import { exportToExcel } from "react-json-to-excel";
import { IconName } from "react-icons/bs";
import { BsPencilSquare, BsFillTrashFill,BsClipboard2CheckFill, BsPencilFill, BsFillXSquareFill, BsFileEarmarkExcelFill } from 'react-icons/bs';
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
    }

    // Function to handle saving edited data
    function saveData(index) {
        // Iterate over editableRows and send data to backend API
        // You'll need to replace this with your own API call
        editableRows.filter(index => {
            console.log("index - ", index);
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
    const [pageSize, setPageSize] = useState(5);
    const columns = [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Account', accessor: 'accname' },
        { Header: 'Requestor', accessor: 'requestorname' },
        { Header: 'Value', accessor: 'valuedata', Cell: ({ value }) => `$${value}` },
        {
            Header: 'Actions',
            Cell: () => (
                <button onClick={() => console.log('Button clicked!')}>Click me</button>
            ),
        },
    ];
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

    function formatDate(dateString) {
        const currentDate = new Date(dateString);
        const formattedDate = currentDate.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit"
        });
        return formattedDate;
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
            <div className="card" style={{ fontSize: "12px" }}>
                {/* <div className="card-title">
                    <h2>Employee Listing</h2>
                </div> */}
                <div className="card-body">
                    <div className="divbtn">
                        <button className="btn btn-primary excel-download" style={{ backgroundColor: '#0a95ff' }} onClick={() => exportToExcel(records, 'pocReportData')}><BsFileEarmarkExcelFill size={20} className='excel-btn' /></button>
                        {/* <Link to="poc/create" className="btn btn-success">Add POV/POC (+)</Link> */}
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
                                <td>ETA Value</td>
                                <td>Committed ETA</td>
                                <td>Status</td>
                                <td>Content Availability</td>
                                <td>Update Date</td>
                                <td><Link to="poc/create" className="btn btn-success btn-sm" style={{ fontSize: '10px' }}>Add POV/POC</Link></td>
                            </tr>
                        </thead>
                        <tbody>

                            {records &&
                                records.map((item, index) => (
                                    <tr key={item.UNIQUE_ID}>
                                        {/* <td>{item.id}</td> */}
                                        <td>{item.ACCOUNT_NAME}</td>
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
                                        <td>{editableRows.includes(index) ? <input type="date" className="edit-input" value={item.COMITTED_ETA} defaultValue={item.COMITTED_ETA} /> : (item.COMITTED_ETA)}</td>
                                        <td>{editableRows.includes(index) ? <select id="status-list" value={item.STATUS}>
                                            <option value="Initiated">Initiated</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select> : (item.STATUS)}</td>
                                        <td>{editableRows.includes(index) ? <input type="text" className="edit-input" defaultValue={item.CONTENT_AVAILABILITY} /> : item.CONTENT_AVAILABILITY}</td>
                                        <td>{formatDate(item.UPDATED_DATE)}</td>
                                        <td>
                                            {/* <a onClick={() => { Removefunction(item.id) }} className="btn btn-danger btn-sm"><BsFillTrashFill size={12}/></a> */}
                                            {/* <a onClick={() => { LoadDetail(item.id) }} className="btn btn-primary">Details</a> */}
                                            {editableRows.includes(index) ? (
                                                <>
                                                <button className="btn btn-danger btn-sm" title="Cancel" onClick={() => toggleEditable(index)}><BsFillXSquareFill size={12} /></button>
                                                <button className="btn btn-success btn-sm" title="Inline Edit" onClick={() => saveData(index)}><BsClipboard2CheckFill size={12} /></button>
                                                </>
                                                 ) : (
                                                <>
                                                    <button className="btn btn-success btn-sm" title="Inline Edit" onClick={() => toggleEditable(index)}><BsPencilSquare size={12} /></button>
                                                </>
                                            )}
                                            <a onClick={() => { LoadEdit(item.id) }} className="btn btn-success btn-sm"><BsPencilSquare size={12} /></a>
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}

export default PocListing;