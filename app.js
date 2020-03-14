(function app(){   
    // array of json objects
    var classmate_data;
    if(window.sessionStorage.key("classmate_data")){
        try {
            classmate_data = JSON.parse(window.sessionStorage.getItem("classmate_data"));
        } catch(e) {
            // doing nothing for now
        }
    }
    if(!classmate_data) {
        classmate_data = [
            {
            'name'      : 'John',
            'shadow'    : 'no',
            'garlic'     : 'no',
            'complexion': 'pale'
            },
            {
            'name'      : 'Lee',
            'shadow'    : 'yes',
            'garlic'     : 'no',
            'complexion': 'pale'
            },
            {
            'name'      : 'Emma',
            'shadow'    : 'no',
            'garlic'     : 'yes',
            'complexion': 'brown'
            },
            {
            'name'      : 'Ava',
            'shadow'    : 'yes',
            'garlic'     : 'yes',
            'complexion': 'olive '
            },
            {
            'name'      : 'Alex',
            'shadow'    : 'no',
            'garlic'     : 'no',
            'complexion': 'brown'
            }
        ]; 
        window.sessionStorage.setItem("classmate_data", JSON.stringify(classmate_data));
    }

   // Load the Visualization API and the corechart package.
   google.charts.load('current', {'packages':['corechart']});

   // Set a callback to run when the Google Visualization API is loaded.
   google.charts.setOnLoadCallback(drawChart);
   
   document.getElementById('modelLogicSelect').onchange = function() { drawChart(); };
   // Callback that creates and populates a data table,
   // instantiates the pie chart, passes in the data and
   // draws it.
   function drawChart() {
     
     // classmate_data_processing(classmate_data, data);
     var data = classmate_data_processing(classmate_data);
 
     // Set chart options
     var options = {'title':'How many vampires in the class?',
                    'width':400,
                    'height':300};

     // Instantiate and draw our chart, passing in some options.
     var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
     chart.draw(data, options);
   }

   // model of MVC
   // function classmate_data_processing(input_data, result_data){
   function classmate_data_processing(classmate_data){
       var select = document.getElementById('modelLogicSelect');
       var isVampire;
       var val = select.options[select.selectedIndex].value;
       switch (val) {
           case "2":
               isVampire = isVampireThreshold
               break;
           default:
               isVampire = isVampireRandom
               break;
       }
    var result_data = new google.visualization.DataTable();
     // this function process classmate data and create data table
     var num_human = 0;
     var num_vampire = 0;
     var tbody = document.getElementById('classmate_table').getElementsByTagName('tbody')[0];
     var $tbody = $(tbody);
     // empty the tbody of previous content
     $tbody.empty();
     for (var i =  0; i <= classmate_data.length - 1; i++) {
         var classmate = classmate_data[i]
         var v = isVampire(classmate);
         $tbody.append('<tr><td>' + classmate.name + '</td><td>' + classmate.complexion + '</td><td>' + classmate.shadow + '</td><td>' + classmate.garlic + '</td><td>' + (v ? 'yes' : 'no') + '</td></tr>');
         //var row = tbody.insertRow();
         //row.insertCell().innerText = classmate.name;
         //row.insertCell().innerText = classmate.complexion;
         //row.insertCell().innerText = classmate.shadow;
         //row.insertCell().innerText = classmate.garlic;
         //row.insertCell().innerText = v ? 'yes' : 'no';
       if(v){
         num_vampire ++;
       }
       else{
         num_human ++;
       }
     }
     // Create the data table.
     result_data.addColumn('string', 'Element');
     result_data.addColumn('number', 'Count');
     result_data.addRows([     
       ['Human', num_human],
       ['Vampire', num_vampire]
     ]);
     return result_data;
   }
     function isVampireThreshold(data) {
        var score = 0;
        if(data.shadow==='no'){
            score+=4;
        }
        if(data.complexion==='pale'){
            score+=3;
        }
        if(data.garlic==='no'){
            score+=3;
        }

        return score > 6;
     }
     function isVampireRandom(data){
         return Math.floor(Math.random()*2) === 0
     }
})();
