<template>
    <div>
        <Button @click="$router.replace('/create_post')">Edit Post</Button>
        <div class="content-view" ref="contentContainer"></div>
    </div>

</template>

<script>
import { Button } from 'iview'
import { mapGetters } from 'vuex'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

export default {
    components: {
        Button
    },
    data: () => ({
        content: ''
    }),
    computed: {
        ...mapGetters(['delta'])
    },
    mounted () {
        let article = document.createElement('article')
        let quill = new Quill(article, {})
        quill.setContents(this.delta)
        setTimeout(() => { this.$refs.contentContainer.appendChild(article) }, 0)
    }
}
</script>

<style>

</style>
