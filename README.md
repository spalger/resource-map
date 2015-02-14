# resource-map

The goal of this projects is to create graphs of the resources on any site. I plan to use these graphs for generating pseduo log data in a way that could actually represent real traffic. If successful, the graph would contiain info like:

```
site.com/index.html
  - type: page
  - content-type: text/html
  - size: n
  - assets
    - cdn.com/app.js
    - cdn.com/logo.png
    - cdn.com/site.css
  - links
    - site.com/contact.html
    - site.com/about-us.html
    
cdn.com/app.js
  - type: asset
  - content-type: application/javascript
  - size: n
  
cdn.com/logo.png
  - type: asset
  ...
```

With this data I plan to generate request logs by picking a starting page and then log events that actually coorolate to that page and pages it links to.
