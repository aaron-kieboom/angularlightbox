#Angular lightbox

##add scripts
add the javascript and the css file to your html

``` html
<link rel="stylesheet" href="css/lightboxs-style.css"/>


<script type="text/javascript" src="js/angularlightbox.js"></script>
```


##include the lightbox module in your module

``` js
    angular.module('yourmodule', ['AngularLightbox']);
```

##initialize the lightbox

there are 2 ways to initialize the lightbox

###method 1
$scope.lightbox.initByClass(classname);

this function selects al the img elements with the class that is given

example :
``` js
    angular.element(document).ready(function(){
        $scope.lightbox.initByClass('lightbox-image');
    });
```

will select al the images with the class 'lightbox-image'.

###method2
$scope.lightbox.initByWrapperId(id);

this function selects al the img in the element with the give id.

example :
``` js
    angular.element(document).ready(function(){
        $scope.lightbox.initByWrapperId('holder');
    });
```

will select al the images that are in the element with id 'holder'.

##img tag

the lightbox uses the src of the image that is clicked by default.
if the lightbox need to show another image than the smal image it is posible to use the 'data-lightbox-src' attribute the lightbox wil use this src when it is available.

example :
``` html
    <img src="exampleimage1.png" />
    
    <img data-lightbox-src="exapleimage2.png" src="exapleimage2thumb.png" />

``` 