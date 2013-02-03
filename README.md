# Responsive jQuery Plugin (Version 0.1)

A simple plugin that adds Responsive behavior to your html page

Define breakpoints and device names for each screen size and an event will be triggered each time your screen is resized on a different device.
If the "autoHideShow" parameter is set to true (default setup), the plugin will hide or show contextual contents.
See below the full list of options

TO DO : 
    - IE Tests
    - Some changes for ajax websites with dynamic injection of contextual content

## Examples

Here is a basic exemple

	// minimum
	$('body').responsive();

RMQ : Initialize the plugin on the 'body' element if you want the whole page to be responsive. But you can restrain the scope according to your needs. 
For example : $('#my_div').responsive();


ANY TIME in your code (before setting up the plugin if you want the first resize event) : 
    
    $(window).on('onDeviceChange', function(event) {
        // do what you want
        // retrieve the device name in event.deviceName
    });


Here is a full options exemple

	// full options
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


## Cross-browser Compatibility

Chrome/Firefox/Safari


## License

Feel free to use it, just leave my copyright.

Copyright (c) 2013 [Stéphane Guigné](http://stephaneguigne.com)