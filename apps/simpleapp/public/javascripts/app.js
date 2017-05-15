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
    url = '';

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
    cropper = new Cropper($('#image'), {
        aspectRatio: 1,
        background: false,
        zoomable: false,
        ready: function () {
            croppable = true;
        }
    });
    $('#image').src = url;
    $('.picture').src = headerImage;
    $('.container').hide();
} // end function

/************************************************************************
 STEP 4 - Use this method if you only want to perform something once the View Context has been resolved
 NOTE: If not needed, you can remove the entire function
 ************************************************************************/
function onView(context) {
    console.log("onView", context);
    $('#change').click(function (e) {
        picValue = e.target.files[0];
        if (!picValue.type.includes('image/')) {
            alert('Please select an image file');
            return;
        }
        if (typeof FileReader === 'function') {
            var reader = new FileReader();
            reader.onload = (event) => {
                url = event.target.result;
                // rebuild cropperjs with the updated source
                cropper.replace(url);
            };
            $('#image').src = url;
            reader.readAsDataURL(picValue);
            $('.container').show();
        } else {
            alert('Sorry, FileReader API not supported');
        }
    });
    $('#button').click(function () {
        $('.container').hide();
        var croppedCanvas;
        if (!croppable) {
            return
        }
        croppedCanvas = cropper.getCroppedCanvas();
        headerImage = croppedCanvas.toDataURL();
        $('.picture').src = headerImage;
        croppable = true
    })
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
