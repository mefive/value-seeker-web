import axios from 'axios';
import qs from 'qs';

function formatResponse({
  code, status,
  message, msg,
  data,
}) {
  return {
    code: code != null ? code : status,
    status,
    message: message != null ? message : msg,
    data,
  };
}

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = params => {
  if (params instanceof FormData) {
    return params;
  }

  return qs.stringify(params, { skipNulls: true, allowDots: true });
};

axios.interceptors.response.use(response => {
  if (response.data instanceof Blob) {
    return response.data;
  }

  const res = formatResponse(response.data);

  if (res.code === 1 || res.code === 0) {
    return res.data;
  }

  if (res.code === 9999) {
    window.location.href = `/module/auth/api/logout?targetUrl=${encodeURIComponent(window.location.href)}`;
  }

  throw res;
});
