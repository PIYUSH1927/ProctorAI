import React from 'react';
import Navbar from '../../components/navbar1/Navbar1';
import { CopyLink, PieChart } from '../../components';
import { useState, useEffect } from 'react';
import './status.css';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';


const Status = () => {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);

	const time = queryParams.get('start_time');
	const name = queryParams.get('test_name');
	const link = queryParams.get('test_code');

	const [terminatedStudents, setTerminatedStudents] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [testTakers, setTestTakers] = useState([]);

	useEffect(() => {
		const fetchTestTakers = async () => {
			try {
				const response = await axios.get('/api/test-takers');
				const allTestTakers = response.data.data;

				setTestTakers(allTestTakers.filter(student => student.testCode === link));

				const filteredStudents = allTestTakers
					.filter(
						(student) =>
							student.testCode === link && student.warningCount > 3
					);

				setTerminatedStudents(filteredStudents);
			} catch (error) {
				console.error('Error fetching test takers:', error);
			}
		};

		fetchTestTakers();
	}, []);

	const toggleModal = () => {
		setShowModal(!showModal);
	};


	const handleAllow = async (registrationNumber) => {
		try {
			await axios.put(`/api/test-taker/${link}/${registrationNumber}/warningCount`, {
				warningCount: 0,
			});

			setTerminatedStudents((prev) =>
				prev.filter((student) => student.registrationNumber !== registrationNumber)
			);
			window.location.reload();
		} catch (error) {
			console.error('Error updating warning count:', error);
		}
	};

	return (
		<div className="status-dashboard">

			<Navbar />

			<h1 className="title-heading" style={{ marginTop: '70px' }}>Test Dashboard</h1>

			<div className="test-details">
				<div className="test-item">
					<h4 className="test-time">{new Date(time).toLocaleString('en-GB', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric',
						hour: '2-digit',
						minute: '2-digit',
						hour12: true
					})}</h4>

					<h4 className="test-name">{name}</h4>

					<CopyLink link={link} />

					<button style={{
						padding: "10px 20px",
						border: "1px solid #007BFF",
						borderRadius: "5px",
						fontWeight: "bold",
						backgroundColor: "rgb(28, 123, 224)",
						color: "white",
						cursor: "pointer",
						textAlign: "center",
						textDecoration: "none",
						display: "inline-block",
						fontSize: "16px",
						transition: "background-color 0.3s, transform 0.3s",
					}}

						onClick={toggleModal}
					>

						Participants' List

					</button>

					{showModal && (
						<div
							style={{
								position: "fixed",
								top: "0",
								left: "0",
								width: "100%",
								height: "100%",
								backgroundColor: "rgba(0, 0, 0, 0.5)",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								zIndex: "100",
							}}
						>
							<div
								style={{
									backgroundColor: "white",
									padding: "30px",
									borderRadius: "8px",
									maxWidth: "700px",
									width: "100%",
									overflowY: "scroll",
									maxHeight: "79vh",
									boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
								}}
							>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										marginBottom: "20px",
									}}
								>
									<h2
										style={{
											textAlign: "center",
											color: "#FF6347",
											flex: 1,
										}}
									>
										All Participants
									</h2>
									<button
										onClick={toggleModal}
										style={{
											background: "red",
											color: "white",
											border: "none",
											padding: "5px 10px",
											borderRadius: "5px",
											cursor: "pointer",
										}}
									>
										Close
									</button>
								</div>

								<div style={{ overflowX: "auto" }}>
									<table
										style={{
											width: "100%",
											borderCollapse: "collapse",
											textAlign: "left",
											marginTop: "10px",
										}}
									>
										<thead>
											<tr>
												<th
													style={{
														padding: "10px",
														borderBottom: "1px solid #ddd",
														fontWeight: "bold",
														color: "#007BFF",
													}}
												>
													S.No
												</th>
												<th
													style={{
														padding: "10px",
														borderBottom: "1px solid #ddd",
														fontWeight: "bold",
														color: "#007BFF",
													}}
												>
													Name
												</th>
												<th
													style={{
														padding: "10px",
														borderBottom: "1px solid #ddd",
														fontWeight: "bold",
														color: "#007BFF",
													}}
												>
													Email
												</th>
												<th
													style={{
														padding: "10px",
														borderBottom: "1px solid #ddd",
														fontWeight: "bold",
														color: "#007BFF",
													}}
												>
													Registration Number
												</th>
											</tr>
										</thead>
										<tbody>
											{testTakers.map((testTaker, index) => (
												<tr key={index}>
													<td
														style={{
															padding: "10px",
															borderBottom: "1px solid #ddd",
														}}
													>
														{index + 1} {/* Serial No */}
													</td>
													<td
														style={{
															padding: "10px",
															borderBottom: "1px solid #ddd",
														}}
													>
														{testTaker.name}
													</td>
													<td
														style={{
															padding: "10px",
															borderBottom: "1px solid #ddd",
														}}
													>
														{testTaker.email}
													</td>
													<td
														style={{
															padding: "10px",
															borderBottom: "1px solid #ddd",
														}}
													>
														{testTaker.registrationNumber}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					)}


					<Link style={{ color: "red" }} to='/dashboard'><b>Go Back</b></Link>

				</div>
			</div>
			<div className="charts">
				<PieChart testCode={link} />
			</div>

			<div className="terminated-students">
				<h2 className="title-heading" style={{ position: "relative", top: "25px" }} >Students Terminated (Warnings &gt; 3) </h2>
				<div className="terminated-boxes" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: "medium" }}>

					{terminatedStudents.map((student) => (
						<div
							key={student.registrationNumber}
							style={{
								border: '1px solid red',
								borderRadius: '8px',
								padding: '15px',
								width: 'auto',
								boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
								textAlign: 'left',

							}}
						>
							<p style={{ paddingBottom: "10px" }}>
								<strong>Name:</strong> {student.name}
							</p>
							<p style={{ paddingBottom: "10px" }}>
								<strong>Registration Number:</strong> {student.registrationNumber}
							</p>
							<p style={{ paddingBottom: "10px" }}>
								<strong>Email:</strong> {student.email}
							</p>
							<button
								style={{
									backgroundColor: 'white',
									color: 'green',
									border: '1px solid black',
									borderRadius: '5px',
									padding: '5px 20px',
									cursor: 'pointer',
									marginTop: '10px',
									fontWeight: "bold",
									fontSize: "large",
									marginBottom: "0px"

								}}
								onClick={() => handleAllow(student.registrationNumber)}
							>
								Allow
							</button>
						</div>
					))}
				</div>

			</div>
		</div>
	);
};

export default Status;
