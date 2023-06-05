
//Jquery Start
(function($) {

  
})(jQuery); //jQuery
  
  
  
  /************************************* */
  //Cart quantity chnage price 
  /************************************* */
  
  var Shopify = Shopify || {};
  // ---------------------------------------------------------------------------
  // Money format handler
  // ---------------------------------------------------------------------------
  Shopify.money_format = "${{amount}}";
  Shopify.formatMoney = function(cents, format) {
    if (typeof cents == 'string') { cents = cents.replace('.',''); }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || this.money_format);
  
    function defaultOption(opt, def) {
       return (typeof opt == 'undefined' ? def : opt);
    }
  
    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = defaultOption(precision, 2);
      thousands = defaultOption(thousands, ',');
      decimal   = defaultOption(decimal, '.');
  
      if (isNaN(number) || number == null) { return 0; }
  
      number = (number/100.0).toFixed(precision);
  
      var parts   = number.split('.'),
          dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
          cents   = parts[1] ? (decimal + parts[1]) : '';
  
      return dollars + cents;
    }
  
    switch(formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }
  
    return formatString.replace(placeholderRegex, value);
  };
  
  //Click Plus button
  const itemQuantityPlus = document.querySelectorAll('button[name="plus"]');
  itemQuantityPlus.forEach((item, index) => {
      item.addEventListener('click', () => {
          const line = item.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-line');
          const quantity = Number(item.parentNode.querySelector('.quantity__input').value) + 1;
          const itemId = item.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-id');

          //check max item quantity product
          if(item.previousElementSibling.getAttribute('max') != item.parentNode.querySelector('.quantity__input').value){

            changeItemQuantity(line, quantity);
            //add loader classes
            item.setAttribute('disabled', '')
            document.querySelector('.totulprice').classList.add('loadprice');
            item.parentNode.parentNode.parentNode.nextElementSibling.firstChild.classList.add('loadprice');

            setTimeout(() => {
                $.ajax({ 
                    type: 'POST',
                    url: '/cart/update.js',
                    dataType: 'json',
                    data: { line:line,quantity:quantity },
                    success: function(data) {
                      //get index item after chnage cart
                      let dataItems = data.items
                      dataItems.find((item, index) => {
                        if(itemId == item.id){
                          dataItems = index
                        }
                      })
   
                      let finaltotal = Shopify.formatMoney(data.total_price, Shopify.money_format);
                      let itemfinaltotal = Shopify.formatMoney(data.items[dataItems].final_line_price, Shopify.money_format);
    
                      document.querySelector('.totulprice').innerHTML = finaltotal;
                      item.parentNode.parentNode.parentNode.nextElementSibling.firstChild.innerHTML = itemfinaltotal;
                    
                      //remove loader after change
                      document.querySelector('.totulprice').classList.remove('loadprice');
                      item.parentNode.parentNode.parentNode.nextElementSibling.firstChild.classList.remove('loadprice');
                  
                    }
                });
                //remove special attr
                item.removeAttribute('disabled', '')
                if(item.parentNode.querySelector('.quantity__input').value > 1){
                  item.parentNode.querySelector('button[name="minus"]').removeAttribute('disabled', '')
                }

            }, "1000")

          }else{//end check max quntity 
            //add max qunatity error message
            item.parentNode.parentNode.parentNode.lastElementChild.classList.remove('hidden');
          }//end check max quntity 

      });
  });
  //Click minus button
  const itemQuantityMinus = document.querySelectorAll('button[name="minus"]');
    itemQuantityMinus.forEach((item, index) => {
  
        if(item.parentNode.querySelector('.quantity__input').value == 1){
          item.setAttribute('disabled', '')
        }
  
        item.addEventListener('click', () => {
            const line = item.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-line');
            const quantity = Number(item.parentNode.querySelector('.quantity__input').value) - 1;
            const itemId = item.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-id');
  
            changeItemQuantity(line, quantity);
            
            if(item.parentNode.querySelector('.quantity__input').value == 1){
              item.setAttribute('disabled', '')
            }
  
            if (Number((item.parentNode.querySelector('.quantity__input').value - 1)) === 0) {
                  //item.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
            }
  
            //add special classes
            item.setAttribute('disabled', '')
            //add loader class
            document.querySelector('.totulprice').classList.add('loadprice');
            item.parentNode.parentNode.parentNode.nextElementSibling.firstChild.classList.add('loadprice');
            //remove max qunatity error message
            item.parentNode.parentNode.parentNode.lastElementChild.classList.add('hidden');
  
            setTimeout(() => {
            
                  if(item.parentNode.querySelector('.quantity__input').value > 0){
  
                    $.ajax({
                        type: 'POST',
                        url: '/cart/update.js',
                        dataType: 'json',
                        data: { line:line,quantity:quantity },
                        success: function(data) {
  
                          //get index item after chnage cart
                          let dataItems = data.items
                          dataItems.find((item, index) => {
                            if(itemId == item.id){
                              dataItems = index
                            }
                          })
 
                          let finaltotal = Shopify.formatMoney(data.total_price, Shopify.money_format);
                          let itemfinaltotal;
                            if(data.items[dataItems].final_line_price != undefined){
                              itemfinaltotal = Shopify.formatMoney(data.items[dataItems].final_line_price, Shopify.money_format);
                            }else{
                              itemfinaltotal = 0
                            }
                          document.querySelector('.totulprice').innerHTML = finaltotal;
                         
  
                          item.parentNode.parentNode.parentNode.nextElementSibling.firstChild.innerHTML = itemfinaltotal;
                       
                          //remove loader after change
                          document.querySelector('.totulprice').classList.remove('loadprice');
                          item.parentNode.parentNode.parentNode.nextElementSibling.firstChild.classList.remove('loadprice');
                        
                        }
                    });
                      //remove special classes
                      if(item.parentNode.querySelector('.quantity__input').value > 1){
                        item.removeAttribute('disabled', '')
                      }
                
                  }     
  
              }, "1000")
  
        });
    });
  
  //remove item
  const removeItemcart = document.querySelectorAll('.remove-item-js svg');
  removeItemcart.forEach((item, index) => {
  
    item.addEventListener('click', (e) => {
      e.preventDefault();
      let line = item.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-line');
      removeItem(line)
      //add item price loader
      document.querySelector('.totulprice').classList.add('loadprice');
      //add item line removeclass
      item.parentNode.parentNode.parentNode.parentNode.parentNode.classList.add('removeitem');
    
      setTimeout(() => {
        
        $.ajax({
            type: 'POST',
            url: '/cart/update.js',
            dataType: 'json',
            data: { line:line,quantity:0 },
            success: function(data) {
        
              let finaltotal = Shopify.formatMoney(data.total_price, Shopify.money_format);
             
              document.querySelector('.totulprice').innerHTML = finaltotal;
              //remove loader after change
              document.querySelector('.totulprice').classList.remove('loadprice');
              item.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
              //remove item from doom
              renderItems()
              // if cart empty, reload page
              if(data.total_price === 0){
                location.reload(true)
              }
              
            }
        });
    
      }, "1000")
  
    })
  
  })
  function cartItemCount(cart) {
      let cartCount = document.querySelectorAll('.cart-itemcost');
      cartCount.forEach(item => {
        item.innerHTML = cart.item_count;
      })
  }
  function fetchHandler(cart, callback) {
      cartItemCount(cart);
      if (cart.item_count === 0) {
      } else {
          if ((typeof callback) === 'function') {
              callback(cart);
          }
      }
  }
  function fetchCart(callback) {
      window.fetch('/cart.js', {
          credentials: 'same-origin',
          method: 'GET',
      })
          .then((response) => response.json())
          .then((cart) => this.fetchHandler(cart, callback))
  }
  function changeItemQuantity(line, quantity) {
      window.fetch('/cart/change.js', {
          method: 'POST',
          credentials: 'same-origin',
          body: JSON.stringify({quantity, line}),
          headers: {
              'Content-Type': 'application/json',
          }
      }) 
          .then((response) => response.json())
          .then(() => fetchCart())  
  }
  function removeItem(line) {
    const quantity = 0;
    window.fetch('/cart/change.js', {
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify({quantity, line}),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then(() => this.fetchCart())
        .catch((error) => {});  
  }
  function renderItems(){
    let itemLine = document.querySelectorAll('.cart-item');
    itemLine.forEach((item, index) => {
      item.setAttribute('data-line', index + 1);
    })
  }