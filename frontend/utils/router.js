const Home = {
    template : `<h1> this is home </h1>`
}
import Admindash from "../pages/Admindash.js";
import DisplayQuestionPage from "../pages/DisplayQuestionPage.js";
import DisplayQuizPage from "../pages/DisplayQuizPage.js";
import DisplayScoresPage from "../pages/DisplayScoresPage.js";
import DisplaySummaryPage from "../pages/DisplaySummaryPage.js";
import DisplaySubPage from "../pages/DisplaySubPage.js";
import LoginPage from "../pages/LoginPage.js";
import RegisterPage from "../pages/RegisterPage.js";
import StartQuizPage from "../pages/StartQuizPage.js";
import store from "./store.js";


const routes = [
    {path : '/', component : Home},
    {path : '/login', component : LoginPage},
    {path : '/register', component : RegisterPage},
    {path : '/admindash', component : Admindash ,meta : {requiresLogin : true}},
    {path : '/subs/:id', component : DisplaySubPage, props : true, meta : {requiresLogin : true}},
    {path : '/chaps/:id', component : DisplayQuizPage, props : true, meta : {requiresLogin : true, }},//role : "admin"
    {path : '/quiz/:id', component : DisplayQuestionPage, props : true, meta : {requiresLogin : true}},
    {path : '/summary', component : DisplaySummaryPage, props : true, meta : {requiresLogin : true}},
    {path : '/squiz/:id', component : StartQuizPage, props : true, meta : {requiresLogin : true}},
    {path : '/scores', component : DisplayScoresPage, props : true, meta : {requiresLogin : true}}
]
const router = new VueRouter({
    routes
})
export default router;

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresLogin)){
        if (!store.state.loggedIn){
            next({path : '/login'})
        } else if (to.meta.role && to.meta.role != store.state.role){
            alert('role not authorized')
            next({path : '/'})
        } else {
            next();
        }
    } else {
        next();
    }
})