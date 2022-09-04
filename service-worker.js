console.log('-----service worker-----')
globalThis.addEventListener('fetch', (event) => {
  console.log("🚀 ~ file: service-worker.js ~ line 4 ~ globalThis.addEventListener ~ event.request.url", event.request.url)
  if (event.request.url.includes('test')) {
    event.respondWith((async () => {
      const response = await fetch(event.request);
      const { body } = response;
      const reader = body.getReader();
      const stream = new ReadableStream({
        start(controller) {
          const sleep = time => new Promise(resolve => setTimeout(resolve, time));
          const pushSlowly = () => {
            reader.read().then(async ({ value, done }) => {
              if (done) {
                controller.close();
                return;
              }
              const length = value.length;
              for (let i = 0; i < length; i++) {
                await sleep(30);
                controller.enqueue(value.slice(i, i + 1));
              }
              pushSlowly();
            });
          };
          pushSlowly();
        }
      });
      return new Response(stream, { headers: response.headers });
    })());
  }
});
