


$(document).ready(function(){
    
    module('Choopy.constructor()')
    
    test("If no options given", function() {
        raises(function() {
            new Choopy()
        },
        function(err) {
            return err.message === 'Empty data source or container is not allowed';
        },'must throw error with message : Empty data source or container is not allowed')
        
    });
    test("If empty options given", function() {
        raises(function() {
            new Choopy({})
        },
        function(err) {
            return err.message === 'Empty data source or container is not allowed';
        },'must throw error with message : Empty data source or container is not allowed')
    });
    test("If options given but empty data", function() {
        raises(function() {
            new Choopy({
                data:''
            })
        },
        function(err) {
            return err.message === 'Empty data source or container is not allowed';
        },'must throw error with message : Empty data source or container is not allowed')
    });
    test("If options given but no data", function() {
        raises(function() {
            new Choopy({
                graph:''
            })
        },
        function(err) {
            return err.message === 'Empty data source or container is not allowed';
        },'must throw error with message : Empty data source or container is not allowed')
    });
    test("If options given but empty container", function() {
        raises(function() {
            new Choopy({
                container:''
            })
        },
        function(err) {
            return err.message === 'Empty data source or container is not allowed';
        },'must throw error with message : Empty data source or container is not allowed')
    });
    test("If options given but no container", function() {
        raises(function() {
            new Choopy({
                graph:''
            })
        },
        function(err) {
            return err.message === 'Empty data source or container is not allowed';
        },'must throw error with message : Empty data source or container is not allowed')
    });
    test("If options given (data included) but wrong container", function() {
        raises(function() {
            new Choopy({
                data:'data',
                container:'toto'
            })
        },
        function(err) {
            return err.message === 'There is no div container with this id :toto';
        },'must throw error with message : There is no div container with this id :toto')
    });
    

    test("if a truncated set is given, all Choopy.options properties should be there", function() {
        
        var c= new Choopy({
            data:'data',
            container:'container'
        })
        var recursive=function(ref,comp,prevKey){
            $.each(ref, function(key) {
                var actualKey=prevKey+'.'+key
                ok( typeof comp[key]==typeof ref[key], " options has the property : "+actualKey );
                if(typeof ref[key] == 'object'){
                    recursive(ref[key],comp[key],actualKey)
                }
            });
        }
        recursive(c.defaultOptions,c.options,'options')
        
    });

    test("Options are not shared between instances ", function() {
        var o1= new Choopy({
            data:'data',
            container:'container'
        })
        var o2= new Choopy({
            data:'data',
            container:'container'
        })
        
        o2.options.width=2
        
        equal( o1.options.width,o1.defaultOptions.width, "the object1 option is good" );
        equal( o2.options.width,2, "the object2 option is good" );
        notEqual(o1.options.width,o2.options.width, "the object1 and object2 options are differents" );
    });
    
    test("raphael paper created and setted up to choopy.draw.r", function() {
        var c= new Choopy({
            data:'data',
            container:'container'
        })
        var c1= new Choopy({
            data:'data',
            container:'container',
            width:200,
            height:500
        })
        
        equal( c.draw.r.width,c.options.width, "the width of the paper is good (with default options)" );
        equal( c.draw.r.height,c.options.height, "the height of the paper is good  (with default options)" );
        equal( c1.draw.r.width,200, "the width of the paper is good (with custom options)" );
        equal( c1.draw.r.height,500, "the height of the paper is good (with custom options)" );
    });
    
    test("if we give a height and/or width of 0", function() {
     
        
        raises(function() {
            new Choopy({
                data:'data',
                container:'container',
                width:200,
                height:0
            })
        },
        function(err) {
            return err.message === 'Height and/or width needs to be superior to 0';
        },'must throw error with message : Height and/or width needs to be superior to 0')
        
        
        raises(function() {
            new Choopy({
                data:'data',
                container:'container',
                width:0,
                height:200
            })
        },
        function(err) {
            return err.message === 'Height and/or width needs to be superior to 0';
        },'must throw error with message : Height and/or width needs to be superior to 0')
    });

    module('Choopy.setOptions()')
    
    test("if we give new options, they should be setted", function() {
        
        var c= new Choopy({
            data:'data',
            container:'container'
        })
        c.setOptions({
            graph:{
                dot:{
                    normal:0
                }
            }
        })
        var c2= new Choopy({
            data:'data',
            container:'container'
        })
        c2.setOptions({
            graph:{
                dot:{
                    normal:10
                }
            }
        })
        equal( c.options.graph.dot.normal,0, "the options is well changed" );
        equal( c2.options.graph.dot.normal,10, "the options is well changed" );
        notEqual( c2.options.graph.dot.normal,c.options.graph.dot.normal, "options are still not shared between instance" );
        
    });
    
    test("if we give a chunk of new options, all Choopy.options properties should be there", function() {
        
        var c= new Choopy({
            data:'data',
            container:'container'
        })
        c.setOptions({
            graph:{
                dot:{
                    normal:0
                }
            }
        })
        var recursive=function(ref,comp,prevKey){
            $.each(ref, function(key) {
                var actualKey=prevKey+'.'+key
                ok( typeof comp[key]==typeof ref[key], " options has the property : "+actualKey );
                if(typeof ref[key] == 'object'){
                    recursive(ref[key],comp[key],actualKey)
                }
            });
        }
        recursive(c.defaultOptions,c.options,'options')
        
    });
    
    module('Choopy.parse()')
     
    test("if we parse something which is not an array nor an html table (setted up with its id)", function() {
        var c = new Choopy({
            data:function(){
            },
            container:'container'
        })
            
        raises(function() {
            c.parse()
        },
        function(err) {
            return err.message === 'options.data should be an array of series or an id';
        },'must throw error with message : options.data should be an array of series or an id')
        
    });
    
    test("if we parse an array it shouldn't be empty", function() {
        var c = new Choopy({
            data:[[5],[6]],
            container:'container'
        })
        c.options.data=[]    
        raises(function() {
            c.parse()
        },
        function(err) {
            return err.message === 'options.data shouldn\'t be empty';
        },'must throw error with message : options.data shouldn\'t be empty')
        
    });
    
    test("if we parse an array with only one serie called x-label", function() {
        
        var dataXLabels=[1,2,3,4,5,6]
        
        var c = new Choopy({
            data:[{
                name:'x-label',
                data:dataXLabels
            }],
            container:'container'
        })
        raises(function() {
            c.parse()
        },
        function(err) {
            return err.message === 'you should pass at least one serie';
        },'must throw error with message : you should pass at least one serie')
        
        equal( c.data.labels.x.length,dataXLabels.length, "the x-axis labels are setted" );
    });
    
    test("if we parse an array with only one serie called x-label which is a function", function() {
        
        var dataXLabels=function(){
            return [1,2,3,4,5,6]
        }
        
        var c = new Choopy({
            data:[{
                name:'x-label',
                data:dataXLabels
            }],
            container:'container'
        })
        raises(function() {
            c.parse()
            
        },
        function(err) {
            return err.message === 'you should pass at least one serie';
        },'must throw error with message : you should pass at least one serie')
        
        equal( c.data.labels.x.length,dataXLabels().length, "the x-axis labels are setted" );
    });
    
    test("if we parse an array with one data serie and no x labels", function() {
        
        var dataFirstSerie=[null,2,3,4,5,6]
        
        var c = new Choopy({
            data:[{
                name:' 1st serie ',
                data:dataFirstSerie
            }],
            container:'container'
        })
        
        c.parse()
        
        equal( c.data.labels.x.length,dataFirstSerie.length, "the x-axis labels are setted" );
        equal( c.data.series.length,1, "there is one serie" );
        equal( c.data.series[0].name,'1st serie', "the serie have the right name (trimed)" );
        equal( c.data.countSerie,c.data.series.length, "data.countSerie is well setted" );
        equal( c.data.longestSerie,c.data.series[0].data.length, "data.longestSerie is well setted" );
    });
    
    test("if we parse an array with one data serie and one called x-label", function() {
        
        var dataXLabels=[1,2,3,4,5,6]
        var dataFirstSerie=[null,2,3,4,5,6]
        var c = new Choopy({
            data:[{
                name:'x-label',
                data:dataXLabels
            },{
                name:' 1st serie ',
                data:dataFirstSerie
            }],
            container:'container'
        })
        
        c.parse()
        
        equal( c.data.labels.x.length,dataXLabels.length, "the x-axis labels are setted" );
        equal( c.data.series.length,1, "there is one serie" );
        equal( c.data.series[0].name,'1st serie', "the serie have the right name (trimed)" );
        equal( c.data.countSerie,c.data.series.length, "data.countSerie is well setted" );
        equal( c.data.longestSerie,c.data.series[0].data.length, "data.longestSerie is well setted" );
    });
    
    test("if we give a wrong id", function() {
        
        var c = new Choopy({
            data:'toto',
            container:'container'
        })
        
        raises(function() {
            c.parse()
            
        },
        function(err) {
            return err.message === 'No data provided. Check if the id match a well formed html table';
        },'must throw error with message : No data provided. Check if the id match a well formed html table')
        
    });
    test("if we give an id", function() {
        
        var tableId='fixture-data'
        var table=document.getElementById(tableId)
        
        var c = new Choopy({
            data:tableId,
            container:'container'
        })
        
        c.parse()
        equal( c.data.raws.length,table.getElementsByTagName('tr').length, "all the table's rows have been parsed" );
        for(var i=0,ii=table.getElementsByTagName('tr').length;i<ii;i++){
            var tr=table.getElementsByTagName('tr')[i]
            if(tr.getElementsByTagName('th')){
                for(var j=0,jj=tr.getElementsByTagName('th').length;j<jj;j++){
                    equal( c.data.raws[i][j],c.utils.trim(tr.getElementsByTagName('th')[j].textContent), "the th ("+i+","+j+") have been parsed and trimed" );
                }
            }
            if(tr.getElementsByTagName('td')){
                for(var j=0,jj=tr.getElementsByTagName('td').length;j<jj;j++){
                    equal( c.data.raws[i][j],c.utils.trim(tr.getElementsByTagName('td')[j].textContent), "the td ("+i+","+j+") have been parsed and trimed" );
                }
            }
        }
    });
    test("if we give an id, and the html table contains only one row", function() {
        
        var tableId='fixture1-data'
        var table=document.getElementById(tableId)
        
        var c = new Choopy({
            data:tableId,
            container:'container'
        })
        
        c.parse()
        equal( c.data.raws.length,table.getElementsByTagName('tr').length, "all the table's rows have been parsed" );
        for(var i=0,ii=table.getElementsByTagName('tr').length;i<ii;i++){
            var tr=table.getElementsByTagName('tr')[i]
            if(tr.getElementsByTagName('th')){
                for(var j=0,jj=tr.getElementsByTagName('th').length;j<jj;j++){
                    equal( c.data.raws[i][j],c.utils.trim(tr.getElementsByTagName('th')[j].textContent), "the th ("+i+","+j+") have been parsed and trimed" );
                }
            }
            if(tr.getElementsByTagName('td')){
                for(var j=0,jj=tr.getElementsByTagName('td').length;j<jj;j++){
                    equal( c.data.raws[i][j],c.utils.trim(tr.getElementsByTagName('td')[j].textContent), "the td ("+i+","+j+") have been parsed and trimed" );
                }
            }
        }
    });
    
    module('Choopy.transversalize()')
    
    test("if we transversalize a matrice (data.raws)", function() {
        
        var tableId='fixture-data'
        var table=document.getElementById(tableId)
        
        var c = new Choopy({
            data:tableId,
            container:'container'
        })
        
        c.parse()
        
        var oldRaws=c.data.raws
        
        c.transversalize()
        equal( c.data.raws[0][0],oldRaws[0][0], "0,0 shouldn't change" );
        equal( c.data.raws[1][0],oldRaws[0][1], "0,1 should become 1,0" );
        equal( c.data.raws[0][1],oldRaws[1][0], "0,1 should become 0,1" );
        equal( c.data.raws[1][1],oldRaws[1][1], "1,1 shouldn't change" );
        equal( c.data.raws[0].length,oldRaws.length, "raws are now columns" );
        equal( c.data.raws.length,oldRaws[0].length, "columns are now raws" );
        
    });
    
    module('Choopy.normalize()')
    
    test("if we normalize a matrice (data.raws)", function() {
        
        var tableId='fixture-data'
        
        var c = new Choopy({
            data:tableId,
            container:'container'
        })
        
        c.parse()
        c.normalize()
        
        var raws=c.data.raws
        
        
        equal( c.data.labels.x.length,raws[0].length-1, "data.lebels.x have the right length" );
        for(var i=1,ii=raws[0].length;i<ii;i++){
            equal(raws[0][i],c.data.labels.x[i-1], "the "+i+"th x label is good" );
        }
        
        
        equal( c.data.series.length,raws.length-1, "there is enough data.series" );
        
        for(var i=1,ii=raws.length;i<ii;i++){
            for(var j=0,jj=raws[i].length;j<jj;j++){
                if(j==0){
                    equal( raws[i][0],c.data.series[i-1].name, "the "+i+"th serie name is good" );
                }else{
                    equal( raws[i][j],c.data.series[i-1].data[j-1], "the "+j+"th value of the "+i+"th serie is good" );
                }
            }
        }
    });
    test("if we normalize a 1-row matrice (data.raws)", function() {
        
        var tableId='fixture1-data'
        
        var c = new Choopy({
            data:tableId,
            container:'container'
        })
        
        c.parse()
        c.normalize()
        
        var raws=c.data.raws
        
        
        equal( c.data.labels.x.length,raws[0].length-1, "data.lebels.x have the right length" );
        for(var i=0,ii=raws[0].length-1;i<ii;i++){
            equal(c.data.labels.x[i],i, "the "+i+"th x label is good" );
        }
        
        
        equal( c.data.series.length,raws.length, "there is enough data.series" );
        
        for(var i=0,ii=raws.length;i<ii;i++){
            for(var j=0,jj=raws[i].length;j<jj;j++){
                if(j==0){
                    equal( raws[i][0],c.data.series[i].name, "the "+i+"th serie name is good" );
                }else{
                    equal( raws[i][j],c.data.series[i].data[j-1], "the "+j+"th value of the "+i+"th serie is good" );
                }
            }
        }
        
    });
    
    module('Choopy.initDraw()')
    
    test("if we call initDraw()", function() {
        
        var tableId='fixture-data'
        var dataFirstSerie=[1,2,3,4,5,6]
        var options={
            data:[{
                name:'1st serie',
                data:dataFirstSerie
            }],
            container:'container',
            offset:{        
                top:0,
                right:0,
                bottom:0,
                left:0
            },
            gutter:{
                top:30,
                right:30,
                bottom:30,
                left:30
            }
        }
        var c = new Choopy(options)
        
        c.parse()
        c.initDraw()
        
//        //origin
//        this.draw.coord.origin.X=this.options.offset.left+this.options.gutter.left+.5
//        this.draw.coord.origin.Y=this.options.gutter.top
//    
//        //scaling
//        var maxValue=minValue=this.data.series[0].data[0],
//        minValue=maxValue;
//   
//        for(var i= 0; i < this.data.series.length; i++) {
//            for(var j= 0; j < this.data.series[i].data.length; j++) {
//                tmp=parseFloat(this.data.series[i].data[j])
//                if(tmp>maxValue){
//                    maxValue=tmp
//                }
//                if(tmp<minValue){
//                    minValue=tmp
//                }
//            
//            }
//        }
//    
//        var yMin=minValue,
//        yMax=maxValue,
//        yStep=(maxValue-minValue)/this.options.grid.range.y;
//    
//        //enlarge min & max values by one yStep to get bottom and top margin
//        yMin-=yStep;
//        yMax+=yStep;
//        yStep=(yMax-yMin)/this.options.grid.range.y;
//    
//        this.draw.coord.scale.y.minValue=yMin
//        this.draw.coord.scale.y.maxValue=yMax
//        this.draw.coord.scale.y.step=(this.options.height - this.options.gutter.top - this.options.gutter.bottom)/(yMax-yMin)
//        this.draw.coord.scale.x.step=(this.options.width-(this.options.offset.left+this.options.offset.right)-(this.options.gutter.left+this.options.gutter.right))/this.data.labels.x.length
        
        
        equal(c.draw.coord.origin.X,30.5, "origin.X is OK" );
        equal(c.draw.coord.origin.Y,30, "origin.Y is OK" );
        
    });

});



