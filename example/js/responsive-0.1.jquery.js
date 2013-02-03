;(function( $ ){

    /*

    jQuery Plugin Name : Responsive
    Author : Stephane Guigne (http://stephaneguigne.com)
    Version : 0.1
    Github : https://github.com/guins/jquery-responsive

    TO DO : 
        - IE Tests
        - Some changes for ajax websites with dynamic injection of contextual content
    
    Description : 
    jQuery Plugin that adds Responsive behavior to your html page
    
    Define breakpoints and device names for each screen size and an event will be triggered each time your screen is resized on a different device.
    If the "autoHideShow" parameter is set to true (default setup), the plugin will hide or show contextual contents.
    See below the full list of options

    SETUP Example, the simplest :
        $('body').responsive();

    RMQ : Initialize the plugin on the 'body' element if you want the whole page to be responsive. But you can restrain the scope according to your needs. 
    For example : 
        $('#my_div').responsive();

    SETUP Example, with all options :
        $('body').responsive({
            breakpoints     : [640,960],            // array of breakpoints
            devices         : ['mob','tab','desk'], // array of device names, corresponding to breakpoint intervals (should be 1 more than the number of breakpoints!)
            attrSelector    : 'data-responsive',    // attributes of all DOM elmts where the responsive data is stocked (not mandatory a data element can be the class attr)
            autoHideShow    : true                  // (boolean) Allow or not the plugin to hide and show contextual contents
            displayModel    : 'exclusive',          // method to choose whether to show or hide a content for a specific device (can be 'exclusive' or 'excluding')
            excludedPrefix  : 'not-',               // (used when displayModel=='excluded') for example, in this case, all elmts with attr data-responsive="not-mob" will be hidden on 'mob' devices
            exclusifSufix   : '-only',              // (used when displayModel=='exclusive') for example, in this case, only elmts with attr data-responsive="desk-only" will be shown on 'desk' devices
            onDeviceChange  : function( event )     // callback 'on device change'
            {
               switch(event.deviceName){
                    case 'mob':
                        //_optimizeForMobile();
                        break;
                    case 'tab':
                        //_optimizeForTablet();
                        break;
                    default :
                        //_optimizeForDesktop();
                    break;
                } 
            }      
        });

    ANY TIME in your code (before setting up the plugin if you want the first resize event) : 
        $(window).on('onDeviceChange', function(event) {
            // do what you want
            // retrieve the device name in event.deviceName
        });

    */

    var _isInit = false,
        defaults = {
            breakpoints         : [640,960],
            devices             : ['mob','tab','desk'],
            attrSelector        : 'data-responsive',
            autoHideShow        : true,
            displayModel          : 'exclusive',
            exclusifSufix       : '-only',
            excludedPrefix      : 'not-',
            // ajaxWebsite         : false,
            onDeviceChange      : null
        },
        settings = {
            EXCLUSIVE       : 'exclusive',
            EXCLUDING       : 'excluding',
            currentDevice   : null,
            dom             : {}
        };
            
    var methods = {
        /*
            Initialisation of the plugin

            Extend settings and store all contextual contents to avoid DOM tree manipulation.
        */
        init : function( options ) 
        {
            return this.each(function()
            {
                var _s,
                    self = this,
                    $this = $(this),
                    data = $this.data('responsive');

                if ( !data ) 
                {
                    var allElmtsSlector = "";

                    _s = $.extend({},defaults,options,settings);
                    _s.nbBreakpoints = _s.breakpoints.length;
                    _s.nbDevices = _s.devices.length;
                    
                    // Store contextual contents in different objects for each specific device
                    for(var i=0; i<_s.nbDevices; i++) 
                    {
                        var deviceNane = _s.devices[i],
                            elmtsClassName = _s.displayModel == _s.EXCLUSIVE ? 
                                _s.devices[i] + _s.exclusifSufix :
                                _s.excludedPrefix + _s.devices[i],
                            elmtsSelector = _s.attrSelector == 'class' ? elmtsClassName : 
                                '['+_s.attrSelector+'='+elmtsClassName+']';
                            $elmts = $(elmtsSelector, $this);

                        allElmtsSlector += (allElmtsSlector ? ', ' : '') + elmtsSelector; 
                        _s.dom[deviceNane] = $elmts;
                    }

                    // Store All contextual contents
                    _s.dom.$allContextualElmts = $(allElmtsSlector, $this);
                    
                    // Store the current 'display' css property
                    // Avoid to display a 'hidden' element
                    _s.dom.$allContextualElmts.each(function()
                    {
                        var $elmt = $(this),
                            displayType = $elmt.css('display');

                        if(displayType && displayType!=="")
                            $elmt.data('responsive',{displayType: displayType});
                    });

                    // Store settings in data
                    $this.data('responsive', { settings : _s }); 

                    // Add events
                    $(window).
                        on('resize.responsive', function(event){
                            _methods.onResize.call(self, event);
                        }).
                        trigger('resize');

                    _isInit = true;
                }
            });
        },
         /*
            Destroy all events and data of the plugin
        */
        destroy : function() 
        {
            return this.each(function()
            {
                var $this = $(this),
                    data = $this.data('responsive'),
                    _s = data.settings;

                _methods.showContents.call(this, _s.dom.$allContextualElmts);

                $(window).unbind('.responsive');
                $this.removeData('responsive');
            });
        }
    };

    var _methods = {
        /*
            Check if the screen size changes on another device
            @param event [jQuery Event] : resize event

            Trigger a special event 'onDeviceChange' on the window element if the device changes
        */
        onResize : function( event )
        {
            var data = $(this).data('responsive'),
                _s = data.settings,
                deviceName = _methods.getDeviceSize.call(this);

            if(!event || deviceName != _s.currentDevice) 
            {
                _s.currentDevice = deviceName;
                $(this).attr(_s.rootAttr, deviceName);
                _methods.displayContextualContents.call(this);
                $(window).trigger({type: 'onDeviceChange', deviceName: deviceName });
                if (_s.onDeviceChange)
                    _s.onDeviceChange({ deviceName : deviceName });
            }
        },
        /*
            Get the current device size
            @return [String] : name of the device (depending on the settings)
        */
        getDeviceSize : function()
        {
            var data = $(this).data('responsive'),
                _s = data.settings,
                wW = $(window).width(); 

            for(var i=0; i<_s.nbBreakpoints; i++) {
                if(wW<_s.breakpoints[i])
                    return _s.devices[i];
            }
            return _s.devices[_s.nbDevices-1];
        },
        /*
            Manage whether to show or hide each contextual content
            Depending on the 'displayMethod' setting 
        */
        displayContextualContents : function()
        {
            var data = $(this).data('responsive'),
                _s = data.settings;

            if(_s.displayModel == _s.EXCLUSIVE) {
                _s.dom.$allContextualElmts.hide();
                _methods.showContents.call(this, _s.dom[_s.currentDevice]);
            }
            else if (_s.displayModel == _s.EXCLUDING){
                _methods.showContents.call(this, _s.dom.$allContextualElmts);
                _s.dom[_s.currentDevice].hide();
            }
        },
        /*
            Show the contextual contents
            @param $elmts [jQuery Object] : elements to show
        */
        showContents : function( $elmts )
        {
            $elmts.each(function(){
                var $elmt = $(this),
                    data = $elmt.data('responsive');
                $elmt.css('display', data && data.displayType ? data.displayType :''); 
            });
        }
    };

    $.fn.responsive = function( method ) {

        if(_isInit)
            $.error( 'jQuery.responsive is already initialized!' );
        else if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            return this;
        }    
    };

})( jQuery );