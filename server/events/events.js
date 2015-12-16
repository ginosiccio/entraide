Events = new Mongo.Collection("events");

Events.allow({
    insert: function (userId, event) {
        var msg = 'failed';
        if(isAdmin(userId)){return true;}
        if(event.location && event.location.longitude && event.location.latitude && !isNaN(parseFloat(event.location.longitude)) !isNaN(parseFloat(event.location.latitude)) && !isNaN(parseInt(event.startDate)) ){
           if(event.owner.id !== userId){
               msg = 'HACKING failed';
           } else {
               return true
           }
        }
        console.log('Event Allow insert '+msg+' [user:'+userId+']: ' + event);
        return false;
    },
    update: function (userId, event, fields, modifier) {
        return isAdmin(userId) || event.owner.id === userId;
    },
    remove: function (userId, event) {
        return isAdmin(userId) || event.owner.id === userId;
    }
});

Events.deny({
    update: function (userId, event, fields, modifier) {
        return !isAdmin(userId);
    }
});


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
    options.collectionOptions = options.collectionOptions ? options.collectionOptions : {'department.code' : "74"};
    options.sortLimitOptions = options.sortLimitOptions ? options.sortLimitOptions : {sort: {name:1}, limit:100};
    var arrOptions = [{'owner.id': { $ne: this.userId }}];
    arrOptions.push(options.collectionOptions);
    return Events.find({$and: arrOptions}, options.sortLimitOptions);
});





EventSkills = new Mongo.Collection("event_skills");

EventSkills.allow({
    insert: function (userId, eventSkill) {
       return isAdmin(userId) || skill.owner.id === userId;
    },
    update: function (userId, eventSkill, fields, modifier) {
        return isAdmin(userId) || skill.owner.id === userId;
    },
    remove: function (userId, eventSkill) {
        return isAdmin(userId) || skill.owner.id === userId;
    }
});

EventSkills.deny({
    update: function (userId, skill, fields, modifier) {
        var category = Categories.find({code:skill.category.code})[0];
        var event = Events.find({_id:skill.event.id})[0];
        return skill.owner.id !== userId || _.difference(fields, ['level']).length > 0 || !category || !event;
    }
});

Meteor.publish("event-skills", function(options){
    if(options && options.collectionOptions && options.collectionOptions.event && options.collectionOptions.event.id){
        options.sortLimitOptions = options.sortLimitOptions ? options.sortLimitOptions : {sort: {name:1}, limit:1};
        var arrOptions = [{'owner.id': this.userId }];
        arrOptions.push(options.collectionOptions);
        return EventSkills.find({$and: arrOptions}, options.sortLimitOptions);
    } else {
        this.stop();
        return;
    }
});

