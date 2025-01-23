import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CtaButton, CommonInput } from './../../components';
import { Timer, WebLiveCapture } from './../../components';
import axios from 'axios';

import './exam.css';

const Exam = ({ examName = '', formLink = '' }) => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const [warningCnt, setWarningCnt] = useState(0);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [showMessage, setShowMessage] = useState('');
  const [registration_number, setRegistrationNumber] = useState(queryParams.get('registrationNumber'));
  const [duration, setDuration] = useState(0);
  const [studentEmail, setStudentEmail] = useState(queryParams.get('email'));
  const [test_code, setTestCode] = useState(queryParams.get('testCode'));
  const [name, setName] = useState(queryParams.get('name'));
  const [examDetails, setExamDetails] = useState({});
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isTerminated, setIsTerminated] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestEnded, setIsTestEnded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [peopleCount, setPeopleCount] = useState(0);
  const [phoneCount, setPhoneCount] = useState(0);


  const fetchExamDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/test-taker/${test_code}/${registration_number}`);
      const examData1 = response.data;
      if (examData1) {
        setDetails(examData1);
        setWarningCnt(examData1.warningCount);

        if (examData1.warningCount > 3) {
          terminateexam();
        }
      }
    } catch (error) {
      console.error('Error fetching test details:', error);
    }
  };

  useEffect(() => {
    if (test_code && registration_number) {
      fetchExamDetails();
    }
    setShowPopup(true);
  }, [test_code, registration_number]);

  const terminateexam = () => {
    terminateExam();
    setIsTerminated(true);
    alert('You have been terminated from the exam.');
    navigate('/');
  };

  const incrementWarningCount = () => {
    if (!isTestStarted) return;

    const newWarningCount = warningCnt + 1;
    setWarningCnt(newWarningCount + 1);

    if (newWarningCount > 3) {
        terminateExam();
    }
};

useEffect(() => {
    const updateWarningCount = async () => {
        if (warningCnt > 0) {  // Ensure warning count is valid before sending
            try {
                await axios.put(
                    `http://localhost:5000/api/test-taker/${test_code}/${registration_number}/warningCount`,
                    { warningCount: warningCnt }
                );
            } catch (error) {
                console.error('Error updating warning count:', error);
            }
        }
    };

    updateWarningCount();
}, [warningCnt]);

  const overlay = document.getElementById('overlay');
  const formBlur = document.getElementById('form-blur');
  const Oz = document.getElementById('oz');
  const yo = document.getElementById('yo');


  const toggleFullScreen = () => {
    const element = document.getElementById("main-container");
    const isFullScreenn = document.fullscreenElement;

    if (isFullScreenn) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
    else {
      element.requestFullscreen();
      setIsFullScreen(true);
    }
  };

  const closePopupAndEnterFullScreen = () => {
    toggleFullScreen();
    setShowPopup(false);
  };

  function check() {
    if (!document.fullscreenElement && isFullScreen && !isTerminated) {
      setIsFullScreen(false);
      incrementWarningCount();
      setShowMessage('Warning : Your exam will terminate. Please enable full-screen mode by clicking the full-screen button in the top-right corner.');
      disableForm();


    } else if (document.fullscreenElement && !isTerminated) {
      setIsFullScreen(true);
      enableForm();
      setShowMessage('');
    }
  }

  const disableForm = () => {
    if (overlay) {
      overlay.classList.remove('hide');
      overlay.classList.add('disable');
    }

    if (formBlur) {
      formBlur.classList.add('blur');
    }
  };

  const enableForm = () => {
    if (!isTerminated) {
      if (overlay) {
        overlay.classList.add('hide');
        overlay.classList.remove('disable');
      }

      if (formBlur) {
        formBlur.classList.remove('blur');
      }
    }
  };

  useEffect(() => {
    if (peopleCount > 1) {
      setShowMessage('Warning: Multiple people detected. Your exam will be terminated if this is not addressed.');
      disableForm();
      incrementWarningCount(); 
    } else if (peopleCount === 0) {
      setShowMessage('Warning: Your face is not visible. Your exam will be terminated if this is not addressed.');
      disableForm();
      incrementWarningCount();
    } else if (peopleCount === 1) {
      setShowMessage(''); 
      enableForm();
    }
    if (phoneCount > 0) {
      setShowMessage('Warning: Mobile phone detected. Your exam will be terminated if this is not addressed.');
      disableForm();
      setShowMessage('Warning: Mobile phone detected. Your exam will be terminated if this is not addressed.');
      disableForm();
      incrementWarningCount();
    }
  }, [peopleCount, phoneCount]);


  const handleCountsChange = (people, phones) => {
    setPeopleCount(people);
    setPhoneCount(phones);
  };


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEndTest = () => {
    setIsModalOpen(false);
    navigate('/');
  };


  useEffect(() => {
    const fetchAllTests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/all-tests');

        if (!response.ok) {
          throw new Error('Failed to fetch test details');
        }

        const data = await response.json();

        if (data && data.allTests && data.allTests.length > 0) {
          const test = data.allTests.find(test => test.test_code === test_code);

          if (test) {
            setExamDetails(test);

            const startTime = new Date(test.start_time);
            const endTime = new Date(test.end_time);

            const now = new Date();
            if (now >= startTime && now < endTime) {
              setIsTestStarted(true);

              const remainingDurationInMinutes = Math.floor((endTime - now + 30000) / 60000);
              setDuration(remainingDurationInMinutes > 0 ? remainingDurationInMinutes : 0);
            } else if (now >= endTime) {
              setIsTestStarted(false);
              setIsTestEnded(true);
            } else {
              const durationInMinutes = Math.floor((endTime - startTime) / 60000);
              setDuration(durationInMinutes);
            }
          } else {
            console.error('Test not found for testCode:', test_code);
          }
        } else {
          console.error('No tests found');
        }
      } catch (error) {
        console.error('Error fetching test details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (test_code) {
      fetchAllTests();
    }
  }, [test_code]);



  let isDevToolsOpenn = false;

  window.addEventListener('resize', () => {
    const threshold = 100;
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width < window.outerWidth - threshold || height < window.outerHeight - threshold) {
      if (!isDevToolsOpenn) {
        isDevToolsOpenn = true;
        incrementWarningCount();
        setIsDevToolsOpen(true);
        setShowMessage('Warning : Your exam will terminate. Please close devtools.');
        disableForm();
      }
    } else {
      if (isDevToolsOpenn) {
        isDevToolsOpenn = false;
        setShowMessage('');
        enableForm();
      }
    }
  });

  let timeoutId = null;

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && !isTerminated) {

      incrementWarningCount();

      setShowMessage('Warning : You moved away from the exam window. Repeated actions will lead to termination.');
      disableForm();

    } else if (document.visibilityState === 'visible' && !isTerminated) {

      setShowMessage('Warning : You moved away from the exam window. Repeated actions will lead to termination.');
      disableForm();

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        enableForm();
      }, 3000);
    }
  });


  const terminateExam = () => {
    if (overlay && formBlur && !isTerminated && Oz && yo) {
      setIsTerminated(true);
      disableForm();
      overlay.classList.add('terminate');
      Oz.classList.add('bl');
      yo.classList.remove('modif');

    }
  };

  setInterval(check, 5000);


  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date)) {
      console.error('Invalid date:', isoString);
      return 'Invalid date';
    }

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  if (!loading && !isTestStarted) {
    return (
      <div className="popup-overlay">
        <div className="popup-content">
          <h2 style={{ color: "rgb(184, 2, 2)" }}>{examDetails.test_name}</h2>
          <br />
          {new Date() >= new Date(examDetails.end_time) ? (
            <h3>The test has ended.</h3>
          ) : (
            <>
              <h3>The test has not started yet.</h3>
              <p>The test will start at: {formatDateTime(examDetails.start_time)}</p>
            </>
          )}
          <button onClick={() => navigate('/')}>Go Back</button>
        </div>
      </div>
    );
  }

  formLink += '?embedded=true';

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading...</div>
      </div>
    );
  }


  return (
    <div className="exam-container" id="main-container">
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Enter Full-Screen Mode</h2>
            <p>To start the test, please enter full-screen mode by clicking "OK".</p>
            <button onClick={closePopupAndEnterFullScreen}>OK</button>
          </div>
        </div>
      )}

      <div className="left-column">
        <div className="image-capture">
          <WebLiveCapture onPeopleCountChange={handleCountsChange} />
        </div>
        <div className="exam-details">
          <h3 className="title-heading">Student Details</h3>
          <div className="details">
            <h4 className="student-id"><b>Name: </b>{name}</h4>
            <h4 className="student-id"><b>Registration Number: </b>{registration_number}</h4>
            <h4 className="student-email"><b>Student Email: </b>{studentEmail}</h4>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "red", position: "relative", bottom: "20px", left: "10px", background: "#DFFF00", padding: "5px" }}> <b>Note:</b> Make sure to submit the exam form separately before ending the test</p>
          <CtaButton text="End Test" onClick={openModal} /> {/* Open the modal on button click */}
        </div>
      </div>

      <div className="embedded-form" >
        <div className="hide" id="overlay">.
          {document.getElementById('overlay')?.classList.contains('terminate') ? (
            <>
              <h1>Exam Terminated</h1>
              <h3>Please contact your organization/admin.</h3>
            </>
          ) : (
            <>
              <h2 style={{ textAlign: "center" }}>{showMessage}</h2>

            </>
          )}
        </div>

        <div className="form" id="form-blur" >
          <h2 className="title-heading">{examDetails.test_name}</h2>
          <iframe
            id='oz'
            title={examDetails.test_name}
            className="form-link"
            src={examDetails.test_link_by_user ? examDetails.test_link_by_user + '?embedded=true' : formLink}
          >
            Form
          </iframe>
          <div className='modif mod' id='yo' style={{ textAlign: "center", paddingTop: "360px" }}>
            <h1>Exam Terminated</h1>
            <h3>Please contact your organization/admin.</h3>
          </div>

          <div className="responsive-message">
            <h1>
              Please join via a Laptop/PC for best performance
            </h1>
          </div>
        </div>
      </div>

      <div>
        {!isFullScreen && (
          <button onClick={toggleFullScreen} style={{ padding: "10px", borderRadius: "10px", marginTop: "20px", marginLeft: "55px", background: "rgb(227, 66, 66)", color: "white" }}> <b>Full Screen</b> </button>
        )}
        <br />
        <div className="timer" style={{ marginTop: "20px" }}>
          <Timer initialMinute={duration} />
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" >
          <div className="modal-content">
            <h3>Are you sure you want to end the test?</h3>
            <p style={{ color: "red", background: "#DFFF00", padding: "5px" }}>(Make sure to submit the exam form separately before ending the test)</p>
            <button onClick={handleEndTest}>Yes</button>
            <button onClick={closeModal}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exam;
