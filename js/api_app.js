 var iname="grafana";
 var iname2="heapster";
 var count=0;
 var port=8080;

 function run5() {


$.ajax({  
         async      :false,
         type       : "GET",
         url        : "http://140.92.27.79:"+port+"/api/v1/proxy/namespaces/cluster/services/monitoring-influxdb:api/db/k8s/series?p=root&q=select+container_name,+mean(value)+from+%22memory%2Fusage_bytes_gauge%22+where+time+%3E+now()+-+5m+group+by+time(10s),+container_name+order+asc&u=root",                                         
         contentType: "application/json",                       // 參數格式  
         dataType   : "JSON",                                      // 回傳格式  
         success: function(json)
          {

          for (var i=0; i<json[0].points.length; i++) 
            {
            if (iname==json[0].points[i][2])
                  {
                     var UTC=json[0].points[i][0];
                     var LocalTime = new Date(UTC);
                     $("#5mins_div").append(LocalTime.toLocaleString()+";    ");
                     var mem = json[0].points[i][1]/1048576
                     $("#5mins_div").append("VALUE="+mem+"MB"+'<br/>');
                     count++;
                  }
             } 
                      $("#5mins_div").append(count);
          } // ajax 執行成功  
         , failure: function(msg) { 
          alert("failure");
         } // dir 執行失敗  
         ,error: function(msg) {
          alert("Error");
          }    // dir 執行發生錯誤       
      });  

}

function run15() {
$.ajax({  
         async      :false,
         type       : "GET",
         url        : "http://140.92.27.79:8080/api/v1/proxy/namespaces/cluster/services/monitoring-influxdb:api/db/k8s/series?p=root&q=select+container_name,+mean(value)+from+%22memory%2Fusage_bytes_gauge%22+where+time+%3E+now()+-+24h+group+by+time(180s),+container_name+order+asc&u=root",                                         
         contentType: "application/json",                       // 參數格式  
         dataType   : "JSON",                                      // 回傳格式  
         success: function(json)
          {
          for (var i=0; i<json[0].points.length; i++) 
            {
            if (iname2==json[0].points[i][2])
                  {
                     var UTC=json[0].points[i][0];
                     var LocalTime = new Date(UTC);
                     $("#15mins_div").append(LocalTime.toLocaleString()+";    ");
                     var mem = json[0].points[i][1]/1048576
                     $("#15mins_div").append("VALUE="+mem+"MB"+'<br/>');
                     count++;
                  }
             } 
                      $("#15mins_div").append(count);
           

          } // ajax 執行成功  
         , failure: function(msg) { 
          alert("failure");
         } // dir 執行失敗  
         ,error: function(msg) {
          alert("Error");
          }    // dir 執行發生錯誤       
      });  

}

