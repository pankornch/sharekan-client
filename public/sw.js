if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return a[e]||(s=new Promise((async s=>{if("document"in self){const a=document.createElement("script");a.src=e,document.head.appendChild(a),a.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!a[e])throw new Error(`Module ${e} didn’t register its module`);return a[e]}))},s=(s,a)=>{Promise.all(s.map(e)).then((e=>a(1===e.length?e[0]:e)))},a={require:Promise.resolve(s)};self.define=(s,n,i)=>{a[s]||(a[s]=Promise.resolve().then((()=>{let a={};const t={uri:location.origin+s.slice(1)};return Promise.all(n.map((s=>{switch(s){case"exports":return a;case"module":return t;default:return e(s)}}))).then((e=>{const s=i(...e);return a.default||(a.default=s),a}))})))}}define("./sw.js",["./workbox-4a677df8"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/8dB8hMIsYNmftpErzv2sS/_buildManifest.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/8dB8hMIsYNmftpErzv2sS/_ssgManifest.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/308-20ebf6922ca75a625b7f.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/455-f92cb5a80df7668b3458.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/590-37f7ca39edbf42c049f1.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/740-074dc80b60c2722f99ce.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/776-c9cbe1e58e5bc3872ada.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/793-bf96b11dd29d5aacd9c8.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/framework-2191d16384373197bc0a.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/main-da1bc8f8d312ca485cee.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/pages/404-270375c63a82c68ffed3.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/pages/_app-1acf0450f8402042a3c3.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/pages/_error-737a04e9a0da63c9d162.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/pages/dashboard-db742926137055d891ef.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/pages/index-90145dcc7da610ccd9d9.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/pages/join_room-5bac756b111f48bc8383.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/pages/profile-a66189a8de498f415de8.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/pages/profile/change_password-fd55b27b084b5a1baf81.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/pages/room-b3cec407af95e74668dd.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/pages/room/%5BroomId%5D-974e0696e819ba802c25.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/pages/room/%5BroomId%5D/item/%5BitemId%5D-8fdf64722d8749ecf885.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/pages/room/%5BroomId%5D/item/add_item-f5c0caae30a5c66c13ba.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/pages/room/%5BroomId%5D/member/%5BmemberId%5D-189e761840ab6d2eb80c.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/pages/room/%5BroomId%5D/member/%5BmemberId%5D/bill-1f8be9bab22e0d7c138f.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/pages/room/%5BroomId%5D/overview-6ee098b56bbc5518d111.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/pages/room/create-cc3ba4f24dd0e9d225d0.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/pages/sign_in-e7b822dcb4e84023164b.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/pages/sign_up-0b1d8c1c60abdbda3905.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/pages/test-348e1011bb5fe86e86c3.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/polyfills-a40ef1678bae11e696dba45124eadd70.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/chunks/webpack-fa9d2134d22c68812db4.js",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/_next/static/css/c2f89da59dd6018ec383.css",revision:"8dB8hMIsYNmftpErzv2sS"},{url:"/add-task.svg",revision:"c37770b1349077cf447585f41bc5b64d"},{url:"/add.svg",revision:"42de7ab85b456f097d85ead494473208"},{url:"/arrow-down.svg",revision:"02e919801f6b143273749ca1f876d47b"},{url:"/arrow-left.svg",revision:"4840b7f73b90ab8fa9126e44351ed2e3"},{url:"/bill.svg",revision:"baa40e1bd3eaca136abf6261edc8f09b"},{url:"/bot.svg",revision:"2cbce12fd495264606c8e85301afa4c7"},{url:"/close.svg",revision:"d4cff1b7b1d80cd7eaa599d79105d8db"},{url:"/copy.svg",revision:"3f58ae590041073a29c0e03fcd9fb030"},{url:"/create-room.svg",revision:"40165e619502015b7256bae1a45ebcd3"},{url:"/crown.svg",revision:"4f59d5b6a5b1d37d7d0383d40dea1843"},{url:"/favicon.ico",revision:"a1ff71905ab82fa4f6c6b1e69defc019"},{url:"/friend's-task.svg",revision:"50d691c6bf24cb7f44a0517e51428c68"},{url:"/icon-192x192.png",revision:"6d8770e4fdd229ac75ac6b7fd1fa86d4"},{url:"/icon-256x256.png",revision:"16222ac0de7bdeb236fc4bd303f4d6bf"},{url:"/icon-384x384.png",revision:"6dac719d935e80f0f1bcc81ff1f2469c"},{url:"/icon-512x512.png",revision:"ca9d5d43c0f60fc43caf9057155bf337"},{url:"/info.svg",revision:"bcb0fd74ad946963961a555ca451b512"},{url:"/invite.svg",revision:"de504898189e4494964cf92ed3e0e4f1"},{url:"/loading-lottie.json",revision:"9ad2f5aa068f5060ef1e3c3334fa07d5"},{url:"/loading.svg",revision:"2cc8e914cabe4aab0a87289de72cdf42"},{url:"/logo.svg",revision:"42143e8ecc71399678276b429221604f"},{url:"/manifest.json",revision:"987be157139904e4e0660a390c9bab7d"},{url:"/no-data.svg",revision:"8787b873fbb5f2b5c20b4ac653b08903"},{url:"/not-found.svg",revision:"69a1a1e0c711d2654b7d8dcbf699cff3"},{url:"/remove.svg",revision:"6fe1a63ae3fba050a96815197b3f6959"},{url:"/task-together.svg",revision:"f7a70db341dd226a5ec6124a611d1910"},{url:"/unauthenticate.svg",revision:"1f592d4d31da6891b35e61537557816a"},{url:"/user.svg",revision:"3525220c7d378b8328c785b4ce9a5c7d"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
