export default {
    template : `
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="login-container p-4 rounded shadow bg-white">
      <h3 class="text-center mb-4">Login</h3>
      
      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input id="email" type="email" class="form-control" placeholder="Enter email" required v-model="email">  
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password:</label>
        <input id="password" type="password" class="form-control" placeholder="Enter password" required v-model="password">
      </div>

      <p v-if="logg" class="text-danger text-center">Invalid Credentials, try again</p>

      <button class="btn btn-primary w-100" @click="submitLogin">Login</button>
    </div>
  </div>
    `,
    data(){
        return {
            email : null,
            password : null,
            logg:false,
        } 
    },
    methods : {
        async submitLogin(){
            const res = await fetch(location.origin+'/login', 
                {
                    method : 'POST', 
                    headers: {'Content-Type' : 'application/json'}, 
                    body : JSON.stringify({'email': this.email,'password': this.password})
                })
            if (res.ok){
                console.log('we are logged in')
                const data = await res.json()

                localStorage.setItem('user',JSON.stringify(data))
                console.log(localStorage.getItem('user'))
                this.$store.commit('setUser')
                this.logg =false;
                if (data.role === 'admin') {
                this.$router.push('/admindash'); // Admin dashboard
                } else {
                    this.$router.push('/admindash'); // User dashboard
                }
                
            }
            else{
                this.logg = true;
            }
        }
    }
}