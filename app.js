var Flickr = require('flickr-sdk');

var flickr = new Flickr(process.env.Flickr_API);

function getRandomInt(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomImage(photos, pages, imagesPerPage) {
   var randomPage = getRandomInt(1, pages);
   if (randomPage === pages) {
      var randomImage = getRandomInt(1, photos % imagesPerPage);
   } else {
      var randomImage = getRandomInt(1, 500);
   }

   var randomObj = {page:randomPage, image:randomImage};
   return randomObj;
}

function findLarge(size) { 
    return size.label === 'Large';
}

exports.getRandomImage = new Promise(function(resolve, reject) {
   var user = flickr.people.findByUsername({
      username: process.env.Flickr_Username
   }).then(function (res) {
      var userid = res.body.user.id;
      var user = flickr.people.getInfo({
         user_id: userid
      }).then(function (res) {
         var numPhotos = res.body.person.photos.count._content;
         var numPages = Math.ceil(numPhotos / 500);
         var randomObj = getRandomImage(numPhotos, numPages, 500);

         console.log('number of photos: ' + numPhotos);
         console.log('number of pages: ' + numPages);
         var photos = flickr.people.getPhotos({
            user_id: userid,
            per_page: 500,
            page: randomObj.page
         }).then(function (res) {
            var imageURL = process.env.FlickrURL + res.body.photos.photo[randomObj.image].id;
            var imageSizes = flickr.photos.getSizes({
               photo_id: res.body.photos.photo[randomObj.image].id
            }).then(function (res) {
               var largeImage = res.body.sizes.size.find(findLarge);
             
               resolve(largeImage);
            }).catch(function (err) {
               reject(err);
            });
         }).catch(function (err) {
            reject(err);
         });
      }).catch(function (err) {
         reject(err);
      });     
   }).catch(function (err) {
      reject(err);
   });
});