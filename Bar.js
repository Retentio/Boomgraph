// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Boomgraph - Bar.js                                                 │ \\
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

var Bar = function Bar(options){
    
    var choopy=new Choopy(options)
    
    choopy.parse()
    choopy.normalize()
    choopy.initDraw()
    choopy.drawGrid()
    choopy.drawLabelX()
    var howToScale=function(i,j){
        return{
            xScale:choopy.draw.coord.scale.x.step/choopy.data.longestSerie,
            xFactor:i+j*choopy.data.longestSerie+0.5
        }
    }
    
    var serie;
    for (var i=0,ii=choopy.data.countSerie; i<ii ; i++){
        //we pick a color form the options
        var currentColor=choopy.options.color.serie[i%choopy.options.color.serie.length]
        serie=choopy.drawColumns(i,currentColor,howToScale)
        serie.toFront()
        choopy.draw.sets.series.push(serie)
    }
    for (var i=0,ii=choopy.draw.sets.series.length; i<ii ; i++){
        choopy.hover(choopy.draw.sets.series[i])
    }
}