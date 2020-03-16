var customIMGButtom = true;

// Options modal passing data
$('#optionsModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var appDetails = JSON.parse(decodeURI(button.data('app'))) // Extract info from data-app attributes

    //assign relevant values to elements.
    document.getElementById('modalTitle').innerHTML = ('App options for: ' + appDetails.appName);
    document.getElementById('deleteAppButton').setAttribute("onclick", "javascript: deleteApp(\'" + appDetails.appUUID + "\');");
})

function deleteApp(appUUID) {
    //Put the UUID of the app to be deleted into an object so it can later be turned into JSON
    deleteObj = {
        appUUID: appUUID
    }

    //create AJAX POST request to delete app
    $.ajax({
        type: "POST",
        url: "/api/deleteapp",
        data: JSON.stringify(deleteObj), //Request should carry the appUUID as JSON
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            data = JSON.parse(data);
            // If deleted successfully, display toast
            if (data.error == true) { // check that request was successful (error == false)
                alert("There was an error deleting this application")
            } else {
                $('#optionsModal').modal('hide')
                $('#deleteAppToast').toast('show');

            }
        },
        failure: function (errMsg) {
            alert("There was an error deleting this application: \n" + errMsg);
        }
    });

}


// Add app modal ui (spaghetti) code
function buttonSwitch(activeButton) {

    if (activeButton == "CustomIMG") {
        console.log(activeButton);
        document.getElementById("customAppIMGButton").classList.remove("active");
        document.getElementById("defaultIMGButton").classList.remove("active");
        document.getElementById("customAppIMGButton").classList.add("active");
        //imgSelectFormDisable(false);
        customIMGButtom = true;

    } else if (activeButton == "DefaultIMG") {
        console.log(activeButton);
        document.getElementById("customAppIMGButton").classList.remove("active");
        document.getElementById("defaultIMGButton").classList.remove("active");
        document.getElementById("defaultIMGButton").classList.add("active");
        //imgSelectFormDisable(true);
        customIMGButtom = false;
        document.getElementById('crop_button').addEventListener('click', function () {
            console.log("yes");
            addApp("");
        });

    } else {
        console.log("error in buttonSwitch()");
        document.getElementById("customAppIMGButton").classList.remove("active");
        document.getElementById("defaultIMGButton").classList.remove("active");
        document.getElementById("defaultIMGButton").classList.add("active");
        //imgSelectFormDisable(true);
        customIMGButtom = false;

    }

}

// Initalise Cropper
function initCropper() {
    var image = document.getElementById('img_area');
    var cropper = new Cropper(image, {
        aspectRatio: 16 / 9, // (1.7777)
        crop: function (e) {
            console.log(e.detail.x);
            console.log(e.detail.y);
        }
    });

    document.getElementById('crop_button').addEventListener('click', function () {
        addApp(cropper);
    });
}

function addApp(cropper) {

    console.log("test")
    //regex to split filename and image file extension
    const re = /([a-zA-Z0-9\s_\\.\-\(\):])+(.jpg|.jpeg|.png|.bmp|.gif|.svg)$/;

    // Put data into an object
    var AppData = {
        appName: document.getElementById("AppNameInput").value,
        appDesc: document.getElementById("appDescInput").value,
        appURL: document.getElementById("AppURLInput").value,
        customIMG: customIMGButtom,
        customIMGName: "",
        customIMGFormat: "",
        customIMGFile: ""
    };



    // Check for the File API support, if not available then warn user.
    if (window.File && window.FileReader && window.FileList && window.Blob) {} else {
        alert('This Browser does not support image uploads. \nTherefore unfortunatley you will not be able to give the application you are adding a cusyom image.');
        return (false);
    }


    // If adding a custom image
    if (AppData.customIMG == true) {

        //check if file is too big
        if ((document.getElementById("image").files[0].size / 1000000) > 15) {
            alert("sorry, but this file is too bug\n the max file size is 25mb");
            return (false);
        }

        //turn cropped image into data
        var imgurl = cropper.getCroppedCanvas().toDataURL();
        var img = document.createElement("img");
        img.src = imgurl;
        document.getElementById("cropped_result").appendChild(img);


        
        croppedImg = cropper.getCroppedCanvas().toDataURL();


        //test that file is a supported image
        if (!re.test(document.getElementById("image").files[0].name)) {
            alert("The file specificied is not an image.\n Accepted formats are .jpeg, .png, .bmp, .gif, and .svg");
            return (false);
        }

        //add the file name to the api call
        AppData.customIMGName = document.getElementById("image").files[0].name;
        // add the format of the file
        AppData.customIMGFormat = re.exec(document.getElementById("image").files[0].name)[(re.exec(document.getElementById("image").files[0].name).length) - 1];
        AppData.customIMGFile = croppedImg;


    }

    $.ajax({
        type: "POST",
        url: "/api/addapp",
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify(AppData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            data = JSON.parse(data);
            // If application was added successfully, show information toast.
            if (data.error == false) {
                $('#addAppToast').toast('show');
            }
        },
        failure: function (errMsg) {
            alert(errMsg);
        }
    });

};
