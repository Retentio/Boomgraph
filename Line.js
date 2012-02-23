// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Boomgraph - Line.js                                                │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2012 Antoine Guiral (http://twitter.com/antoineguiral) │ \\
// │ Copyright © 2012 Retent.io (http://retent.io)                      │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the Apache License, Version 2.0 (the "License");    │ \\
// | you may not use this file except in compliance with the License.   │ \\
// | You may obtain a copy of the License at                            │ \\
// |                                                                    │ \\
// | http://www.apache.org/licenses/LICENSE-2.0                         │ \\
// └────────────────────────────────────────────────────────────────────┘ \\
var Line = function Line(options){
    
    var choopy=new Choopy(options)
    
    choopy.parse()
    choopy.normalize()
    choopy.initDraw()
    choopy.drawGrid()
    choopy.drawLabelX()
    var serie;
    var howToScale=function(i,j){
        
        return{
            xScale:choopy.draw.coord.scale.x.step,
            xFactor:0.5+j
        }
    }
    for (var i=0,ii=choopy.data.countSerie; i<ii ; i++){
        //we pick a color form the options
        var currentColor=choopy.options.color.serie[i%choopy.options.color.serie.length]
        serie=choopy.drawLine(i,currentColor,howToScale)
        serie.plots.toFront()
        choopy.draw.sets.series.push(serie.plots)
        choopy.draw.sets.pathes.push(serie.lines)
    }
    for (var i=0,ii=choopy.draw.sets.series.length; i<ii ; i++){
        choopy.hover(choopy.draw.sets.series[i])
    }
}