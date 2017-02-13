(function ($) {
    //Define Global Variables
    var apiroot = "https://engine.sapiensoptio.com/";
    var webcheckurl = "https://jbithell.github.io/Connection-Check/text1.txt";
    $(function () {
        //Fix the footer height - to ensure there isn't a white gap below it
        if ($('html').height() - $('body').height() > 0) {
            //TODO Refactor this section
            $("#index-banner").height($("#index-banner").height() + ($('html').height() - $('body').height()));
            console.log("Applying page height hotfix");
        }
        //Make the modals modals
        $('.modal').modal();

        //Load Google Analytics Functions, but don't trigger a hit
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');


        //Detect if running on a local host, such as an app, or if running on website (especially for Phonegap and Cordova
        var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
        if (app) {
            $(".hideapp").hide();
            $(".noapplink").attr("href", "#");
        } else {
            //Full browser version
            $(".hideapp").fadeIn();
            //Trigger a Google Anylitics Page view
            ga('create', 'UA-55192830-1', 'auto');
            ga('send', 'pageview');
        }


        //      Define Core Functions
        //Reset divs to display a faux-homepage
        function gohome() {
            $("#translate-banner,#loader,#index-banner,#footer").stop(); //You have to stop all animations otherwise there becomes a conflict

            $("#loader").fadeOut();
            $("#translate-banner").fadeOut(function () {
                $("#index-banner").fadeIn();
                $("#footer").fadeIn();
            });
        }

        //Error thrown when ajax errors out
        function ajaxerrorout(e) {
            $.ajax({
                type: "GET",
                url: webcheckurl,
                dataType: "text",
                cache: false,
                success: function (data) {
                    if (data == 'ONLINE') {
                        console.log("Device offline but server online");
                        $('.toastmessage').hide();
                        Materialize.toast('You\'re offline - please check your internet connection', 5 * 1000, 'toastmessage offlinetoastmessage');
                        gohome();
                    } else {
                        console.log("Server offline but device online");
                        gohome();
                        $("#serverofflinemodal").modal('open');
                    }
                },
                error: function (e) {
                    console.log("Device most likely offline");
                    $('.toastmessage').hide();
                    Materialize.toast('You\'re offline - please check your internet connection', 5 * 1000, 'toastmessage offlinetoastmessage');
                    gohome();
                    console.log("Github check error: " + e);
                }
            });
            console.log("First (main) AJAX Call error: " + e);
        }

        //Translate function - used by all translation workflows
        function translate(type, q) {
            if (q.length < 1) { //Check textbox is filled!
                $('.toastmessage').fadeOut(function () {
                    Materialize.toast('Please enter text to translate', 3 * 1000, 'toastmessage');
                });
                $("#loader").fadeOut();
                return false;
            } else {
                var starttime = $.now(); //Time each translation
                //Main AJAX Request to API
                $.ajax({
                    type: "POST",
                    url: apiroot + "?q=" + q + "&" + (type == "lateng" ? "lateng" : "englat"),
                    dataType: "text",
                    cache: false,
                    success: function (data) {
                        $("#loader").fadeOut(function () {
                            $("#result").html(data);
                            $("#translateresult").fadeIn();
                        });
                        $("#resulttagline").html((($.now() - starttime) / 1000) + " seconds");
                    },
                    error: function (e) {
                        ajaxerrorout(e);
                    }
                });
                return true;
            }
        }


        function downloadprintout(q, result) {
            //Generate a printout of the translation - for sharing etc.
            //TODO Make the printout prettier
            var doc = new jsPDF();
            doc.text("Sapiens Optio - Translation Results for " + q + "\n\n\n\n" + result, 10, 10);
            doc.output('save', 'sapiensoptioprintout.pdf');

        }

        //Event Handlers and Hooks
        $(".starttranslation").click(function () {
            $("#footer").fadeOut();
            $("#index-banner").fadeOut(function () {
                $("#translate-banner").fadeIn(function () {
                    $("#q").focus();
                });

            });


        });
        $("#q").keyup(function (event) {
            //Enter key in textbox
            if (event.keyCode == 13) {
                $("#translateresult").fadeOut();
                $("#loader").fadeIn();
                translate("lateng", $("#q").val());
            }

        });

        $("#latengtranslatebutton").click(function () {
            $("#translateresult").fadeOut();
            $("#loader").fadeIn();
            translate("lateng", $("#q").val());
            return true;
        });
        $("#englattranslatebutton").click(function () {
            $("#translateresult").fadeOut();
            $("#loader").fadeIn();
            translate("englat", $("#q").val());
        });

        //Random translation buttons
        $("#latengtranslatebuttonrandom").click(function () {
            $("#footer").fadeOut();
            $("#index-banner").fadeOut(function () {
                $("#translate-banner").fadeIn();
            });
            $("#translateresult").fadeOut();
            $("#loader").fadeIn();
            $.ajax({
                url: apiroot + "random.php?lang=lat",
                cache: false,
                success: function (result) {
                    $("#q").val(result);
                    translate("lateng", result);
                },
                error: function (e) {
                    ajaxerrorout(e);
                }
            });
        });
        $("#englattranslatebuttonrandom").click(function () {
            $("#footer").fadeOut();
            $("#index-banner").fadeOut(function () {
                $("#translate-banner").fadeIn();
            });
            $("#translateresult").fadeOut();
            $("#loader").fadeIn();
            $.ajax({
                url: apiroot + "random.php?lang=eng",
                cache: false,
                success: function (result) {
                    $("#q").val(result);
                    translate("englat", result);
                },
                error: function (e) {
                    ajaxerrorout(e);
                }
            });
        });

        //Printout button - for generating a pdf using function
        $("#printout").click(function () {
            downloadprintout($("#q").val(), $("#result").html());
        });

        //Gohome link
        $(".gohome").click(function () {
            gohome();
        });

        //Display report issue modal
        $(".reportissue").click(function () {
            $('#reportissuemodal').modal('open');
        });

    }); // end of document ready
})(jQuery); // end of jQuery name space