/* GRID Expert Advisors — script comun del sitio.
   1) Aviso y preferencias de cookies (nada de medicion sin permiso).
   2) Pixel de Meta, solo con consentimiento.
   3) Boton flotante de WhatsApp.
   No depende de Tailwind: trae sus propios estilos para funcionar en todas las paginas. */
(function () {
  'use strict';

  var PIXEL_ID = '612397360691236';
  var KEY = 'grid-consent-v1';            // 'all' | 'necessary'
  var WA_URL = 'https://wa.me/50670400607?text=' +
    encodeURIComponent('Hola, vengo de la web de GRID y quiero saber cómo trabajan.');

  function getConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  // ---------- estilos ----------
  var css = [
    '.grid-cookie{position:fixed;left:16px;right:16px;bottom:16px;z-index:70;max-width:560px;margin:0 auto;',
    'background:#111F37;color:#F4F1EB;border:1px solid rgba(244,241,235,.14);border-radius:16px;padding:18px 20px;',
    'box-shadow:0 18px 50px rgba(0,0,0,.45);font:14px/1.55 Inter,system-ui,sans-serif}',
    '.grid-cookie p{margin:0 0 14px;color:#C9CED8}',
    '.grid-cookie a{color:#00D9FF;text-decoration:underline;text-underline-offset:3px}',
    '.grid-cookie .gc-row{display:flex;gap:10px;flex-wrap:wrap}',
    '.grid-cookie button{flex:1 1 140px;min-height:44px;border-radius:999px;font:600 14px Inter,system-ui,sans-serif;cursor:pointer}',
    '.grid-cookie .gc-ok{background:#00D9FF;color:#0A1628;border:0}',
    '.grid-cookie .gc-no{background:transparent;color:#F4F1EB;border:1px solid rgba(244,241,235,.35)}',
    '.grid-cookie button:focus-visible,.grid-wa:focus-visible{outline:3px solid #FFB800;outline-offset:3px}',
    '.grid-wa{position:fixed;right:18px;bottom:18px;z-index:60;width:56px;height:56px;border-radius:50%;',
    'background:#25D366;color:#fff;display:flex;align-items:center;justify-content:center;',
    'box-shadow:0 8px 24px rgba(0,0,0,.35);transition:transform .2s ease,bottom .3s ease}',
    '.grid-wa:hover{transform:scale(1.07)}',
    '.grid-wa svg{width:30px;height:30px}',
    'body.has-cookie-banner .grid-wa,body.has-cookie-banner #wa-flotante{bottom:190px!important}',
    '@media (min-width:640px){body.has-cookie-banner .grid-wa,body.has-cookie-banner #wa-flotante{bottom:150px!important}}',
    '@media print{.grid-cookie,.grid-wa{display:none}}'
  ].join('');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ---------- pixel de Meta ----------
  var pixelLoaded = false;
  function loadPixel() {
    if (pixelLoaded) return; pixelLoaded = true;
    /* Codigo base oficial del pixel de Meta. */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }
  function track(evt, params) { if (pixelLoaded && window.fbq) window.fbq('track', evt, params || {}); }

  // Conversiones: clic al formulario, a WhatsApp o a Calendly.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('formulariogrid') !== -1) track('Lead', { content_name: 'Agendar Discovery' });
    else if (href.indexOf('wa.me/') !== -1) track('Contact', { content_name: 'WhatsApp' });
    else if (href.indexOf('calendly.com') !== -1) track('Schedule');
  }, true);

  // ---------- aviso de cookies ----------
  var banner = null;
  function closeBanner() {
    if (banner) { banner.remove(); banner = null; }
    document.body.classList.remove('has-cookie-banner');
  }
  function openBanner() {
    if (banner) return;
    banner = document.createElement('div');
    banner.className = 'grid-cookie';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.innerHTML =
      '<p>Este sitio no necesita cookies para funcionar. Con su permiso, usamos el píxel de Meta para ' +
      'medir las visitas y mejorar nuestros anuncios. Puede cambiar su decisión cuando quiera desde el pie de página. ' +
      '<a href="/cookies/">Política de cookies</a></p>' +
      '<div class="gc-row"><button type="button" class="gc-no">Rechazar</button>' +
      '<button type="button" class="gc-ok">Aceptar</button></div>';
    banner.querySelector('.gc-ok').addEventListener('click', function () { setConsent('all'); closeBanner(); loadPixel(); });
    banner.querySelector('.gc-no').addEventListener('click', function () {
      var had = pixelLoaded; setConsent('necessary'); closeBanner();
      if (had) location.reload(); // descarga el pixel si ya estaba activo
    });
    document.body.appendChild(banner);
    document.body.classList.add('has-cookie-banner');
  }

  // ---------- boton flotante de WhatsApp ----------
  function addWhatsApp() {
    if (document.body.hasAttribute('data-no-wa') || document.getElementById('wa-flotante')) return; // la pagina ya trae su propio boton
    var a = document.createElement('a');
    a.className = 'grid-wa';
    a.href = WA_URL; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', 'Escribir por WhatsApp');
    a.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>';
    document.body.appendChild(a);
  }

  function init() {
    addWhatsApp();
    var c = getConsent();
    if (c === 'all') loadPixel();
    else if (c !== 'necessary') openBanner();
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('[data-consent-open]')) { e.preventDefault(); openBanner(); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
