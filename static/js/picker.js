      var developerKey = 'AIzaSyBXw0iVqjQ0kwF1jx8QWaKGzdtM19lW7VE';
      // The Client ID obtained from the Google API Console. Replace with your own Client ID.
      var clientId = '130610955392-4nlg811kl98fc2etljlfrtf1e79jjp70.apps.googleusercontent.com';

      // Scope to use to access user's photos.
      var scope = 'https://www.googleapis.com/auth/drive.file';

      var pickerApiLoaded = false;
      var oauthToken;

      // Use the API Loader script to load google.picker and gapi.auth.
      function onApiLoad() {
        //Console.log("here");
        gapi.load('auth2', onAuthApiLoad);
        gapi.load('picker', onPickerApiLoad);
      }

      function onAuthApiLoad() {
        //Console.log("here");
        var authBtn = document.getElementById('auth');
        authBtn.disabled = false;
        authBtn.addEventListener('click', function() {
          gapi.auth2.authorize({
            client_id: clientId,
            scope: scope
          }, handleAuthResult);
        });
      }

      function onPickerApiLoad() {
        pickerApiLoaded = true;
        createPicker();
      }

      function handleAuthResult(authResult) {
        if (authResult && !authResult.error) {
          oauthToken = authResult.access_token;
          createPicker();
        }
      }

      // Create and render a Picker object for picking user Photos.
      function createPicker() {
        console.log();
        if (pickerApiLoaded && oauthToken) {
           var docsView = new google.picker.DocsView().
                                 setIncludeFolders(true).
                                 setSelectFolderEnabled(true);

          var picker = new google.picker.PickerBuilder().
              //addView(google.picker.ViewId.FOLDERS).
              enableFeature(google.picker.Feature.MINE_ONLY).
              enableFeature(google.picker.Feature.NAV_HIDDEN).
              setOAuthToken(oauthToken).
              setDeveloperKey(developerKey).
              addView(docsView).
              setCallback(pickerCallback).
              build();
          picker.setVisible(true);
        }
      }

      // A simple callback implementation.
      function pickerCallback(data) {
        console.log("here");
        var folderid = 'nothing';
        if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
          var doc = data[google.picker.Response.DOCUMENTS][0];
          folderid = doc[google.picker.Document.ID];
        }
        else{
          return;
        }

        var http = new XMLHttpRequest();
        var url = '/upload_folder';
        http.open('POST',url,true)

        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.onreadystatechange = function() {
                if(http.readyState == 4 && http.status == 200) {
                    document.getElementById('getscores').submit()
                    alert("success");
                }
            }
        console.log("here")
        http.send("folder="+folderid);

        


        //var message = 'You picked: ' + url;
        //document.getElementById('result').innerHTML = message;
      }