// ============================================================
//  firebase-messaging-sw.js
//  Service Worker untuk Firebase Cloud Messaging (FCM)
//  Kilas.Balik — Notifikasi Background
// ============================================================

// Versi Firebase yang dipakai harus sama dengan di index.html
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// ── Konfigurasi Firebase (harus sama dengan index.html) ─────
firebase.initializeApp({
  apiKey: "AIzaSyAE58TY5vK6vwjqN9UodQ_",
  messagingSenderId: "996232040867",
  appId: "1:996232040867:web:b7ec3d648"
});

const messaging = firebase.messaging();

// ── Tangani notifikasi saat aplikasi DITUTUP / di background ─
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Notifikasi background diterima:', payload);

  const title  = payload.notification?.title  || '🧹 Kilas.Balik';
  const body   = payload.notification?.body   || 'Ada notifikasi baru untuk kamu!';
  const icon   = payload.notification?.icon   || '/icon-192.png';
  const badge  = '/badge-72.png';
  const data   = payload.data || {};

  const options = {
    body,
    icon,
    badge,
    data,
    vibrate: [200, 100, 200],
    tag: 'kilas-balik-notif',   // Ganti notif lama dengan yang baru
    renotify: true,
    actions: [
      { action: 'open', title: '📲 Buka App' },
      { action: 'dismiss', title: '✖ Tutup' }
    ]
  };

  return self.registration.showNotification(title, options);
});

// ── Tangani klik pada notifikasi ─────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  // Buka / fokus ke tab aplikasi
  const urlToOpen = self.registration.scope || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.startsWith(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
