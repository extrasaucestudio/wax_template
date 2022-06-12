export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export const precise = (price, precision) => { return Number.parseFloat(price).toFixed(precision) }
export const formatPrice = (price) => { return Number.parseFloat(price).toFixed(2) }
export const extractTokenBalFromBal = (bal) => {
  bal = bal.split(' ')
  return Number.parseFloat(bal[0]*1).toFixed(2)
}
export const extractTokenNameFromBal = (bal) => {
  bal = bal.split(' ')
  return bal[1]
}