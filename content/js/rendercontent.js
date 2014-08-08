
  var products = {};
  var firmware = {};
  // STEP 0: PNAME is declared in the host "_tmpl.html" file.
  //convert PNAME to propername (needed in firmware, possibly other times).
  var propername = {
    'Alias8' : 'Alias 8',
    'Base' : 'Base v1',
    'CNTRLR' : 'Cntrl:R' ,
    'DS1' : 'DS1',
    'GuitarWing' : 'Guitar Wing',
    'OhmRGB' : 'OhmRGB',
    'BrainJr' : 'Brain Jr',
    'Brainv2' : 'Brain v2',
    'Ohm64' : 'Ohm64',
    'Base2' : 'Base v2',
    'Code' : 'Code'
  }
  
  //STEP 1: read in JSON file of all the products and examples, then get the counts needed from that.
  $.getJSON('product_dbase_'+PNAME+'.json', function(productdatabase) {
		products = productdatabase.products;
	});
 
  var exampletemp = "";
  var producttemp = "";
  var firmwaretemp = "";
  //
  
  //STEP 2: Get all the template files and the firmware json. Cascade the 'get' calls, and finally the render() call, in case there is some async weirdness:
  $.get('_productexample.tmp.htm', function(template) {
    exampletemp = template;
    getpt();
    //console.log("fetched example template");
  });
  
  function getpt(){
    $.get('_product.tmp.htm', function(template) {
      producttemp = template;      
      //console.log("fetched product template");
      getcell();
    });
  }
  
  function getcell(){
    $.get('_gridcell.tmp.htm', function(template) {
      celltemp = template;      
      //console.log("fetched cell template \n"+celltemp);
      getfirmware();
    });
  }
  
  //read in JSON of current firmware
  function getfirmware(){
    $.getJSON('firmware.json', function(template) {
      firmware = template;
    });
    $.get('_firmware.tmp.htm', function(template) {
      firmwaretemp = template;
      render();
    });
  }
  
  //STEP 3: Based on what is in the "product database" JSON, render out the appropriate DOM elements for the products and the product examples
  function render(){
    //console.log("RENDER");
    //setup all the DOM elements based on what is inside the products database:
    var pcount = 0;
    for(p in products){
      //console.log(">>>>>>>> PRODUCT "+p+" <<<<<<<<<<<<<");
      var i = parseInt(p);
      
      //icon grid at top for navigation
      if(i!=0 && i%4==0){
          //console.log("DIV---- "+i+" "+i%4);
         $('#productgrid').append( '<div class="rowreset"></div>' );
      }
      $('<div></div>').attr('id','p_'+i).attr('class','software_tn').appendTo('#productgrid');
      $('#p_'+i).html( celltemp );
      
      //content for each product
      $('<div></div>').attr('id','product_'+i).attr('class','container').appendTo('.centerall');
      $('#product_'+i).html( producttemp );
      //$('#product_'+i).append( "PRODUCT "+i ); //for testing
      
      ///finally, add all examples for a product:
      for(e in products[p].examples){
        var j = parseInt(e);
        $('<div></div>').attr('id','example_'+i+'_'+j).appendTo('#product_'+i);  
        $('#example_'+i+'_'+j).html( exampletemp );
        var junk = $('#example_'+i+'_'+j).html();
        //console.log("\n------------ PRODUCT "+i+" EXAMPLE "+j+" -----------\n");
        //$('#example_'+i+'_'+j).append( "EXAMPLE "+j ); //for testing
      }
      $('#product_'+i).append('<div class="productseparator"></div>');
      pcount = i;
    };
    //add firmware to grid
    pcount = pcount+1;
    if(pcount!=0 && pcount%4==0){
       $('#productgrid').append( '<div class="rowreset"></div>' );
    }    
    $('<div></div>').attr('id','firmware_grid').attr('class','software_tn').appendTo('#productgrid');
    $('#firmware_grid').html( celltemp );
    
    //now add the firmware template section
    $('<div></div>').attr('id','firmwarediv').attr('class','container').appendTo('.centerall');
    $('#firmwarediv').html( firmwaretemp );
    //now, fill it with the content
    fill();
  }
  
  //STEP 4: fill all these newly created elements with the data from products JSON
  function fill(){
    //top title banner 
    var topname = PNAME;
    if(PNAME==='GuitarWing'){
      topname = 'Guitar Wing';
    }
    $('#toptitle').html(topname+' Integration Guide');
    
    //loop through all the Software Titles that have examples:
    for(p in products){
      //anchor name so click on software icon takes you to the right place:
      var anchor = products[p]['pid'];
      //link to icon graphic:
      var icon = products[p]['picon'];
      $('#p_'+p+' .gridlink').attr('href', '#'+anchor);
      $('#p_'+p+' .icon').attr('src', icon);
      $('#p_'+p).append(products[p]['name']);
      $('#product_'+p+' .p_desc').attr('id',anchor);
      $('#product_'+p+' .prodicon').attr('src',icon);
      $('#product_'+p+' h2.p_title').append(products[p]['ptitle']);
      $('#product_'+p+' p.p_text').append(products[p]['ptext']);
      //installer links and title:
      var ititle = products[p]['ititle'];
      var ilinkmac = products[p]['ilinkmac'];
      var ilinkwin = products[p]['ilinkwin'];
      var linktextalt = products[p]['linktextalt'];
      if(ititle!=""){
        $('#product_'+p+' .installtitle').append(ititle);
      } else {
        $('#product_'+p+' .installtitle').remove();
        $('#product_'+p+' .dl').remove();
        $('#product_'+p+' .sep').remove();
      }
      if(ilinkmac!=""){
        $('#product_'+p+' .mac').attr('href',ilinkmac);
      } else {
        $('#product_'+p+' .mac').remove();
        $('#product_'+p+' .sep').remove();
      }
      if(ilinkwin!=""){
        $('#product_'+p+' .win').attr('href',ilinkwin);
      } else {
        $('#product_'+p+' .win').remove();
        $('#product_'+p+' .sep').remove();
      }
      //if needed, use different words than "Mac" for the link:
      if(linktextalt){
        $('#product_'+p+' .mac').html(linktextalt);
      }
      
      //loop through examples:
      for(e in products[p].examples){
        var leftpath = products[p].examples[e]['leftthumb'];
        var mappath = products[p].examples[e]['mapthumb'];
        $('#example_'+p+'_'+e+' .lefttnlink').attr('href',leftpath);
        if(mappath!=""){
          $('#example_'+p+'_'+e+' .maptnlink').attr('href',mappath);
        } else {
          $('#example_'+p+'_'+e+' .mapthumb').remove();
        }
        //add _tn to the image name to get thumbnail image. assumes, of course, there is only 1 "." in the entire string!
        if(leftpath!=""){
          var img = leftpath;
          var splitimg = img.split(".");
          var tnail = splitimg[0]+'_tn.'+splitimg[1];
          $('#example_'+p+'_'+e+' .lefttnimg').attr('src',tnail);
        }
        if(mappath!=""){
          img = mappath;
          splitimg = img.split(".");
          tnail = splitimg[0]+'_tn.'+splitimg[1];
          $('#example_'+p+'_'+e+' .maptnimg').attr('src',tnail);
        }
        
        //add other content
        var cap = products[p].examples[e]['cap'];
        var mapcap = products[p].examples[e]['mapcap'];
        var exampletitle = products[p].examples[e]['title'];
        var descriptiontext = products[p].examples[e]['text'];
        var setname = products[p].examples[e]['setname'];
        var manual = products[p].examples[e]['manual'];
        $('#example_'+p+'_'+e+' .caption').append(cap);
        $('#example_'+p+'_'+e+' .mapcaption').append(mapcap);
        $('#example_'+p+'_'+e+' .title').append(exampletitle);
        $('#example_'+p+'_'+e+' .text').append(descriptiontext);
        if(setname){
          $('#example_'+p+'_'+e+' .setname').append(setname);
        }else{
          $('#example_'+p+'_'+e+' .setname').remove();
        }
        if(manual){
          $('#example_'+p+'_'+e+' .manual').attr('href',manual);
        }else{
          $('#example_'+p+'_'+e+' .manual').remove();
        }
        
        //add videos, if applicable.
        var youtube = products[p].examples[e]['youtube'];
        if(youtube!=""){
          $('#example_'+p+'_'+e+' .youtube').attr('src','http://www.youtube.com/embed/'+youtube+'?rel=0&autoplay=0&&origin=http://lividinstruments.com'); //rel=0 means don't show suggested videos at end
        }else{
          $('#example_'+p+'_'+e+' .youtube').remove();
        }
      }
    }
     
    //STEP 5: add firmware if applicable.
    var key = propername[PNAME];
    var thefirm = {};
    if(typeof firmware['Firmware Images'][key] != 'undefined'){
      
      var icon = 'content/images/icons/firmware_icon.png';
      $('#firmware_grid .gridlink').attr('href', '#firmwarediv');
      $('#firmware_grid .icon').attr('src', icon);
      $('#firmware_grid').append('Firmware Update');
    
      thefirm = firmware['Firmware Images'][key];
    
      var util = firmware['Firmware Utilities']['Firmware Update Software'];
      var fwcount = 0
      for (i in thefirm){
        var thehtml = '<div id="fw_'+fwcount+'"> <h3 class="type"></h3> <p class="text"> <span class="version"></span> - <a class="alt_a link">Download firmware hex file</a><br><span class="comment"></span></p></div>'
        $('#firmware').append(thehtml);
        $('#fw_'+fwcount+' .type').html(i);
        $('#fw_'+fwcount+' .version').html(thefirm[i].version);
        $('#fw_'+fwcount+' .comment').html(thefirm[i].comment);
        $('#fw_'+fwcount+' .link').attr('href',thefirm[i].link);
        fwcount++;
      }
      console.log("FIRMWARE COUNT "+fwcount);
      if(fwcount>0){
        var oscount = 0;
        for (utilname in util){
          console.log("oscount "+oscount);
          $('#os_'+oscount+' .utilname').html(utilname);
          $('#os_'+oscount+' .version').html(util[utilname].version);
          $('#os_'+oscount+' .comment').html(util[utilname].comment);
          $('#os_'+oscount+' .link').attr('href',util[utilname].link);
          oscount++;
        }
      }else{
        $('#firmwarediv').remove();
        $('#firmware_grid').remove();
      }
    }else{
      $('#firmwarediv').remove();
      $('#firmware_grid').remove();
    }
    //now that all content is in, we can init the image popup (lightbox) script:
    $('.image-popup-vertical-fit').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        mainClass: 'mfp-img-mobile',
        image: {
            verticalFit: true
        }
    });
   }