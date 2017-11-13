function ModernDataTable(tableSelector)
{
    this.customLoading = new CustomLoading('loading');
    this.restClient = new RESTClient();
    this.tableSelectorName = tableSelector;
    this.tableSelector = $(tableSelector);
    this.method = 'POST';
    this.webServiceURL = null;
    this.dataToSender = null;

    this.defaultOrderCol = 0;
    this.showInfo = false;
    this.showPaginate = true;
    this.serverSide = true;
    this.showSearchBox = true;

    this.itemPerPage = 10;
    this.data = {"recordsTotal": "0", "recordsFiltered": "0", "data": []};
    this.tableStruture = '';
    this.columnsToDisplay = null;
    this.getTitlesOfColumnsFromJSON = false;
    this.showCheckBoxToSelectRow = true;
    this.isColsEditable = true;
    this.parametersToSender = {"draw": "1", "start": "0", "length": "10", "search[value]": ""};

    //EVENTS
    this.onSelectFunction = null;
    this.onClickFunction = null;
    this.onContentLoaded = null;
    this.rowCount = 0;

    this.init();
}

ModernDataTable.prototype.init = function () {
    var self = this;
    this.events();
    this.createTableBody();
};
ModernDataTable.prototype.load = function () {
    var self = this;
    if (this.serverSide)
    {
        this.getDataFromURL();
    }
};
ModernDataTable.prototype.showSelectBox = function (showSelectBox) {
    this.showCheckBoxToSelectRow = showSelectBox;
};
ModernDataTable.prototype.createTableHead = function (rows) {
    this.tableStruture += '<thead>' + rows + '</thead>';
};
ModernDataTable.prototype.createTableBody = function () {
    var self = this;
    self.tableSelector.find('tbody').remove();
    self.tableSelector.append('<tbody></tbody>');
};
ModernDataTable.prototype.createRow = function (cols, index, cssClass) {
    var css = '';
    var idx = '';
    if (cssClass)
    {
        css = 'class="' + cssClass + '"';
    }
    if (index || index === 0)
    {
        idx = 'data-index="' + index + '"';
    }
    return '<tr ' + css + ' ' + idx + ' >' + cols + '</tr>';
};
ModernDataTable.prototype.createCol = function (colContent, cssClass) {
    var css = '';
    if (cssClass)
    {
        css = 'class="' + cssClass + '"';
    }
    var editable = '';
    if (this.isColsEditable)
    {
        editable = 'contenteditable';

    }
    return '<td ' + css + ' ' + editable + ' >' + colContent + '</td>'
};
ModernDataTable.prototype.createColSelect = function () {
    var self = this;
    var id = self.tableSelectorName + self.rowCount;
    var colContent = '<div class="dataTableCheckBox"><input type="checkbox" id="' + id + '"/>' + '<label for="' + id + '"></label></div>';
    self.rowCount++;
    return '<td>' + colContent + '</td>'
};
ModernDataTable.prototype.createTableStruture = function () {
    var self = this;
    var data = self.data['data'];
    var rows = '';
    for (var i = 0; i < data; i++)
    {
        var row = data[i];
        var cols = '';
        if (self.showCheckBoxToSelectRow)
        {
            cols += self.createColSelect();
        }
        var keyNames = self.columnsToDisplay ? self.columnsToDisplay : Object.keys(row);
        for (var key in keyNames)
        {
            cols += self.createCol(row[key]);
        }
        rows += self.createRow(cols);
    }
    self.tableStruture += rows;
    self.draw();
};
ModernDataTable.prototype.draw = function () {
    var self = this;
    self.tableSelector.find('tbody').html(self.tableStruture);
};
ModernDataTable.prototype.appendRowFromJSON = function (rowJSONData) {
    var self = this;
    self.data["recordsTotal"]++;
    self.data["recordsFiltered"]++;
    self.data["data"].push(self.getKeyValueFromJSON(rowJSONData));
    var index = self.data["data"].length-1;

    var cols = '';
    if (self.showCheckBoxToSelectRow)
    {
        cols += self.createColSelect();
    }
    for (var i = 0; i < rowJSONData.length; i++)
    {
        cols += self.createCol(rowJSONData[i]['value'], rowJSONData[i]['class']);
    }
    self.tableStruture += self.createRow(cols, index);
    self.draw();
};
ModernDataTable.prototype.setDisplayCols = function (columnsToDisplay) {
    this.columnsToDisplay = columnsToDisplay;
};
ModernDataTable.prototype.setDataToSender = function (dataToSender) {
    this.dataToSender = dataToSender;
};
ModernDataTable.prototype.setWebServiceURL = function (webServiceURL) {
    this.webServiceURL = webServiceURL;
};
ModernDataTable.prototype.setMethodPOST = function () {
    this.method = 'POST';
};
ModernDataTable.prototype.getDataFromURL = function () {
    var self = this;
    self.customLoading.show();
    var senderData = {};
    if (self.dataToSender)
    {
        senderData = self.dataToSender;
    }
    senderData = extend(senderData, self.parametersToSender);
    self.restClient.setDataToSender(senderData);
    self.restClient.setWebServiceURL(self.webServiceURL);
    self.restClient.setMethod(self.method);
    self.restClient.setSuccessCallbackFunction(function (data) {
        self.customLoading.hide();
        self.data = data;
        self.createTableStruture();
    });
    self.restClient.setErrorCallbackFunction(function (jqXHR, textStatus, errorThrown) {
        self.customLoading.hide();
        alert('Erro ao obter dados do servidor');
    });
    self.restClient.exec();
};
//SET EVENT LISTENING
ModernDataTable.prototype.setOnSelect = function (onSelectFunction) {
    this.onSelectFunction = onSelectFunction;
};
ModernDataTable.prototype.setOnClick = function (onClickFunction) {
    this.onClickFunction = onClickFunction;
};
ModernDataTable.prototype.setOnContentLoaded = function (onContentLoaded) {
    this.onContentLoaded = onContentLoaded;
};
//EVENTS
ModernDataTable.prototype.events = function () {
    var self = this;
    self.tableSelector.on('click', 'tbody tr', function () {
        if (typeof self.onClickFunction == "function")
        {
            var data = self.data["data"][$(this).attr('data-index')];
            self.onClickFunction(data);
        }
    });
};
ModernDataTable.prototype.getKeyValueFromJSON = function (jsonCols) {
    var result = {};
    for (var i = 0; i < jsonCols.length; i++)
    {
        result[jsonCols[i]['key']] = jsonCols[i]['value'];
    }
    return result;
};