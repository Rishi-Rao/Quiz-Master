export default {
    props : ['id','question','answer','opt1','opt2','opt3','opt4'],
    template : `
   <div class="jumbotron">
        <h2>{{id}} {{question}} </h2>
        <p > option 1 : {{opt1}}</p>
        <p > option 2 : {{opt2}}</p>
        <p > option 3 : {{opt3}}</p>
        <p > option 4 : {{opt4}}</p>
        <hr>
        <p>Answer : {{answer}} </p>
        <!-- Button trigger modal -->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-id="view" :data-bs-target="modalnum" @click="handleView">
        View
        </button>
        <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-id="view" :data-bs-target="modalnum" @click="handleEdit">
        Edit
        </button>
        <button type="button" class="btn btn-danger"  data-bs-toggle="modal" :data-bs-target="modalnum" @click="handleDel">
        Delete
        </button>

        <!-- Modal for existing subs-->
        <div class="modal fade" :id="modalnum1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">x</button>
                    </div>
                    <div class="modal-body">
                            Question id: <input type="text" name="SubId" :value="id" :id="subId" disabled /><br>
                            Question: <input type="text" name="SubQuestion" :value="question" :id="subQuestion" :disabled="!viewing" /><br>
                            Option 1 : <input type="text" name="SubOpt" :value="opt1" :id="SubOpt1" :disabled="!viewing" /><br>
                            Option 2 : <input type="text" name="SubOpt" :value="opt2" :id="SubOpt2" :disabled="!viewing" /><br>
                            Option 3 : <input type="text" name="SubOpt" :value="opt3" :id="SubOpt3" :disabled="!viewing" /><br>
                            Option 4 : <input type="text" name="SubOpt" :value="opt4" :id="SubOpt4" :disabled="!viewing" /><br>
                            <hr>
                            Answer: <input type="text" name="SubAns" :value="answer" :id="subAns" :disabled="!viewing" /><br>
                    </div>
                    <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" v-if="viewing" class="btn btn-primary" @click="handleQuestionChange">Save changes</button>
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
    computed:{
        modalnum(){
            return '#exampleModal'+this.id
        },
        modalnum1(){
            return 'exampleModal'+this.id
        },
        subId(){
            return 'SubId'+this.id
        },
        subQuestion(){
            return 'SubQuestion'+this.id
        },
        subAns(){
            return 'SubAns'+this.id
        },
        SubOpt1(){
            return 'SubOpt1'+this.id
        },
        SubOpt2(){
            return 'SubOpt2'+this.id
        },
        SubOpt3(){
            return 'SubOpt3'+this.id
        },
        SubOpt4(){
            return 'SubOpt4'+this.id
        }
    },
    methods : {
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
        async handleQuestionChange(){
            const res = await fetch(`${location.origin}/api/question/${this.id}`, {
                method: 'PUT',
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token,
                    'Content-Type' : 'application/json'
                },
                body:JSON.stringify({
                    question: $('#SubQuestion'+this.id).val(),
                    answer: $('#SubAns'+this.id).val(),
                    opt1: $('#SubOpt1'+this.id).val(),
                    opt2 : $('#SubOpt2'+this.id).val(),
                    opt3 : $('#SubOpt3'+this.id).val(),
                    opt4 : $('#SubOpt4'+this.id).val()
                })
            })
            if (res.ok){
                $(this.modalnum).modal('hide')
                this.$emit('item-updated');
            }

        },
        async handleDelChange(){
            const res = await fetch(`${location.origin}/api/question/${this.id}`, {
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
