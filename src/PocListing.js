import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from './Header';
import { exportToExcel } from "react-json-to-excel";
import { IconName } from "react-icons/bs";
import { BsPencilSquare, BsFillTrashFill, BsFileEarmarkExcelFill } from 'react-icons/bs';

const PocListing = () => {
    const [empdata, empdatachange] = useState(null);
    const [records, setRecords] = useState(empdata)
    const navigate = useNavigate();

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

    useEffect(() => {
        fetch("http://localhost:8000/poc").then((res) => {
            return res.json();
        }).then((resp) => {
            empdatachange(resp);
            setRecords(resp)
        }).catch((err) => {
            console.log(err.message);
        })
    }, [])
    console.log("empdata - ", empdata)

    console.log("records - ", records)
    const handleFilter = (e) => {
        const newData = empdata.filter(row => {
            return (row.accname.toLowerCase().includes(e.target.value.toLowerCase()) || row.requestorname.toLowerCase().includes(e.target.value.toLowerCase())
                || row.project.toLowerCase().includes(e.target.value.toLowerCase()) || row.priority.toLowerCase().includes(e.target.value.toLowerCase())
                || row.currentdate.toLowerCase().includes(e.target.value.toLowerCase())
                || row.povtitle.toLowerCase().includes(e.target.value.toLowerCase()) || row.description.toLowerCase().includes(e.target.value.toLowerCase())
                || row.valuedata.toLowerCase().includes(e.target.value.toLowerCase()) || row.etavaluedata.toLowerCase().includes(e.target.value.toLowerCase())
                || row.committeddata.toLowerCase().includes(e.target.value.toLowerCase()) || row.status.toLowerCase().includes(e.target.value.toLowerCase())
                || row.updateddate.toLowerCase().includes(e.target.value.toLowerCase()))
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
                    <table className="table table-bordered">
                        <thead className="table-header">
                            <tr>
                                <td>ID</td>
                                <td>Account</td>
                                <td>Requestor</td>
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
                                <td>Update Date</td>
                                <td><Link to="poc/create" className="btn btn-success btn-sm" style={{ fontSize: '10px' }}>Add POV/POC</Link></td>
                            </tr>
                        </thead>
                        <tbody>

                            {records &&
                                records.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.accname}</td>
                                        <td>{item.requestorname}</td>
                                        <td>{item.project}</td>
                                        <td>{item.priority}</td>
                                        <td>{item.currentdate}</td>
                                        <td>{item.povCheck == true ? "POV" : ""} {item.pocCheck == true ? "POC" : ""}</td>
                                        <td>{item.povtitle}</td>
                                        <td>{item.description}</td>
                                        <td>{item.valuedata}</td>
                                        <td>{item.etavaluedata}</td>
                                        <td>{item.committeddata}</td>
                                        <td>{item.status}</td>
                                        <td>{item.updateddate}</td>
                                        <td><a onClick={() => { LoadEdit(item.id) }} className="btn btn-success btn-sm"><BsPencilSquare size={12} /></a>
                                            {/* <a onClick={() => { Removefunction(item.id) }} className="btn btn-danger btn-sm"><BsFillTrashFill size={12}/></a> */}
                                            {/* <a onClick={() => { LoadDetail(item.id) }} className="btn btn-primary">Details</a> */}
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