var app = express();

app.get('/',function(req,res){

	res.send('<h1>Hey</h1> express');
});

app.get('/me',function(req,res){
	res.send('@planet');
});

var server = app.listen(3000,function(){
	console.log('listening on port 3000, 3k');
});
