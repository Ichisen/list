/**
 * Created by Ichisen-PC on 22.02.2016.
 */

var NS = window;
!NS.Templates &&( NS.Templates = {} );
NS = NS.Templates;

NS.HTML = {
    build: function(template, data, htmlFlag) {
        if(!this.style[template.id] && template.css.length) {

            this.addStyleSheet(template.id, template.css);
            this.style[template.id] = true
        }

        var html = template.html;

        for(var i=0; i < data.length; i++) {
            html = html.replace( '{'+data[i].path+'}', data[i].value )
        }

        return htmlFlag ? $(html) : html;
    },
    style: {},
    addStyleSheet: function(id, css) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');

        style.type = 'text/css';
        style.id = id;

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    }
};