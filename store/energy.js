import {fetchTable} from '~/utils/rpchelper.js'
import {extractTokenBalFromBal} from '~/utils/utils.js'

export const state = () => ({
  quantity: 1,
  price: undefined
})

export const mutations = {
  updateQuantity: (state, value) => state.quantity = value,
  updatePrice: (state, price) => state.price = price,
}

export const actions = {
  reset({commit}) {
    commit('updateQuantity', 1)
  },
  increment({ commit, state }) {
    commit('updateQuantity', state.quantity + 1)
  },
  decrement({ commit, state }) {
    if(state.quantity > 1)
      commit('updateQuantity', state.quantity - 1)
  },
  async fetchPrice({commit}) {
    const priceRow = await fetchTable(this.$rpc, 'shp.immersys', 'shp.immersys', 'menu', {lower_bound: 'energy'})
    const price = extractTokenBalFromBal(priceRow[0].Price.quantity) * 1
    commit('updatePrice', price)
  }
}

export const getters = {
  getTotalPrice: (state) => () => {
    return state.price * state.quantity
  },
}