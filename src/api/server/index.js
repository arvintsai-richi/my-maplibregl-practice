import { JWT, createAxios } from '@/api/HttpService';
import { getRouter } from '@/router';

// 初始化Axios
const http = createAxios({
  baseURL: `${import.meta.env.BASE_URL}api`,
});

// 設定JWT，並嘗試由 localStorage 取得 JWT 來初始化
http.setJWT('/Auth/RefreshToken', JWT.refreshOnDelay);

export default http;
