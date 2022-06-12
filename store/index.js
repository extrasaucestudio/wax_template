import {loadAllUserAssets} from '~/utils/atomicapihelper.js'
import {delay} from '~/utils/utils.js'

export const strict = false

export const state = () => ({
  user: null,
  balances: [],
  assets: JSON.stringify({}), // {tplid: [...assetsId]}
  account: null,
  network: {},
  lihgHistoryBlock: null,
  blockNum: null,
  page: null,
})

export const mutations = {
  setNetwork: (state, network) => {
    state.network = network
  },
  setBalances(state, balances) {
    state.balances = balances
  },
  setUser: (state, user) => state.user = user,
  setAssets(state, assets) {
    state.assets = JSON.stringify(assets);
  },
  setLoading: (state, loading) => state.loading = loading,
  setAccount: (state, account) => state.account = account,
  setLihgHistoryBlock: (state, block) => state.lihgHistoryBlock = block,
  setBlockNum: (state, block) => state.blockNum = block,
  setPage: (state, page) => state.page = page,
}


/* const playOrderMatchSound = debounce(() => {
  const audio = new Audio(require('~/assets/sounds/match.mp3'))
  audio.play()
}, 50) */

const loadOrdersDebounce = {}

export const actions = {
  async setPage({commit}, page) {
    commit('setPage', page)
  },
  async update({ dispatch, state }) {
    dispatch('loadAccountData')
    dispatch('loadUserAssets')
  },
  async loadAccountData({ state, commit, dispatch }) {
    if (!state.user) return

    const account = await this.$rpc.get_account(state.user.name)
    commit('setAccount', account)
    commit('setBlockNum', account.head_block_num)

    dispatch('loadUserBalances')
  }, 
  async loadUserAssets({ commit , state }) {
    if(!state.user) {
      commit('setAssets', {})
      return; 
    }

    const assets = await loadAllUserAssets(this.$axios, state.user.name)
    let newStateAssets = {}
    for(let i = 0; i < assets.length; ++i) {
      const asset = assets[i]
      const tplId = asset.template.template_id
      const assetId = asset.asset_id

      if(newStateAssets[tplId] === undefined)
        newStateAssets[tplId] = []

      newStateAssets[tplId].push(assetId)
    }

    commit('setAssets', newStateAssets)
  },

  async loadUserBalances({ state , commit }) {
    if (!state.user) return

    const waxBal = await this.$rpc.get_currency_balance('eosio.token', state.user.name, 'WAX');
    await delay(1000)
    let fateBal = await this.$rpc.get_currency_balance('f.immersys', state.user.name, 'FATE');
    if(!fateBal.length)
      fateBal = ['0.00000000 FATE']
    commit('setBalances', [waxBal[0], fateBal[0]])
  },

}

export const getters = {
  user: (state) => () => {
    return state.user
  },
  getTplAmount: (state) => (tplId) => {
    const stateAssets = JSON.parse(state.assets)

    if(stateAssets[tplId] === undefined)
      return 0

    return stateAssets[tplId].length
  },
  isBlueprintOwned: (state) => (bpId) => {
    const stateAssets = JSON.parse(state.assets)
    return (stateAssets[bpId] !== undefined)
  },
  areMaterialsOwned: (state, getters) => (materials) => {
    for(let i = 0; i < materials.length; ++i) {
      const mat = materials[i]
      if(getters.getTplAmount(mat.key) < mat.value)
        return false
    }

    return true
  },
  getUserAssetIds: (state) => (assetId, amount) => {
    const stateAssets = JSON.parse(state.assets)
    let assets = []
    for(let i = 0; i < amount; ++i)
      assets.push(stateAssets[assetId][i])

    return assets
  },
}
