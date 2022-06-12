<template>
  <div class="immersysapp-crafting">
    <h1>Crafting</h1>

    <CraftingFilters />

    <ul v-if="countFilteredBlueprints()" class="immersys-list crafting-list">
      <li v-for="(bp, i) in filteredBlueprints" v-if="getTplData(bp.TemplateId)">
        <div>
          <div class="immersys-output crafting-output">
            <h4 v-if="getTplData(out.TemplateId)" v-for="(out, j) in bp.Output">{{getTplData(out.TemplateId).name}}</h4>
          </div>
          <div class="immersys-img crafting-img">
            <img :alt="getTplData(bp.TemplateId).name + ' image'" :src="'https://ipfs.io/ipfs/' + getTplData(bp.TemplateId).img" />
          </div>

          <ul class="immersys-materials crafting-materials">
            <li v-for="(mat, j) in bp.Materials">
              <p v-if="getTplData(mat.key)"><span :class="'amount ' + amountClass(getTplAmount(mat.key), mat.value)">{{getTplAmount(mat.key)}}/{{mat.value}}</span> {{getTplData(mat.key).name}}</p>
            </li>
          </ul>
          
          <div class="immersys-action crafting-action">
            <button v-if="isItemCraftable(bp.TemplateId, bp.Materials)" class="immersys-button" @click='craft(bp)'>Craft</button>
            <div v-else class="immersys-button disabled">Craft</div>
          </div>
        </div>
      </li>
    </ul>
    <div v-else class="immersys-nolist crafting-nolist">
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
import { mapState, mapGetters, mapActions } from 'vuex'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import CraftingFilters from '~/components/crafting/Filters.vue'

export default {
  name: 'Crafting',
  computed: {
    ...mapState(['user']),
    ...mapState('crafting', ['filteredBlueprints', 'isMounted', 'isLoading']),
    ...mapGetters('crafting', [
      'getTplData',
      'countFilteredBlueprints',
    ]),
    ...mapGetters([
      'getUserAssetIds',
      'getTplAmount',
      'isBlueprintOwned',
      'areMaterialsOwned'
    ]),
  },
  methods: {
    ...mapActions('crafting', {
      fetchBlueprints: 'fetchBlueprints',
      setTplsData: 'setTplsData',
    }),
    craft(bp) {
      let assetsToSend = []
      for(let i = 0; i < bp.Materials.length; ++i) {
        const mat = bp.Materials[i]
        assetsToSend.push(...this.getUserAssetIds(mat.key, mat.value))
      }

      this.$store.dispatch('chain/immersysCraft', {
        assets: assetsToSend,
        blueprint: this.getUserAssetIds(bp.TemplateId, 1)[0]
      });
    },
    amountClass(ownedAmount, requiredAmount) {
      return (ownedAmount >= requiredAmount) ? 'amountOK' : 'amountKO';
    },
    isItemCraftable(bpId, materials) {
      if(!(this.isBlueprintOwned(bpId)))
        return false

      return this.areMaterialsOwned(materials)
    },
  },
  components: {
    CraftingFilters,
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
      this.fetchBlueprints()
   }
   else {
    this.fetchBlueprints()
   }
  },
  created() {
   this.unsubscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'crafting/updateTplData') {
        localStorage.setItem("tplsData", state.crafting.tplsData)     
      }
   });
  }
}
</script>

<style scoped>
  
</style>
