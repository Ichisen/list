/**
 * Created by Ichisen-PC on 21.02.2016.
 */

var NS = window;

NS.Factory = function(comConstructors, tplEngine) {
    this.comConstructors_ = comConstructors;
    this.tplEngine_ = tplEngine;
};

NS.Factory.prototype._getComponentConstructorForName = function(name) {
    for(var i = 0; i < this.comConstructors_.length; i++ ) {
        if( this.comConstructors_[i].name == name ) return this.comConstructors_[i]
    }

    return undefined;
};

NS.Factory.prototype.create = function(componentName, config) {
    var ComponentConstructor = this._getComponentConstructorForName(componentName);

    return ComponentConstructor.create(config, this.tplEngine_);
};

