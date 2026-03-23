/* ================================================
   DECCAN KITCHEN KOHIMA — script.js
   Navigation · Cart · WhatsApp Order · Reveal
   ------------------------------------------------
   IMPORTANT: Keep this file in the SAME FOLDER
   as index.html and style.css
   ================================================ */

const cur=document.getElementById('cur'),ring=document.getElementById('ring');
if(cur){
  document.addEventListener('mousemove',e=>{cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px';ring.style.left=e.clientX+'px';ring.style.top=e.clientY+'px';});
  document.querySelectorAll('a,button,.mcard,.special-card,.gal-item').forEach(el=>{
    el.addEventListener('mouseenter',()=>{cur.style.transform='translate(-50%,-50%) scale(2.2)';ring.style.transform='translate(-50%,-50%) scale(1.5)';});
    el.addEventListener('mouseleave',()=>{cur.style.transform='translate(-50%,-50%) scale(1)';ring.style.transform='translate(-50%,-50%) scale(1)';});
  });
}
window.addEventListener('scroll',()=>document.getElementById('navbar').classList.toggle('scrolled',scrollY>60));
function toggleMenu(){
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobDrawer').classList.toggle('open');
  document.getElementById('mobOverlay').classList.toggle('open');
  document.body.style.overflow=document.getElementById('mobDrawer').classList.contains('open')?'hidden':'';
}
function closeMenu(){
  ['hamburger','mobDrawer','mobOverlay'].forEach(id=>document.getElementById(id).classList.remove('open'));
  document.body.style.overflow='';
}
const ro=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:0.07});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));
function filterMenu(btn,cat){
  document.querySelectorAll('.mtab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.menu-cat').forEach(c=>{
    const show=cat==='all'||c.dataset.cat===cat;
    c.style.display=show?'':'none';
    if(show){c.style.opacity='0';setTimeout(()=>c.style.opacity='1',40);}
  });
  if(window.innerWidth<=640)setTimeout(()=>document.getElementById('menu').scrollIntoView({behavior:'smooth',block:'start'}),60);
}
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',function(e){const t=document.querySelector(this.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}});
});

/* ===== WHATSAPP CART ===== */
var WPHONE='918787615736';
var cart={};

function addToCart(name,price,btn){
  if(cart[name]) cart[name].qty+=1;
  else cart[name]={price:parseInt(price),qty:1};
  updateCartUI();
  if(btn){btn.classList.add('added');btn.textContent='✓';setTimeout(function(){btn.classList.remove('added');btn.textContent='+';},900);}
  cartToast('Added: '+name);
}

function changeQty(name,delta){
  if(!cart[name])return;
  cart[name].qty+=delta;
  if(cart[name].qty<=0)delete cart[name];
  updateCartUI();
}

function clearCart(){
  if(Object.keys(cart).length===0)return;
  if(confirm('Clear all items?')){cart={};updateCartUI();}
}

function getTotalItems(){return Object.values(cart).reduce(function(s,i){return s+i.qty;},0);}
function getTotalPrice(){return Object.values(cart).reduce(function(s,i){return s+(i.price*i.qty);},0);}

function updateCartUI(){
  var total=getTotalItems();
  var fab=document.getElementById('cartFab');
  var badge=document.getElementById('cartBadge');
  if(total>0)fab.classList.add('visible');
  else fab.classList.remove('visible');
  badge.textContent=total;
  var itemsEl=document.getElementById('cartItems');
  var keys=Object.keys(cart);
  if(keys.length===0){
    itemsEl.innerHTML='<div class="cart-empty"><div class="cart-empty-icon">🛒</div><div class="cart-empty-text">Your cart is empty</div><div class="cart-empty-sub">Add items from the menu</div></div>';
  } else {
    itemsEl.innerHTML=keys.map(function(n){
      var safeName=n.replace(/'/g,"\'");
      return '<div class="cart-item"><div class="cart-item-info"><div class="cart-item-name">'+n+'</div><div class="cart-item-price">₹'+cart[n].price+' × '+cart[n].qty+' = ₹'+(cart[n].price*cart[n].qty)+'</div></div><div class="cart-item-qty"><button class="qty-btn" onclick="changeQty(\''+safeName+'\', -1)">−</button><span class="qty-num">'+cart[n].qty+'</span><button class="qty-btn" onclick="changeQty(\''+safeName+'\', 1)">+</button></div></div>';
    }).join('');
  }
  document.getElementById('cartTotal').textContent='₹'+getTotalPrice();
  var waBtn=document.getElementById('whatsappBtn');
  if(waBtn)waBtn.disabled=keys.length===0;
}

function openCart(){
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeCart(){
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow='';
}

function sendWhatsApp(){
  var name=document.getElementById('custName').value.trim();
  var phone=document.getElementById('custPhone').value.trim();
  var address=document.getElementById('custAddress').value.trim();
  if(!name){alert('Please enter your name');document.getElementById('custName').focus();return;}
  if(!phone){alert('Please enter your phone number');document.getElementById('custPhone').focus();return;}
  var keys=Object.keys(cart);
  if(keys.length===0){alert('Your cart is empty!');return;}
  var lines=keys.map(function(n){return '  • '+n+' x'+cart[n].qty+' = Rs'+cart[n].price*cart[n].qty;}).join('%0A');
  var total=getTotalPrice();
  var addrLine=address?'%0A Location: '+encodeURIComponent(address):'';
  var msg='New Order - Deccan Kitchen Kohima%0A%0A'
    +'Name: '+encodeURIComponent(name)+'%0A'
    +'Phone: '+encodeURIComponent(phone)+addrLine+'%0A%0A'
    +'Order:%0A'+lines+'%0A%0A'
    +'Total: Rs '+total+'%0A%0A'
    +'(Sent via website)';
  window.open('https://wa.me/'+WPHONE+'?text='+msg,'_blank');
}

function cartToast(msg){
  var t=document.getElementById('cartToast');
  t.textContent='🛒 '+msg;
  t.classList.add('show');
  setTimeout(function(){t.classList.remove('show');},2200);
}

window.addEventListener('DOMContentLoaded',function(){updateCartUI();});