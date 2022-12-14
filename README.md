# Simple Node Analytics
Simple web analytics to better understand user interaction and behaviour. Client and server are written in Javascript. All tracking results and events are written to a database by a simple Node.js service. Right now, there are no plans to build a fancy analytics dashboard.

# Rick's Additions
I forked this from one of my favorite programmers on GitHub. I think this will make for a fun side project that hits two points for me:

- **data analytics**: I am in the process of expanding my knowledge base of cleaning, manipulating, analyzing, and visualizing data. 
- **data viz**: Something I want to get really good at is creating data visualizations. Even though I've been focusing on Python recently, this will be a good refresher on JavaScript and using it in a new way. 

## Client
The analytics client has a modular structure and can be configured for multiple trackers:

- **click**: Simple click tracking for buttons and other interactive elements. Activated with the attribute `data-click="my-click-event"`.
- **observer**: Examines whether a specific element in the viewport is visibly thought for examining the scroll depth. Activated with the attribute `data-observer="my-element-is-visible-event"`.
- **timer**: records how much time a user spends on the site. The timer pauses on * blur * events and continues on * focus * events. Activated with the attribute `data-timer=my-timer-event"`.
- **custom**: Space for custom Javascript events that generate a tracking request.

Include the client library in the head of your HTML:

```html
<script src="http://localhost:3010/build/client.bundle.js"></script>
```

Initialize the analytics suite with all trackers:

```javascript
analytics.init({
  serviceUrl: 'http://localhost:3010/track',
  projectId: 'demo',
  tracker: {
    click: true,
    observer: true,
    timer: true,
    custom: true
  }
});
```

## Server
The Analytics service accepts tracking requests and stores them in a MongoDB collection.

```
$ node server
```

For each request, the value for the corresponding tracking key and device is incremented. Here's an example of getting headers on desktop devices:

```javascript
{
  "_id" : ObjectId("5b179f0e8fd447fe98595b14"),
  "project" : "demo",
  "device" : "desktop",
  "key" : "observer-0-header",
  "value" : 2231
}
```

Exporting analytics data from a MongoDB collection to JSON is done by using the `mongoexport` command:

```
$ mongoexport --db analytics --collection demo --out ./demo.json --jsonArray
```

MongoDB could be easily swapped for another database like PostgreSQL. 

## Roadmap

**Client**
- Plugin: Devices, sizes
- Plugin: Errors, exceptions
- Plugin: Geolocations
- Plugin: Load times
- Plugin: Custom events

**Service**
- Config file for analytics service (MongoDB, port, ...)
- Command line interface, e.g. `simple-node-analytics -p 3100`
- Friendly errors (no database, port in use, ...)
- Protected API for retrieving analytics data 
