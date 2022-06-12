<template>
	<div class="user-connected">
    <div v-if="page === 'crafting'" class="energy-buy">
      <button class="immersys-button" @click='$store.dispatch("modal/energy")'>Buy energy</button>
    </div>
    <div class="user-balances">
      <div class="user-balance" v-for="bal in balances">
        <img :src="'/logos/' + includedExtractTokenNameFromBal(bal) +'.png'" alt="token logo"/>{{ includedExtractTokenBalFromBal(bal) }}
        <a v-if="includedExtractTokenNameFromBal(bal) === 'FATE'" href="https://wax.alcor.exchange/swap?output=FATE-f.immersys&input=WAX-eosio.token" target="_blank" title="BUY FATE"><fa-icon :icon="['fas','plus']" /></a>
      </div>
    </div>
		<div class="user-name">
      <p @click="logout()" title="Logout">{{user.name}} <span><fa-icon :icon="['fas','right-from-bracket']" /></span></p>
    </div>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import {extractTokenBalFromBal, extractTokenNameFromBal} from '~/utils/utils.js'

export default {
  name: 'UserConnected',
  methods: {
    includedExtractTokenBalFromBal(bal) {
      return extractTokenBalFromBal(bal)
    },
    includedExtractTokenNameFromBal(bal) {
      return extractTokenNameFromBal(bal)
    },
    ...mapActions('chain', ['logout']),
  },
  computed: {
  	...mapState(['user', 'balances', 'page'])
  },
  components: {
  },
}
</script>

<style scoped>
.user-connected {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.user-balances, .user-name {
  display: inline-block;
  margin: 0;
  padding: 0;
}
.user-name p {
  background: #393ba7;
  border: 1px solid #2b3990;
  margin: 0;
  padding: 10px;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
}
.user-name p:hover {
  background: #24307a;
}
.user-name span {
  padding-left: 10px;
}
.user-name {
  margin-left: 20px;
  font-weight: bold;
}
.user-balances img {
  max-width: 20px;
  max-height: 20px;
  margin-right: 10px;
}
.user-balance {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  margin-left: 20px;
  font-weight: bold;
}
.user-balance a {
  color: #fff;
  text-decoration: none;
  padding: 2px;
  margin-left: 5px;
  transition: 0.2s;
}
.user-balance a:hover {
  color: #4548db;
}
</style>