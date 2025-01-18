export default {
    props : ['chap_id','name','desc'],
    template : `
   <div class="jumbotron">
        <h2 v-if="this.$store.state.role=='admin'" @click="$router.push({ path: '/chaps/'+ chap_id , query: { chapname: name }})">{{chap_id}} {{name}} </h2>
        <h2 v-if="this.$store.state.role=='user'" >{{chap_id}} {{name}} </h2>
        <p v-if="this.desc!=null"> Description : {{desc}}</p>
        <hr>
        <button v-if="this.$store.state.role=='user'" type="button" class="btn btn-primary"@click="$router.push({ path: '/chaps/'+ chap_id , query: { chapname: name }})">
        View
        </button>
        <!-- Button trigger modal -->
        <div v-if="this.$store.state.role=='admin'" >
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
                            Chapter id: <input type="text" name="SubId" :value="chap_id" :id="subId" disabled /><br>
                            Chapter Name: <input type="text" name="SubName" :value="name" :id="subName" :disabled="!viewing" /><br>
                            Chapter Description: <input type="text" name="SubDesc" :value="desc" :id="subDesc" :disabled="!viewing" />
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
    computed:{
        modalnum(){
            return '#exampleModal'+this.chap_id
        },
        modalnum1(){
            return 'exampleModal'+this.chap_id
        },
        subId(){
            return 'SubId'+this.chap_id
        },
        subName(){
            return 'SubName'+this.chap_id
        },
        subDesc(){
            return 'SubDesc'+this.chap_id
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
        async handleSubChange(){
            const res = await fetch(`${location.origin}/api/chaps/${this.chap_id}`, {
                method: 'PUT',
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token,
                    'Content-Type' : 'application/json'
                },
                body:JSON.stringify({
                    name : $('#SubName'+this.chap_id).val(),
                    description : $('#SubDesc'+this.chap_id).val()
                })
            })
            if (res.ok){
                $(this.modalnum).modal('hide')
                this.$emit('item-updated');
            }

        },
        async handleDelChange(){
            const res = await fetch(`${location.origin}/api/chaps/${this.chap_id}`, {
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
