const directory = './posts';
const fs = require('fs');
let allFiles = [];

function convertFile(file) {
  return new Promise(function(resolve, reject) {
    const path = directory + '/' + file;
    const lineCount = 6;
    const post = {};
    post.slug = file.slice(0, -3);

    let stream = fs.createReadStream(path, {
      flags: "r",
      encoding: "utf-8",
      fd: null,
      mode: 438,
      bufferSize: 64 * 1024
    });

    let data = "";
    let lines = [];

    stream.on("data", function (moreData) {
      data += moreData;
      lines = data.split("\n");

      if (lines.length > lineCount + 1) {
        stream.destroy();

        lines = lines.slice(1, lineCount - 1);
        lines.map(function(line) {
          const arr = line.split(': ');
          post[arr[0]] = arr[1];
        });
      }
    });

    stream.on("error", function () {
      reject("ERROR in reading files");
    });

    stream.on("close", function () {
      resolve(post);
    });
  });
}

function sortFunction(a,b){  
    var dateA = new Date(a.date).getTime();
    var dateB = new Date(b.date).getTime();
    return dateA > dateB ? -1 : 1;  
};

fs.readdir(directory, (err, files) => {
  const promises = [];
  files.forEach(file => {
    promises.push(convertFile(file));
  });

  Promise.all(promises).then(function(res) {
    var sortedRes = [...res];
    sortedRes.sort(sortFunction);
    const content = JSON.stringify(sortedRes);
    fs.writeFile("./all-posts.json", content, 'utf8', function (err) {
        if (err) { return console.log(err); }
        console.log("The file was saved!");
    }); 
  }, function() {
    console.log("Error")
  });
});
