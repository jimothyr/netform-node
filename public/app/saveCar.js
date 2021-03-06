var cars;
emit('data/vehicles.json', {}, 'GET').then(function(results){
  cars = results;
  // cars.sort(function(a,b){
  //   if (a.Make < b.Make)
  //     return -1;
  //   if (a.Make > b.Make)
  //     return 1;
  //   return 0;
  // })
  // cars.forEach(function(c, i){
  //   $('#carMake').append('<option value="'+c.Make+'">'+c.Make+'</option>');
  // });
  var selMake = cars.map(function (car, index, array) {
    return car.Make; 
  });

  selMake.sort();
  var carOptions = Array.from( new Set(selMake));
  carOptions.forEach(function(c, i){
    $('#carMake').append('<option value="'+c+'">'+c+'</option>');
  });

  if(thisCar.car){
    $('#carMake').val(thisCar.car.make)
    filterModels(thisCar.car.make)
    $('#carModel').val(thisCar.car.id)
  }

})

$('document').ready(function(){
  $('#saveCar').click(function(){
    saveCar(thisCar)
  });

  $('#carMake').change(function(){
       filterModels($(this).val());
  });
});

// --------------------------------------------------------┤ LISTEN FOR SUCCESSFUL SAVE
// on('carSaved', function(car){
//     saveCar(car);
// });      

var filterModels = function(tMake){
    $('#carModel').empty().prop('disabled', false);
    $('#saveCar').prop('disabled', false);
    cars.forEach(function(c,i){
          if(c.Make == tMake){
                $('#carModel').append('<option value="'+c.id+'">'+c.Model+'</option>');
          }
    })  
}

var saveCar = function(car){
  // if(!thisCar.car){
  //   thisCar.car = {};
  // }
  if(thisCar.car.id != $('#carModel').val()){
    thisCar.car = {
          make: $('#carMake').val(),
          model: $('#carModel option:selected').html(),
          id: $('#carModel').val()
    };
    Cookies.set('thisCar', JSON.stringify(thisCar));
    if(!offline){
      updateDetails(function(){
        transition('car', 'input', '336666');    
      });
	  }else{
      transition('car', 'input', '336666');
    }
  }else{
    transition('car', 'input', '336666');        
  }
}