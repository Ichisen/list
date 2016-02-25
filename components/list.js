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
    },
    groupTemplate: function() {
        return {
            id: 'listGroup',
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
    this.groupTemplate_ = config.groupTemplate;
    this.bodyTemplate_ = config.headerTemplate;
    this.rowTemplate_ = config.rowTemplate;

    this.setSource(config.source);

    this.setFilter(config.filter);
    this.setGroup(config.group);
    this.setPagination(config.pagination);

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

    if(this.groupConfig_) {
        rowsHTML = this.getGroupHTML();
    } else {
        rowsHTML = this.getRowsHTML( this.getRowsData_() );
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

NS.List.Instance.prototype.getRowsHTML = function(rowsData) {
    var rowsHTML = '';
    for(var i=0; i < rowsData.length; i++) {
        rowsHTML = rowsHTML + this.tplEngine_.build(this.rowTemplate_(),[{rowContent:rowsData[i]}],false)
    }

    return rowsHTML;
};

NS.List.Instance.prototype.getGroupHTML = function() {
    var HTML = '';
    var selfArray = this.groupConfig_.asc ? this.groupArray_.sort() : this.groupArray_.sort();

    for(var i=0; i < selfArray.length; i++){
        HTML = HTML + this.tplEngine_.build(this.groupTemplate_(),[{
                name: selfArray[i],
                row: this.getRowsHTML( this.groupData_[selfArray[i]].data )
            }],false)
    }
};

NS.List.Instance.prototype.setSource = function(source) {
    if(source instanceof Array) {
        this.setSourceArray(source);
    } else {
        //здесь можно организовать логику по поддержке нескольких источников
    }
};

NS.List.Instance.prototype.setSourceArray = function(sourceArray) {
    this.sourceArray_ = [];

    for(var i=0; i < sourceArray.length; i++){
        this.sourceArray_.push(sourceArray[i])
    }
};

NS.List.Instance.prototype.getSource = function() {
    if(this.sourceArray_ && this.sourceArray_.length) {
        return this.sourceArray_
    } else {
        //здесь можно организовать логику по поддержке нескольких источников
    }
};

NS.List.Instance.prototype.getRowsData_ = function() {

};

NS.List.Instance.prototype.setFilter = function() { };

NS.List.Instance.prototype.setGroup = function(groupConf) {
    this.groupConfig_ = groupConf;

    this.groupConfig_ && this.groupConfig_.groupingFunc.call(this,this.getSource())
};