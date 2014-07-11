var win = Titanium.UI.createWindow({
    title: 'Office Stuff Finder',
    backgroundColor:'#fff'
});


var db = Ti.Database.open('OSFDB');
db.execute('DROP TABLE IF EXISTS owners;')
db.execute('CREATE TABLE IF NOT EXISTS owners(id INTEGER PRIMARY KEY, name TEXT, address TEXT);');
db.execute("INSERT INTO owners(name, address) values('Wiktor Filipowski win', 'Poznań CITY');")
db.execute("INSERT INTO owners(name, address) values('Wiktor Filipowski', 'OLD TOWN');")
db.execute("INSERT INTO owners(name, address) values('Office Stuff Finder', 'NEW YORK');")

var TiBar = require('tibar');
var label = Titanium.UI.createLabel({
    text:'Office Stuff Finder',
    textAlign:'center',
    width:'auto'
});

var button = Ti.UI.createButton({
    title: "Scan barcode",
    height:50,
    width:250,
    bottom:20
});

button.addEventListener('click', function(){
    TiBar.scan({
        // simple configuration for iPhone simulator
        configure: {
            classType: "ZBarReaderController",
            sourceType: "Album",
            cameraMode: "Default",
            symbol:{
                "QR-Code":true,
                "CODE-128":true,
            }
        },
        success:function(data){
            Ti.API.info('success callback!');
            if(data && data.barcode){
            	var stuff = db.execute("select name, address from owners where name = ? limit 1", data.barcode);
                Ti.UI.createAlertDialog({
                    title: "Scan result",
                    message: "BARCODE: " + data.barcode + " kolo:" + stuff.fieldByName('name') + " Address: " + stuff.fieldByName('address')
                }).show();
            }
        },
        cancel:function(){
            Ti.API.info('TiBar cancel callback!');
        },
        error:function(){
            Ti.API.info('TiBar error callback!');
        }
    });
});

win.add(label);
win.add(button);

win.open();
