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
        headerImage = croppedCanvas.toDataURL('image/jpeg');
        $('.picture').attr("src", headerImage);
        // osapi.jive.corev3.people.getViewer().execute(function (viewer) {
        //     var id = viewer.id;
        //     console.log('viewer', viewer);
        //
        // }, function (error) {
        //     console.log('viewer error', error);
        // });
        // var formData = new FormData(document.forms[0]);
        // formData.append("file", ('upload.png', headerImage.split(",").pop(), 'image/png'));
        // formData.append("Content-Type", "multipart/form-data");
        // formData.append("Content-Transfer-Encoding", "base64");
        osapi.jive.core.post({
            v: "v3",
            href: "/profileImages/temporary",
            body: multipartFormData(headerImage)
        }).execute(function (response) {
            console.log('response', response);
            // osapi.jive.core.put({
            //     v: "v3",
            //     // userId: "@viewer",
            //     href: "/people/@viewer/avatar",
            //     body: formData
            // }).execute(function (response) {
            //     console.log('response', response);
            //     container.hide();
            //     croppable = true;
            // },function(error){
            //     console.log('error', error);
            //     container.hide();
            //     croppable = true;
            // });
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

function multipartFormData (image) {
    var boundary = '----'+(new Date()).getTime();
    var bodyString = [];
    bodyString.push(
        '--' + boundary,
        'Content-Disposition: form-data; name="' + "file" + '";' + 'filename="' + "upload.jpg" + '"',
        'Content-Type: ' + "image/jpeg",
        'Content-Transfer-Encoding: base64','', //need /r/n twice here
        image.split(",").pop() //remove the data:image/png;base64,
    );
    bodyString.push('--' + boundary + '--','');
    var content = bodyString.join('\r\n');
    return {
        content: content,
        headers: {
            'Content-Type': 'multipart/form-data; boundary='+boundary,
            'Content-Length': content.length
        }
    }
}
