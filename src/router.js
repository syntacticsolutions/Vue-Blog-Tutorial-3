const Vue = require("vue");
const VueRouter = require("vue-router");
Vue.use(VueRouter);

function load(component) {
  // '@' is aliased to src/components
  return () => import(`./components/${component}.vue`);
}
const config = {
    routes: [
        { path: '/create_post', component: load('BlogPostCreator') },
        { path: '/preview', component: load('BlogPostView') }
    ]
}

const router = new VueRouter(config)

module.exports = router