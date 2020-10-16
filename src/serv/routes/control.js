var urlHelper = require('./../utils/url'),
    robot = require('./../modules/robot/robot')();

module.exports = function(req, res){
    res.send('"Hello World!"');
    
    var _action = urlHelper.parseUrlParams(req.url);

    console.log(_action.type);

    switch(_action.type){
        case 'rtap': 
            robot.rtap();
        break;
        case 'tap': 
            robot.tap();
        break;
        case 'dtap': 
            robot.dtap();
        break;
        default: 
            console.warn('unknown control type');
    }
};