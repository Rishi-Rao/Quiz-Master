export default {
    template : `
<div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="register-container p-4 rounded shadow bg-white">
      <h3 class="text-center mb-4">Register</h3>

      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input id="email" type="email" class="form-control" placeholder="Enter email" v-model="email" required>
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password:</label>
        <input id="password" type="password" class="form-control" placeholder="Enter password" v-model="password" required>
      </div>

      <div class="mb-3">
        <label for="name" class="form-label">Name:</label>
        <input id="name" type="text" class="form-control" placeholder="Enter name" v-model="name" required>
      </div>

      <div class="mb-3">
        <label for="qualification" class="form-label">Qualification:</label>
        <select id="qualification" class="form-select" v-model="qualification" required>
          <option disabled value="">Select Qualification</option>
          <option>Under Graduate</option>
          <option>Post Graduate</option>
          <option>PhD</option>
          <option>Diploma</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="dob" class="form-label">Date of Birth:</label>
        <input id="dob" type="date" class="form-control" v-model="dob" required>
      </div>
    
      <p v-if="this.regg" class="text-danger text-center" >Credentials Already Exist</p>
      <button class="btn btn-primary w-100" @click="submitRegister">Register</button>
    </div>
  </div>
    `,
    data(){
        return {
            email : null,
            password : null,
            name : null,
            qualification : null,
            dob : null,
            regg:false,
        } 
    },
    methods : {
        async submitRegister(){
            const res = await fetch(location.origin+'/register', 
                {method : 'POST', 
                    headers: {'Content-Type' : 'application/json'}, 
                    body : JSON.stringify({'email': this.email,'password': this.password,'name' : this.name,'qualification' : this.qualification,'dob' : this.dob,})
                })
            if (res.ok){
                console.log('we are registered')
                this.$router.push('/login');
            }
            else{
                this.regg=true;
            }
        }
    }
}