_.templateSettings.interpolate = /{([\s\S]+?)}/g;

function RepoMan(githubUsername) {
    this.username = githubUsername;

    this.init();
}

RepoMan.prototype.getUserInfo = function() {
    return $.get('https://api.github.com/users/' + this.username).then(function(data) {
        return data;
    });
};

RepoMan.prototype.getRepoInfo = function() {
    return $.get('https://api.github.com/users/' + this.username + '/repos').then(function(data) {
        return data;
    });
};

RepoMan.prototype.loadTemplateFile = function(templateName) {
    return $.get('./templates/' + templateName + '.html').then(function(htmlstring) {
        return htmlstring;
    });
};

/*
RepoMan.prototype.putNavDataOnPage = function(navHtml, nav) {
    var d = new Date(nav.created_at);
    nav.joined = ["Joined on ", d.toDateString()].join("");                      //Nav template
    document.querySelector('.navigation').innerHTML = _.template(navHtml, nav);
};     */

RepoMan.prototype.putProfileDataOnPage = function(profileHtml, profile) {
    var d = new Date(profile.created_at);
    profile.joined = ["Joined on ", d.toDateString()].join("");
    document.querySelector('.left-column').innerHTML = _.template(profileHtml, profile);
};

RepoMan.prototype.putRepoDataOnPage = function(repoHtml, repos) {
	console.log(repos);
    document.querySelector('.right-column').innerHTML =
        repos.sort(function(a, b) {
            var firstDate = new Date(a.updated_at),
                secondDate = new Date(b.updated_at);
            return +firstDate > +secondDate ? -1 : 1;
        }).map(function(obj) {
            var d = new Date(obj.updated_at);
            obj.updated = ["Updated on ", d.toDateString()].join("");
            return _.template(repoHtml, obj);
        }).join("");
};

RepoMan.prototype.init = function() {
    var self = this;
    // start doing shit...
    $.when(
        this.getUserInfo(),        // Add this.getNavInfo(),  ????????
        this.getRepoInfo(),
       // this.loadTemplateFile('nav'),
        this.loadTemplateFile('profile'),
        this.loadTemplateFile('repo')
    ).then(function(/*nav, */profile, repos, /*navHtml,*/ profileHtml, repoHtml) {
       // self.putNavDataOnPage(navHtml, nav)
        self.putProfileDataOnPage(profileHtml, profile);
        self.putRepoDataOnPage(repoHtml, repos);
    })
};

window.onload = app;

function app() {
    var myRepo = new RepoMan('mb289');
}