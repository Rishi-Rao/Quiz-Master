export default {
  props: {
    duration: {
      type: String,
      required: true,
    },
},
template: `
  <div>
    <h2>Time Remaining: {{ remainingTime }}</h2>
  </div>
`,
  data() {
    return {
      timeLeft: this.toSeconds(this.duration),
    };
  },
  computed: {
    remainingTime() {
      const hrs = Math.floor(this.timeLeft / 3600);
      const mins = Math.floor((this.timeLeft % 3600) / 60);
      const secs = this.timeLeft % 60;
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    },
  },
  methods: {
    toSeconds(duration) {
      const [hrs, mins, secs] = duration.split(':').map(Number);
      return hrs * 3600 + mins * 60 + secs;
    },
    startTimer() {
      this.timerInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft -= 1;
        } 
        else {
          this.$emit('time-up');
          clearInterval(this.timerInterval);
        }
      }, 1000);
    },
  },
  mounted() {
    this.startTimer();
  },
  beforeDestroy() {
    clearInterval(this.timerInterval);
  },
};
