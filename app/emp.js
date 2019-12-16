

    $.get("http://localhost:4000/EmployeeList").then(response => 
  
    $.each(response.recordsets[0],function(){

        console.log($(this)[0].FirstName);
var htmlText="<p>"+$(this)[0].FirstName+"</p>";

        $('#divData').append(htmlText);
    })
    
    );