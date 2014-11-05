(function(){
    'use strict';
    angular.module('AngularLightbox', []).directive('body', function(){
        return{
            restrict :'E',
            link :function($scope, element){
                
                var lightboxMargin = 30;
                var imageMargin = 30;

                var images;
                var variables = {};
                var create = {};
                var remove = {};
                var actions = {};

                var body = document.body;
                var html = document.getElementsByTagName('html')[0];

                create.calcDimentions = function(image, callback){
                    var windowWidth = window.innerWidth,
                    windowHeight = window.innerHeight,
                    imageWidth = image.width,
                    imageHeight = image.height;

                    var ratio = imageWidth / imageHeight;

                    if( imageWidth > (windowWidth - lightboxMargin - imageMargin)){
                        imageWidth = (windowWidth - lightboxMargin - imageMargin);
                    }

                    imageHeight = imageWidth / ratio;

                    if(imageHeight > (windowHeight - lightboxMargin - imageMargin)){
                        imageHeight = (windowHeight - lightboxMargin - imageMargin);
                        imageWidth = imageHeight * ratio;
                    }
                    callback(imageHeight, imageWidth);
                };

                create.createLightbox = function(){
                    html.setAttribute('class', (html.getAttribute('class') || '')+' lightbox-full-block');
                    body.setAttribute('class', (body.getAttribute('class') || '')+' lightbox-full-block');
                    variables.shadow = document.createElement('div');
                    variables.shadow.setAttribute('class', 'lightbox-shadow');
                    variables.lightbox = document.createElement('div');
                    variables.lightbox.setAttribute('class', 'lightbox-box lightbox-fade');
                    variables.wrapper = document.createElement('div');
                    variables.wrapper.setAttribute('class', 'lightbox-wrapper');
                    variables.lightbox.appendChild(variables.wrapper);
                    variables.arrowRight = document.createElement('div');
                    variables.arrowLeft = document.createElement('div');
                    variables.arrowLeft.setAttribute('class', 'lightbox-prev');
                    variables.arrowRight.setAttribute('class','lightbox-next');
                    variables.wrapper.appendChild(variables.arrowLeft);
                    variables.wrapper.appendChild(variables.arrowRight);
                    variables.shadow.appendChild(variables.lightbox);
                    body.appendChild(variables.shadow);
                    variables.shadow.focus();
                    create.addListeners();
                };

                create.addListeners = function(){
                    window.onresize = function(){
                        if(variables.img){
                            create.calcDimentions(variables.m_img, function(height, width){
                                create.resizeLightbox(height, width);
                            });
                        }
                    };
                    window.onkeyup = function (e) {
                        var code = e.keyCode ? e.keyCode : e.which;
                        if(code === 37){
                            actions.prev();
                        }else if (code === 39){
                            actions.next();
                        }else if( code === 27){
                            remove.removeLightbox();
                        }
                    };
                    variables.shadow.onclick = function(e){
                        if(e.target !== variables.shadow){
                            return;
                        }
                        remove.removeLightbox();
                    };
                    variables.arrowLeft.onclick = actions.prev;
                    variables.arrowRight.onclick = actions.next;
                };

                create.loadImage = function(path){
                    var img = new Image();
                    variables.m_img = {};
                    img.src = path;
                    img.onload = function(){
                        variables.m_img.height = img.height;
                        variables.m_img.width = img.width;
                        create.calcDimentions(variables.m_img, function(height, width){
                            if(variables.img){
                             variables.wrapper.removeChild(variables.img);
                            }
                            variables.img = img;
                            create.resizeLightbox(height, width);
                            variables.wrapper.appendChild(variables.img);
                            if(variables.lightbox.getAttribute('class').indexOf(' open') === -1){
                                variables.lightbox.setAttribute('class', variables.lightbox.getAttribute('class') + ' open');
                            }
                        });
                    };
                };

                create.resizeLightbox = function(height, width){
                    if(variables.img){
                        variables.lightbox.setAttribute('style', 'height:'+(height+imageMargin)+'px;width:'+(width+imageMargin)+'px');
                        variables.img.width = width;
                        variables.img.height = height;
                    }
                };

                create.getIndex = function(image){
                    for(var c = 0 ; c < images.length ; c++){
                        if(images[c] === image){
                            variables.index = c;
                        }
                    }
                };

                create.openLightbox = function(){
                    var self = this;
                    if(!variables.lightbox){
                        create.createLightbox();
                    }
                    create.getIndex(self);
                    create.loadImage(create.getUrl(self));
                    if(variables.index === (images.length - 1)){
                        variables.arrowRight.setAttribute('style', 'display:none');
                    }
                    if(variables.index === 0){
                        variables.arrowLeft.setAttribute('style', 'display:none');
                    }
                };

                create.getUrl = function(image){
                    var url = image.src;
                    if(image.attributes['data-lightbox-src']){
                        url = image.attributes['data-lightbox-src'].value;
                    }
                    return url;
                };

                remove.removeLightbox = function(e){
                    body.setAttribute('class', body.getAttribute('class').replace(' lightbox-full-block', ''));
                    html.setAttribute('class', html.getAttribute('class').replace(' lightbox-full-block', ''));
                    variables.lightbox.setAttribute('class', variables.lightbox.getAttribute('class').replace(' open', ''));
                    variables.lightbox.addEventListener( 'webkitTransitionEnd', remove.deleteLightbox);
                    variables.lightbox.addEventListener( 'transitionend', remove.deleteLightbox);
                    variables.lightbox.addEventListener( 'oTransitionEnd', remove.deleteLightbox);
                };

                remove.deleteLightbox = function(){
                    body.removeChild(variables.shadow);
                    variables = {};
                    window.onresize = null;
                    window.onkeyup = null;
                };

                actions.next = function(){
                    if(variables.index < (images.length - 1)){
                        variables.index++;
                        create.loadImage(create.getUrl(images[variables.index]));
                        variables.arrowLeft.removeAttribute('style');
                    }
                    if(variables.index === (images.length - 1)){
                        variables.arrowRight.setAttribute('style', 'display:none');
                    }
                };

                actions.prev = function(){
                    if(variables.index > 0){
                        variables.index--;
                        variables.arrowRight.removeAttribute('style');
                        create.loadImage(create.getUrl(images[variables.index]));
                    }
                    if(variables.index === 0){
                        variables.arrowLeft.setAttribute('style', 'display:none');
                    }
                };

                actions.initByClass = function(classname){
                    images = [];
                    var allimages = document.getElementsByClassName(classname);
                    for(var c = 0 ; c< allimages.length ; c++){
                        if(allimages[c].tagName === 'IMG'){
                            allimages[c].onclick = create.openLightbox;
                            images.push(allimages[c]);
                        }
                    }
                };

                actions.initByWrapperId = function(id){
                    images = [];
                    var allimages = document.getElementById(id).getElementsByTagName('img');
                    for(var c = 0 ; c< allimages.length ; c++){
                        allimages[c].onclick = create.openLightbox;
                        images.push(allimages[c]);
                    }
                };
                $scope.lightbox = actions;
            }
        };
    });
}());