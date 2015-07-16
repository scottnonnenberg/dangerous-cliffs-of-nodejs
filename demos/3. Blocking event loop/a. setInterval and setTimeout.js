var previous, delta = 0;

setInterval(function() {
  var now = new Date();
  if (previous) {
    delta = now.getTime() - previous.getTime();
  }
  console.log('interval', now.toJSON(), ' delta:', delta + 'ms');
  previous = now;
}, 100);

setTimeout(function() {
  var start = new Date();
  var now = new Date();

  console.log('sync task start');
  while (now.getTime() - start.getTime() < 1000) {
    now = new Date();
  }
  console.log('sync task done');
}, 500)

setTimeout(function() {
  process.exit();
}, 2000);
