// ┌────────────────────────────────────────────────────────────────────┐ \\
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
    
};