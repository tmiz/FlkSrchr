$(function(){

    if (localStorage["click_action"]) {
      localStorage["click_action"] == "copyToClipboard";
    } 
    if (localStorage["image_size"]) {
      localStorage["click_action"] == "5";
    }


    
    var copyTextToClipboard = function(txt){
        var copyArea = $("<textarea/>");
        copyArea.text(txt);
        $("body").append(copyArea);
        copyArea.select();
        document.execCommand("copy");
        copyArea.remove();
    }

    var htmlSrcs = [];
    var photoIds = [];
    var itemSize = ["_s","_q","_t","_m","_n","","_z","_c","_b","_o"];

    function showFlickr() {
        $('#FlickrPhotos').html("");
        var bg = chrome.extension.getBackgroundPage().bg;
        var dataStat = bg.data.stat;
        var dataTotal = bg.data.photos.total;
        if(dataStat == 'ok'){
            $.each(bg.data.photos.photo, function(i,item) {
                var itemFarm = item.farm;
                var itemServer = item.server;
                var itemID = item.id;
                var itemOwner = item.owner;
                var itemSecret = item.secret;
                var itemTitle = item.title;
                var itemLink = 'http://www.flickr.com/photos/' + itemOwner + '/' + itemID + '/'
                var itemPath = 'http://farm' + itemFarm + '.static.flickr.com/' + itemServer + '/' + itemID + '_' + itemSecret + '_m.jpg'

                if (localStorage["click_action"] == "openLink") {
                    var flickrSrc = '<img src="' + itemPath + '" alt="' + itemTitle + '" style="width:200px;height:auto;" id="local_id' + i + '">';
                    var htmlSrc = '<a href="' + itemLink + '" target="_blank">' + flickrSrc + '</a><br>'
                    $('#FlickrPhotos').append(htmlSrc);
                } else {
                    var flickrSrc = '<img src="' + itemPath + '" alt="' + itemTitle + '" style="width:200px;height:auto;" id="local_id' + i + '">';
                    $('#FlickrPhotos').append(flickrSrc);

                    if (localStorage["image_size"] == "9") {
                        itemSecret = "__ORIG_SECRET__";
                    }
                    var copyItemPath = 'http://farm' + itemFarm + '.static.flickr.com/' + itemServer + '/' + itemID  + "_" + itemSecret + itemSize[Number(localStorage["image_size"])] +'.jpg';


                    var copyflickrSrc = '<img src="' + copyItemPath + '" alt="' + itemTitle + '">';
                    var htmlSrc = '<a href="' + itemLink + '" target="_blank">' + copyflickrSrc + '</a><br>';
                    photoIds.push(itemID);
                    htmlSrcs.push(htmlSrc);
                    $('#local_id' + i).click(function(event) { 
                        var lastSelectedPhoto = Number(event.target.id.replace("local_id",""));
                        if (localStorage["image_size"] != "9") {
                            var count = event.target.id.length;
                            copyTextToClipboard(htmlSrcs[lastSelectedPhoto]);
                            $("#" + event.target.id).css("-webkit-animation-name", "clipSign");
                            $("#" + event.target.id).css("-webkit-animation-duration", "2s");
                            setTimeout(function() {
                                $("img").css("-webkit-animation-name", "");
                            }, 250);
                        } else {
                            $.ajax({
                                    type : 'GET',
                                    url : bg.url,
                                    data : {
                                    format : 'json',
                                    method : 'flickr.photos.getInfo', // 必須 :: 実行メソッド名 
                                    api_key : bg.api_key,
                                    photo_id : photoIds[lastSelectedPhoto],
                                },
                                dataType : 'jsonp',
                                jsonp : 'jsoncallback', // Flickrの場合はjsoncallback
                                success : function (data) {                                    
                                    copyTextToClipboard(htmlSrcs[lastSelectedPhoto].replace("__ORIG_SECRET__", data.photo.originalsecret));
                                    $("#" + event.target.id).css("-webkit-animation-name", "clipSign");
                                    $("#" + event.target.id).css("-webkit-animation-duration", "2s");
                                    setTimeout(function() {
                                        $("img").css("-webkit-animation-name", "");
                                    }, 250);
                                } 
                            });
                        }
                    });
                }
            });
        } else {
            // fail の場合の処理
        }
    }

    function openOption() {
        chrome.tabs.create({
            "url": chrome.extension.getURL("option_page.html"),
        });
    }

    $("#setting").click(function(){ openOption(); });
    showFlickr();
});

