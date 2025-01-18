import QuestionList from "../components/QuestionList.js";

export default {
    props : ['id'],
    template : `
    <div>
        <h1>Quiz {{id}}
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addqmodal">
            Add Question
        </button></h1>
        <QuestionList @item-updated="handleItemUpdated" v-for="chap in questions" :key='chap.id' :question="chap.question" :answer="chap.answer" :opt1="chap.opt1" :opt2="chap.opt2" :opt3="chap.opt3" :opt4="chap.opt4" :id="chap.id" />
    <!-- Modal -->
    <div class="modal fade" id="addqmodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">x</button>
        </div>
        <div class="modal-body">
            Question:<input v-model="question" /><br>
            opt1:<input v-model="opt1" /><br>
            opt2:<input v-model="opt2" /><br>
            opt3:<input v-model="opt3" /><br>
            opt4:<input v-model="opt4" /><br>
            Answer:<input v-model="answer" /><br>
            

        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="handleAddQuestion">Add</button>
        </div>
        </div>
    </div>
    </div>
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
        }
    },
    computed: {
        subname() {
            return this.$route.query.chapname;
        },
    }, 
    methods : {
        async handleAddQuestion() {
            if (!this.question || !this.answer || !this.opt1|| !this.opt2|| !this.opt3|| !this.opt4) {
                alert("Fields cant be left empty");
                return;
            }
            console.log(this.duration)
            const res = await fetch(location.origin + '/api/question/'+this.id, {
                method: 'POST',
                headers: {
                    'Authentication-Token': this.$store.state.auth_token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( {
                question: this.question,
                answer: this.answer,
                opt1: this.opt1,
                opt2 : this.opt2,
                opt3 : this.opt3,
                opt4 : this.opt4
            })
            });

            if (res.ok) {
                // Close the modal and reset fields
                $('#addqmodal').modal('hide');
                this.duration = null;
                this.doq = null;
                this.remarks = null;

                // Fetch the updated list of quizzes
                const updatedSubs = await fetch(location.origin + '/api/question/' + this.id, {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });

                if (updatedSubs.ok) {
                    this.questions = await updatedSubs.json();
                } else {
                    alert('Failed to fetch updated question list');
                }
            } else {
                const errorData = await res.json();
                alert('Failed to add quiz: ' + (errorData.message || 'Unknown error'));
            }
},
    async handleItemUpdated(){
            const updatedSubs = await fetch(location.origin + '/api/question/'+this.id, {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });
                if (updatedSubs.ok){
                    this.questions = await updatedSubs.json();
                }
                
        }

    },
    async mounted(){
        const res = await fetch(`${location.origin}/api/question/${this.id}`, {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })
        if (res.ok){
            this.questions = await res.json()
            console.log(this.questions);
        }
    },
    components:{
        QuestionList,
    }
}