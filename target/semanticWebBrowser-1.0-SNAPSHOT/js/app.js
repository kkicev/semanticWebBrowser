/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var app = app || {};

app.selection = {
};
app.selectedClasses = {};

app.dataset = "";

var headerStyles = ['greyHeader', 'blueHeader', 'woodHeader', 'tomatoHeader', 'forestHeader', 'yellowHeader'];


$(function() {

    app.datasetCollection = new DefaultList([], {query: "getDatasets", className: ""});
    var datasetSection = new app.DatasetSection({collection: app.datasetCollection});
    datasetSection.collection.fetch();
    app.mainCollection = new DefaultList([], {query: "getClasses", className: ""});
    app.classesSection = new app.MainSection({collection: app.mainCollection});

});

app.createComponent = function(type) {
    var name = getNameForType(type);
    var headerName = getHeaderForType(type);
    var wraper = document.createElement("div");
    wraper.id = "wraper" + name;
    wraper.className = 'wrapDim';
    var inPropDiv = document.createElement("div");
    inPropDiv.className = "inPropDiv";
    wraper.appendChild(inPropDiv);
    var outPropDiv = document.createElement("div");
    outPropDiv.className = "outPropDiv";
    wraper.appendChild(outPropDiv);
    var section = document.createElement("section");
    section.id = name + "Section";
    section.className = 'mainSection';
    var header = document.createElement("header");
    header.className = 'headerh3 ' + getRandomHeaderStyle();
    var h3 = document.createElement("h3");
    h3.innerHTML = headerName;
    var searchBox = document.createElement("input");
    searchBox.id = wraper.id + "SearchBox";
    searchBox.type = "text";
    searchBox.placeholder = "Search...";
    searchBox.className = "searchBox";
    header.appendChild(h3);
    header.appendChild(searchBox);
    section.appendChild(header);

    var sectionMain = document.createElement("section");
    sectionMain.id = name + "Main";
    sectionMain.className = "main";
    var scrollableDiv = document.createElement("div");
    scrollableDiv.className = "scrollable";
    var ul = document.createElement("ul");
    ul.id = name + "-list";
    ul.className = "listItems";
    scrollableDiv.appendChild(ul);
    sectionMain.appendChild(scrollableDiv);
    section.appendChild(sectionMain);

    var footer = document.createElement("footer");
    footer.id = "footer" + name;
    //footer.className = "footer";
    var divFooter = document.createElement("footer");
    divFooter.className = "footer";
    var selectAll = document.createElement("input");
    var labelAll = document.createElement("label");
    labelAll.innerHTML = "All";
    selectAll.type = "radio";
    selectAll.className = "selection";
    selectAll.name = wraper.id + "selection";
    selectAll.value = "All";
    selectAll.checked = true;
    divFooter.appendChild(selectAll);
    divFooter.appendChild(labelAll);
    var selectSelected = document.createElement("input");
    var labelSelected = document.createElement("label");
    labelSelected.innerHTML = "Selected";
    selectSelected.type = "radio";
    selectSelected.className = "selection";
    selectSelected.name = wraper.id + "selection";
    selectSelected.value = "Selected";
    divFooter.appendChild(selectSelected);
    divFooter.appendChild(labelSelected);
    divFooter.appendChild(footer);
    section.appendChild(divFooter);

    wraper.appendChild(section);

    $('#wraperClasses').append(wraper);

    app.defineComponent(type, ul.id, footer.id, wraper.id);
};

app.defineComponent = function(resource, listID, footerID, sectionID)
{
    var collection = new DefaultList([], {query: "getClassInstances", class: resource});
    var section = new app.DefaultSection({collection: collection, listID: listID, footerID: footerID, sectionID: sectionID});
    app.registerInClasses(section, resource);
    section.collection.fetch();
};

app.checkSelection = function(type, value)
{
    for (k1 in app.selection)
    {
        if (k1 === type)
        {
            var selected = app.selection[k1];
            for (s in selected)
            {
                if (selected[s] === value)
                {
                    return true;
                }
            }
            return false;
        }
    }
};

app.getClass = function(value)
{
    for (k2 in app.selectedClasses)
    {
        if (k2 === value)
        {
            return app.selectedClasses[k2];
        }
    }
    return "";
};

app.removeComponent = function(c)
{
    var wraperClasses = document.getElementById("wraperClasses");
    wraperClasses.removeChild(document.getElementById(c.view.sectionID));
    delete app.selectedClasses[c.view.collection.resource];
    delete app.selection[c.view.collection.resource];

};

app.registerInClasses = function(section, resource)
{

    var inProps = app.getPropertiesForClass("getClassInProperties", section.sectionID, resource);
    var outProps = app.getPropertiesForClass("getClassOutProperties", section.sectionID, resource);
    var filter = {
        'inP': {}, 'outP': {}
    };
    app.selectedClasses[resource] = {"view": section, "inProps": inProps, "outProps": outProps, "filter": filter};
    app.setFilterForClass(resource);
};


app.getPropertiesForClass = function(query, sectionID, resource)
{
    var items;
    var result;
    jQuery.ajax({
        url: '/semanticWebBrowser/SparqlServlet?q=' + query + '&dataset=' + encodeUrlComponent(app.dataset) + '&class=' + encodeUrlComponent(resource),
        type: 'GET',
        async: false,
        success: function(data, textStatus, jqXHR) {
            var json = JSON.parse(data);
            if (json.error)
            {
                alert(json.error);
                items = [];
            }
            else if (json.results)
                items = json.results.bindings;
            if (query === "getClassInProperties")
                result = formatInProperties(items, sectionID, resource);
            else
                result = formatOutProperties(items, sectionID, resource);
        }
    });
    return result;
};

app.onSelectionChanged = function(selectedResource)
{
    for (k3 in app.selectedClasses)
    {
        if (selectedResource !== k3)
        {
            app.reloadDataForClass(k3);
        }
    }
};

app.setFilterForClass = function(resource)
{
    for (k4 in app.selection)
    {
        
        if (k4 in app.selectedClasses[resource].inProps)
        {
            if(k4!==resource)
            for (prop in app.selectedClasses[resource].inProps[k4])
            {
                if (app.selection[k4].length > 0)
                {
                    var propertie = app.selectedClasses[resource].inProps[k4][prop];
                    if (propertie.stat === "filter")
                    {
                        var filterProp={"filter":"filter","selection":app.selection[k4]};
                        app.selectedClasses[resource].filter.inP[propertie.propertie] = filterProp;
                    }
                    else if (propertie.stat === "inverse")
                    {
                        var inverseProp={"filter":"inverse","selection":app.selection[k4]};
                        app.selectedClasses[resource].filter.inP[propertie.propertie] = inverseProp;
                    }
                }
            }
        }
        if (k4 in app.selectedClasses[resource].outProps)
        {
            if(k4!==resource)
            for (prop in app.selectedClasses[resource].outProps[k4])
            {
                if (app.selection[k4].length > 0)
                {
                    var propertie = app.selectedClasses[resource].outProps[k4][prop];
                    if (propertie.stat === "inverse")
                    {
                        var inverseProp={"filter":"inverse","selection":app.selection[k4]};
                        app.selectedClasses[resource].filter.outP[propertie.propertie] = inverseProp;
                    }
                    else if (propertie.stat === "filter")
                    {
                        var filterProp={"filter":"filter","selection":app.selection[k4]};
                        app.selectedClasses[resource].filter.outP[propertie.propertie] = filterProp;
                    }

                }
            }
        }
    }
};


function createInPropertie(name, tooltip)
{
    var div = document.createElement("div");
    div.title = tooltip;
    div.className = "inProperties";
    var asInPropertie = document.createElement("input");
    asInPropertie.type = "radio";
    asInPropertie.name = name;
    asInPropertie.className = "inPropertie";
    asInPropertie.value = "filter";
    asInPropertie.style.display = "block";
    asInPropertie.checked = true;
    div.appendChild(asInPropertie);
    var asOutPropertie = document.createElement("input");
    asOutPropertie.type = "radio";
    asOutPropertie.name = name;
    asOutPropertie.className = "inPropertie";
    asOutPropertie.value = "inverse";
    asOutPropertie.style.display = "block";
    div.appendChild(asOutPropertie);
    var ignore = document.createElement("input");
    ignore.type = "radio";
    ignore.name = name;
    ignore.className = "inPropertie";
    ignore.value = "ignore";
    ignore.style.display = "block";
    div.appendChild(ignore);
    return div;
}

function createOutPropertie(name, tooltip)
{
    var div = document.createElement("div");
    div.title = tooltip;
    div.className = "outProperties";
    var asOutPropertie = document.createElement("input");
    asOutPropertie.type = "radio";
    asOutPropertie.name = name;
    asOutPropertie.className = "outPropertie";
    asOutPropertie.value = "filter";
    asOutPropertie.checked = true;
    asOutPropertie.style.display = "block";
    div.appendChild(asOutPropertie);
    var asInPropertie = document.createElement("input");
    asInPropertie.type = "radio";
    asInPropertie.name = name;
    asInPropertie.className = "outPropertie";
    asInPropertie.value = "inverse";
    asInPropertie.style.display = "block";
    div.appendChild(asInPropertie);
    var ignore = document.createElement("input");
    ignore.type = "radio";
    ignore.name = name;
    ignore.className = "outPropertie";
    ignore.value = "ignore";
    ignore.style.display = "block";
    div.appendChild(ignore);
    return div;
}

//type is "inPropertie/outPropertie"
//name is name of the propertie
app.changePropStatByPropName = function(type, resource, name, newStat)
{
    var properties;
    if (type === "inPropertie")
        properties = app.selectedClasses[resource].inProps;
    else if (type === "outPropertie")
        properties = app.selectedClasses[resource].outProps;

    for (key5 in properties)
    {
        var i = 0;
        var classProperties = properties[key5];
        for (i; i < classProperties.length; i++)
        {
            if (classProperties[i].name === name)
            {
                classProperties[i].stat = newStat;
                return true;
            }
        }

    }
    return false;
};

app.reloadDataForClass = function(selectedResource)
{
            var oldFilter = app.selectedClasses[selectedResource].filter;
            app.selectedClasses[selectedResource].filter = {
                'inP': {}, 'outP': {}
            };

            app.setFilterForClass(selectedResource);
            var newFilter = app.selectedClasses[selectedResource].filter;
            if (checkJSONObjectsEquality(oldFilter, newFilter))
            {
                app.selectedClasses[selectedResource].view.collection.reset();
                app.selectedClasses[selectedResource].view.collection.fetch();
            }
};

