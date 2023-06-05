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

let count = 0;
let numbers = [];

cart.items.forEach(element => {
  if (element.product_type !== "Accessory") {
    const productId = element.handle;
    fetch(`/products/${productId}.json`)
      .then(response => response.json())
      .then(product => {
        const str = product.product.tags;
        const arr = str.split(' '); 
        let filteredArr = arr.filter(word => word.includes('bottle')); 
        if (filteredArr[0]) {      
           number = parseInt(filteredArr[0].replace('_bottle', ''));
          numbers.push(number);
          number = number * element.quantity
          count += number; 
          
        } else {
          count += element.quantity;
         
        }
        drawerFreeDelveryLine(count) 
      })
      .catch(error => {console.error(error)});
  }
});

  })
}
function cngMiniCart(data,view) {
    var params = {
        type: 'POST',
        url: '/cart/change.js',
        data: data,
        dataType: 'json',
        success: function (cart) {

            jQuery.getJSON('/cart.js', function (cart, textStatus) { 
                if (cart.item_count == 0) {
                  jQuery('.cart-counter').addClass('hidden');
                } else 
                jQuery('.cart-counter').removeClass('hidden'); 

              })
          
          return fetch('/cart?view='+view+'&timestamp=' + Date.now(), {
              credentials: 'same-origin',
              method: 'GET'
            }).then(function (content) {  
              content.text().then(function (html) { 
                  if (view == 'drawer') {
                  fetchCart()
                    jQuery('#block_sidebar_cart').html(html);  
                    $('#age-gate-input').click(function(){
                      if ($(this).is(':checked')){
                        $('.mini-cart__checkout').removeAttr("disabled")      
                      } else {
                       $('.mini-cart__checkout').attr("disabled", "disabled") 
                      }
                    });
                  }  
                }); 
            })
  
        },
        error: function (XMLHttpRequest, textStatus) {
          Shopify.onError(XMLHttpRequest, textStatus)
        },
      }
      jQuery.ajax(params) 
}

function cngMiniCartVal(line_id,id_item,view) {
    quantity=jQuery('#updates_' + id_item).val(); 
    var data = {
        "id": line_id,
        "quantity": quantity
      } 
      cngMiniCart(data,view);
}

function delMiniCartVal(line_id,view) { 
    var data = {
        "id": line_id,
        "quantity": 0
      } 
      cngMiniCart(data,view);
}

function cngMiniCartQuantity(quantity,line_id,id_item,view) { 
    jQuery('#updates_' + id_item).val(quantity); 
    var data = {
        "id": line_id,
        "quantity": quantity
      }
      cngMiniCart(data,view);
}
 


function on_change_gift(line_key,id_item,view) {
  
  if (jQuery('#Linegift_'+id_item).prop('checked') == true) {
     jQuery('#Linegift_i_'+id_item).addClass('active'); 
    jQuery('#LinePriceList_'+id_item+' input[type="checkbox"]').prop('checked',false);  
  } else { 
    jQuery('#Linegift_i_'+id_item).removeClass('active');
    jQuery('#LinePriceList_'+id_item+' input[type="checkbox"]').prop('checked',true);
     
  }
  jQuery('#LinePriceList_'+id_item+' input[type="checkbox"]').click();
 
}




  
jQuery(document).on("click", '.mini-cart__checkout', function(event) { 
  
   if (jQuery('#carteffectiveAppsAgreeCB').length) {
      if (!document.getElementById('carteffectiveAppsAgreeCB').checked) { 
        jQuery.fancybox.close(); 
        jQuery.fancybox.open({
                      src: effective_apps_tac_alert,
                      type: 'html',
                      baseClass: 'effective_appsf'
                    }) 
         
        event.preventDefault;
        event.stopPropagation;
          return false;
      }
     }
   
  jQuery(".mini-cart-form-items").submit();
}); 

$('#age-gate-input').click(function(){
  if ($(this).is(':checked')){
    $('.mini-cart__checkout').removeAttr("disabled")
  } else {
   $('.mini-cart__checkout').attr("disabled", "disabled") 
  }
});

 jQuery('#CartDrawer-Note').bind('input propertychange', function() {
    let vals= jQuery(this).val();
     jQuery.ajax({
      url: '/cart/update.js',
      type: 'POST',
      data: {note: vals}  
    });
  });