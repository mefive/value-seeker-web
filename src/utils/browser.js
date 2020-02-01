import qs from 'qs';
import UAParser from 'ua-parser-js';

const uaParser = new UAParser(navigator.userAgent);

export function inXiaoP() {
  return navigator.userAgent.indexOf('xiaoq') !== -1;
}

export function setTitle(title) {
  if (inXiaoP()) {
    window.location.href = `xiaop://set-title?title=${title}`;
  } else {
    document.title = title;
  }
}

export function picPreview(urls, index) {
  if (inXiaoP()) {
    const query = `${urls.map(url => `url=${encodeURIComponent(url)}`).join('&')}&index=${index}`;
    window.location.href = `xiaop://pic-preview/?${query}`;
  }
}

export function exit() {
  if (inXiaoP()) {
    window.location.href = 'xiaop://exit';
  } else {
    window.top.close();
  }
}

export function getBrowser() {
  return uaParser.getBrowser();
}

export function isOlderIE() {
  const browser = getBrowser();
  return browser.name === 'IE' && browser.version <= 9;
}

export function isMobile() {
  const device = uaParser.getDevice();
  return device.type === 'mobile';
}

export function setMeta(name, content) {
  let meta = document.querySelector(`meta[name="${name}"]`);

  if (meta == null) {
    meta = document.createElement('meta');
    document.querySelector('head').appendChild(meta);
  }

  meta.setAttribute('name', name);
  meta.setAttribute('content', content);
}

export function removeMeta(name) {
  const meta = document.querySelector(`meta[name="${name}"]`);

  if (meta != null) {
    meta.parentNode.removeChild(meta);
  }
}

export function closeWindow() {
  if (inXiaoP()) {
    window.location.href = 'xiaop://exit2root';
  }
}

export function showUser(uid) {
  if (uid) {
    if (inXiaoP()) {
      window.location.href = `xiaop://show-user/?uid=${uid}`;
    }
  }
}

export function download(url, params) {
  const link = document.createElement('a');
  link.href = params == null ? url : `${url}?${qs.stringify(params, { skipNulls: true })}`;
  link.download = true;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

