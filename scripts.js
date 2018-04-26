

var uploadBtn = document.getElementById('upload-btn');
var validateBtn = document.getElementById('validate-btn');
var inputArea = document.getElementById('input-area');
var resultArea = document.getElementById('result')

uploadBtn.addEventListener('input', handleUpload, false);
validateBtn.addEventListener('click', handleValidate, false);

// Different KeyValueRegex for the different valid key - value json pairs

var stringKeyValueRegex = /"[^"]+"\s*:\s*"[^"]*"/;
var booleanKeyValueRegex = /"[^"]+"\s*:\s*(true|false)/;
var numberKeyValueRegex = /"[^"]+"\s*:\s*\d+/;
var objectKeyValueRegex = /"[^"]+"\s*:\s*{.*}/;
var nullKeyValueRegex = /"[^"]+"\s*:\s*null/;
var arrayKeyValueRegex = /"[^"]+"\s*:\s*\[.*\]/;

// Different KeyValueRegex for json valid values (except array and object)

var stringRegex = /\"[^"]+\"/;
var numberRegex = /[0-9]+/;
var booleanRegex = /true|false/;
var nullRegex = /null/;

function countChars(str, char) {
    var count = 0;
    for (var i = 0; i < str.length; i++) {
        if (str[i] === char) count++;
    }
    return count;
}

function handleUpload(event) {

	var file = this.files[0];
	var fr = new FileReader();

	fr.addEventListener('loadend', function(e) {
		inputArea.value = fr.result;
	});

	fr.readAsText(file);	
}

function handleValidate(event) {
	var jsonString = inputArea.value.trim();
    var arrays = [];
    var objects = [];

    resultArea.innerHTML = '';

    if (jsonString[0] !== '{' || jsonString[jsonString.length - 1] !== '}') {
        //console.log('INVALID, MISSING OPENING OR CLOSING CURLY BRACKET(S)');
        var errorMsgP = document.createElement('p');
        var errorMsgText = document.createTextNode('Invalid: Missing opening or closing curly bracket(s)');
        errorMsgP.appendChild(errorMsgText);
        resultArea.appendChild(errorMsgP);
        valid = false;
    }
    else {
        jsonString = jsonString.slice(1,jsonString.length - 1).trim();
        var jsonArr = jsonString.split(/,(?!(?:[^{]*}|[^\[]*\]))/);
        var valid = true;

        for (var i = 0; i < jsonArr.length; i++) {

            var keyValuePair = jsonArr[i].trim();

            // Check if the any key value pair is not matched by the correspondant regex. If they all match (no errors),
            // and if the value is composed by an array or object, add the array/object to an array in order to check the
            // validity of its values.
            if (!((stringKeyValueRegex.exec(keyValuePair) && stringKeyValueRegex.exec(keyValuePair)[0] === keyValuePair) ||
                  (booleanKeyValueRegex.exec(keyValuePair) && booleanKeyValueRegex.exec(keyValuePair)[0] === keyValuePair) ||
                  (numberKeyValueRegex.exec(keyValuePair) && numberKeyValueRegex.exec(keyValuePair)[0] === keyValuePair) ||
                  (nullKeyValueRegex.exec(keyValuePair) && nullKeyValueRegex.exec(keyValuePair)[0] === keyValuePair) ||
                  (objectKeyValueRegex.exec(keyValuePair) && objectKeyValueRegex.exec(keyValuePair)[0] === keyValuePair) ||
                  (arrayKeyValueRegex.exec(keyValuePair) && arrayKeyValueRegex.exec(keyValuePair)[0] === keyValuePair))) {

                var errorMsgP = document.createElement('p');
                var errorMsgText = document.createTextNode('error in key/value pair: < ' + keyValuePair + ' >');
                errorMsgP.appendChild(errorMsgText);
                resultArea.appendChild(errorMsgP);
                valid = false;
            }
            else if (objectKeyValueRegex.exec(keyValuePair) && objectKeyValueRegex.exec(keyValuePair)[0] === keyValuePair) {
                objects.push(keyValuePair);
            }
            else if (arrayKeyValueRegex.exec(keyValuePair) && arrayKeyValueRegex.exec(keyValuePair)[0] === keyValuePair) {
                arrays.push(keyValuePair);
            }
        }

        // Check if there are arrays and/or objects, and there was not an error,
        // in which case check that their values are valid.

        if (valid && arrays.length > 0) {

            // Check for the value of the key/value pair, 
            for (var i = 0, len = arrays.length; i < len; i++) {
                // Get array's values without the brackets
                var values = arrays[i].slice(arrays[i].indexOf('[') + 1, arrays[i].length - 1);

                var valueArr = values.split(',');

                for (var j = 0; j < valueArr.length; j++) {

                    var value = valueArr[j].trim();

                    // Check that every value is a valid json value (except array or object)
                    if (!((stringRegex.exec(value) && stringRegex.exec(value)[0] === value) ||
                        (numberRegex.exec(value) && numberRegex.exec(value)[0] === value) ||
                        (booleanRegex.exec(value) && booleanRegex.exec(value)[0] === value) ||
                        (nullRegex.exec(value) && nullRegex.exec(value)[0] === value))) {

                        // console.log('error in key/value pair: ' + arrays[i]);

                        var errorMsgP = document.createElement('p');
                        var errorMsgText = document.createTextNode('error in key/value pair: < ' + arrays[i] + ' >');
                        errorMsgP.appendChild(errorMsgText);
                        resultArea.appendChild(errorMsgP);
                        valid = false;
                    }
                }
            }
        }

        if (valid && objects.length > 0) {

            for (var i = 0, len = objects.length; i < len; i++) {
                var values = objects[i].slice(objects[i].indexOf('{') + 1, objects[i].length - 1);

                var valueArr = values.split(',');

               // console.log(valueArr);

                for (var j = 0; j < valueArr.length; j++) {

                    var value = valueArr[j].trim();

                    // Check that every value is a valid key/value pair
                    if (!((stringKeyValueRegex.exec(value) && stringKeyValueRegex.exec(value)[0] === value) ||
                          (numberKeyValueRegex.exec(value) && numberKeyValueRegex.exec(value)[0] === value) ||
                          (nullKeyValueRegex.exec(value) && nullKeyValueRegex.exec(value)[0] === value) ||
                          (booleanKeyValueRegex.exec(value) && booleanKeyValueRegex.exec(value)[0] === value))) {

                        // console.log('error in key/value pair: ' + objects[i]);

                        var errorMsgP = document.createElement('p');
                        var errorMsgText = document.createTextNode('error in key/value pair: < ' + objects[i] + ' >');
                        errorMsgP.appendChild(errorMsgText);
                        resultArea.appendChild(errorMsgP);
                        valid = false;
                    }
                }
            }
        }   
    }

    if (!valid) {
        result.classList.add('invalid');
        result.classList.remove('valid');
    }
    else {
        result.classList.remove('invalid');
        result.classList.add('valid');
        var msgP = document.createElement('p');
        var msgText = document.createTextNode('Valid!');
        msgP.appendChild(msgText);
        resultArea.appendChild(msgP)
                        
    }
}