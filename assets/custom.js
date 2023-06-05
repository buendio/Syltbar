function show_faq_items(id) {
  jQuery('.faq_titles li').removeClass('active');
  jQuery('#item_li_'+id).addClass('active')
  jQuery("html, body").animate({
    scrollTop: jQuery('#item_'+id).offset().top + "px"
 }, {
    duration: 500 
 });
}

function close_sidebar_cart() {
  jQuery('#block_sidebar_cart').removeClass('active');
  jQuery('body').removeClass('overflow-hidden') 
}
function drawerFreeDelveryLine(totalPrice){
 
  if(document.querySelectorAll('.cart_total_shipping_price').length > 0){
    document.querySelectorAll('.cart_total_shipping_price').forEach((item)=>{
      
      if(item.dataset.shipping){
         
       // let currentTotal = Shopify.formatMoney(totalPrice, Shopify.money_format).replace(/\,/g,'').slice(1);
       let currentTotal = Number(totalPrice);       
        let freeMoneyDelivery = Number(item.dataset.shipping);  

        if(currentTotal < freeMoneyDelivery){
          let leaveMoney = 0;
          let percentleave = 0;
          leaveMoney = freeMoneyDelivery - totalPrice; 
          // leaveMoney = parseFloat(leaveMoney.toFixed(4))/100;
          // percentleave = Number(currentTotal) * 100 / freeMoneyDelivery;  

          
          item.querySelector('.cart_free_shipping').innerHTML = leaveMoney;
          item.querySelector('.cart_qualifies_free_shipping_html').classList.add('hidden');
          item.querySelector('.cart_no_qualifies_free_shipping_html').classList.remove('hidden');
          
        }
        else {
          item.querySelector('.cart_qualifies_free_shipping_html').classList.remove('hidden');
          item.querySelector('.cart_no_qualifies_free_shipping_html').classList.add('hidden');
        }
        if (totalPrice == 0) {
          item.classList.add('hidden');
        } else {
          item.classList.remove('hidden');
        }
      }
    })
  } 
}
function fetchCart() {
  fetch('/cart?view=drawer&timestamp=' + Date.now(), {
      method: 'POST',
      headers: {'Accept': `application/javascript`, 'X-Requested-With':`XMLHttpRequest`}
  })
  .then((response) => response.json())
  .then((cart) => {
      //delivery line count
    console.log(cart.item_count)
      drawerFreeDelveryLine(cart.item_count) 

  })
}
  $('.head-cart-wrp').click(function () {
    fetchCart()
    $('#block_sidebar_cart').addClass('active'); 
    jQuery('body').addClass('overflow-hidden')
  })




function add_to_cart_product(id) {
  var vals=jQuery('#cart_product_' + id).val();  
  data = {
    "id": id,
    "quantity": vals
  }
  jQuery.ajax({
    type: 'POST',
    url: '/cart/add.js',
    data: data,
    dataType: 'json',
    success: function(cart) { 
      return fetch('/cart?view=drawer&timestamp=' + Date.now(), {
        credentials: 'same-origin',
        method: 'GET'
      }).then(function (content) {  
        content.text().then(function (html) { 
          fetchCart()
          jQuery('#block_sidebar_cart').html(html);  
          jQuery('#block_sidebar_cart').addClass('active'); 
          jQuery('body').addClass('overflow-hidden');
          jQuery('.cart-counter').removeClass('hidden');
       setTimeout(function(){
          $('#age-gate-input').click(function(){

            if ($(this).is(':checked')){
              $('.mini-cart__checkout').removeAttr("disabled")
            } else {
             $('.mini-cart__checkout').attr("disabled", "disabled") 
            }
          });
},500)
          }); 
      }) 
    }
  });  
}
function preview_card_quantity(id,view) { 
  var vals=jQuery('#cart_product_' + id).val(); 
  vals=parseInt(vals);
  if (view=='plus') {
    vals=vals+1;
  }
  if (view=='minus') {
    vals=vals-1;
    if (vals<1) vals=1;
  }
  jQuery('#cart_product_' + id).val(vals); 
}

function product_card_quantity(id,view) { 
  var vals=jQuery('#product_quantity_' + id).val(); 
  vals=parseInt(vals);
  if (view=='plus') {
    vals=vals+1;
  }
  if (view=='minus') {
    vals=vals-1;
    if (vals<1) vals=1;
  }
 
  jQuery('#product_quantity_' + id).val(vals); 
}


//Jquery Start
;(function ($) {
  // Mobile toogle menu
  $('.mobilelistnav .mob_submenu').after(
    '<div class="sub_menu_btn burslines_menu"><span class="line"></span><span class="line"></span></div>',
  )
  $('.sub_menu_btn').on('click', function () {
    $(this).toggleClass('close_sub_menu')
    $(this).prev('ul').stop().slideToggle()
    $(this).parent().toggleClass('openlist')
  })
  //Target Window Open
  $('.open_target').on('click', function () {
    $($(this).data('target')).fadeIn().addClass('show')
    $(this).addClass('show')
    return false
  })
  $('.close_target').on('click', function () {
    $($(this).data('target')).removeClass('show').fadeOut()
    $('.open_target, .mobilebtn').removeClass('show')
    $('body').removeClass('scroll-hidden')
    return false
  })
  $('.mobilebtn').on('click', function () {
    if ($(this).hasClass('show')) {
      $($(this).data('target')).removeClass('show').fadeOut()
      $(this).removeClass('show')
      $('body').removeClass('scroll-hidden')
    } else {
      $($(this).data('target')).fadeIn().addClass('show')
      $(this).addClass('show')
      $('body').addClass('scroll-hidden')
    }
    return false
  })
  //Sticky head
  // navbar fixed scrolling
  let bodyScroll = $(window).scrollTop()
    let navbar = $('.header-sticky')
    if (bodyScroll > 5) {
      navbar.addClass('header_appear')
    } else {
      navbar.removeClass('header_appear')
    }

  $(window).on('scroll', function () {
    let bodyScroll = $(window).scrollTop()
    let navbar = $('.header-sticky')
    if (bodyScroll > 5) {
      navbar.addClass('header_appear')
    } else {
      navbar.removeClass('header_appear')
    }
  })

  //header counter custom update
  $('.add-to-cart-button').click(function () {
    setTimeout(function () {
      jQuery.getJSON('/cart/update.js', function (cart) {
        if (cart.item_count > 0) {
          $('span.cart-counter').removeClass('hidden')
          $('span.cart-counter').html(cart.item_count)
        }
      })
    }, 700)
  })
  //Header search toogle window
  $('.head-search-btns svg.icon').on('click', function () {
    if ($(this).hasClass('modal__toggle-open')) {
      $('details-modal.header__search').addClass('show')
      $(this).addClass('hidden')
    } else {
      $('details-modal.header__search').removeClass('show')
      $('.modal__toggle-open').removeClass('hidden')
    }
  })
  $('.search-modal__toggle-open').on('click', function () {
    $('.search-modal').addClass('active')
    $('#Search-In-Modal').focus();
  })
  $('.search-modal__close-button').on('click', function () {
    $('.search-modal').removeClass('active')
  })

  if ($('.announcement-bar-slider').length > 0) {
    var announcement_swiper = new Swiper(".announcement-bar-slider", {   
      loop: true,
      direction: "vertical", 
      autoplay: {
        delay: 3000,
        disableOnInteraction:false,
        pauseOnMouseEnter: true
      } 
  });
  }

  $('.our_standards_items .item').on('click', function () {
    if ($(this).hasClass('active')) {
      $(this).removeClass('active')
      $('.our_standards_items .item_text').slideUp()
    } else {
      $('.our_standards_items .item').removeClass('active')
      $('.our_standards_items .item_text').slideUp()
      $(this).addClass('active')
      $(this).find('.item_text').slideDown()
    }
  })

   $('.landing-banner_items .item').on('click', function () {
    if ($(this).hasClass('active')) {
      $(this).removeClass('active')
      $('.landing-banner_items .item_text').slideUp()
    } else {
      $('.landing-banner_items .item').removeClass('active')
      $('.landing-banner_items .item_text').slideUp()
      $(this).addClass('active')
      $(this).find('.item_text').slideDown()
    }
  })

  
  $('.faq_block_item .item_title').on('click', function () {
    if ($(this).parent().hasClass('active')) {
      $(this).parent().removeClass('active')
      $('.faq_block_item .item_text').slideUp()
    } else {
      $('.faq_block_item').removeClass('active')
      $('.faq_block_item .item_text').slideUp()
      $(this).parent().addClass('active')
      $(this).parent().find('.item_text').slideDown()
    }
  })

  
  $('.product__tabs .product__tab').on('click', function () {
    if ($(this).hasClass('active')) {
      $(this).removeClass('active')
      $('.product__tabs .product__tabs_inner').slideUp()
    } else {
      $('.product__tabs .product__tab').removeClass('active')
      $('.product__tabs .product__tabs_inner').slideUp()
      $(this).addClass('active')
      $(this).find('.product__tabs_inner').slideDown()
    }
  })
  
  if ($('.reviews-slider').length > 0) {
    var reviews_slider = new Swiper(".reviews-slider", {   
      loop: true,
      autoplay: true,
      autoplaySpeed: 2000,
      grabCursor: true, 
      centerInsufficientSlides: true,
       autoHeight: true,calculateHeight:true,
      navigation: {
        nextEl: '.swiper-button-next-reviews',
        prevEl: '.swiper-button-prev-reviews',
      },
      pagination: {
        el: '.swiper-pagination-reviews',
        clickable: true,
        type: "bullets"
      },
      breakpoints: { 
    760: {
      autoHeight: false,calculateHeight:false,
    }
  }
  }); 
  }

 if ($('.bannerimage-slider').length > 0) {
    var image_btn_wrapper = new Swiper(".bannerimage-slider", {   
      loop: false,
      autoplay:true,
      autoplaySpeed: 4000,
      grabCursor: true, 
      centerInsufficientSlides: true,
      navigation: {
        nextEl: '.bannerimage-slider .swiper-button-next-reviews',
        prevEl: '.bannerimage-slider .swiper-button-prev-reviews',
      },
       pagination: {
        el: '.swiper-pagination-reviews',
        clickable: true,
        type: "bullets"
      },
      breakpoints: { 
    760: {
      autoHeight: false,calculateHeight:false,
    }
  }
  }); 
  }
  
  if ($('.product-grid-slider').length > 0) {
    var product_grid_slider = new Swiper(".product-grid-slider", {  
      spaceBetween: 24, 
      slidesPerView: 3,
      watchOverflow: true, 
      freeMode: true,
      centerInsufficientSlides: true,
      passiveListeners: false,
      preventClicks: false, 
      pagination: {
        el: '.swiper-pagination-reviews',
        clickable: true,
        type: "bullets"
      },
      breakpoints: { 
        320: {
          slidesPerView: 1.4
         },
         576: {
          slidesPerView: 2
           
         },
         991: {
          slidesPerView: 3
         },
         1200: {
           grabCursor: false,
           allowTouchMove: false
         }
      } 
  }); 
  } 

  if ($('.product-grid-slider2').length > 0) {
    var product_grid_slider2 = new Swiper(".product-grid-slider2", {  
      spaceBetween: 24, 
      slidesPerView: 3,
      watchOverflow: true, 
      freeMode: true,
      centerInsufficientSlides: true,
      passiveListeners: false,
      preventClicks: false, 
      pagination: {
        el: '.swiper-pagination-reviews',
        clickable: true,
        type: "bullets"
           },
      breakpoints: { 
        320: {
          slidesPerView: 1.4
         },
         576: {
          slidesPerView: 2
         },
         991: {
          slidesPerView: 3
         },
         1200: {
           grabCursor: false,
           allowTouchMove: false
         }
      } 
  }); 
  } 
  
  if ($('.product-recommendations-slider').length > 0) {
    
  }


 //Product image popup
  $('.js-zoom-image').magnificPopup({
      
		type: 'image',
		tLoading: 'Loading image #%curr%...',
		mainClass: 'mfp-img-mobile',
  });

})(jQuery) //END jQuery
