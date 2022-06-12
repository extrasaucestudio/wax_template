<template>
  <div v-if="visible && current === 'login'" class="modal-container">
    <div class="modal-layerclose" @click="close"></div>
    <div class="modal-content">
      <div class="modal-xmark"><fa-icon @click="close" :icon="['fas','xmark']" /></div>
      <h2>Select wallet</h2>
      <ul class="items">
        <li v-for="wallet in wallets">
          <div class="item">
            <button class="immersys-button" @click='login(wallet.id)'>
              <img :src="wallet.logo" :alt="wallet.name + 'logo'" />
              <span>{{wallet.name}}</span>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {
  },
  data() {
    return {
      loading: false,

      wallets: []
    }
  },

  computed: {
    ...mapState('modal', ['current', 'visible'])
  },

  mounted() {
    const wallets = [
      {
        id: 'wcw',
        name: 'Wax Cloud Wallet',
        logo: require('@/static/logos/wax.svg'),
        index: 'wax',
        create: 'https://all-access.wax.io/'
      },
      {
        id: 'anchor',
        name: 'Anchor',
        logo: require('@/static/logos/anchor.svg'),
        create: 'https://greymass.com/en/anchor/'
      },
      {
        id: 'scatter',
        name: 'Scatter / TP / Starteos',
        logo: require('@/static/logos/scatter.svg'),
        create:
          'https://github.com/GetScatter/ScatterDesktop/releases/tag/11.0.1'
      },
      {
        name: 'SimplEOS',
        logo: require('@/static/logos/simpleos.svg')
      },
      { name: 'Lynx', logo: require('@/static/logos/lynx.svg') },
      { name: 'Ledger', logo: require('@/static/logos/ledger.svg') }
    ]

    this.wallets = wallets
  },

  methods: {
    async login(provider) {
      this.loading = true

      try {
        await this.$store.dispatch('chain/login', provider)
        this.$store.dispatch('modal/closeModal')
      } catch (e) {
        console.warn('login error')
        console.log(e)
        /* this.$notify({
          title: `${provider} login error`,
          message: e,
          type: 'error'
        }) */
      } finally {
        this.loading = false
      }
    },
    close() {
      this.$store.dispatch('modal/closeModal')
    }
  }
}
</script>

<style scoped>
  .modal-content ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    margin-bottom: 20px;
  }
  .modal-content ul li {
    display: inline-block;
    width: 50%;
    vertical-align: top;
  }
  .modal-content ul li .item {
    padding: 10px;
  }
  .modal-content ul li .item button {
    width: 100%;
    height: 50px;
    border-radius: 0;
    display: flex;
    justify-content: left;
  }
  .modal-content ul li .item button img {
    max-width: 40px;
    max-height: 40px;
    margin-right: 20px;
  }
</style>
