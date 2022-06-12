<template>
  <Shop />
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'ShopPage',
  layout: 'immersysapp',
  methods: {
    ...mapActions(['setPage']),
  },
  mounted() {
    this.setPage('shop')
  },
}
</script>
