import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SearchQnA = () => {
    const [credentials, setCredentials] = useState({ question: '' });
    const [results, setResults] = useState([]);
    const [notFound, setNotFound] = useState();

    const onChange = async (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        console.log(e.target.value);

        const response = await fetch('http://localhost:5000/api/qna/searchquestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ question: credentials.question })
        });
        const json = await response.json();
        if (json.length !== 0) {
            setResults(json);
        }else{
            setResults([]);
            setNotFound('No Question Found')
        }
    }

    return (
        <>
            <Form.Group className="" controlId="exampleForm.ControlInput1">
                <Form.Control type="text" placeholder="Search your question here..." name="question" onChange={onChange} value={credentials.question} autoComplete="off" />
            </Form.Group>

            <div className='search_container px-2'>
                <div className="search_result">
                    {results.length !== 0 ? (
                        <>
                            {results.map((result) => {
                                return <Link className="nav-link question_link" key={result._id} to={`${result._id}`} >
                                    {result.question}
                                </Link>
                            })}
                        </>
                    ) : (
                        <div>{notFound}</div>
                    )}
                </div>
            </div>
        </>
    )
}

export default SearchQnA