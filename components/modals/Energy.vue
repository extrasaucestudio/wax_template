<template>
  <div v-if="visible && current === 'energy'" class="modal-container">
    <div class="modal-layerclose" @click="close"></div>
    <div class="modal-content">
      <div class="modal-xmark"><fa-icon @click="close" :icon="['fas','xmark']" /></div>
      <h2>Buy energy</h2>
      <div class="quantity-select">
        <div class="immersys-button" @click="decrement()">
          <fa-icon :icon="['fas','minus']" />
        </div>
        <div class="quantity">{{ quantity }}</div>
        <div class="immersys-button" @click="increment()">
          <fa-icon :icon="['fas','plus']" />
        </div>
      </div>
      <div class="price-info">
        <p>Price: {{getTotalPrice()}} FATE</p>
      </div>
      <div @click="buyEnergy(quantity)" class="immersys-button buy-button">Buy</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: {
  },
  computed: {
    ...mapState('energy', ['quantity', 'price']),
    ...mapState('modal', ['current', 'visible']),
    ...mapGetters('energy', ['getTotalPrice'])
  },
  methods: {
    ...mapActions('energy', ['increment', 'decrement', 'reset']),
    close() {
      this.reset()
      this.$store.dispatch('modal/closeModal')
    },
    buyEnergy(quantity) {
      this.$store.dispatch('chain/shopBuy', {
        quantity: quantity,
        price: this.price,
        ticker: 'FATE',
        tokenContract: 'f.immersys',
        memo: 'energy'
      });

      this.close()
    },
  }
}
</script>

<style scoped>
  .modal-content {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .quantity-select {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .quantity-select .immersys-button {
    display: inline-block;
    margin: 0 20px;
  }
  .buy-button {
    display: inline-block;
    margin: 20px 0;
  }
  .quantity-select .quantity {
    font-size: 24px;
    font-weight: bold;
  }
</style>
