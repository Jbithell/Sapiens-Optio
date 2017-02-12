(function($){
  $(function(){
      var apiroot = "https://engine.sapiensoptio.com/";
      console.log("Window Loaded");
        if ($('html').height() - $('body').height() > 0) {
            //Fix footer height
            //TODO Refactor this section
            $("#index-banner").height($("#index-banner").height()+($('html').height() - $('body').height()));
            console.log("Applying page height hotfix");
        }
      //Load Google Anylitics Functions
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      $('#reportissuemodal').modal();


      //Define Core Functions
      function translate(type, text) {
          if (text.length < 1) {
              //Check textbox is filled!
              Materialize.toast('Please enter text to translate', 3*1000,'');
              $("#loader").fadeOut();
              return false;
          } else {
              var q = text;
              //Flip to loading
              var starttime = $.now();

              $.ajax({
                  type: "POST",
                  url: apiroot + "?q=" + q + "&" + (type == "lateng" ? "lateng" : "englat"),
                  dataType: "text",
                  success: function(data) {
                      $("#loader").fadeOut(function(){
                          $("#result").html(data);
                          $("#translateresult").fadeIn();
                      });
                      console.log(data);
                      var time = ($.now() - starttime)/1000;
                      $("#resulttagline").html(time + " seconds");
                  },
                  error: function(e) {
                      $("#loader").fadeOut();
                      Materialize.toast('Sorry - we were unable to run your translation - please try again later or contact support', 5*1000,'',function(){
                          gohome();
                      });
                      console.log("Error: " + e.message);
                  }
              });
              return true;


          }
      }
      function gohome() {
          $("#footer").fadeIn();
          $("#translate-banner").fadeOut(function () {
              $("#index-banner").fadeIn();
          });
      }
      function downloadprintout(q, result) {
          var doc = new jsPDF();
          doc.text("Sapiens Optio - Translation Results for " + q + "\n\n\n\n" + result, 10, 10);
          doc.output('save', 'sapiensoptioprintout.pdf');

      }


      //Detect if a mobile device
      var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
      if ( app ) {
          $(".hideapp").hide();
          $(".noapplink").attr("href", "#");
          console.log("App version");
      } else {
          console.log("Full Browser Version");

          $(".hideapp").fadeIn();

          ga('create', 'UA-55192830-1', 'auto');
          ga('send', 'pageview');
      }

      //Event Handlers and Hooks
      $(".starttranslation").click(function(){
          $("#footer").fadeOut();
          $("#index-banner").fadeOut(function () {
              $("#translate-banner").fadeIn(function () {
                  $("#q").focus();
              });

          });


      });

      $("#q").keyup(function(event){
          if(event.keyCode == 13){
              $("#translateresult").fadeOut();
              $("#loader").fadeIn();
              translate("lateng", $("#q").val());
          }

      });
      $("#latengtranslatebutton").click(function() {
          $("#translateresult").fadeOut();
          $("#loader").fadeIn();


          translate("lateng", $("#q").val());
          return true;
      });
      $("#englattranslatebutton").click(function() {
          $("#translateresult").fadeOut();
          $("#loader").fadeIn();
          translate("englat", $("#q").val());
      });
      $("#latengtranslatebuttonrandom").click(function() {
          $("#footer").fadeOut();
          $("#index-banner").fadeOut(function () {
              $("#translate-banner").fadeIn();
          });
          $("#translateresult").fadeOut();
          $("#loader").fadeIn();
          $.ajax({
              url: apiroot + "random.php?lang=lat", success: function (result) {
              $("#q").val(result);
              translate("lateng", result);
          }});
      });
      $("#englattranslatebuttonrandom").click(function() {
          $("#footer").fadeOut();
          $("#index-banner").fadeOut(function () {
              $("#translate-banner").fadeIn();
          });
          $("#translateresult").fadeOut();
          $("#loader").fadeIn();
          $.ajax({
              url: apiroot + "random.php?lang=eng", success: function (result) {
              $("#q").val(result);
              translate("englat", result);
          }});
      });

      $("#printout").click(function() {
          downloadprintout($("#q").val(), $("#result").html());
      });
      $(".reportissue").click(function() {
          $('#reportissuemodal').modal('open');
      });

  }); // end of document ready
})(jQuery); // end of jQuery name space