var app = angular.module("myApp",[]);

var messages = [
    {"id":1,"from":"Gary Lewis","fromAddress":"test@testdomain.com","subject":"Posting on board","dtSent":"Today, 9:18AM","read":false,"body":"Hey Mark,<br><br>I saw your post on the message board and I was wondering if you still had that item available. Can you call me if you still do?<br><br>Thanks,<br><b>Gary Lewis</b>"},
    {"id":2,"from":"Bob Sutton","fromAddress":"test@testdomain.com","subject":"In Late Today","dtSent":"Today, 8:54AM","read":false,"body":"Mark,<br>I will be in late today due to an appt.<br>v/r Bob","attachment":true},
    {"id":3,"from":"Will Adivo","fromAddress":"test@testdomain.com","subject":"New developer","dtSent":"Yesterday, 4:48PM","read":true,"body":"The message body goes here..."},
    {"id":4,"from":"Al Kowalski","fromAddress":"test@testdomain.com","subject":"RE: New developer","dtSent":"Yesterday, 4:40PM","read":false,"body":"The message body goes here...","priority":1},
    {"id":4,"from":"Beth Maloney","fromAddress":"test@testdomain.com","subject":"July Reports","dtSent":"3 Days Ago","read":true,"body":"PYC Staff-<br> Our weekly meeting is canceled due to the holiday. Please review and submit your PID report before next week's meeting.<br>Thanks,<br>Beth"},
    {"id":6,"from":"Jason Furgano","fromAddress":"test@testdomain.com","subject":"New developer","dtSent":"3 Days Ago","read":true,"body":"All,<br>I'd like to introduce Joe Canfigliata our new S/W developer. If you see him in the office introduce yourself and make him feel welcome."},
    {"id":7,"from":"Bob Sutton","fromAddress":"test@testdomain.com","subject":"Tasking request","dtSent":"3 Days Ago","read":true,"body":"Ovi lipsu doir. The message body goes here..."},
    {"id":8,"from":"Will Adivo","fromAddress":"test@testdomain.com","subject":"Proposal for Avid Consulting","dtSent":"3 Days Ago","read":true,"body":"Mark, I reviewed your proposal with Beth and we have a few questions. Let me know when you time to meet."},
    {"id":9,"from":"Philip Corrigan","fromAddress":"test@testdomain.com","subject":"Follow-up Appt.","dtSent":"4 Days Ago","read":true,"body":"Hi,<br>Can you please confirm the expense report I submitted for my last trip to SD?<br>Thanks,<br>Tom Grey"},
    {"id":10,"from":"Will Adivo","fromAddress":"test@testdomain.com","subject":"FWD: Subject","dtSent":"4 Days Ago","read":true,"body":"The message body goes here dapibus nec velit egdiet tempu...","priority":1},
    {"id":11,"from":"Will Adivo","fromAddress":"test@testdomain.com","subject":"Subject","dtSent":"Last Week","read":true,"body":"The message body goes here... <br>Regards,Fagan"},
    {"id":12,"from":"Parker Dunlap","fromAddress":"test@testdomain.com","subject":"Subject","dtSent":"Aug 14 5:09PM","read":true,"body":"Hello,<br>The message body goes here...","attachment":true},
    {"id":13,"from":"Hannah Marks","fromAddress":"test@testdomain.com","subject":"Subject","dtSent":"Aug 14 4:18PM","read":true,"body":"Dear Mark,<br>We've missed you at the shop. How are you and the fam? Let's get together soon.<br> - James"},
    {"id":14,"from":"Parker Dunlap","fromAddress":"test@testdomain.com","subject":"Subject","dtSent":"Aug 14 5:09PM","read":true,"body":"The message body goes here...","attachment":true},
    {"id":15,"from":"Hannah Marks","fromAddress":"hmarks@testdomain.com","subject":"Subject","dtSent":"Aug 14 4:18PM","read":true,"body":"The message body goes here..."},
    {"id":16,"from":"Parker Dunlap","fromAddress":"parker@testdomain.com","subject":"Subject","dtSent":"Aug 14 5:09PM","read":true,"body":"The message body goes here...","attachment":true},
    {"id":17,"from":"Amy Davis","fromAddress":"amy@testdomain.com","subject":"Subject","dtSent":"Aug 14 4:18PM","read":true,"body":"The message body goes here..."}
];


app.controller('inboxCtrl', ['$scope', '$filter', function ($scope, $filter) {

 	$scope.date = new Date();
    $scope.sortingOrder = 'id';
    $scope.pageSizes = [10,20,50,100];
    $scope.reverse = false;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;

    /* inbox functions -------------------------------------- */

    // get data and init the filtered items
    $scope.init = function () {

       $scope.items = messages;
       $scope.search();

    }

    var searchMatch = function (haystack, needle) {
        if (!needle) {
          return true;
        }
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };

    // filter the items
    $scope.search = function () {
        $scope.filteredItems = $filter('filter')($scope.items, function (item) {
          for(var attr in item) {
            if (searchMatch(item[attr], $scope.query))
              return true;
          }
          return false;
        });
        $scope.currentPage = 0;
        // now group by pages
        $scope.groupToPages();
    };

    // calculate page in place
    $scope.groupToPages = function () {
        $scope.selected = null;
        $scope.pagedItems = [];

        for (var i = 0; i < $scope.filteredItems.length; i++) {
          if (i % $scope.itemsPerPage === 0) {
            $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
          } else {
            $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
          }
        }
    };

    $scope.range = function (start, end) {
        var ret = [];
        if (!end) {
          end = start;
          start = 0;
        }
        for (var i = start; i < end; i++) {
          ret.push(i);
        }
        return ret;
    };

    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
        return false;
    };

    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
        return false;
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    $scope.deleteItem = function (idx) {
        var itemToDelete = $scope.pagedItems[$scope.currentPage][idx];
        var idxInItems = $scope.items.indexOf(itemToDelete);
        $scope.items.splice(idxInItems,1);
        $scope.search();

        return false;
    };

    $scope.isMessageSelected = function () {
        if (typeof $scope.selected!=="undefined" && $scope.selected!==null) {
            return true;
        }
        else {
            return false;
        }
    };

    $scope.readMessage = function (idx) {
        $scope.items[idx].read = true;
        $scope.selected = $scope.items[idx];
    };

    $scope.readAll = function () {
        for (var i in $scope.items) {
            $scope.items[i].read = true;
        }
    };

    $scope.closeMessage = function () {
        $scope.selected = null;
    };

    $scope.renderMessageBody = function(html)
    {
        return html;
    };
    /* end inbox functions ---------------------------------- */

    // initialize
    $scope.init();

}])// end inboxCtrl
.controller('messageCtrl', ['$scope', function ($scope) {
    $scope.message = function(idx) {
        return messages(idx);
    };
}]);// end messageCtrl
