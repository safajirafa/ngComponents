Tree selector (alpha)
===

> AngularJS component that supports multi-level lists and single item selection

```JavaScript
// Inject it in your angular module
angular.module('myAwesomeApp', ['com.ims.treeSelector']);
```

```html
<!-- Add the directive to your html -->
<div tree-selector context="FOO" config="myConfigObj"></div>
```

```JavaScript
// Add a configuration object to the controller
$scope.myConfigObj = {
  label: 'Alignment',
  icon: 'icon-chevron-sign-right',
  resourceUrl: '/services/alignments',
  itemArray: [],
  activeKey: '',
  activeTitle: 'Loading...'
};
```


