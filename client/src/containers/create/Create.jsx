import React, { useState } from 'react';
import Navbar from '../../components/navbar1/Navbar1';
import { useNavigate } from 'react-router-dom';
import { CommonInput, CtaButton } from '../../components';
import { Link } from 'react-router-dom';
import './create.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { parse, format } from 'date-fns';

const inputField = [
    'Email ID',
    'Organization Name',
    'Test Name',
    'Exam Form Link',
    'Total Expected Candidates',
    'Duration (in minutes)',
];

const Create = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        organizationName: '',
        testName: '',
        questionPaperLink: '',
        totalCandidates: '',
        duration: '',
        startTime: '',
    });
    const [errorMessage, setErrorMessage] = useState(''); 
    const [showErrorModal, setShowErrorModal] = useState(false); 

    const handleChange = (index, value) => {
        const keys = [
            'email',
            'organizationName',
            'testName',
            'questionPaperLink',
            'totalCandidates',
            'duration',
        ];
        setFormData({ ...formData, [keys[index]]: value });
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, startTime: format(date, 'dd/MM/yyyy HH:mm') });
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        const token = localStorage.getItem('token');

        const durationInMinutes = parseInt(formData.duration, 10);
        if (isNaN(durationInMinutes) || durationInMinutes <= 0) {
            setErrorMessage('Duration should be a positive integer.');
            setShowErrorModal(true);
            return;
        }

        const startTimeParts = formData.startTime.split(' ');
        if (startTimeParts.length !== 2 || !/^\d{2}\/\d{2}\/\d{4}$/.test(startTimeParts[0]) || !/^\d{2}:\d{2}$/.test(startTimeParts[1])) {
            setErrorMessage('Start Date-Time format should be in the format like 01/01/2025 17:00');
            setShowErrorModal(true);
            return;
        }

        const [date, time] = formData.startTime.split(' '); 
        const [day, month, year] = date.split('/'); 
        const [hour, minute] = time.split(':'); 

        const startTime = new Date(`${month}/${day}/${year} ${hour}:${minute}:00`);


        const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);

        const formattedData = {
            email: formData.email,
            test_name: formData.testName,
            test_link_by_user: formData.questionPaperLink, 
            start_time: startTime.toISOString(), 
            end_time: endTime.toISOString(), 
            no_of_candidates_appear: formData.totalCandidates,
            total_threshold_warnings: 3 
        };

        try {
            const response = await axios.post('http://localhost:3000/api/create-test', formattedData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            console.log('Test created successfully:', response.data);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating test:', error.response ? error.response.data : error.message);
            setErrorMessage('Test creation failed. Please check the fields and try again.');
            setShowErrorModal(true);
        }
    };

    return (
        <div className="client-create">
            <Navbar />
            <div className="create-form" style={{ marginTop: '70px' }}>
                <div style={{ display: "flex" }}>
                    <h1 className="title-heading" style={{ textDecoration: 'underline' }}>
                        Create a test

                    </h1>
                    <b><Link style={{ color: "red", position: "absolute", right: "100px", top: "105px" }} to="/dashboard">Go back</Link></b>
                </div>

                <div className="input-fields" style={{ position: 'relative', left: '30px', width: '140%' }}>
                    {inputField.map((item, index) => (
                        <CommonInput
                            key={index}
                            placeholderText={item}
                            onChange={(e) => handleChange(index, e.target.value)}
                        />
                    ))}

                </div>
                <DatePicker

                    selected={formData.startTime ? parse(formData.startTime, 'dd/MM/yyyy HH:mm', new Date()) : null}
                    onChange={handleDateChange}
                    showTimeSelect
                    dateFormat="dd/MM/yyyy HH:mm"
                    timeIntervals={15}
                    placeholderText="Start Date-Time (DD/MM/YYYY HH:MM)"
                    minDate={new Date()}
                    className="custom-datepicker"
                />
                <div style={{ position: "relative", bottom: "20px", right: "20px" }}><CtaButton text="Create" onClick={handleSubmit} /></div>
            </div>

            {showErrorModal && (
                <div className="error-modal">
                    <div className="error-modal-content">
                        <h3>Test creation failed</h3>
                        <p>{errorMessage}</p>
                        <button onClick={() => setShowErrorModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Create;
