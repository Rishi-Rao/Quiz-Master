export default {
    props : ['id','doq','duration','remarks'],
    template : `
   <div class="jumbotron">
        <h2 v-if="this.$store.state.role=='admin'" @click="$router.push({ path: '/quiz/'+ id})" >{{id}} {{DOQ}} </h2>
        <h2 v-if="this.$store.state.role=='user'">{{id}} {{DOQ}} </h2>
        <p> Duration : {{duration}}</p>
        <hr>
        <p v-if="this.remarks!=null">Remarks: {{remarks}}</p>
        <button type="button" class="btn btn-primary" v-if="this.$store.state.role=='user'" @click="handleStartQuiz">
        Start Quiz
        </button>
        <!-- Button trigger modal -->
        <div v-if="this.$store.state.role=='admin'">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-id="view" :data-bs-target="modalnum" @click="handleView">
        View
        </button>
        <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-id="view" :data-bs-target="modalnum" @click="handleEdit">
        Edit
        </button>
        <button type="button" class="btn btn-danger"  data-bs-toggle="modal" :data-bs-target="modalnum" @click="handleDel">
        Delete
        </button>
        </div>

        <!-- Modal for existing subs-->
        <div class="modal fade" :id="modalnum1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">x</button>
                    </div>
                    <div class="modal-body">
                            Quiz id: <input type="text" name="SubId" :value="id" :id="subId" disabled /><br>
                            Quiz DOQ: <input type="date" name="SubName" :value="DOQ2" :id="subName" :disabled="!viewing" /><br>
                            Quiz Duration: <input type="text" name="SubDesc" :value="duration" :id="subDuration" :disabled="!viewing" /><br>
                            Quiz remarks: <input type="text" name="SubDesc" :value="remarks" :id="subDesc" :disabled="!viewing" />
                    </div>
                    <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" v-if="viewing" class="btn btn-primary" @click="handleSubChange">Save changes</button>
                            <button type="button" v-if="del" class="btn btn-danger" @click="handleDelChange">Delete</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
    `,
    data(){
        return{
            viewing : null,
            del : null
        }
    },
    computed :{
        DOQ() {
            const date = new Date(this.doq);
            const options = { 
                weekday: 'short', 
                day: '2-digit',   
                month: 'short',   
                year: 'numeric'   
            };
            const formattedDate = date.toLocaleDateString('en-US', options); 
            return formattedDate;
        },
        DOQ2() {
            const date = new Date(this.doq);
            const formattedDate = date.toISOString().split('T')[0]; // Get the date in yyyy-mm-dd format
            return formattedDate;
        },
        modalnum(){
            return '#exampleModal'+this.id
        },
        modalnum1(){
            return 'exampleModal'+this.id
        },
        subId(){
            return 'SubId'+this.id
        },
        subName(){
            return 'SubName'+this.id
        },
        subDuration(){
            return 'SubDuration'+this.id
        },
        subDesc(){
            return 'SubDesc'+this.id
        }
    },
    methods : {
        handleStartQuiz(){
            this.$router.push({ path: '/squiz/'+ this.id ,query: {duration: this.duration}})
            return;
        },
        handleView(){
            this.viewing = false,
            this.del = false
        },
        handleEdit(){
            this.viewing = true,
            this.del = false
        },
        handleDel(){
            // alert("Are you sure you want to delete"+this.sub_id);
            this.viewing = false,
            this.del = true
        },
        async handleSubChange(){
            console.log($('#SubName'+this.id).val(),
                $('#SubDuration'+this.id).val(),
                $('#SubDesc'+this.id).val())
            const res = await fetch(`${location.origin}/api/quiz/${this.id}`, {
                method: 'PUT',
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token,
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify( {
                doq: $('#SubName'+this.id).val(),
                duration: $('#SubDuration'+this.id).val(),
                remarks: $('#SubDesc'+this.id).val(),
            })
            })
            if (res.ok){
                $(this.modalnum).modal('hide')
                this.$emit('item-updated');
            }

        },
        async handleDelChange(){
            const res = await fetch(`${location.origin}/api/quiz/${this.id}`, {
                method: 'DELETE',
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token
                }
            })
            if (res.ok){
                $(this.modalnum).modal('hide')
                this.$emit('item-updated');
            }
        }
    },
}