Events = new Mongo.Collection("events");

Events.allow({
    insert: function (userId, event) {
        return isAdmin(userId) || userId && event.owner.id === userId;
    },
    update: function (userId, event, fields, modifier) {
        return isAdmin(userId) || userId && event.owner.id === userId;
    },
    remove: function (userId, event) {
        return isAdmin(userId) || userId && event.owner.id === userId;
    }
});

Meteor.startup(function () {

    /*if(Meteor.users.find({'emails.address':'entraide.community.developer@gmail.com'}).count()<=0){
        Accounts.createUser({
            email: "entraide.community.developer@gmail.com",
            username: "admin",
            password: "caca",
            profile: { roles:["admin"] },
            roles: ["admin"]
        });
    }*/

    Meteor.publish("all-events", function(){
        if(isAdmin(this.userId)){
            return Events.find({}, {sort: {name:1}});
        } else {
            this.stop();
            return;
        }
    });

    Meteor.publish("my-events", function(){
    	return Events.find({'owner.id' :  this.userId}, {sort: {name:1}});
    });

    Meteor.publish("search-events", function(options){
        console.log("search-events");
    	options.collectionOptions = options.collectionOptions ? options.collectionOptions : {'region.id' : 1};
    	options.sortLimitOptions = options.sortLimitOptions ? options.sortLimitOptions : {sort: {name:1}, limit:100};
    	var arrOptions = [{'owner.id': { $ne: this.userId }}];
    	arrOptions.push(options.collectionOptions);
    	return Events.find({$and: arrOptions}, options.sortLimitOptions);
    });


});


var isAdmin = function(userId){
    var user = Meteor.users.findOne({'_id':userId});
    if(user && user.profile && user.profile.roles && user.profile.roles.length>0){
        var isAdmin = false;
        for(var i=0; i< user.profile.roles.length; i++){
            if(user.profile.roles[i]==="admin"){
                isAdmin = true;
                break;
            }
        }
        return isAdmin;
    }
};