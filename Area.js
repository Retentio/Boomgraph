var Area = function Area(options){
    
    
   
    
    var choopy=new Choopy(options)
    
    choopy.parse()
    choopy.normalize()
    choopy.initDraw()
    
    choopy.options.graph.dot.normal=0
    choopy.options.graph.dot.hover=0
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
    choopy.fillPathes()
}
