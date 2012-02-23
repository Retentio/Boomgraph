// ┌────────────────────────────────────────────────────────────────────┐ \\
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

Raphael.fn.drawGrid = function (x, y, w, h, wv,scale,numTickerY,drawbox, color) {
    color = color || "#000";
    if(drawbox){
        var path = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w-2) + .5, Math.round(y) + .5, Math.round(x + w-2) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5]
    }else{
        var path=[]
    }  
    var minValue=Math.round(scale.y.minValue),
    maxValue=Math.round(scale.y.maxValue),
    rowHeight = (h) / (numTickerY),
    step=(maxValue-minValue)/numTickerY
 
    for (var i = 0; i <= numTickerY; i++) {
        
        if(i<numTickerY){
            for(var j = 0,jj=w/3;j<jj;j++){
                if(j%2==0 ){
                    path = path.concat(["M", x + j*3, Math.round(y + i * rowHeight) + .5, "l", 3, 0]);
                }
            }
        }else{
            path = path.concat(["M", x, Math.round(y + i * rowHeight) + .5, "l", w, 0]);
        }
        
        
        var yL = Math.round(Math.round(y + i * rowHeight))
        var t = this.text(15,yL, Math.round((step*(numTickerY-i)+minValue)*100)/100).attr({
            font: '12px Helvetica, Arial', 
            fill: color
        }).toBack();
    }
    

    return this.path(path.join(",")).attr({
        stroke: color,
        opacity:0.3
    });
};


Raphael.el.isAbsolute=!0;

Raphael.el._last={
    x:0,
    y:0
};
Raphael.el.absolutely=function(){
    this.isAbsolute=1;
    return this
};
Raphael.el.relatively=function(){
    this.isAbsolute=0;
    return this
};
Raphael.el.moveTo=function(a,b){
    this._last={
        x:a,
        y:b
    };
    return this.attr({
        path:this.attrs.path+["m","M"][+this.isAbsolute]+parseFloat(a)+" "+parseFloat(b)
    })
};
Raphael.el.lineTo=function(a,b){
    this._last={
        x:a,
        y:b
    };
    
    return this.attr({
        path:this.attrs.path+["l","L"][+this.isAbsolute]+parseFloat(a)+" "+parseFloat(b)
    })
};
Raphael.el.cplineTo=function(a,b,c){
    if(a>this._last.x){
        this.attr({
            //            path:this.attrs.path+["Q",this._last.x+c,this._last.y,a,b]
            path:this.attrs.path+["S",a-c,b,a,b]
        //            path:this.attrs.path+["C",this._last.x+c,this._last.y,a-c,b,a,b]
        })
    }else{
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
    
    return this
};
Raphael.el.andClose=function(){
    return this.attr({
        path:this.attrs.path+"z"
    })
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

    
    var Choopy=function Choopy(newOptions){
        if(Object.prototype.toString.call(newOptions) == '[object Undefined]' || Object.prototype.toString.call(newOptions.data) == '[object Undefined]' || newOptions['data'] == '' || Object.prototype.toString.call(newOptions.data) == '[object Undefined]'  || newOptions.container == ''){
            throw new Error('Empty data source or container is not allowed');
        }else{
            var divContainer=document.getElementById(newOptions.container)
            if(divContainer==null){
                throw new Error('There is no div container with this id :'+ newOptions.container);
            }else{
                var options=this.utils.extend(this.utils.extend({},this.defaultOptions),newOptions)
                this.options=(
                    function(){
                        return options
                    }
                    )(options)
                    
                    
                this.data={
                    raws:[],
                    series:[],
                    labels:{
                        x:[]
                    },
                    longestSerie:0,
                    countSerie:0
                }
            
                if(this.options.height<=0 || this.options.width<=0){
                    throw new Error('Height and/or width needs to be superior to 0')
                }else{
                    var r=Raphael(this.options.container, this.options.width, this.options.height)
                }
                
            
                this.draw={
                    r:r,
                    sets:{
                        series:[],
                        transverses:[],
                        pathes:[],
                        legend:{
                            x:[]
                        }
                    },
                    matrice:{},
                    dots:[],
                    tooltips:{},
                    grid:null,
                    coord:{
                        scale:{
                            y:{
                                minValue:0,
                                maxValue:0,
                                step:0
                            },
                            x:{
                                step:0
                            }
                        },
                        origin:{
                            X:0,
                            Y:0
                        },
                        bound:{
                            yMin:0,
                            yMax:0
                        }
                    }
                }
            }
        }
    }

    Choopy.prototype.setOptions=function(options){

        //config
        this.options=this.utils.extend(this.options,options)
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
    Choopy.prototype.parse=function(){
    
        if(Object.prototype.toString.call(this.options.data) == '[object Array]'){
            if(this.options.data.length==0){
                throw new Error('options.data shouldn\'t be empty')
            }else{
                this.data.longestSerie=0
                for(var i=0,ii=this.options.data.length;i<ii;i++){
                    if(this.options.data[i].name=='x-label'){
                        if(Object.prototype.toString.call(this.options.data[i].data) == '[object Function]'){
                            this.data.labels.x=this.options.data[i].data()
                        }else{
                            this.data.labels.x=this.options.data[i].data
                        }
                    }else{
                        this.options.data[i].name=this.utils.trim(this.options.data[i].name)
                        this.data.series.push(this.options.data[i])
                        if(this.options.data[i].data.length>this.data.longestSerie){
                            this.data.longestSerie=this.options.data[i].data.length
                        }
                    }
                }
                
                if(this.data.labels.x.length>0){
                    this.data.countSerie=ii-1
                }else{
                    var generateXLabels=function(longestSerie){
                        var l=[]
                        for (var i=0,ii=longestSerie;i<ii;i++){
                            l.push(i)
                        }
                        return l
                    }
                    this.data.labels.x=generateXLabels(this.data.longestSerie)
                    this.data.countSerie=ii
                }
                if(this.data.countSerie==0){
                    throw new Error('you should pass at least one serie')
                }
            }
            
        }else if(Object.prototype.toString.call(this.options.data) == '[object String]'){
            var table=document.getElementById(this.options.data)
            if(table==null){
                throw new Error('No data provided. Check if the id match a well formed html table')
            }else{
                var values=[]

                var trs=table.getElementsByTagName('tr')
                for(var i= 0; i < trs.length; i++) {
                    var tdsValues=[]
                    var tr=trs[i]
                    if(tr.getElementsByTagName('th')){
                        
                        var tds=tr.getElementsByTagName('th')
                        for(var j=0,jj=tds.length;j<jj;j++){
                            tdsValues.push(this.utils.trim(tds[j].textContent))
                        }
                    }
                    if(tr.getElementsByTagName('td')){
                        var tds=tr.getElementsByTagName('td')
                        for(var j=0,jj=tds.length;j<jj;j++){
                            tdsValues.push(this.utils.trim(tds[j].textContent))
                        }
                    }
                    values.push(tdsValues)
                }
                this.data.raws=values
            }
        }else{
            throw new Error('options.data should be an array of series or an id')
        }
    }

    /**
 * Choopy.transversalize reverses lines and columns of the data.raws matrice.
 * 
 */
    Choopy.prototype.transversalize=function(){
        var values=this.data.raws
    
        var tmp=[]
        for(var i= 0,ii=values.length; i < ii; i++) {
        
            for(var j= 0,jj=values[i].length; j < jj; j++) {
                if(i==0){
                    tmp.push([])
                }    
                tmp[j][i]=values[i][j]
            }
        }
        this.data.raws=tmp    
    }

    /**
 * Choopy.normalize fills data.series and data.labels.x with data.raws.
 * data.countSerie and data.longestSerie will be set up too
 * 
 */
    Choopy.prototype.normalize=function(){
        var values=this.data.raws
        if(values.length==1){
            var serie={
                name:'',
                data:[]
            }
            this.data.series.push(serie)
            for(var j= 0,jj=values[0].length; j < jj; j++) {
                    
                if(j==0){
                    this.data.series[0].name=values[0][j]
               
                }else{
                    this.data.series[0].data.push(values[0][j])
                }
            }
            this.data.longestSerie=values[0].length-1
            this.data.countSerie=1
            var generateXLabels=function(longestSerie){
                var l=[]
                for (var i=0,ii=longestSerie;i<ii;i++){
                    l.push(i)
                }
                return l
            }
            this.data.labels.x=generateXLabels(this.data.longestSerie)
                
        }else{
            for(var i= 0,ii=values.length; i < ii; i++) {
                if(i>0 ){
                    var serie={
                        name:'',
                        data:[]
                    }
                    this.data.series.push(serie)
                }
        
                for(var j= 0,jj=values[i].length; j < jj; j++) {
                    if(i==0 ){
                        if(j>0){
                            this.data.labels.x.push(values[i][j])
                        }
                
                    }else{
                        if(j==0){
                            this.data.series[i-1].name=values[i][j]
               
                        }else{
                            this.data.series[i-1].data.push(values[i][j])
                        }
                        if(this.data.longestSerie<(jj-1)){
                            this.data.longestSerie=jj-1
                        }
                    }
                
                }
            }
            this.data.countSerie=this.data.series.length
        }
        
    }

    /**
 * Choopy.initDraw set up draw.coord values (scalling and origin)
 * 
 */
    Choopy.prototype.initDraw=function(){
    
        //origin
        this.draw.coord.origin.X=this.options.offset.left+this.options.gutter.left+.5
        this.draw.coord.origin.Y=this.options.gutter.top
    
        //scaling
        var maxValue=this.data.series[0].data[0],minValue=maxValue;
        if(this.options.grid.y.startAt!==false){
            minValue=this.options.grid.y.startAt
        }
        for(var i= 0; i < this.data.series.length; i++) {
            for(var j= 0; j < this.data.series[i].data.length; j++) {
                tmp=parseFloat(this.data.series[i].data[j])
                if(tmp>maxValue){
                    maxValue=tmp
                }
                if(tmp<minValue){
                    minValue=tmp
                }
            
            }
        }
    
        var yMin=minValue,
        yMax=maxValue,
        yStep=(maxValue-minValue)/this.options.grid.y.range;
    
        //enlarge min & max values by one yStep to get bottom and top margin
        if(this.options.grid.y.startAt===false){
            yMin-=yStep;
        }
        yMax+=yStep;
        yStep=(yMax-yMin)/this.options.grid.y.range;
    
   
        this.draw.coord.scale.y.minValue=yMin
        this.draw.coord.scale.y.maxValue=yMax
        this.draw.coord.scale.y.step=(this.options.height - this.options.gutter.top - this.options.gutter.bottom)/(yMax-yMin)
        this.draw.coord.scale.x.step=(this.options.width-(this.options.offset.left+this.options.offset.right)-(this.options.gutter.left+this.options.gutter.right))/this.data.labels.x.length

    }

    /**
 * Choopy.drawGrid 
 * 
 */
    Choopy.prototype.drawGrid=function(){
        var x=this.options.gutter.left + .5, 
        y=this.options.gutter.top + .5, 
        w=this.options.width - (this.options.gutter.left + this.options.gutter.right), 
        h=this.options.height - this.options.gutter.top - this.options.gutter.bottom, 
        wv=this.data.countSerie*this.data.labels.x.length, 
        numTickerY=this.options.grid.y.range,
        scale=this.draw.coord.scale,
        color=this.options.color.grid,
        drawbox=this.options.grid.drawbox
        
        this.draw.grid=this.draw.r.drawGrid(x, y, w, h, wv,scale,numTickerY,drawbox, color);
           
    }

    /**
 * Choopy.drawLabelX draw the x axis labels.
 * Data come from the data.labels.x array
 * It set the raphael draw.sets.legend.x
 */
    Choopy.prototype.drawLabelX=function(){
    
        var labels=this.draw.r.set()
        for (var i=0,ii=this.data.labels.x.length; i<ii ; i++){
            if(i%this.options.grid.ticker.x==0 || this.options.grid.ticker.x===false){
                var x = this.draw.coord.origin.X  + this.draw.coord.scale.x.step * (i + .5)
                var t = this.draw.r.text(x, this.options.height - 6, this.data.labels.x[i]).attr(this.options.textes.axis).toBack();
                labels.push(t)
            }
        }
        this.draw.sets.legend.x=labels;
    }

    Choopy.prototype.drawLine=function(idSerie,color,howToScale){
        var serie=this.draw.r.set()
        var values=this.data.series[idSerie].data
        for (var j=0,jj=values.length; j<jj ; j++){
            var yVal=values[j]
            var xScaling=howToScale(idSerie,j)
            //this is based on how we draw the grid (important to keep y scaling consistent)
            var yDot=this.draw.coord.origin.Y+(this.draw.coord.scale.y.step * (this.draw.coord.scale.y.maxValue-yVal))
            var xDot = this.draw.coord.origin.X + (xScaling.xFactor) * xScaling.xScale 
            var dot = this.draw.r.circle(xDot, yDot, this.options.graph.dot.normal).attr({
                fill: this.options.color.dot.fill, 
                stroke: color, 
                "stroke-width": 2
            });
            serie.push(dot)
            this.draw.matrice[dot.id]={
                id:dot.id,
                serieSetId:idSerie,
                transverseSetId:j
            }
            this.draw.dots.push({
                id:dot.id,
                dot:dot,
                x:idSerie,
                y:j
            })
            
            this.draw.tooltips[dot.id]=this.drawTooltipForPlot(dot, idSerie, j)
            
            if(typeof this.draw.sets.transverses[j] === 'undefined' ){
                var transverse=this.draw.r.set()
                transverse.push(dot)
                this.draw.sets.transverses.push(transverse)
            }else{
                this.draw.sets.transverses[j].push(dot)
            }
        }
        pathes=this.joinPlots(idSerie,serie)
        return {
            'plots':serie,
            'lines':pathes
        }
    }
    
    Choopy.prototype.joinPlots=function(idSerie,serie){
        var pathes,p;
        //pour chaque cohort
    
        var currentColor=serie[0].attrs.stroke
        pathes=this.draw.r.set()

        var path=this.draw.r.path()
        for (var j=0,jj=serie.length; j<jj ; j++){
            if(j===0){
                path.moveTo(serie[j].attrs.cx, serie[j].attrs.cy)
            }else{
                if(this.options.graph.curve){
                    path.cplineTo(serie[j].attrs.cx, serie[j].attrs.cy,this.options.graph.curve)
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
        serie.toFront()
        pathes.push(path)
        return pathes;
    }

    Choopy.prototype.drawColumns=function(idSerie,color,howToScale){
        var serie=this.draw.r.set()
        var values=this.data.series[idSerie].data
        for (var j=0,jj=values.length; j<jj ; j++){
            var yVal=values[j]
            
            var xScaling=howToScale(idSerie,j)
            var yBottom=this.draw.coord.origin.Y+(this.draw.coord.scale.y.step * (this.draw.coord.scale.y.maxValue-Math.max(0,this.draw.coord.scale.y.minValue)))+1
            var yTop=this.draw.coord.origin.Y+(this.draw.coord.scale.y.step * (this.draw.coord.scale.y.maxValue-yVal))
            var yValueToZero=Math.abs(yTop-yBottom)
            var xLeft=this.draw.coord.origin.X + (xScaling.xFactor) * xScaling.xScale
            var rect=this.draw.r.rect(xLeft, Math.min(yTop, yBottom), xScaling.xScale-2, yValueToZero).attr({
                fill:color,
                stroke:color,
                'stroke-width':0
            })
            
            serie.push(rect)
            this.draw.matrice[rect.id]={
                id:rect.id,
                serieSetId:idSerie,
                transverseSetId:j
            }
            this.draw.dots.push({
                id:rect.id,
                dot:rect,
                x:idSerie,
                y:j
            })
            
            this.draw.tooltips[rect.id]=this.drawTooltipForColumn(rect, idSerie, j)
            
            if(typeof this.draw.sets.transverses[j] === 'undefined' ){
                var transverse=this.draw.r.set()
                transverse.push(rect)
                this.draw.sets.transverses.push(transverse)
            }else{
                this.draw.sets.transverses[j].push(rect)
            }
        }
        return serie
    }

    Choopy.prototype.drawTooltipForPlot=function(plot,x,y){
        var ppp,textLabel;
    
        textLabel=this.draw.r.set()
        var title=this.draw.r.text(160, 0, "").attr({'text':this.options.tooltip(this.data,x,y).title+'\n'+this.options.tooltip(this.data,x,y).sub}).attr(this.options.textes.tooltip.title)
        
        textLabel.push(title)

        var side = "right";
            
        var xPPP=plot.attrs.cx+4,
        yPPP=plot.attrs.cy;
            
        if (plot.attrs.cx + textLabel.getBBox().width > this.options.width) {
            side = "left";
            xPPP-=8
        }
        ppp = this.draw.r.popup(xPPP,yPPP ,textLabel,side,true)
        var tooltip=this.draw.r.path().attr({
            path:ppp.path,
            fill: "#000", 
            stroke: "#666", 
            "stroke-width": 2, 
            "fill-opacity": .7
        }).translate(ppp.dx, ppp.dy)
        textLabel.translate(ppp.dx, ppp.dy).toFront()
        return this.draw.r.set(tooltip,textLabel).hide()

/**
 *
 *  Not working on chrome, but have custom title/subtitle style
 *
 **/
//        var textLabelF=this.draw.r.set()
//        var titleF=this.draw.r.text(160, 10, '').attr({'text':this.options.tooltip(this.data,x,y).title}).attr(this.options.textes.tooltip.title)
//        var subtitleF=this.draw.r.text(160, 27, '').attr({'text':this.options.tooltip(this.data,x,y).sub}).attr(this.options.textes.tooltip.sub)
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
//        ppp = this.draw.r.popup(xPPP,yPPP ,textLabelF,side).attr({
//            fill: "#000", 
//            stroke: "#666", 
//            "stroke-width": 2, 
//            "fill-opacity": .7
//        })
//        
//      
//       
//        return this.draw.r.set(ppp,textLabelF).hide()
        
    }
    
    Choopy.prototype.drawTooltipForColumn=function(column,x,y){
        
        var ppp,textLabel;
    
        textLabel=this.draw.r.set()
        var title=this.draw.r.text(160, 0, "").attr({'text':this.options.tooltip(this.data,x,y).title+'\n'+this.options.tooltip(this.data,x,y).sub}).attr(this.options.textes.tooltip.title)
        
        textLabel.push(title)

        var side = "top";
            
        var xPPP=column.attrs.x+column.attrs.width/2,
        yPPP=column.attrs.y-1;
            
        if (column.attrs.cy - textLabel.getBBox().height <0) {
            side = "bottom";
            xPPP+=2
        }
        ppp = this.draw.r.popup(xPPP,yPPP ,textLabel,side,true)
        var tooltip=this.draw.r.path().attr({
            path:ppp.path,
            fill: "#000", 
            stroke: "#666", 
            "stroke-width": 2, 
            "fill-opacity": .7
        }).translate(ppp.dx, ppp.dy)
        textLabel.translate(ppp.dx, ppp.dy).toFront()
        return this.draw.r.set(tooltip,textLabel).hide()

/**
 *
 *  Not working on chrome, but have custom title/subtitle style
 *
 **/
        
//        var ppp,textLabel;
//        textLabel=this.draw.r.set()
//        textLabel.push(this.draw.r.text(60, 12, this.options.tooltip(this.data,x,y).title).attr(this.options.textes.tooltip.title))
//        textLabel.push(this.draw.r.text(60, 27, this.options.tooltip(this.data,x,y).sub).attr(this.options.textes.tooltip.sub))
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
//        ppp = this.draw.r.popup(xPPP,yPPP ,textLabel,side).attr({
//            fill: "#000", 
//            stroke: "#666", 
//            "stroke-width": 2, 
//            "fill-opacity": .7
//        })
//        return this.draw.r.set(ppp,textLabel).hide()
        
    }

    Choopy.prototype.fillPathes=function(){
        var zero=this.draw.coord.origin.Y+(this.draw.coord.scale.y.step * (this.draw.coord.scale.y.maxValue-0))+1.5

        for(var i=0;i<this.draw.sets.pathes.length;i++ ){
            
                if(this.draw.sets.pathes[i][0].type=='path'){
                    var oldcolor=this.draw.sets.pathes[i][0].attrs.stroke
                    var bgp=this.draw.sets.pathes[i][0].attrs.path
                    
                    bgp.push(['L',bgp[bgp.length-1][1], zero])
                    bgp.push(['L',bgp[0][1] , zero])

                    var bgpath=this.draw.r.path().attr({
                        path:bgp,
                        fill: oldcolor, 
                        stroke: oldcolor, 
                        opacity: .4,
                        "stroke-width": 0, 
                        "stroke-linejoin": "round"
                    })
                }
                
            this.draw.sets.pathes[i].push(bgpath)
        }
    
    
    }
    
    Choopy.prototype.sortSeries=function(){
        var s=this.draw.sets.series
        var sP=this.draw.sets.pathes

        var avgValuePerSerie=[]
    
        for(var i=0;i<this.data.series.length;i++ ){
            var avgValue=0
            for(var j=0;j<this.data.series[i].data.length;j++ ){
                
               
                avgValue+=parseInt(this.data.series[i].data[j])
            }
            avgValue=avgValue/this.data.series[i].data.length
            avgValuePerSerie.push({idSerie:i,value:avgValue})
        }
        function compare(a,b) {
            if (a.value < b.value)
                return 1;
            if (a.value > b.value)
                return -1;
            return 0;
        }
        avgValuePerSerie.sort(compare)
        for(var k=0,kk=avgValuePerSerie.length;k<kk;k++){
             sP[avgValuePerSerie[k].idSerie].toFront()
             s[avgValuePerSerie[k].idSerie].toFront()
        }
        
        
    }
    
    Choopy.prototype.drawTransverses=function(){
        var p;
     
        for(i=0;i<this.draw.sets.transverses.length;i++){
            p=['M']
            for(j=0,jj=this.draw.sets.transverses[i].items.length-1;j<jj;j++){
           
                var thisDot=this.draw.sets.transverses[i].items[j].attrs
                var nextDot=this.draw.sets.transverses[i].items[j+1].attrs
                if (j==0) {
                    p = p.concat(["M", thisDot.cx, thisDot.cy, "L"]);
            
                }
                p = p.concat([ thisDot.cx, thisDot.cy,nextDot.cx, nextDot.cy]);
            
            }
            var path=this.draw.r.path(p).attr({
                stroke: this.options.color.transverse, 
                "stroke-width": this.options.graph.line.strokeWidth, 
                "stroke-linejoin": "round"
            }).hide().toBack();
            this.draw.sets.transverses[i].push(path)
        }
        if(this.draw.grid){
            this.draw.grid.toBack()
        }
        
    }
    
    Choopy.prototype.hover=function(elem){
        var self=this
        elem.hover(function(){
       
            if(this.type=='circle'){
                this.attr('r',self.options.graph.dot.hover)
                self.draw.tooltips[this.id].show().toFront()
            }
            if(this.type=='rect'){
                this.attr('fill-opacity',0.7)
                self.draw.tooltips[this.id].show().toFront()
            }
        },function(){
        
            if(this.type=='circle'){
                this.attr('r',self.options.graph.dot.normal)
                self.draw.tooltips[this.id].hide()
            }
            if(this.type=='rect'){
                this.attr('fill-opacity',1)
                self.draw.tooltips[this.id].hide()
            }
        })
    }
    
    Choopy.prototype.utils={
        trim:function (str) {
            var	str = str.replace(/^\s\s*/, ''),
            ws = /\s/,
            i = str.length;
            while (ws.test(str.charAt(--i)));
            return str.slice(0, i + 1);
        },
        extend:function(a,b){
            for (var property in b){
                if(a[property]){
                    if(Object.prototype.toString.call(b[property]) == '[object Object]'){
                        a[property]=this.extend(a[property],b[property])
                    }else{
                        a[property] = b[property];
                    }
                }else{
                    a[property] = b[property];
                }
            }
            return this.clone(a)
        },
        clone :function clone(srcInstance){
            if(typeof(srcInstance) != 'object' || srcInstance == null){
                return srcInstance;
            }
            var newInstance = srcInstance.constructor();
            for(var i in srcInstance){
                newInstance[i] = clone(srcInstance[i]);
            }
            return newInstance;
        },
        niceNumber : function(a,b){
            var c=Math.floor(Math.LOG10E*Math.log(a)),d;
            c=c<0?parseFloat(Math.pow(10,c).toFixed(Math.abs(c))):Math.pow(10,
                c);
            d=a/c;
            return(b?d<1.5?1:d<3?2:d<7?5:10:d<=1?1:d<=2?2:d<=5?5:10)*c
        }
    }
  
    Choopy.prototype.defaultOptions={
        data:'',
        container:'',
        width:600,
        height:400,
        offset:{        
            top:20,
            right:20,
            bottom:20,
            left:20
        },
        gutter:{
            top:30,
            right:30,
            bottom:30,
            left:30
        },
        grid:{
            y:{
                range:10,
                startAt:false
            },
            ticker:{
                x:false
            },
            drawbox:false
        },
        textes:{
            axis:{
                font: '10px Helvetica, Arial', 
                fill: "#333"
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
            }
        },
        tooltip:function(data,x,y){
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
            curve:0,
            dot:{
                normal:4,
                hover:6
            },
            line:{
                strokeWidth:4
            }
        }
    }
    return Choopy
})()
