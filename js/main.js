$(document).ready(function(){
    $(window).scroll(function(){
        // nav바 상단 고정
        // if($(document).scrollTop() > 50){
        //     $('.header_middle').css({
        //         position: 'fixed',
        //         top: '0px',
        //         left: '0',
        //         width: '100%',
        //         backgroundColor: '#000',
        //         zIndex: '999',
        //         display: 'inline-block'
        //     })
        //     $('.header_middle .top_blank').remove();
        //     $('.header_middle').prepend('<div class="top_blank"><h2>semo</h2></div>');

        //     if($(document).scrollTop() > 500){
        //         $('.header_top').fadeIn();
        //         $('.header_top').css({
        //             position: 'fixed',
        //             top: '150px',
        //             right: '50px',
        //             backgroundColor: '#000',
        //             width: '200px',
        //             height: '420px',
        //             display: 'block',
        //             zIndex: '999',
        //             borderRadius: '10px',
        //         })
        //         $('.header_top .top_menu').css({
        //             marginLeft: '50px'
        //         })
        //         $('.header_top .top_menu li').css({
        //             float: 'none',
        //         })
        //         $('.header_top .search').css({
        //             margin: '10px 20px'
        //         })
        //         $('.header_top .kakao').css({
        //             margin: '10px'
        //         })
        //         // $('.header_top .close_btn').remove();
        //         // $('.header_top .side_semo').remove();
        //         // $('.header_top').prepend('<div class="close_btn"><img src="/img/close_btn.png" alt="닫기"></div>')
        //         // $('.header_top').prepend('<div class="side_semo"><h1>#SEMO</h1></div>')
        //     }else{
        //         $('.header_top').css({
        //             position: 'absolute',
        //             top: '0px',
        //             right: '0px',
        //             backgroundColor: 'none',
        //             width: '950px',
        //             height: '50px',
        //             display: 'inline-block',
        //             zIndex: '0',
        //             borderRadius: '0px'
        //         })
        //         $('.header_top .top_menu').css({
        //             marginLeft: '0px'
        //         })
        //         $('.header_top .top_menu li').css({
        //             float: 'left',
        //         })
        //         $('.header_top .search').css({
        //             margin: '5px 0 0 250px'
        //         })
        //         $('.header_top .kakao').css({
        //             margin: '5px 0 0 0'
        //         })
        //         // $('.header_top .close_btn').remove();
        //         // $('.header_top .side_semo').remove();
        //     }
        // }else{
        //     $('.header_middle').css({
        //         position: 'absolute',
        //         top: '50px',
        //         left: '140px',
        //         width: '963.07px',
        //         backgroundColor: 'none',
        //         zIndex: '10',
        //         display: 'block'
        //     })
        //     $('.header_middle .top_blank').remove();
        //     $('.header_top').css('display','inline-block');
        // }


        // 우측 TOP 버튼
        if($(this).scrollTop() > 500){
            $('.right_menu').fadeIn();
        }else{
            $('.right_menu').fadeOut();
        }

        if($(this).scrollTop() > 3450){
            $('.right_menu').css({
                position:'absolute',
                bottom:'500px',
                right:'80px'
            })
        }else{
            $('.right_menu').css({
                position: 'fixed',
                bottom: '100px',
                right: '80px'
            })
        }
    })


    // nav bar sub_category
    $('.acc').each(function(){
        $(this).mouseenter(function(){
            $('.acc > .sub_category').slideDown();
        })
        $(this).mouseleave(function(){
            $('.acc > .sub_category').slideUp();
        })
    })
    $('.community').each(function(){
        $(this).mouseenter(function(){
            $('.community > .community_menu').slideDown();
        })
        $(this).mouseleave(function(){
            $('.community > .community_menu').slideUp();
        })
    })

    // 메인슬라이드
    var count=1;
    var slide = setInterval(func_slide, 3000,'next');
    function func_slide(dir){
        if(dir == 'next'){
            $('.slide_list').animate({
                left:'-1100px'
            },800,function(){
                $('.slide_list').append($('.slide_list > li:first'))
                $('.slide_list').css('left','0px')
            })
            count++;
            if(count>5) count=1;
        }else{
            $('.slide_list').prepend($('.slide_list > li:last'))
            $('.slide_list').css('left','-1920px')
            $('.slide_list').animate({
                left:'0px'
            },800)
            count--;
            if(count<1) count=5;
        }
    }
    // 메인슬라이드 컨트롤 버튼
    $('.main_next').on('click',function(e){
        e.preventDefault();
        clearInterval(slide)
        if($('.slide').is(':animated')==false){
            $('.slide_list').animate({
                left:'-1100px'
            },800,function(){
                $('.slide_list').append($('.slide_list > li:first'))
                $('.slide_list').css('left','0px')
            })
        }
        $('.main_stop').css('display','none');
        $('.main_play').css('display','inline');
    })
    $('.main_prev').on('click',function(e){
        e.preventDefault();
        clearInterval(slide)
        if($('.slide').is(':animated')==false){
            $('.slide_list').prepend($('.slide_list > li:last'))
            $('.slide_list').css('left','-1100px')
            $('.slide_list').animate({
                left:'0px'
            },800)
        }
        $('.main_stop').css('display','none');
        $('.main_play').css('display','inline');
    })
    $('.main_stop').on('click',function(e){
        e.preventDefault();
        clearInterval(slide);
        $(this).css('display','none');
        $('.main_play').css('display','inline');
    })
    $('.main_play').on('click',function(e){
        e.preventDefault();
        slide=setInterval(func_slide,3000,'next')
        $(this).css('display','none');
        $('.main_stop').css('display','inline');
    })

    // Weekly Best Top 10으로 이동하는 버튼
    $('.scroll').on('click',function(){
        $('html,body').animate({
            scrollTop : 3400
        },400);
        return false;
    })

    $('.notice_app .notice_inner .link_slide a').on('mouseenter',function(){
        if($(this).find('img').is(':animated')==false){
            $(this).find('img').animate({
                left: '200px'
            },600)
            $(this).find('span').fadeIn(600);
        }
    })
    $('.notice_app .notice_inner .link_slide a').on('mouseleave',function(){
        $(this).find('img').animate({
            left: '0px'
        },600)
        $(this).find('span').fadeOut(600);
    })

    var num=0;
    $('.hoodie_group > li').on({
        mouseenter:function(){
            num=$(this).index();
            $('.sec06_right > div').hide();
            $('.sec06_right > div').eq(num).show();
        }
    })

    // 우측 Top버튼
    $('.right_menu').click(function(){
        $('html,body').animate({
            scrollTop : 0
        },400);
        return false;
    })
})