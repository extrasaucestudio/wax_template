<template>
  <div class="immersysapp-shop">
    <h1>Shop</h1>

    <ul v-if="countMenu()" class="immersys-list shop-list">
      <li v-for="(item, i) in menu" v-if="getTplData(item.TemplateId)">
        <div>
          <div class="immersys-item shop-item">
            <h4 v-if="getTplData(item.TemplateId)">{{getTplData(item.TemplateId).name}}</h4>
          </div>
          <div class="immersys-img shop-img">
            <img :alt="getTplData(item.TemplateId).name + ' image'" :src="'https://ipfs.io/ipfs/' + getTplData(item.TemplateId).img" />
          </div>
          <div class="immersys-iteminfo shop-iteminfo">
            <p>Owned templates: {{ getTplAmount(item.TemplateId) }}
            <p class="price">{{getMenuItemPriceSymb(item).price}} {{getMenuItemPriceSymb(item).ticker}}</p>
          </div>        
          <div class="immersys-action shop-action">
            <button v-if="user()" class="immersys-button" @click='buy(item)'>Buy</button>
            <div v-else class="immersys-button disabled">Buy</div>
          </div>
        </div>
      </li>
    </ul>
    <div v-else class="immersys-nolist shop-nolist">
      <div v-if="!isMounted || isLoading">
        <ClipLoader color="#70e6ff"/>
      </div>
      <div v-else>
        <h2>No item found</h2>
      </div>
    </div>
  </div>
</template>

<script>
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'shop',
  methods: {
    ...mapActions('shop', ['fetchMenu', 'setTplsData']),
    buy(item) {
      const quantity = 1;
      this.$store.dispatch('chain/shopBuy', {
        quantity: quantity,
        price: this.getMenuItemPriceSymb(item).price,
        ticker: this.getMenuItemPriceSymb(item).ticker,
        tokenContract: item.Price.contract,
        memo: item.Memo
      });
    },
  },
  computed: {
    ...mapState('shop', ['menu', 'isLoading', 'isMounted']),
    ...mapGetters(['user', 'getTplAmount']),
    ...mapGetters('shop', ['countMenu', 'getTplData', 'getMenuItemPriceSymb']),
  },
  components: {
    ClipLoader
  },
   mounted() {
   if(!process.client) {
    console.log('!process.client')
    return;
   }

   let savedData = localStorage.getItem("tplsData");
   if(savedData) {
      savedData = JSON.parse(savedData)
      this.setTplsData(savedData)
      this.fetchMenu()
   }
   else {
    this.fetchMenu()
   }
  },
  created() {
   this.unsubscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'shop/updateTplData') {
        localStorage.setItem("tplsData", state.shop.tplsData)     
      }
   });
  }
}
</script>

<style scoped>

</style>