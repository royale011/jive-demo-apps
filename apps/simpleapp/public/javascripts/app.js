/************************************************************************
 STEP 1 - Update Your Action IDs to Match your app.xml
 See: /apps/simpleapp/public/app.xml
 ************************************************************************/
var ACTION_IDS = [
    "example.app.content.all.action",
    "example.app.content.document.action",
    "example.app.content.discussion.action",
    "example.app.content.question.action",
    "example.app.content.document.binary.action",
    "example.app.content.blogpost.action",
    "example.app.content.idea.action",
    "example.app.content.event.action",
    "example.app.content.poll.action",
    "example.app.content.video.action",
    "example.app.createmenu.action",
    "example.app.places.all.action",
    "example.app.places.space.action",
    "example.app.places.project.action",
    "example.app.places.group.action",
    "example.app.places.settings.all.action",
    "example.app.places.settings.space.action",
    "example.app.places.settings.project.action",
    "example.app.places.settings.group.action",
    "example.app.rte.action"
];
var headerImage = '',
    picValue = '',
    cropper = null,
    croppable = false,
    imageUrl = '';

/************************************************************************
 STEP 2 - Use this method if you want to run code after OpenSocial has loaded the environemnt
 NOTE: This is marginally better than jQuery onReady, but not required.
 //var jiveURL = opensocial.getEnvironment()['jiveUrl'];
 NOTE: If not needed, you can remove the entire function
 ************************************************************************/
function onReady(env) {
    console.log('onReady', env);
    var jiveURL = env["jiveUrl"];

    //TODO: ADD IN UI INIT STUFF

    app.resize();
} // end function

/************************************************************************
 STEP 3 - Use this method if you only want to perform something once the Viewer has been resolved
 NOTE: If not needed, you can remove the entire function
 ************************************************************************/
function onViewer(viewer) {
    console.log("onViewer", viewer);
    var image = $('#image-cropper');
    console.log("image Object", image);
    image.src = imageUrl;
    $('.picture').src = headerImage;
    $('.container').hide();
    cropper = new Cropper(image[0], {
        aspectRatio: 1,
        background: false,
        zoomable: false,
        ready: function () {
            croppable = true;
        }
    });
    $('#change-button').change(function (e) {
        var files = e.target.files || e.dataTransfer.files;
        console.log("uploadImage", files);
        if (!files.length) return;
        var container = $('.container');
        container.show();
        picValue = files[0];
        imageUrl = getObjectURL(picValue);
        if (cropper) {
            cropper.replace(imageUrl);
        }
        container.show();
    });
    $('.ok-button').click(function () {
        console.log("cropImage");
        var container = $('.container');
        container.hide();
        var croppedCanvas;
        if (!croppable) {
            return;
        }
        croppedCanvas = cropper.getCroppedCanvas();
        headerImage = croppedCanvas.toDataURL();
        $('.picture').src = headerImage;
        container.hide();
        croppable = true;
    })
} // end function

/************************************************************************
 STEP 4 - Use this method if you only want to perform something once the View Context has been resolved
 NOTE: If not needed, you can remove the entire function
 ************************************************************************/
function onView(context) {
    console.log("onView", context);
} // end function

/************************************************************************
 STEP 5 - Use this method if you only want to perform something once the Action Context has been resolved
 NOTE: If not needed, you can remove the entire function
 ************************************************************************/
function onAction(context) {
    console.log("onAction", context);
} // end function

/************************************************************************
 STEP 6 - Use this method if you only want to perform something once the Data Context has been resolved
 NOTE: If not needed, you can remove the entire function
 ************************************************************************/
function onData(data) {
    console.log("onData", data);
} // end function


/* ########################################################################################
 ########################################################################################
 ###### THE FOLLOWING FUNCTIONS ARE CALLED FROM onContext FUNCTION (see above)  #########
 ###### AND ARE ONLY MEANT TO SHOW HOW TO PERFORM VARIOUS RTE INJECTIONS W/APPS #########
 ########################################################################################
 ######################################################################################## */

function getObjectURL (file) {
    var url = null;
    if (!!gadgets.window.createObjectURL) { // basic
        url = gadgets.window.createObjectURL(file);
    } else if (!!gadgets.window.URL) { // mozilla(firefox)
        url = gadgets.window.URL.createObjectURL(file);
    } else if (!!gadgets.window.webkitURL) { // webkit or chrome
        url = gadgets.window.webkitURL.createObjectURL(file);
    }
    return url;
}
