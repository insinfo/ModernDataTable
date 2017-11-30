function ModernDataTable(tableId)
{
    this.customLoading = new CustomLoading('loading');
    this.restClient = new RESTClient();
    this.tableSelectorName = removeSpecialChars(tableId);
    this.tableSelector = $('#' + this.tableSelectorName);

    //PUBLIC CONFIGURATIONS
    this._method = 'POST';
    this._webServiceURL = null;
    this._dataToSender = null;
    this._defaultOrderCol = 0;
    this._showInfo = false;
    this._showPaginate = true;
    this._serverSide = true;
    this._showSearchBox = true;
    this._showActionBox = true;
    //actions buttons
    this._showActionBtnDelete = true;
    this._showActionBtnAdd = false;
    this._showActionBtnSearch = true;
    this._showActionBtnUpdate = true;
    this.isColsEditable = true;
    this._saveCellEdits = true;
    this.getTitlesOfColumnsFromJSON = false;
    this._showCheckBoxToSelectRow = true;
    this._primaryKey = 'id';
    this._showPrimaryKey = false;
    //colunas dos datos a serem exibidas pelo dataTable
    //configuração das colunas a serem exibidas
    //configuration of the columns to be displayed
    this.columnsToDisplay = [];

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
    this.dataIndexesOfRowsSelected = [];
    //Data of selected Rows
    this.selectedRowsDataIds = [];
    //objeto que armazena os dados
    this.data = {"data": []};
    //variavel que armazena a estrutura da tabela
    this.tableStruture = '';
    //parametros enviados ao webservice pelo dataTable
    this.parametersToSender = {
        "draw": "1", "start": this.currentPage, "length": this.recordsPerPage, "search": this.searchValue
    };
    this.init();
}

//PUBLIC METHODS
ModernDataTable.prototype.load = function () {
    var self = this;
    if (this._serverSide && this._webServiceURL !== null)
    {
        this.getDataFromURL();
    }
};
ModernDataTable.prototype.reload = function () {
    var self = this;
    if (this._serverSide && this._webServiceURL !== null)
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
    if (self.dataIndexesOfRowsSelected.length > 0)
    {
        for (var j = 0; j <= self.dataIndexesOfRowsSelected.length; j++)
        {
            self.data["data"].splice(self.dataIndexesOfRowsSelected[j], 1);
            self.dataIndexesOfRowsSelected.splice(j, 1);
            self.selectedRowsDataIds.splice(j, 1);
        }
        self.draw();
    }
};
ModernDataTable.prototype.getRowsSelectedDataIds = function () {
    var self = this;
    return self.selectedRowsDataIds;
};

ModernDataTable.prototype.validateFields = function () {
    var self = this;
    var colsCount = self.columnsToDisplay.length;
    var dataCount = self.data['data'].length;

    var result = true;

    for (var i = 0; i < dataCount; i++)
    {
        for (var j = 0; j < colsCount; j++)
        {
            var key = self.columnsToDisplay[j]['key'];
            var tdContent = self.data['data'][i][key];
            var validateCallback = self.columnsToDisplay[j]['validation'];

            if (typeof validateCallback === "function")
            {
                result = validateCallback(tdContent);
            }
        }
    }
    return result;
};
ModernDataTable.prototype.validateFields2 = function () {
    var self = this;
    var colsCount = self.columnsToDisplay.length;

    var result = true;

    self.tableSelector.find('tbody tr').each(function (i, tr) {

        $(tr).find('td').each(function (j, td) {

            td = $(td);
            var tdContent = td.text();
            var dataIdentity = td.attr('data-identity');
            var validateCallback = null;

            for (var l = 0; l < colsCount; l++)
            {
                var key = self.columnsToDisplay[l]['key'];
                if (key === dataIdentity)
                {
                    validateCallback = self.columnsToDisplay[l]['validation'];
                    break;
                }
            }
            if (typeof validateCallback === "function")
            {
                result = validateCallback(tdContent);
                if (!result)
                {
                    td.css({
                        "color": "red", "border-color": "red", "border-width": "1px", "border-style": "solid"
                    });

                }
                else
                {
                    td.removeAttr("style");
                }
            }

        });
    });
    return result;
};
ModernDataTable.prototype.getRowsCount = function () {
    return this.data['data'].length;
};
//obtem os dados do dataTable em formato JSON
ModernDataTable.prototype.getDataAsJSON = function () {
    var self = this;

    var dados = JSON.parse(JSON.stringify(self.data['data']));
    for(var i=0; i < dados.length; i++)
    {
        var item = dados[i];

        var keys = Object.keys(item);
        for(var j=0; j< keys.length; j++)
        {
            var key = keys[j];
            if(key.indexOf('---Content') > -1)
            {
                var contentValue = item[key];
                delete item[key];
                item[key.replace('---Content', '')] = contentValue;
            }
        }
    }
    return dados;
};
ModernDataTable.prototype.getSelectedIds = function () {
    var self = this;
    return self.dataIdsOfRowsSelected;
};

ModernDataTable.prototype.setIsColsEditable = function (isColsEditable) {
    this.isColsEditable = isColsEditable;
};
ModernDataTable.prototype.setDisplayCols = function (columnsToDisplay) {
    this.columnsToDisplay = columnsToDisplay;
};
ModernDataTable.prototype.setDataToSender = function (dataToSender) {
    this._dataToSender = dataToSender;
};
ModernDataTable.prototype.setSourceURL = function (webServiceURL) {
    this._webServiceURL = webServiceURL;
};
ModernDataTable.prototype.setSourceMethodPOST = function () {
    this._method = 'POST';
};
ModernDataTable.prototype.setSourceMethodGET = function () {
    this._method = 'GET';
};
ModernDataTable.prototype.setPrimaryKey = function (primaryKey) {
    this._primaryKey = primaryKey;
};
ModernDataTable.prototype.showPrimaryKey = function () {
    this._showPrimaryKey = true;
};
ModernDataTable.prototype.hidePrimaryKey = function () {
    this._showPrimaryKey = false;
};
ModernDataTable.prototype.showSelection = function () {
    this._showCheckBoxToSelectRow = true;
};
ModernDataTable.prototype.hideSelection = function () {
    this._showCheckBoxToSelectRow = false;
};
ModernDataTable.prototype.showSearchBox = function () {
    this._showSearchBox = true;
};
ModernDataTable.prototype.hideSearchBox = function () {
    this._showSearchBox = false;
};
ModernDataTable.prototype.showActionBox = function () {
    this._showActionBox = true;
};
ModernDataTable.prototype.hideActionBox = function () {
    this._showActionBox = false;
};
ModernDataTable.prototype.showActionBtnDelete = function () {
    this._showActionBtnDelete = true;
};
ModernDataTable.prototype.showActionBtnAdd = function () {
    this._showActionBtnAdd = true;
    this.drawTableHeader();
};
ModernDataTable.prototype.showActionBtnSearch = function () {
    this._showActionBtnSearch = true;
};
ModernDataTable.prototype.showActionBtnUpdate = function () {
    this._showActionBtnUpdate = true;
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
    self.showLoading();
    var senderData = {};
    if (self._dataToSender)
    {
        senderData = self._dataToSender;
    }
    senderData = extend(senderData, self.parametersToSender);
    self.restClient.setDataToSender(senderData);
    self.restClient.setWebServiceURL(self._webServiceURL);
    self.restClient.setMethod(self._method);
    self.restClient.setSuccessCallbackFunction(function (data) {
        self.hideLoading();
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

        //defini o cursor para hand se as colunas não forem editaveis
        if (self.isColsEditable === false)
        {
            self.tableSelector.find('tbody').css('cursor', 'pointer');
        }
        else
        {
            self.tableSelector.find('tbody').css('cursor', 'auto');
        }

    });
    self.restClient.setErrorCallbackFunction(function (jqXHR, textStatus, errorThrown) {
        self.hideLoading();
        alert('Erro ao obter dados do servidor');
    });
    self.restClient.exec();
};
ModernDataTable.prototype.showLoading = function () {
    this.tableSelector.parent().addClass('modernDataTableLoading')
};
ModernDataTable.prototype.hideLoading = function () {
    this.tableSelector.parent().removeClass('modernDataTableLoading')
};
ModernDataTable.prototype.createTableHead = function () {
    var self = this;

    if (self.tableSelector.find('thead').length === 0)
    {
        self.tableSelector.append('<thead><tr></tr></thead>');
    }

    if (self._showCheckBoxToSelectRow)
    {
        var checkboxSelectAllId = self.tableSelectorName + '_cbSelectAll';
        var checkboxSelectAll = '<th class="dataTableColSelect">' + '<div class="dataTableCheckBox">' + '<input id="' + checkboxSelectAllId + '" value="1" type="checkbox">' + '<label for="' + checkboxSelectAllId + '"></label>' + '</div>' + '</th>';
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
ModernDataTable.prototype.createCol = function (colContent, columnIdentity, cssClass, isEditable) {
    var css = '';
    var editable = '';
    var columnId = '';
    if (cssClass)
    {
        css = 'class="' + cssClass + '"';
    }

    if (isEditable)
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
    var colContent = '<div class="dataTableCheckBox"><input value="0" type="checkbox" id="' + id + '"/>' + '<label for="' + id + '"></label></div>';
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
        if (self._showCheckBoxToSelectRow)
        {
            cols += self.createColSelect(self.tableSelectorName + '_cb_' + i);
        }
        /*var definedColNames = self.getKeysFromJSON(self.columnsToDisplay);
        var autoColNames = Object.keys(row);
        var colsNames = definedColNames;*/

        for (var j = 0; j < self.columnsToDisplay.length; j++)
        {
            var tdClassName = self.columnsToDisplay[j]['class'];
            var tdType = self.columnsToDisplay[j]['type'];
            var tdFlag = self.columnsToDisplay[j]['flag'];
            var tdEditable = self.columnsToDisplay[j]['editable'];
            var key = self.columnsToDisplay[j]['key'];
            var renderCallback = self.columnsToDisplay[j]['render'];
            var tdContent = '';

            //executa o callback de render da td se ouver um
            if (typeof renderCallback === "function")
            {
                tdContent = renderCallback(row);
            }
            //verifica se tem um ponto na key dos dados se existir
            else if (key.indexOf('.') > -1)
            {
                var fields = key.split('.');
                tdContent = row[fields[0]][fields[1]];
            }
            else
            {
                tdContent = row[key];
            }

            var columnIdentity = key;

            var isTdEditable = false;

            if (self.isColsEditable && tdEditable !== 'false')
            {
                isTdEditable = true;
            }

            if (self._showPrimaryKey)
            {
                cols += self.createCol(tdContent, columnIdentity, tdClassName);
            }
            else
            {
                if (key !== self._primaryKey)
                {
                    switch (tdType)
                    {
                        case 'data':
                            tdContent = sqlDateToBrasilDate(tdContent);
                            break;
                        case 'checkbox':
                            var isDisable = tdFlag === 'disabled' ? 'disabled' : '';
                            var jSwitchNoCheck = '<div class="jSwitch"><label><input type="checkbox" ' + isDisable + '><span class="jThumb"></span></label></div>';
                            var jSwitchCheck = '<div class="jSwitch"><label><input type="checkbox" checked ' + isDisable + '><span class="jThumb"></span></label></div>';
                            tdContent = tdContent ? jSwitchCheck : jSwitchNoCheck;
                            tdClassName = 'dataTableTdBool';
                            isTdEditable = false;
                            break;
                        case 'bool':
                            tdContent = tdContent ? 'sim' : 'não';
                            tdClassName = 'dataTableTdBool';
                            isTdEditable = false;
                            break;
                        case 'boolIcon':
                            var boolIconNo = '<i class="dataTableBoolIconNo"></i>';
                            var boolIcon = '<i class="dataTableBoolIconYes"></i>';
                            tdClassName = 'dataTableTdBool';
                            tdContent = tdContent ? boolIcon + '<span>sim</span>' : boolIconNo + '<span>não</span>';
                            isTdEditable = false;
                            break;
                        default:
                            tdContent = (tdContent);
                    }
                    cols += self.createCol(tdContent, columnIdentity, tdClassName, isTdEditable);
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
        var tr = $(this).closest('tr');
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
            self.onClickFunction(self.getDataByTr(tr));
        }
    });
    //evento quando digita algo nas celulas e salva na variavel data
    self.tableSelector.on('input', 'tbody tr td', function () {
        /*if (self._saveCellEdits)
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
        var dataContent = td.attr("data-content");

        self.data["data"][index][columnIdentity] = celData;
        if (typeof dataContent !== typeof undefined)
        {
            self.data["data"][index][columnIdentity + '---Content'] = dataContent;
        }

        //}
    });
    //event Select All Rows
    self.tableSelector.off('click', 'thead tr input[type="checkbox"]');
    self.tableSelector.on('click', 'thead tr input[type="checkbox"]', function () {
        //se tiver marcado
        if (this.checked)
        {
            self.tableSelector.find('tbody tr .dataTableColSelect input[type="checkbox"]').each(function (index) {
                var checkbox = $(this);
                checkbox.prop('checked', true);
                var tr = checkbox.closest('tr');

                self.dataIndexesOfRowsSelected = [];
                var dataIndex = parseInt(tr.attr('data-index'));
                self.dataIndexesOfRowsSelected.push(dataIndex);

                self.selectedRowsDataIds = [];
                var correntDataId = self.data['data'][dataIndex][self._primaryKey];
                self.selectedRowsDataIds.push(correntDataId)
            });
        }
        //se tiver desmarcado
        if (!this.checked)
        {
            self.tableSelector.find('tbody tr .dataTableColSelect input[type="checkbox"]').each(function (i) {
                var checkbox = $(this);
                checkbox.prop('checked', false);
            });
            self.dataIndexesOfRowsSelected = [];
            self.selectedRowsDataIds = [];
        }
    });
    //event Select One Row
    self.tableSelector.off('click', 'tbody tr input[type="checkbox"]');
    self.tableSelector.on('click', 'tbody tr input[type="checkbox"]', function (e) {
        var checkbox = $(this);
        var tr = checkbox.closest('tr');
        var dataIndex = parseInt(tr.attr('data-index'));
        //verifica se o indice atual ja existe no array de indices
        var existingIndex = arrayContainsThisNumber(self.dataIndexesOfRowsSelected, dataIndex);

        var correntDataId = self.data['data'][dataIndex][self._primaryKey];
        var existingIdIndex = arrayContainsThisNumber(self.selectedRowsDataIds, correntDataId);

        //seta o checkbox para marcado valor 1 ou desmarcado valor 0
        var varlor = parseInt(checkbox.val()) === 0 ? 1 : 0;
        checkbox.val(varlor);
        //se o checkbox estivar valor 1 e o indice atual não exisir no array de indices ou seja -1
        //armazena o indice atual no array de indices
        if (parseInt(checkbox.val()) === 1 && existingIndex === -1)
        {
            self.dataIndexesOfRowsSelected.push(dataIndex);
            self.selectedRowsDataIds.push(correntDataId);
        }
        else if (parseInt(checkbox.val()) === 0 && existingIndex !== -1)
        {
            self.dataIndexesOfRowsSelected.splice(existingIndex, 1);
            self.selectedRowsDataIds.splice(existingIdIndex, 1);
        }
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
            self.onDeleteItemAction(self.selectedRowsDataIds);
        }
        self.deleteRowsSelected();
    });

    //event hide or show search box
    $(document).off('click', '#' + self.tableSelectorName + '_btnSearch');
    $(document).on('click', '#' + self.tableSelectorName + '_btnSearch', function (e) {
        if (self._showSearchBox)
        {
            self._showSearchBox = false;
            $(document).find('#' + self.tableSelectorName + '_inputSearch').closest('.input-field').fadeOut();
        }
        else
        {
            $(document).find('#' + self.tableSelectorName + '_inputSearch').closest('.input-field').fadeIn();
            self._showSearchBox = true;
        }
        //self.drawTableHeader();
    });

    //event of search on server side
    $(document).off('keyup', '#' + self.tableSelectorName + '_inputSearch');
    $(document).on('keyup', '#' + self.tableSelectorName + '_inputSearch', function (e) {

        self.parametersToSender = {
            "draw": "1", "start": self.currentPage, "length": self.recordsPerPage, "search": $(this).val()
        };
        self.getDataFromURL();
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

    var btnAdd = self._showActionBtnAdd ? '<a href="#" id="' + self.tableSelectorName + '_btnAdd' + '"  class="waves-effect btn-flat nopadding "><i class=" dataTableBtnAdd"></i></a>' : '';
    var btnUpdate = self._showActionBtnUpdate ? '<a href="#" id="' + self.tableSelectorName + '_btnUpdate' + '"  class="waves-effect btn-flat nopadding "><i class=" dataTableBtnUpdate"></i></a>' : '';
    var btnDelete = self._showActionBtnDelete ? '<a href="#" id="' + self.tableSelectorName + '_btnDelete' + '" class="waves-effect btn-flat nopadding "><i class=" dataTableBtnDelete"></i></a>' : '';
    var btnSearch = self._showActionBtnSearch ? '<a href="#" id="' + self.tableSelectorName + '_btnSearch' + '" class="waves-effect btn-flat nopadding "><i class=" dataTableBtnSearch"></i></a>' : '';

    var inputSearch = self._showSearchBox ? '<div class="input-field "><input maxlength="40" id="' + self.tableSelectorName + '_inputSearch" type="text" ><label>Pesquisar...</label></div>' : '';
    var tableActions = self._showActionBox ? '<div class="actions">' + btnAdd + btnUpdate + btnDelete + btnSearch + '</div>' : '';

    self.tableSelector.prev('.table-header').remove();
    self.tableHeader = $('<div class="table-header">' + inputSearch + tableActions + '</div>');
    self.tableHeader.insertBefore(self.tableSelector);
};
//PAGINATION FUNCTIONS
ModernDataTable.prototype.drawPagination = function () {
    var self = this;
    if (self._showPaginate)
    {
        self.tableFooter.append('<div class="dataTables_paginate paging_simple_numbers" id="' + self.tableSelectorName + '_paginate">' + '<ul class="material-pagination">' + '<li class="paginate_button previous disabled" id="' + self.tableSelectorName + '_previous">' + '<a href="#" class="waves-effect btn-flat nopadding" tabindex="0">' + '<i class="dataTableBtnPrevious"></i>' + '</a>' + '</li>' + '<li class="paginate_button next disabled" id="' + self.tableSelectorName + '_next">' + '<a href="#" class="waves-effect btn-flat nopadding"  tabindex="0">' + '<i class="dataTableBtnNext"></i>' + '</a>' + '</li>' + '</ul>' + '</div>');

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

    self.parametersToSender = {
        "draw": "1", "start": self.currentPage, "length": self.recordsPerPage, "search": self.searchValue
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
