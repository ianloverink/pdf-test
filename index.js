'use strict';

var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');

var tempDir = path.join(__dirname,'temp');


var htmlToPdf = require('phantom-html-to-pdf')( {
    tmpDir: tempDir
});


const PORT = 8080;


app.get('/convert', (req,res) => {
    htmlToPdf({
        html : fs.readFileSync(path.join(__dirname,'test.html')),
        fitToPage: true
    },(err,pdf) => {
        var pdfPath = path.join(__dirname,'test.pdf');
        var writeStream = fs.createWriteStream(pdfPath);

        writeStream.on('close',() => {
            res.json({
                file: pdfPath,
                numberOfPages: pdf.numberOfPages
            });
        });

        pdf.stream.pipe(writeStream);
    });
});

app.listen(PORT,() => {
    console.log('listening on port ' + PORT);
});
