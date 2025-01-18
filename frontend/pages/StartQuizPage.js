import Timer from "../components/Timer.js";
import UQuestionList from "../components/UQuestionList.js";

export default {
    props : ['id'],
    template : `
    <div>
        <h1>Quiz {{id}} </h1>
        <Timer :duration="duration" @time-up="handleTimeUp" />
        <UQuestionList v-if="questions[next]" @item-updated="handleItemUpdated"  :question="questions[next].question" :answer="questions[next].answer" :opt1="questions[next].opt1" :opt2="questions[next].opt2" :opt3="questions[next].opt3" :opt4="questions[next].opt4" :id="questions[next].id" :disable='!dis' />
        <button type="button" class="btn btn-primary" v-if="dis" @click="handleSubmit">
        Submit Test
        </button>
    </div>
    `,
    data(){
        return {
            questions : [],
            question : null,
            answer : null,
            opt1: null,
            opt2: null,
            opt3: null,
            opt4: null,
            next: 0,
            dis: false,
            score: 0,
        }
    },
    computed: {
        duration() {
            return this.$route.query.duration;
        },
    }, 
    methods : {
        async handleSubmit() {
            
            console.log(this.score)
            const res = await fetch(location.origin + '/api/score/' +this.id , {
                    method:'PUT',
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: this.$store.state.user_id,
                        score: this.score 
                    })
                });

            if (res.ok) {
                this.next=0;
                this.score = 0;
                this.$router.push('/admindash');
            } else {
                const errorData = await res.json();
                alert('Failed to add quiz: ' + (errorData.message || 'Unknown error'));
            }
        },
        async handleItemUpdated(selectedOption){
            console.log("here",selectedOption)
            if(this.questions[this.next].answer == selectedOption){
                this.score+=1
            }
            if(this.next<this.questions.length){
                this.next+=1      
                console.log("next",this.next)
            }
            if(this.next==this.questions.length){                
                this.dis=!this.dis
                console.log(this.dis)
            }
        },
        handleTimeUp() {
            alert("Time's up! Submitting your test.");
            this.handleSubmit();
        },

    },
    async mounted(){
         
        const res = await fetch(`${location.origin}/api/question/${this.id}`, {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })
        if (res.ok){
            this.questions = await res.json()
            if(this.next == this.questions.length-1){
                this.dis=!this.dis      
            }
        }
    },
    components:{
        UQuestionList,
        Timer
    }
}