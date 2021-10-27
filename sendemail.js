var email 	= require("emailjs");
var server 	= email.server.connect({
   user:    "", 
   password:"", 
   host:    "CEN302-SMTP.PETRONAS.PETRONET.DIR", 
   ssl:     false
});

server.send({
   text:    "<b>HTML test</b>", 
	from: 'phangchuen.chan@petronas.com.my',
   to: 'phangchuen.chan@petronas.com.my',
   subject: "HTML test",
   attachment: 
   [
      {data: "<html>i <i>hope</i> this works! here is an image: <img src='cid:my-image' width='100' height ='50'> </html>", alternative: true},
      {path:"./src/assets/images/backgrounds/april.jpg", type:"image/jpg", headers:{"Content-ID":"<my-image>"}}
   ]
}, function(err, message) { console.log(err || message); });