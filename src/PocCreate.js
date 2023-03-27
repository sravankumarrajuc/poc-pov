import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { accountNameList } from "./dropdownData";
import Header from './Header';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const PocCreate = () => {
    let tempDate = new Date();
    let date = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
    console.log("accountNameList - ", accountNameList)
    const [id, idchange] = useState("");
    const [accname, accnamechange] = useState("");
    const [accid, accIdchange] = useState("");
    const [requestorname, requestornamechange] = useState(localStorage.getItem("user-name"));
    const [povtitle, povtitlechange] = useState("");
    const [description, descriptionchange] = useState("");
    const [priority, prioritychange] = useState("");
    const [project, projectchange] = useState("");
    const [valuedata, valuedatachange] = useState("");
    const [etavaluedata, etavaluedatachange] = useState("");
    const [povCheck, setPovCheck] = useState(false);
    const [pocCheck, setPocCheck] = useState(false);
    const [validation, valchange] = useState(false);
    const [currentdate, setCurrentdate] = useState(date);
    const [committeddata, setCommitteddata] = useState(new Date());
    const [status, setStatus] = useState("");
    const [updateddate, setUpdateddate] = useState("");
    const [createdby, setCreatedby] = useState(localStorage.getItem("user-name"))
    const [growthleader, setGrowthleader] = useState("")
    const [pocother, setPocother] = useState("")
    const [content, setcontent] = useState("")
    const [accountdropdown, setAccountdropdown] = useState([]);
    const [sowdatadropdown, setSowDatadropdown] = useState([]);
    const [sowname, setSowname] = useState("");
    const [sowid, setSowid] = useState("");
    const [requestemail, setRequestemail] = useState(localStorage.getItem("user-email"))
    const [pocpovtype, setPocpovtype] = useState("");
    const [pocpovothercheck, setPocpovothercheck] = useState(false);
    const [selectedOption, setselectedOption] = useState("")
    const [otherText, setOtherText] = useState("")
    const [formErrors, setFormErrors] = useState({});

    const handleOptionChange = (e) => {
        const { value } = e.target;
        setselectedOption(value);
    }

    const handleOtherTextChange = (e) => {
        const { value } = e.target;
        setOtherText(value);
    }
    const loadRevenueDetails = async () => {
        let form_details = {
            "query_type": "poc_details"
        };
        let data = await fetch("http://43.205.208.162:5009/sow_emp_drop_down", {
            method: "POST",
            body: JSON.stringify(form_details),
        });
        const result = await data.json();
        console.log("result", result);
        setAccountdropdown(result.SOW_DROP_DOWN)
    };

    useEffect(() => {
        loadRevenueDetails();
    }, [])


    const navigate = useNavigate();
    useEffect(() => {
        if (selectedOption === 'other') {
            setPocpovtype(otherText)
        } else {
            setPocpovtype(selectedOption)
        }
        console.log("pocpovtype - ", pocpovtype)
    })

    const Handlesubmit = (e) => {
        e.preventDefault();
        const empdata = { accid, sowid, accname, sowname, requestorname, priority, project, povtitle, description, valuedata, etavaluedata, currentdate, committeddata, status, updateddate, createdby, growthleader, selectedOption, otherText, content };
        let errors = {};
        console.log("priority - ",priority)
        if (!selectedOption) {
            errors.selectedOption = "Please select an poc/pov type option";
            toast.error("Please select an poc/pov type option", {
                autoClose: 1000,
                position: toast.POSITION.TOP_RIGHT
            });
            return false;
        }
        if (selectedOption === "other" && !otherText) {
            errors.otherText = "Please enter a value for 'Other'";
            toast.error("Please enter a value for 'Other'", {
                autoClose: 1000,
                position: toast.POSITION.TOP_RIGHT
            });
            return false;
        }
        console.log("accname - ",accname)
        if (accname === "") {
            errors.accname = "Please select an account";
            toast.error("Please select an account", {
                autoClose: 1000,
                position: toast.POSITION.TOP_RIGHT
            });
            return false;
        }
        if (sowname === "") {
            errors.sowname = "Please select a SOW";
            toast.error("Please select a SOW", {
                autoClose: 1000,
                position: toast.POSITION.TOP_RIGHT
            });
            return false;
        }
        if (!requestorname) {
            errors.requestorname = "Please enter a requestor name";
            toast.error("Please enter a requestor name", {
                autoClose: 1000,
                position: toast.POSITION.TOP_RIGHT
            });
            return false;
        }
        if (!growthleader) {
            errors.growthleader = "Please enter a growth leader name";
            toast.error("Please enter a growth leader name", {
                autoClose: 1000,
                position: toast.POSITION.TOP_RIGHT
            });
            return false;
        }
        if (priority === "") {
            errors.priority = "Please enter a priority";
            toast.error("Please enter a priority", {
                autoClose: 1000,
                position: toast.POSITION.TOP_RIGHT
            });
            return false;
        }
        if (project === "") {
            errors.project = "Please enter a project/funnel status";
            toast.error("Please enter a project/funnel status", {
                autoClose: 1000,
                position: toast.POSITION.TOP_RIGHT
            });
            return false;
        }
        if (etavaluedata === "") {
            errors.project = "Please select ETA date";
            toast.error("Please select ETA date", {
                autoClose: 1000,
                position: toast.POSITION.TOP_RIGHT
            });
            return false;
        }
        if (povtitle === "") {
            errors.project = "Please enter POV / POC Title";
            toast.error("Please enter POV / POC Title", {
                autoClose: 1000,
                position: toast.POSITION.TOP_RIGHT
            });
            return false;
        }
        if (description === "") {
            errors.project = "Please enter description";
            toast.error("Please enter description", {
                autoClose: 1000,
                position: toast.POSITION.TOP_RIGHT
            });
            return false;
        }
        console.log("errors - ",errors)
        // If there are errors, display them and prevent form submission
        if (Object.keys(errors).length > 0) {
            console.log("inside errors - ",errors)
            setFormErrors(errors);
            return;
        }else{

            const saveRevenueDetails = async () => {
                let form_details = {
                    "user_details": [
                        {
                            "EMAIL_ID": requestemail,
                            "USERNAME": requestorname
                        }
                    ],
                    "POC_DATA": [{
                        "UNIQUE_ID": "",
                        "ACCOUNT_ID": accid,
                        "ACCOUNT_NAME": accname,
                        "SOW_ID": sowid,
                        "SOW_NAME": sowname,
                        "REQUESTOR_ID": "",
                        "REQUESTOR_NAME": requestorname,
                        "FORM_TYPE_POC_POV": pocpovtype,
                        "GROWTH_LEADER_ID": "",
                        "GROWTH_LEADER_NAME": growthleader,
                        "PROJECT_FUNNEL": project,
                        "PRIORITY": priority,
                        "POV_POC_TITLE": povtitle,
                        "DESCRIPTION": description,
                        "PROJECT_VALUE": valuedata,
                        "ETA_COMPLETE_DATE": etavaluedata,
                        "COMMITTED_ETA": "",
                        "STATUS": status,
                        "CONTENT_AVAILABILITY": content,
                        "CREATED_BY": requestemail,
                        "CREATED_DATE": currentdate,
                        "UPDATED_BY": "",
                        "UPDATED_DATE": ""
                    }]
                };
                console.log("form_details - ", form_details)
                let data = await fetch("http://43.205.208.162:5009/add_new_poc", {
                    method: "POST",
                    body: JSON.stringify(form_details),
                }).then(response => response.json())
                    .then(result => {
                        // Handle the result
                        console.log(result);
                        toast.success(result.Message, {
                            autoClose: 1000,
                            position: toast.POSITION.TOP_RIGHT,
                            onClose: () => {
                                navigate('/');
                            }
                        });
                    })
                    .catch(error => {
                        // Handle errors
                        console.error(error);
                        toast.error("An error occurred.", {
                            autoClose: 1000,
                            position: toast.POSITION.TOP_RIGHT
                        });
                    });
            };
            saveRevenueDetails();
        }


    }

    const handleAccountChange = (event) => {
        const selectedAccountId = event.target.value;
        accIdchange(selectedAccountId);
        const selectedAccountData = accountdropdown.find(
            (account) => account.ACCOUNT_ID === selectedAccountId
        );
        console.log("selectedAccountData - ", selectedAccountData)
        accnamechange(selectedAccountData.ACCOUNT_NAME)
        setSowDatadropdown(selectedAccountData.SOW_DATA);
        console.log("sowdatadropdown - ", sowdatadropdown)
    };

    const handleSowChange = (event) => {
        const sowID = event.target.value;
        setSowid(sowID)
        const selectSowData = sowdatadropdown.find(
            (sow) => sow.SOW_ID === sowID
        );
        console.log("selectSowData - ", selectSowData.SOW_AMOUNT)
        setSowname(selectSowData.SOW_NAME)
        valuedatachange(selectSowData.SOW_AMOUNT);
    }

    const handlePriorityChange = (e) => {
        const priorityVal = e.target.value;
        prioritychange(priorityVal)
    }

    const handleProjectFunnelChange = (e) => {
        const projectFunnel = e.target.value;
        projectchange(projectFunnel)
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


    return (
        <div>
            <Header></Header>
            <br></br>
            <div className="create-div">
                <div className="offset-sm-2 col-lg-9 col-sm-6">
                    <form className="container create-form" onSubmit={Handlesubmit}>

                        <div className="card" style={{ "textAlign": "left", "padding": "10px 0px 0px 0px" }}>
                            <div className="card-title" style={{ "textAlign": "center" }}>
                                <h6>Create POC / POV Requestor Form</h6>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-8 col-sm-8">
                                        <div className="form-group" style={{"display":"flex", "flexDirection": "row", "alignItems": "center"}}>
                                            <input type="radio" name="option" value="POV" checked={selectedOption === "POV"} onChange={handleOptionChange} ></input>
                                            <label>&nbsp; POV </label>&nbsp;&nbsp;
                                            <input type="radio" name="option" value="POC" checked={selectedOption === "POC"} onChange={handleOptionChange} ></input>
                                            <label>&nbsp; POC </label>&nbsp;&nbsp;
                                            <input type="radio" name="option" value="other" checked={selectedOption === "other"} onChange={handleOptionChange} ></input>&nbsp;&nbsp;
                                            <label>Others : &nbsp; </label>
                                            <input type="text" name="otherText" value={otherText} className="custom-input" disabled={selectedOption !== "other"} onChange={handleOtherTextChange} ></input>
                                        </div>
                                    </div>
                                    <div className="col-sm-4 col-lg-4">
                                        <div style={{color: "red", fontSize: "10px", textAlign: "right"}}>*All fields are mandatory</div>
                                    </div>
                                    <br></br>
                                    <br></br>
                                    <div className="col-lg-12 id_class">
                                        <div className="form-group">
                                            <label>ID</label>
                                            <input value={id} disabled="disabled" className="form-control"></input>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-sm-4">
                                        <div className="form-group">
                                            <label>Account Name</label>
                                            <select id="account-data" className="form-select" onChange={handleAccountChange}>
                                                <option value="-1">Select Account</option>
                                                {accountdropdown.map((account) => (
                                                    <option key={account.ACCOUNT_ID} value={account.ACCOUNT_ID}>
                                                        {account.ACCOUNT_NAME}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-sm-4">
                                        <div className="form-group">
                                            <label>SOW Name</label>
                                            <select id="account-data" className="form-select" onChange={handleSowChange}>
                                                <option value="-1">Select SOW</option>
                                                {sowdatadropdown.map((sow) => (
                                                    <option key={sow.SOW_ID} value={sow.SOW_ID}>
                                                        {sow.SOW_NAME}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-sm-4">
                                        <div className="form-group">
                                            <label>Requestor Name</label>
                                            <input value={requestorname} list="requestor-name" placeholder="Requestor Name" onChange={e => requestornamechange(e.target.value)} className="form-control" disabled></input>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-sm-4">
                                        <div className="form-group">
                                            <label>Growth Leader Name</label>
                                            <input value={growthleader} list="growth-leader-name" placeholder="Growth Leader Name" onChange={e => setGrowthleader(e.target.value)} className="form-select"></input>
                                            <datalist id="growth-leader-name">
                                                <option value="Ram Mohanreddy">Ram Mohanreddy</option>
                                                <option value="Suresh S">Suresh S</option>
                                                <option value="Nitin Pandey">Nitin Pandey</option>
                                            </datalist>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-sm-4">
                                        <div className="form-group">
                                            <label>Priority</label>
                                            <select id="account-data" className="form-select" onChange={handlePriorityChange}>
                                                <option value="-1">Select priority</option>
                                                <option value="High">High</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Low">Low</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-sm-4">
                                        <div className="form-group">
                                            <label>Project / Funnel Status</label>
                                            <select id="account-data" className="form-select" onChange={handleProjectFunnelChange}>
                                                <option value="-1">Select Project/Funnel Status</option>
                                                <option value="Signed - Active">Signed - Active</option>
                                                <option value="Signed - Renewal">Signed - Renewal</option>
                                                <option value="Suspect - 0%">Suspect - 0%</option>
                                                <option value="Scout - 30%">Scout - 30%</option>
                                                <option value="Pre Qualified - 50%">Pre Qualified - 50%</option>
                                                <option value="Qualified - 70%">Qualified - 70%</option>
                                                <option value="Proposal - 80%">Proposal - 80%</option>
                                                <option value="Contract Pending - 90%">Contract Pending - 90%</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Value</label>
                                            <input value={valuedata} placeholder="Value" onChange={e => valuedatachange(e.target.value)} className="form-control" disabled></input>
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>ETA Date</label>
                                            {/* <input type="date" value={etavaluedata} placeholder="ETA Value" onChange={e => etavaluedatachange(e.target.value)} className="form-control"></input> */}
                                            <DatePicker className="form-control" value={etavaluedata} onChange={handleDateChange} />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <label>POV / POC Title</label>
                                            <input value={povtitle} placeholder="POV / POC Title" maxLength="100" onChange={e => povtitlechange(e.target.value)} className="form-control"></input>
                                        </div>
                                    </div>

                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea value={description} placeholder="Description" maxLength="300" onChange={e => descriptionchange(e.target.value)} className="form-control"></textarea>
                                        </div>
                                    </div>


                                    <br />
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <button className="btn btn-success btn-sm" type="submit">Save</button>
                                            <Link to="/" className="btn btn-danger btn-sm">Back</Link>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default PocCreate;