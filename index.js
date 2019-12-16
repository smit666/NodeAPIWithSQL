var _expressPackage = require("express");  
var _bodyParserPackage = require("body-parser");  
var _sqlPackage = require("mssql");  
var multer  =   require('multer');
const path = require('path');
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        //Date.now()+ '-'
      callback(null, file.originalname  );
    }
  });
//Initilize app with express web framework  
var app = _expressPackage();  
//To parse result in json format  
app.use(_bodyParserPackage.json());  
  
//Here we will enable CORS, so that we can access api on cross domain.  
app.use(function (req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");  
    next();  
});  
  
//Lets set up our local server now.  
var server = app.listen(process.env.PORT || 4000, function () {  
    var port = server.address().port;  
    console.log("App now running on port", port);  
});  
  
//Set up your sql connection string, i am using here my own, you have to replace it with your own.  
var dbConfig = {  
    user: "sa",  
    password: "Password123",  
    server: "SMIT",  
    database: "smit"  
};  
  
//Function to connect to database and execute query  
var QueryToExecuteInDatabase = function (response, strQuery) {  
    //close sql connection before creating an connection otherwise you will get an error if connection already exists.  
    _sqlPackage.close();  
    //Now connect your sql connection  
    _sqlPackage.connect(dbConfig, function (error) {  
        if (error) {  
            console.log("Error while connecting to database :- " + error);  
            response.send(error);  
        }  
        else {  
            //let's create a request for sql object  
            var request = new _sqlPackage.Request();  
            //Query to run in our database  
            request.query(strQuery, function (error, responseResult) {  
                if (error) {  
                    console.log("Error while connecting to database:- " + error);  
                    response.send(error);  
                }  
                else {  
                    response.send(responseResult);  
                }  
            });  
        }  
    });             
 }  
  
//GET API  
app.get("/EmployeeList", function(_req ,_res){  
    var Sqlquery = "select * from Employees";  
    QueryToExecuteInDatabase(_res, Sqlquery);  
});  
app.get("/StudentList", function(_req ,_res){  
    var Sqlquery = "select * from Student";  
    QueryToExecuteInDatabase(_res, Sqlquery);  
});  
app.get("/DepartmentList", function(_req ,_res){  
    var Sqlquery = "select * from Departments";  
    QueryToExecuteInDatabase(_res, Sqlquery);  
});  

var upload = multer({ storage : storage}).single('userPhoto');
app.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

app.get('/', function(req, res, next) {
   // res.render('index', { title: 'Hello World!' });
   // res.sendFile('index.html');
    res.sendFile(path.join(__dirname+'/index.html'));

});
//Store all JS and CSS in Scripts folder.
app.use("/app", _expressPackage.static('./app/'));
//Store all HTML files in view folder.
app.use(_expressPackage.static(__dirname + '/View'));

