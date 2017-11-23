# FlickrRand

A node module to pull a random image from a specific Flickr user's timeline

### To Use:

* Set the environment variables:
  * Flickr_API = FLICKR_API_KEY
  * Flickr_Username = The Flickr account to grab a random photo from
  * FlickrURL = The Flickr accounts URL
* Example code:
  
```
var flickrRand = require('flickrrand');

var image = flickrRand.getRandomImage.then(function (res) {
   console.log(res);
});
```