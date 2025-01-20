import React from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

export default class PieChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {
        labels: ['Terminated', 'Warnings > 2', 'Warnings > 1', 'Continuing/Completed'],
        datasets: [
          {
            label: 'Events',
            backgroundColor: ['#ef476f', '#ffd166', '#06d6a0', '#118ab2'],
            hoverBackgroundColor: ['#501800', '#4B5000', '#175000', '#003350'],
            data: [0, 0, 0, 0],
          },
        ],
      },
    };
  }

  componentDidMount() {
    this.fetchChartData();
  }

  async fetchChartData() {
    const { testCode } = this.props; 

    try {
      const response = await axios.get('/api/test-takers');
      const allTestTakers = response.data.data;

      const filteredTestTakers = allTestTakers.filter((student) => student.testCode === testCode);

      const terminated = filteredTestTakers.filter((student) => student.warningCount > 3).length;
      const warningOverTwo = filteredTestTakers.filter(
        (student) => student.warningCount > 2 && student.warningCount <= 3
      ).length;
      const warningOverOne = filteredTestTakers.filter(
        (student) => student.warningCount > 1 && student.warningCount <= 2
      ).length;
      const continuingCompleted = filteredTestTakers.filter((student) => student.warningCount <= 1).length;

      this.setState({
        chartData: {
          labels: ['Terminated', 'Warnings > 2', 'Warnings > 1', 'Continuing/Completed'],
          datasets: [
            {
              label: 'Events',
              backgroundColor: ['#ef476f', '#ffd166', '#06d6a0', '#118ab2'],
              hoverBackgroundColor: ['#501800', '#4B5000', '#175000', '#003350'],
              data: [terminated, warningOverTwo, warningOverOne, continuingCompleted],
            },
          ],
        },
      });
    } catch (error) {
      console.error('Error fetching test-takers:', error);
    }
  }

  render() {
    return (
      <div className="two-charts">
        <Pie
          data={this.state.chartData}
          options={{
            title: {
              display: true,
              text: 'Students with Warnings',
              fontSize: 20,
            },
            legend: {
              display: true,
              position: 'right',
            },
          }}
        />
      </div>
    );
  }
}
