export default {
  props: [],
  template: `
    <div id="quiz-summary-content1">>
      <h1>Quiz Summary</h1>
      <div style="width: 80%; margin: auto;">
        <canvas id="quizSummaryChart"></canvas>
      </div>
      <div style="margin: 20px auto; width: 80%; text-align: center;" id="quiz-summary-content">
        <h2>Daily Score Summary</h2>
        <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; margin: 20px 0;">
            <tr>
              <th>Quiz</th>
              <th v-if="usertype=='admin'">User ID</th>
              <th>Score</th>
            </tr>
            <tr v-for="(score, index) in dailyData" :key="index">
              <td>Quiz {{ index + 1 }}</td>
              <td v-if="usertype=='admin'">{{ score.user_id }}</td> 
              <td>{{ score.score }} points</td>
            </tr>
        </table>

        <h2>Weekly Score Summary</h2>
        <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; margin: 20px 0;">
            <tr>
              <th>Quiz</th>
              <th v-if="usertype=='admin'" >User ID</th>
              <th>Score</th>
            </tr>
            <tr v-for="(score, index) in weeklyData" :key="index">
              <td>Quiz {{ index + 1 }}</td>
              <td v-if="usertype=='admin'">{{ score.user_id }}</td> 
              <td>{{ score.score }} points</td>
            </tr>
        </table>

        <h2>Monthly Score Summary</h2>
        <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; margin: 20px 0;">
            <tr>
              <th>Quiz</th>
              <th v-if="usertype=='admin'">User ID</th>
              <th>Score</th>
            </tr>
            <tr v-for="(score, index) in monthlyData" :key="index">
              <td>Quiz {{ index + 1 }}</td>
              <td v-if="usertype=='admin'">{{ score.user_id }}</td> 
              <td>{{ score.score }} points</td>
            </tr>
        </table>
      </div>
      <button @click="generatePDF">Download PDF</button>
    </div>
  `,

  data() {
    return {
      scores: [],
      dailyData: [],
      weeklyData: [],
      monthlyData: [],
      chartData: {},
      usertype: this.$store.state.role,
      user_id:this.$store.state.user_id
    };
  },

  methods: {
    async fetchScores() {
      const res = await fetch(location.origin + '/api/score/' + this.$store.state.user_id, {
        headers: {
          'Authentication-Token': this.$store.state.auth_token,
        }
      });

      if (res.ok) {
        this.scores = await res.json();
        this.processStats();
      } else {
        const errorData = await res.json();
        alert('Failed to load scores: ' + (errorData.message || 'Unknown error'));
      }
    },
    processStats() {
        const today = new Date();
        const dayStart = new Date(today.setHours(0, 0, 0, 0));
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const yearStart = new Date(today.getFullYear(), 0, 1); 

        const dailyScores = [];
        const weeklyScores = [];
        const monthlyScores = [];
        const yearlyScores = [];

        this.scores.forEach(score => {
            const timestamp = new Date(score.timestamp);
            // console.log(timestamp, dayStart, weekStart, monthStart, yearStart);

            if (timestamp >= dayStart) dailyScores.push(score);
            if (timestamp >= weekStart) weeklyScores.push(score);
            if (timestamp >= monthStart) monthlyScores.push(score);
            if (timestamp >= yearStart) yearlyScores.push(score);
        });

        this.dailyData = dailyScores;
        this.weeklyData = weeklyScores;
        this.monthlyData = monthlyScores;
        this.yearlyData = yearlyScores;

        this.chartData = {
            labels: ['Year', 'Month', 'Week', 'Day'], 
            datasets: [{
            label: 'Number of Quizzes Taken',
            data: [yearlyScores.length, monthlyScores.length, weeklyScores.length, dailyScores.length],
            borderColor: '#42A5F5',
            backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'],
            fill: false,
            }]
        };

        this.renderChart();
    },   

    renderChart() {
      const ctx = document.getElementById('quizSummaryChart').getContext('2d');
      
      if (window.myChart) {
        window.myChart.destroy();
      }
      
      window.myChart = new Chart(ctx, {
        type: 'bar',
        data: this.chartData,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Quiz Summary'
            },
            tooltip: {
              mode: 'index',
              intersect: false
            },
            legend: {
              display: true
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time Period'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Number of Quizzes'
              },
              beginAtZero: true
            }
          }
        }
      });
    },

    async generatePDF() {
      const element = document.getElementById("quiz-summary-content1");
      
      const pdf = html2pdf().from(element).toPdf();    
      const pdfDoc = await pdf.get('pdf'); 
      const pdfBlob = pdfDoc.output('blob');
      
      const formData = new FormData();
      formData.append('pdf', pdfBlob, 'quiz-summary.pdf');
      console.log(this.user_id)
      fetch('/upload-pdf/'+this.user_id, {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('PDF uploaded and email sent!');
          } else {
            alert('Error uploading PDF.');
          }
        })
        .catch(error => {
          console.error('Error uploading PDF:', error);
        });
    }
  },

  async mounted() {
    await this.fetchScores();
  },
};
