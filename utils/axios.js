const result = require("dotenv").config();
if (result.error) throw result.error;

const axios = require("axios");
const jsSHA = require("jssha");

const getAuthorizationHeader = function () {
  var AppID = process.env.APP_ID;
  var AppKey = process.env.APP_KEY;
  var GMTString = new Date().toGMTString();
  var ShaObj = new jsSHA("SHA-1", "TEXT");
  ShaObj.setHMACKey(AppKey, "TEXT");
  ShaObj.update("x-date: " + GMTString);
  var HMAC = ShaObj.getHMAC("B64");
  var Authorization =
    'hmac username="' +
    AppID +
    '", algorithm="hmac-sha1", headers="x-date", signature="' +
    HMAC +
    '"';

  return { Authorization: Authorization, "X-Date": GMTString };
};

// 创建实例时设置配置的默认值
var instance = axios.create({
  baseURL: "https://ptx.transportdata.tw/MOTC/v2",
  timeout: 5000,
});

instance.interceptors.request.use(
  (config) => {
    return { ...config, headers: getAuthorizationHeader(), ...config.headers };
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

module.exports = instance;
