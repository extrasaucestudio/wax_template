import {delay} from '~/utils/utils.js'

const endpoints = [
  'https://wax.api.atomicassets.io/',
  'https://aa.dapplica.io/',
  'https://wax-atomic-api.eosphere.io/',
  'https://api.atomic.greeneosio.com/',
  'https://api.wax-aa.bountyblok.io/',
]

const safeAtomicFetch = async(axios, req, selectedEndpoint = 0) => {
  if(endpoints[selectedEndpoint] === undefined) {
    console.warn('Impossible to fetch from atomic api')
    console.warn('Refresh app and check your internet to fix bug')
    return;
  }

  try {
    const res = await axios.get(endpoints[selectedEndpoint] + req)
    return res.data.data;
  }
  catch(e) {
    console.warn(e)
    console.info('Retry with another endpoint')
    await delay(100)
    ++selectedEndpoint
    return safeAtomicFetch(axios, req, selectedEndpoint)
  }
}

export const loadAllUserAssets = async(axios, wallet, page = 1, prevRows = []) => {
  const limitPerFetch = 1000
  const req = 'atomicassets/v1/assets?collection_name=immersys'+
              '&owner='+wallet+'&page='+page+'&limit='+limitPerFetch+'&order=desc&sort=asset_id&nocache='+Date.now()

  const assets = await safeAtomicFetch(axios, req)
  let rows = prevRows.concat(assets)

  if(assets.length === limitPerFetch) {
    ++page
    await delay(1000)
    rows = await loadAllUserAssets(axios, wallet, page, rows)
    return rows
  }
  else
    return rows
}

export const loadTplFromIds = async(axios, ids, page = 1, prevRows = []) => {
  const limitPerFetch = 1000
  const req = 'atomicassets/v1/templates?collection_name=immersys'+
  '&ids='+ids.join(',')+'&page='+page+'&limit='+limitPerFetch+'&order=desc&sort=created&nocache='+Date.now()

  const assets = await safeAtomicFetch(axios, req)
  let rows = prevRows.concat(assets)

  if(assets.length === limitPerFetch) {
    ++page
    await delay(1000)
    rows = await loadAllUserAssets(axios, wallet, page, rows)
    return rows
  }
  else
    return rows
}