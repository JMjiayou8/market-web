import axios from "axios"
axios.defaults.baseURL = '';


async function getMapData () {
  const res = await axios.get(``)
  return res.data;
}
export {
  getMapData
}