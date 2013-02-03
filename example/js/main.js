$('body').responsive({
    // displayModel : 'excluding',
    onDeviceChange : function(event){
       switch(event.deviceName){
            case 'mob':
                _optimizeForMobile();
                break;
            case 'tab':
                _optimizeForTablet();
                break;
            default :
                _optimizeForDesktop();
            break;
        } 
    }
});

function _optimizeForMobile(){
    // console.log('_optimizeForMobile');
}

function _optimizeForTablet(){
    // console.log('_optimizeForTablet');
}

function _optimizeForDesktop(){
    // console.log('_optimizeForDesktop');
}

$(window).on('onDeviceChange', function(event) {
    // console.log('special behavior');
});