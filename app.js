(function app() {
    // array of json objects
     var vampireTest = window.sessionStorage.getItem("vampire_test");
    if(!vampireTest){
        vampireTest = "2";
        window.sessionStorage.setItem("vampire_test", vampireTest);
    }
    var classmate_data;
    if (window.sessionStorage.getItem("classmate_data")) {
        try {
            classmate_data = JSON.parse(window.sessionStorage.getItem("classmate_data"));
        } catch (e) {
            // doing nothing for now
        }
    }
    if (!classmate_data) {
        classmate_data = [
            {
                'name': 'John',
                'shadow': 'no',
                'garlic': 'no',
                'complexion': 'pale'
            },
            {
                'name': 'Lee',
                'shadow': 'yes',
                'garlic': 'no',
                'complexion': 'pale'
            },
            {
                'name': 'Emma',
                'shadow': 'no',
                'garlic': 'yes',
                'complexion': 'brown'
            },
            {
                'name': 'Ava',
                'shadow': 'yes',
                'garlic': 'yes',
                'complexion': 'olive '
            },
            {
                'name': 'Alex',
                'shadow': 'no',
                'garlic': 'no',
                'complexion': 'brown'
            }
        ];
        processClassmates(classmate_data);
    }

    var modelLogicSelect = document.getElementById('modelLogicSelect');
    if(modelLogicSelect) {
        modelLogicSelect.value=vampireTest;

        modelLogicSelect.onchange = function (e) { 
            vampireTest = e.target.value;
            window.sessionStorage.setItem("vampire_test", vampireTest);
            processClassmates(classmate_data);
            drawChart(); 
        };
        // Load the Visualization API and the corechart package.
        google.charts.load('current', { 'packages': ['corechart'] });

        // Set a callback to run when the Google Visualization API is loaded.
        google.charts.setOnLoadCallback(drawChart);
    }
    var classmateTable = document.getElementById('classmate_table');
    if(classmateTable){
        populateTable(classmate_data, 'classmate_table');
    }
    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {

        // classmate_data_processing(classmate_data, data);
        var data = classmate_data_processing(classmate_data);

        // Set chart options
        var options = {
            'title': 'How many vampires in the class?',
            'width': 400,
            'height': 300
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }

    var addButton = document.getElementById('classmate_add_button');
    if(addButton) {
        addButton.addEventListener("click", function(){
            var $popup = $('#classmate_add_popup');
            $popup.css("display", "block");
            var form = $popup.find('.classmate-form')[0];
            form.reset();
            this.disabled = true;
        });
    }
    $('.classmate-form .classmate-cancel-button').on('click', function(){
        var $popup = $('#classmate_add_popup');
        $popup.css("display", "none");
        var form = $popup.find('.classmate-form')[0];
        form.reset();
        $('#classmate_add_button').prop("disabled", false);
    });
    $('.classmate-form .classmate-save-button').on('click', function(){
        var $popup = $('#classmate_add_popup');
        $popup.css("display", "none");
        var form = $popup.find('.classmate-form')[0];
        var newClassmate = {
            name: form.elements["name"].value,
            complexion: form.elements["complexion"].value,
            garlic: form.elements["garlic"].value,
            shadow: form.elements["shadow"].value
        };
        addClassmate(newClassmate);
        form.reset();
        $('#classmate_add_button').prop("disabled", false);
    });
    function addClassmate(newClassmate){
        classmate_data.push(newClassmate);
        processClassmates(classmate_data);
        populateTable(classmate_data, 'classmate_table');
    }
    function processClassmates(classmateData) {
        var isVampire;

        switch (vampireTest) {
            case "2":
                isVampire = isVampireThreshold
                break;
            default:
                isVampire = isVampireRandom
                break;
        }
        for (var i = 0; i <= classmate_data.length - 1; i++) {
            var classmate = classmate_data[i]
            classmate.vampire = isVampire(classmate);
        }

        window.sessionStorage.setItem("classmate_data", JSON.stringify(classmate_data));
    }

    function classmate_data_processing(classmate_data) {
        var result_data = new google.visualization.DataTable();
        // this function process classmate data and create data table
        var num_human = 0;
        var num_vampire = 0;

        for (var i = 0; i <= classmate_data.length - 1; i++) {
            var classmate = classmate_data[i]
 
            if (classmate.vampire) {
                num_vampire++;
            }
            else {
                num_human++;
            }
        }
        populateTable(classmate_data, 'classmate_table');

        // Create the data table.
        result_data.addColumn('string', 'Element');
        result_data.addColumn('number', 'Count');
        result_data.addRows([
            ['Human', num_human],
            ['Vampire', num_vampire]
        ]);
        return result_data;
    }
    function populateTable(classmateData, tableId) {
        var tbodyHtml = [];
        for (var i = 0; i <= classmateData.length - 1; i++) {
            tbodyHtml.push(rowTemplate(classmate_data[i]));
        }
        var tbody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
        tbody.innerHTML = tbodyHtml.join('');
    }
    function rowTemplate(classmate){
        return '<tr>' + 
        createCell(classmate.name) +  
        createCell(classmate.complexion) +  
        createCell(classmate.shadow) +  
        createCell(classmate.garlic) +  
        createCell(classmate.vampire ? 'yes' : 'no') + 
        '</tr>';
    }
    function createCell(data){
        return '<td>' + data + '</td>';
    }
    function isVampireThreshold(data) {
        var score = 0;
        if (data.shadow === 'no') {
            score += 4;
        }
        if (data.complexion === 'pale') {
            score += 3;
        }
        if (data.garlic === 'no') {
            score += 3;
        }

        return score > 6;
    }
    function isVampireRandom(data) {
        return Math.floor(Math.random() * 2) === 0
    }
})();
