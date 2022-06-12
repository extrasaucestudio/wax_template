import WCW from '~/plugins/wallets/WCW'
import AnchoWallet from '~/plugins/wallets/Anchor'
import ScatterWallet from '~/plugins/wallets/Scatter'
import {precise} from '~/utils/utils.js'

export const state = () => ({
  loginPromise: null,
  wallets: {},
  payForUser: false,
  currentWallet: 'anchor',
  lastWallet: null
})

export const mutations = {
  setWallets: (state, value) => state.wallets = value,
  setLoginPromise: (state, value) => state.loginPromise = value,
  setPayForUser: (state, value) => state.payForUser = value,
  setCurrentWallet: (state, value) => state.currentWallet = value,
  setLastWallet: (state, value) => state.lastWallet = value
}

export const getters = {
  chainName: (state, getters, rootState) => rootState.network.name,
  wallet: (state, getters) => state.wallets[state.currentWallet]
}

export const actions = {
  init({ state, commit, dispatch, rootState, rootGetters, getters }) {
    const { network } = rootState

    const wallets = {
      anchor: new AnchoWallet(network, this.$rpc),
      scatter: new ScatterWallet(network, this.$rpc),
      wcw: new WCW(network, this.$rpc)
    }

    commit('setWallets', wallets)

    if (state.lastWallet) {
      commit('setCurrentWallet', state.lastWallet)
      dispatch('autoLogin')
    }
  },

  async autoLogin({ state, dispatch, commit, getters }) {
    console.log('try autoLogin..')
    const loginned = await getters.wallet.checkLogin()
    console.log(loginned)
    if (loginned) {
      const { name, authorization } = loginned
      commit('setUser', { name, authorization }, { root: true })
      dispatch('afterLoginHook')

      return true
    }
    return false
  },

  afterLoginHook({ dispatch, rootState }) {
    dispatch('loadAccountData', {}, { root: true })
    dispatch('loadUserAssets', {}, { root: true })
    dispatch('energy/fetchPrice', {}, { root: true })
  },

  logout({ state, dispatch, commit, getters, rootState }) {
    getters.wallet.logout()
    commit('setLastWallet', null)
    commit('setUser', null, { root: true })
    dispatch('update', {}, { root: true })
    dispatch('crafting/resetFilters', {}, { root: true })
  },

  async login({ state, commit, dispatch, getters, rootState }, wallet_name) {
    commit('setCurrentWallet', wallet_name)
    const { name, authorization } = await getters.wallet.login()


    commit('setUser', { name, authorization }, { root: true })
    dispatch('afterLoginHook')

    commit('setLastWallet', wallet_name)
  },

  transfer({ dispatch, rootState }, { contract, actor, quantity, memo, to }) {
    return dispatch('sendTransaction',
      [
        {
          account: contract,
          name: 'transfer',
          authorization: [
            rootState.user.authorization
          ],
          data: {
            from: actor,
            to: to || rootState.network.contract,
            quantity,
            memo
          }
        }
      ]
    )
  },
  immersysCraft({dispatch, rootState}, {assets, blueprint}) {
    return dispatch('sendTransaction',
      [
        {
          account: 'atomicassets',
          name: 'transfer',
          authorization: [
            rootState.user.authorization
          ],
          data: {
            from: rootState.user.name,
            to: 'bp.immersys',
            asset_ids: assets,
            memo: blueprint
          }
        }
      ]
    )
  },
  shopBuy({dispatch, rootState}, {quantity, ticker, tokenContract, price, memo}) {
    return dispatch('sendTransaction',
      [
        {
          account: tokenContract,
          name: 'transfer',
          authorization: [
            rootState.user.authorization
          ],
          data: {
            from: rootState.user.name,
            to: 'shp.immersys',
            quantity: precise(price*quantity, 8)+' '+ticker,
            memo: memo
          }
        }
      ]
    )
  },
  async sendTransaction({ state, rootState, dispatch, getters, commit }, actions) {
    try {
      const res = await getters.wallet.transact(actions)
      
      this._vm.$notify({
        duration: this.$notificationDuration,
        type: 'success',
        title: 'Transaction successful',
        text: '<a href="https://wax.bloks.io/transaction/'+res.transaction_id+'/" target="_blank">Tx id: '+res.transaction_id+'</a>'
      })
      return res
    } catch (e) {
      this._vm.$notify({
        duration: this.$notificationDuration,
        type: 'error',
        title: 'Transaction error',
        text: e
      })
      throw e
    } finally {
      setTimeout(() => {dispatch('update', {}, { root: true })}, 3000)
    }
  }
}
