/**
 * Created by Ichisen-PC on 21.02.2016.
 */

var NS = window;
!NS.Components &&( NS.Components = {} );
NS = NS.Components;

NS.List = {
    name: 'List',
    create: function(config, tplEngine) {
        return new this.Instance({
            tplEngine: tplEngine,
            domContainer: config.domContainer,

            headerTemplate: config.headerTemplate || this.headerTemplate,
            bodyTemplate: config.bodyTemplate || this.bodyTemplate,
            rowTemplate: config.rowTemplate || this.rowTemplate,

            group: config.group,
            filter: config.filter,
            paging: config.paging,
            visible: config.visible,
            toolTip: config.toolTip,
            editable: config.editable,
            disabled: config.disabled,
            readOnly: config.readOnly,

            source: config.source,
            selectRow: config.selectRow,
            listeners: config.listeners
        })
    },
    bodyTemplate: function() {
        return {
            id: 'listBody',
            css:'',
            html:''
        }
    },
    headerTemplate: function() {
        return {
            id: 'listHeader',
            css:'',
            html:''
        }
    },
    rowTemplate: function() {
        return {
            id: 'listRow',
            css:'',
            html:''
        }
    }
};

NS.List.Instance = function(config) {
    this.status_ = 'configuring';
    this.source_ = null;
    this.filter_ = null;
    this.group_ = null;
    this.paging_ = null;

    this.selectRow_ = null;
    this.toolTip_ = null;

    this.visible_ = false;
    this.editable_ = false;
    this.readOnly_ = false;
    this.disabled_ = false;

    this.tplEngine_ = config.tplEngine;
    this.$domContainer_ = $(config.domContainer);

    this.headerTemplate_ = config.headerTemplate;
    this.bodyTemplate_ = config.headerTemplate;
    this.rowTemplate_ = config.rowTemplate;

    this.setSource(config.source);

    this.setFilter(config.filter);
    this.setGroup(config.group);
    this.setPaging(config.paging);

    this.setSelectRow(config.selectRow);

    this.setVisible(config.visible);
    this.setToolTip(config.toolTip);
    this.setEditable(config.editable);
    this.setReadOnly(config.readOnly);

    config.disabled && this.disable();

    if(config.listeners) {
        //TODO подписка на события
    }

    this.visible_ && this.onRender();
    this.status_ = 'configured';
};

NS.List.Instance.prototype.onRender = function() {
    var bodyParams = [];
    var rowsHTML = '';
    var rowsData = this.getRowsData_();

    for(var i=0; i < rowsData.length; i++) {
        rowsHTML = rowsHTML + this.tplEngine_.build(this.rowTemplate_(),[rowsData[i]],false)
    }
    bodyParams.push({ path: 'rows', value: rowsHTML});
    bodyParams.push({
        path: 'header',
        value: this.tplEngine_.build(this.headerTemplate_(),[],false)
    });

    var $body = this.tplEngine_.build(this.bodyTemplate_(),bodyParams, true);

    this.$domContainer_.append( $body );

    this.status_ = 'rendered';
};

NS.List.Instance.prototype.setSource = function(source) {
    //здесь можно организовать логику по поддержке нескольких источников
};

NS.List.Instance.prototype.getRowsData_ = function() {

};