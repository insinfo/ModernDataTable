function CustomModal(idModal){
    this.idModal = '#' + idModal;
    this.modal = $(this.idModal);
    this.modalContent = this.modal.find('.customModalContent');
    this.modalContent.hide();
    this.closeBtns = this.modal.find('.customModalCloseBtn');
    this.init();
}
CustomModal.prototype.init = function () {
    //registra evento de fechamento do modal para elementos com a class customModalCloseBtn
    this.btnCloseOnClick();
};
CustomModal.prototype.close = function () {
    //this.modal.style.display = "none";
    this.modalContent.slideUp("fast");
    this.modal.fadeOut("fast");
};
CustomModal.prototype.open = function () {
    var self = this;
    //this.modal.style.display = "block";
    this.modal.fadeIn("fast");
    this.modalContent.slideDown("fast");
    this.modal.on('click', function (e) {
        if (e.target !== this)
        {
            return;
        }
        self.close();
    });

    //rola a barra de rolagem do elemnto pai se existir
    /* var elementoPaiRolavel = this.scrollParent(this.modal);
     if (elementoPaiRolavel)
     {
         elementoPaiRolavel.animate({scrollTop: 0}, 200);
     }*/
};
CustomModal.prototype.btnCloseOnClick = function () {
    var self = this;
    for (var i = 0; i < self.closeBtns.length; i++)
    {
        self.closeBtns[i].onclick = function () {
            self.close();
        }
    }
};
//pega o elemento pai mais proximo com barra de rolagem
CustomModal.prototype.scrollParent = function (element) {
    var overflowRegex = /(auto|scroll)/;
    var position = element.css("position");
    var excludeStaticParent = position === "absolute";

    var scrollParent = element.parents().filter(function () {
        var parent = $(this);
        if (excludeStaticParent && parent.css("position") === "static")
        {
            return false;
        }
        var overflowState = parent.css(["overflow", "overflowX", "overflowY"]);
        return (overflowRegex).test(overflowState.overflow + overflowState.overflowX + overflowState.overflowY);
    }).eq(0);

    return position === "fixed" || !scrollParent.length ? $(this[0].ownerDocument || document) : scrollParent;
};