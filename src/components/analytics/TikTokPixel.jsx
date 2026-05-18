import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function trackTikTokEvent(event, params) {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track(event, params);
  }
}

export default function TikTokPixel() {
  const pixelId = import.meta.env.VITE_TIKTOK_PIXEL_ID;
  const location = useLocation();

  useEffect(() => {
    if (!pixelId || window.ttq) return;

    (function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      const ttq = (w[t] = w[t] || []);
      ttq.methods = ['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie'];
      ttq.setAndDefer = (obj, method) => { obj[method] = (...args) => obj.push([method, ...args]); };
      ttq.methods.forEach((m) => ttq.setAndDefer(ttq, m));
      ttq.load = (id) => {
        const s = d.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${id}&lib=${t}`;
        d.head.appendChild(s);
      };
      ttq.load(pixelId);
      ttq.page();
    })(window, document, 'ttq');
  }, []);

  useEffect(() => {
    if (window.ttq) {
      window.ttq.page();
    }
  }, [location.pathname]);

  return null;
}
