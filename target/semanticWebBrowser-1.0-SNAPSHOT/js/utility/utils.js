/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function getNameForType(type)
{
    var n=type.lastIndexOf("/");
    return type.substring(n+1,type.length).replace(/\%/g,"_");
}

function getHeaderForType(type)
{
     var n=type.lastIndexOf("/");
    if(type.length-n+1>18)
    {
     return type.substring(n+1,n+18)+"..";       
    }
    else
    return type.substring(n+1,type.length);   
}

function getRandomHeaderStyle()
{
   var index=Math.floor((Math.random()*headerStyles.length));
   return headerStyles[index];
}


function formatInProperties(items,sectionID,resource)
{
  var properties={};
  var section=document.getElementById(sectionID);
  var inPropDiv=section.getElementsByClassName("inPropDiv")[0];
  var resourceName=getNameForType(resource);
  var itemsLength;
  if(items.length%5===0)
  itemsLength=parseInt(items.length/5);
  else
  itemsLength=parseInt(items.length/5)+1;    
  var initalLeft=-25;
  var left=itemsLength*initalLeft;
  inPropDiv.style.left=left+"px";
  inPropDiv.style.maxWidth=left*(-1)+"px";
  section.style.marginLeft=left*(-1)+"px";
  var left=initalLeft;
  for(key1 in items)
  {
    var classURI=items[key1].resource.value; 
    var propertieURI=items[key1].name.value;
    var array=[];
    if(classURI in properties)
    {
      array=properties[classURI];
    }
      var className=getNameForType(classURI);
      var propertieName=getNameForType(propertieURI);
      var name=classURI+"-"+propertieURI+"-"+resource+"-inProp";
      var tooltip=classURI+" --> "+propertieURI+" --> ";
      var propertie = {
        'name': name, 'propertie': propertieURI,'stat':'filter'
      };
      array.push(propertie);
      properties[classURI]=array;
      
      inPropDiv.appendChild(createInPropertie(name,tooltip));
  }
  return properties; 
}

function formatOutProperties(items,sectionID,resource)
{
  var properties={};
  var section=document.getElementById(sectionID);
  var resourceName=getNameForType(resource);
  var outPropDiv=section.getElementsByClassName("outPropDiv")[0];
  var itemsLength;
  if(items.length%5===0)
  itemsLength=parseInt(items.length/5);
  else
  itemsLength=parseInt(items.length/5)+1;
  var initalLeft=25;
  var left=initalLeft*itemsLength;
  if(items.length%5===0 && left>100)
  {
   outPropDiv.style.top="-200px";       
  }
  outPropDiv.style.left=left+"px";
  outPropDiv.style.maxWidth=left+"px";
  section.style.marginRight=left+initalLeft+"px";
  for(key2 in items)
  {
    var classURI=items[key2].resource.value; 
    var propertieURI=items[key2].name.value;
    var array=[];
    if(classURI in properties)
    {
      array=properties[classURI];
    }
      var className=getNameForType(classURI);
      var propertieName=getNameForType(propertieURI);
      var name=resource+"-"+classURI+"-"+propertieURI+"-outProp";
      var tooltip=" --> "+propertieURI+" --> "+classURI;
      var propertie = {
        'name': name, 'propertie': propertieURI,'stat':'filter'
      };
      array.push(propertie);
      properties[classURI]=array;
      outPropDiv.appendChild(createOutPropertie(name,tooltip));
  }
  return properties; 
}


function getFilterForClass(resource)
{
    if(resource!==undefined)
    {
    return JSON.stringify(app.selectedClasses[resource].filter);
    }
}

function checkJSONObjectsEquality(object1,object2)
{
    return JSON.stringify(object1) !== JSON.stringify(object2);
}

function encodeUrlComponent(urlComponent){
    return encodeURIComponent(urlComponent);
}


function checkExists(item,expression)
    {
      if (item.value.toLowerCase().indexOf(expression.toLowerCase()) ===-1) 
      return false;
      else
          return true;
    }
   

   