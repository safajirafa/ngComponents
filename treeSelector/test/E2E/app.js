angular.module('Dashboard', ['com.ims.treeSelector'])

.controller('myViewCtrl', function ($scope) {

    $scope.alignment = {
        label: 'Alignment',
        icon: 'icon-chevron-sign-right',
        resourceUrl: '/services/alignments',
        itemArray: [],
        activeKey: '',
        activeTitle: 'Loading...'
    };

    // Geo selector
    $scope.geo = {
        label: 'Geo',
        icon: 'icon-map-marker',
        resourceUrl: '/services/geos',
        itemArray: [],
        activeKey: '',
        activeTitle: 'Loading...'
    };

    // Time period selector
    $scope.timePeriod = {
        label: 'Time Period',
        icon: 'icon-calendar-empty',
        resourceUrl: '/services/timePeriods',
        itemArray: [],
        activeKey: '',
        activeTitle: 'Loading...'
    };

    // metric selector
    $scope.metric = {
        label: 'Metric',
        icon: 'icon-tasks',
        resourceUrl: '/services/metrics',
        itemArray: [],
        activeKey: '',
        activeTitle: 'Loading...'
    };

});