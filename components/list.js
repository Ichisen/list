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
            groupTemplate: config.groupTemplate || this.groupTemplate,

            group: config.group,
            filter: config.filter,
            paging: config.paging,
            visible: config.visible,
            toolTip: config.toolTip,
            editable: config.editable,
            disabled: config.disabled,

            source: config.source,
            selectRow: config.selectRow,
            listeners: config.listeners
        })
    },
    bodyTemplate: function() {
        return {
            id: 'listBody',
            css:'' +
                '.list {' +
                    'overflow-y: auto;'+
                    'height: 100%;' +
                    'width: 100%;' +
                '}' +
            '',
            html:'<div class="list"> {header} <div class="rows"> {rows} </div> </div>'
        }
    },
    headerTemplate: function() {
        return {
            id: 'listHeader',
            css:'' +
                '.header {' +
                    'visibility: hidden;' +
                    'z-index: 100;' +
                    'top: 0px;' +
                '}' +
            '',
            html:'<div class="header group-name first"></div>'
        }
    },
    rowTemplate: function() {
        return {
            id: 'listRow',
            css:'' +
                '.row {' +
                    'font: normal 20px/45px Helvetica, Arial, sans-serif;'+
                    'margin: 0;'+
                    'padding: 0 0 0 12px;'+
                    'white-space: nowrap;'+
                    'border-bottom: 1px solid #989EA4;'+
                '}' +
            '',
            html:'<div class="row">{data}</div>'
        }
    },
    groupTemplate: function() {
        return {
            id: 'listGroup',
            css:'' +
                '.group {' +
                    'position: relative;'+
                    'padding-top: 25px;' +
                '}' +
                '.group-name.group-animated {' +
                    'bottom: 0px;' +
                    'top: auto'+
                '}' +
                '.group-name {' +
                    'background: #B8C1C8;'+
                    'border-bottom: 1px solid #989EA4;'+
                    'border-top: 1px solid #717D85;'+
                    'color: #FFF;'+
                    'font: normal 18px/21px Helvetica, Arial, sans-serif;'+
                    'margin: 0;'+
                    'padding: 2px 0 0 12px;'+
                    'text-shadow: 0 1px #646A6E;' +
                    'position: absolute;' +
                    'top: 0px;'+
                    'width: calc(100% - 12px);'+
                '}' +
            '',
            html:'<div class="group"><div class="group-name">{name}</div><div class="group-rows">{rows}</div></div>'
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
    this.disabled_ = false;

    this.tplEngine_ = config.tplEngine;
    this.$domContainer_ = config.domContainer;

    this.headerTemplate_ = config.headerTemplate;
    this.groupTemplate_ = config.groupTemplate;
    this.bodyTemplate_ = config.bodyTemplate;
    this.rowTemplate_ = config.rowTemplate;

    this.setSource(config.source);

    this.setFilter(config.filter);
    this.setGroup(config.group);
    this.setPagination(config.pagination);

    this.setSelectRow(config.selectRow);

    this.setVisible(config.visible);
    this.setToolTip(config.toolTip);
    this.setEditable(config.editable);

    config.disabled && this.disable();

    if(config.listeners) {
        //TODO подписка на события
    }

    this.visible_ && this.onRender();
    this.visible_ && this.onEvents();
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
        rowsHTML = rowsHTML + this.tplEngine_.build(this.rowTemplate_(),[{path: 'data', value:rowsData[i]}],false)
    }

    return rowsHTML;
};

NS.List.Instance.prototype.getGroupHTML = function() {
    var HTML = '';
    var selfArray = this.groupConfig_.asc ? this.groupArray_.sort() : this.groupArray_.sort();

    for(var i=0; i < selfArray.length; i++){
        HTML = HTML + this.tplEngine_.build(this.groupTemplate_(),[{
                path: "name", value: selfArray[i]
            },{
                path: "rows", value: this.getRowsHTML( this.groupData_[selfArray[i]].data )
            }],false)
    }

    return HTML;
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

NS.List.Instance.prototype.setGroup = function(groupConf) {
    this.groupConfig_ = groupConf;

    this.groupConfig_ && this.groupConfig_.groupingFunc.call(this,this.getSource())
};

NS.List.Instance.prototype.setVisible = function(visible) {
    this.visible_ = visible;
};

NS.List.Instance.prototype.onEvents = function() {
    this.$list_ = this.$domContainer_.find('.list');
    this.$groups_ = this.$domContainer_.find('.group');
    this.$headerFirst_ = this.$domContainer_.find('.header.group-name.first');
    this.$list_.scroll(this.scrollPosition.bind(this));
};

NS.List.Instance.prototype.scrollPosition = function() {
    var scrollTop = this.$list_.scrollTop();
    var stopFlag = false;
    var groupOnScroll;

    this.$groups_.each(function(index, group) {
        if(stopFlag) return;
       if( (group.offsetTop - scrollTop) <= 0 ){
           groupOnScroll = group;
       } else {
           stopFlag = true;
       }
    }.bind(this));

    if(!groupOnScroll) return;

    var $groupName = $(groupOnScroll).find('.group-name');

    if(groupOnScroll.offsetTop+groupOnScroll.offsetHeight < scrollTop+25) {
        this.$headerFirst_.css('visibility','hidden');
        $groupName.addClass('group-animated');
    } else {
        this.$headerFirst_.css('visibility','visible');
        $groupName.removeClass('group-animated');
    }

    this.$headerFirst_.width(groupOnScroll.offsetWidth-12);
    this.$headerFirst_.text( $(groupOnScroll).find('.group-name').text() );
};

NS.List.Instance.prototype.getRowsData_ = function() { };
NS.List.Instance.prototype.setFilter = function() { };
NS.List.Instance.prototype.setPagination = function() { };
NS.List.Instance.prototype.setSelectRow = function() { };
NS.List.Instance.prototype.setToolTip = function() { };
NS.List.Instance.prototype.setEditable = function() { };