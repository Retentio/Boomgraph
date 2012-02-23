// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Boomgraph - Sparkbar.js                                            │ \\
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

var Sparkbar = function Sparkbar(options){
    
    var choopy=new Choopy(options)
    
    choopy.parse()
    
    var fillLegend=function(ii){
                             tmp=[]
                             for (var i=0;i<ii;i++){
                                 tmp.push(i+"")
                             }
                             return tmp;
                         }
    
    
    choopy.data.labels.x= fillLegend(choopy.data.longestSerie)
    choopy.options.graph.dot.normal=0
    choopy.options.graph.dot.hover=0
    choopy.options.graph.line.strokeWidth=2
    choopy.setOptions({offset:{        
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
        }})
    
    choopy.initDraw()
    var serie;
    var howToScale=function(i,j){
        
        return{
            xScale:choopy.draw.coord.scale.x.step,
            xFactor:j
        }
    }
    for (var i=0,ii=choopy.data.countSerie; i<ii ; i++){
        //we pick a color form the options
        var currentColor=choopy.options.color.serie[i%choopy.options.color.serie.length]
        serie=choopy.drawColumns(i,currentColor,howToScale)
        serie.toFront()
        choopy.draw.sets.series.push(serie.plots)
        choopy.draw.sets.pathes.push(serie.lines)
    }
    
}