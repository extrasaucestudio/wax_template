<template>
  <Crafting />
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'IndexPage',
  layout: 'immersysapp',
  methods: {
    ...mapActions(['setPage']),
  },
  mounted() {
    this.setPage('crafting')
  },
}
</script>
