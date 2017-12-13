var app = {

    model: {},

    modelMeet: {
        'titulo': '',
        'fecha': '',
        'users':[]
    },

    auxModelMeet: {
        'titulo': '',
        'fecha': '',
        'users':[]
    },

    order: [],

    inventory: {},

    auxInvent : {},

    meets: [],

    weekday: ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'],

    monthyear: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],

    odd: 0,

    firebaseConfig: {
        apiKey: "AIzaSyCspPFp4TAhFXrkwsy-9N8DO3lNFtYQY5k",
        authDomain: "reuniones-b24ce.firebaseapp.com",
        databaseURL: "https://reuniones-b24ce.firebaseio.com",
        projectId: "reuniones-b24ce",
        storageBucket: "reuniones-b24ce.appspot.com",
        messagingSenderId: "1083009736195"
    },

    setSnap: function(snap){
        app.model = snap;
        app.inventory = snap.inventory;
        app.auxInvent = jQuery.extend(true,{},app.inventory);
        app.refreshData();
        app.refreshMeets();
        app.loadClients();
        app.refreshOrders();
    },

    refreshOrders: function(){
        var users = $('#orderstatus');
        users.html('');
        var codigo = '<table class="table table-bordered"';
                codigo += '<tbody>';
                    codigo += '<tr>';
                        codigo += '<th>Nombre</th>';
                        codigo += '<th>Bebida</th>';
                        codigo += '<th>Estado</th>';
                    codigo += '</tr>';
                for (var i=0; i<app.model.order.orders.length; i++) {
                    for(var key in app.model.order.orders[i]){
                            codigo += '<tr onclick="app.idConfirm('+i+');" data-toggle="modal" data-target="#myModal7">';
                                codigo += '<td>'+key+'</td>'
                                codigo += '<td>'+app.model.order.orders[i][key]['Bebida']+'</td>';
                                if (app.model.order.orders[i][key]['entregado'] === 1) {
                                    codigo += '<td>'+Entregado+'</td>';    
                                }
                                else if (app.model.order.orders[i][key]['entregado'] === 2) {}{
                                    codigo += '<td>'+Recibido+'</td>';
                                }
                                else{
                                    codigo += '<td>'+Enviado+'</td>';
                                }
                            codigo += '</tr>';
                    }
                }
                codigo += '</tbody>';
            codigo += '</table>';
        users.append(codigo);
    },

    refreshName: function(data){
        var users = $('#menu-options');
        users.html('');
        var codigo = '';
        for(var i=0; i<app.model.meetings[data]['users'].length; i++){
            if (app.odd) {
                codigo += '<div class="name-odd" id="'+app.model.meetings[data]['users'][i]['Cliente']+'_'+data+'" onclick="app.nextPage(this);">'+app.model.meetings[data]['users'][i]['Nombre']+'</div>';
                app.odd = 0;
            }
            else{
                codigo += '<div class="name-even" id="'+app.model.meetings[data]['users'][i]['Cliente']+'_'+data+'" onclick="app.nextPage(this);">'+app.model.meetings[data]['users'][i]['Nombre']+'</div>';
                app.odd = 1;
            }
        }
        codigo += '<div onclick="app.newClient();" style="padding:5%;padding-bottom:20%;font-size:20px;border-color:#004f64;text-align:center;">Agregar Persona <b>+</b></div>';
        app.odd = 0;
        codigo += '<div id="meet-id" style="display:none;">'+data+'</div>';
        users.append(codigo);
        app.modelMeet = app.model.meetings[data];
    },

    newClient: function(){
        document.getElementById('nuevoClient').style.display = 'block';
        document.getElementById('menu-options').style.display = 'none';
        document.getElementById('title').style.display = 'none';
        document.getElementById('buttons').style.display = 'none';
    },

    closeNewC: function(){
        document.getElementById('nuevoClient').style.display = 'none';
        document.getElementById('menu-options').style.display = 'block';
        document.getElementById('title').style.display = 'block';
        document.getElementById('buttons').style.display = 'block';
    },

    refreshMeets: function(){
        var users = $('#meets');
        var today = new Date();
        users.html('');
        var codigo = '';
        var codigo = '<table class="table table-bordered" id="guests3">';
                codigo += '<tbody>';
                    codigo += '<tr>';
                        codigo += '<th>Fecha</th>';
                        codigo += '<th>Hora</th>';
                        codigo += '<th>Título</th>';
                    codigo += '</tr>';
                for (var key in app.model.meetings) {
                        var dd = app.model.meetings[key]['fecha'].split(' ');
                        var datee = dd[0].split('/');
                        var dait = new Date(datee[2],datee[0]-1,datee[1]);
                        var today = new Date();
                        if (dait.toDateString() === today.toDateString()) {
                            codigo += '<tr onclick="app.userPage('+"'"+key+"'"+');" data-dismiss="modal">';
                                codigo += '<td>Hoy</td>';
                                codigo += '<td>'+dd[1]+' '+dd[2]+' - '+dd[4]+' '+dd[5]+'</td>';
                                codigo += '<td>'+app.model.meetings[key]['titulo']+'</td>';
                            codigo += '</tr>';
                        }
                }
                codigo += '</tbody>';
            codigo += '</table>';
        users.append(codigo);
    },

    meetPage: function(){
        app.refreshMeets();
        app.order = [];
        app.refreshCart();
        app.refreshShopping();
        document.getElementById('back').style.display = 'none';
        document.getElementById('back2').style.display = 'none';
        document.getElementById('check').style.display = 'none';
        document.getElementById('check2').style.display = 'none';
        document.getElementById('menu-options').style.display = 'none';
        document.getElementById('title').style.display = 'block';
        document.getElementById('title').innerHTML = 'Vive la experiencia Soutec';
        document.getElementById('menu-meetings').style.display = 'block';
        app.modelMeet = {'titulo':'','sala':'','fecha':'','tech':{},'mat':{},'food':{},'users':[]};
    },

    userPage: function(data){
        app.refreshName(data);
        document.getElementById('back').style.display = 'inline';
        document.getElementById('back2').style.display = 'inline';
        document.getElementById('check').style.display = 'inline';
        document.getElementById('check2').style.display = 'inline';
        $('#back').attr("onclick","app.meetPage()");
        $('#back2').attr("onclick","app.meetPage()");
        document.getElementById('menu-options').style.display = 'block';
        document.getElementById('title').style.display = 'block';
        document.getElementById('title').innerHTML = '¡Bienvenido! Por favor seleccione su nombre';
        document.getElementById('menu-meetings').style.display = 'none';
        document.getElementById('menu').style.display = 'none';
    },

    nextPage: function(data){
        var next = data.id.split(/_(.+)/)[0];
        var prev = data.id.split(/_(.+)/)[1];
        var meetid = document.getElementById('meet-id').innerHTML;
        if (app.model.meetings[meetid]['tipo'] === 'regular') {
            document.getElementById('options-reg').style.display = 'block';
            document.getElementById('options-vip').style.display = 'none';
        }
        else{
            document.getElementById('options-reg').style.display = 'none';
            document.getElementById('options-vip').style.display = 'block';
        }
        document.getElementsByClassName('title-clients')[1].innerHTML = '<span style="font-style:italic;color:#00a5ba;font-size:24px;">' + data.innerHTML + '</span>, escoge aquí tu bebida';
        document.getElementsByClassName('title-clients')[1].id = next;
        document.getElementById('title').style.display = 'none';
        document.getElementById('menu-options').style.display = 'none';
        document.getElementById('menu').style.display = 'block';
        document.getElementById('back').style.display = 'inline';
        document.getElementById('back2').style.display = 'inline';
        $('#back').attr("onclick","app.userPage('"+prev+"')");
        $('#back2').attr("onclick","app.userPage('"+prev+"')");
    },

    previousPage: function(){
        document.getElementById('menu').style.display = 'none';
        document.getElementById('menu-options').style.display = 'block';
        document.getElementById('title').style.display = 'block';
    },

    saveOrder: function(opt){
        var user = document.getElementsByClassName('title-clients')[1].innerHTML.split('>')[1].split('<')[0];
        var client = document.getElementsByClassName('title-clients')[1].id;
        var meetId = document.getElementById('meet-id').innerHTML;
        var opts,coment,drink;
        var pedid = 0;
        var alcohol = 0;
        switch(opt){
          case 1:
            opts = document.getElementsByClassName('options-refresh');
            coment = document.getElementById('refresh-comment').value;
            if (document.getElementById('ice5').checked) {
                coment = document.getElementById('ice5').value+'.'+coment;
            }
            if (document.getElementById('ice6').checked) {
                coment = document.getElementById('ice6').value+'.'+coment;
            } 
            break;
          case 2:
            opts = document.getElementsByClassName('options-hot');
            coment = document.getElementById('hot-comment').value;
            if (document.getElementById('sugar1').checked) {
                coment = document.getElementById('sugar1').value+'.'+coment;
                if (app.auxInvent['Azucar'] <= 0) {
                    alert('Disculpe en estos momentos no tenemos Azucar.');
                    pedid = 1;
                }
                app.auxInvent['Azucar'] -= 1;
            }
            else if (document.getElementById('sugar2').checked) {
                coment = document.getElementById('sugar2').value+'.'+coment;
                if (app.auxInvent['Azucar'] <= 1) {
                    alert('Disculpe en estos momentos no tenemos suficiente Azucar.');
                    pedid = 1;
                }
                else app.auxInvent['Azucar'] -= 2;
            }
            else if (document.getElementById('sugar3').checked) {
                coment = document.getElementById('sugar3').value+'.'+coment;
                if (app.auxInvent['Azucar'] <= 2) {
                    alert('Disculpe en estos momentos no tenemos suficiente Azucar.');
                    pedid = 1;
                }
                else app.auxInvent['Azucar'] -= 3;
            }
            else if (document.getElementById('sugar5').checked) {
                coment = document.getElementById('sugar5').value+'.'+coment;
            }
            else if (document.getElementById('sugar6').checked) {
                coment = document.getElementById('sugar6').value+'.'+coment;
                if (app.auxInvent['Splenda'] <= 0) {
                    alert('Disculpe en estos momentos no tenemos Splenda.');
                    pedid = 1;
                }
                else app.auxInvent['Splenda'] -= 1;
            }
            break;
          case 3:
            opts = document.getElementsByClassName('options-soda');
            coment = document.getElementById('soda-comment').value;
            if (document.getElementById('ice3').checked) {
                coment = document.getElementById('ice3').value+'.'+coment;
            }
            if (document.getElementById('ice4').checked) {
                coment = document.getElementById('ice4').value+'.'+coment;
            }     
            break;
          case 4:
            alcohol = 1;
            opts = document.getElementsByClassName('options-alcol');
            coment = document.getElementById('alcol-comment').value;
            if (document.getElementById('ice').checked) {
                coment = document.getElementById('ice').value+'.'+coment;
            }
            if (document.getElementById('ice2').checked) {
                coment = document.getElementById('ice2').value+'.'+coment;
            }
            if (document.getElementById('water').checked) {
                coment = document.getElementById('water').value+'.'+coment;
                if (app.auxInvent['Agua'] <= 0) {
                    alert('Disculpe en estos momentos no tenemos Agua.');
                    pedid = 1;
                }
                else app.auxInvent['Agua'] -= 1;
            }
            if (document.getElementById('soda').checked) {
                coment = document.getElementById('soda').value+'.'+coment;
                if (app.auxInvent['Soda'] <= 0) {
                    alert('Disculpe en estos momentos no tenemos Soda.');
                    pedid = 1;
                }
                else app.auxInvent['Soda'] -= 1;
            }
            if (document.getElementById('chinott').checked) {
                coment = document.getElementById('chinott').value+'.'+coment;
                if (app.auxInvent['Chinotto'] <= 0) {
                    alert('Disculpe en estos momentos no tenemos Refresco de Limón.');
                    pedid = 1;
                }
                else app.auxInvent['Chinotto'] -= 1;
            }
            if (document.getElementById('coke').checked) {
                coment = document.getElementById('coke').value+'.'+coment;
                if (app.auxInvent['Cola'] <= 0) {
                    alert('Disculpe en estos momentos no tenemos Cola.');
                    pedid = 1;
                }
                else app.auxInvent['Cola'] -= 1;
            }
            if (document.getElementById('aguakina').checked) {
                coment = document.getElementById('aguakina').value+'.'+coment;
                if (app.auxInvent['Aguakina'] <= 0) {
                    alert('Disculpe en estos momentos no tenemos Aguakina.');
                    pedid = 1;
                }
                else app.auxInvent['Aguakina'] -= 1;
            }
            break;
        }   
        for(var i=0; i<opts.length; i++){
            if (opts[i].checked) {
                drink = opts[i].id.replace(/-+/g,' ');
            }
        }
        if (drink === "Ron") {
            if (app.auxInvent[drink] <= 0) {
                alert('Disculpe en estos momentos no tenemos '+drink+'.');
                pedid = 1;
            }
            else app.auxInvent[drink] -= 1;
        }
        else if(drink === "Vino Blanco"){
            if (app.auxInvent['VinoBlanco'] <= 0) {
                alert('Disculpe en estos momentos no tenemos '+drink+'.');
                pedid = 1;
            }
            else app.auxInvent['VinoBlanco'] -= 1;
        }
        else if(drink === "Vino Tinto"){
            if (app.auxInvent['VinoTinto'] <= 0) {
                alert('Disculpe en estos momentos no tenemos '+drink+'.');
                pedid = 1;
            }
            else app.auxInvent['VinoTinto'] -= 1;
        }
        else if(drink === "Whisky"){
            if (app.auxInvent[drink] <= 0) {
                alert('Disculpe en estos momentos no tenemos '+drink+'.');
                pedid = 1;
            }
            else app.auxInvent[drink] -= 1;
        }
        else if(drink === "Refresco de Limón"){
            if (app.auxInvent['Chinotto'] <= 0) {
                alert('Disculpe en estos momentos no tenemos Refresco de Limón.');
                pedid = 1;
            }
            else app.auxInvent['Chinotto'] -= 1;
        }
        else if(drink === "Cola"){
            if (app.auxInvent[drink] <= 0) {
                alert('Disculpe en estos momentos no tenemos '+drink+'.');
                pedid = 1;
            }
            else app.auxInvent[drink] -= 1;
        }
        else if(drink === "Cafe con Leche" || drink === "Cafe Marron" || drink === "Cafe Negro"){
            if (app.auxInvent['Cafe'] <= 0) {
                alert('Disculpe en estos momentos no tenemos Cafe.');
                pedid = 1;
            }
            else{
                if (drink === "Cafe Marron") {
                    if (app.auxInvent['CoffeeMate'] <= 0) {
                        alert('Disculpe en estos momentos no tenemos Cafe Marron.');
                    pedid = 1;  
                    }
                    else{
                        app.auxInvent['CoffeeMate'] -= 1;
                        app.auxInvent['Cafe'] -= 1;
                    } 
                }
                else if (drink === "Cafe con Leche") {
                    if (app.auxInvent['Leche'] <= 0) {
                        alert('Disculpe en estos momentos no tenemos Cafe con Leche.');
                    pedid = 1;  
                    }
                    else{
                        app.auxInvent['Leche'] -= 1;
                        app.auxInvent['Cafe'] -= 1;
                    }
                }
                else app.auxInvent['Cafe'] -= 1; 
            }
        }
        else if(drink === "Manzanilla"){
            if (app.auxInvent[drink] <= 0) {
                alert('Disculpe en estos momentos no tenemos '+drink+'.');
                pedid = 1;
            }
            else app.auxInvent[drink] -= 1;
        }
        else if(drink === "Te"){
            if (app.auxInvent[drink] <= 0) {
                alert('Disculpe en estos momentos no tenemos '+drink+'.');
                pedid = 1;
            }
            else app.auxInvent[drink] -= 1;
        }
        else if(drink === "Agua"){
            if (app.auxInvent[drink] <= 0) {
                alert('Disculpe en estos momentos no tenemos '+drink+'.');
                pedid = 1;
            }
            else app.auxInvent[drink] -= 1;
        }
        else if(drink === "Jugo Naranja"){
            if (app.auxInvent['Jugo'] <= 0) {
                alert('Disculpe en estos momentos no tenemos Jugo.');
                pedid = 1;
            }
            else app.auxInvent['Jugo'] -= 1;
        }
        if (!pedid){
           var aux2 = 0;
            for(var i=0; i<app.order.length; i++){
                for(var key in app.order[i]){
                    if (key === user) {
                        if (app.order[i][user]['client'] === client) {
                            var cant = app.order[i][user]['Cantidad'];
                            aux2 = 1;
                            break;
                        }
                    }
                }
            }
            if (!aux2) {
                var cant = 0;
            }
            cant += 1;
            var fecha = new Date();
            var h = fecha.getHours();
            var m = fecha.getMinutes();
            var hora = h+':'+m;
            if (cant <= 2) {
                if (alcohol) {
                    for(var k=0; k<app.model.meetings[meetId]['users'].length; k++) {
                        if (app.model.meetings[meetId]['users'][k]['Nombre']===user) {
                            var aux = {};
                            aux[user] = {};
                            aux[user] = {'Bebida':drink,'Coment':coment,'Cantidad':cant,'meetId':meetId,'entregado':0,'client':client,'hora':hora};
                            app.order.push(aux);
                            app.refreshCart();
                            app.refreshShopping();
                            alert('Pedido anotado');
                        }
                    }
                }
                else{
                    var aux = {};
                    aux[user] = {};
                    aux[user] = {'Bebida':drink,'Coment':coment,'Cantidad':cant,'meetId':meetId,'entregado':0,'client':client,'hora':hora};
                    app.order.push(aux);
                    app.refreshCart();
                    app.refreshShopping();
                    alert('Pedido anotado');
                }
            }
            else{
              alert('Sólo se permiten máximo dos bebidas por persona');
            } 
        }  
        app.clearModal(opt);
    },

    clearModal: function(opt){
        switch(opt){
          case 1:
            document.getElementById('Agua').checked = false;
            document.getElementById('Jugo-Naranja').checked = false;
            document.getElementById('ice5').checked = false;
            document.getElementById('ice6').checked = false; 
            document.getElementById('refresh-comment').value = '';
            break;
          case 2:
            document.getElementById('Cafe-con-Leche').checked = false;
            document.getElementById('Cafe-Marron').checked = false;
            document.getElementById('Cafe-Negro').checked = false;
            document.getElementById('Manzanilla').checked = false;
            document.getElementById('Te').checked = false;
            document.getElementById('sugar1').checked = false;
            document.getElementById('sugar2').checked = false;
            document.getElementById('sugar3').checked = false;
            document.getElementById('sugar5').checked = false;
            document.getElementById('sugar6').checked = false;
            document.getElementById('hot-comment').value = '';
            break;
          case 3:
            document.getElementById('Refresco-de-Limón').checked = false;
            document.getElementById('Cola').checked = false;
            document.getElementById('ice3').checked = false;
            document.getElementById('ice4').checked = false;  
            document.getElementById('soda-comment').value = '';   
            break;
          case 4:
            document.getElementById('Ron').checked = false;
            document.getElementById('Vino-Blanco').checked = false;
            document.getElementById('Vino-Tinto').checked = false;
            document.getElementById('Whisky').checked = false;
            document.getElementById('water').checked = false;
            document.getElementById('chinott').checked = false;
            document.getElementById('coke').checked = false;
            document.getElementById('soda').checked = false; 
            document.getElementById('ice').checked = false;
            document.getElementById('ice2').checked = false; 
            document.getElementById('alcol-comment').value = '';
            break;
        }
    },

    refreshShopping: function(){
        document.getElementById('number-order').innerHTML = app.order.length;
        if (app.order.length) {
            document.getElementsByClassName('badge-pill')[0].style.display = 'block';
            document.getElementsByClassName('badge-pill')[0].style.backgroundColor = '#e80303';
        }
        else{
            document.getElementsByClassName('badge-pill')[0].style.display = 'none';
        }
    },

    refreshCart: function(){
        var users = $('#user-body2');
        users.html('');
        var codigo = '<table class="table table-bordered"';
                codigo += '<tbody>';
                    codigo += '<tr>';
                        codigo += '<th>Empresa</th>';
                        codigo += '<th>Nombre</th>';
                        codigo += '<th>Bebida</th>';
                        codigo += '<th>Comentario</th>';
                    codigo += '</tr>';
                for (var i=0; i<app.order.length; i++) {
                    for(var key in app.order[i]){
                            codigo += '<tr onclick="app.idConfirm('+i+');" data-toggle="modal" data-target="#myModal7">';
                                codigo += '<td>'+app.order[i][key]['client']+'</td>';
                                codigo += '<td>'+key+'</td>'
                                codigo += '<td>'+app.order[i][key]['Bebida']+'</td>';
                                codigo += '<td>'+app.order[i][key]['Coment']+'</td>';
                            codigo += '</tr>';
                    }
                }
                codigo += '</tbody>';
            codigo += '</table>';
        users.append(codigo);
    },

    refreshData: function(){
        var clients = $('#clients-modal');
        var clients2 = $('#clients-modal2');
        clients.html('');
        clients2.html('');
        var codigo = '';
        var codigo2 = '';
        codigo += '<ul class="nav nav-list">';
        codigo2 += '<ul class="nav nav-list">';
        for(var key in app.model.clients){
            codigo += '<li>';
            codigo2 += '<li>';
                codigo += '<label class="tree-toggle nav-header">'+key+'</label>';
                codigo2 += '<label class="tree-toggle nav-header">'+key+'</label>';
                codigo += '<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>';
                codigo2 += '<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>';
                codigo += '<ul class="nav nav-list tree">';
                codigo2 += '<ul class="nav nav-list tree">';
                for(var key2 in app.model.clients[key]){
                    codigo += '<li id="'+key+'_'+key2+'" data-dismiss="modal" onclick="app.addUser(this);">&nbsp;&nbsp;&nbsp;<i class="fa fa-circle-o"></i>&nbsp;'+key2+'</li>';
                    codigo2 += '<li id="'+key+'_'+key2+'" data-dismiss="modal" onclick="app.addUserMeet(this);">&nbsp;&nbsp;&nbsp;<i class="fa fa-circle-o"></i>&nbsp;'+key2+'</li>';
                }
                codigo += '</ul>';
                codigo2 += '</ul>';
            codigo += '</li>';
            codigo2 += '</li>';
        }
        codigo += '</ul>';
        codigo2 += '</ul>';
        clients.append(codigo);
        clients2.append(codigo2);
        $('.tree-toggle').click(function () {
            $(this).parent().children('ul.tree').toggle(200);
        });
        $('.tree-toggle').parent().children('ul.tree').toggle(200);
    },

    addUser: function(data){
        var dato = data.id
        var args = dato.split("_");
        document.getElementById('invited').innerHTML = args[1];
        $('.ocult').attr('id',args[0]);
        app.addClient();
    },

    addUserMeet: function(data){
        var dato = data.id
        var args = dato.split("_");
        document.getElementById('name-clients2').value = args[0];
        document.getElementById('name-client2').value = args[1];
        document.getElementById('email-client2').value = app.model.clients[args[0]][args[1]]['Email'];
    },

    addClient: function(){
        var aux = 0;
        var type;
        var user = document.getElementById('invited').innerHTML;
        var client = document.getElementsByClassName('ocult')[0].id;
        opts = document.getElementsByClassName('options');
        for(var i=0; i<opts.length; i++){
            if (opts[i].checked) {
                type = opts[i].id;
            }
        }
        if(user){
            for(var i=0; i<app.modelMeet['users'].length; i++) {
                if(app.modelMeet['users'][i]['Nombre'] === user && (app.modelMeet['users'][i]['Cliente'] === client || app.modelMeet['users'][i]['Cliente'] === client.replace(' ',''))){
                    alert('Ya se agregó esta persona a la reunión');
                    aux = 1;
                    break;
                }
            }
            if (!aux) {
                try{
                    var car = app.model['clients'][client][user]['Caract'];
                }
                catch(err){
                    var car = app.model['clients'][client.replace(' ','')][user]['Caract'];
                }
                app.modelMeet['users'].push({'Nombre':user,'Cliente':client,'Caract':car});
            }
            app.refreshMeeting();
            app.refreshMeetingModal();
        }
    },

    refreshMeeting: function(){;
        var users = $('#info-meet');
        users.html('');
        var codigo = '';
        codigo += '<label>Invitados para la reunión:</label>';
        for(var i=0; i<app.modelMeet['users'].length; i++){
            codigo += '<div class="input-group" style="width:62.5%;">';
                codigo += '<span class="input-group-addon"><img src="img/social.svg" height="20px"></span>';
                codigo += '<input type="text" class="form-control" value="'+app.modelMeet['users'][i]['Nombre']+'" id="" disabled="">';
                codigo += '<span id="ocult" style="display: none;" class='+app.modelMeet['users'][i]['Cliente']+'></span>';
            codigo += '</div><br>';
        }
        if (app.modelMeet['users'].length > 0) {
            document.getElementById('guardar-button').disabled = false;
        }
        codigo += '<div class="input-group" style="width:62.5%;">';
            codigo += '<span class="input-group-addon"><img src="img/social.svg" height="20px"></span>';
            codigo += '<span class="form-control" style="width: 100%;" data-toggle="modal" data-target="#modalclientes" id="invited">Invitado</span>';
            codigo += '<span class="ocult" style="display: none;"></span>';
        codigo += '</div><br>';
        users.append(codigo);   
    },

    saveName: function(){
        var client = document.getElementById('name-clients').value;
        var name = document.getElementById('name-client').value;
        var email = document.getElementById('email-client').value;
        var coment = document.getElementById('comment').value;
        var aux = 0;
        name = name.charAt(0).toUpperCase() + name.slice(1);
        client = client.charAt(0).toUpperCase() + client.slice(1);
        for(var key in app.model.clients){
            if (key === client) {
                for(var key2 in app.model.clients[client]){
                    if (key2 === name){
                        alert('Esta persona ya está registrada');
                        aux = 1;
                    }
                }
            }
        }
        if (!aux) {
            app.saveFirebase2(client,name,email,coment);
            app.modelMeet['users'].push({'Nombre':name,'Cliente':client,'Caract':coment});
            $('#invited').attr('value',name);
            $('.ocult').attr('id',client);
            app.refreshMeeting();
            app.refreshMeetingModal();
        }
        document.getElementById('name-clients').value = '';
        document.getElementById('name-client').value = '';
        document.getElementById('email-client').value = '';
        var dato = client.replace(' ','')+'_'+name.replace(' ','');
        var args = dato.split("_");
        $('#invited').attr('value',args[1].split(/(?=[A-Z])/).join(" "));
        $('.ocult').attr('id',args[0].split(/(?=[A-Z])/).join(" "));
        app.addClient();
        $('#myModal9').modal('show');
    },

    saveNameMeet: function(){
        var client = document.getElementById('name-clients2').value;
        var name = document.getElementById('name-client2').value;
        var email = document.getElementById('email-client2').value;
        var id = document.getElementById('meet-id').innerHTML;
        name = name.charAt(0).toUpperCase() + name.slice(1);
        client = client.charAt(0).toUpperCase() + client.slice(1);
        var aux = 0;
        for(var key in app.model.clients){
            if (key === client) {
                for(var key2 in app.model.clients[client]){
                    if (key2 === name){
                        aux = 1;
                        break;
                    }
                }
            }
        }
        if (!aux) {
            app.saveFirebase2(client,name,email,'');
        }
        app.modelMeet['users'].push({'Nombre':name,'Cliente':client,'Caract':''});
        app.model.meetings[id] = app.modelMeet;
        app.saveFirebase3(id);
        app.refreshName(id);
        document.getElementById('name-clients2').value = '';
        document.getElementById('name-client2').value = '';
        document.getElementById('email-client2').value = '';
        app.closeNewC();
    },

    saveFirebase2: function(client,name,email,caract){
        firebase.database().ref('clients').child(client).child(name).update({Bebida:[''],Coment:[''],Email:email,Caract:caract});
    },

    saveFirebase3: function(id){
        firebase.database().ref('meetings').child(id).child('users').set(app.modelMeet['users']);
    },

    refreshMeetingModal: function(){
        var today = new Date();
        var month = today.getMonth()+1;
        var hour = today.getHours();
        var min = today.getMinutes();
        var hour2 = hour+2;
        var amopm = 'AM';
        var amopm2 = 'AM';
        if (month < 10) {
            month = '0'+month;
        }
        if (min < 10) {
            min = '0'+min;
        }
        if (hour >= 12) {
            amopm = 'PM';
            if (hour > 12) {
                hour -= 12;
            }
        }
        if (hour <10) {
            hour = '0'+hour;   
        }
        if (hour2 >= 12) {
            amopm2 = 'PM';
            if (hour2 > 12) {
                hour2 -= 12;
            }
        }
        if (hour2 <10) {
            hour2 = '0'+hour2;    
        }
        app.modelMeet['fecha'] = month+'/'+today.getDate()+'/'+today.getFullYear()+' '+hour+':'+min+' '+amopm+' - ';
        app.modelMeet['fecha'] += hour2+':'+min+' '+amopm2;
        app.modelMeet['sala'] = document.getElementById('room-meet').value;
        app.modelMeet['titulo'] = document.getElementById('title-meet').value;
        app.modelMeet['tech'] = {video:0,sound:0,laser:0,comment:''};
        app.modelMeet['mat'] = {brochures:0,brochurep:0,notebook:0,pens:0,magazine:0};
        app.modelMeet['food'] = {food:'No'};
        if (document.getElementById('vipmeet').checked) {
            app.modelMeet['tipo'] = 'vip';
        }
        if (document.getElementById('regmeet').checked) {
            app.modelMeet['tipo'] = 'regular';
        }
        var users = $('#user-body3');
        users.html('');
        var codigo = '<div id="" class="confirmmeet">¿Deseas programar esta reunión?</div><br>';
            codigo += '<div>Título: '+app.modelMeet['titulo']+'</div>';
            codigo += '<div>Tipo: ';
            if (app.modelMeet['tipo'] === 'vip') {
                codigo += 'V.I.P.</div>';
            }
            if (app.modelMeet['tipo'] === 'regular') {
                codigo += 'Regular</div>';
            }
            codigo += '<div>Sala: '+app.modelMeet['sala']+'</div>';
            codigo += '<div>Fecha: '+app.modelMeet['fecha']+'</div>';
            codigo += '<div>Invitados:</div>';
            codigo += '<table class="table table-bordered" id="guests">';
                codigo += '<tbody>';
                    codigo += '<tr>';
                        codigo += '<th>Empresa</th>';
                        codigo += '<th>Nombre</th>';
                        codigo += '<th>Eliminar</th>';
                    codigo += '</tr>';
                for (var i=0; i<app.modelMeet['users'].length; i++) {
                    codigo += '<tr>';
                        codigo += '<td>'+app.modelMeet['users'][i]['Cliente']+'</td>';
                        codigo += '<td>'+app.modelMeet['users'][i]['Nombre']+'</td>';
                        codigo += '<td><i class="fa fa-trash" onclick="app.idConfirm(this)" id="'+app.modelMeet['users'][i]['Cliente'].replace(' ','-')+'_'+app.modelMeet['users'][i]['Nombre'].replace(' ','-')+'" style="margin-left:40%;" data-toggle="modal" data-target="#myModal16"></i></td>';
                    codigo += '</tr>';
                }
                codigo += '</tbody>';
            codigo += '</table>';
        users.append(codigo);
        if (!app.modelMeet['users'][0]) {
            app.delMeet();
        }
    },

    sendMeet: function(){
        var h2 = app.modelMeet['fecha'].split(' ');
        var tit = app.modelMeet['titulo'];
        var fec = app.modelMeet['fecha'].split(' ')[0];
        for(var key in app.model.meetings){
            if (app.model.meetings[key]['titulo']===tit) {
                if (app.model.meetings[key]['fecha'].split(' ')[0]===fec) {
                    var h1 = app.model.meetings[key]['fecha'].split(' ');
                    var hora1 = h1[1]+' '+h1[2];
                    var hora2 = h2[1]+' '+h2[2];
                    if (hora1 === hora2) {
                        firebase.database().ref('meetings').child(key).remove();
                        break;
                    }
                }
            }
        }
        firebase.database().ref('meetings').push(app.modelMeet);
        var color = 0;
        var codigo = '<div>Título: '+app.modelMeet['titulo']+'</div>';
            codigo += '<div>Tipo: ';
            if (app.modelMeet['tipo'] === 'vip') {
                codigo += 'V.I.P.</div>';
            }
            if (app.modelMeet['tipo'] === 'regular') {
                codigo += 'Regular</div>';
            }
            codigo += '<div>Sala: '+app.modelMeet['sala']+'</div>';
            codigo += '<div>Fecha: '+app.modelMeet['fecha']+'</div>';
            codigo += '<div>Invitados:</div>';
            codigo += '<table style="color:#383838;">';
                codigo += '<tbody>';
                    codigo += '<tr>';
                        codigo += '<th style="background:#395062;color:#fff;">Empresa</th>';
                        codigo += '<th style="background:#395062;color:#fff;">Nombre</th>';
                    codigo += '</tr>';
                for (var i=0; i<app.modelMeet['users'].length; i++) {
                    if (color) {
                    codigo += '<tr style="background:#eaeaea;">';
                        color = 0;  
                    }
                    else{
                    codigo += '<tr>';
                        color = 1;
                    }
                        codigo += '<td>'+app.modelMeet['users'][i]['Cliente']+'</td>';
                        codigo += '<td>'+app.modelMeet['users'][i]['Nombre']+'</td>';
                    codigo += '</tr>';
                }
                codigo += '</tbody>';
            codigo += '</table>';
        emailjs.send("gmail","meetings",{message_html: codigo});
        alert('Reunión guardada');
        app.delMeet();
         $('#myModal9').modal('hide');
    },

    delNew: function(opt){
        switch(opt){
            case 1:
                document.getElementById('name-clients').value = '';
                document.getElementById('name-client').value = '';
                document.getElementById('email-client').value = '';
                document.getElementById('comment').value = '';
                break;
            case 2:
                document.getElementById('name-clients2').value = '';
                document.getElementById('name-client2').value = '';
                document.getElementById('email-clien2t').value = '';
                break;
        }
    },

    delMeet: function(){
        document.getElementById('title-meet').value = '';
        document.getElementById('room-meet').value = '';
        document.getElementById('regmeet').checked = false;
        document.getElementById('vipmeet').checked = false;
        var users = $('#info-meet');
        users.html('');
        var codigo = '';
        codigo += '<label>Invitados para la reunión:</label>';
        codigo += '<div class="input-group" style="width:62.5%;">';
            codigo += '<span class="input-group-addon"><img src="img/social.svg" height="20px"></span>';
            codigo += '<span class="form-control" style="width: 100%;" data-toggle="modal" data-target="#modalclientes" id="invited">Invitado</span>';
            codigo += '<span class="ocult" style="display: none;"></span>';
        codigo += '</div><br>';
        users.append(codigo);
        document.getElementById('guardar-button').disabled = true;
        app.meetPage();
    },

    delUser: function(){
        var datos = document.getElementsByClassName('confirm')[0].id;
        var key = datos.split('_')[0].replace('-',' ');
        var key2 = datos.split('_')[1].replace('-',' ');
        var index = -1;
        for(var i=0; i<app.modelMeet['users'].length; i++){
            if (app.modelMeet['users'][i]['Nombre'] === key2 && app.modelMeet['users'][i]['Cliente'] === key) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            app.modelMeet['users'].splice(index,1);
        }
        app.refreshMeeting();
        app.refreshMeetingModal();
    },


    idConfirm: function(data){
        document.getElementsByClassName('confirm')[0].id = data.id; 
    },

    confirmeet: function(datakey){
        document.getElementsByClassName('confirmmeet')[0].id = datakey;
    },
    
    delOrder: function(){
        app.order.splice(document.getElementsByClassName('confirm')[0].id,1);
        app.refreshCart();
        app.refreshShopping();
    },

    saveComments: function(){
        var cc = document.getElementById('client').innerHTML;
        var comment = document.getElementById('client-comment').value;
        var client = document.getElementById('client-name').innerHTML;
        for(var key in app.model.clients[cc]){
            if (key === client) {
                app.model.clients[cc][key]['Coment'] = comment;
                break;
            }
        }
        app.save();
        document.getElementById('client-comment').value = '';
        document.getElementById('client-name').innerHTML = 'Nombre';
        document.getElementById('client-drink').innerHTML = "Bebida";
        document.getElementById('client').innerHTML = "Empresa";
    },

    saveFirebase: function(){
        for(var i=0; i<app.order.length; i++){
          for(var key in app.order[i]){
            for(var key2 in app.order[i][key]){
                if (key2 === 'client') {
                    var aux = app.order[i][key][key2];
                    if (app.model.clients[aux][key]['Bebida'][0] === '') {
                        app.model.clients[aux][key]['Bebida'] = [app.order[i][key]['Bebida']];
                        app.model.clients[aux][key]['Coment'] = [app.order[i][key]['Coment']];
                    }
                    else{
                        app.model.clients[aux][key]['Bebida'].push(app.order[i][key]['Bebida']);
                        app.model.clients[aux][key]['Coment'].push(app.order[i][key]['Coment']);
                    }
                }
            }
          }
        }
        firebase.database().ref('clients').update(app.model.clients);
    },

    sendMail: function(){
        if (app.order.length > 0) {
            var tituloMail;
            var aux = [];
            var color = 0;
            var codigo = '<table style="color:#383838;">';
            codigo += '<tbody>';
                codigo += '<tr>';
                    codigo += '<th style="background:#395062;color:#fff;">Empresa</th>';
                    codigo += '<th style="background:#395062;color:#fff;">Nombre</th>';
                    codigo += '<th style="background:#395062;color:#fff;">Bebida</th>';
                    codigo += '<th style="background:#395062;color:#fff;">Comentario</th>';
                codigo += '</tr>';
            for (var i=0; i<app.order.length; i++) {
                for(var key in app.order[i]){
                        if (color) {
                        codigo += '<tr style="background:#eaeaea;">';
                            color = 0;  
                        }
                        else{
                        codigo += '<tr>';
                            color = 1;
                        }
                            codigo += '<td>'+app.order[i][key]['client']+'</td>'
                            codigo += '<td>'+key+'</td>';
                            codigo += '<td>'+app.order[i][key]['Bebida']+'</td>';
                            codigo += '<td>'+app.order[i][key]['Coment']+'</td>';
                        codigo += '</tr>';
                }
            }
                codigo += '</tbody>';
            codigo += '</table>';
            emailjs.send("gmail","pedidos",{message_html: codigo});
            setTimeout(function(){
                app.sendOrder();
                app.refreshInventory();
                app.saveFirebase();
                app.order = [];
                app.refreshCart();
                app.refreshShopping();
            },200);
            app.previousPage();
            alert('Pedido enviado');
        }
    },

    refreshInventory: function(){
        for(var i=0; i<app.order.length; i++){
            for(var key in app.order[i]){
                if (app.order[i][key]['Bebida'] === 'Agua'){
                    app.inventory['Agua'] = app.inventory['Agua']-1;
                    if (app.inventory['Agua']<0) {
                        app.inventory['Agua'] = 0;
                    }
                }
                else if (app.order[i][key]['Bebida'] === 'Jugo Naranja') {
                    app.inventory['Jugo'] = app.inventory['Jugo']-1;
                    if (app.inventory['Jugo']<0) {
                        app.inventory['Jugo'] = 0;
                    }
                }
                else if (app.order[i][key]['Bebida'] === 'Cafe Negro') {
                    app.inventory['Cafe'] = app.inventory['Cafe']-1;
                    if (app.inventory['Cafe']<0) {
                        app.inventory['Cafe'] = 0;
                    }
                }
                else if (app.order[i][key]['Bebida'] === 'Cafe Marron') {
                    app.inventory['Cafe'] = app.inventory['Cafe']-1;
                    app.inventory['CoffeeMate'] = app.inventory['CoffeeMate']-1;
                    if (app.inventory['CoffeeMate']<0) {
                        app.inventory['CoffeeMate'] = 0;
                    }
                    if (app.inventory['Cafe']<0) {
                        app.inventory['Cafe'] = 0;
                    }
                }
                else if (app.order[i][key]['Bebida'] === 'Cafe con Leche') {
                    app.inventory['Cafe'] = app.inventory['Cafe']-1;
                    app.inventory['Leche'] = app.inventory['Leche']-1;
                    if (app.inventory['Cafe']<0) {
                        app.inventory['Cafe'] = 0;
                    }
                    if (app.inventory['Leche']<0) {
                        app.inventory['Leche'] = 0;
                    }
                }
                else if (app.order[i][key]['Bebida'] === 'Te') {
                    app.inventory['Te'] = app.inventory['Te']-1;
                    if (app.inventory['Te']<0) {
                        app.inventory['Te'] = 0;
                    }
                }
                else if (app.order[i][key]['Bebida'] === 'Manzanilla') {
                    app.inventory['Manzanilla'] = app.inventory['Manzanilla']-1;
                    if (app.inventory['Manzanilla']<0) {
                        app.inventory['Manzanilla'] = 0;
                    }
                }
                else if (app.order[i][key]['Bebida'] === 'Cola') {
                    app.inventory['Cola'] = app.inventory['Cola']-1;
                    if (app.inventory['Cola']<0) {
                        app.inventory['Cola'] = 0;
                    }
                }
                else if (app.order[i][key]['Bebida'] === 'Refresco de Limón') {
                    app.inventory['Chinotto'] = app.inventory['Chinotto']-1;
                    if (app.inventory['Chinotto']<0) {
                        app.inventory['Chinotto'] = 0;
                    }
                }
                else if (app.order[i][key]['Bebida'] === 'Vino Tinto') {
                    app.inventory['VinoTinto'] = app.inventory['VinoTinto']-1;
                    if (app.inventory['VinoTinto']<0) {
                        app.inventory['VinoTinto'] = 0;
                    }
                }
                else if (app.order[i][key]['Bebida'] === 'Vino Blanco') {
                    app.inventory['VinoBlanco'] = app.inventory['VinoBlanco']-1;
                    if (app.inventory['VinoBlanco']<0) {
                        app.inventory['VinoBlanco'] = 0;
                    }
                }
                else if (app.order[i][key]['Bebida'] === 'Ron') {
                    app.inventory['Ron'] = app.inventory['Ron']-1;
                    if (app.inventory['Ron']<0) {
                        app.inventory['Ron'] = 0;
                    }
                }
                else if (app.order[i][key]['Bebida'] === 'Whisky') {
                    app.inventory['Whisky'] = app.inventory['Whisky']-1;
                    if (app.inventory['Whisky']<0) {
                        app.inventory['Whisky'] = 0;
                    }
                }
                var xxx = app.order[i][key]['Coment'].split('.');
                for(var j=0; j<xxx.length; j++){
                    var com = xxx[j].split(' ');
                    var num;
                    try{
                        num = com[0];
                    }
                    catch(err){}
                    if (com[1] === 'agua'){
                        app.inventory['Agua'] = app.inventory['Agua']-1;
                        if (app.inventory['Agua']<0) {
                            app.inventory['Agua'] = 0;
                        }
                    }
                    if (com[1] === 'aguakina'){
                        app.inventory['Aguakina'] = app.inventory['Agua']-1;
                        if (app.inventory['Aguakina']<0) {
                            app.inventory['Aguakina'] = 0;
                        }
                    }
                    if (com[1] === 'soda'){
                        app.inventory['Soda'] = app.inventory['Soda']-1;
                        if (app.inventory['Soda']<0) {
                            app.inventory['Soda'] = 0;
                        }
                    }
                    if(com[1] === 'refresco'){
                        app.inventory['Chinotto'] = app.inventory['Chinotto']-1;
                        if (app.inventory['Chinotto']<0) {
                            app.inventory['Chinotto'] = 0;
                        }
                    }
                    if(com[1] === 'cola'){
                        app.inventory['Cola'] = app.inventory['Cola']-1;
                        if (app.inventory['Cola']<0) {
                            app.inventory['Cola'] = 0;
                        }
                    }
                    if(com[1] === 'azucar'){
                        app.inventory['Azucar'] = app.inventory['Azucar']-num;
                        if (app.inventory['Azucar']<0) {
                            app.inventory['Azucar'] = 0;
                        }
                    }
                    if(com[1] === 'splenda'){
                        app.inventory['Splenda'] = app.inventory['Splenda']-1;
                        if (app.inventory['Splenda']<0) {
                            app.inventory['Splenda'] = 0;
                        }
                    }
                }
            }
        }
        firebase.database().ref().update({inventory:app.inventory});
    },

    sendOrder: function(){
        debugger;
        var hoy = new Date();
        hoy = hoy.toLocaleDateString();
        if (app.model.order['fecha'] === hoy) {
            var aux = app.model.order['orders'];
            for (var i=0; i<app.order.length; i++) {
                aux.push(app.order[i]);
            }
            firebase.database().ref().update({order:{'fecha':hoy,'orders':aux}});
        }
        else{
            firebase.database().ref().update({order:{'fecha':hoy,'orders':app.order}});
        }
    },

    loadClients: function(opt){
        var users = $('#clients');
        users.html('');
        var codigo = '';
        for (var key in app.model.clients) {
            codigo += '<div class="radio" onclick="app.refreshClient(this);" id="'+key+'" data-dismiss="modal">';
                codigo += '<label>';
                    codigo += '<input type="radio" value="'+key+'">&nbsp;&nbsp;';
                    codigo += key;
                codigo += '</label>';
            codigo += '</div>';
        }
        codigo += '<br>';
        users.append(codigo);
    },

    refreshClient: function(dat){
        if (!dat.id) {
            document.getElementById('name-clients').placeholder = "No ha seleccionado el cliente";
        }
        else{
            document.getElementById('name-clients').value = dat.id;
        }

        $('#myModal17').modal('show');
    },

    closeNewP: function(){
        document.getElementById('nuevareu').style.display = 'block';
        document.getElementById('nuevaper').style.display = 'none';
    },

    newPerson: function(){
        document.getElementById('nuevareu').style.display = 'none';
        document.getElementById('nuevaper').style.display = 'block';
    },

    planMeet: function(){
        document.getElementById('nuevareu').style.display = 'block';
        document.getElementById('title22').style.display = 'block';
        document.getElementById('title').style.display = 'none';
        document.getElementById('buttons').style.display = 'none';
        document.getElementById('menu-meetings').style.display = 'none';
    },

    closePlan: function(){
        document.getElementById('nuevareu').style.display = 'none';
        document.getElementById('title').style.display = 'block';
        document.getElementById('title22').style.display = 'none';
        document.getElementById('buttons').style.display = 'block';
        document.getElementById('menu-meetings').style.display = 'block';
    },
}

emailjs.init("user_PA0rFEnpQKHK1FTf69Kqm");
firebase.initializeApp(app.firebaseConfig);

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function(){

    }, false);
}

firebase.database().ref().on('value', function(snap){
    if (snap.val() !== null) {
        app.setSnap(snap.val());
    }
});