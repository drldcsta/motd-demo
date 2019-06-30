# fastly-motd

## What it is: 

Fastly MoTD is a simple node app that displays a MoTD (message of the day) in the background, and information about who created the MoTD in the foreground. 

## What it does: 

It demonstrates the speed of Fastly's [Instant Purging](https://www.fastly.com/products/instant-purging). When loaded the user is shown a page that is rendered server side and cached on Fastly. Reloading the page multiple times will show the same data each time. However, the page can be updated via the browswer by sending a new message at the "path". When a new message is submitted the page is 301 redirected to the homepage where the old message has already been cleared from the cache. 



## How to use it in a demo: 

### Instant Purge

 [Here](https://motd.drl.fyi) is a copy of this demo hosted on Glitch. When it loads you should see something like this

![](https://cdn.glitch.com/5c586511-8b2c-4245-99d1-922a4c0ceb06%2FScreen%20Shot%202019-06-29%20at%2010.02.30%20PM.png?v=1561860174359)

Try refreshing the page a few times, it should look the same (same message in the background, same timestamp in the foreground). That's because it's being cached. 

Next, we'll update the message by adding a path to the URL, EG: [motd.drl.fyi/hello*world](https://motd.drl.fyi/hello*world) You should be redirected back to motd.drl.fyi but now you'll see your message in the background and a new timestamp in the foreground. 

![](https://cdn.glitch.com/5c586511-8b2c-4245-99d1-922a4c0ceb06%2FScreen%20Shot%202019-06-29%20at%2010.08.09%20PM.png?v=1561860500128)

It's a simple demo, but the cache invalidation is consistently faster than the 301 redirect from the request to update the message. 

[HERE](https://cdn.glitch.com/5c586511-8b2c-4245-99d1-922a4c0ceb06%2Fthats_fast.gif?v=1561862841187) is a gif of this in action. 
