# /!\     Under heavy dev     /!\\ 


Boomgraph, a chart lib based on [Raphaeljs] (http://raphealjs.com)
================================================================

_Boomgraph is under heavy development and is initially developped for [Retentio](http://retent.io)._


Philosophy
-------------

Boomgraph is based on Raphael. Since Raphael is "just" to handle SVG easily, Boomgraph use a core object called Choopy.
Choopy is the common factor between each chart. It exposes primitives to parse data, draw plots/line/area/bar/grid, manage labels and so on.
Each chart provided by Boomgraph is on top of these primitives. They allow you to extend easily Boomgraph and create the chart you dream of!

Features
--------

* Line chart.
* Bar chart.
* Area chart.
* SparkLine.
* SparkBar.
* SparkArea.
* Choopy to create your graph easily.

Installation
------------
This project is under heavy development, you can fork or clone the repository.
If you want to use it right now (at your own risk), just take the source :-)


Roadmap
-------

Improve unit tests (refacto and upgrade coverage), add pie charts, increase customization, better management of Y-scale

Example
-------

Check the [project page](http://retentio.github.com/Boomgraph/)

How to run unit tests
---------------------

Boomgraph is unit tested with [QUnit](http://docs.jquery.com/QUnit).

To run the complete test suite, open /test/index.html in a browser.
