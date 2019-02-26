function loadcsv() {
    $("#files").click();
    $(() => {
        $("#files").change(loadCodeCallback);
    });
}

/**
 * 
 * @param {event Handler} e 
 */


function loadCodeCallback(e) {
    var files = document.getElementById('files').files;

    if (!files.length) {
        alert('Error: no file selected!!');
        console.log("Invalid Selection");
        return false;
    }

    //if (loadVerbose) {
        for (var i = 0; i < files.length; i++) {
            console.log("Filename: " + files[i].name);
            console.log("Type: " + files[i].type);
            console.log("Size: " + files[i].size + " bytes");
        }
    //}

    // Validate Extensions
    // If file isn't a kjs or js file, then alert and quit. 
    var allowedExtensions = /(\.csv)$/i;

    if (!allowedExtensions.exec(files[0].name)) {
        alert('Please upload file having extensions .js/.kjs only.');
        return false;
    }

    var file = files[0];
    var start = 0;
    var stop = file.size - 1;

    if (stop == -1) {
        alert("Error: The file is empty.");
        return false;
    }

    var reader = new FileReader();

    reader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE) {

            codeToReload = evt.target.result;
           // $('#code-element').text(codeToReload);
            // Cookies.set('code', codeToReload);
            //globalObject.codeElement.setValue(codeToReload);
           
        }
    };

    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
    return true;
}

