function ModernDataTable(tableSelector)
{
    this.customLoading = new CustomLoading('loading');
    this.restClient = new RESTClient();
    this.tableSelectorName = tableSelector;
    this.tableSelector = $(tableSelector);
    this.method = 'POST';

    this.webServiceURL = null;
    this.dataToSender = null;

    //PUBLIC CONFIGURATIONS
    this.defaultOrderCol = 0;
    this.showInfo = false;
    this.showPaginate = true;
    this.serverSide = true;
    this.showSearchBox = true;
    this.isColsEditable = true;
    this.saveCellEdits = true;
    this.getTitlesOfColumnsFromJSON = false;
    this.showCheckBoxToSelectRow = true;

    this.itemPerPage = 10;
    this.data = {"recordsTotal": "0", "recordsFiltered": "0", "data": []};
    this.tableStruture = '';
    //colunas dos datos a serem exibidas pelo dataTable
    this.columnsToDisplay = [{
        "class": "inputIdEmpenhoParcela",
        "value": "empenho",
        "key": "idEmpenho"
    }, {"class": "inputNumeroParcela", "value": "", "key": "numeroParcela"}, {
        "class": "inputValorParcela",
        "value": "R$ 0.00,00",
        "key": "valor"
    }];
    //parametros enviados ao webservice pelo dataTable
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
    var self = this;
    self.tableSelector.find('thead').remove();
    self.tableSelector.append('<thead></thead>');
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
ModernDataTable.prototype.createCol = function (colContent, columnIdentity, cssClass) {
    var css = '';
    var editable = '';
    var columnId = '';
    if (cssClass)
    {
        css = 'class="' + cssClass + '"';
    }
    if (this.isColsEditable)
    {
        editable = 'contenteditable';
    }
    if (columnIdentity)
    {
        columnId = 'data-identity="' + columnIdentity + '"';
    }
    return '<td ' + css + ' ' + editable + ' ' + columnId + '>' + colContent + '</td>'
};
ModernDataTable.prototype.createColSelect = function () {
    var self = this;
    var id = self.tableSelectorName + self.rowCount;
    var colContent = '<div class="dataTableCheckBox"><input type="checkbox" id="' + id + '"/>' + '<label for="' + id + '"></label></div>';
    self.rowCount++;
    return '<td>' + colContent + '</td>'
};
ModernDataTable.prototype.draw = function () {
    var self = this;
    var data = self.data['data'];
    var rows = '';
    self.tableStruture = '';
    for (var i = 0; i < data.length; i++)
    {
        var row = data[i];
        var cols = '';
        if (self.showCheckBoxToSelectRow)
        {
            cols += self.createColSelect();
        }
        var definedColNames = self.getKeysFromJSON(self.columnsToDisplay);
        var autoColNames = Object.keys(row);
        var colsNames = definedColNames;

        for (var j = 0; j < colsNames.length; j++)
        {
            var tdClassName = self.columnsToDisplay[j]['class'];
            var tdContent = row[colsNames[j]];
            var columnIdentity = colsNames[j];
            cols += self.createCol(tdContent, columnIdentity, tdClassName);
        }
        rows += self.createRow(cols, i);
    }
    self.tableStruture += rows;
    self.tableSelector.find('tbody').html(self.tableStruture);

};
ModernDataTable.prototype.appendRowFromJSON = function (rowJSONData) {
    var self = this;
    self.data["recordsTotal"]++;
    self.data["recordsFiltered"]++;
    self.data["data"].push(self.getKeyValueFromJSON(rowJSONData));
    self.columnsToDisplay = extend(self.columnsToDisplay, rowJSONData);
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
        self.draw();
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
            var index = $(this).attr('data-index');
            var data = self.data["data"][index];
            self.onClickFunction(data);
        }
    });

    self.tableSelector.on('input', 'tbody tr td', function () {
        if (self.saveCellEdits)
        {
            var td = $(this);
            var index = td.closest('tr').attr('data-index');
            var celData = td.text();
            var columnIdentity = td.attr('data-identity');
            self.data["data"][index][columnIdentity] = celData;
        }
    });
};
//PUBLIC obtem os dados em formato JSON
ModernDataTable.prototype.getDataAsJSON = function () {
    var self = this;
    return self.data['data'];
};
//INTERNAL PRIVATE METHODS HELPERS
ModernDataTable.prototype.getKeyValueFromJSON = function (jsonCols) {
    var result = {};
    for (var i = 0; i < jsonCols.length; i++)
    {
        result[jsonCols[i]['key']] = jsonCols[i]['value'];
    }
    return result;
};
ModernDataTable.prototype.getKeysFromJSON = function (jsonCols) {
    var result = [];
    for (var i = 0; i < jsonCols.length; i++)
    {
        result[i] = jsonCols[i]['key'];
    }
    return result;
};
