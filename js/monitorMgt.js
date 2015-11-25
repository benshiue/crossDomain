function instance_panel(){
    var token = $.cookie('TICKET');
    var username = $.cookie('USERNAME');
    //console.log(token);
    //console.log(username);
    var endpoint = "http://140.92.27.79";
    var upperBound,lowerBound = 0;
    var unit, timeUnit;
    var timeUpBound, timeLowBound = 0;
    var systemperiod=15;
    var order=1;
    var priority=1;
    var sort_iname="iname";

                function redirectToLoginPage(){
                    window.location.href = "login.html";
                }





                this.monitor_defalut = function(instance) {
                        //console.log("Monitor Instance: "+instance);
                        showDialog();
                        $("#detailModal").addClass('show_dialog');
                        cpu_monitoring(instance);
                        mem_monitoring(instance);
                        drawPlot();
                        $('#title_iname').empty();
                        $('#title_iname').append(instance);
                        get_detailed_Instance(instance);
                              
                 }



               function get_detailed_Instance(instance){
                        var url = endpoint + "/spe/services/instance/v1/get?username=" +username+ "&iname=" +instance;
                        var json = new Object();
                        
                        $.ajax({
                            type : "GET",
                            url : url,
                            headers : {
                                "Authorization" : token
                            },
                            dataType : "json",
                            processData : false,
                            async: false,
                            success : function(json) {

                                    var iname = json.iname;
                                    var username = json.username;
                                    var hue_ip = json.hue_ip;
                                    var ambari_ip = json.ambari_ip;
                                    var iname_hash = json.iname_hash;
                                    var cnum = json.cnum;
                                    if (cnum==1){
                                        cnum +=" Running Node";
                                    }else{
                                        cnum +=" Running Nodes";
                                    }

                                    var create_t=json.created_time;
                                    var gene_days = _generatedDays(create_t);
                                    var date = new Date(create_t*1000);
                                    instance_time = date.toLocaleDateString();  

                                    if (iname==instance){
                                    $('#instance_iname').empty();
                                    $('#instance_iname').append(iname);

                                    $('#tenant_name').empty();
                                    $('#tenant_name').append(username);


                                    $('#ambari_ip').empty();
                                    $('#ambari_ip').append(ambari_ip);


                                    $('#hue_ip').empty();
                                    $('#hue_ip').append(hue_ip);


                                    $('#launcg_time').empty();
                                    $('#launcg_time').append(date);


                                    $('#instance_num').empty();
                                    $('#instance_num').append(cnum);

                                    
                                        
                                    }
                            
                            },
                           error : function(jqXHR,textSatus,thrownError) {
                                        if(jqXHR.status == 401)
                                            redirectToLoginPage();                                  
                                }
                        });
    
                    }



                        function _generatedDays(create_t){
                                var date = new Date();
                                var nowSeconds = Math.floor(date / 1000);
                                //console.log("now seconds: " + nowSeconds);
                                var gene_days = Math.floor((nowSeconds - create_t) / 86400);
                                //console.log("generated days : " + gene_days);
                                
                                return gene_days;
                        }


                       function cpu_monitoring(instance) {
                            var data = [];
                            var systemname="";
                            if (instance=="grafana"){
                              systemname = "grafana";  
                            }
                            else{
                              systemname = "heapster";
                            }
                            //console.log(systemname);


                            var systemtype = "cpu";
                            var url ="";


                            //Last 5 mins, drow 60 points
                            if (systemperiod==15){
                            url = "/spe/services/monitor/v1/get?iname=" +systemname+ "&interval=30&past_time=" +systemperiod+ "&resource=" +systemtype+ "&unit=fusage_ns_cumulative";
                            url = endpoint + url;
                            timeUpBound = 15;
                            timeLowBound = 1;
                            timeUnit = "Time (Minutes)";
                            }else if (systemperiod==60){
                            url = "/spe/services/monitor/v1/get?iname=" +systemname+ "&interval=60&past_time=" +systemperiod+ "&resource=" +systemtype+ "&unit=fusage_ns_cumulative";
                            url = endpoint + url;
                            timeUpBound = 60;
                            timeLowBound = 1;
                            timeUnit = "Time (Minutes)";
                            }else if (systemperiod==1440){
                            url = "/spe/services/monitor/v1/get?iname=" +systemname+ "&interval=600&past_time=" +systemperiod+ "&resource=" +systemtype+ "&unit=fusage_ns_cumulative";
                            url = endpoint + url;
                            timeUpBound = 24;
                            timeLowBound = 1;
                            timeUnit = "Time (Hours)";
                            }

                         $.ajax({
                            type : "GET",
                            url : url,
                            headers : {
                                "Authorization" : token
                            },
                            dataType : "json",
                            processData : false,
                            async: false,
                            success : function(json) {

                                var NumOfData = json.monitor_obj.length;
                                var forSort = [];
                                //console.log("NumOfData: "+NumOfData);
                                for (var i = 0; i < NumOfData; i++) {
                                    var selected_system_value = 0;
                                    selected_system_value = json.monitor_obj[i][1];
                                    //console.log(selected_system_value);
                                    forSort.push(selected_system_value);

                                    if (systemperiod == 60) {
                                        if(i != 1) {
                                            data.push([ (((i - 1) * 10) + 1), selected_system_value ]);
                                        } else {
                                            data.push([ i, selected_system_value ]);
                                        }
                                    } 
                                    else if (systemperiod == 1440) {
                                        if(i != 1) {
                                            data.push([ (((i -1) * 4)), selected_system_value ]);
                                        } else {
                                            data.push([ i, selected_system_value ]);
                                        }
                                    } 

                                    else {
                                        data.push([ i, selected_system_value ]);
                                    }
                                    
                                    if(i == 60) {
                                        break;
                                    }

                                }

                               forSort.sort(function(a, b){return a-b});
                                var biggest,smallest = 0;
                                smallest = forSort[0];
                                biggest = forSort[forSort.length-1];
                                //console.log("big and small: " + biggest + "/" + smallest);
                                upperBound = biggest * 1.5;
                                lowerBound = smallest * 0.75;
                                //console.log("upperBound and lowerBound: " + upperBound + "/" + lowerBound);


                            },
                                 error : function(jqXHR,textSatus,thrownError) {
                                                if(jqXHR.status == 401)
                                                    redirectToLoginPage();                                  
                                        }
                            });
                           return data;
                     
                        }




            function mem_monitoring(instance) {
            var data = [];
            var systemname="";

            if (instance=="grafana"){
              systemname = "grafana";  
            }
            else{
              systemname = "heapster";
            }

            var systemtype = "memory";
            var url ="";
            //console.log(systemname);


            //Last 5 mins, drow 60 points
            if (systemperiod==15){
            url = "/spe/services/monitor/v1/get?iname=" +systemname+ "&interval=30&past_time=" +systemperiod+ "&resource=" +systemtype+ "&unit=Fusage_bytes_gauge";
            url = endpoint + url;
            timeUpBound = 15;
            timeLowBound = 1;
            timeUnit = "Time (Minutes)";
            }//過去1hr唷

            else if (systemperiod==60){
            url = "/spe/services/monitor/v1/get?iname=" +systemname+ "&interval=60&past_time=" +systemperiod+ "&resource=" +systemtype+ "&unit=Fusage_bytes_gauge";
            url = endpoint + url;
            timeUpBound = 60;
            timeLowBound = 1;
            timeUnit = "Time (Minutes)";
            }

            else if (systemperiod==1440){
            url = "/spe/services/monitor/v1/get?iname=" +systemname+ "&interval=600&past_time=" +systemperiod+ "&resource=" +systemtype+ "&unit=Fusage_bytes_gauge";
            url = endpoint + url;
            timeUpBound = 24;
            timeLowBound = 1;
            timeUnit = "Time (Hours)";
            }

         $.ajax({
            type : "GET",
            url : url,
            headers : {
                "Authorization" : token
            },
            dataType : "json",
            processData : false,
            async: false,
            success : function(json) {

                var NumOfData = json.monitor_obj.length;
                var forSort = [];
                //console.log(NumOfData);
                for (var i = 0; i < NumOfData; i++) {
                    var selected_system_value = 0;
                    selected_system_value = json.monitor_obj[i][1];
                    //console.log(selected_system_value);
                    forSort.push(selected_system_value);

                    if (systemperiod == 60) {
                        if(i != 1) {
                            data.push([ (((i - 1) * 10) + 1), selected_system_value ]);
                        } else {
                            data.push([ i, selected_system_value ]);
                        }
                    } 
                    else if (systemperiod == 1440) {
                        if(i != 1) {
                            data.push([ (((i -1) * 4)), selected_system_value ]);
                        } else {
                            data.push([ i, selected_system_value ]);
                        }
                    } 
                    else {
                        data.push([ i, selected_system_value ]);
                    }
                    
                    if(i == 60) {
                        break;
                    }

                }

               forSort.sort(function(a, b){return a-b});
                var biggest,smallest = 0;
                smallest = forSort[0];
                biggest = forSort[forSort.length-1];
                //console.log("big and small: " + biggest + "/" + smallest);
                upperBound = biggest * 1.5;
                lowerBound = smallest * 0.75;
                //console.log("upperBound and lowerBound: " + upperBound + "/" + lowerBound);


            },
            error : function(jqXHR,textSatus,thrownError) {
                                        if(jqXHR.status == 401)
                                            redirectToLoginPage();                                  
                                }
            });
           return data;
     
        }

                

                function update() {

                    plot.setData([cpu_monitoring()]);
                    plot.setData([mem_monitoring()]);
                    //plot2.setData([getRandomData()]);
                    // Since the axes don't change, we don't need to call plot.setupGrid()

                    plot.draw();
                    setTimeout(update, updateInterval);
                }

                
                function drawPlot(){
                    var updateInterval = 500;
                    var plot = $.plot("#cpu", [ cpu_monitoring() ], {
                       series : {
                                    label: "Resource Usage",
                                    lines: {
                                            show: true,
                                                fill: true,
                                                fillColor: { colors: [{ opacity: 0.7 }, { opacity: 0.1}] },
                                    },
                                    shadowSize : 5,
                                        points: {
                                                radius: 3,
                                        symbol: "circle",
                                                show: true
                                    }
                                },
                        yaxis : {
                                    axisLabel              : unit,
                                    axisLabelUseCanvas     : true,
                                    axisLabelFontSizePixels: 12,
                                    axisLabelFontFamily    : 'Verdana, Arial',
                                    axisLabelPadding       : 3,
                                    min                    : lowerBound,
                                    max                    : upperBound
                        },
                        xaxis : {
                                    axisLabel              : timeUnit,
                                    axisLabelUseCanvas     : true,
                                    axisLabelFontSizePixels: 12,
                                    axisLabelFontFamily    : 'Verdana, Arial',
                                    axisLabelPadding       : 3,
                                    min                    : timeLowBound,
                                    max                    : timeUpBound,
                                    show                   : true
                                }
                        
                    });
                    var plot = $.plot("#memory", [ mem_monitoring() ], {
                        series : {
                                    label: "Resource Usage",
                                    lines: {
                                            show: true,
                                                fill: true,
                                                fillColor: { colors: [{ opacity: 0.7 }, { opacity: 0.1}] },
                                    },
                                    shadowSize : 5,
                                        points: {
                                                radius: 3,
                                        symbol: "circle",
                                                show: true
                                    }
                                },
                        yaxis : {
                                    axisLabel              : unit,
                                    axisLabelUseCanvas     : true,
                                    axisLabelFontSizePixels: 12,
                                    axisLabelFontFamily    : 'Verdana, Arial',
                                    axisLabelPadding       : 3,
                                    min                    : lowerBound,
                                    max                    : upperBound
                        },
                        xaxis : {
                                    axisLabel              : timeUnit,
                                    axisLabelUseCanvas     : true,
                                    axisLabelFontSizePixels: 12,
                                    axisLabelFontFamily    : 'Verdana, Arial',
                                    axisLabelPadding       : 3,
                                    min                    : timeLowBound,
                                    max                    : timeUpBound,
                                    show                   : true
                                }
                        
                    });
                } 


                //click monitor 
                 $(".item_detail .col-md-2 li").click(function(){

                    //console.log("Click monitor");
                    $index=$(this).index();
                    if($index==1){
                        cpu_monitoring();
                        mem_monitoring();
                        drawPlot();
                    }
                    $(this).siblings('').removeClass('active');
                    $(this).addClass('active');
                    $(".i_de_block").hide();
                    $(".i_de_block").eq($index).show();

                });

                //Period of monitor
                $("#dropdown_15mins").click(function(){
                        var selectedId = this.id;
                        console.log("ID: " + selectedId);
                        systemperiod = 15;
                        cpu_monitoring();
                        mem_monitoring();
                        drawPlot();
                        console.log("systemperiod: " + systemperiod);
                });
                $("#dropdown_1hr").click(function(){
                        var selectedId = this.id;
                        console.log("ID: " + selectedId);
                        systemperiod = 60;
                        cpu_monitoring();
                        mem_monitoring();
                        drawPlot();
                        console.log("systemperiod: " + systemperiod);
                });
                $("#dropdown_1day").click(function(){
                        var selectedId = this.id;
                        console.log("ID: " + selectedId);
                        systemperiod = 1440;
                        cpu_monitoring();
                        mem_monitoring();
                        drawPlot();
                        console.log("systemperiod: " + systemperiod);
                });

 

                function showDialog(){
                $(".bottom_dialog").removeClass('show_dialog');
                $("body").addClass("showEditor");
                    }
                function removeDialog(){
                $(".bottom_dialog").removeClass('show_dialog');
                $("body").removeClass("showEditor");
                    }

                

    
}