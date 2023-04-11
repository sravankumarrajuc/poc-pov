import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from './Header';


const PocEdit = () => {
    const { empid } = useParams();

    //const [empdata, empdatachange] = useState({});
    let tempDate = new Date();
    let date = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
    useEffect(() => {
        fetch("http://localhost:8000/poc/" + empid).then((res) => {
            return res.json();
        }).then((resp) => {
            console.log("resp - ", resp)
            idchange(resp.id);
            accnamechange(resp.accname);
            requestornamechange(resp.requestorname);
            povtitlechange(resp.povtitle);
            descriptionchange(resp.description);
            prioritychange(resp.priority);
            projectchange(resp.project);
            valuedatachange(resp.valuedata);
            etavaluedatachange(resp.etavaluedata);
            setPovCheck(resp.povCheck);
            setPocCheck(resp.pocCheck);
            setCurrentdate(resp.currentdate)
            setCommitteddata(resp.committeddata)
            setStatus(resp.status)
            setUpdateddate(date)
            setGrowthleader(resp.growthleader)
            setPocother(resp.pocother)
            setcontent(resp.content)
        }).catch((err) => {
            console.log(err.message);
        })
    }, []);

    const [id, idchange] = useState("");
    const [accname, accnamechange] = useState("");
    const [requestorname, requestornamechange] = useState("");
    const [povtitle, povtitlechange] = useState("");
    const [description, descriptionchange] = useState("");
    const [priority, prioritychange] = useState("");
    const [project, projectchange] = useState("");
    const [valuedata, valuedatachange] = useState("");
    const [etavaluedata, etavaluedatachange] = useState("");
    const [povCheck, setPovCheck] = useState(true);
    const [pocCheck, setPocCheck] = useState(true);
    const [validation, valchange] = useState(false);
    const [currentdate, setCurrentdate] = useState("");
    const [committeddata, setCommitteddata] = useState("");
    const [status, setStatus] = useState("");
    const [updateddate, setUpdateddate] = useState("");
    const [createdby, setCreatedby] = useState(localStorage.getItem("user-name"))
    const [growthleader, setGrowthleader] = useState("")
    const [pocother, setPocother] = useState("")
    const [content, setcontent] = useState("")

    const navigate = useNavigate();

    const handlesubmit = (e) => {
        e.preventDefault();
        const empdata = { accname, requestorname, povCheck, pocCheck, priority, project, povtitle, description, valuedata, etavaluedata, currentdate, committeddata, status, updateddate,createdby, growthleader,pocother,content};


        fetch("http://localhost:8000/poc/" + empid, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(empdata)
        }).then((res) => {
            alert('Saved successfully.')
            navigate('/');
        }).catch((err) => {
            console.log(err.message)
        })

    }
    return (
        <div className="container-fuild">
            <Header></Header>
            <div className="row">
                <div className="offset-sm-2 col-lg-9 col-sm-6">
                    <form className="container" onSubmit={handlesubmit}>

                        <div className="card" style={{ "textAlign": "left" }}>
                            <div className="card-title text-center">
                                <h4>POC / POV Request Form Edit</h4>
                            </div>
                            <div className="card-body" style={{paddingTop: '0px'}}>

                                <div className="row">

                                    <div className="col-lg-12 id_class">
                                        <div className="form-group">
                                            <label>ID</label>
                                            <input value={id} disabled="disabled" className="form-control"></input>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-sm-4">
                                        <div className="form-group">
                                            <label>Account Name</label>
                                            <input required value={accname} list="account-data" onMouseDown={e => valchange(true)} onChange={e => accnamechange(e.target.value)} className="form-control"></input>
                                            {accname.length == 0 && validation && <span className="text-danger">Enter the account name</span>}
                                            <datalist id="account-data">
                                                <option value="Disney">Disney</option>
                                                <option value="CVS">CVS</option>
                                                <option value="Maersk">Maersk</option>
                                                <option value="Anthem">Anthem</option>
                                                <option value="Macys">Macys</option>
                                                <option value="Albertsons">Albertsons</option>
                                                <option value="Lifelock">Lifelock</option>
                                                <option value="Baptist Health">Baptist Health</option>
                                                <option value="Riteaid">Riteaid</option>
                                                <option value="MHE">MHE</option>
                                                <option value="RSM">RSM</option>
                                                <option value="Shipt">Shipt</option>
                                                <option value="Hackerrank">Hackerrank</option>
                                            </datalist>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-sm-4">
                                        <div className="form-group">
                                            <label>Requestor Name</label>
                                            <input value={requestorname} list="requestor-name" onChange={e => requestornamechange(e.target.value)} className="form-control"></input>
                                            <datalist id="requestor-name">
                                                <option value="Ram Mohanreddy">Ram Mohanreddy</option>
                                                <option value="Aniruddha Ray">Aniruddha Ray</option>
                                                <option value="Nitin Pandey">Nitin Pandey</option>
                                            </datalist>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-sm-4">
                                        <div className="form-group">
                                            <label>Growth Leader Name</label>
                                            <input value={growthleader} list="growth-leader-name" placeholder="Growth Leader Name" onChange={e => setGrowthleader(e.target.value)} className="form-control"></input>
                                            <datalist id="growth-leader-name">
                                                <option value="Ram Mohanreddy">Ram Mohanreddy</option>
                                                <option value="Aniruddha Ray">Aniruddha Ray</option>
                                                <option value="Nitin Pandey">Nitin Pandey</option>
                                            </datalist>
                                        </div>
                                    </div>
                                    {/* <div className="col-lg-12">
                                        <div>
                                            <input checked={povCheck} onChange={e => setPovCheck(e.target.checked)} type="checkbox" className="form-check-input"></input>
                                            <label className="form-check-label">POV</label>
                                        </div>
                                        <div>
                                            <input checked={pocCheck} onChange={e => setPocCheck(e.target.checked)} type="checkbox" className="form-check-input"></input>
                                            <label className="form-check-label">POC</label>
                                        </div>
                                    </div> */}
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <input type="checkbox" value={povCheck} onChange={e => setPovCheck(e.target.checked)} ></input>
                                            <label>&nbsp; POV </label><br/>
                                            <input type="checkbox" value={pocCheck} onChange={e => setPocCheck(e.target.checked)} ></input>
                                            <label>&nbsp; POC </label><br/>
                                            <label>Others : &nbsp; </label>
                                            <input type="text"  value={pocother} onChange={e => setPocother(e.target.value)} ></input>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-sm-6">
                                        <div className="form-group">
                                            <label>Priority</label>
                                            <input value={priority} list="priority-list" onChange={e => prioritychange(e.target.value)} className="form-control"></input>
                                            <datalist id="priority-list">
                                                <option value="High">High</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Low">Low</option>
                                            </datalist>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-sm-6">
                                        <div className="form-group">
                                            <label>Project / Funnel Status</label>
                                            <input value={project} list="project-list" onChange={e => projectchange(e.target.value)} className="form-control"></input>
                                            <datalist id="project-list">
                                                <option value="Signed - Active">Signed - Active</option>
                                                <option value="Signed - Renewal">Signed - Renewal</option>
                                                <option value="Suspect - 0%">Suspect - 0%</option>
                                                <option value="Scout - 30%">Scout - 30%</option>
                                                <option value="Pre Qualified - 50%">Pre Qualified - 50%</option>
                                                <option value="Qualified - 70%">Qualified - 70%</option>
                                                <option value="Proposal - 80%">Proposal - 80%</option>
                                                <option value="Contract Pending - 90%">Contract Pending - 90%</option>
                                            </datalist>
                                        </div>
                                    </div>

                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <label>POV / POC Title</label>
                                            <input value={povtitle} onChange={e => povtitlechange(e.target.value)} className="form-control"></input>
                                        </div>
                                    </div>

                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea value={description} onChange={e => descriptionchange(e.target.value)} className="form-control"></textarea>
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Value</label>
                                            <input value={valuedata} onChange={e => valuedatachange(e.target.value)} className="form-control"></input>
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>ETA Date</label>
                                            <input type="date" value={etavaluedata} onChange={e => etavaluedatachange(e.target.value)} className="form-control"></input>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label>Committed ETA</label>
                                            <input type="date" value={committeddata} onChange={e => setCommitteddata(e.target.value)} className="form-control"></input>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label>Status</label>
                                            <input value={status} list="status-list" onChange={e => setStatus(e.target.value)} className="form-control"></input>
                                            <datalist id="status-list">
                                                <option value="Initiated">Initiated</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="On Hold">On Hold</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </datalist>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label>Content Availability</label>
                                            <input value={content} list="content-list" onChange={e => setcontent(e.target.value)} className="form-control"></input>
                                            <datalist id="content-list">
                                                <option value="Readily Available">Readily Available</option>
                                                <option value="Modifications Needed">Modifications Needed</option>
                                                <option value="New">New</option>
                                            </datalist>
                                        </div>
                                    </div>
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
        </div>
    );
}

export default PocEdit;