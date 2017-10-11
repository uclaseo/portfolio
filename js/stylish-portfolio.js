/*!
 * Start Bootstrap - Stylish Portfolio (http://startbootstrap.com/)
 * Copyright 2013-2017 Start Bootstrap
 * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap/blob/gh-pages/LICENSE)
 */

(function($) {
  "use strict"; // Start of use strict

  // Closes the sidebar menu
  $("#menu-close").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
  });

  // Opens the sidebar menu
  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
  });

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $("#sidebar-wrapper").removeClass("active");
  });

  //#to-top button appears after scrolling
  var fixed = false;
  $(document).scroll(function() {
    if ($(this).scrollTop() > 250) {
      if (!fixed) {
        fixed = true;
        $('#to-top').show("slow", function() {
          $('#to-top').css({
            position: 'fixed',
            display: 'block'
          });
        });
      }
    } else {
      if (fixed) {
        fixed = false;
        $('#to-top').hide("slow", function() {
          $('#to-top').css({
            display: 'none'
          });
        });
      }
    }
  });

})(jQuery); // End of use strict

// Disable Google Maps scrolling
// See http://stackoverflow.com/a/25904582/1607849
// Disable scroll zooming and bind back the click event
var onMapMouseleaveHandler = function(event) {
  var that = $(this);
  that.on('click', onMapClickHandler);
  that.off('mouseleave', onMapMouseleaveHandler);
  that.find('iframe').css("pointer-events", "none");
}
var onMapClickHandler = function(event) {
  var that = $(this);
  // Disable the click handler until the user leaves the map area
  that.off('click', onMapClickHandler);
  // Enable scrolling zoom
  that.find('iframe').css("pointer-events", "auto");
  // Handle the mouse leave event
  that.on('mouseleave', onMapMouseleaveHandler);
}
// Enable map zooming with mouse scroll when the user clicks the map
$('.map').on('click', onMapClickHandler);


jQuery(document).ready(function ($) {
  //set animation timing
  var animationDelay = 1000,
      //type effect
      typeLettersDelay = 100,
      selectionDuration = 500,
      typeAnimationDelay = selectionDuration + 500;
  initHeadline();


  function initHeadline() {
      //insert <i> element for each letter of a changing word
      singleLetters($('.cd-headline.letters').find('b'));
      //initialise headline animation
      animateHeadline($('.cd-headline'));
  }

  function singleLetters($words) {
      $words.each(function () {
          var word = $(this),
              letters = word.text().split(''),
              selected = word.hasClass('is-visible');
          for (i in letters) {
              if (word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
              letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
          }
          var newLetters = letters.join('');
          word.html(newLetters);
      });
  }

  function animateHeadline($headlines) {
      var duration = animationDelay;
      $headlines.each(function () {
          var headline = $(this);

          if (headline.hasClass('loading-bar')) {
              duration = barAnimationDelay;
              setTimeout(function () {
                  headline.find('.cd-words-wrapper').addClass('is-loading')
              }, barWaiting);
          } else if (headline.hasClass('clip')) {
              var spanWrapper = headline.find('.cd-words-wrapper'),
                  newWidth = spanWrapper.width() + 10
                  spanWrapper.css('width', newWidth);
          } else if (!headline.hasClass('type')) {
              //assign to .cd-words-wrapper the width of its longest word
              var words = headline.find('.cd-words-wrapper b'),
                  width = 0;
              words.each(function () {
                  var wordWidth = $(this).width();
                  if (wordWidth > width) width = wordWidth;
              });
              headline.find('.cd-words-wrapper').css('width', width);
          };

          //trigger animation
          setTimeout(function () {
              hideWord(headline.find('.is-visible').eq(0))
          }, duration);
      });
  }

  function hideWord($word) {
      var nextWord = takeNext($word);

      if ($word.parents('.cd-headline').hasClass('type')) {
          var parentSpan = $word.parent('.cd-words-wrapper');
          parentSpan.addClass('selected').removeClass('waiting');
          setTimeout(function () {
              parentSpan.removeClass('selected');
              $word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
          }, selectionDuration);
          setTimeout(function () {
              showWord(nextWord, typeLettersDelay)
          }, typeAnimationDelay);

      } else if ($word.parents('.cd-headline').hasClass('letters')) {
          var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
          hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
          showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

      } else if ($word.parents('.cd-headline').hasClass('clip')) {
          $word.parents('.cd-words-wrapper').animate({
              width: '2px'
          }, revealDuration, function () {
              switchWord($word, nextWord);
              showWord(nextWord);
          });

      } else if ($word.parents('.cd-headline').hasClass('loading-bar')) {
          $word.parents('.cd-words-wrapper').removeClass('is-loading');
          switchWord($word, nextWord);
          setTimeout(function () {
              hideWord(nextWord)
          }, barAnimationDelay);
          setTimeout(function () {
              $word.parents('.cd-words-wrapper').addClass('is-loading')
          }, barWaiting);

      } else {
          switchWord($word, nextWord);
          setTimeout(function () {
              hideWord(nextWord)
          }, animationDelay);
      }
  }

  function showWord($word, $duration) {
      if ($word.parents('.cd-headline').hasClass('type')) {
          showLetter($word.find('i').eq(0), $word, false, $duration);
          $word.addClass('is-visible').removeClass('is-hidden');

      } else if ($word.parents('.cd-headline').hasClass('clip')) {
          $word.parents('.cd-words-wrapper').animate({
              'width': $word.width() + 10
          }, revealDuration, function () {
              setTimeout(function () {
                  hideWord($word)
              }, revealAnimationDelay);
          });
      }
  }

  function hideLetter($letter, $word, $bool, $duration) {
      $letter.removeClass('in').addClass('out');

      if (!$letter.is(':last-child')) {
          setTimeout(function () {
              hideLetter($letter.next(), $word, $bool, $duration);
          }, $duration);
      } else if ($bool) {
          setTimeout(function () {
              hideWord(takeNext($word))
          }, animationDelay);
      }

      if ($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
          var nextWord = takeNext($word);
          switchWord($word, nextWord);
      }
  }

  function showLetter($letter, $word, $bool, $duration) {
      $letter.addClass('in').removeClass('out');

      if (!$letter.is(':last-child')) {
          setTimeout(function () {
              showLetter($letter.next(), $word, $bool, $duration);
          }, $duration);
      } else {
          if ($word.parents('.cd-headline').hasClass('type')) {
              setTimeout(function () {
                  $word.parents('.cd-words-wrapper').addClass('waiting');
              }, 200);
          }
          if (!$bool) {
              setTimeout(function () {
                  hideWord($word)
              }, animationDelay)
          }
      }
  }

  function takeNext($word) {
      return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
  }

  function takePrev($word) {
      return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
  }

  function switchWord($oldWord, $newWord) {
      $oldWord.removeClass('is-visible').addClass('is-hidden');
      $newWord.removeClass('is-hidden').addClass('is-visible');
  }

  $(".arrow").on('click', function() {
    $(".hidden").show({
      duration: 500,
      easing: 'swing'
    });
    $(this).hide();
  })

  // $(".arrow").click(function() {
  //   $(".hidden").first().show(200, function showNext() {
  //     $(this).next(".hidden").show(200, showNext);
  //   });
  //   $(this).hide();
  // });


});