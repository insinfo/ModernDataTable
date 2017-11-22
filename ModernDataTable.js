function ModernDataTable(tableId)
{
    this.customLoading = new CustomLoading('loading');
    this.restClient = new RESTClient();
    this.tableSelectorName = removeSpecialChars(tableId);
    this.tableSelector = $('#' + this.tableSelectorName);
    this.method = 'POST';

    //PUBLIC CONFIGURATIONS
    this.webServiceURL = null;
    this.dataToSender = null;
    this.defaultOrderCol = 0;
    this.showInfo = false;
    this.showPaginate = true;
    this.serverSide = true;
    this.showSearchBox = true;
    this.showActionBox = true;
    //actions buttons
    this.showActionBtnDelete = true;
    this.showActionBtnAdd = false;
    this.showActionBtnSearch = true;
    this.showActionBtnUpdate = true;
    this.isColsEditable = true;
    this.saveCellEdits = true;
    this.getTitlesOfColumnsFromJSON = false;
    this.showCheckBoxToSelectRow = true;
    this.primaryKey = 'id';
    this.showPrimaryKey = false;
    //colunas dos datos a serem exibidas pelo dataTable
    //configuração das colunas a serem exibidas
    //configuration of the columns to be displayed
    this.columnsToDisplay = [{"key": "id", "value": "0"}, {
        "key": "idEmpenho", "value": "empenho", "class": "inputIdEmpenhoParcela"
    }, {"key": "numeroParcela", "value": "", "class": "inputNumeroParcela"}, {
        "key": "valor", "value": "R$ 0.00,00", "class": "inputValorParcela"
    }];

    //INTERNAL PROPERTIES
    this.tableFooter = null;
    this.tableHeader = null;
    //Pagination
    this.currentPage = 0;
    this.recordsPerPage = 10;
    this.searchValue = '';
    /*Total de registros, antes da filtragem
    (ou seja, o número total de registros no banco de dados)*/
    this.recordsTotal = 0;
    /*Os registros totais, após a filtragem
    (ou seja, o número total de registros após a filtragem foi aplicado
     não apenas o número de registros retornados para esta página de dados).*/
    this.recordsFiltered = 0;
    //botão ir para pagina anterior
    this.btnGoToPreviousPage = null;
    //botão ir para proxima pagina
    this.btnGoToNextPage = null;

    //public external events listener
    this.onSelectFunction = null;
    this.onClickFunction = null;
    this.onLoadedContent = null;
    this.onChangePage = null;
    this.onDeleteItemAction = null;
    this.onAddItemAction = null;

    //array que armazena ids das linhas selecionadas
    this.dataIdsOfRowsSelected = [];
    this.dataIndexesOfRowsSelected = [];
    //objeto que armazena os dados
    this.data = {"data": []};
    //variavel que armazena a estrutura da tabela
    this.tableStruture = '';
    //parametros enviados ao webservice pelo dataTable
    this.parametersToSender = {
        "draw": "1", "start": this.currentPage, "length": this.recordsPerPage, "search[value]": this.searchValue
    };
    this.init();
}

//PUBLIC METHODS
ModernDataTable.prototype.load = function () {
    var self = this;
    if (this.serverSide && this.webServiceURL !== null)
    {
        this.getDataFromURL();
    }
};
ModernDataTable.prototype.reload = function () {
    var self = this;
    if (this.serverSide && this.webServiceURL !== null)
    {
        this.getDataFromURL();
    }
};
ModernDataTable.prototype.appendRowFromJSON = function (rowJSONData) {
    var self = this;
    self.recordsTotal++;
    self.recordsFiltered++;
    self.data["data"].push(rowJSONData);
    self.draw();
};
ModernDataTable.prototype.deleteRowsSelected = function () {
    var self = this;
    var data = self.data["data"];
    for (var i = 0; i < data.length; i++)
    {
        var idx = $.inArray(data[i]['id'], self.dataIdsOfRowsSelected);
        if (idx !== -1)
        {
            self.data["data"].splice(i, 1);
            self.dataIdsOfRowsSelected.splice(idx, 1);
            self.dataIndexesOfRowsSelected.splice(i, 1);
        }
    }
    self.draw();
};
ModernDataTable.prototype.setDisplayCols = function (columnsToDisplay) {
    this.columnsToDisplay = columnsToDisplay;
};
ModernDataTable.prototype.setDataToSender = function (dataToSender) {
    this.dataToSender = dataToSender;
};
ModernDataTable.prototype.setSourceURL = function (webServiceURL) {
    this.webServiceURL = webServiceURL;
};
ModernDataTable.prototype.setSourceMethodPOST = function () {
    this.method = 'POST';
};
ModernDataTable.prototype.setSourceMethodGET = function () {
    this.method = 'GET';
};
ModernDataTable.prototype.setPrimaryKey = function (primaryKey) {
    this.primaryKey = primaryKey;
};
ModernDataTable.prototype.showPrimaryKey = function () {
    this.showPrimaryKey = true;
};
ModernDataTable.prototype.hidePrimaryKey = function () {
    this.showPrimaryKey = false;
};
ModernDataTable.prototype.showSelection = function () {
    this.showCheckBoxToSelectRow = true;
};
ModernDataTable.prototype.hideSelection = function () {
    this.showCheckBoxToSelectRow = false;
};
ModernDataTable.prototype.showSearchBox = function () {
    this.showSearchBox = false;
};
ModernDataTable.prototype.showActionBox = function () {
    this.showActionBox = false;
};
ModernDataTable.prototype.showActionBtnDelete = function () {
    this.showActionBtnDelete = false;
};
ModernDataTable.prototype.showActionBtnAdd = function () {
    this.showActionBtnAdd = false;
};
ModernDataTable.prototype.showActionBtnSearch = function () {
    this.showActionBtnSearch = false;
};
ModernDataTable.prototype.showActionBtnUpdate = function () {
    this.showActionBtnUpdate = false;
};
//obtem os dados do dataTable em formato JSON
ModernDataTable.prototype.getDataAsJSON = function () {
    var self = this;
    return self.data['data'];
};
ModernDataTable.prototype.getSelectedIds = function () {
    var self = this;
    return self.dataIdsOfRowsSelected;
};
//SET PUBLIC EVENT LISTENING
ModernDataTable.prototype.setOnSelect = function (onSelectFunction) {
    this.onSelectFunction = onSelectFunction;
};
ModernDataTable.prototype.setOnClick = function (onClickFunction) {
    this.onClickFunction = onClickFunction;
};
ModernDataTable.prototype.setOnLoadedContent = function (onLoadedContent) {
    this.onLoadedContent = onLoadedContent;
};
ModernDataTable.prototype.setOnChangePage = function (onChangePage) {
    this.onChangePage = onChangePage;
};
ModernDataTable.prototype.setOnDeleteItemAction = function (onDeleteItem) {
    this.onDeleteItemAction = onDeleteItem;
};
ModernDataTable.prototype.setOnAddItemAction = function (onAddItemAction) {
    this.onAddItemAction = onAddItemAction;
};
//INTERNAL PRIVATE METHODS
ModernDataTable.prototype.init = function () {
    var self = this;
    self.createTableBody();
    self.drawTableFooter();
    self.drawPagination();
    self.drawTableHeader();
    self.createTableHead();
    self.events();
};
//obtem os dados do webservice
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
        self.dataIdsOfRowsSelected = [];
        self.dataIndexesOfRowsSelected = [];
        self.recordsTotal = data['recordsTotal'];
        self.recordsFiltered = data['recordsFiltered'];
        self.data['data'] = data['data'];
        self.draw();
        if (typeof self.onLoadedContent === "function")
        {
            self.onLoadedContent();
        }
    });
    self.restClient.setErrorCallbackFunction(function (jqXHR, textStatus, errorThrown) {
        self.customLoading.hide();
        alert('Erro ao obter dados do servidor');
    });
    self.restClient.exec();
};
ModernDataTable.prototype.createTableHead = function () {
    var self = this;

    if (self.tableSelector.find('thead').length === 0)
    {
        self.tableSelector.append('<thead><tr></tr></thead>');
    }

    if (self.showCheckBoxToSelectRow)
    {
        var checkboxSelectAllId = self.tableSelectorName + '_cbSelectAll';
        var checkboxSelectAll = '<th>' + '<div class="dataTableCheckBox">' + '<input id="' + checkboxSelectAllId + '" value="1" type="checkbox">' + '<label for="' + checkboxSelectAllId + '"></label>' + '</div>' + '</th>';
        self.tableSelector.find('thead tr').prepend(checkboxSelectAll);
    }
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
ModernDataTable.prototype.createColSelect = function (id) {
    var self = this;
    var colContent = '<div class="dataTableCheckBox"><input type="checkbox" id="' + id + '"/>' + '<label for="' + id + '"></label></div>';
    return '<td class="dataTableColSelect">' + colContent + '</td>'
};
ModernDataTable.prototype.draw = function () {
    var self = this;
    var data = self.data['data'];
    var dataLength = data.length;
    var rows = '';
    self.tableStruture = '';
    var i = 0;
    for (i; i < dataLength; i++)
    {
        var row = data[i];
        var cols = '';
        if (self.showCheckBoxToSelectRow)
        {
            cols += self.createColSelect(self.tableSelectorName + '_cb_' + i);
        }
        var definedColNames = self.getKeysFromJSON(self.columnsToDisplay);
        var autoColNames = Object.keys(row);
        var colsNames = definedColNames;

        for (var j = 0; j < colsNames.length; j++)
        {
            var tdClassName = self.columnsToDisplay[j]['class'];
            var tdContent = row[colsNames[j]];
            var columnIdentity = colsNames[j];

            if (self.showPrimaryKey)
            {
                cols += self.createCol(tdContent, columnIdentity, tdClassName);
            }
            else
            {
                if (colsNames[j] !== self.primaryKey)
                {
                    cols += self.createCol(tdContent, columnIdentity, tdClassName);
                }
            }
        }
        rows += self.createRow(cols, i);

        if (self.recordsPerPage === i + 1)
        {
            break;
        }
    }
    self.tableStruture += rows;
    self.tableSelector.find('tbody').html(self.tableStruture);
};
//obtem os dados de uma determinada tr
ModernDataTable.prototype.getDataByTr = function (trElement) {
    var self = this;
    var dataIndex = $(trElement).attr('data-index');
    return self.data["data"][dataIndex];
};
//obtem o id dos dados de uma determinada tr
ModernDataTable.prototype.getDataIdByTr = function (trElement) {
    var self = this;
    var dataIndex = $(trElement).attr('data-index');
    return self.data["data"][dataIndex]['id'];
};
//INTERNAL EVENTS
ModernDataTable.prototype.events = function () {
    var self = this;
    //evento acionado quando clica em uma tr e dispara o callback
    self.tableSelector.on('click', 'tbody tr td', function (e) {
        if (e.target !== e.currentTarget)
        {
            return;
        }
        if ($(e.target).hasClass('dataTableColSelect'))
        {
            return;
        }
        if (typeof self.onClickFunction === "function")
        {
            self.onClickFunction(self.getDataByTr(this));
        }
    });
    //evento quando digita algo nas celulas e salva na variavel data
    self.tableSelector.on('input', 'tbody tr td', function () {
        /*if (self.saveCellEdits)
        {
            var td = $(this);
            var index = td.closest('tr').attr('data-index');
            var celData = td.text();
            var columnIdentity = td.attr('data-identity');
            self.data["data"][index][columnIdentity] = celData;
        }*/
    });
    self.tableSelector.on("DOMSubtreeModified propertychange", 'tbody tr td', function () {
        //if(self.data["data"].length > 0)
        //{
        var td = $(this);
        var index = td.closest('tr').attr('data-index');
        var celData = td.text();
        var columnIdentity = td.attr('data-identity');
        //td.attr("data-content")
        self.data["data"][index][columnIdentity] = celData;
        //}
    });
    //event Select All Rows
    self.tableSelector.off('click', 'thead tr input[type="checkbox"]');
    self.tableSelector.on('click', 'thead tr input[type="checkbox"]', function () {
        //se tiver marcado
        if (this.checked)
        {
            self.tableSelector.find('tbody tr input[type="checkbox"]').each(function (index) {
                var checkbox = $(this);
                checkbox.prop('checked', true);
                var tr = checkbox.closest('tr');
                var dataIndex = parseInt(tr.attr('data-index'));
                var rowId = self.getDataIdByTr(tr);

                self.dataIndexesOfRowsSelected.push(dataIndex);
                self.dataIdsOfRowsSelected.push(rowId);
            });
        }
        //se tiver desmarcado
        if (!this.checked)
        {
            self.tableSelector.find('tbody tr input[type="checkbox"]').each(function (i) {
                var checkbox = $(this);
                checkbox.prop('checked', false);
            });
            self.dataIndexesOfRowsSelected = [];
            self.dataIdsOfRowsSelected = [];
        }
    });

    //event Select One Row
    self.tableSelector.off('click', 'tbody tr input[type="checkbox"]');
    self.tableSelector.on('click', 'tbody tr input[type="checkbox"]', function (e) {
        var tr = $(this).closest('tr');
        var rowId = self.getDataIdByTr(tr);
        var dataIndex = parseInt(tr.attr('data-index'));
        // Determine se o ID da linha está na lista de IDs de linhas selecionadas
        var indexOfId = $.inArray(rowId, self.dataIdsOfRowsSelected);
        // Se a caixa de seleção estiver marcada e a
        // identificação da linha não estiver na lista de IDs de linha selecionadas
        if (this.checked && indexOfId === -1)
        {
            self.dataIdsOfRowsSelected.push(rowId);
            self.dataIndexesOfRowsSelected.push(dataIndex);
        }
        // Caso contrário, se a caixa de verificação não estiver marcada e
        // a identificação da linha estiver na lista das IDs de linha selecionadas
        else if (!this.checked && indexOfId !== -1)
        {
            self.dataIdsOfRowsSelected.splice(indexOfId, 1);
            self.dataIndexesOfRowsSelected.splice(dataIndex, 1);
        }
        e.stopPropagation();
    });
    //events of pagination
    $(document).on('click', '#' + self.tableSelectorName + '_previous', function (e) {
        self.prevPage();
    });
    $(document).on('click', '#' + self.tableSelectorName + '_next', function (e) {
        self.nextPage();
    });

    //EVENTS OF ACTIONS
    //event add item
    $(document).off('click', '#' + self.tableSelectorName + '_btnAdd');
    $(document).on('click', '#' + self.tableSelectorName + '_btnAdd', function (e) {
        if (typeof self.onAddItemAction === "function")
        {
            self.onAddItemAction();
        }
    });
    //event reload
    $(document).off('click', '#' + self.tableSelectorName + '_btnUpdate');
    $(document).on('click', '#' + self.tableSelectorName + '_btnUpdate', function (e) {
        self.reload();
    });
    //event deleta item
    $(document).off('click', '#' + self.tableSelectorName + '_btnDelete');
    $(document).on('click', '#' + self.tableSelectorName + '_btnDelete', function (e) {
        if (typeof self.onDeleteItemAction === "function")
        {
            self.onDeleteItemAction();
        }
        self.deleteRowsSelected();
    });

    //event hide or show search box
    $(document).off('click', '#' + self.tableSelectorName + '_btnSearch');
    $(document).on('click', '#' + self.tableSelectorName + '_btnSearch', function (e) {
        if (self.showSearchBox)
        {
            self.showSearchBox = false;
            $(document).find('#' + self.tableSelectorName + '_inputSearch').closest('.input-field').fadeOut();
        }
        else
        {
            $(document).find('#' + self.tableSelectorName + '_inputSearch').closest('.input-field').fadeIn();
            self.showSearchBox = true;
        }
        //self.drawTableHeader();
    });

    //dataTableInputSearch
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
ModernDataTable.prototype.drawTableFooter = function () {
    var self = this;
    self.tableFooter = $('<div class="table-footer"></div>');
    self.tableFooter.insertAfter(self.tableSelector)
};
ModernDataTable.prototype.drawTableHeader = function () {
    var self = this;

    var btnAdd = self.showActionBtnAdd ? '<a href="#" id="' + self.tableSelectorName + '_btnAdd' + '"  class="waves-effect btn-flat nopadding"><i class="material-icons">note_add</i></a>' : '';
    var btnUpdate = self.showActionBtnUpdate ? '<a href="#" id="' + self.tableSelectorName + '_btnUpdate' + '"  class="waves-effect btn-flat nopadding"><i class="material-icons">refresh</i></a>' : '';
    var btnDelete = self.showActionBtnDelete ? '<a href="#" id="' + self.tableSelectorName + '_btnDelete' + '" class="waves-effect btn-flat nopadding"><i class="material-icons">delete</i></a>' : '';
    var btnSearch = self.showActionBtnSearch ? '<a href="#" id="' + self.tableSelectorName + '_btnSearch' + '" class="waves-effect btn-flat nopadding"><i class="material-icons">search</i></a>' : '';

    var inputSearch = self.showSearchBox ? '<div class="input-field "><input id="' + self.tableSelectorName + '_inputSearch" type="text" ><label>Pesquisar...</label></div>' : '';
    var tableActions = self.showActionBox ? '<div class="actions">' + btnAdd + btnUpdate + btnDelete + btnSearch + '</div>' : '';

    self.tableSelector.prev('.table-header').remove();
    self.tableHeader = $('<div class="table-header">' + inputSearch + tableActions + '</div>');
    self.tableHeader.insertBefore(self.tableSelector);

};
//PAGINATION FUNCTIONS
ModernDataTable.prototype.drawPagination = function () {
    var self = this;
    if (self.showPaginate)
    {
        self.tableFooter.append('<div class="dataTables_paginate paging_simple_numbers" id="' + self.tableSelectorName + '_paginate">' + '<ul class="material-pagination">' + '<li class="paginate_button previous disabled" id="' + self.tableSelectorName + '_previous">' + '<a href="#" aria-controls="tableListaContrato" tabindex="0">' + '<i class="material-icons">chevron_left</i>' + '</a>' + '</li>' + '<li class="paginate_button next disabled" id="' + self.tableSelectorName + '_next">' + '<a href="#" aria-controls="tableListaContrato" tabindex="0">' + '<i class="material-icons">chevron_right</i>' + '</a>' + '</li>' + '</ul>' + '</div>');

        self.btnGoToPreviousPage = $(document).find('#' + self.tableSelectorName + '_previous');
        self.btnGoToNextPage = $(document).find('#' + self.tableSelectorName + '_next');
    }
};
ModernDataTable.prototype.prevPage = function () {
    var self = this;
    if (self.currentPage > 1)
    {
        self.currentPage--;
        self.changePage(self.currentPage);
    }
};
ModernDataTable.prototype.nextPage = function () {
    var self = this;
    if (self.currentPage < self.numPages())
    {
        self.currentPage++;
        self.changePage(self.currentPage);
    }
};
ModernDataTable.prototype.changePage = function (page) {
    var self = this;

    // Validate page
    if (page < 1)
    {
        page = 1;
    }
    if (page > self.numPages())
    {
        page = self.numPages();
    }

    if (page === 1)
    {
        self.btnGoToPreviousPage.css('visibility', "hidden");
    }
    else
    {
        self.btnGoToPreviousPage.css('visibility', "visible");
    }

    if (page === self.numPages())
    {
        self.btnGoToNextPage.css('visibility', "hidden");
    }
    else
    {
        self.btnGoToNextPage.css('visibility', "visible");
    }

    this.parametersToSender = {
        "draw": "1", "start": this.currentPage, "length": this.recordsPerPage, "search[value]": this.searchValue
    };
    self.getDataFromURL();

    //run the event Change Page
    if (typeof self.onChangePage === "function")
    {
        self.onChangePage();
    }
};
ModernDataTable.prototype.numPages = function () {
    var self = this;
    return Math.ceil(self.recordsFiltered / self.recordsPerPage);
};
