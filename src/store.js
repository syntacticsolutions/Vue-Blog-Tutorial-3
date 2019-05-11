import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        delta: undefined,
        contents: ''
    },
    mutations: {
        setDelta (state, payload) {
            state.delta = payload
        },
        setContent (state, payload) {
            state.contents = payload
        }
    },
    getters: {
        delta: ({delta}) => delta,
        contents: ({contents}) => contents
    }
})

export default store