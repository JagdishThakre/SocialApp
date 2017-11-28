angular.module('starter.services', ['ngStorage'])
/**Store session or destroy */
.service('sessionService', ['$localStorage', function ($localStorage) {
    
    this.get = function (name) {
        return getItem(name);
    };
    /**Storing user login session */
    this.User = function(response) {
        $localStorage.User = response.data;
        localStorage.setItem("UserId", response.data.id);
    }

    return this;
}])

/**Toast message service*/
.service("toastService", ['$cordovaToast', function($cordovaToast) {
    this.showToast = function(msg) {
        $cordovaToast.showLongBottom(msg).then(function(success) {
            // success
        }, function (error) {
            // error
        });
    }
    return this;
}])

// the service that retrieves some movie title from an url
app.factory('UserRetriever', function($http, $q, $timeout){
    var UserRetriever = new Object();
  
    UserRetriever.getusers = function(i) {
      var userdata = $q.defer();
      var users;
  
      var someusers = ["The Wolverine", "The Smurfs 2", "The Mortal Instruments: City of Bones", "Drinking Buddies", "All the Boys Love Mandy Lane", "The Act Of Killing", "Red 2", "Jobs", "Getaway", "Red Obsession", "2 Guns", "The World's End", "Planes", "Paranoia", "The To Do List", "Man of Steel"];
  
      var moreusers = ["The Wolverine", "The Smurfs 2", "The Mortal Instruments: City of Bones", "Drinking Buddies", "All the Boys Love Mandy Lane", "The Act Of Killing", "Red 2", "Jobs", "Getaway", "Red Obsession", "2 Guns", "The World's End", "Planes", "Paranoia", "The To Do List", "Man of Steel", "The Way Way Back", "Before Midnight", "Only God Forgives", "I Give It a Year", "The Heat", "Pacific Rim", "Pacific Rim", "Kevin Hart: Let Me Explain", "A Hijacking", "Maniac", "After Earth", "The Purge", "Much Ado About Nothing", "Europa Report", "Stuck in Love", "We Steal Secrets: The Story Of Wikileaks", "The Croods", "This Is the End", "The Frozen Ground", "Turbo", "Blackfish", "Frances Ha", "Prince Avalanche", "The Attack", "Grown Ups 2", "White House Down", "Lovelace", "Girl Most Likely", "Parkland", "Passion", "Monsters University", "R.I.P.D.", "Byzantium", "The Conjuring", "The Internship"]
  
      if(i && i.indexOf('T')!=-1)
        users=moreusers;
      else
        users=moreusers;
   
      $timeout(function(){
        userdata.resolve(users);
      },1000);
  
      return userdata.promise
    }
  
    return UserRetriever;
  });