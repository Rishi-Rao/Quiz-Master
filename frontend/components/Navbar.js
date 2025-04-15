export default {
    template :`
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
    <div class="container-fluid">
      
      <router-link to="/" class="navbar-brand">MyApp</router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">

          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item" v-if="!$store.state.loggedIn">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
          <li class="nav-item" v-if="!$store.state.loggedIn">
            <router-link to="/register" class="nav-link">Register</router-link>
          </li>
          <li class="nav-item" v-if="$store.state.loggedIn">
            <router-link to="/admindash" class="nav-link">Dashboard</router-link>
          </li>
          <li class="nav-item" v-if="$store.state.loggedIn && $store.state.role === 'user'">
            <router-link to="/scores" class="nav-link">Scores</router-link>
          </li>
          <li class="nav-item" v-if="$store.state.loggedIn">
            <router-link to="/summary" class="nav-link">Summary</router-link>
          </li>

          <li class="nav-item" v-if="$store.state.loggedIn">
            <button 
              class="btn btn-outline-secondary ms-2" 
              @click="$store.commit('logout'); $router.push('/login')">
              Logout
            </button>
          </li>

        </ul>
      </div>

    </div>
  </nav>
    `
}