import axios from "axios"
axios.defaults.baseURL = '';


async function getMapData () {
  const res = await axios.get(`/mockData/areaAll.json`)
  return res.data;
}
async function getAreaAllData () {//全部地市信息
  const res = await axios.get(`/mockData/areaAll.json`)
  return res.data;
}
async function getAreaBottomData () {//地市详细信息
  const res = await axios.get(`/mockData/areaDetail.json`)

  return res.data;
}
export {
  getMapData,
  getAreaAllData,
  getAreaBottomData
}