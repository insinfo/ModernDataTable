/**
 * Created by Isaque Neves Sant Ana.
 * Version: 1.0.0
 * Date: 17/01/2018
 * Time: 11:46
 */

/******* FUNÇÕES UTILITARIOS ********/
//evento Impede digitação de letras no input com evento
function preventsLetter(dom)
{
    $(dom).on('keydown', function (evt) {
        //evt = evt || window.event;
        var keyCode = evt.which;//(evt.keyCode ? evt.keyCode :evt.which);
        if (!(keyCode > 95 && keyCode < 106 || keyCode == 8 || keyCode == 46 || keyCode == 38))
        {
            evt.preventDefault();
        }
    });
}

//função Impede digitação de letras no input sem evento
function preventsLetter2(evt)
{
    //evt = evt || window.event;
    var keyCode = evt.which;//(evt.keyCode ? evt.keyCode :evt.which);
    if (!(keyCode > 95 && keyCode < 106 || keyCode == 8 || keyCode == 46 || keyCode == 38))
    {
        evt.preventDefault();
    }
}

//Impede digitação de numeros no input
function preventsNumber(dom)
{
    $(dom).on('keydown', function (evt) {
        var keyCode = (evt.keyCode ? evt.keyCode : evt.which);
        if ((keyCode > 95 ))
        {
            evt.preventDefault();
        }
    });
}

//Detecta se digitou numero no input
function detectaNumero(dom, callBack)
{
    dom.on('input', function (e) {
        if (/[0-9]/g.test(this.value))
        {
            callBack();
        }
    });
}

//prenche os selects
function populateSelect(jquerySelect, data, key, value, selected)
{
    jquerySelect.empty();
    for (var j = 0; j < data.length; j++)
    {
        var id = data[j][key];
        var name = data[j][value];
        var option = '<option value="' + id + '">' + smartCapitalize(name) + '</option>';
        if (name.toLowerCase() == selected.toLowerCase())
        {
            option = '<option value="' + id + '" selected>' + smartCapitalize(name) + '</option>';
        }
        jquerySelect.append(option);
    }
}

//Coloca maiuscula a primeira letra com pronome
function capitalize(str)
{
    str.toLowerCase().replace(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g, function (letter) {
        return letter.toUpperCase();
    });
    return (str);
}

//Coloca maiuscula a primeira letra sem pronome
function smartCapitalize(text)
{
    var loweredText = text.toLowerCase();
    var words = loweredText.split(" ");
    for (var a = 0; a < words.length; a++)
    {
        var w = words[a];

        var firstLetter = w[0];

        if (w.length > 2)
        {
            w = firstLetter.toUpperCase() + w.slice(1);
        }
        else
        {
            w = firstLetter + w.slice(1);
        }

        words[a] = w;
    }
    return words.join(" ");
}

function converterEstados(val)
{
    var data;

    switch (val)
    {
        /* UFs */
        case "AC" :
            data = "Acre";
            break;
        case "AL" :
            data = "Alagoas";
            break;
        case "AM" :
            data = "Amazonas";
            break;
        case "AP" :
            data = "Amapá";
            break;
        case "BA" :
            data = "Bahia";
            break;
        case "CE" :
            data = "Ceará";
            break;
        case "DF" :
            data = "Distrito Federal";
            break;
        case "ES" :
            data = "Espírito Santo";
            break;
        case "GO" :
            data = "Goiás";
            break;
        case "MA" :
            data = "Maranhão";
            break;
        case "MG" :
            data = "Minas Gerais";
            break;
        case "MS" :
            data = "Mato Grosso do Sul";
            break;
        case "MT" :
            data = "Mato Grosso";
            break;
        case "PA" :
            data = "Pará";
            break;
        case "PB" :
            data = "Paraíba";
            break;
        case "PE" :
            data = "Pernambuco";
            break;
        case "PI" :
            data = "Piauí";
            break;
        case "PR" :
            data = "Paraná";
            break;
        case "RJ" :
            data = "Rio de Janeiro";
            break;
        case "RN" :
            data = "Rio Grande do Norte";
            break;
        case "RO" :
            data = "Rondônia";
            break;
        case "RR" :
            data = "Roraima";
            break;
        case "RS" :
            data = "Rio Grande do Sul";
            break;
        case "SC" :
            data = "Santa Catarina";
            break;
        case "SE" :
            data = "Sergipe";
            break;
        case "SP" :
            data = "São Paulo";
            break;
        case "TO" :
            data = "Tocantíns";
            break;

        /* Estados */
        case "Acre" :
            data = "AC";
            break;
        case "Alagoas" :
            data = "AL";
            break;
        case "Amazonas" :
            data = "AM";
            break;
        case "Amapá" :
            data = "AP";
            break;
        case "Bahia" :
            data = "BA";
            break;
        case "Ceará" :
            data = "CE";
            break;
        case "Distrito Federal" :
            data = "DF";
            break;
        case "Espírito Santo" :
            data = "ES";
            break;
        case "Goiás" :
            data = "GO";
            break;
        case "Maranhão" :
            data = "MA";
            break;
        case "Minas Gerais" :
            data = "MG";
            break;
        case "Mato Grosso do Sul" :
            data = "MS";
            break;
        case "Mato Grosso" :
            data = "MT";
            break;
        case "Pará" :
            data = "PA";
            break;
        case "Paraíba" :
            data = "PB";
            break;
        case "Pernambuco" :
            data = "PE";
            break;
        case "Piauí" :
            data = "PI";
            break;
        case "Paraná" :
            data = "PR";
            break;
        case "Rio de Janeiro" :
            data = "RJ";
            break;
        case "Rio Grande do Norte" :
            data = "RN";
            break;
        case "Rondônia" :
            data = "RO";
            break;
        case "Roraima" :
            data = "RR";
            break;
        case "Rio Grande do Sul" :
            data = "RS";
            break;
        case "Santa Catarina" :
            data = "SC";
            break;
        case "Sergipe" :
            data = "SE";
            break;
        case "São Paulo" :
            data = "SP";
            break;
        case "Tocantíns" :
            data = "TO";
            break;
    }

    return data;
}

//dispara evento
function eventFire(el, etype)
{
    if (el.fireEvent)
    {
        el.fireEvent('on' + etype);
    }
    else
    {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

//limpa a seleção de um Select
function clearSelected(select)
{
    if (select instanceof jQuery)
    {
        var optionsOffSelect = select[0].options;
        for (var j = 0; j < optionsOffSelect.length; j++)
        {
            optionsOffSelect[j].selected = false;
        }
    }
    else if (select instanceof HTMLCollection)
    {
        var elements = select.options;
        for (var i = 0; i < elements.length; i++)
        {
            elements[i].selected = false;
        }
    }
}

//verifica se um objeto é uma instancia de um elemento DOM
function isDomElem(obj)
{

    if (obj instanceof HTMLCollection && obj.length)
    {

        for (var a = 0, len = obj.length; a < len; a++)
        {
            if (!checkInstance(obj[a]))
            {
                return false;
            }
        }

        return true;

    }
    else
    {
        return checkInstance(obj);
    }

    function checkInstance(elem)
    {
        if ((elem instanceof jQuery && elem.length) || elem instanceof HTMLElement)
        {
            return true;
        }
        return false;
    }
}

/************* VALIDAÇÃO DE FORMULARIO *************/
//Validação
function validaCPF(numCpf)
{
    //remove a mascara
    var cpf = numCpf.replace(/[^\d]+/g, '');
    //Verifica se um número foi informado
    if (!cpf)
    {
        return false;
    }

    //Eliminapossivel mascara
    cpf.replace('[^0-9]', '');
    cpf.lpad('0', 11);
    //Verifica se o numero de digitos informados é iguala 11
    if (cpf.length != 11)
    {
        return false;
    }
    //Verifica se nenhuma das sequências invalidas abaixo
    //foi digitada+Caso afirmativo,retorna falso
    if (cpf == '00000000000' || cpf == '11111111111' || cpf == '22222222222' || cpf == '33333333333' || cpf == '44444444444' || cpf == '55555555555' || cpf == '66666666666' || cpf == '77777777777' || cpf == '88888888888' || cpf == '99999999999')
    {
        return false;
    }
    // Calcula os digitos verificadores para verificar se o
    // CPF é válido
    else
    {
        for (var t = 9; t < 11; t++)
        {
            for (var d = 0, c = 0; c < t; c++)
            {
                d += cpf[c] * ((t + 1) - c);
            }
            d = ((10 * d) % 11) % 10;
            if (cpf[c] != d)
            {
                return false;
            }
        }
        return true;
    }
}

function validaEmail(email)
{
    var nomeEmail = email.value.substring(0, email.value.indexOf("@"));
    var dominioEmail = email.value.substring(email.value.indexOf("@") + 1, email.value.length);

    if ((nomeEmail.length >= 1) && (dominioEmail.length >= 3) && (nomeEmail.search("@") == -1) && (dominioEmail.search("@") == -1) && (nomeEmail.search(" ") == -1) && (dominioEmail.search(" ") == -1) && (dominioEmail.search(".") != -1) && (dominioEmail.indexOf(".") >= 1) && (dominioEmail.lastIndexOf(".") < dominioEmail.length - 1))
    {
        //alert("E-mail valido");
    }
    else
    {
        alert("E-mail invalido");
    }
}

function isEmail(email)
{
    er = /^[a-zA-Z0-9][a-zA-Z0-9\._-]+@([a-zA-Z0-9\._-]+\.)[a-zA-Z-0-9]{2}/;

    if (er.exec(email))
    {
        return true;
    }
    else
    {
        return false;
    }
}

function validaData(data)
{
    if (data.length == 10)
    {
        var er = /(0[0-9]|[12][0-9]|3[01])[-\.\/](0[0-9]|1[012])[-\.\/][0-9]{4}/;

        if (er.exec(data))
        {
            return true;
        }
        else
        {
            return false;
        }

    }
    else
    {
        return false;
    }
}

function validaHora(hora)
{
    var er = /(0[0-9]|1[0-9]|2[0123]):[0-5][0-9]/;

    if (er.exec(hora))
    {
        return true;
    }
    else
    {
        return false;
    }
}

//faz um LEFT PAD de uma string
String.prototype.lpad = function (padString, length) {
    var str = this;
    while (str.length < length) str = padString + str;
    return str;
};

//converte data no formato SQL para o formato de data Brasileiro
function sqlDateToBrasilDate(input)
{
    var datePart = input.match(/\d+/g);
    var year = datePart[0];
    var month = datePart[1];
    var day = datePart[2];

    return day + '/' + month + '/' + year;
}

/** Remove itens duplicados de um array de objetos, passa 2
 * propriedades dos objetos para serem coparadas
 **/
function removeDuplicateItem(arr, prop1, prop2)
{
    return arr.reduce(function (p, c) {
        var key = [c[prop1], c[prop2]].join('|');

        if (p.temp.indexOf(key) === -1)
        {
            p.out.push(c);
            p.temp.push(key);
        }
        return p;
    }, {temp: [], out: []}).out;
}

/** obtem a primeira propriedade de um objeto**/
function firstProp(obj)
{
    //Object.keys(obj)[0]
    for (var key in obj) return obj[key]
}

//formata data do javascript ano-mes-dia para dia/mes/ano
function formatJsDateToBrasilDate(date)
{
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    return day + '/' + monthIndex + '/' + year;
}

//formata data do javascript  dia/mes/ano para ano-mes-dia
function formatBrasilDateToJsDate(stringDate)
{
    stringDate = stringDate.split('/');
    var day = stringDate[0];
    var monthIndex = stringDate[1];
    var year = stringDate[2];
    return year + '-' + monthIndex + '-' + day;
}

//função que adiciona ou remove todas os ids em um array quando check um checkbox de um datatable
//parametros: jquery instance de table, dataTable instance, array para armazenar os ids
function dataTableSelectAll(jqueryTableObject, dataTable, array)
{
    jqueryTableObject.off('click', 'thead tr input[type="checkbox"]');
    jqueryTableObject.on('click', 'thead tr input[type="checkbox"]', function () {
        if (this.checked)
        {
            jqueryTableObject.find('tbody tr input[type="checkbox"]').each(function (index) {
                var checkbox = $(this);
                checkbox.prop('checked', true);
                var tr = checkbox.closest('tr');
                var rowId = dataTable.row(tr).data()['id'];
                array.push(rowId);
            });
        }
        if (!this.checked)
        {
            jqueryTableObject.find('tbody tr input[type="checkbox"]').each(function (i) {
                var checkbox = $(this);
                checkbox.prop('checked', false);
                var rowId = dataTable.row(checkbox.closest('tr')).data()['id'];
                var index = $.inArray(rowId, array);
                array.splice(index, 1);
                array = [];
            });

        }
    });
}
//função que adiciona ou remove um id em um array quando check um checkbox de uma row de um dataTable
//parametros: jquery instance de table, dataTable instance, array para armazenar os ids
function dataTableSelect(jqueryTableObject, dataTable, array)
{
    jqueryTableObject.off('click', 'tbody tr input[type="checkbox"]');
    jqueryTableObject.on('click', 'tbody tr input[type="checkbox"]', function (e)
    {
        var checkbox = $(this);
        var tr = checkbox.closest('tr');
        var rowId = dataTable.row(tr).data()['id'];

        // Determine se o ID da linha está na lista de IDs de linhas selecionadas
        var index = $.inArray(rowId, array);
        // Se a caixa de seleção estiver marcada e a
        // identificação da linha não estiver na lista de IDs de linha selecionadas
        if (this.checked && index === -1)
        {
            array.push(rowId);
        }
        // Caso contrário, se a caixa de verificação não estiver marcada e
        // a identificação da linha estiver na lista das IDs de linha selecionadas
        else if (!this.checked && index !== -1)
        {
            array.splice(index, 1);
        }
        e.stopPropagation();
    });
}

//função para esvaziar um array
function emptyArray(array)
{
    array.forEach(function (element, index, arr) {
        array.splice(index, 1);
    });
}

//função limita a quatidade de caracteres de um input
function limitaInput(inputElem, maxLength)
{
    var input = $(inputElem);
    var nativeInputElem = input[0];
    if (nativeInputElem.value.length > maxLength)
    {
        nativeInputElem.value = nativeInputElem.value.slice(0, maxLength);
    }
}

//evento limita a quatidade de caracteres
function limitaInputEvent(inputElem, maxLength)
{
    var input = $(inputElem);
    var nativeInputElem = input[0];
    input.off('input');
    input.on('input', function () {
        if (nativeInputElem.value.length > maxLength)
        {
            nativeInputElem.value = nativeInputElem.value.slice(0, maxLength);
        }
    });
}

//Polyfill
//Para adicionar suporte Object.keys compatíveis em ambientes mais antigos
//que não têm suporte nativo para isso, copie o seguinte trecho:
// De https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys)
{
    Object.keys = (function () {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
            dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null))
            {
                throw new TypeError('Object.keys chamado de non-object');
            }

            var result = [], prop, i;

            for (prop in obj)
            {
                if (hasOwnProperty.call(obj, prop))
                {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug)
            {
                for (i = 0; i < dontEnumsLength; i++)
                {
                    if (hasOwnProperty.call(obj, dontEnums[i]))
                    {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
}

//extende um objeto compativel com internet explorer 8
function extend(obj, src)
{
    for (var key in src)
    {
        if (src.hasOwnProperty(key))
        {
            obj[key] = src[key];
        }
    }
    return obj;
}

//extende um objeto não compativel com internet explorer 8
function extend2(obj, src)
{
    Object.keys(src).forEach(function (key) {
        obj[key] = src[key];
    });
    return obj;
}

//function to remove any special characters from a string using Javascript
/*
1st regex /(?!\w|\s)./g remove any character that is not a word or whitespace. \w is equivalent to [A-Za-z0-9_]
2nd regex /\s+/g find any appearance of 1 or more whitespaces and replace it with one single white space
3rd regex /^(\s*)([\W\w]*)(\b\s*$)/g trim the string to remove any whitespace at the beginning or the end.

option 2
var str = "abc's test#s";
alert(str.replace(/[^a-zA-Z ]/g, ""));
*/
function removeSpecialChars(str)
{
    /*return str.replace(/(?!\w|\s)./g, '')
        .replace(/\s+/g, ' ')
        .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');*/
    return str.replace(/[^a-zA-Z]/g, "");
}

//IMPLEMENTAÇÃO DE UMA ESCUTA DE EVENTO PARA OUVIR MODIFICAÇÕES DO DOM
//COMPATIVEL COM IE 5.5+, FF 2+, Chrome, Safari 3+ and Opera 9.6+
/*
(function (window) {
    var last = +new Date();
    var delay = 100; // default delay

    // Manage event queue
    var stack = [];

    function callback() {
        var now = +new Date();
        if (now - last > delay) {
            for (var i = 0; i < stack.length; i++) {
                stack[i]();
            }
            last = now;
        }
    }

    // Public interface
    var onDomChange = function (fn, newdelay) {
        if (newdelay) delay = newdelay;
        stack.push(fn);
    };

    // Naive approach for compatibility
    function naive() {

        var last = document.getElementsByTagName('*');
        var lastlen = last.length;
        var timer = setTimeout(function check() {

            // get current state of the document
            var current = document.getElementsByTagName('*');
            var len = current.length;

            // if the length is different
            // it's fairly obvious
            if (len != lastlen) {
                // just make sure the loop finishes early
                last = [];
            }

            // go check every element in order
            for (var i = 0; i < len; i++) {
                if (current[i] !== last[i]) {
                    callback();
                    last = current;
                    lastlen = len;
                    break;
                }
            }

            // over, and over, and over again
            setTimeout(check, delay);

        }, delay);
    }

    //
    //  Check for mutation events support
    //

    var support = {};

    var el = document.documentElement;
    var remain = 3;

    // callback for the tests
    function decide() {
        if (support.DOMNodeInserted) {
            window.addEventListener("DOMContentLoaded", function () {
                if (support.DOMSubtreeModified) { // for FF 3+, Chrome
                    el.addEventListener('DOMSubtreeModified', callback, false);
                } else { // for FF 2, Safari, Opera 9.6+
                    el.addEventListener('DOMNodeInserted', callback, false);
                    el.addEventListener('DOMNodeRemoved', callback, false);
                }
            }, false);
        } else if (document.onpropertychange) { // for IE 5.5+
            document.onpropertychange = callback;
        } else { // fallback
            naive();
        }
    }

    // checks a particular event
    function test(event) {
        el.addEventListener(event, function fn() {
            support[event] = true;
            el.removeEventListener(event, fn, false);
            if (--remain === 0) decide();
        }, false);
    }

    // attach test events
    if (window.addEventListener) {
        test('DOMSubtreeModified');
        test('DOMNodeInserted');
        test('DOMNodeRemoved');
    } else {
        decide();
    }

    // do the dummy test
    var dummy = document.createElement("div");
    el.appendChild(dummy);
    el.removeChild(dummy);

    // expose
    window.onDomChange = onDomChange;
})(window);
 */
/*
//IMPLEMENTAÇÃO DE UMA ESCUTA DE EVENTO PARA OUVIR MODIFICAÇÕES DO DOM
//COMPATIVEL COM IE9+, FF, Webkit:
// Observe a specific DOM element:
onDOMChangeEvent( document.getElementById('dom_element') ,function(){
    console.log('dom changed');
});

var onDOMChangeEvent = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                    callback();
            });
            // have the observer observe foo for changes in children
            obs.observe( obj, { childList:true, subtree:true });
        }
        else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    };
})();

*/

//--------------Formatar td editavel do tipo MOEDA-------------//
function currencyFormatEditableElement(jqueryElement, milSep, decSep, e)
{
    jqueryElement = $(jqueryElement);
    var sep = 0;
    var key = '';
    var i = 0;
    var j = 0;
    var stringLength = 0;
    var len2 = 0;
    var strCheck = '0123456789';
    var aux = '';
    var aux2 = '';
    var whichCode = (window.Event) ? e.which : e.keyCode;

    //window.alert(whichCode);
    if ((whichCode == 8) || (whichCode == 13) || (whichCode == 0))
    {
        return true;  // Enter
    }
    key = String.fromCharCode(whichCode);  // Get key value from key code
    if (strCheck.indexOf(key) == -1)
    {
        return false;  // Not a valid key
    }

    stringLength = jqueryElement.text().length;
    var elementText = jqueryElement.text();
    for (i = 0; i < stringLength; i++)
    {
        if ((elementText.charAt(i) != '0') && (elementText.charAt(i) != decSep))
        {
            break;
        }
    }

    aux = '';
    for (; i < stringLength; i++)
    {
        if (strCheck.indexOf(elementText.charAt(i)) != -1)
        {
            aux += elementText.charAt(i);
        }
    }
    aux += key;

    stringLength = aux.length;
    if (stringLength == 0)
    {
        jqueryElement.text('')
    }
    else if (stringLength == 1)
    {
        jqueryElement.text('0' + decSep + '0' + aux);
    }
    else if (stringLength == 2)
    {
        jqueryElement.text('0' + decSep + aux);
    }
    else if (stringLength > 2)
    {
        aux2 = '';

        for (j = 0, i = stringLength - 3; i >= 0; i--)
        {
            if (j == 3)
            {
                aux2 += milSep;
                j = 0;
            }
            aux2 += aux.charAt(i);
            j++;
        }
        jqueryElement.text('');
        len2 = aux2.length;
        for (i = len2 - 1; i >= 0; i--)
        {
            var val = jqueryElement.text();
            val += aux2.charAt(i);
            jqueryElement.text(val);
        }
        val = jqueryElement.text();
        val += decSep + aux.substr(stringLength - 2, stringLength);
        jqueryElement.text(val);
    }
    return false;
}

//verifica se um array contem um determinado numero
function arrayContainsThisNumber(arrayOfIntegers, number)
{
    for (var i = 0; i <= arrayOfIntegers.length; i++)
    {
        if (number === arrayOfIntegers[i])
        {
            return i;
        }
    }
    return -1;
}

//checa se um objeto esta vazio {} = true
function isEmptyObject(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    //return JSON.stringify(obj) === JSON.stringify({});
    return true;
}
//polyfill para redirecionamento de URL
// Internet Explorer 8 or lower
function redirect(url) {
    var ua = navigator.userAgent.toLowerCase(), isIE = ua.indexOf('msie') !== -1,
        version = parseInt(ua.substr(4, 2), 10);

    // Internet Explorer 8 and lower
    if (isIE && version < 9) {
        var link = document.createElement('a');
        link.href = url;
        document.body.appendChild(link);
        link.click();
    }

    // All other browsers can use the standard window.location.href (they don't lose HTTP_REFERER like Internet Explorer 8 & lower does)
    else {
        window.location.href = url;
    }
}

// Função para retornar iniciais de um nome passado
function retornarIniciais(pNome) {
    var iniciais;
    var nomes = pNome.split(' ');
    if (nomes.length>1) iniciais = nomes[0].charAt(0).toUpperCase() + nomes[nomes.length-1].charAt(0).toUpperCase();
    else iniciais = nomes[0].substr(0,2).toUpperCase();
    return iniciais;
}

// gera um hash de uma string // java String#hashCode
function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}
//convert um int para color hex
function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return '#'+"00000".substring(0, 6 - c.length) + c;
}
function stringToColour(stringIn)
{
    return intToRGB(hashCode(stringIn));
}
//converte "R$ 50,00" tipo moeda brasileiro para float
function brCurrencyToFloat(brasilCorrency)
{
    var data = brasilCorrency != null ? brasilCorrency : '0';
    data = data.replace(',',".");
    return parseFloat(data.replace(/[R$]+/g,""));
}
function findValueInArray(key,value, array)
{
    for(var i=0; i < array.length;i++)
    {
        if(array[i][key] === value)
        {
            return array[i];
        }
    }
    return null;
}
