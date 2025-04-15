export default {
    props: [],
    template: `
    <div>
        <table border="1" style="margin: auto; text-align: center; width: 80%;">
                <tr>
                    <th>#</th><th>Quiz ID</th><th>Score</th><th>Date</th><th>Time</th>
                </tr>
                <tr v-for="(score, index) in formattedScores" :key="index">
                    <td>{{ index + 1 }}</td><td>{{ score.quiz_id }}</td><td>{{ score.score }}</td><td>{{ score.date }}</td><td>{{ score.time }}</td>
                </tr>
        </table>
    </div>
    `,
    data() {
        return {
            scores: []
        };
    },
    computed: {
        formattedScores() {
            return this.scores.map(score => {
                const timestamp = new Date(score.timestamp); 
                const date = timestamp.toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                const time = timestamp.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                return {
                    ...score,
                    date,
                    time
                };
            });
        }
    },
    async mounted() {
        const res = await fetch(location.origin + '/api/score/' + this.$store.state.user_id, {
            headers: {
                'Authentication-Token': this.$store.state.auth_token,
            }
        });

        if (res.ok) {
            this.scores = await res.json();
        } else {
            const errorData = await res.json();
            alert('Failed to load scores: ' + (errorData.message || 'Unknown error'));
        }
    },
    components: {}
}
