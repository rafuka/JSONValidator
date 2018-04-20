

var uploadBtn = document.getElementById('upload-btn');
var validateBtn = document.getElementById('validate-btn');
var inputArea = document.getElementById('input-area');
var resultArea = document.getElementById('result')

uploadBtn.addEventListener('input', handleUpload, false);
validateBtn.addEventListener('click', handleValidate, false);

// Different regex for the different valid key - value json pairs
var stringRegex = /"[^"]+"\s*:\s*"[^"]*"/;
var booleanRegex = /"[^"]+"\s*:\s*(true|false)/;
var numberRegex = /"[^"]+"\s*:\s*\d+/;
var objectRegex = /"[^"]+"\s*:\s*{.*}/;
var nullRegex = /"[^"]+"\s*:\s*null/;
var arrayRegex = /"[^"]+"\s*:\s*\[.*\]/;

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

    if (jsonString[0] !== '{' || jsonString[jsonString.length - 1] !== '}') {
        console.log('INVALID, MISSING OPENING OR CLOSING CURLY BRACKET(S)');
    }
    else {
        jsonString = jsonString.slice(1,jsonString.length - 1).trim();

        var jsonArr = jsonString.split(/,(?=\s*".*?"\s*:)/);
        console.log(jsonArr);
        console.log('jsonArr: ' + jsonArr.length);
        var valid = true;

        for (var i = 0; i < jsonArr.length; i++) {

            var keyValuePair = jsonArr[i].trim();

            if (stringRegex.exec(keyValuePair) && stringRegex.exec(keyValuePair)[0] === keyValuePair) {
                console.log('string- ' + keyValuePair);
            }
            else if (booleanRegex.exec(keyValuePair) && booleanRegex.exec(keyValuePair)[0] === keyValuePair) {
                console.log('boolean- ' + keyValuePair);
            }
            else if (numberRegex.exec(keyValuePair) && numberRegex.exec(keyValuePair)[0] === keyValuePair) {
                console.log('number- ' + keyValuePair);
            }
            else if (objectRegex.exec(keyValuePair) && objectRegex.exec(keyValuePair)[0] === keyValuePair) {
                console.log('object- ' + keyValuePair);
            }
            else if (nullRegex.exec(keyValuePair) && nullRegex.exec(keyValuePair)[0] === keyValuePair) {
                console.log('null- ' + keyValuePair);
            }
            else if (arrayRegex.exec(keyValuePair) && arrayRegex.exec(keyValuePair)[0] === keyValuePair) {
                console.log('array- ' + keyValuePair);   
            }
            else if ((countChars(keyValuePair, '[') > countChars(keyValuePair, ']')) ||
                     (countChars(keyValuePair, '{') > countChars(keyValuePair, '}')) ) {

                // Repair broken key value pairs

                var j = i;
            
                do {
                    j++;
                    keyValuePair += jsonArr[j];
                } while (((countChars(keyValuePair, '[') > countChars(keyValuePair, ']')) ||
                         (countChars(keyValuePair, '{') > countChars(keyValuePair, '}'))) &&
                         j < jsonArr.length - 1);

                var type = 'object';

                for (var x = keyValuePair.indexOf(':'); x < keyValuePair.length; x++) {

                    if (keyValuePair[x] === '[') {
                        type = 'array';
                        break;
                    }
                    else if (keyValuePair[x] === '{') break;
                }
                console.log(type + '- ' + keyValuePair);
                i = j;
            }
            else {
               console.log('there\'s an error in key/value pair: ' + keyValuePair);
                valid = false;
            }

        }

        if (!valid) result.classList.add('invalid');
        else result.classList.remove('invalid');
    }
}