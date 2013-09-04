/**
 * @module: IMS Tree selector
*/
/* global angular */
var IMSTreeSelector = angular.module('com.ims.treeSelector', []);

// inject templates
IMSTreeSelector.run(function ($templateCache) {

	// TODO: minify html escaping single quotes
	$templateCache.put('treeSelector.tmpl.html', '<span><label>{{config.label}}</label> <br /> <button class="btn btn-primary" ng-class="{false: &#39;disabled&#39;}[config.enabled]" ng-click="togglePopover()"> <i class="{{config.icon}}"></i> <span>&nbsp;{{config.activeTitle}}&nbsp;</span> <i class="icon-caret-down"></i> </button> <div class="popover-container" ng-show="displayPopover == true" tabindex="-1"> <ul class="list-unstyled"> <li ng-repeat="item in config.itemArray" ng-include="&#39;item.tmpl.html&#39;"></li> </ul> </div></span>');

	// TODO: minify html escaping single quotes
	$templateCache.put('item.tmpl.html', '<span ng-show="item.children.length > 0"><i class="node-toggler icon-expand"></i></span><label class="radio-inline"><input type="radio" value="{{item.key}}" name="{{config.label}}" data-alignment="{{item.metadata.alignment}}"/><span>{{item.title}}</span></label><ul ng-repeat="item in item.children" ng-include="&#39;item.tmpl.html&#39;"></ul>');

});