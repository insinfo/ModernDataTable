function CustomLoading(idLoading)
{
    this.loading = $('#' + 'loading');
    if (idLoading)
    {
        this.loading = $('#' + idLoading);
    }
    this.processing = false;
}

CustomLoading.prototype.show = function () {
    this.processing = true;

    // loading.css('display', 'block');
    this.loading.fadeIn(500);

};
CustomLoading.prototype.hide = function () {
    this.processing = false;
    // loading.css('display', 'none');
    this.loading.fadeOut(500);
};
CustomLoading.prototype.isProcessing = function () {
    return this.processing;
};