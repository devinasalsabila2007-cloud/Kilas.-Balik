// ============================================================
//  firebase-messaging-sw.js
//  Service Worker untuk Firebase Cloud Messaging (FCM)
//  Kilas.Balik — Notifikasi Background
//
//  ⚠️  File ini WAJIB diletakkan di folder ROOT domain,
//      sejajar dengan index.html
//      Contoh: https://domainmu.com/firebase-messaging-sw.js
// ============================================================

// Import Firebase compat (wajib pakai compat di Service Worker)
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// ── Konfigurasi Firebase (HARUS sama persis dengan index.html) ─
firebase.initializeApp({
  apiKey           : "AIzaSyAE58TY5vK6vwjqN9UodQ_SG2ccpKIClJk",
  authDomain       : "kilas-balik-3d587.firebaseapp.com",
  projectId        : "kilas-balik-3d587",
  storageBucket    : "kilas-balik-3d587.firebasestorage.app",
  messagingSenderId: "996232040867",
  appId            : "1:996232040867:web:b7ec3d648e0e8b17c20a16"
});

const messaging = firebase.messaging();

// ── Tangani notifikasi saat app DITUTUP / di BACKGROUND ────────
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] 📩 Notifikasi background diterima:', payload);

  const title = payload.notification?.title ?? '🧹 Kilas.Balik';
  const body  = payload.notification?.body  ?? 'Ada notifikasi baru untuk kamu!';
  const icon  = payload.notification?.icon  ?? '/icon-192.png';

  const options = {
    body,
    icon,
    badge   : '/badge-72.png',
    data    : payload.data ?? {},
    vibrate : [200, 100, 200],
    tag     : 'kilas-balik-notif',
    renotify: true,
    actions : [
      { action: 'open',    title: '📲 Buka App' },
      { action: 'dismiss', title: '✖ Tutup'    }
    ]
  };

  return self.registration.showNotification(title, options);
});

// ── Tangani klik pada notifikasi ───────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const appUrl = self.registration.scope || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.startsWith(appUrl) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(appUrl);
        }
      })
  );
});

// ── Aktifkan Service Worker secepatnya ─────────────────────────
self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
