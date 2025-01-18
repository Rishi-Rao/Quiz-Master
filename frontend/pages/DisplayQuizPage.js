import QuizList from "../components/QuizList.js";

export default {
    props : ['id'],
    template : `
    <div>
        <h1>{{subname}}
        <button v-if="this.$store.state.role=='admin'" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addquizmodal">
            Add Quiz
        </button></h1>
        <QuizList @item-updated="handleItemUpdated" v-for="chap in quizes" :key='chap.id' :doq="chap.doq" :duration="chap.duration" :remarks="chap.remarks" :id="chap.id" />
    <!-- Modal -->
    <div v-if="this.$store.state.role=='admin'" class="modal fade" id="addquizmodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">x</button>
        </div>
        <div class="modal-body">
            duration:<input placeholder="HH:MM:SS" v-model="duration" /><br>
            date of quiz description:<input type="date" v-model="doq" /><br>
            remarks:<input v-model="remarks" /><br>

        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="handleAddQuiz">Add</button>
        </div>
        </div>
    </div>
    </div>
    </div>
    `,
    data(){
        return {
            quizes : [],
            duration : null,
            doq: null,
            remarks: null
        }
    },
    computed: {
        subname() {
            return this.$route.query.chapname;
        },
    }, 
    methods : {
        async handleAddQuiz() {
            if (!this.duration || !this.doq) {
                alert("Duration and Date of Quiz are required!");
                return;
            }
            const res = await fetch(location.origin + '/api/quiz/'+this.id, {
                method: 'POST',
                headers: {
                    'Authentication-Token': this.$store.state.auth_token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( {
                doq: this.doq,
                duration: this.duration,
                remarks: this.remarks,
                chapter_id : this.id
            })
            });

            if (res.ok) {
                // Close the modal and reset fields
                $('#addquizmodal').modal('hide');
                this.duration = null;
                this.doq = null;
                this.remarks = null;

                // Fetch the updated list of quizzes
                const updatedSubs = await fetch(location.origin + '/api/quiz/' + this.id, {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });

                if (updatedSubs.ok) {
                    this.quizes = await updatedSubs.json();
                } else {
                    alert('Failed to fetch updated quiz list');
                }
            } else {
                const errorData = await res.json();
                alert('Failed to add quiz: ' + (errorData.message || 'Unknown error'));
            }
    },
    async handleItemUpdated(){
            const updatedSubs = await fetch(location.origin + '/api/quiz/'+this.id, {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });
                this.quizes = await updatedSubs.json();
        }

    },
    async mounted(){
        const res = await fetch(`${location.origin}/api/quiz/${this.id}`, {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })
        if (res.ok){
            this.quizes = await res.json()
            console.log(this.quizes);
        }
    },
    components:{
        QuizList,
    }
}