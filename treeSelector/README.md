Tree selector (alpha)
===

> AngularJS component that supports multi-level lists and single item selection

Dependencies
===
* jQuery
* AngularJS
* Bootstrap
* Font-awesome

Inject it in your angular module

```JavaScript
angular.module('myAwesomeApp', ['com.ims.treeSelector']);
```

Add the directive in your html
```html
<div tree-selector context="FOO" config="myConfigObj"></div>
```

Add a configuration object to the controller
```JavaScript
$scope.myConfigObj = {
  label: 'Alignment',
  icon: 'icon-chevron-sign-right',
  resourceUrl: '/services/alignments',
  itemArray: [],
  activeKey: '',
  activeTitle: 'Loading...'
};
```


