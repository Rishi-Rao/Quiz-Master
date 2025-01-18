export default {
    props : ['name', 'desc','sub_id'],
    template : `
    <div class="jumbotron">
        <h2 v-if="this.$store.state.role=='admin'" @click="$router.push({ path: '/subs/' + sub_id, query: { subname: name }})">{{sub_id}} {{name}} </h2>
        <h2 v-if="this.$store.state.role=='user'" >{{sub_id}} {{name}} 
        </h2>
        <p> Description : {{desc}}</p>
        <hr>
        

        <div v-if="this.$store.state.role=='user'">
        <button type="button" class="btn btn-primary" @click="$router.push({ path: '/subs/' + sub_id, query: { subname: this.name }})">
        View
        </button>
        <button  type="button" class="btn btn-danger" v-if="subscribe" @click="handleSubscribe">
        Subscribe 🔔
        </button>

        <!-- Subscribed Button -->
        <button type="button" class="btn btn-success" v-else @click="handleSubscribe">
        Subscribed ✅
        </button>
        </div>
        <!-- Button trigger modal -->
        <div v-if="this.$store.state.role=='admin'">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-id="view" :data-bs-target="modalnum" @click="handleView">
        View
        </button>
        <button  type="button" class="btn btn-warning" data-bs-toggle="modal" data-id="view" :data-bs-target="modalnum" @click="handleEdit">
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
                            Subject id: <input type="text" name="SubId" :value="sub_id" :id="subId" disabled /><br>
                            Subject Name: <input type="text" name="SubName" :value="name" :id="subName" :disabled="!viewing" /><br>
                            Subject Description: <input type="text" name="SubDesc" :value="desc" :id="subDesc" :disabled="!viewing" />
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
            del : null,
            subscribe : null
        }
    },
    computed:{
        modalnum(){
            return '#exampleModal'+this.sub_id
        },
        modalnum1(){
            return 'exampleModal'+this.sub_id
        },
        subId(){
            return 'SubId'+this.sub_id
        },
        subName(){
            return 'SubName'+this.sub_id
        },
        subDesc(){
            return 'SubDesc'+this.sub_id
        },
        userRole() {
            return this.$store.state.role;
        }
    },
    methods : {
        async handleSubscribe(){
            this.subscribe = !this.subscribe
            const res = await fetch(`${location.origin}/api/subscribe/${this.$store.state.user_id}/${this.sub_id}`, {
                method: 'PUT',
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token
                }
            })
            
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
            const res = await fetch(`${location.origin}/api/subs/${this.sub_id}`, {
                method: 'PUT',
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token,
                    'Content-Type' : 'application/json'
                },
                body:JSON.stringify({
                    name : $('#SubName'+this.sub_id).val(),
                    description : $('#SubDesc'+this.sub_id).val()
                })
            })
            if (res.ok){
                $(this.modalnum).modal('hide')
                this.$emit('item-updated', this.sub_id);
            }

        },
        async handleDelChange(){
            const res = await fetch(`${location.origin}/api/subs/${this.sub_id}`, {
                method: 'DELETE',
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token
                }
            })
            if (res.ok){
                $(this.modalnum).modal('hide')
                this.$emit('item-updated', this.sub_id);
            }
        }
    },
    async mounted(){
        const res = await fetch(`${location.origin}/api/subscribe/${this.$store.state.user_id}/${this.sub_id}`, {
                method: 'GET',
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token
                }
            })
        if(res.ok){
            this.subscribe=false
        }
        else{
            this.subscribe=true
        }
    },

}