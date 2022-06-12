<template>
	<div class="crafting-filters">
    <div class="crafting-filters-group">
      <h2>Blueprint</h2>
      <select @change="updateFilter($event)" value="getFilter()">
        <option value="all">Show all</option>
        <option v-if="user" value="craftable">Possible crafts</option>
        <option v-if="user" value="ownedBP">Available crafts</option>
      </select>
    </div>
    <div class="crafting-filters-group">
      <h2>Schema</h2>
      <select @change="updateSchemaFilter($event)">
        <option value="all">Show all</option>
        <option v-for="schema in getAllSchemas()" :value="schema">{{ schema }}</option>
      </select>
    </div>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'craftingFilters',
  methods: {
    ...mapActions('crafting', ['updateFilter', 'updateSchemaFilter']),
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters('crafting', ['getAllSchemas', 'getFilter']),
  },
  components: {
  },
}
</script>

<style scoped>
  .crafting-filters {
    margin-bottom: 20px;
  }
  .crafting-filters-group {
    display: inline-block;
    margin-right: 16px;
  }
  .crafting-filters-group select {
    width: 180px;
  }
</style>