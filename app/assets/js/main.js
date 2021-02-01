var AJAX_URL = 'https://www.picuki.com/app/controllers/'; //$('#ajaxurl').val();//ajax.php?
var PROCESSING = false;
var proxy = 'https://cors-anywhere.herokuapp.com/'
var folders = ['https://www.picuki.com','https://www.picuki.com']//'https://gramho.com']; //$('#folder').val(); //
var folder = proxy + folders[Math.round(Math.random())];

function adBlockDetected() {
    $('.adv').closest('li').remove();
    $('.adv').remove();

    if($('.box-photos > .box-photo').length > 1) {
      //$('.box-photos > .box-photo').last().remove();
    }
    $('.sinle-photo-user').addClass('noad');
}

// get recent posts
function getRecentPosts(query) {
    $.ajax({
        type: 'POST',
        url: AJAX_URL,
        data: {get_posts: 'true', query: query, count: 12, type: 'tag'},
        cache: false,
        dataType: 'json',
        success: function( response){
            $('#recent_post_palce').html(response.posts);
        }
    });
}

// get similar users
function getSimilarProfiles(query) {
    $.ajax({
        type: 'POST',
        url: AJAX_URL,
        data: {search_users: 'true', query: query, count: 5, exclude: query},
        cache: false,
        dataType: 'json',
        success: function(response){
            if(response.profiles.length == 0) {
                $('#similar_users_place').closest('.similar-users').remove();
            }
            $('#similar_users_place').html(response.profiles);
        }
    });
}

// get media comments
function getComments(query, last, sort, offset) {
    var loadMore = $('.load-more');

    $.ajax({
        type: 'POST',
        url: AJAX_URL,
        data: {get_comments : 'true', query: query, last: last, sort: sort, offset: offset},
        dataType: 'JSON',
        cache: false,
        success: function(response){
            $('#commantsPlace').append(response.comments);
            $('#commentsCount').text(response.count);

            loadMore.attr('data-last', response.last);
            loadMore.find('span').text(response.nextCount);

            if(!response.more) {
                loadMore.addClass('hidden');
            } else {
                loadMore.removeClass('hidden');
            }
        }
    });
}
function getComments(query, last, offset) {
    var loadMore = $('.load-more');

    $.ajax({
        type: 'POST',
        url: AJAX_URL,
        data: {get_comments : 'true', query: query, last: last, offset: offset},
        dataType: 'JSON',
        cache: false,
        success: function(response){
            $('#commantsPlace').append(response.comments);
            $('#commentsCount').text(response.count);
            loadMore.attr('data-last', response.last);
            loadMore.find('span').text(response.nextCount);

            if(response.more == false) {
                loadMore.addClass('hidden');
            } else {
                loadMore.removeClass('hidden');
            }
        }
    });
}


//var loading = false;
// load more posts
function loadMorePosts(loadMoreBtn, hardNext) {

    if(PROCESSING == true)
        return false;

    PROCESSING = true;

    var _this = loadMoreBtn;

    var next = _this.attr('data-next');
    var query = _this.attr('data-query');
    var type = _this.attr('data-type');

    var filter_type = _this.attr('data-filter-type');
    var filter_time = _this.attr('data-filter-time');
    var filter_filter = _this.attr('data-filter-filter');
    var filter_sortby = _this.attr('data-filter-sortby');

    $.ajax({
        type: 'POST',
        url: AJAX_URL,
        data: {get_posts: 'true', next: next, query: query, type: type, filter_type: filter_type, filter_time: filter_time, filter_filter: filter_filter, filter_sortby: filter_sortby},
        cache: false,
        dataType: 'json',
        success: function(response){
            if(hardNext != 'none') {
                $('.box-photos').html('');
            }
            $('.box-photos').append(response.posts);
            
            if(typeof fuckAdBlock === 'undefined') {
                adBlockDetected();
            }
            
            PROCESSING = false;

            if (response.more == false) {
                _this.closest('div').addClass('hidden');
            } else {
                _this.closest('div').removeClass('hidden');
                if(hardNext != 'none') {
                    _this.attr('data-next', hardNext);
                } else {
                    _this.attr('data-next', response.next);
                }
            }
        },
        error: function() {

        },
        beforeSend: function() {

        }
    });
}
/*
function loadMorePosts(loadMoreBtn) {

    if(loading == true)
        return false;

    loading = true;

    var _this = loadMoreBtn;

    var next = _this.data('next');
    var query = _this.data('query');
    var type = _this.data('type');

    $.ajax({
        type: 'POST',
        url: AJAX_URL,
        data: {get_posts: 'true', next: next, query: query, type: type},
        cache: false,
        dataType: 'json',
        success: function(response){
            $('.box-photos').append(response.posts);
            
            loading = false;

            if (response.more == false) {
                _this.remove();
            } else {
                _this.data('next', response.next);
            }
        }
    });
}
*/
/*
function loadMoreGrabbed(loadMoreBtn) {

    if(loading == true)
        return false;

    loading = true;

    var _this = loadMoreBtn;

    var next = _this.attr('data-next');
    var query = _this.attr('data-query');
    var type = _this.attr('data-type');

    $.ajax({
        type: 'POST',
        url: AJAX_URL,
        data: {get_posts: 'true', next: next, query: query, type: type},
        cache: false,
        dataType: 'json',
        success: function( response){
            $('.box-photos').append(response.posts);

            loading = false;

            if (response.more == false) {
                _this.remove();
            } else {
                _this.attr('data-next', response.next);
            }
        }
    });
}
*/

$('body').on('click', '.up-btn', function(e) {
    e.preventDefault();

    $('html, body').animate({
        scrollTop: 0
    }, 500);
});

$(window).scroll(function(e){

    /*
    if($('.load-more').length > 0) {
        var eTop = $('.load-more').offset().top;
        var offset = eTop - $(window).scrollTop() - $(window).height();
        
        if(offset <= 0) {
            var btn = $('.load-more-wrap .load-more');
            loadMorePosts(btn, 'none');
        }
    }
    */


    var y = $(this).scrollTop();
    if (y > 300) {
        $('.up-btn').addClass('visible');
    } else {
        $('.up-btn').removeClass('visible');
    }
});

function setResponsiveSearchPlaceholder() {
    if($(window).width() <= 900) {
        $('#searchform input[type="text"]').attr('placeholder', 'Search Instagram');
    } else {
        $('#searchform input[type="text"]').attr('placeholder', 'Search profiles, tags and locations');
    }
}

function showIconsAfterLoad() {
    $('.photo').each((index, element) => {
        $(element).imagesLoaded().done(() => {
            $(element).find('.video-icon').show();
            $(element).find('.full-screen').show();
            $(element).find('.download_button').show();
        });
    });
}

let site_url = '/peektogram/';//https://www.picuki.com/
let user_reg = new RegExp('profile/@', "ig");
let hashtag_reg = new RegExp('tag/#', "ig");

function createMedia(id, img, likes, comments, caption, caption_mormal, time, mediaNum, username = '', location = [], is_video = false, video_url = '', short_code = '', display_resources = []) {
    var google_ads_id = 'div-gpt-ad-1574936888745-' + mediaNum;
    var google_ads = '<div id=\'' + google_ads_id + '\' style=\'width: 300px; height: 250px; margin: 0 auto;\'>\n' +
        '</div>',
        google_ads_append = '',
        user_url = '',
        location_url = '', img = img.split(';'), i = 0,
	dr = display_resources.split('###');
	try {
	  var date_time = new Date(time * 1000).toUTCString();
	} catch(e){}
    if (mediaNum == 2 || mediaNum == 3 || mediaNum == 6) {
        // if (show_ads === true) {
        //     google_ads_append = '<div class="box-photo-p adv-p"><div class="box-photo adv">' + google_ads + '</div></div>';
        // }
    }
    //if (username != '') {
        user_url = '<a class="load-profile" data-username="' + username + '" href="' + site_url.substring(0,site_url.length-1) + ((typeof username == 'string' && username.indexOf('/') == -1) ? '#profile#' : '#search#') + username + '" ' + ( (username.indexOf('/') == 0) ? 'onclick="$(&quot;#searchform&quot;).find(&quot;#search-input&quot;).attr(&quot;value&quot;, &quot;'+ username +'&quot;); window.search(); return false;"' : '') +'>@' + username + '</a>';
    //}
    if ($.isEmptyObject(location) === false) {
        location_url = '<span class="icon-globe-alt"><a href="' + site_url.substring(0,site_url.length-1) + '#location#' + (location.slug ? location.slug : location.name)  + '#' + location.id + '" onclick="sessionStorage.setItem(&quot;data-location-id&quot;, &quot;'+ location.id + '&quot;); sessionStorage.setItem(&quot;data-location-name&quot;, &quot;'+ location.name + '&quot;);" oncontextmenu="localStorage.setItem(&quot;data-location-id&quot;, &quot;'+ location.id + '&quot;); localStorage.setItem(&quot;data-location-name&quot;, &quot;'+ location.name + '&quot;);">' + location.name + '</a></span>';
    }
//        '                    <a href="' + site_url + 'media/' + id + '">\n' +
    let content = google_ads_append + '<li><div class="box-photo" data-s="media">\n' +
        '                <div class="photo">\n' +
        '                    <a class="launchLightbox" data-video-poster="' + (dr[i].split(';')[0] || img[i]) + '" data-post-type="' + (is_video ? 'video' : 'image') + '" data-stories="stories" data-index="'+ i +'" href="' + (is_video ? video_url : img[i]) + '" data-window-page-url="' + site_url + '#media#' + id + '" data-shortcode="' + short_code + '" data-username="'+ username +'" data-location-slug="' + location.slug +'" data-location-name="'+ encodeURIComponent(location.name) +'" data-location-id="' + location.id + '" data-time="'+ date_time +'" data-likes="'+ likes +'" data-comments="'+ encodeURIComponent(comments) +'" data-display-resources="'+ display_resources +'" data-caption="' + encodeURIComponent(caption) +'">\n' +
        '                    \n' + (is_video ? '<div class="video-icon"><span class="flaticon-play-arrow"></span></div>' : '')  +
	//'			<table style="display: inline-block; overflow-y: scroll; max-height: 374px"><tbody>'+
	//(function(){ var z = ''; for(i=0;i < dr.length; i++) z = z +
        '                         <tr><img class="post-image" src="' + img[i] + '" alt="' + caption_mormal + '"></tr>\n'+
	//return z; })() +
	//'			</tbody></table>' +
        '                    </a>\n' +
        '                    \n' +
        '                </div>\n' +
        '\n' +
        '                <div class="photo-info">\n<div class="user-nickname mt-6">'
        + user_url +
        '</div>                    <div class="photo-description">\n' + caption + '</div>' +
        '<div class="photo-location">\n' +
        location_url +
        '                    </div>\n' +
        '                    </div>\n' +
        '<div class="post-footer">\n' +
        ' <div class="likes_comments_photo">\n' +
        '        <div class="likes_photo">\n' +
        '            <span class="flaticon-favorite-heart-button"></span>' + likes + '\n' +
        '        </div>\n' +
        '        <div class="comments_photo">\n' +
        '            <span class="flaticon-comment"></span>' + comments + '\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="time">\n' +
        '        <span aria-label="' + date_time + '" title="' + date_time + '">' + time_ago(time * 1000) + '</span>\n' +
        '    </div>\n' +
        '</div>\n' +
        '       \n' +
        '      \n' +
        '        </div></li>';

    return {
        content: content,
        ads: google_ads_append !== '',
        ads_id: google_ads_id,
    };
}
function time_ago(time) {

    switch (typeof time) {
        case 'number':
            break;
        case 'string':
            time = +new Date(time);
            break;
        case 'object':
            if (time.constructor === Date) time = time.getTime();
            break;
        default:
            time = +new Date();
    }
    var time_formats = [
        [60, 'second', 1], // 60
        [3600, 'minute', 60], // 60*60, 60
        [86400, 'hour', 3600], // 60*60*24, 60*60
        [604800, 'day', 86400], // 60*60*24*7, 60*60*24
        [2419200, 'week', 604800], // 60*60*24*7*4, 60*60*24*7
        [29030400, 'month', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [2903040000, 'year', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    ];
    var seconds = (+new Date() - time) / 1000,
        token = 'ago',
        list_choice = 1;

    if (seconds == 0) {
        return 'Just now'
    }
    if (seconds < 0) {
        seconds = Math.abs(seconds);
        token = 'from now';
        list_choice = 2;
    }
    var i = 0,
        format;
    let count;
    while (format = time_formats[i++])
        if (seconds < format[0]) {
            if (typeof format[2] == 'string')
                return format[list_choice];
            else {
                count = Math.floor(seconds / format[2]);
                return count + ' ' + format[1] + (count>1 ? 's' : '') + ' ' + token;
            }
        }
    return time;
}

$(document).ready(function () {

    if(typeof fuckAdBlock === 'undefined') {
        adBlockDetected();
    }

    $('.user-panel__filter_dropdown').on('click', function() {
        $(this).find('ul').toggleClass('active');
    });
    $('.user-panel__filter_dropdown ul li').on('click', function() {
        $(this).closest('.user-panel__filter_dropdown').find('span').text($(this).text());

        time = $(this).data('value');
        $.post(folder + "/app/controllers/ajax.php", {time: time, type: "get_ads_clicks_and_views"}, function (data) {
            data = JSON.parse(data);
            $('.overview_clicks').text(data.clicks);
            $('.overview_views').text(data.views);
        });
    });

    function disable_button($this) {
        $this.css('min-width', $this.outerWidth());
        $this.html('<div data-text="' + $this.text() + '" class="button-load-animation">\n' +
            '  <div class="bounce1"></div>\n' +
            '  <div class="bounce2"></div>\n' +
            '  <div class="bounce3"></div>\n' +
            '</div>');
        $this.prop('disabled', true);
    }

    function enable_button($this) {
        $this.text( $this.find('.button-load-animation').data('text'));
        $this.prop('disabled', false);
        $this.attr('style', '');
    }

    $('.register').on('submit', function(e) {
        e.preventDefault();
        $('.user-panel__form-error').hide();


        let _this = $(this);
        let email = _this.find('input[name="email"]');
        let password = _this.find('input[name="password"]');
        let repeat_password = _this.find('input[name="confirm_password"]');
        let error = 0;

        let button = _this.find('.user-panel__form-action button');
        disable_button(button);

        if(email.val().match(/^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,4}$/i)) {
            email.removeAttr('style');
        } else {
            email.css({'border-color':'#ff5919'});
            error++;
        }
        if (password.val() === repeat_password.val()) {
            password.removeAttr('style');
            repeat_password.removeAttr('style');
        } else {
            password.css({'border-color':'#ff5919'});
            repeat_password.css({'border-color':'#ff5919'});
            error++;
        }

        if (password.val() === '') {
            password.css({'border-color':'#ff5919'});
            error++;
        }
        if (error === 0) {
            $.post(folder + "/app/controllers/ajax.php", _this.serialize(), function (data) {
                if (data === 'ok') {
                    if ($('.promote-form').length > 0) {
                        window.location.href = folder + '/user-panel?ad-created';
                    } else {
                        window.location.href = folder + '/user-panel';
                    }
                } else {
                    $('.user-panel__form-error').find('span').text(data);
                    $('.user-panel__form-error').show();
                    enable_button(button);
                }
            });
        } else {
            $('.user-panel__form-error').find('span').text('Sorry, but you need to fill out all the fields.');
            $('.user-panel__form-error').show();
            enable_button(button);
        }
    });

    $('.login').on('submit', function(e) {
        e.preventDefault();
        $('.user-panel__form-error').hide();

        let _this = $(this);
        let email = _this.find('input[name="email"]');
        let password = _this.find('input[name="password"]');
        let error = 0;

        let button = _this.find('.user-panel__form-action button');
        disable_button(button);

        if(email.val().match(/^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,4}$/i)) {
            email.removeAttr('style');
        } else {
            email.css({'border-color':'#ff5919'});
            error++;
        }
        if (password.val() === '') {
            password.css({'border-color':'#ff5919'});
            error++;
        } else {
            password.removeAttr('style');
        }

        if (error === 0) {
            $.post(folder + "/app/controllers/ajax.php", _this.serialize(), function (data) {
                if (data === 'ok') {
                    window.location.href = folder + '/user-panel';
                } else {
                    $('.user-panel__form-error').find('span').text(data);
                    $('.user-panel__form-error').show();
                    enable_button(button);
                }
            });
        } else {
            $('.user-panel__form-error').find('span').text('Sorry, but you need to fill out all the fields.');
            $('.user-panel__form-error').show();
            enable_button(button);
        }
    });

    $('.forgot-password').on('submit', function(e) {
        e.preventDefault();

        let _this = $(this);
        let email = _this.find('input[name="email"]');
        let error = 0;

        let button = _this.find('.user-panel__form-action button');
        disable_button(button);

        if(email.val().match(/^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,4}$/i)) {
            email.removeAttr('style');
        } else {
            email.css({'border-color':'#ff5919'});
            error++;
        }

        if (error === 0) {
            $.post(folder + "/app/controllers/ajax.php", _this.serialize(), function (data) {
                if (data === 'ok') {
                   $('.user-panel__form-success').show();
                   $('.user-panel__form-error').hide();
                   $('.user-panel__form-action').hide();
                } else {
                    $('.user-panel__form-error').find('span').text(data);
                    $('.user-panel__form-error').show();
                    enable_button(button);
                }
            });
        } else {
            $('.user-panel__form-error').find('span').text('Sorry, but you need to fill out all the fields.');
            $('.user-panel__form-error').show();
            enable_button(button);
        }
    });

    $('.remove').on('submit', function(e) {
        e.preventDefault();
        $('.user-panel__form-error').hide();

        let _this = $(this);
        let email = _this.find('input[name="email"]');
        let subject = _this.find('input[name="url"]');
        let message = _this.find('textarea[name="message"]');
        let error = 0;

        let button = _this.find('.user-panel__form-action button');
        disable_button(button);

        if(email.val().match(/^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,4}$/i)) {
            email.removeAttr('style');
        } else {
            email.css({'border-color':'#ff5919'});
            error++;
        }

        if (subject.val() === '') {
            subject.css({'border-color':'#ff5919'});
            error++;
        } else {
            subject.removeAttr('style');
        }

        if (message.val() === '') {
            message.css({'border-color':'#ff5919'});
            error++;
        } else {
            message.removeAttr('style');
        }

        if (error === 0) {
            $.post(folder + "/app/controllers/ajax.php", _this.serialize(), function (data) {
                if (data === 'ok') {
                    $('.user-panel__form-success').find('span').text('Thank you, our team will respond in 1-2 working day.');
                    $('.user-panel__form-success').show();
                    button.hide();
                } else {
                    $('.user-panel__form-error').find('span').text(data);
                    $('.user-panel__form-error').show();
                    enable_button(button);
                }
            });
        } else {
            $('.user-panel__form-error').find('span').text('Sorry, but you need to fill out all the fields.');
            $('.user-panel__form-error').show();
            enable_button(button);
        }
    });

    $('.request-api').on('submit', function(e) {
        e.preventDefault();
        $('.user-panel__form-error').hide();

        let _this = $(this);
        let email = _this.find('input[name="email"]');
        let subject = _this.find('input[name="url"]');
        let message = _this.find('textarea[name="message"]');
        let error = 0;

        let button = _this.find('.user-panel__form-action button');
        disable_button(button);

        if(email.val().match(/^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,4}$/i)) {
            email.removeAttr('style');
        } else {
            email.css({'border-color':'#ff5919'});
            error++;
        }

        if (subject.val() === '') {
            subject.css({'border-color':'#ff5919'});
            error++;
        } else {
            subject.removeAttr('style');
        }

        if (message.val() === '') {
            message.css({'border-color':'#ff5919'});
            error++;
        } else {
            message.removeAttr('style');
        }

        if (error === 0) {
            $.post(folder + "/app/controllers/ajax.php", _this.serialize(), function (data) {
                if (data === 'ok') {
                    $('.user-panel__form-success').find('span').text('Thank you, our team will respond in 1-2 working day.');
                    $('.user-panel__form-success').show();
                    button.hide();
                } else {
                    $('.user-panel__form-error').find('span').text(data);
                    $('.user-panel__form-error').show();
                    enable_button(button);
                }
            });
        } else {
            $('.user-panel__form-error').find('span').text('Sorry, but you need to fill out all the fields.');
            $('.user-panel__form-error').show();
            enable_button(button);
        }
    });

    $('.contact-us').on('submit', function(e) {
        e.preventDefault();
        $('.user-panel__form-error').hide();

        let _this = $(this);
        let email = _this.find('input[name="email"]');
        let subject = _this.find('input[name="subject"]');
        let message = _this.find('textarea[name="message"]');
        let error = 0;

        let button = _this.find('.user-panel__form-action button');
        disable_button(button);

        if(email.val().match(/^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,4}$/i)) {
            email.removeAttr('style');
        } else {
            email.css({'border-color':'#ff5919'});
            error++;
        }

        if (subject.val() === '') {
            subject.css({'border-color':'#ff5919'});
            error++;
        } else {
            subject.removeAttr('style');
        }

        if (message.val() === '') {
            message.css({'border-color':'#ff5919'});
            error++;
        } else {
            message.removeAttr('style');
        }

        if (error === 0) {
            $.post(folder + "/app/controllers/ajax.php", _this.serialize(), function (data) {
                if (data === 'ok') {
                    $('.user-panel__form-success').find('span').text('Thank you, our team will respond in 1-2 working day.');
                    $('.user-panel__form-success').show();
                    button.hide();
                } else {
                    $('.user-panel__form-error').find('span').text(data);
                    $('.user-panel__form-error').show();
                    enable_button(button);
                }
            });
        } else {
            $('.user-panel__form-error').find('span').text('Sorry, but you need to fill out all the fields.');
            $('.user-panel__form-error').show();
            enable_button(button);
        }
    });

    $('.edit-overview').on('submit', function(e) {
        e.preventDefault();

        let _this = $(this);
        let refresh_setting = _this.find('input[name="refresh_setting"]:checked');
        let error = 0;

        let button = _this.find('.user-panel__form-action button');
        disable_button(button);

        if (error === 0) {
            $.post(folder + "/app/controllers/ajax.php", _this.serialize(), function (data) {
                if (data === 'ok') {
                    window.location.href = folder + '/user-panel?overview-changed=' + refresh_setting.val();
                } else {
                    $('.user-panel__form-error').find('span').text(data);
                    $('.user-panel__form-error').show();
                    enable_button(button);
                }
            });
        } else {
            $('.user-panel__form-error').find('span').text('Sorry, but you need to fill out all the fields.');
            $('.user-panel__form-error').show();
            enable_button(button);
        }
    });

    $('.edit-info').on('submit', function(e) {
        e.preventDefault();

        let _this = $(this);
        let old_password = _this.find('input[name="old_password"]');
        let password = _this.find('input[name="password"]');
        let repeat_password = _this.find('input[name="confirm_password"]');
        let error = 0;

        let button = _this.find('.user-panel__form-action button');
        disable_button(button);

        if (old_password.val() === '') {
            old_password.css({'border-color':'#ff5919'});
            error++;
        }

        if (password.val() === repeat_password.val()) {
            password.removeAttr('style');
            repeat_password.removeAttr('style');
        } else {
            password.css({'border-color':'#ff5919'});
            repeat_password.css({'border-color':'#ff5919'});

            $('.user-panel__form-error').find('span').text('Confirm password doesn\'t equal your password.');
            $('.user-panel__form-error').show();
            enable_button(button);
            return false;
        }

        if (password.val() === '') {
            password.css({'border-color':'#ff5919'});
            error++;
        }

        if (error === 0) {
            $.post(folder + "/app/controllers/ajax.php", _this.serialize(), function (data) {
                if (data === 'ok') {
                    window.location.href = folder + '/user-panel?password-changed';
                } else {
                    $('.user-panel__form-error').find('span').text(data);
                    $('.user-panel__form-error').show();
                    enable_button(button);
                }
            });
        } else {
            $('.user-panel__form-error').find('span').text('Sorry, but you need to fill out all the fields.');
            $('.user-panel__form-error').show();
            enable_button(button);
        }
    });

    $('.change-password').on('submit', function(e) {
        e.preventDefault();

        let _this = $(this);
        let password = _this.find('input[name="password"]');
        let repeat_password = _this.find('input[name="confirm_password"]');
        let error = 0;

        let button = _this.find('.user-panel__form-action button');
        disable_button(button);

        if (password.val() === '') {
            password.css({'border-color':'#ff5919'});
            enable_button(button);
            return false;
        }

        if (password.val() === repeat_password.val()) {
            password.removeAttr('style');
            repeat_password.removeAttr('style');
        } else {
            password.css({'border-color':'#ff5919'});
            repeat_password.css({'border-color':'#ff5919'});
            error++;
        }
        if (error === 0) {
            $.post(folder + "/app/controllers/ajax.php", _this.serialize(), function (data) {
                if (data === 'ok') {
                    window.location.href = folder + '/sign-in?password_changed';
                } else {
                    $('.user-panel__form-error').find('span').text(data);
                    $('.user-panel__form-error').show();
                    enable_button(button);
                }
            });
        } else {
            $('.user-panel__form-error').find('span').text('Sorry, but you need to fill out all the fields.');
            $('.user-panel__form-error').show();
            enable_button(button);
        }
    });


    $('body').on('submit', '#addPromoteAd', function(e) {
        e.preventDefault();

        let url = $('[name="url"]');
        let title = $('[name="title"]');
        let views_count = $('[name="views_count"]');
        let button = $(this).find('.user-panel__form-action button');

        disable_button(button);


        if(url.val() === '') {
            $('.user-panel__form-error').find('span').text('Url is required.');
            $('.user-panel__form-error').show();
            enable_button(button);
            return false;
        }
        if(title.val() === '') {
            $('.user-panel__form-error').find('span').text('Title is required.');
            $('.user-panel__form-error').show();
            enable_button(button);
            return false;
        }
        let get_url;
        if ($('[name="addPromoteAd"]').length !== 0) {
            if(views_count.val() === '') {
                $('.user-panel__form-error').find('span').text('Views count is required.');
                $('.user-panel__form-error').show();
                enable_button(button);
                return false;
            }
            get_url = 'ad-created';
        } else {
            get_url = 'ad-edited';
        }

        var formData = new FormData(this);
        $.ajax({
            url: folder + "/app/controllers/ajax.php",
            data: formData,
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            success: function(result) {
                if(result === 'ok') {
                    window.location.href = folder + '/user-panel?' + get_url;
                } else {
                    $('.user-panel__form-error').find('span').text(result);
                    $('.user-panel__form-error').show();
                    enable_button(button);
                }
            }
        });

    });

    $('.ad_action').on('click', function() {
        let action =  $(this).data('action');
        let id = $(this).data('id');
        $.post(folder + "/app/controllers/ajax.php", {id: id, action: action, type: "ad_action"}, function (data) {
            window.location.reload();
        });
    });

    $('.user-panel__form-success.panel svg').on('click', function() {
        $('.user-panel__form-success.panel').hide();
    });


    $(document).on('change', '.switch_action', function() {
        let action = 'start';
        if ($(this).prop('checked') === false) {
            action = 'stop';
        }
        let id = $(this).val();
        let row = $(this).closest('.user-panel__ad-table__tb-row');
        if (action === 'start') {
            row.find('.user-panel__ad-table__tb-status').html('<span class="ad_table-status active">Active</span>');
        } else {
            row.find('.user-panel__ad-table__tb-status').html('<span class="ad_table-status inactive">Inactive</span>');
        }

        $.post(folder + "/app/controllers/ajax.php", {id: id, action: action, type: "ad_action"}, function (data) {
        });
    });

    $('.promote-form input').on('change keyup', function() {
        $('.ad-sample-wrapper').show();
        $('.promote__explain').hide();
        $('.promote__left').addClass('with_sample');
    });

    $('body').on('submit', '#promoteForm', function(e) {
        e.preventDefault();
        $('.user-panel__form-error').hide();
        let url = $('[name="url"]');
        let title = $('[name="title"]');
        let button = $(this).find('.user-panel__form-action button').first();

        disable_button(button);


        if(url.val() === '') {
            $('.user-panel__form-error').find('span').text('Url is required.');
            $('.user-panel__form-error').show();
            enable_button(button);
            return false;
        }
        if(title.val() === '') {
            $('.user-panel__form-error').find('span').text('Title is required.');
            $('.user-panel__form-error').show();
            enable_button(button);
            return false;
        }

        var formData = new FormData(this);
        $.ajax({
            url: folder + "/app/controllers/ajax.php",
            data: formData,
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            success: function(result) {
                if(result === 'ok') {
                    $('.promote-form__step1').hide();
                    $('.promote-form__step2').show();
                    $('.input[name="promoteFormStep1"]').attr('name', 'promoteFormStep2');
                } else {
                    $('.user-panel__form-error').find('span').text(result);
                    $('.user-panel__form-error').show();
                    enable_button(button);
                }
            }
        });

    });


    $(document).on('click', '.run_again', function() {
        $('.user-panel__form-error').hide();

        let _switch = $(this).find('input');

        let id = _switch.val();
        let row = $(this).closest('.user-panel__ad-table__tb-row');

        $.post(folder + "/app/controllers/ajax.php", {id: id, type: "ad_run_again"}, function (data) {
            if (data === 'ok') {
                _switch.prop('disabled', false);
                _switch.prop('checked', true);
                row.find('.user-panel__ad-table__tb-status').html('<span class="ad_table-status active">Active</span>');
                row.find('.ad_table-views').text('0');
                row.find('.ad_table-clicks').text('0');
                row.find('.ad_table-spent').text('$0');
            } else {
                $('.user-panel__form-error').find('span').text(data);
                $('.user-panel__form-error').show();
                setTimeout(function() {
                    $('.user-panel__form-error').hide();
                }, 6000);
            }
        });
    });

    $('.promote_click').on('click', function() {
        let id = $(this).data('id');
        $.post(folder + "/app/controllers/ajax.php", {id: id, type: "promote_click"}, function (data) {
            // $('.notice').show();
            // $('.notice_bg').show();
        });
    });
    $('.promote__custom-form-views').on('keypress keyup blur', function(event) {
        let views = $(this).val();
        if (views === '') {
            $('.promote__custom-form-price').val('$10');
            return;
        }
        $(this).val(views.replace(/[^\d]/, ""));
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }

        let price = views * 0.002;
        if(Math.round(price) !== price) {
            price = price.toFixed(3);
        }

        $('.promote__custom-form-price').val('$' + price);
    });
    $('.add-ad-views').on('keypress keyup blur', function(event) {
        let views = $(this).val();
        if (views === '') {
            $('.add-ad-price').val('$0');
            return;
        }
        $(this).val(views.replace(/[^\d]/, ""));
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }

        let price = views * 0.002;
        if(Math.round(price) !== price) {
            price = price.toFixed(3);
        }

        $('.add-ad-price').val('$' + price);
    });

    $('.add-ad-url_input').on('blur', function(event) {
        let url = $(this).val();
        if (url === '') {
            return false;
        }
        if ($("#file").val() !== '') {
            return false;
        }
        $.post(folder + "/app/controllers/ajax.php", {url: url, type: "get_og_image"}, function (data) {
            if (data !== '') {
                if (data === 'BAD_URL') {
                    $('.add-ad-url_input').css({'border-color':'#ff5919'});
                    $('.user-panel__form-error').find('span').text('Enter valid url.');
                    $('.user-panel__form-error').show();
                    return;
                }
                photo_from_site = data;
                $('.ad-sample-no_image').hide();
                $('.ad-sample-image').css('background-image', 'url(' + data + ')');
                $('.ad-sample-image').show();
            } else {
                $('.ad-sample-no_image').show();
                $('.ad-sample-image').hide();
            }
        });
    });

    $('.add-ad-switcher').on('click', function() {
        $('.add-ad-block').hide();
        $('.add-ad-switcher').removeClass('active');
        $(this).addClass('active');
        $('.' + $(this).data('id')).show();
    });
    $('.main__search-type-block').on('click', function() {
        $('.main__search-type-block.active').removeClass('active');
        $(this).addClass('active');
    });

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
                $('.ad-sample-no_image').hide();
                $('.ad-sample-image').css('background-image', 'url(' + e.target.result + ')');
                $('.ad-sample-image').show();
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#file").change(function() {
        readURL(this);
    });

    $('.add-ad-title_input').on('keypress keyup blur', function(event) {
        sampleFieldsFill($(this), 50, $('.ad-sample-title'), 'Ad title');
    });
    $('.add-ad-desc_input').on('keypress keyup blur', function(event) {
        sampleFieldsFill($(this), 200, $('.ad-sample-description'), 'Ad description');
    });

    $('.add-funds .user-panel__form-action').on('click', function(e) {
        e.preventDefault();

        disable_button($(this).find('button'));

        if ($('.add-funds-price').val() == '') {
            $('.user-panel__form-error').find('span').text('You need to enter the amount ');
            $('.user-panel__form-error').show();
            enable_button($(this).find('button'));
            return false;
        } else {
            $('.add-funds').trigger('submit');
        }
    });

    $('.buy-likes-step-1').on('submit', function(e) {
        e.preventDefault();
        $('.user-panel__form-error').hide();

        let _this = $(this);
        let email = _this.find('input[name="email"]');
        let username = _this.find('input[name="username"]');
        let error = 0;

        let button = _this.find('.user-panel__form-action button');
        disable_button(button);

        if(email.val().match(/^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,4}$/i)) {
            email.removeAttr('style');
        } else {
            email.css({'border-color':'#ff5919'});
            error++;
        }
        if (username.val() === '') {
            username.css({'border-color':'#ff5919'});
            error++;
        } else {
            username.removeAttr('style');
        }

        if (error === 0) {
            $.post(folder + "/app/controllers/ajax.php", _this.serialize(), function (data) {
                data = JSON.parse(data);
                if (data.success) {
                    $('.buy-likes-step-3').find('[name="email"]').val(email.val());
                    $('.buy-likes-step-3').find('[name="username"]').val(username.val());
                    $('.buy-likes-step-3').find('[name="user_id"]').val(data.data.posts[0].owner.id);
                    for (let i = 0; i < data.data.posts.length; i++) {
                        $('.posts-wrapper').append('\n' +
                            '                    <div class="post-block-wrapper" data-id="' + data.data.posts[i].id + '">\n' +
                            '                        <div class="post-block" style="background-image: url(\'' + data.data.posts[i].display_url + '\')"></div>\n' +
                            '                        <div class="post-selected">\n' +
                            '                            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="510px" height="510px" viewBox="0 0 510 510" style="enable-background:new 0 0 510 510;" xml:space="preserve"><g><g id="favorite"><path d="M255,489.6l-35.7-35.7C86.7,336.6,0,257.55,0,160.65C0,81.6,61.2,20.4,140.25,20.4c43.35,0,86.7,20.4,114.75,53.55\t\tC283.05,40.8,326.4,20.4,369.75,20.4C448.8,20.4,510,81.6,510,160.65c0,96.9-86.7,175.95-219.3,293.25L255,489.6z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>\n' +
                            '                            <span>' + likes_count + '</span>\n' +
                            '                        </div>\n' +
                            '                    </div>');
                    }
                    if (!data.data.more) {
                        $('.post-load-more').hide();
                    }
                    $('.post-load-more').data('next', data.data.next);
                    $('.buy-likes-step-1').hide();
                    $('.user-panel__form-wrapper').addClass('step2');
                    $('.buy-likes-step-2').show();
                } else {
                    $('.user-panel__form-error').find('span').text(data.error);
                    $('.user-panel__form-error').show();
                    enable_button(button);
                }
            });
        } else {
            $('.user-panel__form-error').find('span').text('Sorry, but you need to fill out all the fields.');
            $('.user-panel__form-error').show();
            enable_button(button);
        }
    });

    $('.buy-likes-step-2').on('submit', function(e) {
        e.preventDefault();
        $('.user-panel__form-error').hide();

        let _this = $(this);
        let count = _this.find('[name="count"]');
        let button = _this.find('.user-panel__form-action button');
        disable_button(button);

        let error = 0;
        let post_id = $('.buy-likes-step-3').find('[name="post_id"]').val();
        if (post_id == '') {
            $('.user-panel__form-error').find('span').text('Choose post.');
            $('.user-panel__form-error').show();
            enable_button(button);
            return;
        }

        if (error === 0) {
            $.post(folder + "/app/controllers/ajax.php", {type: 'check_order_like', target: post_id}, function (data) {
                if (data == 'ok') {
                    $('.user-panel__suborder-count span').text($('.buy-likes-step-3').find('[name="username"]').val());

                    $('.buy-likes-step-2').hide();
                    $('.user-panel__form-wrapper').removeClass('step2');
                    $('.buy-likes-step-3').show();

                    paypal.Buttons({
                        createOrder: function() {
                            return fetch('/new_create_order.php', {
                                method: 'post',
                                headers: {
                                    'content-type': 'application/json'
                                },
                                body: JSON.stringify({
                                    count: count.val(),
                                    type: 'like',
                                })
                            }).then(function(res) {
                                return res.json();
                            }).then(function(data) {
                                return data.orderID; // Use the same key name for order ID on the client and server
                            });
                        },
                        onApprove: function(data, actions) {
                            return actions.order.capture().then(function(details) {
                                var formData = new FormData($('.buy-likes-step-3')[0]);
                                formData.append('orderID', data.orderID);
                                $.ajax({
                                    url: folder + "/new_payment.php",
                                    data: formData,
                                    type: 'POST',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    success: function(result) {
                                        $('.user-panel__form-body').hide();
                                        $('.user-panel__form-success').find('span').text('Thank you, you successfully ordered ' + count.val() + ' likes.');
                                        $('.user-panel__form-success').show();
                                        $('.user-panel__form-order-complete').show();
                                    }
                                });
                            });
                        }
                    }).render('#paypal-button-container');
                } else {
                    $('.user-panel__form-error').find('span').text(data);
                    $('.user-panel__form-error').show();
                    enable_button(button);
                }
            });
        } else {
            $('.user-panel__form-error').find('span').text('Sorry, but you need to fill out all the fields.');
            $('.user-panel__form-error').show();
            enable_button(button);
        }
    });

    $('.post-load-more').on('click', function() {
        if ($(this).hasClass('load')) {
            return;
        }
        $(this).addClass('load');
        let next = $(this).data('next');
        let user_id = $('.buy-likes-step-3').find('[name="user_id"]').val();
        $('.user-panel__form-error').hide();
        $.post(folder + "/app/controllers/ajax.php", {next: next, type: 'step2-load-more', user_id: user_id}, function (data) {
            data = JSON.parse(data);
            if (data.success) {
                for (let i = 0; i < data.data.posts.length; i++) {
                    $('.posts-wrapper').append('\n' +
                        '                    <div class="post-block-wrapper" data-id="' + data.data.posts[i].id + '">\n' +
                        '                        <div class="post-block" style="background-image: url(\'' + data.data.posts[i].display_url + '\')"></div>\n' +
                        '                        <div class="post-selected">\n' +
                        '                            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="510px" height="510px" viewBox="0 0 510 510" style="enable-background:new 0 0 510 510;" xml:space="preserve"><g><g id="favorite"><path d="M255,489.6l-35.7-35.7C86.7,336.6,0,257.55,0,160.65C0,81.6,61.2,20.4,140.25,20.4c43.35,0,86.7,20.4,114.75,53.55\t\tC283.05,40.8,326.4,20.4,369.75,20.4C448.8,20.4,510,81.6,510,160.65c0,96.9-86.7,175.95-219.3,293.25L255,489.6z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>\n' +
                        '                            <span>' + likes_count + '</span>\n' +
                        '                        </div>\n' +
                        '                    </div>');
                }
                if (!data.data.more) {
                    $('.post-load-more').hide();
                }
                $('.post-load-more').data('next', data.data.next);
                $(this).removeClass('load');
            } else {
                $('.user-panel__form-error').find('span').text(data.error);
                $('.user-panel__form-error').show();
                $(this).removeClass('load');
            }
        });
    });

    $(document).on('click', '.post-block-wrapper', function() {
        let id = $(this).data('id');
        $('.buy-likes-step-3').find('[name="post_id"]').val(id);
        $('.user-panel__order-photo').css('background-image', $(this).find('.post-block').css('background-image'));
        $('.post-block-wrapper').removeClass('selected');
        $(this).addClass('selected');
    });

    $('.buy-followers-step-1').on('submit', function(e) {
        e.preventDefault();
        $('.user-panel__form-error').hide();

        let _this = $(this);
        let email = _this.find('input[name="email"]');
        let username = _this.find('input[name="username"]');
        let count = _this.find('[name="count"]');
        let error = 0;

        let button = _this.find('.user-panel__form-action button');
        disable_button(button);

        if(email.val().match(/^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,4}$/i)) {
            email.removeAttr('style');
        } else {
            email.css({'border-color':'#ff5919'});
            error++;
        }
        if (username.val() === '') {
            username.css({'border-color':'#ff5919'});
            error++;
        } else {
            username.removeAttr('style');
        }

        if (error === 0) {
            $.post(folder + "/app/controllers/ajax.php", _this.serialize(), function (data) {
                data = JSON.parse(data);
                if (data.success) {
                    $('.buy-followers-step-2').find('[name="email"]').val(email.val());
                    $('.buy-followers-step-2').find('[name="username"]').val(username.val());
                    $('.user-panel__suborder-count span').text(username.val());
                    $('.user-panel__order-photo').css('background-image', 'url(' + data.data.profile_pic_url + ')');

                    $('.buy-followers-step-1').hide();
                    $('.buy-followers-step-2').show();

                    paypal.Buttons({
                        createOrder: function() {
                            return fetch('/new_create_order.php', {
                                method: 'post',
                                headers: {
                                    'content-type': 'application/json'
                                },
                                body: JSON.stringify({
                                    count: count.val(),
                                    type: 'follower',
                                })
                            }).then(function(res) {
                                return res.json();
                            }).then(function(data) {
                                return data.orderID; // Use the same key name for order ID on the client and server
                            });
                        },
                        onApprove: function(data, actions) {
                            return actions.order.capture().then(function(details) {
                                console.log(details);
                                var formData = new FormData($('.buy-followers-step-2')[0]);
                                formData.append('orderID', data.orderID);
                                $.ajax({
                                    url: folder + "/new_payment.php",
                                    data: formData,
                                    type: 'POST',
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    success: function(result) {
                                        $('.user-panel__form-body').hide();
                                        $('.user-panel__form-success').find('span').text('Thank you, you successfully ordered ' + count.val() + ' followers.');
                                        $('.user-panel__form-success').show();
                                        $('.user-panel__form-order-complete').show();
                                    }
                                });
                            });
                        }
                    }).render('#paypal-button-container');
                } else {
                    $('.user-panel__form-error').find('span').text(data.error);
                    $('.user-panel__form-error').show();
                    enable_button(button);
                }
            });
        } else {
            $('.user-panel__form-error').find('span').text('Sorry, but you need to fill out all the fields.');
            $('.user-panel__form-error').show();
            enable_button(button);
        }
    });

    $('.paypal_button .promote__form-button').on('click', function() {
        let sum = $(this).data('sum');
        $('.paypal_button').hide();
        $('.user-panel__form-error').hide();
        $('.add-funds-price').val('$' + sum);
        $('.add-funds-price').trigger('blur');

        paypal.Buttons({
            createOrder: function() {
                return fetch('/new_create_order.php', {
                    method: 'post',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        sum: sum,
                    })
                }).then(function(res) {
                    return res.json();
                }).then(function(data) {
                    return data.orderID; // Use the same key name for order ID on the client and server
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    console.log(details);
                    var formData = new FormData($('.promote-form')[1]);
                    formData.append('orderID', data.orderID);
                    $.ajax({
                        url: folder + "/new_payment.php",
                        data: formData,
                        type: 'POST',
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function(result) {
                            if (logged) {
                                window.location.href = '/user-panel';
                            } else {
                                $('.user-panel__form-error').hide();
                                $('.promote-form__step2').hide();
                                $('.promote-form__step3').show();
                            }
                        }
                    });
                });
            }
        }).render('#paypal-button-container');
    });

    $('.paypal_button .user-panel__form-action').on('click', function() {
        let sum = $('.add-funds-price').val();
        sum = sum.replace(/[^\d]/, "");
        if (!$.isNumeric(sum)) {
            $('.user-panel__form-error').find('span').text('Enter valid views');
            $('.user-panel__form-error').show();
            return;
        }
        if (sum < 0.01) {
            $('.user-panel__form-error').find('span').text('Views count need be > 5.');
            $('.user-panel__form-error').show();
            return;
        }
        $('.paypal_button').hide();
        $('.user-panel__form-error').hide();
        paypal.Buttons({
            createOrder: function() {
                return fetch('/new_create_order.php', {
                    method: 'post',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        sum: (parseFloat(sum)).toFixed(2)
                    })
                }).then(function(res) {
                    return res.json();
                }).then(function(data) {
                    return data.orderID; // Use the same key name for order ID on the client and server
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    console.log(details);
                    var formData = new FormData($('.promote-form')[1]);
                    formData.append('orderID', data.orderID);
                    $.ajax({
                        url: folder + "/new_payment.php",
                        data: formData,
                        type: 'POST',
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function(result) {
                            if (logged) {
                                window.location.href = '/user-panel';
                            } else {
                                $('.user-panel__form-error').hide();
                                $('.promote-form__step2').hide();
                                $('.promote-form__step3').show();
                            }
                        }
                    });
                });
            }
        }).render('#paypal-button-container');
    });


    function sampleFieldsFill(el, max_length, target, default_val) {
        let text = el.val();
        if (text === '') {
            target.text(default_val);
            return;
        }
        if (text.length > max_length) {
            el.val(text.substring(0, max_length));
        }

        target.text(text);
    }

    $('.add-funds-price').on('keypress keyup blur', function(event) {
        let price = $(this).val();
        if (price === '') {
            $('.add-funds-views').val('0 views');
            return;
        }
        // $(this).val(price.replace(/[^\d]/, ""));
        // if ((event.which < 48 || event.which > 57)) {
        //     event.preventDefault();
        // }
        let views = price.replace(/[^\d]/, "") / 0.002;
        if(Math.round(views) !== views) {
            views = views.toFixed();
        }

        $('.add-funds-views').val(views + ' views');
    });

    $('.promote__form-button-click, .promote__custom-form-button').on('click', function() {
        let sum = $(this).data('sum');
        let custom_price = $('.promote__custom-form-price').val();
        $.post(folder + "/app/controllers/ajax.php", {sum: sum, type: "promote", custom_price: custom_price}, function (data) {
            // $('.notice').show();
            // $('.notice_bg').show();
        });
    });
    $('.notice svg').on('click', function() {
        $('.notice').hide();
        $('.notice_bg').hide();
    });

    var open = false;
    $('.menu_block i').click(function(event) {
        // if ($(window).width() <= 1060) {
        //     $('.mobile_menu_block').toggleClass('active');
        // } else {

        $('#dropdown-popup').show();
        $('.bg').show();
        // if (open) {
        //     if ($( document ).width() <= 780) {
        //         $('body').css('overflow', 'auto');
        //     }
        //     $(this).addClass('flaticon-menu-button').removeClass('flaticon-close-button');
        // } else {
        //     if ($( document ).width() <= 780) {
        //         $('body').css('overflow', 'hidden');
        //     }
        //     $(this).addClass('flaticon-close-button').removeClass('flaticon-menu-button');
        // }
        // open = !open;
        //}
        $('body').css('overflow', 'hidden');

    });
    $('.bg').click(function(event) {
        $('body').css('overflow', 'auto');
        $('.news_popup_wrapper').hide();
        $('.bg').hide();
        $('.compare-popup').hide();
    });
    $('.news_popup_close').on('click', function() {
        $('body').css('overflow', 'auto');
        $('.bg').hide();
        $('.news_popup_wrapper').hide();
    });
    // $('.mobile_menu_block i').click(function(event) {
    //     $('.mobile_menu_block').toggleClass('active');
    // });

    $('#search-input').blur(function() {
        $('.center-header').removeClass('focused');
    });


    setResponsiveSearchPlaceholder();
    $(window).resize(function(){
        setResponsiveSearchPlaceholder();
    });

    // apply masonry grid
    const $posts = $('.box-photos-wrapper');

    if ($posts.length > 0) {
        if (isAdBlockActive) {
            $(".adv").remove();
        }
    }

    const $postsMasonry = $posts.find('> .box-photos')
        .removeClass('init')
        .isotope({
            itemSelector: 'li',
            transitionDuration: 0,
            stagger: 0,
            masonry: {
                itemSelector: 'li',
                gutter: 0
            }
        });

    $postsMasonry.imagesLoaded().progress(() => $postsMasonry.isotope('layout'));

    function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    let nextPageUrl = '/app/controllers/ajax.php?type=' + window.page + '&end_cursor=' + next +'&uuid='+ uuidv4() +'&id='+ window.location.href.split('#')[3] +'&ads=0'//((window.page == 'profile') ? id : (window.page == 'location') ? window.pd.data_location_id : (window.page == 'tag') ? window.pd.tag_id : ''); 
    //console.log(nextPageUrl)
    //let nextPageUrl = $('.load-more-wrapper').data('next');

    setInterval(function() {
        $postsMasonry.isotope();
    }, 100);

    $postsMasonry.infiniteScroll({
        path: () => nextPageUrl,
        //append: 'li',
        checkLastPage: '.pagination-next-page-input',
        //outlayer: $postsMasonry.data('isotope'),
        history: false,
        animate:false
    });

    //showIconsAfterLoad();


    const $loadingNotice = $('.load-more-wrapper');

    // const $failedRetry = $([
    //     '<button class="pagination-failed-retry">',
    //     'Loading Fail. Click Retry ↓',
    //     '</button>'
    // ].join('')).hide().appendTo('.box-photos-wrapper').on('click', function () {
    //     $postsMasonry.data('infiniteScroll').canLoad = true;
    //     $postsMasonry.infiniteScroll('loadNextPage');
    // });

    $postsMasonry.on('request.infiniteScroll', () => {
        $loadingNotice.css('opacity', 1);
    });

    $postsMasonry.on('load.infiniteScroll', (e, res) => {
        nextPageUrl = $(res).find('.pagination-next-page-input').val();
        //$failedRetry.hide();
        //console.log($(res).find('body'));
        $postsMasonry.isotope( 'insert', $(res).find('body'), function() {

        } );
        var size='300x250',
            adunit = 'picuki.com_300x250_responsive_2_DFP',
            xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){if (xmlhttp.readyState == 4 && xmlhttp.status == 200){var es = document.querySelectorAll("[data-id='"+adunit+"']");var e = Array.from(es).filter(function(e) {return !e.hasAttribute("data-rendered")});if(e.length > 0){e.forEach(function(el){var iframe = el.contentWindow.document;iframe.open();iframe.write(xmlhttp.responseText);iframe.close();el.setAttribute('data-rendered', true)})}}};xmlhttp.open("GET", 'https://pubads.g.doubleclick.net/gampad/adx?iu=/147246189/'+adunit+'&sz='+encodeURI(size)+'&t=Placement_type%3Dserving&'+Date.now(), true);xmlhttp.send();
        // let ads_ids = ($(res).find('.ads_ids').val()).split(',');
        // for (let i = 0; i < ads_ids.length; i++) {
        //     if (ads_ids[i] === '') {
        //         continue;
        //     }
        //     window.googletag = window.googletag || {cmd: []};
        //     googletag.cmd.push(function() {
        //         googletag
        //             .defineSlot('/147246189/picuki.com_300x250_responsive_2_DFP', [300, 250], 'gpt-passback-stpd-0-' + ads_ids[i])
        //             .addService(googletag.pubads());
        //         googletag.enableServices();
        //         googletag.display('gpt-passback-stpd-0-' + ads_ids[i]);
        //     });
        //
        //
        // }
        if (isAdBlockActive) {
            $(".adv").remove();
            $postsMasonry.isotope('layout');
        }

        $postsMasonry.imagesLoaded().progress( function() {
            $postsMasonry.isotope('layout');
        });

        $loadingNotice.css('opacity', 0);

        // setTimeout(() => {
        //     $('.adsbygoogle').each((index, el) => {
        //         if($(el).children().length === 0) {
        //             $(el).closest('.adv').remove();
        //         }
        //     });
        // }, 1000);
    });

    $postsMasonry.on('error.infiniteScroll', () => {
        $loadingNotice.css('opacity', 0);
    });

    $postsMasonry.on('append.infiniteScroll', (e, res, path, items) => {
        $loadingNotice.css('opacity', 0);
        console.log(items);
        $postsMasonry.isotope( 'insert', $(items), function() {

        } );
        if (isAdBlockActive) {
            $(".adv").remove();
            $postsMasonry.isotope('layout');
        }
    });

    function loadMoreTag() { console.log('loadedmoretag')
        $('.load-more-wrapper').css('opacity', 1); if (!window.next1) { var Next = next } else { var Next = ''; delete window.next1 }

	function tagged_media(data) {//console.log(data)

            data = data.data
            if ($.isEmptyObject(data.hashtag.edge_hashtag_to_media.edges) === true) {
		next = null;
		$('.load-more-wrapper').css('opacity', 0);
	    }
	    let mediaNum = 0;
	    let medias = data.hashtag.edge_hashtag_to_media.edges;
	    if ($.isEmptyObject(medias) === false) {
		$.each(medias, function(i, item) {
		    mediaNum++;
		    let id = '',
			img = '',
			likes = '',
			comments = '',
			caption = '',
			username = '',
			location = [],
			media = {},
			short_code = '',
			display_resources = '',
                        caption_mormal = '';
		    if ($.isEmptyObject(item['node'].id) == false) id = item['node'].id;
		    if ($.isEmptyObject(item['node'].shortcode) == false) short_code = item['node'].shortcode;
		    if ($.isEmptyObject(item['node'].owner) == false) username = '/'+ item['node'].owner.id;
                    if ($.isEmptyObject(item['node'].location) == false) location = item['node'].location;
		    if ($.isEmptyObject(item['node'].thumbnail_resources[3]) == false) img = item['node'].thumbnail_resources[3].src;
                    //if (item['node'].display_resources && $.isEmptyObject(item['node'].display_resources[0]) == false)
		    if ($.isEmptyObject(item['node'].display_url) == false)
		      for (var i=0; i < item['node'].thumbnail_resources.length; i++)
			display_resources = display_resources + item['node'].display_url +'#'+ item['node'].dimensions.width +'x'+ item['node'].dimensions.height +';'
		    if ($.isEmptyObject(item['node'].edge_media_preview_like) == false) likes = item['node'].edge_media_preview_like.count;
		    if ($.isEmptyObject(item['node'].edge_media_to_comment) == false) comments = item['node'].edge_media_to_comment.count;
		    if ($.isEmptyObject(item['node'].edge_media_to_caption.edges[0]) == false) {
			caption = item['node'].edge_media_to_caption.edges[0].node.text;
			caption_mormal = item['node'].edge_media_to_caption.edges[0].node.text;
                        caption = caption.replace(/(\#[A-Za-z_0-9.]+\b)/gi, '<a href="' + site_url.substring(0,site_url.length-1) + '#tag$1"><u>$1</u></a>')
                        caption = caption.replace(/(\@[A-Za-z_0-9.]+\b)/gi, '<a href="' + site_url + 'profile/$1"><u>$1</u></a>').split('/profile/@').join('#profile#')
                        caption = caption.replace(user_reg, 'profile/');
			// caption = caption.replace(/(#[^\u2000-\u206F\u2E00-\u2E7F\s\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]*)/g, '<a href="' + site_url + 'tag/$1"><u>$1</u></a>');
			// caption = caption.replace(hashtag_reg, 'tag/');
		    }
                    media = createMedia(id, img, likes, comments, caption, caption_mormal, item['node'].taken_at_timestamp, mediaNum, username, location, item['node'].is_video, item['node'].video_url, short_code, display_resources);

                    $postsMasonry.isotope( 'insert', $(media.content), function() {

                    });
                });
                $postsMasonry.imagesLoaded().progress( function() {
                    $postsMasonry.isotope('layout');
                });
                if (data.hashtag.edge_hashtag_to_media.page_info.has_next_page) {
                    next = data.hashtag.edge_hashtag_to_media.page_info.end_cursor;
                    $('.load-more-wrap').show();

                    scroll = !scroll;
                } else {
                    next = null;
                }
                $('.load-more-wrapper').css('opacity', 0);
            } else {
                next = null;
                $('.load-more-wrapper').css('opacity', 0);
            }
            //$.post(folder + "/app/controllers/ajax.php", {update_request: 'js_success'});

	}
// 9b498c08113f1e09617a1703c22b2f32
// f92f56d47dc7a55b606908374b43a314
// 298b92c8d7cad703f7565aa892ede943
        $.getJSON("https://www.instagram.com/graphql/query/?query_hash=9b498c08113f1e09617a1703c22b2f32&variables=%7B%22tag_name%22%3A%22" + query + "%22%2C%22first%22%3A8%2C%22after%22%3A%22" + Next + "%22%7D", function(data) {
	  tagged_media(data)
        }).error(function(jqXHR, textStatus, errorThrown) {
	    //if (window.tags) {
		//https://api.imgkoa.com/tag?tagname=&next=
		//next = (window.tags.graphql.hashtag.edge_hashtag_to_media.page_info.has_next_page) ? window.tags.graphql.hashtag.edge_hashtag_to_media.page_info.end_cursor : next
		//tagged_media(window.tags)
	    //} else {

	    //console.log(window.page +'\n'+ folder +'\n'+nextPageUrl)
/*
	    $.ajax({
		url: folder + '/tag/' + window.location.href.split('#')[2], //folder + nextPageUrl,
		type: "POST",
		data: {
		  ads: '0',
		},
		success: function(url, textStatus, xhr) { //console.log(xhr);

		    var posts = $(xhr.responseText).find('.box-photos').first().children()
		    posts = posts.each(function(){                                                                                                                            
			if ($(this).children().first().attr('class') == 'box-photo adv') $(this).children().first().remove()
		    });

		    $postsMasonry.isotope( 'insert', posts, function() {

		    });

		    $postsMasonry.imagesLoaded().progress( function() {
			$postsMasonry.isotope('layout');
		    });

		    $('.load-more-wrapper').css('opacity', 0);

		},
		error: function(e) { console.log(e) }
	    }).error(function(jqXHR, textStatus, errorThrown) {
*/
            next = null;
            $('.load-more-wrapper').css('opacity', 0);
	    $('.search-body-wrapper').find('.content').first().removeAttr('style')
	    var z = 'Anonymous tag feed request rate limited.'
	    $('.search-result-box').html(z)
	    throw z
            //$.post(folder + "/app/controllers/ajax.php", {update_request: 'js_error', type: 'load_more'});
	    //})

	    //}
        });
    }
    function loadMore() {console.log('loadmore')
        $('.load-more-wrapper').css('opacity', 1); if (!window.next1) { var Next = next } else { var Next = ''; delete window.next1 }
	var hash
	if (window.page == 'profile') hash = '003056d32c2554def87228bc3fd9668a'
	if (window.page == 'location') {
	  hash = 'ac38b90f0f3981c42092016a37c59bf7'
	  if (typeof id == 'undefined') {
	    id = window.location.href.split('#')[3];
	    _username = window.location.href.split('#')[3];
	  }
	}

	//console.log(id +' ' + hash)
        $.getJSON("https://www.instagram.com/graphql/query/?query_hash=" + hash + "&variables={%22id%22:%22" + id + "%22,%22first%22:12, %22after%22: %22" + Next + "%22}", function(data) {
            data = data.data;
	    var z = 'Media query deferred by Instagram'
	    if (!(data && (data.user || data.location))) {
		$('.profile-box-photos').html(z)
		throw z
	    }

	    var obj
	    if (window.page == 'profile') {
		obj = data.user.edge_owner_to_timeline_media
		window.ig_data.posts = obj.count
		$('.content-title').children().first().children().first().html(new Intl.NumberFormat().format(obj.count) + ' Posts')
	    }
	    if (window.page == 'location') obj = data.location.edge_location_to_media
            if ($.isEmptyObject(obj.edges) === true) {
                next = null;
                $('.load-more-wrapper').css('opacity', 0);
            }
            let mediaNum = 0;	    //$('.profile_avatar').find('img').src = data2.user.profile_pic_url;
            let medias = obj.edges;
            if ($.isEmptyObject(medias) === false) {


		if (medias[0] && medias[0]['node'] && medias[0]['node'].shortcode) {

		   function update_basic_info(username, uid) {
			if (window.location.href.indexOf('##'+ id) > -1) { window.location.href = location.href.split('##' + id).join('#'+ username) }
			$('.load-profile').html('@' + username)
			$("a[data-username='"+ _username +"']" ).attr('data-username', username)
			if (_username) {
			  var all = document.getElementsByTagName("*")
			  for (var i=0; i < all.length; i++) {//document.querySelectorAll('*').forEach(function(node) {
			    var z = all[i]
			    if (typeof z.getAttribute == 'function' && typeof z.getAttribute('href') == 'string' && z.getAttribute('href').indexOf('#'+ _username) > -1) z.setAttribute('href', z.getAttribute('href').replace('#'+ _username, '#'+ username));//$("a:contains('#"+ _username +"')").attr('href', username)
			  }//);
			} else {
			    var all = document.getElementsByClassName('load-profile')
			    for(var i=0; i < all.length; i++) {
			      all[i].href = all[i].href + username
			    }
			  }
			window.ig_data.id = uid
			window.ig_data.username = username
			_username = username
		  }

		  if (window.ig_data && (typeof window.ig_data.followers != 'number' || !window.ig_data.profile_pic || !window.ig_data.full_name))
		  $.getJSON('https://www.instagram.com/p/' + medias[0]['node'].shortcode + '/?__a=1', function(data1) { //console.log(data1)
		    try {
		      var d = data1.graphql.shortcode_media;
		      window.ig_data.followers = d.owner.edge_followed_by.count
		      window.ig_data.full_name = d.owner.full_name
		      window.ig_data.profile_pic = d.owner.profile_pic_url
		      window.ig_data.verified = d.owner.is_verified
		      if (_username != d.owner.username) {
			update_basic_info(d.owner.username, d.owner.id)
			var z = ['search-username','search-id','search-full_name','search-profile_pic','search-profile_pic_hd','search-verified'], i
			for (i=0; i<z.length; i++) {
			  if (z[i] != 'search-profile_pic_hd') {
			    sessionStorage.setItem(z[i], d.owner[z[i].replace('search-','').replace('profile_pic','profile_pic_url')])
			    localStorage.setItem(z[i], d.owner[z[i].replace('search-','').replace('profile_pic','profile_pic_url')])
			  } else {
			      sessionStorage.setItem(z[i], 'https://i.instagram.com/api/v1/users/' + d.owner.id + '/info/')
			      localnStorage.setItem(z[i], 'https://i.instagram.com/api/v1/users/' + d.owner.id + '/info/')
			    }
			}
		      }
		    } catch(e){}

		    update_page_elements()

		  }).error(function(jqXHR, textStatus, errorThrown) { // Instagram can redirect to the login page here too, instead of serving the json for the latest media
		    //console.log(jqXHR); console.log(textStatus); console.log(errorThrown)
		    if ( medias[0] && medias[0]['node'] && _username != medias[0]['node'].owner.username) {
			update_basic_info(medias[0]['node'].owner.username, id)
			var z = ['search-username','search-id'], i
			for (i=0; i<z.length; i++) {
			    sessionStorage.setItem(z[i], medias[0]['node'].owner[z[i].replace('search-','')])
			    localStorage.setItem(z[i], medias[0]['node'].owner[z[i].replace('search-','')])
			}
			update_page_elements()
		    }
		  })

		} else get_followers_count()

                $.each(medias, function(i, item) {
                    mediaNum++;
                    let id = '',
                        img = '',
                        likes = '',
                        comments = '',
                        caption = '',
                        username = _username,
                        location = [],
                        media = {},
			short_code = '',
			display_resources = '',
                        caption_mormal = '';
                    if ($.isEmptyObject(item['node'].id) == false) id = item['node'].id;
                    if ($.isEmptyObject(item['node'].shortcode) == false) short_code = item['node'].shortcode;
		    if (window.page != 'profile' && $.isEmptyObject(item['node'].owner) == false) username = '/'+ item['node'].owner.id;
                    if ($.isEmptyObject(item['node'].location) == false) location = item['node'].location;
		    if ($.isEmptyObject(item['node'].thumbnail_resources[3]) == false) img = item['node'].thumbnail_resources[3].src;
		    if (window.page != 'location') {
		      if (item['node'].display_resources && $.isEmptyObject(item['node'].display_resources[0]) == false) {
			for (var i=0; i < item['node'].display_resources.length; i++) {
			  display_resources = display_resources + item['node'].display_resources[i].src +'#'+ item['node'].display_resources[i].config_width +'x'+ item['node'].display_resources[i].config_height +';'
			}
			if ($.isEmptyObject(item['node'].edge_sidecar_to_children) == false) {
			  var sc = item['node'].edge_sidecar_to_children.edges, i
			  for (i=1; i < sc.length; i++) {
			    if ($.isEmptyObject(sc[i].node.display_resources[0]) == false) {
			      display_resources = display_resources + '###'
			      var scdr = sc[i].node.display_resources, j
			      for (j=0; j < scdr.length; j++) {
				display_resources = display_resources + scdr[j].src +'#'+ scdr[j].config_width +'x'+ scdr[j].config_height +';'
				if (j==0) img = img +';'+ scdr[j].src
			      }
			    }
			  }
			}
		      }
		    } else {
			if ($.isEmptyObject(item['node'].display_url) == false)
			  for (var i=0; i < item['node'].thumbnail_resources.length; i++)
			  display_resources = display_resources + item['node'].display_url +'#'+ item['node'].dimensions.width +'x'+ item['node'].dimensions.height +';'
			}
                    if ($.isEmptyObject(item['node'].edge_media_preview_like) == false) likes = item['node'].edge_media_preview_like.count;
                    if ($.isEmptyObject(item['node'].edge_media_to_comment) == false) comments = item['node'].edge_media_to_comment.count;
                    if ($.isEmptyObject(item['node'].edge_media_to_caption.edges[0]) == false) {
                        caption = item['node'].edge_media_to_caption.edges[0].node.text;
                        caption_mormal = item['node'].edge_media_to_caption.edges[0].node.text;
                        caption = caption.replace(/(\#[A-Za-z_0-9.]+\b)/gi, '<a href="' + site_url.substring(0,site_url.length-1) + '#tag$1"><u>$1</u></a>')
                        caption = caption.replace(/(\@[A-Za-z_0-9.]+\b)/gi, '<a href="' + site_url + 'profile/$1"><u>$1</u></a>').split('/profile/@').join('#profile#')
                        caption = caption.replace(user_reg, 'profile/');
                        //caption = caption.split('<a href="/tag/').join('<a href="' + site_url.substring(0,site_url.length-1) + '#tag#')
                        // caption = caption.replace(/(#[^\u2000-\u206F\u2E00-\u2E7F\s\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]*)/g, '<a href="' + site_url + 'tag/$1"><u>$1</u></a>');
                        // caption = caption.replace(hashtag_reg, 'tag/');
                    }
                    media = createMedia(id, img, likes, comments, caption, caption_mormal, item['node'].taken_at_timestamp, mediaNum, username, location, item['node'].is_video, item['node'].video_url, short_code, display_resources);

                    $postsMasonry.isotope( 'insert', $(media.content), function() {

                    });
                });
                $postsMasonry.imagesLoaded().progress( function() {
                    $postsMasonry.isotope('layout');
                });
                if (obj.page_info.has_next_page) {
                    next = obj.page_info.end_cursor;
                    $('.load-more-wrap').show();

                    scroll = !scroll;
                } else {
                    next = null;
                }

                $('.load-more-wrapper').css('opacity', 0);

            } else {

		get_followers_count()
                next = null;
                $('.load-more-wrapper').css('opacity', 0);

            }
            //$.post(folder + "/app/controllers/ajax.php", {update_request: 'js_success'});
        }).error(function(jqXHR, textStatus, errorThrown) { //console.log(folder +'\n'+nextPageUrl)
//        });
/*
	      function setHeader(xhr) {
		xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
		xhr.setRequestHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept')
	      }

	    $.ajax({		//https://www.picuki.com/app/controllers/ajax.php?type=location&end_cursor=&uuid=3c74a802-765e-4a92-91a9-1315bc7e2668&id=&ads=0
		url: folder + nextPageUrl,
		type: "POST",
		success: function(url, textStatus, xhr) { //console.log(xhr);
		    //nextPageUrl = $(xhr.responseText).find('.pagination-next-page-input').attr('value'); 
		    var a = '/app/controllers/ajax.php?' + xhr.responseText.split('value="/app/controllers/ajax.php?')[1]
		    if (a) { a = a.split('"')[0]; if (a) nextPageUrl = a }; //console.log(nextPageUrl)

		    $postsMasonry.isotope( 'insert', $(xhr.responseText), function() {

		    });

		    $postsMasonry.imagesLoaded().progress( function() {
			$postsMasonry.isotope('layout');
		    });

		    $('.load-more-wrapper').css('opacity', 0);

		},
		error: function(e) { console.log(e) },
		beforeSend: setHeader
	    }).error(function(jqXHR, textStatus, errorThrown) {*/

	    if (window.page == 'profile') {

	    $.getJSON('https://api.codetabs.com/v1/proxy/?quest=https://api.imgkoa.com/posts?userid=' + id + '&next=' + Next, function(data) { console.log(data)

	    var obj
	    if (window.page == 'profile') {
		obj = data
		window.ig_data.posts = obj.count
		$('.content-title').children().first().children().first().html(new Intl.NumberFormat().format(obj.count) + ' Posts')
	    }
	    if (window.page == 'location') obj = data
            if ($.isEmptyObject(obj.edges) === true) {
                next = null;
                $('.load-more-wrapper').css('opacity', 0);
            }
            let mediaNum = 0;	    //$('.profile_avatar').find('img').src = data2.user.profile_pic_url;
            let medias = obj.items;
            if ($.isEmptyObject(medias) === false) {


		if (medias[0] && medias[0].shortcode) {

		   function update_basic_info(username, uid) {
			$('.load-profile').html('@' + username)
			$("a[data-username='"+ _username +"']" ).attr('data-username', username)
			var all = document.getElementsByTagName("*"); for (var i=0; i < all.length; i++) {//document.querySelectorAll('*').forEach(function(node) {
			  var z = all[i]
			  if (typeof z.getAttribute == 'function' && typeof z.getAttribute('href') == 'string' && z.getAttribute('href').indexOf('#'+ _username) > -1) z.setAttribute('href', z.getAttribute('href').replace('#'+ _username, '#'+ username));//$("a:contains('#"+ _username +"')").attr('href', username)
			}//);
			window.ig_data.id = uid
			window.ig_data.username = username
			_username = username
		  }

		  function shortcode_(shortcode) {// 68 33 21 23 57 44 50 37 72 42 55 <-?- CKO4IzdBZVy -->  67,75,48,52,73,122,100,66,90,86,121
		    var i, s = ''
		    for (i=0;i < shortcode.length; i=(i+2)) {
		      s = s + String.fromCharCode( shortcode.substring(i,(i+2)) )
		    }
		    return s
		  }


		} else get_followers_count()

                $.each(medias, function(i, item) {
                    mediaNum++;
                    let id = '',
                        img = '',
                        likes = '',
                        comments = '',
                        caption = '',
                        username = _username,
                        location = [],
                        media = {},
			short_code = '',
			display_resources = '',
                        caption_mormal = '';
                    //if ($.isEmptyObject(item['node'].id) == false) id = item['node'].id;
                    short_code = 1 * (item.shortcode) //shortcode_(item.shortcode);
		    //if (window.page != 'profile' && $.isEmptyObject(item['node'].owner) == false) username = '/'+ item['node'].owner.id;
                    //if ($.isEmptyObject(item['node'].location) == false) location = item['node'].location;
		    img = item.thum;
		    if (window.page != 'location') {
		      if ($.isEmptyObject(item.pic) == false) {
			for (var i=0; i < 1; i++) {
			  display_resources = display_resources + item.pic +'##;'
			}
			if ($.isEmptyObject(item.children_items) == false) {
			  var sc = item.children_items, i
			  for (i=0; i < sc.length; i++) {
			    if ($.isEmptyObject(sc[i].pic) == false) {
			      display_resources = display_resources + '###' + sc[i].pic +'#'+ sc[i].pic_w +'x'+ sc[i].pic_h +';'
				img = img +';'+ sc[i].thum
			    }
			  }
			}
		      }
		    } else {/*
			if ($.isEmptyObject(item['node'].display_url) == false)
			  for (var i=0; i < item['node'].thumbnail_resources.length; i++)
			  display_resources = display_resources + item['node'].display_url +'#'+ item['node'].dimensions.width +'x'+ item['node'].dimensions.height +';'*/
			}
                    likes = item.count_like;
                    comments = item.count_comment;
                    //if ($.isEmptyObject(item.sum) == false) {
                        caption = item.sum;
                        caption_mormal = item.sum_pure;
                        //caption = caption.replace(/(\#[A-Za-z_0-9.]+\b)/gi, '<a href="' + site_url.substring(0,site_url.length-1) + '#tag$1"><u>$1</u></a>')
                        caption = caption.replace(/(\@[A-Za-z_0-9.]+\b)/gi, '<a href="' + site_url + 'profile/$1"><u>$1</u></a>').split('/profile/@').join('#profile#')
                        caption = caption.replace(user_reg, 'profile/');
                        //caption = caption.split('<a href="/tag/').join('<a href="' + site_url.substring(0,site_url.length-1) + '#tag#')
                        // caption = caption.replace(/(#[^\u2000-\u206F\u2E00-\u2E7F\s\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]*)/g, '<a href="' + site_url + 'tag/$1"><u>$1</u></a>');
                        // caption = caption.replace(hashtag_reg, 'tag/');
                    //}
                    media = createMedia(id, img, likes, comments, caption, caption_mormal, item.time, mediaNum, username, location, item.is_video, item.video, short_code, display_resources);

                    $postsMasonry.isotope( 'insert', $(media.content), function() {

                    });
                });
                $postsMasonry.imagesLoaded().progress( function() {
                    $postsMasonry.isotope('layout');
                });
                if (obj.has_next) {
                    next = obj.next;
                    $('.load-more-wrap').show();

                    scroll = !scroll;
                } else {
                    next = null;
                }

                $('.load-more-wrapper').css('opacity', 0);

            } else {

		get_followers_count()
                next = null;
                $('.load-more-wrapper').css('opacity', 0);

            }

	    }).error(function(jqXHR, textStatus, errorThrown) {

            next = null;
            $('.load-more-wrapper').css('opacity', 0);
	    $('.search-body-wrapper').find('.content').first().removeAttr('style')
	    var z = (window.page == 'location') ? 'location feed' : 'user feed'
	    var z = 'Anonymous ' + z + ' request rate limited.'
	    $('.search-result-box').html(z)
	    throw z
            //$.post(folder + "/app/controllers/ajax.php", {update_request: 'js_error', type: 'load_more'});
	    })

	    } else {

            next = null;
            $('.load-more-wrapper').css('opacity', 0);
	    $('.search-body-wrapper').find('.content').first().removeAttr('style')
	    var z = (window.page == 'location') ? 'location feed' : 'user feed'
	    var z = 'Anonymous ' + z + ' request rate limited.'
	    $('.search-result-box').html(z)
	    throw z
            //$.post(folder + "/app/controllers/ajax.php", {update_request: 'js_error', type: 'load_more'});

	    }

        });
    }

    function loadMoreComments() {
        $('.load-more-wrapper').css('opacity', 1);
        $.getJSON("https://www.instagram.com/graphql/query/?query_hash=97b41c52301f77ce508f55e66d17620e&variables={\"shortcode\":\"" + short_code + "\",\"first\":32,\"after\":\"" + next + "\"}", function(data) {
            data = data.data;
            if ($.isEmptyObject(data.shortcode_media.edge_media_to_parent_comment.edges) === true) {
                next = null;
                $('.load-more-wrapper').css('opacity', 0);
            }
            let comments = data.shortcode_media.edge_media_to_parent_comment.edges;
            if ($.isEmptyObject(comments) === false) {
                $.each(comments, function(i, item) {
                    $('#commantsPlace').append('<div class="comment">\n' +
                        '                <div class="comment-user">\n' +
                        '                    <div class="comment-user-avatar">\n' +
                        '                        <a href="' + site_url.substring(0,site_url.length-1) + '#profile#' + item.node.owner.username + '">\n' +
                        '                            <img src="' + item.node.owner.profile_pic_url + '" alt="' + item.node.owner.username + '">\n' +
                        '                        </a>\n' +
                        '                    </div>\n' +
                        '                    <div class="comment-user-nickname">\n' +
                        '                        <a href="' + site_url.substring(0,site_url.length-1) + '#profile#' + item.node.owner.username + '">@' + item.node.owner.username + '</a>\n' +
                        '                    </div>\n' +
                        '                </div>\n' +
                        '                <div class="comment-text">\n' +
                        '                    ' + item.node.text + '\n' +
                        '                </div>\n' +
                        '            </div>');
                });
                if (data.shortcode_media.edge_media_to_parent_comment.page_info.has_next_page) {
                    next = data.shortcode_media.edge_media_to_parent_comment.page_info.end_cursor;
                    $('.load-more-wrap').show();

                    scroll = !scroll;
                } else {
                    next = null;
                }
                $('.load-more-wrapper').css('opacity', 0);
            } else {
                next = null;
                $('.load-more-wrapper').css('opacity', 0);
            }
            //$.post(folder + "/app/controllers/ajax.php", {update_request: 'js_success'});
        }).error(function(jqXHR, textStatus, errorThrown) {
            next = null;
            $('.load-more-wrapper').css('opacity', 0);
	    $('.search-body-wrapper').find('.content').first().removeAttr('style')
	    var z = 'Anonymous comments feed request rate limited.'
	    $('.search-result-box').html(z)
	    throw z
            //$.post(folder + "/app/controllers/ajax.php", {update_request: 'js_error', type: 'load_more'});
        });
    }

    const commentBlock = $('#commantsPlace');

    if (commentBlock.length > 0 && window.page == 'media') {
        commentBlock.infiniteScroll({
            path: () => nextPageUrl,
            append: '.comment',
            checkLastPage: '.pagination-next-page-input',
            history: false,
            animate:false
        });

        commentBlock.on('request.infiniteScroll', () => {
            $loadingNotice.css('opacity', 1);
        });

        commentBlock.on('load.infiniteScroll', (e, res) => nextPageUrl = $(res).find('.pagination-next-page-input').val());

        commentBlock.on('error.infiniteScroll', () => {
            $loadingNotice.css('opacity', 0);
        });

        commentBlock.on('append.infiniteScroll', (e, res, path, items) => {
            $loadingNotice.css('opacity', 0);
        });

        $(window).scroll(function() {
            if(($(window).scrollTop()+75) < ($(document).height() - $(window).height()))
                return;

            if (scroll || next == null)
                return;
            scroll = !scroll;

            loadMoreComments();
        });
    }

    if ($('.tag-page').length > 0 && window.page == 'tag') {
        $(window).scroll(function() {console.log(($(window).scrollTop()) +' - < - '+ ($(document).height() - $(window).height())); console.log(scroll +' '+next+' '+window.page)
            if(($(window).scrollTop()+75) < ($(document).height() - $(window).height()))
                return;

            if (scroll || next == null || window.page != 'profile')
                return;
            scroll = !scroll;

            loadMoreTag();
        });
    }


        let first = false;
	function paginate() {
            if(($(window).scrollTop()+75) < ($(document).height() - $(window).height()))
                return;

            if (first) {
                $('.load-more-wrapper').css('opacity', 1);
                $.get("https://www.instagram.com/" + _username + "/?hl=en", function(data) {
                    let c = /<script type="text\/javascript">window\._sharedData = (.*);<\/script>/g.exec(data);
                    if(!c && 0===c.length) {
                        $('.load-more-wrapper').css('opacity', 0);
                        return;
                    }
                    if (!JSON.parse(c[1]).entry_data.ProfilePage) {
                        //$.post(folder + "/app/controllers/ajax.php", {update_request: 'js_error'});
                        $('.load-more-wrapper').css('opacity', 0);
                        return;
                    }
                    data = JSON.parse(c[1]).entry_data.ProfilePage[0];
                    let user = data.graphql.user;
                    if (user.edge_owner_to_timeline_media.page_info.has_next_page) {
                        next = user.edge_owner_to_timeline_media.page_info.end_cursor;
                        // scroll = false;
                        // nextPageUrl = null;
                        // $postsMasonry.infiniteScroll('destroy')

                        if (scroll || next == null) {
                            $('.load-more-wrapper').css('opacity', 0);
                            return;
                        }
                        scroll = !scroll;

                        loadMore();
                    } else {
                        $('.load-more-wrapper').css('opacity', 0);
                        return;
                    }
                }).error(function(jqXHR, textStatus, errorThrown) {
                    //$.post(folder + "/app/controllers/ajax.php", {update_request: 'js_error'});
                    $('.load-more-wrapper').css('opacity', 0);
                });

                first = !first;
            } else {
                if ((scroll || next == null) && !window.next1)
                    return;
                scroll = !scroll;

                loadMore();
            }

	}//paginate


    if ($('.profile-box-photos').length > 0) {


	if (window.next1) {
	  window.paginate = paginate
	}
        $(window).scroll(function() { console.log('photo scroll')
	  window.page = location.href.split('#')[1]
	  if (window.page == 'profile' || window.page == 'location') { console.log('photo loc'); paginate() }
        });

        let has_story = false;
	function stories() {

	if (window.page == 'profile' && window.page0)//
        $.getJSON('https://www.instagram.com/graphql/query/?query_hash=ad99dd9d3646cc3c0dda65debcd266a7&variables={"user_id":"' + query + '","include_chaining":false,"include_reel":false,"include_suggested_users":false,"include_logged_out_extras":true,"include_highlight_reels":false,"include_related_profiles":true,"include_live_status":false}', function(data) {
	    data = data.data;
	    if (!(data.user && data.user.has_public_story)) {
		$('.stories_container').html('')
	        return;
	    }
	    //$.post(folder + "/app/controllers/ajax.php", {update_request: 'js_success'});
	    $.post(folder + "/app/controllers/ajax.php", {query: query, type: "story"}, function (data) {
		data = JSON.parse(data);
		if (data.stories_title !== '') {
		    has_story = true;
		    $(".stories_container").html('<div class="box-stories">\n' +
			'		<div class="content">' + data.stories_container + '</div>\n' +
			'	</div>');
		}
		$('.owl-carousel').owlCarousel({
		    loop: false,
		    margin: 0,
		    nav: true,
		    startPosition: 0,
		    navText: ['<span class="flaticon-keyboard-left-arrow-button"></span>', '<span class="flaticon-keyboard-right-arrow-button"></span>'],
		    dots: false,
		    items: 4,
		    responsive : {
			// breakpoint from 0 up
			0 : {
			    items: 2,
			},
			// breakpoint from 480 up
			600 : {
			    items: 3,
			},
			// breakpoint from 768 up
			768 : {
			    items: 4,
			},
			1024 : {
			    items: 5,
			},
		    },
		});
	    }).error(function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR)
	    });

	    // $.post(folder + "/app/controllers/ajax.php", {has_story: has_story,query: query, type: "story_highlight"}, function (data) {
	    //     data = JSON.parse(data);
	    //     if (data.stories_title !== '') {
	    //         if (has_story) {
	    //             $(".stories_title").html(data.stories_title);
	    //             $(".stories_wrapper").append(data.stories_container);
	    //         } else {
	    //             $(".stories_container").html('<div class="box-stories">\n' +
	    //                 '            <div class="content">' + data.stories_container + '</div>\n' +
	    //                 '        </div>');
	    //         }
	    //     }
	    //     $('.owl-carousel').owlCarousel({
	    //         loop: false,
	    //         margin: 0,
	    //         nav: true,
	    //         startPosition: 0,
	    //         navText: ['<span class="flaticon-keyboard-left-arrow-button"></span>', '<span class="flaticon-keyboard-right-arrow-button"></span>'],
	    //         dots: false,
	    //         items: 4,
	    //         responsive : {
	    //             // breakpoint from 0 up
	    //             0 : {
	    //                 items: 2,
	    //             },
	    //             // breakpoint from 480 up
	    //             600 : {
	    //                 items: 3,
	    //             },
	    //             // breakpoint from 768 up
	    //             768 : {
	    //                 items: 4,
	    //             },
	    //             1024 : {
	    //                 items: 5,
	    //             },
	    //         },
	    //     });
	    // });
	}).error(function(jqXHR, textStatus, errorThrown) {
	    //$.post(folder + "/app/controllers/ajax.php", {update_request: 'js_error', type: 'story'});
	});

	}//stories
	if (window.next1) {
	  window.stories = stories
	}

        $(document).on('click', '.stories_switch', function() {
            let type = $(this).data('type');
            let $this = $(this);
            $('.stories_switch').removeClass('active');

            if (type === 'normal') {
                $('.normal_stories').show();
                $('.highlight_stories').hide();

                $this.addClass('active');
            } else {
                $('.highlight_stories').imagesLoaded({ background: true }, function() {
                    $('.normal_stories').hide();
                    $('.highlight_stories').css('opacity', 0);
                    $('.highlight_stories').show();
                    setTimeout(function() {
                        $('.highlight_stories').css('opacity', 1);
                    }, 500);
                    $this.addClass('active');
                });
            }
        });
    }

      if (window.page == 'location') {console.log('loc pag 0')
	loadMore()
        $(window).scroll(function() {
	  if ($('.profile-box-photos').length == 0) { console.log('loc pag 1'); paginate() }
        });
      }
      if (window.page == 'tag') {console.log('tag pag 0')
	loadMoreTag()
        $(window).scroll(function() {
	  if ($('.profile-box-photos').length == 0) { console.log('tag pag 1'); loadMoreTag() }
        });
      }


    if ($('.location-page').length > 0 && window.page0) {//
        $.post(folder + "/app/controllers/ajax.php", {location_name: sessionStorage.getItem('data-location-id'), query: query, type: "story_location"}, function (data) {
            data = JSON.parse(data);
            if (data.stories_title !== '') {
                $(".stories_container").html('<div class="box-stories">\n' +
                    '            <div class="content">' + data.stories_container + '</div>\n' +
                    '        </div>');
            }
            $('.owl-carousel').owlCarousel({
                loop: false,
                margin: 0,
                nav: true,
                startPosition: 0,
                navText: ['<span class="flaticon-keyboard-left-arrow-button"></span>', '<span class="flaticon-keyboard-right-arrow-button"></span>'],
                dots: false,
                items: 4,
                responsive : {
                    // breakpoint from 0 up
                    0 : {
                        items: 2,
                    },
                    // breakpoint from 480 up
                    600 : {
                        items: 3,
                    },
                    // breakpoint from 768 up
                    768 : {
                        items: 4,
                    },
                    1024 : {
                        items: 5,
                    },
                },
            });
        });
    }


    if ($('.tag-page').length > 0 && window.page0) {//
        $.post(folder + "/app/controllers/ajax.php", {query: query, type: "story_tag"}, function (data) {
            data = JSON.parse(data);
            if (data.stories_title !== '') {
                $(".stories_container").html('<div class="box-stories">\n' +
                    '            <div class="content">' + data.stories_container + '</div>\n' +
                    '        </div>');
            }
            $('.owl-carousel').owlCarousel({
                loop: false,
                margin: 0,
                nav: true,
                startPosition: 0,
                navText: ['<span class="flaticon-keyboard-left-arrow-button"></span>', '<span class="flaticon-keyboard-right-arrow-button"></span>'],
                dots: false,
                items: 4,
                responsive : {
                    // breakpoint from 0 up
                    0 : {
                        items: 2,
                    },
                    // breakpoint from 480 up
                    600 : {
                        items: 3,
                    },
                    // breakpoint from 768 up
                    768 : {
                        items: 4,
                    },
                    1024 : {
                        items: 5,
                    },
                },
            });
        });
    }

    $('.popular-post-filter').on('click', function() {
        if ($(this).hasClass('active')) {
            return false;
        }
        $('.popular-post-filter.active').removeClass('active');
        $(this).addClass('active');
        var next = 0;
        var filter = $(this).data('filter');
        document.querySelector('.profiles-scroll').scrollLeft = document.querySelector('.popular-post-filter[data-filter="' + filter + '"]').offsetLeft
        $.post(folder + "/app/controllers/ajax.php",{end_cursor:next, id:query, filter:filter, type:"grabbed"},function(data){
            $postsMasonry.isotope('remove', $postsMasonry.isotope('getItemElements'));

            var $items = $(data);
            // prepend items to grid
            $postsMasonry.prepend( $items )
            // add and lay out newly prepended items
                .isotope( 'prepended', $items );

            $postsMasonry.imagesLoaded().progress( function() {
                $postsMasonry.isotope('layout');
            });
            //showIconsAfterLoad();
            if (isAdBlockActive) {
                $(".adv").remove();
            }
            $postsMasonry.isotope('layout');
            nextPageUrl = $('.box-photos').find('.pagination-next-page-input').first().val();
        });
    });

    // activate share btnc
    if($('.csbuttons').length > 0) {
        $('.csbuttons').cSButtons();
    }

    // search page tab switching
    $('body').on('click', '#result-tabs-head li', function() {
        $('#result-tabs-head li').removeClass('active');
        $(this).addClass('active');
        var tab = $(this).data('tab');
        $('.search-result-box').hide();
        $('#' + tab).show();
    });

    // Search form hack
    $('#searchform').submit(function() {
        var url = $(this).attr('action');
        var value = $(this).find('#search-input').val().replace('#','');
        if (value.length>0) {
           document.location.href = url + 'search#' + value;//tee
        };
        return false;
    });

    // copy current page url
    $('body').on('click', '#copyLink', function(e) {
        e.preventDefault();
        document.querySelector("#copyLink-input").select();
        document.execCommand('copy');
    });


    // posts lightbox
    $('body').on('click', '.launchLightbox', function(e) {
        e.preventDefault();

	var _this = $(this)
        var media = $(this).attr('href');
        if (media === undefined) {
            media = $(this).closest('.photo').find('img').attr('src');
        }
        var poster = $(this).data('video-poster');
        if (poster === undefined) {
            poster = $(this).closest('.photo').find('img').attr('src');
        }
        var type = $(this).attr('data-post-type');
        var stories = $(this).attr('data-stories');

        if(type == 'video') {
            $('#lightbox').html('<video poster="'+poster+'" controls>\
                                    <source src="'+media+'" type="video/mp4">\
                                 </video>');
        } else {
	    var z = _this.attr('data-display-resources'); if (z) z = z.split('###')
	    if (z && z.length > 1) {
	      $('#lightbox').html(
		'<table style="display: inline-block; overflow-y: scroll; max-height: 640px"><tbody>\n'+
		(function(){ var z = '', i; for(i=0;i < _this.attr('data-display-resources').split('###').length; i++) z = z +
				'<tr><img class="lightbox-image" src="'+ _this.attr('data-display-resources').split('###')[i].split(';')[0] +'"></tr>\n'
		return z; })() +
		'</tbody></table>'
	      );
	      $('#lightbox').find('tr').each(function(i){ $(this).append($('#lightbox').find('img').first()) });
	      $('.lightbox-image').first().load(function(){ $('#lightbox').find('table').attr('style','display: inline-block; overflow-y: scroll; max-height: '+ $("#lightbox").outerWidth() +'px' ) });
	    } else if (z) {
		$('#lightbox').html('<img src="'+ $(this).attr('data-display-resources').split('###')[$(this).attr('data-index')].split(';')[0] +'">');
	      } else
		$('#lightbox').html('<img src="'+ $(this).attr('href') +'">');
        }
        $('.lightbox').imagesLoaded().done( function() {
            if (stories === 'stories') {
                $('.lightbox .download_button').data('url', media);
                $('.lightbox .download_button').show();
            }
            $('.lightbox .lightbox-close').show();
        });

        $('body').addClass('lightbox-view');
    });
    $('body').on('click', '.lightbox-bg, .lightbox-close', function(e) {
        e.preventDefault();
        $('#lightbox').html('');
        $('.lightbox .download_button').hide();
        $('.lightbox .lightbox-close').hide();
        $('body').removeClass('lightbox-view');
    });

    $('body').on('click', '.get_video_link', function(e) {
        e.preventDefault();
        var id = $(this).data('id');
        var media = $(this).attr('href');
        if (media === undefined) {
            media = $(this).closest('.photo').find('img').attr('src');
        }
        $('.lightbox-close').hide();
        $('body').addClass('lightbox-view');
        $('#lightbox').html('');
        $.ajax({
            url: folder + '/app/controllers/ajax.php',
            type: "POST",
            data: {
                id: id,
                action: 'get_video_link'
            },
            success: function(url, textStatus, xhr) {
                if (xhr.status === 200) {
                    $('#lightbox').html('<video poster="'+media+'" controls>\
                                <source src="'+url+'" type="video/mp4">\
                             </video>');
                } else {
                    $('#lightbox').html('<img src="'+media+'">');
                }
                $('.lightbox-close').show();
                $('body').addClass('lightbox-view');
            }
        });
    });

    // load more posts
    
    /*
    $('body').on('click', '.load-more-wrap .load-more', function (e) {
        e.preventDefault();
        loadMorePosts($(this), 'none');
    });
    /*
    $('body').on('click', '.load-more-wrap.grabbed .load-more',function () {
        loadMorePosts($(this), 'none');
    });
    */
    

    // load more comments
    $('body').on('click', '.comms .load-more',function (e) {
        e.preventDefault();
        var _this = $(this);
        var query = _this.attr('data-query');
        var last = _this.attr('data-last');
        
        getComments(query, last, 'new', 0);
    });

      $('body').on('click', '.box-print-button', function (e) {
        e.preventDefault();
        var _this = $(this);

        var photo = $(this).closest('.box-photo');
        console.log('photo', photo);
        var img = $(photo).find('.photo img').first();
        console.log('img', img);

        var src = $(img).attr('src');

        var img = document.createElement("IMG");
        img.src = src;
        $('#photo-print-container').html(img);
        $('body').addClass('print-only-photo-box');
        window.print();
        console.log('click .box-print-button src=' + src);
      });

    $('body').on('click', '.download_button', function() {
        // $(this).addClass('downloading_btn');
        // $(this).html('<span class="loading-rolling"></span>');
        var url = $(this).data('url');
        if (url === '#') {
            url = $(this).closest('.photo').find('img').attr('src');
        }

	var elem = $('[href="'+ url +'"]').first()
	if ( elem.attr('data-window-page-url') ) {
	  var z = ['data-post-type','data-shortcode','data-username','data-video-poster','href','data-location-id','data-location-name','data-location-slug','data-time','data-likes','data-comments','data-display-resources','data-caption'], i
	  for(i=0;i < z.length;i++) if (z[i]) { localStorage.setItem(z[i], elem.attr(z[i])) }
	  window.open( elem.attr('data-window-page-url'), '_blank')
	} else {
	    var y = (window.pd && typeof window.pd.data_post_type == 'string') ? window.pd.data_post_type : localStorage.getItem('data-post-type')
	    if (y != 'video') {
	      var z = (window.pd && typeof window.pd.data_display_resources == 'string') ? window.pd.data_display_resources : localStorage.getItem('data-display-resources'), i
	      if (z) { z = z.split('###')
		for(i=0;i < z.length; i++) if (z.length == 1) { window.open( z[i].split(';')[z[i].split(";").length-2] , '_blank') } else {
		  if (!$('.download_link_'+i).length) { $('.download-btn-container').append($('<a href="'+ z[i].split(';')[z[i].split(";").length-2] +'" class="download_button download_link_'+ i +'" onclick="window.open(\'' + z[i].split(';')[z[i].split(";").length-2] +'\', \'_blank\'); return false" style="padding: 19px 8px 19px 8px">'+ (i+1) +'.</a>')) }
		}
	      }
	    } else {
		var z = (window.pd && typeof window.pd.href == 'string') ? window.pd.href : localStorage.getItem('href')
		window.open( z, '_blank')
	      }
	    //downloadPhoto(url);
	  }
    });

    function downloadPhoto(url) {
        var form = $('<form action="' + folder + '/app/controllers/ajax.php" method="post">' +
            '<input type="hidden" name="download" value="true">' +
            '<input type="hidden" name="url" value="' + url + '">' +
            '</form>');
        $('body').append(form);
        form.submit();
        form.remove();
        // $('#download-photo').removeClass('downloading_btn');
        // $('#download-photo').html('<span class="icon-download-alt"></span>');
    }

});
