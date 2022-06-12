<template>
	<div class="wallet-connect">
		<button class="immersys-button" @click='$store.dispatch("modal/login")'>Connect wallet</button>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'ConnectWallet',
  computed: {
  },
  methods: {
  },
  components: {
  },
}
</script>

<style scoped>
  .wallet-connect {
  }
</style>