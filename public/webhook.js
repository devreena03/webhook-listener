var webhooks = [];
var webhookRef;
var database;
function setup() {
    var config = {
        apiKey: "AIzaSyCAVHyAObAk9kKAAuYeU4a4aggCUVQ6UHs",
        authDomain: "reena-webhooks.firebaseapp.com",
        databaseURL: "https://reena-webhooks.firebaseio.com",
        projectId: "reena-webhooks",
        storageBucket: "reena-webhooks.appspot.com",
        messagingSenderId: "608226426951"
    };
    firebase.initializeApp(config);
    database = firebase.database();
    webhookRef = database.ref("/reena-webhooks");
}

(function () {  
    setup();
    var params = getUrlParams();
    params.username ? loadWebhookDetails(params.username) : showButtonOptions();
})();
//onload();

function loadWebhookDetails(username) {
    document.getElementById("all").style.display = 'none';
    if (username == "all") {
        webhookRef.orderByChild('create_time').on("value", loadTables);
    } else {
        webhookRef.orderByChild("username").equalTo(username).on("value", loadTables);
    }
}

function showButtonOptions(){
   
    webhookRef.orderByChild('create_time').on("value", function(snapshot){
        if (snapshot.exists()) {
            var obj = {};  
            var buttons = `<a type="button" class="btn btn-primary col-md-1" target="_blank" href="/webhook?username=all">All</a>`;        
            snapshot.forEach(function (data) {
                var val = data.val();
                if(!obj[val.username]) {
                   obj[val.username] = "1";
                   buttons = buttons+`<a type="button" style="margin-left: 1%;" class="btn btn-primary col-md-1" target="_blank" href="/webhook?username=`
                   + val.username +`">`+val.username+`</a>`;
                }              
            }); 
            $("#buttons-link").html(buttons);        
        }
    });
   
}

function loadTables(snapshot) {

    var tableContent = `<table style="width:100%" id="ex-table" class="table table-bordered table-striped table-hover table-condensed">
<tr id="tr" class="success">                   
    <th>Webhook ID</th>
    <th>User</th>
    <th>Event Type</th> 
    <th>Resource Id</th>
    <th>Created Time (UTC) </th> 
    <th>Summary</th>
    <th>Actions</th>
</tr>
</table>`;

    if (snapshot.exists()) {
        $("#data").html(tableContent);
        var content = '';
        var arr = [];
        snapshot.forEach(function (data) {
            var val = data.val();
            arr.push(val);
            webhooks.push(val);
        });
        arr = arr.reverse();
        arr.map(function (val, i) {
            content += '<tr style="text-align:center" id="row-' + i + '">';
            content += '<td><a onclick=showDetails("' + val.id + '")>' + val.id + '</a></td>';
            content += '<td>' + val.username + '</td>';
            content += '<td>' + val.event_type + '</td>';
            content += '<td>' + val.resource.id + '</td>';
            content += '<td>' + moment(new Date(val.create_time)).utc().format() + '</td>';
            content += '<td>' + val.summary + '</td>';
            content += '<td><a onclick=deleteWebhook("' + val.id + '")><span class="glyphicon glyphicon-trash"></span></a></td>';
            content += '</tr>';
        })
        $('#ex-table').append(content);
        $("#row-0").toggleClass("clicked");
    }
};

function showDetails(id) {
    var obj;
    for (var i = 0; i < webhooks.length; i++) {
        if (webhooks[i].id == id) {
            obj = webhooks[i];
            break;
        }
    };

    console.log(obj);
    $('#outputData').text(JSON.stringify(obj, null, 2));
    $("#myModal").modal();
}

function deleteWebhook(id){
 console.log(id);
// var ref = ""
 var ref = database.ref("/reena-webhooks/"+id);
 ref.remove()
 .then(function() {
   console.log("Remove succeeded."+id);
 })
 .catch(function(error) {
   console.log("Remove failed: " + error.message)
 });
}

function getUrlParams() {
    var queryStr = window.location.search;
    var params = {};
    if (queryStr) {
        var paramPairs = queryStr.substr(1).split('&');
        for (var i = 0; i < paramPairs.length; i++) {
            var parts = paramPairs[i].split('=');
            params[parts[0]] = parts[1];
        }
        console.log(params);
    }
    return params;
}