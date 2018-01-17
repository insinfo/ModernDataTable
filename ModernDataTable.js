/**
 * Created by Isaque Neves Sant Ana. 
 * Version: 1.0.0
 * Date: 17/01/2018
 * Time: 11:44
 */

// PAGINATION CONSTANTS STYLES
ModernDataTable.NONE=10;
ModernDataTable.CAROULSEL=11;
ModernDataTable.CUBE=12;

function ModernDataTable(tableId)
{
    //this.customLoading = new CustomLoading('loading');
    this._restClient = new RESTClient();
    this._tableSelectorName = removeSpecialChars(tableId);
    this._tableSelector = $('#' + this._tableSelectorName);

    //PUBLIC CONFIGURATIONS
    this._method = 'POST';
    this._webServiceURL = null;
    this._dataToSender = null;
    this._defaultOrderCol = 0;
    this._showInfo = false;
    this._serverSide = true;
    this._showSearchBox = true;
    this._showActionBox = true;
    //actions buttons
    this._showActionBtnDelete = true;
    this._showActionBtnAdd = false;
    this._showActionBtnSearch = true;
    this._showActionBtnUpdate = true;
    this._isColsEditable = true;
    this._saveCellEdits = true;
    this._getTitlesOfColumnsFromJSON = false;
    this._showCheckBoxToSelectRow = true;
    this._primaryKey = 'id';
    this._showPrimaryKey = false;
    //colunas dos datos a serem exibidas pelo dataTable
    this._columnsToDisplay = [];

    //INTERNAL PROPERTIES
    this._tableFooter = null;
    this._tableHeader = null;

    // PARAMETROS DE PAGINACAO
    this._paginationStyle = ModernDataTable.CAROULSEL;
    this._recordsTotal = 0;
    this._recordsFiltered = 0;
    this._currentPage = 1;
    this._itemsPerPage = 10;
    this._btnQuantity = 6;
    this._searchValue = '';
    this._showPaginate = true;
    this._paginationContainer = null;

    //public external events listener
    this._onSelectFunction = null;
    this._onClickFunction = null;
    this._onLoadedContent = null;
    this._onChangePage = null;
    this._onDeleteItemAction = null;
    this._onAddItemAction = null;

    //array que armazena ids das linhas selecionadas
    this._dataIndexesOfRowsSelected = [];
    //data of selected Rows
    this._selectedRowsDataIds = [];
    //objeto que armazena os dados
    this._data = {"data": []};
    //variavel que armazena a estrutura da tabela
    this._tableStruture = '';
   
    this.init();
}
//PUBLIC METHODS
ModernDataTable.prototype.load = function () {
    var self = this;
    if (self._serverSide && self._webServiceURL !== null)
    {
        self.getDataFromURL();
    }
};
ModernDataTable.prototype.reload = function () {
    var self = this;
    if (self._serverSide && self._webServiceURL !== null)
    {
        self.getDataFromURL();
    }
};
ModernDataTable.prototype.appendRowFromJSON = function (rowJSONData) {
    var self = this;
    self._recordsTotal++;
    self._recordsFiltered++;

    var dados = JSON.parse(JSON.stringify(rowJSONData));

    self._data["data"].push(dados);
    self.draw();
};
ModernDataTable.prototype.deleteRowsSelected = function () {
    var self = this;
    if (self._dataIndexesOfRowsSelected.length > 0)
    {
        for (var j = 0; j <= self._dataIndexesOfRowsSelected.length; j++)
        {
            self._data["data"].splice(self._dataIndexesOfRowsSelected[j], 1);
            self._dataIndexesOfRowsSelected.splice(j, 1);
            self._selectedRowsDataIds.splice(j, 1);
        }
        self.draw();
    }
};
ModernDataTable.prototype.getRowsSelectedDataIds = function () {
    var self = this;
    return self._selectedRowsDataIds;
};
ModernDataTable.prototype.validateFields = function () {
    var self = this;
    var colsCount = self._columnsToDisplay.length;
    var data = self._data['data'];
    var dataCount = data.length;

    var result = true;

    for (var i = 0; i < dataCount; i++)
    {
        for (var j = 0; j < colsCount; j++)
        {
            var key = self._columnsToDisplay[j]['key'];
            var tdContent = data[i][key];
            var validateCallback = self._columnsToDisplay[j]['validation'];

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
    var colsCount = self._columnsToDisplay.length;

    var result = true;

    self._tableSelector.find('tbody tr').each(function (i, tr) {

        $(tr).find('td').each(function (j, td) {

            td = $(td);
            var tdContent = td.text();
            var dataIdentity = td.attr('data-identity');
            var validateCallback = null;

            for (var l = 0; l < colsCount; l++)
            {
                var key = self._columnsToDisplay[l]['key'];
                if (key === dataIdentity)
                {
                    validateCallback = self._columnsToDisplay[l]['validation'];
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
    return this._data['data'].length;
};
//obtem os dados do dataTable em formato JSON
ModernDataTable.prototype.getDataAsJSON = function () {
    var self = this;

    var dados = JSON.parse(JSON.stringify(self._data['data']));
    for (var i = 0; i < dados.length; i++)
    {
        var item = dados[i];

        var keys = Object.keys(item);
        for (var j = 0; j < keys.length; j++)
        {
            var key = keys[j];
            if (key.indexOf('---Content') > -1)
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
    return self._dataIdsOfRowsSelected;
};
ModernDataTable.prototype.setIsColsEditable = function (isColsEditable) {
    this._isColsEditable = isColsEditable;
};
ModernDataTable.prototype.setDisplayCols = function (columnsToDisplay) {
    this._columnsToDisplay = columnsToDisplay;
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
ModernDataTable.prototype.showSelectionCheckBox = function () {
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
    this.draw_tableHeader();
};
ModernDataTable.prototype.showActionBtnSearch = function () {
    this._showActionBtnSearch = true;
};
ModernDataTable.prototype.showActionBtnUpdate = function () {
    this._showActionBtnUpdate = true;
};

//SET PUBLIC EVENT LISTENING
ModernDataTable.prototype.setOnSelect = function (onSelectFunction) {
    this._onSelectFunction = onSelectFunction;
};
ModernDataTable.prototype.setOnClick = function (onClickFunction) {
    this._onClickFunction = onClickFunction;
};
ModernDataTable.prototype.setOnLoadedContent = function (onLoadedContent) {
    this._onLoadedContent = onLoadedContent;
};
ModernDataTable.prototype.setOnChangePage = function (onChangePage) {
    this._onChangePage = onChangePage;
};
ModernDataTable.prototype.setOnDeleteItemAction = function (onDeleteItem) {
    this._onDeleteItemAction = onDeleteItem;
};
ModernDataTable.prototype.setOnAddItemAction = function (onAddItemAction) {
    this._onAddItemAction = onAddItemAction;
};
//INTERNAL PRIVATE METHODS
ModernDataTable.prototype.init = function () {
    var self = this;
    self.createTableBody();
    self.drawTableFooter();

    self.drawTableHeader();
    self.createTableHead();
    self.events();
};
//obtem os dados do webservice
ModernDataTable.prototype.getDataFromURL = function () {
    var self = this;
    self.showLoading();
    var senderData = {};

    var currentPage = self._currentPage === 1 ? 0 : self._currentPage-1;
    var offset = currentPage * self._itemsPerPage;
    var parametersToSender = {"draw": 1, "start": offset, "length": self._itemsPerPage, "search":self._searchValue};

    if (self._dataToSender)
    {
        senderData = self._dataToSender;
    }

    senderData = extend(senderData, parametersToSender);
    self._restClient.setDataToSender(senderData);
    self._restClient.setWebServiceURL(self._webServiceURL);
    self._restClient.setMethod(self._method);
    self._restClient.setSuccessCallbackFunction(function (data) {
        self.hideLoading();
        self._dataIdsOfRowsSelected = [];
        self._dataIndexesOfRowsSelected = [];
        self._recordsTotal = data['recordsTotal'];
        self._recordsFiltered = data['recordsFiltered'];
        self._data['data'] = data['data'];
        self.draw();
        self.drawPagination();
        if (typeof self._onLoadedContent === "function")
        {
            self._onLoadedContent();
        }

        //defini o cursor para hand se as colunas não forem editaveis
        if (self._isColsEditable === false)
        {
            self._tableSelector.find('tbody').css('cursor', 'pointer');
        }
        else
        {
            self._tableSelector.find('tbody').css('cursor', 'auto');
        }

    });
    self._restClient.setErrorCallbackFunction(function (jqXHR, textStatus, errorThrown) {
        self.hideLoading();
        alert('Erro ao obter dados do servidor');
    });
    self._restClient.exec();
};
ModernDataTable.prototype.getData = function () {
    return this._data['data'];
};

ModernDataTable.prototype.setRecordsPerPage = function (itemsPerPage) {
    this._itemsPerPage = itemsPerPage;
};
ModernDataTable.prototype.setPaginationBtnQuantity = function (btnQuantity) {
    this._btnQuantity = btnQuantity;
};
ModernDataTable.prototype.setSearchValue = function (searchValue) {
    this._searchValue = searchValue;
};

ModernDataTable.prototype.showLoading = function () {
    this._tableSelector.parent().addClass('modernDataTableLoading')
};
ModernDataTable.prototype.hideLoading = function () {
    this._tableSelector.parent().removeClass('modernDataTableLoading')
};
ModernDataTable.prototype.createTableHead = function () {
    var self = this;

    if (self._tableSelector.find('thead').length === 0)
    {
        self._tableSelector.append('<thead><tr></tr></thead>');
    }

    if (self._showCheckBoxToSelectRow)
    {
        var checkboxSelectAllId = self._tableSelectorName + '_cbSelectAll';
        var checkboxSelectAll = '<th class="dataTableColSelect">'
            + '<div class="dataTableCheckBox">'
            + '<input id="' + checkboxSelectAllId
            + '" value="1" type="checkbox">'
            + '<label for="' + checkboxSelectAllId
            + '"></label>' + '</div>'
            + '</th>';
        self._tableSelector.find('thead tr').prepend(checkboxSelectAll);
    }
};
ModernDataTable.prototype.createTableBody = function () {
    var self = this;
    self._tableSelector.find('tbody').remove();
    self._tableSelector.append('<tbody></tbody>');
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
ModernDataTable.prototype.createCol = function (colContent, columnIdentity, cssClass, isEditable, idElement) {
    var css = '';
    var editable = '';
    var columnId = '';
    var elementId = '';
    if (cssClass)
    {
        css = 'class="' + cssClass + '"';
    }

    if (isEditable)
    {
        editable = 'contenteditable';
    }

    if (idElement)
    {
        elementId = 'id="' + idElement + '"';
    }

    if (columnIdentity)
    {
        columnId = 'data-identity="' + columnIdentity + '"';
    }
    return '<td ' + elementId + ' ' + css + ' ' + editable + ' ' + columnId + '>' + colContent + '</td>'
};
ModernDataTable.prototype.createColSelect = function (id) {
    var self = this;

    var colContent =
        '<div class="dataTableCheckBox">' +
        '<input value="0" type="checkbox" id="' + id + '"/>'
        + '<label for="' + id + '"></label></div>';

    return '<td class="dataTableColSelect">' + colContent + '</td>'
};
//metodo de render
ModernDataTable.prototype.draw = function () {
    var self = this;
    var data = self._data['data'];
    var dataLength = data.length;
    var rows = '';
    self._tableStruture = '';
    var i = 0;

    for (i; i < dataLength; i++)
    {
        var row = data[i];
        var cols = '';
        if (self._showCheckBoxToSelectRow)
        {
            cols += self.createColSelect(self._tableSelectorName + '_cb_' + i);
        }
        /*var definedColNames = self.getKeysFromJSON(self._columnsToDisplay);
        var autoColNames = Object.keys(row);
        var colsNames = definedColNames;*/

        for (var j = 0; j < self._columnsToDisplay.length; j++)
        {
            var tdClassName = self._columnsToDisplay[j]['class'];
            var tdType = self._columnsToDisplay[j]['type'];
            var tdFlag = self._columnsToDisplay[j]['flag'];
            var tdEditable = self._columnsToDisplay[j]['editable'];
            var key = self._columnsToDisplay[j]['key'];
            var renderCallback = self._columnsToDisplay[j]['render'];
            var tdContent = '';
            var columnIdentity = key;

            //executa o callback de render da td se ouver um
            if (typeof renderCallback === "function")
            {
                tdContent = renderCallback(row);
            }
            //verifica se tem um ponto na key dos dados se
            //existir pegue os dados seguindo a arvore
            else if (key.indexOf('.') > -1)
            {
                var fields = key.split('.');
                tdContent = row[fields[0]][fields[1]];
            }
            else
            {
                tdContent = row[key];
            }

            var isTdEditable = false;

            if (self._isColsEditable && tdEditable !== 'false')
            {
                isTdEditable = true;
            }

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
                        tdContent = tdContent ? 'Sim' : 'Não';
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
                cols += self.createCol(tdContent, columnIdentity, tdClassName, isTdEditable, self._tableSelectorName + '_td_' + j + '_' + i);

            }
        }
        rows += self.createRow(cols, i);

        if (self._itemsPerPage === i + 1)
        {
            break;
        }
    }
    self._tableStruture += rows;
    self._tableSelector.find('tbody').html(self._tableStruture);
};
//obtem os dados de uma determinada tr
ModernDataTable.prototype.getDataByTr = function (trElement) {
    var self = this;
    var dataIndex = $(trElement).attr('data-index');
    return self._data["data"][dataIndex];
};
//obtem o id dos dados de uma determinada tr
ModernDataTable.prototype.getDataIdByTr = function (trElement) {
    var self = this;
    var dataIndex = $(trElement).attr('data-index');
    return self._data["data"][dataIndex]['id'];
};
//INTERNAL EVENTS
ModernDataTable.prototype.events = function () {
    var self = this;
    //evento acionado quando clica em uma tr e dispara o callback
    self._tableSelector.on('click', 'tbody tr td', function (e) {
        var tr = $(this).closest('tr');
        if (e.target !== e.currentTarget)
        {
            return;
        }
        if ($(e.target).hasClass('dataTableColSelect'))
        {
            return;
        }
        if (typeof self._onClickFunction === "function")
        {
            self._onClickFunction(self.getDataByTr(tr));
        }
    });
    //evento quando digita algo nas celulas e salva na variavel data
    self._tableSelector.on('input', 'tbody tr td', function () {
        /*if (self._saveCellEdits)
        {
            var td = $(this);
            var index = td.closest('tr').attr('data-index');
            var celData = td.text();
            var columnIdentity = td.attr('data-identity');
            self._data["data"][index][columnIdentity] = celData;
        }*/
    });
    self._tableSelector.on("DOMSubtreeModified propertychange", 'tbody tr td', function () {

        var td = $(this);
        var index = td.closest('tr').attr('data-index');
        var celData = td.text();
        var columnIdentity = td.attr('data-identity');
        var dataContent = td.attr("data-content");

        self._data["data"][index][columnIdentity] = celData;
        if (typeof dataContent !== typeof undefined)
        {
            self._data["data"][index][columnIdentity + '---Content'] = dataContent;
        }

    });
    //event Select All Rows
    self._tableSelector.off('click', 'thead tr input[type="checkbox"]');
    self._tableSelector.on('click', 'thead tr input[type="checkbox"]', function () {
        //se tiver marcado
        if (this.checked)
        {
            self._tableSelector.find('tbody tr .dataTableColSelect input[type="checkbox"]').each(function (index) {
                var checkbox = $(this);
                checkbox.prop('checked', true);
                var tr = checkbox.closest('tr');

                self._dataIndexesOfRowsSelected = [];
                var dataIndex = parseInt(tr.attr('data-index'));
                self._dataIndexesOfRowsSelected.push(dataIndex);

                self._selectedRowsDataIds = [];
                var correntDataId = self._data['data'][dataIndex][self._primaryKey];
                self._selectedRowsDataIds.push(correntDataId)
            });
        }
        //se tiver desmarcado
        if (!this.checked)
        {
            self._tableSelector.find('tbody tr .dataTableColSelect input[type="checkbox"]').each(function (i) {
                var checkbox = $(this);
                checkbox.prop('checked', false);
            });
            self._dataIndexesOfRowsSelected = [];
            self._selectedRowsDataIds = [];
        }
    });
    //event Select One Row
    self._tableSelector.off('click', 'tbody tr input[type="checkbox"]');
    self._tableSelector.on('click', 'tbody tr input[type="checkbox"]', function (e) {
        var checkbox = $(this);
        var tr = checkbox.closest('tr');
        var dataIndex = parseInt(tr.attr('data-index'));
        //verifica se o indice atual ja existe no array de indices
        var existingIndex = arrayContainsThisNumber(self._dataIndexesOfRowsSelected, dataIndex);

        var correntDataId = self._data['data'][dataIndex][self._primaryKey];
        var existingIdIndex = arrayContainsThisNumber(self._selectedRowsDataIds, correntDataId);

        //seta o checkbox para marcado valor 1 ou desmarcado valor 0
        var valor = parseInt(checkbox.val()) === 0 ? 1 : 0;
        checkbox.val(valor);
        //se o checkbox estivar valor 1 e o indice atual não exisir no array de indices ou seja -1
        //armazena o indice atual no array de indices
        if (parseInt(checkbox.val()) === 1 && existingIndex === -1)
        {
            self._dataIndexesOfRowsSelected.push(dataIndex);
            self._selectedRowsDataIds.push(correntDataId);
        }
        else if (parseInt(checkbox.val()) === 0 && existingIndex !== -1)
        {
            self._dataIndexesOfRowsSelected.splice(existingIndex, 1);
            self._selectedRowsDataIds.splice(existingIdIndex, 1);
        }
    });
    //events of pagination
    $(document).on('click', '#' + self._tableSelectorName + '_previous', function (e) {
        self.prevPage();
    });
    $(document).on('click', '#' + self._tableSelectorName + '_next', function (e) {
        self.nextPage();
    });
    $(document).on('click', '#' +self._tableSelectorName + '_paginate .dataTableBtnPagination', function(){
        self._currentPage = parseInt( $(this).text() );
        self.changePage(self._currentPage);
    });

    //EVENTS OF ACTIONS
    //event add item
    $(document).off('click', '#' + self._tableSelectorName + '_btnAdd');
    $(document).on('click', '#' + self._tableSelectorName + '_btnAdd', function (e) {
        if (typeof self._onAddItemAction === "function")
        {
            self._onAddItemAction();
        }
    });
    //event reload
    $(document).off('click', '#' + self._tableSelectorName + '_btnUpdate');
    $(document).on('click', '#' + self._tableSelectorName + '_btnUpdate', function (e) {
        self.reload();
    });
    //event deleta item
    $(document).off('click', '#' + self._tableSelectorName + '_btnDelete');
    $(document).on('click', '#' + self._tableSelectorName + '_btnDelete', function (e) {
        if (typeof self._onDeleteItemAction === "function")
        {
            self._onDeleteItemAction(self._selectedRowsDataIds);
        }
        //self.deleteRowsSelected();
    });

    //event hide or show search box
    $(document).off('click', '#' + self._tableSelectorName + '_btnSearch');
    $(document).on('click', '#' + self._tableSelectorName + '_btnSearch', function (e) {
        if (self._showSearchBox)
        {
            self._showSearchBox = false;
            $(document).find('#' + self._tableSelectorName + '_inputSearch').closest('.dataTableSearchField').fadeOut();
        }
        else
        {
            $(document).find('#' + self._tableSelectorName + '_inputSearch').closest('.dataTableSearchField').fadeIn();
            self._showSearchBox = true;
        }

    });

    //event of search on server side
    $(document).off('keyup', '#' + self._tableSelectorName + '_inputSearch');
    $(document).on('keyup', '#' + self._tableSelectorName + '_inputSearch', function (e) {
        self._searchValue = this.value;
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
    self._tableFooter = $('<div class="dataTableFooter"></div>');
    self._tableFooter.insertAfter(self._tableSelector)
};
ModernDataTable.prototype.drawTableHeader = function () {
    var self = this;

    var btnAdd = self._showActionBtnAdd ? '<a href="#" id="' + self._tableSelectorName + '_btnAdd' + '"  class="dataTableActionBtn"><i class="dataTableBtnAdd"></i></a>' : '';
    var btnUpdate = self._showActionBtnUpdate ? '<a href="#" id="' + self._tableSelectorName + '_btnUpdate' + '"  class="dataTableActionBtn"><i class="dataTableBtnUpdate"></i></a>' : '';
    var btnDelete = self._showActionBtnDelete ? '<a href="#" id="' + self._tableSelectorName + '_btnDelete' + '" class="dataTableActionBtn"><i class="dataTableBtnDelete"></i></a>' : '';
    var btnSearch = self._showActionBtnSearch ? '<a href="#" id="' + self._tableSelectorName + '_btnSearch' + '" class="dataTableActionBtn"><i class="dataTableBtnSearch"></i></a>' : '';

    var inputSearch = self._showSearchBox ? '<div class="dataTableSearchField"><label>Pesquisar</label><input maxlength="40" id="' + self._tableSelectorName + '_inputSearch" type="text"><i></i></div>' : '';
    var tableActions = self._showActionBox ? '<div class="dataTableActions">' + btnAdd + btnUpdate + btnDelete + btnSearch + '</div>' : '';

    self._tableSelector.prev('.table-header').remove();
    self._tableHeader = $('<div class="dataTableHeader">' + inputSearch + tableActions + '</div>');
    self._tableHeader.insertBefore(self._tableSelector);
};
//PAGINATION FUNCTIONS
ModernDataTable.prototype.drawPagination = function () {
    var self = this;

    //quantidade total de paginas
    var totalPages = self.numPages();

    var btnQuantity =  self._btnQuantity > totalPages ? totalPages : self._btnQuantity;//quantidade de botões de paginação exibidos

    var currentPage = self._currentPage;//pagina atual
    if(btnQuantity === 1){
        return;
    }

    if (self._showPaginate)
    {
        var prevButton = '<li>'
            + '<a href="#" id="' + self._tableSelectorName + '_previous">'
            + '<i class="dataTableBtnPrevious"></i>' + '</a>' + '</li>';
        if (currentPage===1) prevButton = prevButton.replace('<li>', '<li class="disabled">');

        var nextButton = '<li>'
            + '<a href="#" id="'+ self._tableSelectorName + '_next">'
            + '<i class="dataTableBtnNext"></i>' + '</a>' + '</li>';
        if (currentPage===totalPages) nextButton = nextButton.replace('<li>', '<li class="disabled">');

        self._paginationContainer = $('<div class="dataTablePaginationContainer" id="'+ self._tableSelectorName + '_paginate">'
            + '<ul class=""></ul></div>');

        self._paginationContainer.children('ul').append(prevButton);

        var idx,loopEnd,itemClass = "";
        switch (self._paginationStyle) {
            case ModernDataTable.CAROULSEL:
                idx = currentPage - parseInt(btnQuantity/2);
                if (idx <= 0) idx = 1;
                loopEnd = idx + btnQuantity;
                if (loopEnd > totalPages) {
                    loopEnd = totalPages+1;
                    idx = loopEnd - btnQuantity;
                }
                while (idx < loopEnd) {
                    itemClass = idx===currentPage ? ' class="active" ' : '';
                    self._paginationContainer.children('ul').append('<li'+ itemClass +'><a class="dataTableBtnPagination">'+ idx +'</a></li>');
                    idx++;
                }
                break;
            case ModernDataTable.CUBE:
                var facePosition = (currentPage%btnQuantity)===0 ? btnQuantity : currentPage%btnQuantity;
                loopEnd = btnQuantity-facePosition+currentPage;
                idx = currentPage-facePosition;
                while (idx < loopEnd) {
                    idx++;
                    if (idx <= totalPages) {
                        itemClass = idx===currentPage ? ' class="active" ' : '';
                        self._paginationContainer.children('ul').append('<li'+ itemClass +'><a class="dataTableBtnPagination">'+ idx +'</a></li>');
                    }
                }
                break;
        }

        self._paginationContainer.children('ul').append(nextButton);

        self._tableFooter.empty();
        self._tableFooter.append(self._paginationContainer);

    }
};

ModernDataTable.prototype.prevPage = function () {
    var self = this;
    if (self._currentPage > 1)
    {
        self._currentPage--;
        self.changePage(self._currentPage);
    }
};
ModernDataTable.prototype.nextPage = function () {
    var self = this;
    if (self._currentPage < self.numPages())
    {
        self._currentPage++;
        self.changePage(self._currentPage);
    }
};
ModernDataTable.prototype.changePage = function (page) {
    var self = this;
    self.getDataFromURL();
    if (typeof self._onChangePage === "function")
    {
        self._onChangePage(self._currentPage);
    }
};
ModernDataTable.prototype.numPages = function () {
    var self = this;
    return Math.ceil(self._recordsFiltered / self._itemsPerPage);
};
// varrea a arvore
ModernDataTable.prototype.treeValue = function (item, atributo) {
    var self = this;
    if (atributo.indexOf('.') === -1)
    {
        return item[atributo];
    }
    var fields = atributo.split('.');
    var newItem = item[fields[0]];
    return self.treeValue(newItem, atributo.substring(atributo.indexOf('.') + 1));
};
