export default {
    props : ['id','question','answer','opt1','opt2','opt3','opt4','disable'],
    template : `
   <div class="jumbotron">
        <h2>{{id}} {{question}} </h2>
        <input type="radio" name="option" :value="opt1" v-model="selectedOption" /> {{opt1}}<br>
        <input type="radio" name="option" :value="opt2" v-model="selectedOption" /> {{opt2}}<br>
        <input type="radio" name="option" :value="opt3" v-model="selectedOption" /> {{opt3}}<br>
        <input type="radio" name="option" :value="opt4" v-model="selectedOption" /> {{opt4}}<br>
        <hr>
        <button type="button" class="btn btn-primary" v-if="disable" @click ="checkOption">
        Submit and next
        </button>
    </div>
    `,
    data(){
        return{
            selectedOption : null,
        }
    },
    computed:{

    },
    methods : {
        checkOption(){
            this.$emit('item-updated',this.selectedOption)
        }
    },
    async mounted()
    {
        this.score = this.scor
    }
}
