import {fetchTable} from '~/utils/rpchelper.js'
import {delay} from '~/utils/utils.js'
import {loadTplFromIds} from '~/utils/atomicapihelper.js'

export const state = () => ({
	blueprints: [],
	filteredBlueprints: [],
	tplsData: JSON.stringify({}),
	filter: 'all',
	schemaFilter: 'all',
	isLoading: false,
	isMounted: false,
})

export const getters = {
  getAllSchemas: (state) => () => {
  	let schemas = []
  	
  	for(let i = 0; i < state.blueprints.length; ++i) {
  		const schema = state.blueprints[i].Output[0].Schema
  		if(schemas.indexOf(schema) === -1)
  			schemas.push(schema)
  	}

  	return schemas
  },
	getFilter: (state) => () => {
		return state.filter
	},
	getTplData: (state) => (tplId) => {
		const stateTplsData = JSON.parse(state.tplsData)
    return stateTplsData[tplId]
  },
  countFilteredBlueprints: (state) => () => {
  	return state.filteredBlueprints.length
  }
}

export const mutations = {
	updateIsLoading(state, isLoading) { state.isLoading = isLoading	},
	setMounted(state) { state.isMounted = true },
	updateBlueprints(state, blueprints) {
		state.blueprints = blueprints
	},
	updateTplData(state, {key, data}) {
		let stateTplsData = JSON.parse(state.tplsData)
		stateTplsData[key] = data
		state.tplsData = JSON.stringify(stateTplsData)
	},
	setTplsData(state, tplsData) {
		state.tplsData = JSON.stringify(tplsData)
	},
	updateFilter(state, filter) {
		state.filter = filter
	},
	updateSchemaFilter(state, schemaFilter) {
		state.schemaFilter = schemaFilter
	},
	updateFilteredBlueprints(state, filteredBlueprints) {
		state.filteredBlueprints = filteredBlueprints
	},
	resetBPFilter(state) {
		state.filter = 'all'
	}
}

export const actions = {
	async setMounted({commit}) {
		commit('setMounted')
	},
	async resetFilters({commit, dispatch}) {
		commit('resetBPFilter')
		dispatch('applyFilter')
	},
	async updateFilter({commit, rootState, dispatch}, event) {
		let filter = (rootState.user !== null)
			? event.target.value
			: 'all'

		commit('updateFilter', filter)
		dispatch('applyFilter')
	},
	async updateSchemaFilter({commit, dispatch}, event) {
		commit('updateSchemaFilter', event.target.value)
		dispatch('applyFilter')
	},
	async applyFilter({commit, state, rootState, rootGetters}) {
		let filteredBlueprints = []

		if(state.filter !== 'all') {
			for(let i = 0; i < state.blueprints.length; ++i) {
				const bp = state.blueprints[i]

				if(rootGetters.isBlueprintOwned(bp.TemplateId)) {
					if(state.filter === 'ownedBP')
						filteredBlueprints.push(bp)
					else if(rootGetters.areMaterialsOwned(bp.Materials))
							filteredBlueprints.push(bp)
				}
			}
		}
		else {
			filteredBlueprints = state.blueprints.slice()
		}
		
		if(state.schemaFilter !== 'all') {
			filteredBlueprints = filteredBlueprints.filter(fbp => {
				return fbp.Output[0].Schema === state.schemaFilter
			})
		}
		
		commit('updateFilteredBlueprints', filteredBlueprints)
	},
	async setTplsData({commit}, tplsData) {
		commit('setTplsData', tplsData)
	},

	async fetchBlueprints({commit, dispatch}) {
		commit('updateIsLoading', true)
		const blueprints = await fetchTable(this.$rpc, 'bp.immersys', 'bp.immersys', 'blueprints')
		commit('updateBlueprints', blueprints)

		dispatch('applyFilter')
		dispatch('fetchTpls')
	},
	async fetchTpls({commit, dispatch, state}) {
		const stateTplsData = JSON.parse(state.tplsData)

		// Count all different tpls
		let tplsToProcess = []
		for(let i = 0; i < state.blueprints.length; ++i) {
			if(tplsToProcess.indexOf(state.blueprints[i].TemplateId) === -1
				 && stateTplsData[state.blueprints[i].TemplateId] === undefined)
				tplsToProcess.push(state.blueprints[i].TemplateId)
			for(let j = 0; j < state.blueprints[i].Materials.length; ++j)
				if(tplsToProcess.indexOf(state.blueprints[i].Materials[j].key) === -1
					 && stateTplsData[state.blueprints[i].Materials[j].key] === undefined)
					tplsToProcess.push(state.blueprints[i].Materials[j].key)
			for(let j = 0; j < state.blueprints[i].Output.length; ++j)
				if(tplsToProcess.indexOf(state.blueprints[i].Output[j].TemplateId) === -1
					 && stateTplsData[state.blueprints[i].Output[j].TemplateId] === undefined)
					tplsToProcess.push(state.blueprints[i].Output[j].TemplateId)
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
		
		commit('updateIsLoading', false)
	}
}