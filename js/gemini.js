var myStorage = {
    bgColor: "black",
    textColor: "white",
    fontSize: "12px",
    linkColor: "blue",
    fontFamily: "courier new"
}
$(function() {
    if (localStorage.getItem("bgColor") !== null) {
        bgColor = localStorage.getItem('bgColor');
        $('#bgcolor').val(bgColor);
        $(':root').css('--bg-color', bgColor);
    }
    if (localStorage.getItem("textColor") !== null) {
        textColor = localStorage.getItem('textColor');
        $('#textcolor').val(textColor);
        $(':root').css('--text-color', textColor);
    }
    if (localStorage.getItem("linkColor") !== null) {
        linkColor = localStorage.getItem('linkColor');
        $('linkColor').val(linkColor);
        $(':root').css('--link-color', linkColor);
    }
    if (localStorage.getItem("fontSize") !== null) {
        fontSize = localStorage.getItem('fontSize');
        $('fontSize').val(fontSize);
        $(':root').css('--font-size', fontSize);
    }
    if (localStorage.getItem("fontFamily") !== null) {
        fontFamily = localStorage.getItem('bgColor');
        $('fonts').val(fontFamily);
        $(':root').css('--font-family', fontFamily);
    }
});

$(function() {
  
        $("a").on("click", function(event) {

            link = $(this).attr('href');
            var firstChar = link[0];

            if (firstChar !== '/') {
                event.preventDefault();
                console.log(link);
                window.open(link, '_blank');
                return false;
            }
        });
$('#bgcolor').on("change", function(event) {
    var bgColor = $(this).val();
    document.documentElement.style.setProperty('--bg-color', bgColor);
    myStorage.bgColor = bgColor;
    localStorage.setItem('bgColor', myStorage.bgColor);
});

$('#textcolor').on("change", function(event) {
    var textColor = $(this).val();
    document.documentElement.style.setProperty('--text-color', textColor);
    myStorage.textColor = textColor;
    localStorage.setItem('textColor', myStorage.textColor);
});


$('#fontSize').on("input", function(event) {
    var fontSize = $(this).val();
    document.documentElement.style.setProperty('--font-size', fontSize + "px");
    myStorage.fontSize = fontSize;
    localStorage.setItem('fontSize', myStorage.fontSize);

});

$('#linkColor').on("input", function(event) {
    var linkColor = $(this).val();
    document.documentElement.style.setProperty('--link-color', linkColor);
    myStorage.linkColor = linkColor;
    localStorage.setItem('linkColor', myStorage.linkColor);
});

$('#fonts').on("input", function(event) {
    var fontFamily = $(this).val();
    document.documentElement.style.setProperty('--font-family', fontFamily);
    myStorage.fontFamily = fontFamily;
    localStorage.setItem('fontFamily', myStorage.fontFamily);
});
});