export default {
    template : `
    <div>
        <input placeholder="email" required v-model="email"/>  
        <input placeholder="password" type='password' required v-model="password"/>  
        <input placeholder="name" required v-model="name"/>
        <select placeholder="qaulification" v-model="qualification" required>
            <option>Under Graduate</option>
            <option>Post Graduate</option>
            <option>PhD</option>
            <option>Diploma</option>
        </select>   
        <input placeholder="dob" type = "date" required v-model="dob"/>
        <button class='btn btn-primary' @click="submitLogin"> Register </button>
    </div>
    `,
    data(){
        return {
            email : null,
            password : null,
            name : null,
            qualification : null,
            dob : null,
        } 
    },
    methods : {
        async submitLogin(){
            const res = await fetch(location.origin+'/register', 
                {method : 'POST', 
                    headers: {'Content-Type' : 'application/json'}, 
                    body : JSON.stringify({'email': this.email,'password': this.password,'name' : this.name,'qualification' : this.qualification,'dob' : this.dob,})
                })
            if (res.ok){
                console.log('we are registered')
                this.$router.push('/login');
            }
        }
    }
}