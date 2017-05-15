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

    // app.resize();
} // end function

/************************************************************************
 STEP 3 - Use this method if you only want to perform something once the Viewer has been resolved
 NOTE: If not needed, you can remove the entire function
 ************************************************************************/
function onViewer(viewer) {
    console.log("onViewer", viewer);
    var image = $('#image-cropper');
    console.log("image Object", image);
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
        console.log("uploadImage", e.target);
        picValue = e.target.files[0];
        if (!picValue.type.includes('image/')) {
            alert('Please select an image file');
            return;
        }
        if (typeof FileReader === 'function') {
            var reader = new FileReader();
            reader.onload = (event) => {
                imageUrl = event.target.result;
                // rebuild cropperjs with the updated source
                cropper.replace(imageUrl);
            };
            $('#image-cropper').attr("src", imageUrl);
            reader.readAsDataURL(picValue);
            $('.container').show();
        } else {
            alert('Sorry, FileReader API not supported');
        }
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
        $('.picture').attr("src", headerImage);
        // osapi.jive.corev3.people.getViewer().execute(function (viewer) {
        //     var id = viewer.id;
        //     console.log('viewer', viewer);
        //
        // }, function (error) {
        //     console.log('viewer error', error);
        // });
        var imageBlob = dataURItoBlob(headerImage);
        var formData = new FormData();
        formData.append("file", imageBlob);
        osapi.jive.core.put({
            v: "v3",
            // userId: "@viewer",
            href: "/people/@viewer/avatar",
            body: formData
        }).execute(function (response) {
            console.log('response', response);
            container.hide();
            croppable = true;
        },function(error){
            console.log('error', error);
            container.hide();
            croppable = true;
        });
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

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);

    //New Code
    return new Blob([ab], {type: mimeString});


}
