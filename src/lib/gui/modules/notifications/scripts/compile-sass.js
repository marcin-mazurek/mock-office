const sass = require('node-sass');
const fs = require('fs');

sass.render({
  file: './lib/Notifications.scss',
}, function(err, result) {
  fs.writeFile('./dist/Notifications.css', result.css, function(err){
    if(err){
      console.log(err);
    }
  });
});