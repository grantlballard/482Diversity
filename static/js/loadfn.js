/*
    Could have made this a 
    on click fn but oh well
    just clicks the input which 
    brings up the user's file browser
*/
function loadcsv() {
    $("#files").click();
    //$("#files").change();
}


/*
    Bind handlesel function to file change
    Whenever user chooses  file it calls handlesel

*/
$(document).on("change" ,"#files" ,function(){handlesel();});


/*
    function to handle the file the user uploaded
    reads in the file's text content, file needs to be a 
    csv or else the user will get an alert.
    Returns True on success, False otherwise
*/
function handlesel() {
    console.log("In changefn");
    var files = document.getElementById('files').files;

    if (!files.length) {
        alert('Error: no file selected!!');
        console.log("Invalid Selection");
        return false;
    }

    for (var i = 0; i < files.length; i++) {
        console.log("Filename: " + files[i].name);
        console.log("Type: " + files[i].type);
        console.log("Size: " + files[i].size + " bytes");
    }
    

    // Validate Extensions
    // If file isn't a csv file, then alert and quit. 
    var allowedExtensions = /(\.csv)$/i;

    if (!allowedExtensions.exec(files[0].name)) {
        alert('Please upload .csv only.');
        return false;
    }
    // Determine start and stop positions for file
    var file = files[0];    
    var start = 0;
    var stop = file.size - 1;

    //check if file is empty
    if (stop == -1) {
        alert("Error: The file is empty.");
        return false;
    }

    var reader = new FileReader();
    // Once done reading in flle we can edit the text
    reader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE) {
            response_text = evt.target.result;
            //console.log("here");
            console.log(response_text);
        }
    };

    // Read in file as string
    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
    return true;
}

