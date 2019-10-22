import axios from "axios"
axios.defaults.baseURL = 'http://10.21.66.56:8082/saleview';

async function getIndexData () {
  const res = await axios.get(`/queryAll`)
  return res.data;
}
async function getMapData () {
  const res = await axios.get(`/querySaleList`)
  return res.data;
}
async function getAreaAllData () {//全部地市信息
  const res = await axios.get(`/queryAreaList`)
  return res.data;
}

export {
  getIndexData,
  getMapData,
  getAreaAllData,

}