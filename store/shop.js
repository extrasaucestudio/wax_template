import {fetchTable} from '~/utils/rpchelper.js'
import {delay} from '~/utils/utils.js'
import {loadTplFromIds} from '~/utils/atomicapihelper.js'

export const state = () => ({
	menu: [],
	tplsData: JSON.stringify({}),
	isLoading: false,
	isMounted: false,
})

export const getters = {
	countMenu: (state) => () => {
  	return state.menu.length
  },
  getMenuItemPriceSymb: (state) => (item) => {
  	let price = item.Price.quantity
  	price = price.split(' ')
  	return {
  		price: price[0]*1,
  		ticker: price[1]
  	}
  },
  getTplData: (state) => (tplId) => {
		const stateTplsData = JSON.parse(state.tplsData)
    return stateTplsData[tplId]
  },
}

export const mutations = {
	updateIsLoading(state, isLoading) { state.isLoading = isLoading	},
	updateMenu(state, menu) { state.menu = menu },
	setMounted(state) { state.isMounted = true },
	updateTplData(state, {key, data}) {
		let stateTplsData = JSON.parse(state.tplsData)
		stateTplsData[key] = data
		state.tplsData = JSON.stringify(stateTplsData)
	},
	setTplsData(state, tplsData) {
		state.tplsData = JSON.stringify(tplsData)
	},
}

export const actions = {
	async setMounted({commit}) {
		commit('setMounted')
	},
	async setTplsData({commit}, tplsData) {
		commit('setTplsData', tplsData)
	},
	async fetchMenu({commit, dispatch}) {
		commit('updateIsLoading', true)
		const menu = await fetchTable(this.$rpc, 'shp.immersys', 'shp.immersys', 'menu')

		commit('updateMenu', menu)
		dispatch('fetchTpls')
	},
	async fetchTpls({commit, dispatch, state}) {
		const stateTplsData = JSON.parse(state.tplsData)

		// Count all different tpls
		let tplsToProcess = []
		for(let i = 0; i < state.menu.length; ++i) {
			if(tplsToProcess.indexOf(state.menu[i].TemplateId) === -1
				 && stateTplsData[state.menu[i].TemplateId] === undefined)
				tplsToProcess.push(state.menu[i].TemplateId)
		}

		// Fetch TPLs
		if(tplsToProcess.length) {
			const tpls = await loadTplFromIds(this.$axios, tplsToProcess)
			for(let i = 0; i < tpls.length; ++i) {
				const tpl = tpls[i]
				commit('updateTplData', {
					key: tpl.template_id, 
					data: { 
						name: tpl.name,
						img: tpl.immutable_data.img,
					}
				})
			}
		}
	}
}