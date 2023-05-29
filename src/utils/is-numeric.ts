export default function isNumeric(str: string) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(Number(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str)) && // ...and ensure strings of whitespace fail
    !str.includes('e') && // no exponential notations allowed
    !str.includes('E') 
}