// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Boomgraph - Area  .js                                              │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2012 Antoine Guiral (http://twitter.com/antoineguiral) │ \\
// │ Copyright © 2012 Retent.io (http://retent.io)                      │ \\
// │ http://github.com/retentio/boomgraph                               │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ For the full copyright and license information,                    | \\
// | please view the LICENSE file that was distributed                  | \\
// | with this source code.                                             │ \\
// └────────────────────────────────────────────────────────────────────┘ \\
var Area = (function(){

    

    return function Area(options){

        var choopy=new Choopy(options);
    
    
        choopy.options.graph.dot.normal=0,
        choopy.options.graph.dot.hover=0;
        choopy.options.grid.y.startAt=0;
    
        choopy.parse();
        choopy.normalize();
        choopy.initDraw();
        choopy.drawGrid();
    
        var serie;
        var howToScale=function(i,j){
        
            return{
                xScale:choopy.draw.coord.scale.x.step,
                xFactor:0.5+j
            };
        }
    
        for (var i=0,ii=choopy.data.countSerie; i<ii ; i++){
            //we pick a color form the options
            var currentColor=choopy.options.color.serie[i%choopy.options.color.serie.length];
            serie=choopy.drawLine(i,currentColor,howToScale);
            serie.plots.toFront();
            choopy.draw.sets.series.push(serie.plots);
            choopy.draw.sets.pathes.push(serie.lines);
        }
    
        for (var i=0,ii=choopy.draw.sets.series.length; i<ii ; i++){
            choopy.hover(choopy.draw.sets.series[i]);
        }
    
        choopy.fillPathes();
        choopy.sortSeries();
    }
})()
// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Boomgraph - Bar.js                                                 │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2012 Antoine Guiral (http://twitter.com/antoineguiral) │ \\
// │ Copyright © 2012 Retent.io (http://retent.io)                      │ \\
// │ http://github.com/retentio/boomgraph                               │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ For the full copyright and license information,                    | \\
// | please view the LICENSE file that was distributed                  | \\
// | with this source code.                                             │ \\
// └────────────────────────────────────────────────────────────────────┘ \\

var Bar = function Bar(options){
    
    var choopy=new Choopy(options);
    
    choopy.options.grid.y.startAt=0;
    
    choopy.parse();
    choopy.normalize();
    choopy.initDraw();
    choopy.drawGrid();
    
    var howToScale=function(i,j){
        return{
            xScale:choopy.draw.coord.scale.x.step/(choopy.data.countSerie + .5),
            xFactor:i+j*(choopy.data.countSerie+.5)
        };
    }
    
    var serie;
    for (var i=0,ii=choopy.data.countSerie; i<ii ; i++){
        //we pick a color form the options
        var currentColor=choopy.options.color.serie[i%choopy.options.color.serie.length];
        serie=choopy.drawColumns(i,currentColor,howToScale);
        serie.toFront();
        choopy.draw.sets.series.push(serie);
    }
    for (var i=0,ii=choopy.draw.sets.series.length; i<ii ; i++){
        choopy.hover(choopy.draw.sets.series[i]);
    }
};// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Boomgraph - Choopy.js                                              │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2012 Antoine Guiral (http://twitter.com/antoineguiral) │ \\
// │ Copyright © 2012 Retent.io (http://retent.io)                      │ \\
// │ http://github.com/retentio/boomgraph                               │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ For the full copyright and license information,                    | \\
// | please view the LICENSE file that was distributed                  | \\
// | with this source code.                                             │ \\
// └────────────────────────────────────────────────────────────────────┘ \\

Raphael.fn.drawGrid = function (x, y, w, h, wv,scale,drawbox) {
    if(drawbox){
        var path = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w-2) + .5, Math.round(y) + .5, Math.round(x + w-2) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5];
    }else{
        var path=[];
    }  
    var rowHeight = (h) / (scale.y.tickers);
 
    for (var i = 0; i <= scale.y.tickers; i++) {
        if(i<scale.y.tickers){
            for(var j = 0,jj=w/3;j<jj;j++){
                if(j%2==0 ){
                    path = path.concat(["M", x + j*3, Math.round(y + i * rowHeight) + .5, "l", 3, 0]);
                }
            }
        }else{
            path = path.concat(["M", x, Math.round(y + i * rowHeight) + .5, "l", w, 0]);
        }
    }
    

    return this.path(path.join(","));
};


Raphael.el.isAbsolute=!0;
Raphael.el._realColor=null;

Raphael.el._last={
    x:0,
    y:0
};
Raphael.el.setRealColor=function(color){
    this._realColor=color;
    return this;
};
Raphael.el.absolutely=function(){
    this.isAbsolute=1;
    return this;
};
Raphael.el.relatively=function(){
    this.isAbsolute=0;
    return this;
};
Raphael.el.moveTo=function(a,b){
    this._last={
        x:a,
        y:b
    };
    return this.attr({
        path:this.attrs.path+["m","M"][+this.isAbsolute]+parseFloat(a)+" "+parseFloat(b)
    });
};
Raphael.el.lineTo=function(a,b){
    this._last={
        x:a,
        y:b
    };
    
    return this.attr({
        path:this.attrs.path+["l","L"][+this.isAbsolute]+parseFloat(a)+" "+parseFloat(b)
    });
};
Raphael.el.cplineTo=function(a,b,c){
    if(a>this._last.x){
        this.attr({
            //            path:this.attrs.path+["Q",this._last.x+c,this._last.y,a,b]
            path:this.attrs.path+["S",a-c,b,a,b]
        //            path:this.attrs.path+["C",this._last.x+c,this._last.y,a-c,b,a,b]
        });
    }
    else{
        a==this._last.x?this.lineTo(a,b):this.attr({
            //            path:this.attrs.path+["Q",this._last.x-c,this._last.y,a,b]
            path:this.attrs.path+["S",a+c,b,a,b]
        //            path:this.attrs.path+["C",this._last.x-c,this._last.y,a+c,b,a,b]
        });
    }
    this._last={
        x:a,
        y:b
    };
    
    return this;
};
Raphael.el.andClose=function(){
    return this.attr({
        path:this.attrs.path+"z"
    });
};

(function () {
    var tokenRegex = /\{([^\}]+)\}/g,
    objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g, // matches .xxxxx or ["xxxxx"] to run over object properties
    replacer = function (all, key, obj) {
        var res = obj;
        key.replace(objNotationRegex, function (all, name, quote, quotedName, isFunc) {
            name = name || quotedName;
            if (res) {
                if (name in res) {
                    res = res[name];
                }
                typeof res == "function" && isFunc && (res = res());
            }
        });
        res = (res == null || res == obj ? all : res) + "";
        return res;
    },
    fill = function (str, obj) {
        return String(str).replace(tokenRegex, function (all, key) {
            return replacer(all, key, obj);
        });
    };
    Raphael.fn.popup = function (X, Y, set, pos, ret) {
        pos = String(pos || "top-middle").split("-");
        pos[1] = pos[1] || "middle";
        var r = 5,
        bb = set.getBBox(),
        w = Math.round(bb.width),
        h = Math.round(bb.height),
        x = Math.round(bb.x)-r,
        y = Math.round(bb.y)-r,
        gap = Math.min(h / 2, w / 2, 10),
        shapes = {
            top: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}l-{right},0-{gap},{gap}-{gap}-{gap}-{left},0a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
            bottom: "M{x},{y}l{left},0,{gap}-{gap},{gap},{gap},{right},0a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
            right: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}l0-{bottom}-{gap}-{gap},{gap}-{gap},0-{top}a{r},{r},0,0,1,{r}-{r}z",
            left: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}l0,{top},{gap},{gap}-{gap},{gap},0,{bottom}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z"
        },
        offset = {
            hx0: X - (x + r + w - gap * 2),
            hx1: X - (x + r + w / 2 - gap),
            hx2: X - (x + r + gap),
            vhy: Y - (y + r + h + r + gap),
            "^hy": Y - (y - gap)
                
        },
        mask = [{
            x: x + r,
            y: y,
            w: w,
            w4: w / 4,
            h4: h / 4,
            right: 0,
            left: w - gap * 2,
            bottom: 0,
            top: h - gap * 2,
            r: r,
            h: h,
            gap: gap
        }, {
            x: x + r,
            y: y,
            w: w,
            w4: w / 4,
            h4: h / 4,
            left: w / 2 - gap,
            right: w / 2 - gap,
            top: h / 2 - gap,
            bottom: h / 2 - gap,
            r: r,
            h: h,
            gap: gap
        }, {
            x: x + r,
            y: y,
            w: w,
            w4: w / 4,
            h4: h / 4,
            left: 0,
            right: w - gap * 2,
            top: 0,
            bottom: h - gap * 2,
            r: r,
            h: h,
            gap: gap
        }][pos[1] == "middle" ? 1 : (pos[1] == "top" || pos[1] == "left") * 2];
    
        var dx = 0,
        dy = 0,
        out = this.path(fill(shapes[pos[0]], mask)).insertBefore(set);
        switch (pos[0]) {
            case "top":
                dx = X - (x + r + mask.left + gap);
                dy = Y - (y + r + h + r + gap);
                break;
            case "bottom":
                dx = X - (x + r + mask.left + gap);
                dy = Y - (y - gap);
                break;
            case "left":
                dx = X - (x + r + w + r + gap);
                dy = Y - (y + r + mask.top + gap);
                break;
            case "right":
                dx = X - (x - gap);
                dy = Y - (y + r + mask.top + gap);
                break;
        }
        out.translate(dx, dy);
        if (ret) {
            ret = out.attr("path");
            out.remove();
            return {
                path: ret,
                dx: dx,
                dy: dy
            };
        }
        set.translate(dx, dy);
        return out;
    };
})();

var Choopy = (function(){

    
    var Choopy = function Choopy(newOptions){
        if(Object.prototype.toString.call(newOptions) == '[object Undefined]' || Object.prototype.toString.call(newOptions.data) == '[object Undefined]' || newOptions['data'] == '' || Object.prototype.toString.call(newOptions.data) == '[object Undefined]'  || newOptions.container == ''){
            throw new Error('Empty data source or container is not allowed');
        }else{
            var divContainer=document.getElementById(newOptions.container);
            if(divContainer == null){
                throw new Error('There is no div container with this id :'+ newOptions.container);
            }else{
                var options = this.utils.extend(this.utils.extend({},this.defaultOptions),newOptions);
                this.options = (
                    function(){
                        return options;
                    }
                    )(options);
                    
                    
                this.data = {
                    raws: [],
                    series: [],
                    labels: {
                        x: []
                    },
                    longestSerie: 0,
                    countSerie: 0
                };
            
                if((this.options.height <= 0 || this.options.width <= 0) && this.options.auto_adjust != true){
                    throw new Error('Height and/or width needs to be superior to 0');
                }else{
                    
                    if(this.options.auto_adjust == true || this.options.height == 0 || this.options.width == 0){
                        container = document.getElementById(this.options.container)
                        this.options.height = container.offsetHeight
                        this.options.width = container.offsetWidth
                    }
                    var r = Raphael(this.options.container, this.options.width, this.options.height);
                              
                }
                
            
                this.draw = {
                    paper: r,
                    sets: {
                        series: [],
                        transverses: [],
                        pathes: [],
                        labels: {
                            x: [],
                            y: []
                        },
                        legend: []
                    },
                    matrice: {},
                    dots: [],
                    tooltips: {},
                    grid: {
                        box: null,
                        y: null,
                        x: null
                    },
                    coord: {
                        scale: {
                            y: {
                                minValue: 0,     // min value on Y axis (a nice number < to the min data value
                                maxValue: 0,     // max value on Y axis (a nice number > to the max data value 
                                step: 0,         // amount of pixel between two Y labels
                                tickers: 0       // number of Y tickers (or labels)
                            },
                            x: {
                                step: 0          // amount of pixel allowed for a ticker
                            }
                        },
                        origin: {                // position of the graph inside the container
                            X: 0,                // on X
                            Y: 0                 // on Y
                        }
                    }
                }
            }
        }
    }

    Choopy.prototype.setOptions = function(options){

        //config
        this.options=this.utils.extend(this.options,options);
    }

    /**
     * Choopy.parse takes data from this.options.data.
     * If an array is given, it should contains all series (even one called "legend" which contains the x axis labels)
     * this.series and this.legends.x will be filled directly
     * If a string is given, it should be the id of an html table which contains all data.
     * The table need to be well formed with :
     *  - thead>tr>th for the x axis labels 
     *  - tbody>tr>td[0] for the name of the serie
     *  - tbody>tr>td[j] the values
     *  this.data.raws will be filled with the table's data
     */
    Choopy.prototype.parse = function(){
    
        if(Object.prototype.toString.call(this.options.data) == '[object Array]'){
            if(this.options.data.length==0){
                throw new Error('options.data shouldn\'t be empty');
            }else{
                this.data.longestSerie=0
                for(var i=0,ii=this.options.data.length;i<ii;i++){
                    if(this.options.data[i].name=='x-label'){
                        if(Object.prototype.toString.call(this.options.data[i].data) == '[object Function]'){
                            this.data.labels.x=this.options.data[i].data();
                        }else{
                            this.data.labels.x=this.options.data[i].data;
                        }
                    }else{
                        this.options.data[i].name=this.utils.trim(this.options.data[i].name);
                        this.data.series.push(this.options.data[i]);
                        if(this.options.data[i].data.length>this.data.longestSerie){
                            this.data.longestSerie=this.options.data[i].data.length;
                        }
                    }
                }
                
                if(this.data.labels.x.length>0){
                    this.data.countSerie=ii-1;
                }else{
                    var generateXLabels=function(longestSerie){
                        var l=[];
                        for (var i=0,ii=longestSerie;i<ii;i++){
                            l.push(i);
                        }
                        return l;
                    }
                    this.data.labels.x=generateXLabels(this.data.longestSerie);
                    this.data.countSerie=ii;
                }
                if(this.data.countSerie==0){
                    throw new Error('you should pass at least one serie');
                }
            }
            
        }else if(Object.prototype.toString.call(this.options.data) == '[object String]'){
            var table=document.getElementById(this.options.data);
            if(table==null){
                throw new Error('No data provided. Check if the id match a well formed html table');
            }else{
                var values=[];
                var trs=table.getElementsByTagName('tr');
                
                for(var i= 0; i < trs.length; i++) {
                    var tdsValues=[];
                    var tr=trs[i];
                    if(tr.getElementsByTagName('th')){
                        
                        var tds=tr.getElementsByTagName('th');
                        for(var j=0,jj=tds.length;j<jj;j++){
                            tdsValues.push(this.utils.trim(tds[j].textContent));
                        }
                    }
                    if(tr.getElementsByTagName('td')){
                        var tds=tr.getElementsByTagName('td');
                        for(var j=0,jj=tds.length;j<jj;j++){
                            tdsValues.push(this.utils.trim(tds[j].textContent));
                        }
                    }
                    values.push(tdsValues);
                }
                this.data.raws=values;
            }
        }else{
            throw new Error('options.data should be an array of series or an id');
        }
    }

    /**
     * Choopy.transversalize reverses lines and columns of the data.raws matrice.
     * 
     */
    Choopy.prototype.transversalize = function(){
        var values=this.data.raws;
    
        var tmp=[];
        for(var i= 0,ii=values.length; i < ii; i++) {
        
            for(var j= 0,jj=values[i].length; j < jj; j++) {
                if(i==0){
                    tmp.push([]);
                }    
                tmp[j][i]=values[i][j];
            }
        }
        this.data.raws=tmp;    
    }

    /**
     * Choopy.normalize fills data.series and data.labels.x with data.raws.
     * data.countSerie and data.longestSerie will be set up too
     * 
     */
    Choopy.prototype.normalize = function(){
        var values=this.data.raws
        if(values.length==1){
            var serie={
                name:'',
                data:[]
            }
            this.data.series.push(serie)
            for(var j= 0,jj=values[0].length; j < jj; j++) {
                    
                if(j==0){
                    this.data.series[0].name=values[0][j];
               
                }else{
                    this.data.series[0].data.push(parseFloat(values[0][j]));
                }
            }
            this.data.longestSerie=values[0].length-1;
            this.data.countSerie=1;
            var generateXLabels=function(longestSerie){
                var l=[];
                for (var i=0,ii=longestSerie;i<ii;i++){
                    l.push(i);
                }
                return l;
            }
            this.data.labels.x=generateXLabels(this.data.longestSerie);
                
        }else{
            for(var i= 0,ii=values.length; i < ii; i++) {
                if(i>0 ){
                    var serie={
                        name:'',
                        data:[]
                    }
                    this.data.series.push(serie);
                }
        
                for(var j= 0,jj=values[i].length; j < jj; j++) {
                    if(i==0 ){
                        if(j>0){
                            this.data.labels.x.push(values[i][j]);
                        }
                
                    }else{
                        if(j==0){
                            this.data.series[i-1].name=values[i][j];
               
                        }else{
                            this.data.series[i-1].data.push(parseFloat(values[i][j]));
                        }
                        if(this.data.longestSerie<(jj-1)){
                            this.data.longestSerie=jj-1;
                        }
                    }
                
                }
            }
            this.data.countSerie=this.data.series.length;
        }
        
    }

    /**
     * Choopy.initDraw set up draw.coord values (scalling and origin)
     * 
     */
    Choopy.prototype.initDraw = function(){
    
        if(this.options.legend.display == 'top'){
            this.drawLegendTop();
        }else if(this.options.legend.display == 'right'){
            this.drawLegendRight();
        }
    
        //origin
        this.draw.coord.origin.X = this.options.offset.left+this.options.gutter.left+.5;
        this.draw.coord.origin.Y = this.options.gutter.top+.5;
    
       
    
        //scaling
        var maxValue = this.data.series[0].data[0],
        minValue;
            
            
        if(this.options.grid.y.startAt !== false){
            minValue=this.options.grid.y.startAt;
            
        }else{
            minValue = maxValue;
        }
        
        
        for(var i = 0; i < this.data.series.length; i++) {
            for(var j = 0; j < this.data.series[i].data.length; j++) {
                tmp = parseFloat(this.data.series[i].data[j]);
                if(tmp > maxValue){
                    maxValue = tmp;
                }
                if(tmp < minValue){
                    minValue = tmp;
                }
            
            }
        }
        
        
        var scaleY={
            minValue:0,
            maxValue:0,
            step:0,
            tickers:0
        }
        
        
        
        if(minValue == 0 && minValue == maxValue){
            scaleY.tickers = 2;
            scaleY.minValue = 0;
            scaleY.maxValue = 1;
            scaleY.step = (this.options.height - this.options.gutter.top - this.options.gutter.bottom);
        }else{
            // Inspired by:
            // http://books.google.com/books?id=fvA7zLEFWZgC&pg=PA61&lpg=PA61#v=onepage&q&f=false
            var range       = minValue == maxValue ? this.utils.niceNumber(Math.abs(maxValue), false) : this.utils.niceNumber(maxValue - minValue, false),
            d           = this.utils.niceNumber(range / (this.options.grid.y.range ), true),
            precision   = Math.max((-Math.floor(Math.LOG10E * Math.log(d))), 0),
            graphmin    = this.utils.floorToPrecision(minValue / d , precision) * d,
            margin      = this.utils.roundToPrecision(this.utils.niceNumber(0.5 * d, true), precision),
            step        = this.utils.roundToPrecision(d, precision);
           
            // Add some headroom to the bottom
            if (minValue < 0) {
                graphmin = graphmin - margin;
            } else {
                graphmin = Math.max(graphmin - margin, 0);
            }

            // Round to a proper origin value
            if (minValue !== maxValue) {
                graphmin = this.utils.roundToOrigin(graphmin, 1);
            }
            
            scaleY.maxValue=graphmin
            while(scaleY.maxValue<=maxValue){
                scaleY.maxValue += step;
            }
            
            scaleY.tickers = 0;
            scaleY.minValue=scaleY.maxValue
            while(scaleY.minValue>minValue){
                scaleY.minValue -= step;
                scaleY.tickers++;
            }

            scaleY.step = (this.options.height - this.options.gutter.top - this.options.gutter.bottom)/(scaleY.maxValue - scaleY.minValue);
            
        }

        this.draw.coord.scale.y = scaleY;
        this.draw.coord.scale.x.step = (this.options.width - (this.options.offset.left + this.options.offset.right) - (this.options.gutter.left + this.options.gutter.right)) / this.data.labels.x.length;
        this.draw.coord.scale.x.tickers = this.data.labels.x.length;
        
       
        
        
        
    }

    Choopy.prototype.drawLegendRight = function (){
        var legendSet = this.draw.paper.set(),
        currentX = this.options.width - this.options.gutter.right,
        currentY = this.options.gutter.top + .5;
        
        for (var i = 0, ii = this.data.countSerie; i < ii ; i++){
            var itemSet = this.draw.paper.set(),
            currentColor = this.options.color.serie[i%this.options.color.serie.length];
                
            // the small rect with the color of the serie    
            var rect=this.draw.paper.rect(currentX,currentY,15,15,5).attr({
                fill: currentColor,
                stroke: currentColor,
                'stroke-width': 0,
                'stroke-opacity': 0
            }).setRealColor(currentColor);
            
            // we add it to the matrice to get back easily the serie id with the raphael element id
            this.draw.matrice[rect.id]={
                id:rect.id,
                serieSetId:i
            };
            
            
            // the legend itself
            var text=this.draw.paper.text(currentX + 25,currentY+10).attr({
                'text-anchor':'start'
            }).attr(this.options.legend.render(this.data.series[i].name));
            
            // added to the matrice
            this.draw.matrice[text.id]={
                id:text.id,
                serieSetId:i
            };
            
            // cursor to the right
            currentY += 25;
            // itemset populated (with one rect and one serie name
            itemSet.push(rect)
            itemSet.push(text)
            
            // click event binded to the legend item set
            this.clickLegend(itemSet)
            
            // if we the legend is too large, we split it in a new line
            if(currentY >= (this.options.height-this.options.gutter.top-this.options.gutter.bottom)){
                currentY = this.options.gutter.top + .5;
                currentX += legendSet.getBBox().width + 10;
            }
            
            // itemset push on the legendset
            legendSet.push(itemSet)
        }
        legendSet.translate(-legendSet.getBBox().width,0);
        
        // if the legend is higher than the top gutter, we extend the top gutter
        if(legendSet.getBBox().width >= this.options.gutter.right){
            this.options.gutter.right = legendSet.getBBox().width+15;
        }
        
        // and we center the legend verticaly
        legendSet.translate(0,(this.options.height-this.options.gutter.top-this.options.gutter.bottom-legendSet.getBBox().height)/2)
        
        // and assign it to Choopy
        this.draw.sets.legend = legendSet;
    }
    
    Choopy.prototype.drawLegendTop = function (){
        var legendSet = this.draw.paper.set(),
        currentX = this.options.gutter.left + .5,
        currentY = this.options.gutter.top + .5;
        
        for (var i = 0, ii = this.data.countSerie; i < ii ; i++){
            
            var itemSet = this.draw.paper.set(),
            currentColor = this.options.color.serie[i%this.options.color.serie.length];
                
            // the small rect with the color of the serie    
            var rect=this.draw.paper.rect(currentX,currentY,15,15,5).attr({
                fill: currentColor,
                stroke: currentColor,
                'stroke-width': 0,
                'stroke-opacity': 0
            }).setRealColor(currentColor);
            
            // we add it to the matrice to get back easily the serie id with the raphael element id
            this.draw.matrice[rect.id]={
                id:rect.id,
                serieSetId:i
            };
            
            // the cursor move right
            currentX += 20+5;
            
            // the legend itself
            var text=this.draw.paper.text(currentX,currentY+10).attr({
                'text-anchor':'start'
            }).attr(this.options.legend.render(this.data.series[i].name));
            
            // added to the matrice
            this.draw.matrice[text.id]={
                id:text.id,
                serieSetId:i
            };
            
            // cursor to the right
            currentX += text.getBBox().width+10;
            
            // itemset populated (with one rect and one serie name
            itemSet.push(rect)
            itemSet.push(text)
            
            // click event binded to the legend item set
            this.clickLegend(itemSet)
            
            // if we the legend is too large, we split it in a new line
            if(currentX >= (this.options.width-this.options.gutter.left-this.options.gutter.right)){
                currentY += 25;
                currentX = this.options.gutter.left + .5;
            }
            
            // itemset push on the legendset
            legendSet.push(itemSet)
        }
        
        // if the legend is higher than the top gutter, we extend the top gutter
        if(legendSet.getBBox().height >= this.options.gutter.top){
            this.options.gutter.top = legendSet.getBBox().height+15;
        }
        
        // and we center the legend horizontaly
        legendSet.translate((this.options.width-this.options.gutter.left-this.options.gutter.right-legendSet.getBBox().width)/2, 0)
        
        // and assign it to Choopy
        this.draw.sets.legend = legendSet;
    }


    /**
     * Choopy.drawGrid 
     * 
     */
    Choopy.prototype.drawGrid = function(){
        var x = this.options.gutter.left + .5, 
            y = this.options.gutter.top + .5, 
            w = this.options.width - (this.options.gutter.left + this.options.gutter.right), 
            h = this.options.height - this.options.gutter.top - this.options.gutter.bottom;
        
        
        if(this.options.grid.draw.box){
            var pathBox = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w-2) + .5, Math.round(y) + .5, Math.round(x + w-2) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5];
            this.draw.grid.box = this.draw.paper.path(pathBox.join(',')).attr({
                stroke: this.options.color.grid,
                opacity:0.3
            });
        }
        if(this.options.grid.draw.y){
            var rowHeight=h / this.draw.coord.scale.y.tickers,
                setYLines = this.draw.paper.set();
            for (var i = 0; i <= this.draw.coord.scale.y.tickers; i++) {
                if(i < this.draw.coord.scale.y.tickers){
                    line = this.draw.paper.path(["M", x, Math.round(y + i * rowHeight) + .5, "l", w, 0]).attr({
                        fill: "none", 
                        stroke: this.options.color.grid, 
                        "stroke-dasharray": "- ",
                        opacity: 0.3
                    });
                    setYLines.push(line)
                }else{
                    line = this.draw.paper.path(["M", x, Math.round(y + i * rowHeight) + .5, "l", w, 0]).attr({
                        stroke: this.options.color.grid,
                        opacity: 0.3
                    });
                    setYLines.push(line)
                }
            }
            this.draw.grid.y = setYLines;
        }
        
        if(this.options.grid.draw.x){
            var  setXLines = this.draw.paper.set();
            
            for (var i = 0; i <= this.draw.coord.scale.x.tickers; i++) {
                
                line = this.draw.paper.path(["M", this.draw.coord.origin.X  + this.draw.coord.scale.x.step * (i + .5), y , "l", 0, h]).attr({
                    fill: "none", 
                    stroke: this.options.color.grid, 
                    "stroke-dasharray": "- ",
                    opacity: 0.3
                });
                setXLines.push(line)
            }
            line = this.draw.paper.path(["M", x, y, "l", 0, h]).attr({
                stroke: this.options.color.grid,
                opacity: 0.3
            });
            setXLines.push(line) 
            this.draw.grid.x = setXLines;
        }
        
        if(this.options.grid.x.labels.draw){
            this.draw.sets.labels.x = this.drawLabelX();
        }
        if(this.options.grid.y.labels.draw){
            this.draw.sets.labels.y = this.drawLabelY();
        }
        
    }

    /**
     * Choopy.drawLabelX draw the x axis labels.
     * Data come from the data.labels.x array
     * It set the raphael draw.sets.labels.x
     */
    Choopy.prototype.drawLabelX = function(){
    
        var labels = this.draw.paper.set();
        for (var i = 0, ii = this.data.labels.x.length; i < ii; i++){
            if(this.options.grid.x.labels.ticker === false || (i % this.options.grid.x.labels.ticker) == 0 ){
                var x = this.draw.coord.origin.X  + this.draw.coord.scale.x.step * (i + .5),
                    t = this.draw.paper.text(x, this.options.height - this.options.gutter.bottom + 10).attr(this.options.grid.x.labels.render(this.data.labels.x[i])).toBack();
                labels.push(t);
            }
        }
        if(this.options.grid.x.legend.show == true){
            t = this.draw.paper.text(this.options.width/2, this.options.height-10).attr({
                'text-anchor':'middle'
            }).attr(this.options.grid.x.legend).toBack();
            labels.push(t);
        }
        return labels;
    }
    
    Choopy.prototype.drawLabelY = function(){
    
        var minValue = this.draw.coord.scale.y.minValue,
            maxValue = this.draw.coord.scale.y.maxValue,
            numLabels   = this.draw.coord.scale.y.tickers,
            rowHeight   = (this.options.height - this.options.gutter.top - this.options.gutter.bottom) / numLabels,
            step        = (maxValue-minValue)/numLabels,
            labels      = this.draw.paper.set();
        
        
        for (var i = 0; i <= numLabels; i++) {
            var yL = Math.round(Math.round(this.options.gutter.top + .5 + i * rowHeight));
            var t = this.draw.paper.text(this.options.gutter.left-5,yL).attr({
                'text-anchor':'end'
            }).attr(this.options.grid.y.labels.render((step*(numLabels-i)+minValue))).toBack();
            labels.push(t);
        }
        if(this.options.grid.y.legend.show==true){
            t = this.draw.paper.text(10,this.options.height/2).attr({
                'text-anchor':'middle',
                'transform' : 'r270'
            }).attr(this.options.grid.y.legend).toBack();
            labels.push(t);
        }
        
        return labels;
    }
    
    Choopy.prototype.drawLine = function(idSerie,color,howToScale){
        var serie  = this.draw.paper.set(),
            values = this.data.series[idSerie].data;
            
        for (var j = 0, jj = values.length; j < jj ; j++){
            var yVal = values[j],
                xScaling=howToScale(idSerie,j),
                yDot =this.draw.coord.origin.Y+(this.draw.coord.scale.y.step * (this.draw.coord.scale.y.maxValue-yVal)), //this is based on how we draw the grid (important to keep y scaling consistent)
                xDot = this.draw.coord.origin.X + (xScaling.xFactor) * xScaling.xScale,
                dot  = this.draw.paper.circle(xDot, yDot, this.options.graph.dot.normal).attr({
                    fill: this.options.color.dot.fill, 
                    stroke: color, 
                    "stroke-width": 2
                });
                
            serie.push(dot);
            this.draw.matrice[dot.id] = {
                id: dot.id,
                serieSetId: idSerie,
                transverseSetId: j
            };
            this.draw.dots.push({
                id: dot.id,
                dot: dot,
                x: idSerie,
                y: j
            });
            
            this.draw.tooltips[dot.id] = this.drawTooltipForPlot(dot, idSerie, j);
            
            if(typeof this.draw.sets.transverses[j] === 'undefined' ){
                var transverse = this.draw.paper.set();
                transverse.push(dot);
                this.draw.sets.transverses.push(transverse);
            }else{
                this.draw.sets.transverses[j].push(dot);
            }
        }
        pathes = this.joinPlots(idSerie,serie);
        return {
            'plots': serie,
            'lines': pathes
        };
    }
    
    Choopy.prototype.joinPlots = function(idSerie,serie){
        var pathes,p;
        //pour chaque cohort
    
        var currentColor=serie[0].attrs.stroke;
        pathes=this.draw.paper.set();

        var path=this.draw.paper.path();
        for (var j=0,jj=serie.length; j<jj ; j++){
            if(j===0){
                path.moveTo(serie[j].attrs.cx, serie[j].attrs.cy);
            }else{
                if(this.options.graph.curve){
                    path.cplineTo(serie[j].attrs.cx, serie[j].attrs.cy,this.options.graph.curve);
                }else{
                    path.lineTo(serie[j].attrs.cx, serie[j].attrs.cy);
                }
            }

            this.draw.matrice[path.id]={
                id:path.id,
                serieSetId:idSerie,
                transverseSetId:j
            }
            path.attr({
                stroke: currentColor, 
                "stroke-width": this.options.graph.line.strokeWidth, 
                "stroke-linejoin": "round"
            });
        }
        serie.toFront();
        pathes.push(path);
        return pathes;
    }
    
    Choopy.prototype.drawColumns = function(idSerie,color,howToScale){
        var serie=this.draw.paper.set();
        var values=this.data.series[idSerie].data;
        for (var j=0,jj=values.length; j<jj ; j++){
            var yVal=values[j];
            
            var xScaling=howToScale(idSerie,j);
            var yBottom=this.draw.coord.origin.Y+(this.draw.coord.scale.y.step * (this.draw.coord.scale.y.maxValue-Math.max(0,this.draw.coord.scale.y.minValue)))+1;
            var yTop=this.draw.coord.origin.Y+(this.draw.coord.scale.y.step * (this.draw.coord.scale.y.maxValue-yVal));
            var yValueToZero=Math.abs(yTop-yBottom);
            var xLeft=this.draw.coord.origin.X + (xScaling.xFactor) * xScaling.xScale;
            var rect=this.draw.paper.rect(xLeft, Math.min(yTop, yBottom), xScaling.xScale-2, yValueToZero).attr({
                fill: color,
                stroke: color,
                'stroke-width': 0
            });
            
            serie.push(rect);
            this.draw.matrice[rect.id]={
                id:rect.id,
                serieSetId:idSerie,
                transverseSetId:j
            };
            this.draw.dots.push({
                id:rect.id,
                dot:rect,
                x:idSerie,
                y:j
            });
            
            this.draw.tooltips[rect.id]=this.drawTooltipForColumn(rect, idSerie, j);
            
            if(typeof this.draw.sets.transverses[j] === 'undefined' ){
                var transverse=this.draw.paper.set();
                transverse.push(rect);
                this.draw.sets.transverses.push(transverse);
            }else{
                this.draw.sets.transverses[j].push(rect);
            }
        }
        return serie;
    }

    Choopy.prototype.drawTooltipForPlot = function(plot,x,y){
        var ppp,textLabel;
    
        textLabel=this.draw.paper.set();
        var title=this.draw.paper.text(160, 0, "").attr({
            'text':this.options.tooltip(this.data,x,y).title+'\n'+this.options.tooltip(this.data,x,y).sub
        }).attr(this.options.textes.tooltip.title);
        
        textLabel.push(title);

        var side = "right";
            
        var xPPP=plot.attrs.cx+4,
        yPPP=plot.attrs.cy;
            
        if (plot.attrs.cx + textLabel.getBBox().width > this.options.width) {
            side = "left";
            xPPP-=8
        }
        ppp = this.draw.paper.popup(xPPP,yPPP ,textLabel,side,true);
        var tooltip=this.draw.paper.path().attr({
            path:ppp.path,
            fill: "#000", 
            stroke: "#666", 
            "stroke-width": 2, 
            "fill-opacity": .7
        }).translate(ppp.dx, ppp.dy);
        textLabel.translate(ppp.dx, ppp.dy).toFront();
        return this.draw.paper.set(tooltip,textLabel).hide();

    /**
         *
         *  Not working on chrome, but have custom title/subtitle style
         *
         **/
    //        var textLabelF=this.draw.paper.set()
    //        var titleF=this.draw.paper.text(160, 10, '').attr({'text':this.options.tooltip(this.data,x,y).title}).attr(this.options.textes.tooltip.title)
    //        var subtitleF=this.draw.paper.text(160, 27, '').attr({'text':this.options.tooltip(this.data,x,y).sub}).attr(this.options.textes.tooltip.sub)
    //        textLabelF.push(titleF)
    //        textLabelF.push(subtitleF)
    //        
    //           
    //        var side = "right";
    //            
    //        var xPPP=plot.attrs.cx+4,
    //        yPPP=plot.attrs.cy;
    //            
    //        if (plot.attrs.cx + textLabelF.getBBox().width > this.options.width) {
    //            side = "left";
    //            xPPP-=8
    //        }
    //        ppp = this.draw.paper.popup(xPPP,yPPP ,textLabelF,side).attr({
    //            fill: "#000", 
    //            stroke: "#666", 
    //            "stroke-width": 2, 
    //            "fill-opacity": .7
    //        })
    //        
    //      
    //       
    //        return this.draw.paper.set(ppp,textLabelF).hide()
        
    }
    
    Choopy.prototype.drawTooltipForColumn = function(column,x,y){
        
        var ppp,textLabel;
    
        textLabel=this.draw.paper.set()
        var title=this.draw.paper.text(160, 0, "").attr({
            'text':this.options.tooltip(this.data,x,y).title+'\n'+this.options.tooltip(this.data,x,y).sub
        }).attr(this.options.textes.tooltip.title);
        
        textLabel.push(title);

        var side = "top";
            
        var xPPP=column.attrs.x+column.attrs.width/2,
        yPPP=column.attrs.y-1;
            
        if (column.attrs.cy - textLabel.getBBox().height <0) {
            side = "bottom";
            xPPP+=2;
        }
        ppp = this.draw.paper.popup(xPPP,yPPP ,textLabel,side,true);
        var tooltip=this.draw.paper.path().attr({
            path:ppp.path,
            fill: "#000", 
            stroke: "#666", 
            "stroke-width": 2, 
            "fill-opacity": .7
        }).translate(ppp.dx, ppp.dy);
        textLabel.translate(ppp.dx, ppp.dy).toFront();
        return this.draw.paper.set(tooltip,textLabel).hide();

    /**
         *
         *  Not working on chrome, but have custom title/subtitle style
         *
         **/
        
    //        var ppp,textLabel;
    //        textLabel=this.draw.paper.set()
    //        textLabel.push(this.draw.paper.text(60, 12, this.options.tooltip(this.data,x,y).title).attr(this.options.textes.tooltip.title))
    //        textLabel.push(this.draw.paper.text(60, 27, this.options.tooltip(this.data,x,y).sub).attr(this.options.textes.tooltip.sub))
    //           
    //        var side = "top";
    //            
    //        var xPPP=column.attrs.x+column.attrs.width/2,
    //        yPPP=column.attrs.y+4;
    //            
    //            
    //        if (column.attrs.cy - textLabel.getBBox().height <0) {
    //            side = "bottom";
    //            xPPP-=8
    //        }
    //        ppp = this.draw.paper.popup(xPPP,yPPP ,textLabel,side).attr({
    //            fill: "#000", 
    //            stroke: "#666", 
    //            "stroke-width": 2, 
    //            "fill-opacity": .7
    //        })
    //        return this.draw.paper.set(ppp,textLabel).hide()
        
    }

    Choopy.prototype.fillPathes = function(){
        var zero=this.draw.coord.origin.Y+(this.draw.coord.scale.y.step * (this.draw.coord.scale.y.maxValue-0))+1.5;

        for(var i=0;i<this.draw.sets.pathes.length;i++ ){
            
            if(this.draw.sets.pathes[i][0].type=='path'){
                var oldcolor=this.draw.sets.pathes[i][0].attrs.stroke;
                var bgp=this.draw.sets.pathes[i][0].attrs.path;
                    
                bgp.push(['L',bgp[bgp.length-1][1], zero]);
                bgp.push(['L',bgp[0][1] , zero]);

                var bgpath=this.draw.paper.path().attr({
                    path:bgp,
                    fill: oldcolor, 
                    stroke: oldcolor, 
                    opacity: .4,
                    "stroke-width": 0, 
                    "stroke-linejoin": "round"
                })
            }
                
            this.draw.sets.pathes[i].push(bgpath);
        }
    
    
    }
    
    Choopy.prototype.sortSeries = function(){
        var s  = this.draw.sets.series,
            sP = this.draw.sets.pathes,
            avgValuePerSerie = [];
    
        for(var i = 0; i < this.data.series.length; i++ ){
            var avgValue = 0;
            for(var j = 0; j < this.data.series[i].data.length; j++ ){
                avgValue += parseFloat(this.data.series[i].data[j]);
            }
            avgValue = avgValue / this.data.series[i].data.length;
            avgValuePerSerie.push({
                idSerie: i,
                value: avgValue
            });
        }
        function compare(a,b) {
            if (a.value < b.value)
                return 1;
            if (a.value > b.value)
                return -1;
            return 0;
        }
        avgValuePerSerie.sort(compare);
        for(var k = 0, kk = avgValuePerSerie.length; k < kk; k++){
            sP[avgValuePerSerie[k].idSerie].toFront();
            s[avgValuePerSerie[k].idSerie].toFront();
        }
    }
    
    Choopy.prototype.drawTransverses = function(){
        var p;
     
        for(var i = 0; i< this.draw.sets.transverses.length; i++){
            p = ['M'];
            for( var j = 0, jj = this.draw.sets.transverses[i].items.length - 1; j < jj; j++){
           
                var thisDot = this.draw.sets.transverses[i].items[j].attrs,
                    nextDot = this.draw.sets.transverses[i].items[j+1].attrs;
                if (j == 0) {
                    p = p.concat(["M", thisDot.cx, thisDot.cy, "L"]);
            
                }
                p = p.concat([ thisDot.cx, thisDot.cy,nextDot.cx, nextDot.cy]);
            
            }
            var path = this.draw.paper.path(p).attr({
                stroke: this.options.color.transverse, 
                "stroke-width": this.options.graph.line.strokeWidth, 
                "stroke-linejoin": "round"
            }).hide().toBack();
            this.draw.sets.transverses[i].push(path);
        }
        if(this.draw.grid.x){
            this.draw.grid.x.toBack();
        }
        if(this.draw.grid.y){
            this.draw.grid.y.toBack();
        }
        
    }
    
    Choopy.prototype.hover = function(elem){
        var self = this;
        elem.hover(function(){
       
            if(this.type == 'circle'){
                this.attr('r', self.options.graph.dot.hover);
                self.draw.tooltips[this.id].show().toFront();
            }
            if(this.type == 'rect'){
                this.attr('fill-opacity', 0.7);
                self.draw.tooltips[this.id].show().toFront();
            }
        },function(){
        
            if(this.type == 'circle'){
                this.attr('r', self.options.graph.dot.normal);
                self.draw.tooltips[this.id].hide();
            }
            if(this.type == 'rect'){
                this.attr('fill-opacity', 1);
                self.draw.tooltips[this.id].hide();
            }
        })
    }
    
    Choopy.prototype.clickLegend = function(elem){
        var self = this;
        
        elem.click(function(){
            var serieID = self.draw.matrice[this.id].serieSetId;
            if(self.draw.sets.series[serieID][0].node.style.display == 'none'){
                self.draw.sets.legend[serieID][0].attr({
                    fill: self.draw.sets.legend[serieID][0]._realColor
                })
                self.draw.sets.series[serieID].show();
                if(self.draw.sets.pathes[serieID]){
                    
                    self.draw.sets.pathes[serieID].show();
                }
            }else{
                self.draw.sets.legend[serieID][0].attr({
                    fill: "#AAA"
                })    
                self.draw.sets.series[serieID].hide();
                if(self.draw.sets.pathes[serieID]){
                    self.draw.sets.pathes[serieID].hide();
                }
            }
           
        })
    }
    
    Choopy.prototype.utils={
        trim: function (str) {
            var	str = str.replace(/^\s\s*/, ''),
            ws = /\s/,
            i = str.length;
            while (ws.test(str.charAt(--i)));
            return str.slice(0, i + 1);
        },
        extend: function(a,b){
            for (var property in b){
                if(a[property]){
                    if(Object.prototype.toString.call(b[property]) == '[object Object]'){
                        a[property]=this.extend(a[property],b[property]);
                    }else{
                        a[property] = b[property];
                    }
                }else{
                    a[property] = b[property];
                }
            }
            return this.clone(a);
        },
        clone: function clone(srcInstance){
            if(typeof(srcInstance) != 'object' || srcInstance == null){
                return srcInstance;
            }
            var newInstance = srcInstance.constructor();
            for(var i in srcInstance){
                newInstance[i] = clone(srcInstance[i]);
            }
            return newInstance;
        },
        roundToPrecision: function(x, precision) {
            var exp = Math.pow(10, precision);
            return Math.round(x * exp) / exp;
        },

        floorToPrecision: function(x, precision) {
            var exp = Math.pow(10, precision);
            return Math.floor(x * exp) / exp;
        },

        ceilToPrecision: function(x, precision) {
            var exp = Math.pow(10, precision);
            return Math.ceil(x * exp) / exp;
        },

        niceNumber: function(x, round) {
            var exp = Math.floor(Math.LOG10E * Math.log(x)), // exponent of x
            p, f, nf;

            // Fix for inaccuracies calculating negative powers
            if (exp < 0) {
                p = parseFloat(Math.pow(10, exp).toFixed(Math.abs(exp)));
            } else {
                p = Math.pow(10, exp);
            }
            f = x / p;

            if (round) {
                if (f < 1.5) {
                    nf = 1;
                } else if (f < 3) {
                    nf = 2;
                } else if (f < 7) {
                    nf = 5;
                } else {
                    nf = 10;
                }
            } else {
                if (f <= 1) {
                    nf = 1;
                } else if (f <= 2) {
                    nf = 2;
                } else if (f <= 5) {
                    nf = 5;
                } else {
                    nf = 10;
                }
            }

            return nf * p;
        },

        roundToOrigin: function (value, offset) {
            var rounded_value = value,
            multiplier;

            offset = offset || 1;
            multiplier = Math.pow(10, -offset);
            rounded_value = Math.round(value * multiplier) / multiplier;
            return (rounded_value > this.min) ? this.roundToOrigin(value - this.step) : rounded_value;
        }
    }
  
    Choopy.prototype.defaultOptions = {
        data:'',                                // an array of series or an id related to an html table
        container:'',                           // id of the div which will be contains your graph
        width:640,                              // width of your container
        height:400,                             // height of your container
        auto_adjust:false,                      // if you prefer set the container size in your css
        legend:{
            display:'top',                      // 'top' or 'right' or null
            render: function(string){
                return {
                    font: '10px Helvetica, Arial', 
                    fill: "#333",
                    'font-weight':'bold',
                    text:string
                };
            }
        },
        offset:{                                // offset is to take off the chart from axis
            top:20,         
            right:20,
            bottom:20,
            left:20
        },
        gutter:{                                // gutter set the padding between the chart and the container
            top:10,                             
            right:10,
            bottom:40,                          // bottom...
            left:50                             // and left are bigger because they contains axis legends
        },
        grid:{                                  // tune your grid
            y:{                                 
                range:10,                       // how many horizontal lines do you expect? it gives precisions to your grid but Choopy optimize them.
                startAt:false,                  // fix an initial value (forced to 0 for bar and area charts)
                labels:{
                    draw:true,                  // show labels
                    ticker:true,                // show tickers
                    render:function(string){    // if you want to add a units or something else, it's here
                        return {
                            font: '10px Helvetica, Arial', 
                            fill: "#333",
                            text:string
                        };
                    }
                },
                legend:{
                    text:'Y-values',
                    font: '14px Helvetica, Arial', 
                    'font-weight':'bold',
                    fill: "#333",
                    show:true
                }
            },
            x:{                                 
                labels:{                        
                    draw:true,                  // show labels
                    ticker:true,                // show tickers
                    render:function(string){    // customize your x labels
                        return {
                            font: '10px Helvetica, Arial', 
                            fill: "#333",
                            text:string
                        }
                    }
                },
                legend:{
                    text:'X-values',
                    font: '14px Helvetica, Arial', 
                    fill: "#333",
                    'font-weight':'bold',
                    show:true
                }
            },
            draw:{      
                box:false,                      // draw a bow around your graph
                y:true,                         // draw horizontal lines
                x:false                         // draw vertical lines
            }
            
        },
        textes:{
            axis:{
                
                x:{
                    labels:{
                        font: '10px Helvetica, Arial', 
                        fill: "#333"
                    },
                    legend:{
                        show:true,
                        font: '12px Helvetica, Arial', 
                        fill: "#333"
                    }
                }
            },
            tooltip:{
                title:{
                    font: '12px Helvetica, Arial', 
                    fill: "#fff"
                },
                sub:{
                    font: '10px Helvetica, Arial', 
                    fill: "#fff"
                }
            },
            legend:{
                font: '12px Helvetica, Arial', 
                fill: "#fff"
            }
        },
        tooltip:function(data,x,y){             // customize the value shown on your tooltips
            return {
                title:data.series[x].name,
                sub:data.series[x].data[y]
            }  
        },
        color :{
            serie:['#1589B2','#A2CC06','#CC33CC','#FF9933','#4FAC24','#00CCCC','#FF0066'],
            transverse:"green",
            dot:{
                fill:"#EEE"
            },
            grid:'#333'
        },
        graph:{
            curve:0,                        // make your chart more curved
            dot:{
                normal:4,                   // dot radius in px
                hover:6                     //dot radius in pixel on hover
            },
            line:{
                strokeWidth:4               // line width
            }
        }
    }
    return Choopy;
})();
// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Boomgraph - Line.js                                                │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2012 Antoine Guiral (http://twitter.com/antoineguiral) │ \\
// │ Copyright © 2012 Retent.io (http://retent.io)                      │ \\
// │ http://github.com/retentio/boomgraph                               │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ For the full copyright and license information,                    | \\
// | please view the LICENSE file that was distributed                  | \\
// | with this source code.                                             │ \\
// └────────────────────────────────────────────────────────────────────┘ \\

var Line = (function(){

    

    return function Line(options){
    
        var choopy=new Choopy(options);
    
        choopy.parse();
        choopy.normalize();
        choopy.initDraw();
        choopy.drawGrid();
        var serie;
        var howToScale=function(i,j){
        
            return{
                xScale:choopy.draw.coord.scale.x.step,
                xFactor:0.5+j
            };
        }
        for (var i=0,ii=choopy.data.countSerie; i<ii ; i++){
            //we pick a color form the options
            var currentColor=choopy.options.color.serie[i%choopy.options.color.serie.length];
            serie=choopy.drawLine(i,currentColor,howToScale);
            serie.plots.toFront();
            choopy.draw.sets.series.push(serie.plots);
            choopy.draw.sets.pathes.push(serie.lines);
        }
        for (var i=0,ii=choopy.draw.sets.series.length; i<ii ; i++){
            choopy.hover(choopy.draw.sets.series[i]);
        }
    };

})()// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Boomgraph - Sparckarea.js                                          │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2012 Antoine Guiral (http://twitter.com/antoineguiral) │ \\
// │ Copyright © 2012 Retent.io (http://retent.io)                      │ \\
// │ http://github.com/retentio/boomgraph                               │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ For the full copyright and license information,                    | \\
// | please view the LICENSE file that was distributed                  | \\
// | with this source code.                                             │ \\
// └────────────────────────────────────────────────────────────────────┘ \\

var Sparkarea = function Sparkarea(options){
    
    var choopy=new Choopy(options);
    
    choopy.parse();
    
    var fillLegend=function(ii){
        tmp=[];
        for (var i=0;i<ii;i++){
            tmp.push(i+"")
        }
        return tmp;
    }
    
    
    choopy.data.labels.x= fillLegend(choopy.data.longestSerie);
    choopy.options.graph.dot.normal=0;
    choopy.options.graph.dot.hover=0;
    choopy.options.graph.line.strokeWidth=2;
    choopy.options.legend.display=false;
    choopy.setOptions({
        offset:{        
            top:0,
            right:0,
            bottom:0,
            left:0
        },
        gutter:{
            top:0,
            right:0,
            bottom:0,
            left:0
        }
    });
    choopy.initDraw();
    var serie;
    var howToScale=function(i,j){
        
        return{
            xScale:choopy.draw.coord.scale.x.step,
            xFactor:0.5+j
        };
    }
    for (var i=0,ii=choopy.data.countSerie; i<ii ; i++){
        //we pick a color form the options
        var currentColor=choopy.options.color.serie[i%choopy.options.color.serie.length];
        serie=choopy.drawLine(i,currentColor,howToScale);
        serie.plots.toFront();
        choopy.draw.sets.series.push(serie.plots);
        choopy.draw.sets.pathes.push(serie.lines);
    }
    choopy.fillPathes();
    
};// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Boomgraph - Sparkbar.js                                            │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2012 Antoine Guiral (http://twitter.com/antoineguiral) │ \\
// │ Copyright © 2012 Retent.io (http://retent.io)                      │ \\
// │ http://github.com/retentio/boomgraph                               │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ For the full copyright and license information,                    | \\
// | please view the LICENSE file that was distributed                  | \\
// | with this source code.                                             │ \\
// └────────────────────────────────────────────────────────────────────┘ \\

var Sparkbar = function Sparkbar(options){
    
    var choopy=new Choopy(options);
    
    choopy.parse();
    
    var fillLegend=function(ii){
        tmp=[];
        for (var i=0;i<ii;i++){
            tmp.push(i+"")
        }
        return tmp;
    }
    
    
    choopy.data.labels.x= fillLegend(choopy.data.longestSerie);
    choopy.options.graph.dot.normal=0;
    choopy.options.graph.dot.hover=0;
    choopy.options.graph.line.strokeWidth=2;
    choopy.options.legend.display=false;
    choopy.setOptions({
        offset:{        
            top:0,
            right:0,
            bottom:0,
            left:0
        },
        gutter:{
            top:0,
            right:0,
            bottom:0,
            left:0
        }
    });
    
    choopy.initDraw();
    var serie;
    var howToScale=function(i,j){
        
        return{
            xScale:choopy.draw.coord.scale.x.step,
            xFactor:j
        };
    }
    for (var i=0,ii=choopy.data.countSerie; i<ii ; i++){
        //we pick a color form the options
        var currentColor=choopy.options.color.serie[i%choopy.options.color.serie.length];
        serie=choopy.drawColumns(i,currentColor,howToScale);
        serie.toFront();
        choopy.draw.sets.series.push(serie.plots);
        choopy.draw.sets.pathes.push(serie.lines);
    }
    
};// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Boomgraph - Sparkline.js                                           │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2012 Antoine Guiral (http://twitter.com/antoineguiral) │ \\
// │ Copyright © 2012 Retent.io (http://retent.io)                      │ \\
// │ http://github.com/retentio/boomgraph                               │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ For the full copyright and license information,                    | \\
// | please view the LICENSE file that was distributed                  | \\
// | with this source code.                                             │ \\
// └────────────────────────────────────────────────────────────────────┘ \\

var Sparkline = function Sparkline(options){
    
    var choopy=new Choopy(options);
    
    choopy.parse();
    
    var fillLegend=function(ii){
        tmp=[];
        for (var i=0;i<ii;i++){
            tmp.push(i+"");
        }
        return tmp;
    }
    
    
    choopy.data.labels.x= fillLegend(choopy.data.longestSerie);
    choopy.options.graph.dot.normal=0;
    choopy.options.graph.dot.hover=0;
    choopy.options.graph.line.strokeWidth=2;
    choopy.options.legend.display=false;
    choopy.setOptions({
        offset:{        
            top:0,
            right:0,
            bottom:0,
            left:0
        },
        gutter:{
            top:0,
            right:0,
            bottom:0,
            left:0
        }
    });
    choopy.initDraw();
    var serie;
    var howToScale=function(i,j){
        
        return{
            xScale:choopy.draw.coord.scale.x.step,
            xFactor:0.5+j
        };
    }
    for (var i=0,ii=choopy.data.countSerie; i<ii ; i++){
        //we pick a color form the options
        var currentColor=choopy.options.color.serie[i%choopy.options.color.serie.length];
        serie=choopy.drawLine(i,currentColor,howToScale);
        serie.plots.toFront();
        choopy.draw.sets.series.push(serie.plots);
        choopy.draw.sets.pathes.push(serie.lines);
    }
    
};