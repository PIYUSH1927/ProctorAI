import React, { useState ,useEffect} from 'react';
import Webcam from 'react-webcam';
import './weblivecapture.css';
import axios from 'axios';

const videoConstraints = {
	width: 1280,
	height: 720,
	facingMode: 'user'
};

const WebLiveCapture = ({ onPeopleCountChange }) => {
	const webcamRef = React.useRef(null);
	const [ image, setImage ] = useState('');
	const [peopleCount, setPeopleCount] = useState(0);
	const [phoneCount, setPhoneCount] = useState(0);


	const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);

        axios.post('http://localhost:8080/predict_people', { img: imageSrc })
            .then(response => {

				const newPeopleCount = response.data.people;
                const newPhoneCount = response.data.phones;

                
					setPeopleCount(newPeopleCount);
					setPhoneCount(newPhoneCount);

					onPeopleCountChange(newPeopleCount, newPhoneCount);
			
            })
            .catch(error => {
                console.error('Error predicting people:', error);
            });
    }, [onPeopleCountChange]);

	useEffect(() => {

		const interval = setInterval(() => {
			capture();
		}, 800); 


		return () => clearInterval(interval);
	},  [capture]);



	return (
		<React.Fragment>
			<Webcam
				audio={false}
				ref={webcamRef}
				screenshotFormat="image/jpeg"
				height={150}
				width={300}
				videoConstraints={videoConstraints}
			/>

		</React.Fragment>
	);
};

export default WebLiveCapture;
