import React, { useEffect, useState } from 'react';
import { CtaButton } from './../../components';
import Navbar from '../../components/navbar1/Navbar1';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './dashboard.css';
import Cookies from 'js-cookie';
import { CopyLink } from '../../components';

const Dashboard = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = Cookies.get('token');
        const userId = Cookies.get('userId');

        if (!token || !userId) {
          console.error('Token or userId not found in cookies');
          setError(true);
          setLoading(false);
          return;
        }

        const response = await axios.get('https://proctorai2-1.onrender.com/api/all-created-test', {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            userId
          }
        });

        const sortedTests = (response.data._allTests || []).sort((a, b) => new Date(b.start_time) - new Date(a.start_time));


        setTests(sortedTests);
      } catch (error) {
        console.error("Error fetching tests:", error);
        setError(true);
        setTests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const deleteTest = async (testId) => {
    try {
      const token = Cookies.get('token');

      if (!token) {
        console.error('Token not found in cookies');
        return;
      }

      const response = await axios.delete(`https://proctorai2-1.onrender.com/api/tests/${testId}`, {

        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setTests((prevTests) => prevTests.filter((test) => test._id !== testId));
        window.location.reload();
      } else {
        console.error('Failed to delete test:', response);
      }
    } catch (error) {
      console.error("Error deleting test:", error);
      alert('Failed to delete test');
    }
  };

  return (
    <div className="section-type admin-dashboard">
      <Navbar />
      <h1 className="title-heading" style={{ marginTop: '65px' }}>Admin Dashboard</h1>
      <Link to="/create" >
        <CtaButton text="Create a test" />
      </Link>

      <div className="test-dashboard" style={{ position: "relative", bottom: "50px" }} >
        <h2 className="title-heading" style={{ position: "relative", textDecoration: "underline", left: "15px" }}>Previous Tests</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Failed to fetch tests</p>
        ) : tests.length === 0 ? (
          <p>No tests available</p>
        ) : (
          <div className="test-items">
            {tests.map((test) => (
              <div className="test-item" key={test._id}>
                <h4 className="test-time">
                  {new Date(test.start_time).toLocaleString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </h4>

                <h4 className="test-name">
                  <span>{test.test_name}</span>
                  <br />
                  <Link
                    to={{
                      pathname: '/status',
                      search: `?start_time=${encodeURIComponent(test.start_time)}&test_name=${encodeURIComponent(test.test_name)}&test_code=${encodeURIComponent(test.test_code)}`
                    }}
                    style={{ fontWeight: "lighter", color: "red" }}
                  >
                    <b>Check Status</b>
                  </Link>
                </h4>

                <CopyLink link={test.test_code} />

                <button style={{ padding: "5px 10px 5px 10px", borderRadius: "5px", background: "var(--color-terminate-bg)", marginBottom: "4px", fontWeight: "bold" }} onClick={() => deleteTest(test._id)}>Delete</button>
              </div>


            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
