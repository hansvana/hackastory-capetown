(function(engine) {

    var currState = null;

    //currState = engine.takeTurn(currState,0);
    function updateState(n) {

        if (currState === null){
            currState = engine.initialState;
        } else {
            currState = engine.takeTurn(currState, n );
        }

        console.log(currState);

        if (currState.turn !== null) {
            updateView( currState.turn.context,
                        currState.turn.options);
        } else {
            if (typeof currState.ending !== 'undefined'){
                endGame(currState);
            }
        }
    }
    updateState();

    function updateView(context, options) {

        var $newCard = $('#mainCard').clone()
            .attr('id','newCard')
            .attr('style', '')
            .appendTo( $('body') )
            .show()
            .transition({left: '0'}, 500, function() {
                $('#mainCard').remove();
                $newCard.attr('id','mainCard')
                    .css('position','static');
                handbookButton();
            });

        var $qText = $newCard.find('.questionText');
        var $qContainer = $newCard.find('.question');
        var $qVideo = $qContainer.find('.videoContainer');
        var $aList = $newCard.find('.answerList');
        var $aHint = $newCard.find('.aHint');
        // SET DESCRIPTION TEXT

        if (typeof(context.text) !== 'undefined')
            $qText.html(context.text);

        if (typeof(context.hint) !== 'undefined') {
            $aHint.attr('href',context.hint)
                .css('display','inline');
        } else {
            $aHint.css('display','none');
        }

        // SET DESCRIPTION MEDIA

        if (typeof(context.media) !== 'undefined')
            switch (context.media.type) {
                case "image" :
                    $qContainer.css('background-image','url('+ context.media.url +')');
                    $qVideo.css('visibility','hidden');
                    break;
                case "youtube" :
                    $qContainer.css('background-image','url(media/police-vague.jpg)');
                    $qVideo.empty().append(
                        $('<iframe>').attr('src', context.media.url)
                    ).css('visibility','visible');
                    break;
                case "logo" :
                    $qContainer.css('background-image','url(media/police-vague.jpg)');
                    $qVideo.empty().append(
                        $('<img>').attr('src', context.media.url).addClass('logo')
                    ).css('visibility','visible');
                    break;
            }

        // SET ANSWERS

        $aList.empty();

        var option;

        Object.keys(options).forEach(function(n) {

           option = options[n];

           $aList.append(
                $('<li>').html(option.label)
                    .on('click', function() {
                        //animate();
                        updateState(n);
                    })
           );
        });


    }

    function endGame(state){
        $('#mainCard').css('position','absolute')
            .transition({left: '-100%'}, 500, function() {
                $('#mainCard').remove();
            });

        var $endCard = $('<main>')
            .appendTo( $('body') )
            .append( $('<section>')
                .addClass('question')
                .css('background-image','url(media/police-disperce-tuition-protesters-3.jpg)')
                .append( $('<div>')
                    .addClass('videoContainer')
                )
                .append( $('<section>')
                    .addClass('gameOver')
                    .append( $('<header>').html('Thank you for playing!<nav class="restartHint">Restart</nav>'))
                    .append( $('<article>').html(makeEndText(state)))
                )
            )
            .transition({left: '0'}, 500, function() {

            });

        restartButton();

    }

    function makeEndText(state){
        var winTextPast = {true: "won",
                           false: "lost"};
        var txt = "";

        var endingVital;
        var endingVitalKey;

        // we expect only one of these
        Object.keys(state.ending.vitals).forEach(function(n) {
            endingVital = state.ending.vitals[n];
            endingVitalKey = n;
        });

        txt += "<h1>You've " + winTextPast[endingVital.win] + "!</h1>";

        txt += endingVital.explanation;

        txt += "<br><br><div id=\"fb-root\"></div><script>(function(d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = \"http://connect.facebook.net/en_US/all.js#xfbml=1\"; fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'facebook-jssdk'));</script><div class=\"fb-share-button\" data-href=\"http://hansvana.github.io/hackastory-capetown/\" data-layout=\"button_count\"></div>";

        txt += "<br><br>Made for <br><img src='media/logo-circle.png' style='width: 50%'>"
        txt += "<br><a href='https://www.hackastory.com/' target='_blank'>Hackastory Capetown 2016</a>";
        txt += "<br><br>Crowd Control is a prototype by";
        txt += "<br>JD Bothma";
        txt += "<br>Hans van Arken";
        txt += "<br>Kadija Patel";
        txt += "<br>Elna Schütz";
        txt += "<br>MunterMac";
        txt += "<br>";
        txt += "<br>Photos courtesy of the Daily Vox";
        txt += "<br>";
        txt += "<br>The right to protest courtesy of section 18 of the South African Constitution.";

        return txt;

    }

    $('#popover').find('.popoverClose').on('click', function() {
        $('#popover').hide();
    });

    function handbookButton() {
        $('body').find('.showHint').on('click', function () {
            $('#popover').show();
        });
    }
    handbookButton();

    function restartButton() {
        $('body').find('.restartHint').on('click', function () {
            location.reload();
        });
    }

})(engine);
