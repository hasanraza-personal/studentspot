import { useContext, useState, useEffect } from 'react'
import alertContext from '../../context/alertContext'
import { NewsletterContext } from '../../helper/context'
import Navbar from '../Navbar'
import NewsletterSidebar from '../sidebar/NewsletterSidebar'
import AddNewsletterForm from './AddNewsletterForm'
import NewsletterHead from './NewsletterHead'
import NewsletterItem from './NewsletterItem'
import { useLocation } from 'react-router-dom'
import StudentSidebar from '../sidebar/StudentSidebar'

const Newsletter = () => {
    const location = useLocation()

    const context = useContext(alertContext);
    const { handleShow, setHeadText, setBodyText } = context;

    // Bootstrap Modal
    const [show, setShow] = useState(false);
    const [newsletters, setNewsletters] = useState([]);
    const [history, setHistory] = useState(location.state)

    useEffect(() => {
        const getNewsletter = async () => {
            const response = await fetch('http://localhost:5000/api/newsletter/getnewsletter', {
                method: 'GET',
                headers: {
                    'auth-token': localStorage.getItem('token')
                },
            });
            const json = await response.json();
            setNewsletters(json.newsletter);
        }
        getNewsletter();

        //eslint-disable-nextline
    }, []);

    const addNewsletter = (newsletter) => {
        setNewsletters(newsletters.concat(newsletter))
    }

    const handelDelete = async (id) => {
        const response = await fetch('http://localhost:5000/api/newsletter/deletenewsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ newsletterid: id })
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

            let newNewsletter = newsletters.filter((newsletter) => { return newsletter._id !== id })
            setNewsletters(newNewsletter);
        }
    }

    return (
        <>
            <NewsletterContext.Provider value={{ show, setShow, addNewsletter, handelDelete }}>
                <Navbar />
                {history === 'student' ? (
                    <StudentSidebar />
                ) : (
                    <NewsletterSidebar />
                )}

                <div className="container-fluid">
                    <div className='profile_container'>
                        <div className="sub_profile_container col-md-12 px-2 mt-2">

                            {history === 'student' ? (
                                <>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div className="profile_head_text">Your Newsletter</div>
                                    </div>
                                </>
                            ) : (
                                <NewsletterHead />
                            )}

                            <AddNewsletterForm />

                            <div className="all_achievement_container my-3">
                                {newsletters.length !== 0 ? (
                                    <div className="row achievement_container">
                                        {newsletters.map((newsletter) => {
                                            return <NewsletterItem key={newsletter._id} newsletter={newsletter} />
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
            </NewsletterContext.Provider>
        </>
    )
}

export default Newsletter