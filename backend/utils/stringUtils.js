// stringUtils.js

function capitalizeAndClean(str) {
    // Remove leading, trailing, and extra spaces
    console.log(str);
    str = str.trim().replace(/\s+/g, ' ');

    // Capitalize the first character of each word
    str = str.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
    console.log(str);

    return str;
}

module.exports = capitalizeAndClean;
