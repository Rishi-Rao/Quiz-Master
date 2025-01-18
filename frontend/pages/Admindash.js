import SubCard from "../components/SubCard.js"

export default {
    template :`
    <div class="p-4">
        <h1> Subject List 👌
        <button v-if="this.$store.state.role=='admin'" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addsubmodal">
            Add Sub
        </button></h1>
        <SubCard @item-updated="handleItemUpdated" v-for="sub in subs" :key="sub.id" :name="sub.name" :desc="sub.description" :sub_id="sub.id" />
    <!-- Modal -->
    <div v-if="this.$store.state.role=='admin'" class="modal fade" id="addsubmodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">x</button>
        </div>
        <div class="modal-body">
            Subject name:<input v-model="name" /><br>
            Subject description:<input v-model="desc" />
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="handleAddSub">Add</button>
        </div>
        </div>
    </div>
    </div>
    </div>
    `,
    data(){
        return {
            subs : [],
            name: null,
            desc: null,
        }
    },
    methods : {
        async handleAddSub(){
            if (this.name == null){
                alert("name cant be left empty");
                return
            }
            const res = await fetch(location.origin + '/api/subs', {
                method : 'POST',
                headers : {
                    'Authentication-Token' : this.$store.state.auth_token,
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({'name': this.name,'description': this.desc})

            })
            if (res.ok) {
                $('#addsubmodal').modal('hide');
                this.name = null;
                this.desc = null;
                const updatedSubs = await fetch(location.origin + '/api/subs', {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });
                this.subs = await updatedSubs.json();
            } else {
                alert('Failed to add subject');
            }
            
        },
        async handleItemUpdated(){
            const updatedSubs = await fetch(location.origin + '/api/subs', {
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token
                    }
                });
                this.subs = await updatedSubs.json();
        }
    },
    async mounted(){
        const res = await fetch(location.origin + '/api/subs', {
            headers : {
                'Authentication-Token' : this.$store.state.auth_token
            }
        })
        this.subs = await res.json()
    },
    components : {
        SubCard,
    }
}