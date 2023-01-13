import Navbar from "../../Navbar"
import StudentSidebar from "../../sidebar/StudentSidebar"
import '../../../css/achievement.css';
import { useState, useEffect, useContext } from "react";
import { AchievementContext } from "../../../helper/context";
import alertContext from '../../../context/alertContext';
import AddAchievementForm from "./AddAchievementForm";
import AchievementHead from "./AchievementHead";
import AchievementItem from "./AchievementItem";
import EditAchievementForm from "./EditAchievementForm";

const Achievement = () => {
    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;

    // Bootstrap Modal
    const [show, setShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [achievements, setAchievements] = useState([]);
    const [image, setImage] = useState('');
    const [eCredentials, setECredentials] = useState('');

    useEffect(() => {
        const getAchievement = async () => {
            const response = await fetch('http://localhost:5000/api/student/achievement/getachievement', {
                method: 'GET',
                headers: {
                    'auth-token': localStorage.getItem('token')
                },
            });
            const json = await response.json();
            setAchievements(json.achievement);
        }
        getAchievement();

        //eslint-disable-nextline
    }, []);


    const addAchievement = (achievement) => {
        setAchievements(achievements.concat(achievement))
    }

    const handleDelete = async (id) => {
        const response = await fetch('http://localhost:5000/api/student/achievement/deleteachievement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ id })
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

            let newAchievements = achievements.filter((achievement) => { return achievement._id !== id })
            setAchievements(newAchievements);
        }
    }

    const handleEdit = (currentAchievement) => {
        setEditShow(true);
        setECredentials({ competitionid: currentAchievement._id, competitionname: currentAchievement.competitionname, competitionlevel: currentAchievement.competitionlevel, competitiondesc: currentAchievement.competitiondesc })
        setImage(`http://localhost:5000/images/achievement_certificate/${currentAchievement.competitioncert}`);
    }

    const updateAchievement = (newAchievement) => {
        let currentAchievement = JSON.parse(JSON.stringify(achievements))

        for (let index = 0; index < currentAchievement.length; index++) {
            const element = currentAchievement[index]
            if (element._id === newAchievement._id) {
                currentAchievement[index].competitionname = newAchievement.competitionname
                currentAchievement[index].competitionlevel = newAchievement.competitionlevel
                currentAchievement[index].competitiondesc = newAchievement.competitiondesc
                currentAchievement[index].competitioncert = newAchievement.competitioncert
                setImage(`http://localhost:5000/images/achievement_certificate/${newAchievement.competitioncert}`);

            }
        }
        setAchievements(currentAchievement);
    }

    return (
        <>
            <AchievementContext.Provider value={{ show, setShow, addAchievement, handleDelete, editShow, setEditShow, image, setImage, eCredentials, setECredentials, updateAchievement }}>
                <Navbar />
                <StudentSidebar />
                <div className="container-fluid">
                    <div className='profile_container'>
                        <div className="sub_profile_container col-md-12 px-2 mt-2">

                            <AchievementHead />
                            <AddAchievementForm />
                            <EditAchievementForm />

                            <div className="all_achievement_container my-3">
                                {achievements.length !== 0 ? (
                                    <div className="row achievement_container">
                                        {achievements.map((achievement) => {
                                            return <AchievementItem key={achievement._id} handleEdit={handleEdit} achievement={achievement} />
                                        })}
                                    </div>
                                ) : (
                                    <div className="empty_achievement_container mt-5">
                                        You have not added any of your achievement
                                    </div>
                                )}
                            </div>


                        </div>
                    </div>
                </div>
            </AchievementContext.Provider>
        </>
    )
}

export default Achievement
