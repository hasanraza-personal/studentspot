import Navbar from "../../Navbar";
import StudentSidebar from "../../sidebar/StudentSidebar";
import { useContext, useState, useEffect } from "react";
import { InternshipContext } from "../../../helper/context";
import InternshipHead from "./InternshipHead";
import AddInternshipForm from "./AddInternshipForm";
import alertContext from '../../../context/alertContext';
import InternshipItem from "./InternshipItem";
import EditInternshipForm from "./EditInternshipForm";

const Internship = () => {
    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;

    // Bootstrap Modal
    const [show, setShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [internships, setInternships] = useState([]);
    const [image, setImage] = useState('');
    const [eCredentials, setECredentials] = useState('');

    useEffect(() => {
        const getInternship = async () => {
            const response = await fetch('http://localhost:5000/api/student/internship/getinternship', {
                method: 'GET',
                headers: {
                    'auth-token': localStorage.getItem('token')
                },
            });
            const json = await response.json();
            setInternships(json.internship);
        }
        getInternship();

        //eslint-disable-nextline
    }, []);

    const addInternship = (internship) => {
        setInternships(internships.concat(internship))
    }

    const handleDelete = async (id) => {
        const response = await fetch('http://localhost:5000/api/student/internship/deleteinternship', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ internshipid: id })
        });
        const json = await response.json();

        // display modal when response received
        if (!json.success) {
            setHeadText('Warning');
            setBodyText(json.error);
            handleShow();
        } else {
            setHeadText('Success');
            setBodyText(json.msg);
            handleShow();

            let newInternships = internships.filter((internship) => { return internship._id !== id })
            setInternships(newInternships);
        }
    }

    const handleEdit = (currentInternship) => {
        setEditShow(true);
        setECredentials({ internshipid: currentInternship._id, companyname: currentInternship.companyname, workduration: currentInternship.workduration, stipends: currentInternship.stipends, languages: currentInternship.languages, workdesc: currentInternship.workdesc })
        setImage(`http://localhost:5000/images/internship_certificate/${currentInternship.internshipcert}`);
    }

    const updateInternship = (newInternship) => {
        let currentInternship = JSON.parse(JSON.stringify(internships));

        for (let index = 0; index < currentInternship.length; index++) {
            const element = currentInternship[index]
            if (element._id === newInternship._id) {
                currentInternship[index].companyname = newInternship.companyname
                currentInternship[index].workduration = newInternship.workduration
                currentInternship[index].stipends = newInternship.stipends
                currentInternship[index].languages = newInternship.languages
                currentInternship[index].workdesc = newInternship.workdesc
                currentInternship[index].internshipcert = newInternship.internshipcert
                setImage(`http://localhost:5000/images/internship_certificate/${newInternship.internshipcert}`);

            }
        }
        setInternships(currentInternship);
    }

    return (
        <>
            <InternshipContext.Provider value={{ show, setShow, addInternship, handleDelete, editShow, setEditShow, image, setImage, eCredentials, setECredentials, updateInternship }}>
                <Navbar />
                <StudentSidebar />
                <div className="container-fluid">
                    <div className='profile_container'>
                        <div className="sub_profile_container col-md-12 px-2 mt-2">

                            <InternshipHead />
                            <AddInternshipForm />
                            <EditInternshipForm />

                            <div className="all_achievement_container my-3">
                                {internships.length !== 0 ? (
                                    <div className="row achievement_container">
                                        {internships.map((internship) => {
                                            return <InternshipItem key={internship._id} handleEdit={handleEdit} internship={internship} />
                                        })}
                                    </div>
                                ) : (
                                    <div className="empty_achievement_container mt-5">
                                        You have not added any of your Internship
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </InternshipContext.Provider>
        </>
    )
}

export default Internship
