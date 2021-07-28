
var nodemailer = require('nodemailer');
const $ = require('jsrender');



const sendEmail=async(req,res)=>{
  var transporter = nodemailer.createTransport({
    host: 'server290.web-hosting.com',
    port: 587,
  auth: {
    user: 'services@hitechbuddies.com',
    pass: 'et3r%pp^7C^W'
  }
});


    // return path.join(__dirname+'/email-templates/courses.html');
  // const tmpl = jsrender.templates(__dirname+'\\email-templates\\courses.html');
  const tmpl = $.templates("./email/email-templates/courses.html");
  
  console.log(tmpl)
  const data={
      name:'umer'
  }
  const html = tmpl.render(data);
// return res.sendFile(path.join(__dirname+'/email-templates/courses.html'))

  
console.log('reach2')


var mailOptions = { 
  from: 'services@hitechbuddies.com',
  to: 'umerri4@gmail.com',
  subject: 'New Email',
  html:html
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}

module.exports={
  sendEmail
}