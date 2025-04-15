import ChapList from "../components/ChapList.js"

export default {
    props : ['id'],
    template : `
    <div>
        <h1>{{subname}}
        <button  v-if="this.$store.state.role=='admin'" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addchapmodal">
            Add Chapter
        </button></h1>
        <ChapList @item-updated="handleItemUpdated" v-for="chap in chaps" :key='chap.id' :name="chap.name" :desc="chap.description" :chap_id="chap.id" />
        <p v-if="chaps[0]==null">NO CHAPTERS TO DISPLAY!</p>
    
        <!-- Modal -->
    <div  v-if="this.$store.state.role=='admin'" class="modal fade" id="addchapmodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">x</button>
        </div>
        <div class="modal-body">
            Chapter name:<input v-model="name" /><br>
            Chapter description:<input v-model="desc" />
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="handleAddChap">Add</button>
        </div>
        </div>
    </div>
    </div>
    </div>
    `,
    data(){
        return {
            chaps : [],
            name : null,
            desc : null
        }
    },
    computed: {
        subname() {
            return this.$route.query.subname;
        },
    },
    methods : {
        async handleAddChap(){
            if (this.name == null){
                alert("name cant be left empty");
                return
            }
            const res = await fetch(location.origin + '/api/chaps', {
                method : 'POST',
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token,
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({'name': this.name,'description': this.desc,'sub_id':this.id})

            })
            if (res.ok) {
                $('#addsubmodal').modal('hide');
                this.name = null;
                this.desc = null;
                const updatedSubs = await fetch(location.origin + '/api/chaps/'+this.id, {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });
                this.chaps = await updatedSubs.json();
            } else {
                alert('Failed to add subject');
            }
            
        },
        async handleItemUpdated(){
            const updatedSubs = await fetch(location.origin + '/api/chaps/'+this.id, {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });
                this.chaps = await updatedSubs.json();
        }
    },
    async mounted(){
        this.subname = this.$route.params.subname
        const res = await fetch(`${location.origin}/api/chaps/${this.id}`, {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })
        if (res.ok){
            this.chaps = await res.json()
        }
    },
    components:{
        ChapList,
    }

}